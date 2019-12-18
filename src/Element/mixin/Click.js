import {lift} from '../../util/tool/color'

function Click(){

    this._chooseObject = null;

    this.on('click',this._choose,this)
}

Click.prototype = {

    constructor: Click,

   
    _choose: function(e){

        var clickingTarget = e.target;

      //  console.log("Click:"+clickingTarget.type)

        if(clickingTarget&&clickingTarget.type!=='vision'&&clickingTarget.type!=='rotate'){
            console.log("进入流程:",clickingTarget.type)
            if(this._preSelect){
                //_down(this._preSelect)
            }
            this._select = clickingTarget;
            this.drawVisionRect(this._select);
            this._highlight(clickingTarget)
            this._preSelect = clickingTarget
            this._chooseObject = clickingTarget
        }
        else{
            if(this.__visionRect) this.storage.delRoot(this.__visionRect);
            if(this.__rotateCircle) this.storage.delRoot(this.__rotateCircle);
            if(this.__scaleCircle3){
                //this.storage.delRoot(this.__scaleCircle1);
                //this.storage.delRoot(this.__scaleCircle2);
                this.storage.delRoot(this.__scaleCircle3);
                //this.storage.delRoot(this.__scaleCircle4);
            }
        }
        console.log("点击目标",e);
    },
    
    _highlight(el){
        if(el&&el.style&&el.style.fill==="transparent"){
           let color = lift(el.style.stroke,0.9)
            el.setStyle("opacity",0.9)
       //   el.setStyle("stroke",color)
        }
        else{
             let color = lift(el.style.fill,0.9)
        //     el.setStyle("stroke",color)
       //     el.setStyle("fill",color)
            el.setStyle("opacity",0.9)
        }
    },
    _down(el){

    }

}

export default Click;