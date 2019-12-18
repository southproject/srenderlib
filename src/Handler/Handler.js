import * as util from '../util/core/util';
import * as vec2 from '../util/core/vector';
import Draggable from '../Element/mixin/Draggable';
import Click from '../Element/mixin/Click';
import IText from '../Element/mixin/IText';
import BlockClear from '../Element/mixin/BlockClear';
import Eventful from '../Element/mixin/Eventful';
import * as eventTool from '../util/core/event';
import Rect from '../Element/graphic/shape/Rect'
import Circle from '../Element/graphic/shape/Circle'
var SILENT = 'silent';

function makeEventPacket(eveType, targetInfo, event) {
    return {
        type: eveType,
        event: event,
        // target can only be an element that is not silent.
        target: targetInfo.target,
        // topTarget can be a silent element.
        topTarget: targetInfo.topTarget,
        cancelBubble: false,
        offsetX: event.zrX,
        offsetY: event.zrY,
        gestureEvent: event.gestureEvent,
        pinchX: event.pinchX,
        pinchY: event.pinchY,
        pinchScale: event.pinchScale,
        wheelDelta: event.zrDelta,
        zrByTouch: event.zrByTouch,
        which: event.which,
        stop: stopEvent
    };
}

function stopEvent(event) {
    eventTool.stop(this.event);
}

function EmptyProxy () {}
EmptyProxy.prototype.dispose = function () {};

var handlerNames = [
    'click', 'dblclick', 'mousewheel', 'mouseout',
    'mouseup', 'mousedown', 'mousemove', 'contextmenu'
];6
/**
 * @alias module:zrender/Handler
 * @constructor
 * @extends module:zrender/mixin/Eventful
 * @param {module:zrender/Storage} storage Storage instance.
 * @param {module:zrender/Painter} painter Painter instance.
 * @param {module:zrender/dom/HandlerProxy} proxy HandlerProxy instance.
 * @param {HTMLElement} painterRoot painter.root (not painter.getViewportRoot()).
 */
var Handler = function(storage, painter, proxy, painterRoot) {
    Eventful.call(this);

    this.storage = storage;

    this.painter = painter;

    this.painterRoot = painterRoot;

    proxy = proxy || new EmptyProxy();

    /**
     * Proxy of event. can be Dom, WebGLSurface, etc.
     */
    this.proxy = null;

    /**
     * {target, topTarget, x, y}
     * @private
     * @type {Object}
     */
    this._hovered = {};

    this._select = null;

    this._preSelect = null;

    this._globalDrag = true;//Promise all element draggable
    /**
     * @private
     * @type {Date}
     */
    this._lastTouchMoment;

    /**
     * @private
     * @type {number}
     */
    this._lastX;

    /**
     * @private
     * @type {number}
     */
    this._lastY;
    this.__visionRect = null;
    this.__rotateCircle = null;
    this.__scaleCircle1 = null;
    this.__scaleCircle2 = null;
    this.__scaleCircle3 = null;
    this.__scaleCircle4 = null;

    Draggable.call(this);

    Click.call(this);

    IText.call(this);

    BlockClear.call(this);

    this.setHandlerProxy(proxy);
};

