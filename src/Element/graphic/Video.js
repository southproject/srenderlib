import Displayable from './Displayable';
import BoundingRect from '../../util/core/BoundingRect';
import * as zrUtil from '../../util/core/util';
import * as videoHelper from './helper/video';

/**
 * @alias srender/graphic/Video
 * @extends module:srender/graphic/Displayable
 * @constructor
 * @param {Object} opts
 */
function ZVideo(opts) {
    Displayable.call(this, opts);
}

ZVideo.prototype = {

    constructor: ZVideo,

    type: 'video',
    
    showStyle:{
        x:0,
        y:0,
        width:0,
        height:0
    },

    labelTime:{
        beginTime:0,
        endTime:0
    },

    hasMenuFlag:0,
    renderFlag:0,
    labelFlag:0,

    //render video
    render:function(ctx,video) {
        this.renderFlag=1;
        ctx.clearRect(this.showStyle.x,this.showStyle.y,this.showStyle.width,this.showStyle.height)
        ctx.drawImage(video,this.showStyle.x,this.showStyle.y,this.showStyle.width,this.showStyle.height)
        setTimeout(this.render.bind(this,ctx,video), 0)
    },

    brush: function (ctx, prevEl) {
        var style = this.style;
        var src = this.style.videosrc;
        // Must bind each time
        style.bind(ctx, this, prevEl);
        
        var video = this._video = videoHelper.createOrUpdateVideo(
            src,
            this._video,
            this,
            this.onload
        )
        if (!video){
            console.log('video not Exist!')
            return;
        }

        this.setShowStyle(style);
    
        if(!this.renderFlag){
            this.render(ctx,video);
        }

        // Draw rect text
        if (style.text != null) {
            // Only restore transform when needs draw text.
            this.restoreTransform(ctx);
            this.drawRectText(ctx, this.getBoundingRect());
        }
    },

    setShowStyle: function(style){
        this.showStyle.x = style.x||0;
        this.showStyle.y = style.y||0;
        this.showStyle.width = style.width;
        this.showStyle.height = style.height;
        // var aspect = this._video.videoWidth / this._video.videoHeight;
        // if (this.showStyle.width == null && this.showStyle.height != null) {
        //     // Keep video/height ratio
        //     this.showStyle.width = this.showStyle.height * aspect;
        // }
        // else if (this.showStyle.height == null && this.showStyle.width != null) {
        //     this.showStyle.height = this.showStyle.width / aspect;
        // }
        // else if (this.showStyle.width == null && this.showStyle.height == null) {
        //     console.log('1');
        //     this.showStyle.width = this._video.videoWidth;
        //     this.showStyle.height = this._video.videoHeight;
        // }
    },

    getBoundingRect: function () {
        var style = this.showStyle;
        if (! this._rect) {
            this._rect = new BoundingRect(
                style.x || 0, style.y || 0, style.width || 0, style.height || 0
            );
        }
        return this._rect;
    }
};

zrUtil.inherits(ZVideo, Displayable);

export default ZVideo;