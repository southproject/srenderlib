import {lift} from '../../util/tool/color'

function Click(){

    this._chooseObject = null;

    this.on('click',this._choose,this)
    
}

Click.prototype = {

    constructor: Click,

    _choose: function(e){

        var clickingTarget = e.target;

        console.log("Click:"+clickingTarget)

        if(clickingTarget){
            console.log("进入流程")
            if(this._preSelect){
              
                //_down(this._preSelect)
            }
            this._select = clickingTarget

            this._highlight(clickingTarget)
            this._preSelect = clickingTarget
            this._chooseObject = clickingTarget

        }

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