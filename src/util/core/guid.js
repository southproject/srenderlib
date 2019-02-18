/**
 * srender: 生成唯一id
 */

var idStart = 0x0//0x0907;

export default function (mode) {
    var mode = mode || 'incremental'
    switch(mode){
        case 'save':
            return idStart;
        case 'incremental':
            return idStart++;
        case 'recover':
            idStart = 0x0;
            break;
    }
        
}