Handler.prototype = {

    constructor: Handler,
    //self define
    drawVisionRect: function(target){
        if(target){
            var param = target.getVisionBoundingRect()
            var m = target.transform;
            if (!m) {
                m = target.transform = [1, 0, 0, 1, 0, 0];
            }
            if(!target.originWidth){
                //console.log(target,param);
                //console.log(m[0],m[3]);
                target.originWidth = param.width/m[0];
                target.originHeight = param.height/m[3];
                //console.log(target.originWidth,target.originHeight);
            }
            target.__zr.showProperty&&(typeof target.__zr.showProperty === 'function')&&target.__zr.showProperty(target.type)
            //console.log("bounding:",param)

            if(this.__visionRect) this.storage.delRoot(this.__visionRect);
            if(this.__rotateCircle) this.storage.delRoot(this.__rotateCircle);
            if(this.__scaleCircle3){
                //this.storage.delRoot(this.__scaleCircle1);
                //this.storage.delRoot(this.__scaleCircle2);
                this.storage.delRoot(this.__scaleCircle3);
                //this.storage.delRoot(this.__scaleCircle4);
            }

            this.__visionRect = new Rect({shape: param, style: {stroke: '#ccc',fill: 'none', lineDash: [5, 5, 10, 10]}})
            this.__visionRect.draggable = false
            this.__scaleCircle1 = new Circle({shape: {cx: param.x, cy: param.y,r: 6},style: {fill:'#1DA57A',stroke:null}})
            this.__scaleCircle2 = new Circle({shape: {cx: param.x+param.width, cy: param.y,r: 6},style: {fill:'#1DA57A',stroke:null}})
            this.__scaleCircle3 = new Circle({shape: {cx: param.x+param.width, cy: param.y+param.height,r: 6},style: {fill:'#1DA57A',stroke:null}})
            this.__scaleCircle4 = new Circle({shape: {cx: param.x, cy: param.y+param.height,r: 6},style: {fill:'#1DA57A',stroke:null}})
            this.__rotateCircle = new Circle({shape: {cx: param.x+param.width/2, cy: param.y,r: 6},style: {fill:'#1DA57A',stroke:null}})

            // this.__visionRect.origin = util.deepClone(target.origin)
            // this.__visionRect.scale = util.deepClone(target.scale)
            // this.__visionRect.position = util.deepClone(target.position)
            // this.__visionRect.rotation  = util.deepClone(target.rotation)

            if(!target.originIndex){
                var pa = target.getBoundingRect()
                target.originIndex={
                    index1: [pa.x,pa.y],
                    index2: [pa.x+pa.width,pa.y],
                    index3: [pa.x+pa.width,pa.y+pa.height],
                    index4: [pa.x,pa.y+pa.height]
                }
            }
            //绑定target
            this.__visionRect.target = this.__rotateCircle.target = target
            this.__scaleCircle1.target = this.__scaleCircle2.target = this.__scaleCircle3.target = this.__scaleCircle4.target = target

            //指定type
            this.__scaleCircle1.type = this.__scaleCircle2.type = this.__scaleCircle3.type = this.__scaleCircle4.type = 'scale'
            //this.__visionRect.type = 'vision'
            this.__rotateCircle.type = 'rotate'

            //指定index
            this.__scaleCircle1.index = 1
            this.__scaleCircle2.index = 2
            this.__scaleCircle3.index = 3
            this.__scaleCircle4.index = 4

            //加入storge存储
            this.storage.addRoot(this.__visionRect)
            this.storage.addRoot(this.__rotateCircle)
            //this.storage.addRoot(this.__scaleCircle1)
            //this.storage.addRoot(this.__scaleCircle2)
            this.storage.addRoot(this.__scaleCircle3)
            //this.storage.addRoot(this.__scaleCircle4)
   
            // let trans_m = util.deepClone(m);
            // console.log(trans_m);
            // console.log(this.__visionRect);
            // this.__visionRect.transform = trans_m;
            // this.__visionRect.decomposeTransform()
            // //this.__visionRect.applyTransform(trans_m);
            // console.log(this.__visionRect);
        }
    },
    setHandlerProxy: function (proxy) {
        if (this.proxy) {
            this.proxy.dispose();
        }

        if (proxy) {
            util.each(handlerNames, function (name) {
                proxy.on && proxy.on(name, this[name], this);//此处传递的this指向Handler实例，使得加入到proxy的_$handlers的事件函数ctx为Handler实例
            }, this);
            // Attach handler
            proxy.handler = this;
        }
        this.proxy = proxy;
    },

    mousemove: function (event) {
        var x = event.zrX;
        var y = event.zrY;

        var lastHovered = this._hovered;
        var lastHoveredTarget = lastHovered.target;

        // If lastHoveredTarget is removed from zr (detected by '__zr') by some API call
        // (like 'setOption' or 'dispatchAction') in event handlers, we should find
        // lastHovered again here. Otherwise 'mouseout' can not be triggered normally.
        // See #6198.
        if (lastHoveredTarget && !lastHoveredTarget.__zr) {
            lastHovered = this.findHover(lastHovered.x, lastHovered.y);
            lastHoveredTarget = lastHovered.target;
        }

        var hovered = this._hovered = this.findHover(x, y);
        var hoveredTarget = hovered.target;

        var proxy = this.proxy;
        proxy.setCursor && proxy.setCursor(hoveredTarget ? hoveredTarget.cursor : 'default');

        // Mouse out on previous hovered element
        if (lastHoveredTarget && hoveredTarget !== lastHoveredTarget) {
            this.dispatchToElement(lastHovered, 'mouseout', event);
        }

        // Mouse moving on one element
        this.dispatchToElement(hovered, 'mousemove', event);

        // Mouse over on a new element
        if (hoveredTarget && hoveredTarget !== lastHoveredTarget) {
            this.dispatchToElement(hovered, 'mouseover', event);
        }
    },

    mouseout: function (event) {
        this.dispatchToElement(this._hovered, 'mouseout', event);

        // There might be some doms created by upper layer application
        // at the same level of painter.getViewportRoot() (e.g., tooltip
        // dom created by echarts), where 'globalout' event should not
        // be triggered when mouse enters these doms. (But 'mouseout'
        // should be triggered at the original hovered element as usual).
        var element = event.toElement || event.relatedTarget;
        var innerDom;
        do {
            element = element && element.parentNode;
        }
        while (element && element.nodeType != 9 && !(
            innerDom = element === this.painterRoot
        ));

        !innerDom && this.trigger('globalout', {event: event});
    },

    /**
     * Resize
     */
    resize: function (event) {
        this._hovered = {};
    },

    /**
     * Dispatch event
     * @param {string} eventName
     * @param {event=} eventArgs
     */
    dispatch: function (eventName, eventArgs) {
        var handler = this[eventName];
        handler && handler.call(this, eventArgs);
    },

    /**
     * Dispose
     */
    dispose: function () {

        this.proxy.dispose();

        this.storage =
        this.proxy =
        this.painter = null;
    },

    /**
     * 设置默认的cursor style
     * @param {string} [cursorStyle='default'] 例如 crosshair
     */
    setCursorStyle: function (cursorStyle) {
        var proxy = this.proxy;
        proxy.setCursor && proxy.setCursor(cursorStyle);
    },

    /**
     * 事件分发代理
     *
     * @private
     * @param {Object} targetInfo {target, topTarget} 目标图形元素
     * @param {string} eventName 事件名称
     * @param {Object} event 事件对象
     */
    dispatchToElement: function (targetInfo, eventName, event) {//targetInfo，坐标或者元素
        targetInfo = targetInfo || {};
        var el = targetInfo.target;
        if (el && el.silent) {
            return;
        }
        var eventHandler = 'on' + eventName;
        var eventPacket = makeEventPacket(eventName, targetInfo, event);

        while (el) {
            el[eventHandler]
                && (eventPacket.cancelBubble = el[eventHandler].call(el, eventPacket));

            el.trigger(eventName, eventPacket);

            el = el.parent;

            if (eventPacket.cancelBubble) {
                break;
            }
        }

        if (!eventPacket.cancelBubble) {
            // 冒泡到顶级 srender 对象
            this.trigger(eventName, eventPacket);  //handler实例，这时候自然在Handler的_$handlers中查找事件，即通过Handler.on(注册的)
            // 分发事件到用户自定义层
            // 用户有可能在全局 click 事件中 dispose，所以需要判断下 painter 是否存在
            this.painter && this.painter.eachOtherLayer(function (layer) {
                if (typeof(layer[eventHandler]) == 'function') {
                    layer[eventHandler].call(layer, eventPacket);
                }
                if (layer.trigger) {
                    layer.trigger(eventName, eventPacket);
                }
            });
        }
    },

    /**
     * @private
     * @param {number} x
     * @param {number} y
     * @param {module:zrender/graphic/Displayable} exclude
     * @return {model:zrender/Element}
     * @method
     */
    findHover: function(x, y, exclude) {
        var list = this.storage.getDisplayList();
        var out = {x: x, y: y};

        for (var i = list.length - 1; i >= 0 ; i--) {
            var hoverCheckResult;
            if (list[i] !== exclude
                // getDisplayList may include ignored item in VML mode
                && !list[i].ignore
                && (hoverCheckResult = isHover(list[i], x, y))
            ) {
                !out.topTarget && (out.topTarget = list[i]);
                if (hoverCheckResult !== SILENT) {
                    out.target = list[i];
                    break;
                }
            }
        }
        return out;
    }
};

