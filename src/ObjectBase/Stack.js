
var Stack = function(storage){

    this.storage = storage;

    this._memory = []

    this._undoList = [];

    this._redoList = [];

}

Stack.prototype = {

    constructor: Stack,

    exec:function(target){

        switch(target.type){
            
            case 'add':
            
              
               this.storage.delRoot(target.object)
               break;
                        
            case 'del':

              
               this.storage.addRoot(target.object)
               break;
            
            case 'transform':

            case 'style':
            
        }

    },

    redo:function(){
       

        let target = this._redoList.pop();

        if(target){

            this.exec(target)
            
            switch(target.type){
                case "add":
                   // target.type = "del";
                   target.setType("del")
                    break;
                case "del":
                    //target.type = "add";
                    target.setType("add")
                    break;
                        
            }
            
            this._undoList.push(target);

        }

    },

    undo:function(){

        let target = this._undoList.pop();

        if(target){
            this.exec(target)
            
            switch(target.type){
                case "add":
                  
                  target.setType("del")
                    break;
                case "del":
                 target.setType("add")
                    break;
            }
            
            this._redoList.push(target);
            
        } 
    },

    add:function(el){

        this._undoList.push(el)

        console.log(this._undoList)
    },

    del:function(el){

        

    },

}
export default Stack;