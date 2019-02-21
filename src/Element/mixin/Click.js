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

            this._select = clickingTarget

            this._chooseObject = clickingTarget

        }

    }

}

export default Click;