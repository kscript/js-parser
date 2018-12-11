
import {AST} from './ast';

window.AST = AST;
let sent = `
var a = "var a = '1'",
b = 2;
tvar $b1 =  ;"  var ds;"
var ss = function a(){
  var a =2;
  console.log(1);

  for(var i = 0; i<= 10; i++){
    console.log(i)
  }
  function b(a, b, c){
    var c = 2;
    return 111
  }
  return function(){
    return i
  }
}
ddf=12
var c = '
1
3'
let d
s
var e = ;
var f= 
var g
var h
d=1
dd=2
/*
var g = 4;
*//*1*//*222*/123
var h=5;
`
//sent = `var s=window["webpackJsonp"],f=s.push.bind(s);s.push=n,s=s.slice();`;
window.ast = new AST(sent,{});
console.log(ast);
