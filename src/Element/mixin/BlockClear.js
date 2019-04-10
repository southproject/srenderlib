function BlockClear(){ //Interactive Text
    
    this.on('dblclick',this.clear,this)
    
}

BlockClear.prototype = {
    
    constructor: BlockClear,

   
    clear:function(e){  //display textarea to get keyboard input

        if(e.target&&e.target.type === 'rect'){

        var rectTarget = this.textTarget = e.target;
           
         //   console.log("dom:",textTarget.__zr.painter)
         console.log("bounding:",rectTarget&&rectTarget.getVisionBoundingRect())
         var ctx = rectTarget.__zr.painter._layers[0].ctx;
         var x = rectTarget.getVisionBoundingRect().x
         var y = rectTarget.getVisionBoundingRect().y
         var width = rectTarget.getVisionBoundingRect().width
         var height = rectTarget.getVisionBoundingRect().height
         ctx.clearRect(0,0,1000,1000) 
    //  console.log(x,y)   
           

        }
        
    },


}

export default BlockClear;