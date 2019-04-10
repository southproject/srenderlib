//操作对象，作为操作栈的基本成员
var Action = function(type ,object, act){ //此处记录对象本身（引用）较好

    this.type = type;

    this.object = object; //序列化需要，最好用id表示

    this.act = act || null; 
}

Action.prototype = {

    setType: function(type){
        this.type = type
    }
}

export default Action;