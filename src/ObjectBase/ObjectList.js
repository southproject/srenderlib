import guid from '../util/core/guid';
import * as Cst from '../util/export'; //constructor of shape
import Element from '../Element/Element'
import Group from '../Render/container/Group'
import * as util from '../util/core/util'
import Action from '../Element/Action'
import Style from '../Element/graphic/Style';
/**
 * 接受外部对队列的直接改变 (M)
 * @alias module:srender/ObjectList
 * @constructor
 */
var ObjectList = function (storage,painter,stack,collaMode,user) { 

    this.collaMode = collaMode ||false;

    this.storage = storage;

    this.painter = painter;

    this.stack = stack;

    this._objectListLen = 0;

    this._objectList=[];

    this._boundingRect = null;

    this.user = user||"bing";

   
};

ObjectList.prototype={

    constructor:ObjectList,


    traverse: function (cb, context) {
        for (var i = 0; i < this._objectList.length; i++) {
            this._objectList[i].traverse(cb, context);
        }
    },

    addBoundingRect: function(Rect){
        this._boundingRect = new Cst.Rect({
            shape: {
                cx: 0,
                cy: 0,
                x: Rect.x,
                y: Rect.y,
                width: Rect.width,
                height:Rect.height
            },
            style: {
                fill: 'none',
                stroke: '#14f1ff'
            }
            });
        this.add(this._boundingRect,false)
    },

    removeBoundingRect: function(){
        this._boundingRect&&this.del(this._boundingRect,false)
    },

    add: function(el,needStack = true) {

        let El = null;

        if(el instanceof Element || el instanceof Group){
            
            El = el;

            this._objectList.push({id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation})
           
            this.storage.addRoot(el);//stack操作

            //如果是协作模式，应该向服务器传递增加的信息
            if(el.type === "file"){
                this.collaMode&&el.pipe({type:"add",el:{id:el.id,type:el.type,totalTime:"02:11:54",frameRate:{rate:29.97,height:1080,width:1440,},shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation}})
            }
            else{
            this.collaMode&&el.pipe({type:"add",el:{id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation}})
            }
        }
        else{
             console.log("键值对")
             //假定id值递增，就算恢复以前的图形也生成新的id，这样避免遍历查找
           //  if(el.id>=guid('save')){
             //el为7个键值对 {id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation}
            let type = el.type.charAt(0).toUpperCase()+el.type.slice(1) 

            this._objectList.push(el)
            if(type === "File"){
                let obj = new Cst.House({
                    id:el.id,
                    style:el.style,
                    position:el.position,
                    shape:el.shape,
                    
                    scale:el.scale,
                   rotation:el.rotation,
             //   origin:data.origin
                })
            }
            else{
            let obj = new Cst[type]({
                id:el.id,
                style:el.style,
                position:el.position,
                shape:el.shape,
                
                scale:el.scale,
               rotation:el.rotation,
         //   origin:data.origin
            })
        }
            El = obj;

            this.storage.addRoot(obj);
     //   }
        }
        let action = new Action("add",El);
        needStack&&this.stack.add(action);
        
    },

    del: function(el,needStack = true) {

        let El = null;

        if (el == null) {
            // 不指定el清空 删除前应该添加占用判断 Group待完成
           /* for (var i = 0; i < this._objectList.length; i++) {
                var obj = this._objectList[i];
                if (obj instanceof Group) {
                    root.delChildrenFromStorage(this);
                }
            }*/
            this._objectList = [];
            this._objectListLen = 0;
            this.storage.delRoot()

            return;
        }

        if (el instanceof Array) {
            for (var i = 0, l = el.length; i < l; i++) {
                this.del(el[i]);
            }
            return;
        }
        if (el instanceof Element || el instanceof Group){

            El = el;

            var idx = util.indexOf(this._objectList, el.id);
            this._objectList.splice(idx, 1);
            //如果是协作模式，应该向服务器传递增加的信息
            this.collaMode&&el.pipe({type:"delete",el:{id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation}})
            this.storage.delRoot(el)
             
        }
        else{

            var idx = util.indexOf(this._objectList, el);//键值对的删除需要注意下是否正确，待调试
            if (idx >= 0) {
                this.storage._roots.splice(idx, 1);     //如果objectList和displayList顺序保持完全一致
                this._objectList.splice(idx, 1);
            }
            //由于增加了撤销，以下过程是必须的，需要注意撤销功能究竟需不需要id也回溯
            let type = el.type.charAt(0).toUpperCase()+el.type.slice(1) 
            let obj = new Cst[type]({id:el.id,style:el.style,position:el.position,shape:el.shape,scale:el.scale,rotation:el.rotation,})
            El = obj;
        }

        let action = new Action("add",El)
        
        needStack&&this.stack.add(action)
        
    },

    attr: function(el,tag,mode,style,forUser=false) { //此处tag为style、rotation、position、scale四类，从属于属性改变attr这个父tag，attr与add，delete并列
        var array = this.storage._roots; //多余的信息放入style
        var obj;
        for (var i = 0, len = array.length; i < len; i++) {  //方案2
            if(el.id == array[i].id){                          //如果objectList一直为引用
                obj = array[i];
                break
            }
        }
        if(!obj){console.log("id不正确:",el.id,array)}//这里稍微有点问题，_roots中代表group的有自己的id，解决办法一是靠传递键值对时传递父元素信息
        else{                                          //另一种是靠displayList判断
            switch (tag){
                case 'position':  
                    obj.attr('position',el.position);
                    break;
                case 'shape':
                    console.log(el.shape)
                    obj.attr('shape',el.shape,mode);
                    break;
                case 'style':  
                    if(forUser) {
                        obj.attr('style',style,false);//
                    }
                    else{
                        var _preStyle = {}//只有style属性不含函数
                        util.extend(_preStyle,util.extend1(obj.style,style))
                        let action = new Action("style",obj,_preStyle)
                        this.stack.add(action)
                        obj.attr('style',style);//
                    }
                    
                    break;
                case 'rotation':  
                    obj.attr('rotation',el.rotation);
                    break;
                case 'scale':  
                    obj.attr('scale',el.scale);
                    break;  
            }
         //   let action = new Action("style",obj,)
            
         //   this.stack.add(action)
        }
        /*
        obj.attr({                                //此处协同编辑时改为分情况调用较好，传过来的值包含操作类型tag
            style:el.style,
            rotation:el.rotation,
            scale:el.scale,
            position:el.position,
        })
        */
    },

    init: function(array,override = true) {
        if(override){
            this.del()
          //  this.add(array)
            guid('recover')
            if(array){
                if(array instanceof Array){
                    array.forEach(function(el){this.add(el)},this);
                }
                else this.add(array);
            }
               
            else{
                this.painter.clear()
            }
           
        }
        else{

        }
    },




}

export default ObjectList;
