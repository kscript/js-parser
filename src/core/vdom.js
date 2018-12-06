//替换节点
export const replaceNode = function(root,node,newNode){
  //console.trace(arguments);
  if(root){
      root.insertBefore(newNode,node);
      root.removeChild(node);
  }
  //return root.replaceChild(node,newNode);
}
//插入节点
export const insertNode = function(root,node,newNode){
  if(root){
      root.insertBefore(newNode,node);
  }
  //return root.replaceChild(node,newNode);
}
//插入节点
export const removeNode = function(root,node){
  if(root){
      root.removeChild(node);
  }
  //return root.replaceChild(node,newNode);
}
//获取元素及其innerHTML
export const html = function(node){
  if(typeof node === 'string'){
      return node;
  }
  var vnode = document.createElement('div');
  vnode.appendChild(node.cloneNode(true));
  return vnode.innerHTML;
}
export default {
  replaceNode,
  insertNode,
  removeNode,
  html
}
