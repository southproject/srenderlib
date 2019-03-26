// TODO Draggable for group
// FIXME Draggable on element which has parent rotation or scale
import Action from '../Action'

function Draggable() {

    this.on('mousedown', this._dragStart, this);
    this.on('mousemove', this._drag, this);
    this.on('mouseup', this._dragEnd, this);
    this.on('globalout', this._dragEnd, this);
    // this._dropTarget = null;
    // this._draggingTarget = null;

    // this._x = 0;
    // this._y = 0;
   // this._preX = 0;
   // this._preY = 0;
}

Draggable.prototype = {

    constructor: Draggable,

    _dragStart: function (e) {
        
        var draggingTarget = e.target;
    //    console.log("drag"+e.target)
      //  if (draggingTarget && draggingTarget.draggable) {
        if (draggingTarget) {
          //  draggingTarget.attr({style:{stroke:'#bbb'}})
            this._draggingTarget = draggingTarget;
            draggingTarget.dragging = true;
        //    console.log("startPosition:",[e.offsetX,e.offsetY])
            this._preX = this._x = e.offsetX;
            this._preY = this._y = e.offsetY;
            /**** */
            if(!draggingTarget._occupied&&draggingTarget.type !== "text"){
                draggingTarget._occupied = true;
                var username = draggingTarget.__zr.objectList.user;
                var rect = draggingTarget.getVisionBoundingRect&&draggingTarget.getVisionBoundingRect();
               /*  draggingTarget.__zr.objectList.attr( draggingTarget,"style",true,{  text:username,
                    textPosition:[rect.width||100,0],
                    textFill: '#0ff',
                    fontSize: 30,
                    fontFamily: 'Lato',
                    fontWeight: 'bolder',}) */
                 draggingTarget.attr("style",{  text:username,
                textPosition:[rect.width||100,0],
                textFill: '#0ff',
                fontSize: 30,
                fontFamily: 'Lato',
                fontWeight: 'bolder',},true)   
            }//这个操作不入栈
            /** */
            this.dispatchToElement(param(draggingTarget, e), 'dragstart', e.event);//为元素拖动过程中定义拖拽事件提供触发点
        }
       
    },

    _drag: function (e) {
        var draggingTarget = this._draggingTarget;
        if (draggingTarget) {

            var x = e.offsetX;
            var y = e.offsetY;

            var dx = x - this._x;
            var dy = y - this._y;
            this._x = x;
            this._y = y;

            draggingTarget.drift(dx, dy, e);
            this.dispatchToElement(param(draggingTarget, e), 'drag', e.event);
         //   console.log("draggingTarget:"+draggingTarget)
            var dropTarget = this.findHover(x, y, draggingTarget).target;//拖动元素的放置目标
           // console.log("dropTarget:"+dropTarget)
            var lastDropTarget = this._dropTarget;
            this._dropTarget = dropTarget;

            if (draggingTarget !== dropTarget) {
                if (lastDropTarget && dropTarget !== lastDropTarget) {
                    this.dispatchToElement(param(lastDropTarget, e), 'dragleave', e.event);
                }
                if (dropTarget && dropTarget !== lastDropTarget) {
                    this.dispatchToElement(param(dropTarget, e), 'dragenter', e.event);
                }
            }
        }
    },

    _dragEnd: function (e) {
        var draggingTarget = this._draggingTarget;
        
        if (draggingTarget) {   

            draggingTarget.__zr.objectList.stack.add(new Action("transform",draggingTarget,draggingTarget._preTransform))
            draggingTarget.saveTransform = true; //mouseup意味能够记录新的坐标
            draggingTarget.dragging = false;
            if(draggingTarget.type !== 'text'){
                draggingTarget._occupied = false;
                var username = draggingTarget.__zr.objectList.user;
                draggingTarget.attr("style",{text:"free", textFill: 'transparent',fontSize:1,},true)
           //   draggingTarget.__zr.objectList.attr( draggingTarget,"style",true,{text:null})
            }
        }

        this.dispatchToElement(param(draggingTarget, e), 'dragend', e.event);

        if (this._dropTarget) {
            this.dispatchToElement(param(this._dropTarget, e), 'drop', e.event);
        }
       // console.log(e.target.type)
      // typeof draggingTarget!=="undefined"?draggingTarget._zr.objectList.stack.add(new Action("transform",this,[this._preX,this._preY])):null   //操作入栈
        this._draggingTarget = null;
        this._dropTarget = null;
    }

};

function param(target, e) {
    return {target: target, topTarget: e && e.topTarget};
}

export default Draggable;