
import {AST} from './kst';

window.AST = AST;
let sent = `
var a = "var a = '1'",
b = 2;
var $b1 =  ;"  var ds;"
function a(){
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
var c = '
1
3'
var d
var e = ;
var f= 
/*
var g = 4;
*//*1*//*222*/123
var h=5;
`
sent = `var s=window["webpackJsonp"]=window["webpackJsonp"]||[],f=s.push.bind(s);s.push=n,s=s.slice();`;
sent = `function x(a=5,b="a",c=function(x=1,y){console.log(x=function(i=8,j){})},d={x:1,y:2,z:'x=6'},e=x=>7,f=['3=5','x.1','y,2',1],g=(x,y)=>{let z=(i,j=6)=>{}},h){}`
window.ast = new AST(sent,{});
console.log(ast);
