function IText(){ //Interactive Text
    
    this.on('dblclick',this.displayInput,this)
  //  this.on('mousemove',this.occupy,this)
  //  this.on('mouseup',this.free,this)
    this._hasItext = false;
        
}

IText.prototype = {

    

    constructor: IText,

    displayInput: function(e){  //定位可编辑文本框

        if(this._hasItext) return 

        var chooseTarget = e.target;
        // chooseTarget.getBoundingRect().applyTransform(chooseTarget.transform)
         console.log("bounding:",chooseTarget&&chooseTarget.getVisionBoundingRect())
      //  chooseTarget&&chooseTarget.getBoundingRect().applyTransform(chooseTarget.transform)
        console.log("事件坐标:",e.offsetX,e.offsetY)
        /*
        if(chooseTarget&&chooseTarget.type === 'text'){
           
            console.log("dom:",chooseTarget.__zr.painter)
            console.log("bounding:",chooseTarget.style.textRect)
            console.log("坐标:",chooseTarget.style._x,chooseTarget.style._y)
          //  var location = chooseTarget.getBoundingRect()
            var parent = chooseTarget.__zr.painter.root
            var defaultText=document.createTextNode("This is new.");
            var itext=document.createElement("textarea");
            itext.appendChild(defaultText);
            itext.style.position = "absolute"
            itext.style.left = chooseTarget.style._x + "px";
            itext.style.top = chooseTarget.style._y + "px";
            parent.appendChild(itext)
            this._hasItext = true;

        }
        */
    },

    occupy: function(e){
        var draggingTarget = e.target;

        if (draggingTarget) { 
            if(!draggingTarget._occupied){
                draggingTarget._occupied = true;
                var username = draggingTarget.__zr.objectList.user;
                draggingTarget.attr("style",{  text:username,
                textPosition:[200,140],
                textFill: '#0ff',
                fontSize: 30,
                fontFamily: 'Lato',
                fontWeight: 'bolder',})  
            }//这个操作不入栈
          //  draggingTarget.__zr.objectList.addBoundingRect(draggingTarget.getVisionBoundingRect())
        }
    },
    free: function(e){
        var draggingTarget = e.target;
        if (draggingTarget){
            draggingTarget._occupied = false;
            var username = draggingTarget.__zr.objectList.user;
            draggingTarget.attr("style",{text:null})
        }
    }

}

export default IText;