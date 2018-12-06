import util from './util';
import {AST} from './ast';
import init from './init';
export const Vue = function (option) {
  return new Vue.fn.Vue(option);
}
Object.assign(Vue, util, init);
Vue.fn = Vue.prototype = {
  constructor: Vue,
  Vue: function (option) {
    Vue.initOption.call(this, option);
    return this;
  }
};
// console.log([AST]);
window.AST = AST;
let sent = `
var a = "var a = '1'",
b = 2;
var b1 =  ;"  var ds;"
var c = '
1
3'
//var d;
var e = ;
//var f= 3;
/*
var g = 4;
*/
var h=5;
`
window.ast = new AST(sent);

Vue.fn.Vue.prototype = Vue.prototype;

export default {
  Vue
}
