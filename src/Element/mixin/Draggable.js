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
        if (draggingTarget&&this._globalDrag) {
          //  draggingTarget.attr({style:{stroke:'#bbb'}})
            this._draggingTarget = draggingTarget;
            draggingTarget.dragging = true;
        //    console.log("startPosition:",[e.offsetX,e.offsetY])
            this._preX = this._x = e.offsetX;
            this._preY = this._y = e.offsetY;
            /**** */
             
            if(!draggingTarget._occupied&&draggingTarget.__zr.mode){
                draggingTarget._occupied = true;
                var username = draggingTarget.__zr.objectList.user;
                var rect = draggingTarget.getVisionBoundingRect&&draggingTarget.getVisionBoundingRect();
                if(draggingTarget.type !== "text"){
                    
                   /*  draggingTarget.__zr.objectList.attr( draggingTarget,"style",true,{  text:username,
                        textPosition:[rect.width||100,0],
                        textFill: '#0ff',
                        fontSize: 30,
                        fontFamily: 'Lato',
                        fontWeight: 'bolder',}) */
                     draggingTarget.attr("style",{text:username,
                    textPosition:[rect.width||100,0],
                    textFill: '#0ff',
                    fontSize: 30,
                    fontFamily: 'Lato',
                    fontWeight: 'bolder',},true,false,true)   //不入栈
                }
                else{
                     draggingTarget.attr("style",{textOfText:username,textPosition:[rect.width||100,0],fFontSize: 30,
                   },true,false,true)
                }
                
            }//这个操作不入栈
            
            /** */
            this.dispatchToElement(param(draggingTarget, e), 'dragstart', e.event);//为元素拖动过程中定义拖拽事件提供触发点
        }
    },

    _drag: function (e) {
        var draggingTarget = this._draggingTarget;
        if(!draggingTarget) return
        
        var x = e.offsetX;
        var y = e.offsetY;
        var dx = x - this._x;
        var dy = y - this._y;
        this._x = x;
        this._y = y;

        if(draggingTarget.type!=='scale'&&draggingTarget.type!=='rotate'&&draggingTarget.type!=='vision') {

            draggingTarget.drift(dx, dy, e);  
            this.drawVisionRect(draggingTarget);
            this.dispatchToElement(param(draggingTarget, e), 'drag', e.event);
            //console.log("draggingTarget:"+draggingTarget)
            var dropTarget = this.findHover(x, y, draggingTarget).target;//拖动元素的放置目标
            //console.log("dropTarget:"+dropTarget)
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
            return;
        }
        if(!draggingTarget.target.originWidth||!draggingTarget.target.originHeight){
            let pa = draggingTarget.getBoundingRect();
            let m = draggingTarget.target.transform;
            draggingTarget.target.originWidth = pa.width/m[0];
            draggingTarget.target.originHeight = pa.height/m[3];
        }
        //如果拖拽元素为大小控制点
        if(draggingTarget.type==='scale'){
            let pa = draggingTarget.target.getVisionBoundingRect();
            let pa2 = draggingTarget.target.getBoundingRect();
            switch(draggingTarget.index){
                case 1:
                    var s1 = (pa.x+pa.width-x)/(draggingTarget.target.originWidth);
                    var s2 = (pa.y+pa.height-y)/(draggingTarget.target.originHeight);
                    //var point = draggingTarget.target.transformCoordToLocal(pa.x+pa.width,pa.y+pa.height);
                    draggingTarget.target.origin = draggingTarget.target.originIndex.index3;
                    draggingTarget.target.changeShape(s1,s2);
                    this.drawVisionRect(draggingTarget.target);
                    break;
                case 2:
                    var s1 = (x-pa.x)/(draggingTarget.target.originWidth);
                    var s2 = (pa.y+pa.height-y)/(draggingTarget.target.originHeight);
                    //var point = draggingTarget.target.transformCoordToLocal(pa.x,pa.y+pa.height);
                    draggingTarget.target.origin = draggingTarget.target.originIndex.index4;
                    draggingTarget.target.changeShape(s1,s2);
                    this.drawVisionRect(draggingTarget.target);
                    break;
                case 3:
                    var s1 = (x-pa.x)/(draggingTarget.target.originWidth);
                    var s2 = (y-pa.y)/(draggingTarget.target.originHeight);
                    //var point = draggingTarget.target.transformCoordToLocal(pa.x,pa.y);
                    draggingTarget.target.origin = draggingTarget.target.originIndex.index1;
                    draggingTarget.target.changeShape(s1,s2);
                    this.drawVisionRect(draggingTarget.target);
                    break;
                case 4: 
                    var s1 = (pa.x+pa.width-x)/(draggingTarget.target.originWidth);
                    var s2 = (y-pa.y)/(draggingTarget.target.originHeight);
                    //var point = draggingTarget.target.transformCoordToLocal(pa.x+pa.width,pa.y);
                    draggingTarget.target.origin = draggingTarget.target.originIndex.index2;
                    draggingTarget.target.changeShape(s1,s2);
                    this.drawVisionRect(draggingTarget.target);
                    break;
            }
            return;
        }
        if(draggingTarget.type==='rotate'){
            let pa = draggingTarget.target.getBoundingRect();
            let pav = draggingTarget.target.getVisionBoundingRect();

            let s1 = Math.atan2((y-(pav.y+(pav.height/2))),(x-(pav.x+(pav.width/2))));

            draggingTarget.target.changeRotation(-s1,pa);
            console.log('y',y,'x',x,'atan2',s1);
            this.drawVisionRect(draggingTarget.target);
            //console.log('mmmmmmmmm',draggingTarget.target.transform)
            return;
        }
        return;
    },

    _dragEnd: function (e) {
        var draggingTarget = this._draggingTarget;
        
        if (draggingTarget) {

            draggingTarget.__zr.objectList.stack.add(new Action("transform",draggingTarget,draggingTarget._preTransform))
            draggingTarget.saveTransform = true; //mouseup意味能够记录新的坐标
            draggingTarget.dragging = false;
            
            if(draggingTarget.__zr.mode){
                draggingTarget._occupied = false;
                var username = draggingTarget.__zr.objectList.user;
                if(draggingTarget.type !== 'text'){
                    draggingTarget.attr("style",{text:"", textFill: 'transparent',fontSize:1,},true,false,true);
                    //draggingTarget.__zr.objectList.attr( draggingTarget,"style",true,{text:null})
                }
                else{
                    draggingTarget.attr("style",{textOfText:""},true,false,true);
                }
            }

            //当拖拽元素是缩放点的时候，更新元素四个位置缩放的origin（缩放原点）值
            //依据：当元素进行缩放的时候并不会影响本次缩放origin（下次此位置缩放仍然可以用这个origin）
            //内容：本次origin作为不变基点，通过元素transform矩阵计算出其他三点变换后的origin位置
            if(draggingTarget.type==='scale'){
                //当前长度和高度
                console.log('drag_end',draggingTarget.target.originIndex.index1[0]);
                let pa_vrect = draggingTarget.target.getBoundingRect();
                let _nowWidth = draggingTarget.target.transform[0]*draggingTarget.target.originWidth;
                let _nowHeight = draggingTarget.target.transform[3]*draggingTarget.target.originHeight;
                console.log(_nowWidth,_nowHeight)
                let nowWidth = e.offsetX - pa_vrect.x;//draggingTarget.target.transform[0]*draggingTarget.target.originWidth;
                let nowHeight = e.offsetY - pa_vrect.y;//draggingTarget.target.transform[3]*draggingTarget.target.originHeight;
                console.log(nowWidth,nowHeight)
                switch(draggingTarget.index){
                    case 1:
                        let [x3,y3] = draggingTarget.target.originIndex.index3;
                        draggingTarget.target.originIndex.index1[0] = x3-nowWidth;
                        draggingTarget.target.originIndex.index1[1] = y3-nowHeight;
                        draggingTarget.target.originIndex.index2[1] = y3-nowHeight;
                        draggingTarget.target.originIndex.index4[0] = x3-nowWidth;
                        break;
                    case 2:
                        let [x4,y4] = draggingTarget.target.originIndex.index4;
                        draggingTarget.target.originIndex.index1[1] = y4-nowHeight;
                        draggingTarget.target.originIndex.index2[0] = x4+nowWidth;
                        draggingTarget.target.originIndex.index2[1] = y4-nowHeight;
                        draggingTarget.target.originIndex.index3[0] = x4+nowWidth;
                        break;
                    case 3:
                        let [x1,y1] = draggingTarget.target.originIndex.index1;
                        draggingTarget.target.originIndex.index2[0] = x1+nowWidth;
                        draggingTarget.target.originIndex.index3[0] = x1+nowWidth;
                        draggingTarget.target.originIndex.index3[1] = y1+nowHeight;
                        draggingTarget.target.originIndex.index4[1] = y1+nowHeight;
                        break;
                    case 4: 
                        let [x2,y2] = draggingTarget.target.originIndex.index2;
                        draggingTarget.target.originIndex.index1[0] = x2-nowWidth;
                        draggingTarget.target.originIndex.index3[0] = y2+nowHeight;
                        draggingTarget.target.originIndex.index4[0] = x2-nowWidth;
                        draggingTarget.target.originIndex.index4[1] = y2+nowHeight;
                        break;
                }
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