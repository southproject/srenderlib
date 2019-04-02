import Displayable from './Displayable';
import * as zrUtil from '../../util/core/util';
import * as textContain from '../../Render/contain/text';
import * as textHelper from './helper/text';

/**
 * @alias srender/graphic/Text
 * @extends module:srender/graphic/Displayable
 * @constructor
 * @param {Object} opts
 */
var Text = function (opts) { // jshint ignore:line
    Displayable.call(this, opts);
};

Text.prototype = {

    constructor: Text,

    type: 'text',

    brush: function (ctx, prevEl) {
        var style = this.style;
        // Optimize, avoid normalize every time.
        this.__dirty && textHelper.normalizeTextStyle(style, true);

        // Use props with prefix 'text'.
        style.fill = style.stroke = style.shadowBlur = style.shadowColor =
            style.shadowOffsetX = style.shadowOffsetY = null;

        var text = style.text;
        // Convert to string
        text != null && (text += '');

        // Do not apply style.bind in Text node. Because the real bind job
        // is in textHelper.renderText, and performance of text render should
        // be considered.
        // style.bind(ctx, this, prevEl);

        if (!textHelper.needDrawText(text, style)) {
            return;
        }

        this.setTransform(ctx);

        textHelper.renderText(this, ctx, text, style, null, prevEl);
       
        if (style.textOfText&&style.textOfText!=="") {
            this.restoreTransform(ctx);
            this.drawRectTtext(ctx, this.getBoundingRect());
        }

        this.restoreTransform(ctx);
      
        
    },

    getBoundingRect: function () {
        var style = this.style;
        // Optimize, avoid normalize every time.
        this.__dirty && textHelper.normalizeTextStyle(style, true);

        if (!this._rect) {
            var text = style.text;
            text != null ? (text += '') : (text = '');

            var rect = textContain.getBoundingRect(
                style.text + '',
                style.font,
                style.textAlign,
                style.textVerticalAlign,
                style.textPadding,
                style.rich
            );

            rect.x += style.x || 0;
            rect.y += style.y || 0;
            //  rect.x += style._x || 0; //此处的_x是反映transform变化的真实坐标
            //  rect.y += style._y || 0;

            if (textHelper.getStroke(style.textStroke, style.textStrokeWidth)) {
                var w = style.textStrokeWidth;
                rect.x -= w / 2;
                rect.y -= w / 2;
                rect.width += w;
                rect.height += w;
            }

            this._rect = rect;
        }

        return this._rect;
    },
    getVisionBoundingRect: function () {
        var style = this.style;
        // Optimize, avoid normalize every time.
        this.__dirty && textHelper.normalizeTextStyle(style, true);
        var tmpMat = [];
        var transform = this.getLocalTransform(tmpMat);
        if (!this.__rect) {//双下划线区分_rect
            var text = style.text;
            text != null ? (text += '') : (text = '');

            var rect = textContain.getBoundingRect(
                style.text + '',
                style.font,
                style.textAlign,
                style.textVerticalAlign,
                style.textPadding,
                style.rich
            );

            rect.x += style.x || 0;
            rect.y += style.y || 0;
            //  rect.x += style._x || 0; //此处的_x是反映transform变化的真实坐标
            //  rect.y += style._y || 0;
          
            if (textHelper.getStroke(style.textStroke, style.textStrokeWidth)) {
                var w = style.textStrokeWidth;
                rect.x -= w / 2;
                rect.y -= w / 2;
                rect.width += w;
                rect.height += w;
            }
            rect.applyTransform(transform);
            this.__rect = rect;
        }
        this.__rect.applyTransform(transform);
        return this.__rect;
    }
};

zrUtil.inherits(Text, Displayable);

export default Text;