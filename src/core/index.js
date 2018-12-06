
import {AST} from './ast';

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
console.log(ast);
