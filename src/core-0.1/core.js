/**
 * 将ast中不参与业务逻辑的工具方法抽出到父类
 * module Core
 */
export class Core {
  constructor(content, option){
    this.content = content;
    this.option = option;
    this.logs = [];
  }
  /**
   * 日志
   */
  log(){
    this.logs.push(arguments);
  }
  /**
   * 每行在源码中的实际位置
   * @param {Array} lines 源码分割后得到的数组
   * @param {String=} splitStr 分割符, 一般为\n
   */
  lineIndex(lines, splitStr = '\n'){
    lines = lines || this.lines || [];
    let len  = splitStr.length;
    let list = [];
    let count = 0;
    lines.forEach(item => {
      list.push(count);
      count += item.length + len;
    });
    return list;
  }
  /**
   * 取得真实行号
   * @param {Array} line 截取的行
   * @param {Number} current 截取的行的开始位置
   */
  realLine(line, current){
    return (line || []).map(item => {
      return item + current;
    });
  }
  /**
   * 
   * @param {Array} tree 查找树
   * @param {String|RegExp} left 左边界
   * @param {String|RegExp} right 右边界
   * @param {string=} mode 嵌套模式 block(固定匹配左右: {}) | nest(可以嵌套: a={b:{}}) | ignore(忽略多余左边界符) var a \n\n var b
   * @param {Function=} error 不为嵌套, 且找到两个连续的左边界符时
   */
  searchBlockDiff(tree = [], leftReg, rightReg, mode = 'block', error){

    // 根据正负, 可以反映出 左右边界出现次数
    let count = 0;
    // 左边界
    let left = -1;
    // 右边界
    let right = -1;
    
    let isFound = false;
    let isError = false;

    let len = tree.length;
    let current = 0;
    while (!isError && !isFound && current < len - 1) {
      right = current;
      let symbol = tree[current];
      if(mode === 'ignore'){
        // console.log(symbol, left);
      }
      // 先查找左边界符
      // 不为忽略模式, 需要一直判断左边界符
      if (leftReg.test(symbol.s)) {
        // 找到第一个
        if (left < 0) {
          left = current;
        // 找到第二个
        } else {
          // 如果不允许嵌套, 则报错. 
          if (mode === 'block') {
            isError = true;
          }
        }
        count += 1;
      } else if (left >= 0 && rightReg.test(symbol.s)) {
        count -= 1;
        if(left >= 0 && mode === 'ignore'){
          isFound = true;
        }
      }
      // 如果存在左边界符, 且找到了右边界符, 则任务完成~
      if (left >= 0 && count === 0) {
        isFound = true;
      } else {
        current++;
        // right = current;
      }
    }
    if(!isFound){
      right = -1;
    }
    return isError ? error && error(current) : [left, right];
  }
  /**
   * 取出内容
   * @param {Array} block 截取范围
   */
  fetchContent(block, left = 0, right = 0){
    try{
      let start = this.termsTree[block[0]];
      let end = this.termsTree[block[block.length - 1]];
      return this.content.slice(start.i + start.s.length + left, end.i + right);
    }catch(e){
      return [];
    }
  }
  /**
   * 取出词法树
   * @param {Array} tree 指定要截取的树
   * @param {Array} block 截取范围
   */
  fetchTree(tree, block){
    tree = tree || this.termsTree || [];
    let start = block[0];
    let end = block[block.length-1] + 1;
    return tree.slice(start, end);
  }
  /**
   * 通过数组创建一个散列
   * @param {Array} tree 数组
   * @param {any|Array} block 值, 如果为数组时与 list 一一 对应
   */
  createObjByList(list = [], value = 1){
    let res = {};
    let mode = value instanceof Array ? 'list' : 'value';
    list.forEach((item, index) => {
      res[item] = mode === 'value' ? value : value[index];
    });
    return res;
  }
  verify(str){
    return str = typeof str === 'string'? str : '';
  }
  trim (str){
    return this.verify(str).replace(/(^\s+|\s+$)/, '');
  }
  trimLeft(str){
    return this.verify(str).replace(/^\s+/, '');
  }
  trimRight(str){
    return this.verify(str).replace(/(^\s+|\s+$)/, '');
  }
}
export default {
  Core
}
