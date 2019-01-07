/**
 * 圆形
 * @module zrender/shape/DbCircle
 */

import Path from '../Path';

export default Path.extend({

    type: 'dbcircle',

    shape: {
        cx: 0,
        cy: 0,
        r: 0
    },


    buildPath: function (ctx, shape, inBundle) {
        // Better stroking in ShapeBundle
        // Always do it may have performence issue ( fill may be 2x more cost)
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        // else {
        //     if (ctx.allocate && !ctx.data.length) {
        //         ctx.allocate(ctx.CMD_MEM_SIZE.A);
        //     }
        // }
        // Better stroking in ShapeBundle
        // ctx.moveTo(shape.cx + shape.r, shape.cy);
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
        
        ctx.arc(shape.cx+shape.r, shape.cy, shape.r, 0, Math.PI * 2, true);
        ctx.moveTo(shape.cx+shape.r*Math.cos(Math.PI/3), shape.cy-shape.r*Math.sin(Math.PI/3));
        ctx.quadraticCurveTo(shape.cx-shape.r*Math.cos(Math.PI/3),shape.cy-shape.r*Math.sin(Math.PI/3),shape.cx-shape.r/3,shape.cy-2*shape.r);
        ctx.stroke();

        // ctx.arc(shape.cx+shape.r*Math.cos(Math.PI/3), shape.cy+shape.r*Math.sin(Math.PI/3), shape.r, 0, Math.PI/180, true);

    }
});