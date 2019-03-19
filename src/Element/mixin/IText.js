function IText(){ //Interactive Text
    
    this.on('dblclick',this.displayInput,this)

    this._hasItext = false;
        
}

IText.prototype = {

    

    constructor: IText,

    displayInput: function(e){  //定位可编辑文本框

        if(this._hasItext) return 

        var chooseTarget = e.target;
        console.log("bounding:",chooseTarget.getBoundingRect())
        console.log("事件坐标:",e.offsetX,e.offsetY)
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
    }

}

export default IText;