// Common handlers
util.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
    Handler.prototype[name] = function (event) {
        // Find hover again to avoid click event is dispatched manually. Or click is triggered without mouseover
        var hovered = this.findHover(event.zrX, event.zrY);   //储存在proxy._$handlers中的this
        var hoveredTarget = hovered.target;
     //   console.log(hovered)
        if (name === 'mousedown') {
            this._downEl = hoveredTarget;
            this._downPoint = [event.zrX, event.zrY];
            // In case click triggered before mouseup
            this._upEl = hoveredTarget;
            /***
            if(typeof this._lastTarget!==undefined){//若选择的图形和上次一样，则不用清除高亮；否则不管选没选中都清除高亮
                if(hoveredTarget!==this._lastTarget){//recover
                    this._lastTarget.attr({style:{stroke:'rgb(255,111,11)'}})
                }
            }
            hoveredTarget.attr({style:{stroke:'#bbb'}})  //setStyle
            **/
        //    this._lastColor=hoveredTarget.style.fill!=='transparent'?

        //    this._lastTarget=hoveredTarget//
            /* */
        }
        else if (name === 'mouseup') {
            this._upEl = hoveredTarget;
        }
        else if (name === 'click') {
            if (this._downEl !== this._upEl
                // Original click event is triggered on the whole canvas element,
                // including the case that `mousedown` - `mousemove` - `mouseup`,
                // which should be filtered, otherwise it will bring trouble to
                // pan and zoom.
                || !this._downPoint
                // Arbitrary value
                || vec2.dist(this._downPoint, [event.zrX, event.zrY]) > 4
            ) {
                return;
            }
            this._downPoint = null;
        }

        this.dispatchToElement(hovered, name, event);
    };
});

function isHover(displayable, x, y) {
    if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
        var el = displayable;
        var isSilent;
        while (el) {
            // If clipped by ancestor.
            // FIXME: If clipPath has neither stroke nor fill,
            // el.clipPath.contain(x, y) will always return false.
            if (el.clipPath && el.clipPath.contain(x, y))  {
                return false;
            }
            if (el.silent) {
                isSilent = true;
            }
            el = el.parent;
        }
        return isSilent ? SILENT : true;
        
    }

    return false;
}

util.mixin(Handler, Eventful);
util.mixin(Handler, Draggable);
util.mixin(Handler, Click);
util.mixin(Handler, IText);
util.mixin(Handler, BlockClear);


export default Handler;
