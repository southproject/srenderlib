import guid from '../util/core/guid';
import Eventful from './mixin/Eventful';
import Transformable from './mixin/Transformable';
import Animatable from './mixin/Animatable';
import * as zrUtil from '../util/core/util';

/**
 * @alias module:srender/Element
 * @constructor
 * @extends {module:srender/mixin/Animatable}
 * @extends {module:srender/mixin/Transformable}
 * @extends {module:srender/mixin/Eventful}
 */
var Element = function (opts) { // jshint ignore:line

    Transformable.call(this, opts);
    Eventful.call(this, opts);
    Animatable.call(this, opts);

    /**
     * 画布元素ID
     * @type {string}
     */
    this.id = guid()//||opts.id;  // 反过来
    this._preTransform = [];
    this._x = opts.shape&&opts.shape.x || null;
    this._y = opts.shape&&opts.shape.y || null;
};

Element.prototype = {

    /**
     * 元素类型
     * Element type
     * @type {string}
     */
    type: 'element',

    /**
     * 元素名字
     * Element name
     * @type {string}
     */
    name: '',

    /**
     * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
     * ZRender instance will be assigned when element is associated with zrender
     * @name module:/zrender/Element#__zr
     * @type {module:zrender/ZRender}
     */
    __zr: null,

    /**
     * 图形是否忽略，为true时忽略图形的绘制以及事件触发
     * If ignore drawing and events of the element object
     * @name module:/zrender/Element#ignore
     * @type {boolean}
     * @default false
     */
    ignore: false,

    /**
     * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
     * 该路径会继承被裁减对象的变换
     * @type {module:zrender/graphic/Path}
     * @see http://www.w3.org/TR/2dcontext/#clipping-region
     * @readOnly
     */
    clipPath: null,

    /**
     * 是否是 Group
     * @type {boolean}
     */
    isGroup: false,

    /**
     * Drift element
     * @param  {number} dx dx on the global space
     * @param  {number} dy dy on the global space
     */
    saveTransform:true,

    drift: function (dx, dy) {
        switch (this.draggable) {
            case 'horizontal':
                dy = 0;
                break;
            case 'vertical':
                dx = 0;
                break;
        }
        if(this.type === "video"){
            this.attr("style",{x:this.showStyle.x + dx,y:this.showStyle.y + dy})
        }
        var m = this.transform;
        if (!m) {
            m = this.transform = [1, 0, 0, 1, 0, 0];
        }
        m[4] += dx;
        m[5] += dy;
        if(this.style._x){
            this.style._x +=dx;
            this.style._y +=dy;
        }//针对文字的定位
        
      //  console.log("drift:",[ m[4], m[5]])
        if(this.saveTransform){
        //初次drift时候，其他地方无法拿到不存在的transform，所以这个坐标和真实开始的位置有细小的差异。
            this._preTransform = [...this.transform]
            this.saveTransform = false;
          //  console.log(this._preTransform)
        }
            
        this.pipe({type:"attr",
            tag:"position",
            el:{id:this.id,position:[ m[4],m[5]]}
        })  //是否要为主动和被动的位移分别设置函数
        this.decomposeTransform();
        this.dirty(false);
    },

    /**
     * Hook before update
     */
    beforeUpdate: function () {},
    /**
     * Hook after update
     */
    afterUpdate: function () {},
    /**
     * Update each frame
     */
    update: function () {
        this.updateTransform();
    },

    /**
     * @param  {Function} cb
     * @param  {}   context
     */
    traverse: function (cb, context) {},

    /**
     * @protected
     */
    attrKV: function (key, value, mode=false,stack=true) {
        if (key === 'position' || key === 'scale' || key === 'origin'||key === 'rotation') {//
            // Copy the array
            if (value) {
                var target = this[key];
               /* if(stack){
                    this._preTransform = [...this.transform];
                //   this._stackDelay = true;//position的设定最是转换到transform上的，到那时可入栈
                   this.__zr.objectList.stack.add(new Action("transform",this,this._preTransform))
              
               } */
                if (!target) {
                    target = this[key] = [];
                }
                target[0] = value[0];
                target[1] = value[1];
                
            }
        }
        else {
            this[key] = value;
        }
    },

    /**
     * Hide the element
     */
    hide: function () {
        this.ignore = true;
        this.__zr && this.__zr.refresh();
    },

    /**
     * Show the element
     */
    show: function () {
        this.ignore = false;
        this.__zr && this.__zr.refresh();
    },

    /**
     * @param {string|Object} key
     * @param {*} value
     */
    attr: function (key, value, isObserver,stack=true,isUserText=false) {
        var mode = isObserver || false        //默认是发送者
        if (typeof key === 'string') {
            this.attrKV(key, value ,mode,stack,isUserText);
        }
        else if (zrUtil.isObject(key)) {
            for (var name in key) {
                if (key.hasOwnProperty(name)) {
                   
                    this.attrKV(name, key[name],mode,stack,isUserText);
                }
            }
        }
        this.dirty(false);
        
        return this;
    },

    /**
     * @param {module:zrender/graphic/Path} clipPath
     */
    setClipPath: function (clipPath) {
        var zr = this.__zr;
        if (zr) {
            clipPath.addSelfToZr(zr);
        }

        // Remove previous clip path
        if (this.clipPath && this.clipPath !== clipPath) {
            this.removeClipPath();
        }

        this.clipPath = clipPath;
        clipPath.__zr = zr;
        clipPath.__clipTarget = this;

        this.dirty(false);
    },

    /**
     */
    removeClipPath: function () {
        var clipPath = this.clipPath;
        if (clipPath) {
            if (clipPath.__zr) {
                clipPath.removeSelfFromZr(clipPath.__zr);
            }

            clipPath.__zr = null;
            clipPath.__clipTarget = null;
            this.clipPath = null;

            this.dirty(false);
        }
    },

    /**
     * Add self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {module:zrender/ZRender} zr//sr
     */
    addSelfToZr: function (zr) {

        this.__zr = zr;

        // 添加动画
        var animators = this.animators;
        if (animators) {
            for (var i = 0; i < animators.length; i++) {
                zr.animation.addAnimator(animators[i]);
            }
        }

        if (this.clipPath) {
            this.clipPath.addSelfToZr(zr);
        }
       
    },

    /**
     * Remove self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {module:zrender/ZRender} zr
     */
    removeSelfFromZr: function (zr) {
        this.__zr = null;
        // 移除动画
        var animators = this.animators;
        if (animators) {
            for (var i = 0; i < animators.length; i++) {
                zr.animation.removeAnimator(animators[i]);
            }
        }

        if (this.clipPath) {
            this.clipPath.removeSelfFromZr(zr);
        }
    }
};

zrUtil.mixin(Element, Animatable);
zrUtil.mixin(Element, Transformable);
zrUtil.mixin(Element, Eventful);

export default Element;