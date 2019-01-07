import './graphic';
import {registerPainter} from '../../srender';
import Painter from './Painter';

registerPainter('svg', Painter);