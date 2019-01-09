import guid from '../util/core/guid';
import * as Cst from '../util/export'; //constructor of shape
import Element from '../Element/Element'
import * as util from '../util/core/util'
/**
 * 接受外部对队列的直接改变 (M)
 * @alias module:srender/ObjectList
 * @constructor
 */
var ObjectList = function (storage,singleMode) { 

    this.singleMode = singleMode || true;

    this.storage = storage;

    this._objectListLen = 0;

    this._objectList=[];
};

ObjectList.prototype={

    constructor:ObjectList,


    traverse: function (cb, context) {
        for (var i = 0; i < this._objectList.length; i++) {
            this._objectList[i].traverse(cb, context);
        }
    },

    add: function(el) {
        if(el instanceof Element){
           
            this._objectList.push({id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation})
            this.storage.addRoot(el);
            //如果是协作模式，应该向服务器传递增加的信息
            !this.singleMode&&el.pipe({type:"add",el:{id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation}})
        }
        else{
             console.log("键值对")
             //假定id值递增，就算恢复以前的图形也生成新的id，这样避免遍历查找
             if(el.id>=guid(true)){
             //el为7个键值对 {id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation}
            let type = el.type.charAt(0).toUpperCase()+el.type.slice(1) 
            
            let obj = new Cst[type]({
                id:el.id,
                style:el.style,
                position:el.position,
                shape:el.shape,
                
                scale:el.scale,
               rotation:el.rotation,
         //   origin:data.origin
            })
            this._objectList.push(el)
            this.storage.addRoot(obj);
        }
        }
        
    
    },

    del: function(el) {
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
        if (el instanceof Element){
            var idx = util.indexOf(this._objectList, el.id);
            this._objectList.splice(idx, 1);
            //如果是协作模式，应该向服务器传递增加的信息
            el.pipe({type:"delete",el:{id:el.id,type:el.type,shape:el.shape,style:el.style,position:el.position,scale:el.scale,rotation:el.rotation}})
            this.storage.delRoot(el)
            
        }
        else{
            var idx = util.indexOf(this._objectList, el);//键值对的删除需要注意下是否正确，待调试
            if (idx >= 0) {
                this.storage._roots.splice(idx, 1);     //如果objectList和displayList顺序保持完全一致
                this._objectList.splice(idx, 1);
            }
        }
        
    },

    attr: function(el,tag,mode) { //此处tag为style、rotation、position、scale四类，从属于属性改变attr这个父tag，attr与add，delete并列
        var array = this.storage._roots;
        var obj;
        for (var i = 0, len = array.length; i < len; i++) {  //方案2
            if(el.id == array[i].id){                          //如果objectList一直为引用
                obj = array[i];
                break
            }
        }
        if(!obj){console.log("id不正确")}
        else{
            switch (tag){
                case 'position':  
                    obj.attr('position',el.position);
                    break;
                case 'shape':
                    console.log(el.shape)
                    obj.attr('shape',el.shape,mode);
                    break;
                case 'style':  
                    obj.attr('style',el.style);
                    break;
                case 'rotation':  
                    obj.attr('rotation',el.rotation);
                    break;
                case 'scale':  
                    obj.attr('scale',el.scale);
                    break;  
            }
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
            array.forEach(function(el){this.add(el)},this);
        }
        else{

        }
    },




}

export default ObjectList;