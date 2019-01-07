/**
 * srender: 生成唯一id
 */

var idStart = 0x0907;

export default function (save) {
    if(save){return idStart;}
    else{return idStart++;}
}