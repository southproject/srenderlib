import * as util from '../util/core/util'

var Stack = function(storage){

    this.storage = storage;

    this._memory = []

    this._undoList = [];

    this._redoList = [];

}

Stack.prototype = {

    constructor: Stack,

    exec:function(action){

        switch(action.type){
            
            case 'add':
            
              
               this.storage.delRoot(action.object)
               break;
                        
            case 'del':

              
               this.storage.addRoot(action.object) //如果使用id,需要一个数组存储被删除的对象
               break;
            
            case 'transform':
             //   console.log(action.act)//这部分是针对连续drift的起点和终点，可以把它转发给协同接受者
                action.object.attr("position",[action.act[4],action.act[5]],false,false)//不入栈
                action.act = [...action.object.transform];//记录回溯前的坐标，以待redo使用
              break;

            case 'style':
             
              var temp = {}
              util.extend(temp,action.act)
              util.extend(action.act,action.object.style);  
              action.object.attr("style",temp)
             
           
              
              break;
        }

    },

    redo:function(triggered = false){
       

        let action = this._redoList.pop();

        if(action){
            

            this.exec(action)
            
            switch(action.type){
                case "add":
                   // action.type = "del";
                   action.setType("del")
                    break;
                case "del":
                    //action.type = "add";
                    action.setType("add")
                    break;
               
                        
            }
            
            this._undoList.push(action);

            !triggered && action.object.pipe({type:"stack",tag:"redo"})

        }

    },

    undo:function(triggered = false){

        let action = this._undoList.pop();

        if(action){
        

            this.exec(action)
            
            switch(action.type){
                case "add":
                  
                  action.setType("del")
                    break;
                case "del":
                    action.setType("add")
                    break;
            
            }
            
            this._redoList.push(action);

            !triggered && action.object.pipe({type:"stack",tag:"undo"})
            
        } 
    },

    add:function(action,triggered = false){

       

        this._undoList.push(action)

        this._redoList = [] //意味着如果有操作，则无法向后

        if(action.type === "transform"){//类似transform操作都需要统一栈数据
            action.object.pipe({type:"stack-transform",tag:[...action.act],el:action.object.id})
        }

        !triggered && action.object.pipe({type:"stack",tag:"interrupt"}) //似乎没有必要

    },

}
export default Stack;