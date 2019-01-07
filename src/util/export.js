/**
 * Do not mount those modules on 'src/zrender' for better tree shaking.
 */

import * as zrUtil from './core/util';
import * as matrix from './core/matrix';
import * as vector from './core/vector';
import * as colorTool from './tool/color';
import * as pathTool from './tool/path';
import {parseSVG} from './tool/parseSVG';


export {default as Group} from '../Render/container/Group';
export {default as Path} from '../Element/graphic/Path';
export {default as Image} from '../Element/graphic/Image';
export {default as CompoundPath} from '../Element/graphic/CompoundPath';
export {default as Text} from '../Element/graphic/Text';
export {default as IncrementalDisplayable} from '../Element/graphic/IncrementalDisplayable';

export {default as Arc} from '../Element/graphic/shape/Arc';
export {default as BezierCurve} from '../Element/graphic/shape/BezierCurve';
export {default as Circle} from '../Element/graphic/shape/Circle';
export {default as Droplet} from '../Element/graphic/shape/Droplet';
export {default as Ellipse} from '../Element/graphic/shape/Ellipse';
export {default as Heart} from '../Element/graphic/shape/Heart';
export {default as Isogon} from '../Element/graphic/shape/Isogon';
export {default as Line} from '../Element/graphic/shape/Line';
export {default as Polygon} from '../Element/graphic/shape/Polygon';
export {default as Polyline} from '../Element/graphic/shape/Polyline';
export {default as Rect} from '../Element/graphic/shape/Rect';
export {default as Ring} from '../Element/graphic/shape/Ring';
export {default as Rose} from '../Element/graphic/shape/Rose';
export {default as Sector} from '../Element/graphic/shape/Sector';
export {default as Star} from '../Element/graphic/shape/Star';
export {default as DbCircle} from '../Element/graphic/shape/DbCircle';
export {default as House} from '../Element/graphic/shape/House';
export {default as Trochoid} from '../Element/graphic/shape/Trochoid';

export {default as LinearGradient} from '../Element/graphic/LinearGradient';
export {default as RadialGradient} from '../Element/graphic/RadialGradient';
export {default as Pattern} from '../Element/graphic/Pattern';
export {default as BoundingRect} from './core/BoundingRect';

export {matrix};
export {vector};
export {colorTool as color};
export {pathTool as path};
export {zrUtil as util};

export {parseSVG};
