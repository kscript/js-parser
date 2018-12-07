import TYPE from './type';


export class AST {
  constructor(content, option){
    this.content = content;
    this.option = option;
    this.lines = content.split("\n")
    this.linenos = this.lineIndex();
    this.logs = [];
    this.termsTree = [];
    this.grammarTree = [];
    this.parse();
  }
  log(){
    this.logs.push(arguments);
  }
  lineIndex(lines){
    lines = lines || this.lines || [];
    let list = [];
    let count = 0;
    lines.forEach(item => {
      list.push(count);
      count += item.length + 1;
    });
    return list;
  }
  parse(){
    this.termsTree = this.buildTermsTree();
    this.grammarTree = this.buildGrammarTree(this.termsTree, this.linenos)
  }
  buildTermsTree(content){
    content = content || this.content || '';
    let symbol;
    let list = [];
    let line = 0;
    let count = 0;
    let index = 0;
    let type = '';
    let text = '';
    let len = content.length;
    let map = {
      '/*': {
        left: '/*',
        right: '*/'
      },
      '"':{
        left: '"',
        right: '"'
      },
      '\'':{
        left: '\'',
        right: '\''
      }
    }
    
    console.time('buildTermsTree');
    let reg = /(var\s|let\s|const\s|function|if|for|\.|'|"|:|,|;|\{|\}|\(|\))|(==|[\+\-\*\/><=]|)=|\/\/|\/\*|\*\/|\n+/g
    symbol = reg.exec(content);
    while(symbol){
      if(symbol[0].charAt(0) === '\n'){
        list.push({
          s: symbol[0],
          i: symbol.index + count,
          l: line
        });
        line += symbol[0].length;
      } else {
        if(type === ''){
          if(symbol[0] === '\'' || symbol[0] === '\"' || symbol[0] === '/*'){
            type = symbol[0];
          } else {
            list.push({
              s: symbol[0],
              i: symbol.index + count,
              l: line
            });
          }
        }
        if(type !== ''){
          if(map[type]){
            // 基于左边界查找右边界
            index = content.slice(symbol.index + type.length).indexOf(map[type].right);
            if(index < 0){
              // 无注释结束标记
              if(type === '/*'){
              // 无右引号标记
              } else if(type === '"' || type === '\''){
                debugger
                throw(new Error('symbolError ' + type + 'at ' + line))
              }
              content = '';
            } else {
              // 右边界在content中的实际位置
              index += symbol.index;
              // 被左右边界包裹的内容
              text = content.slice(symbol.index + type.length, index);
              // 右边界后的内容
              content = content.slice(index + type.length + map[type].right.length);
              // 统计这一段落有多少行
              line += (text.match(/\n/g) || []).length;
              // 剩余字符的位置
              count = len - content.length;
              list.push({
                s: type,
                t: text,
                i: count - text.length - type.length  - map[type].right.length,
                l: line
              });
              type = '';
              // 截取过字符串时, 需要对正则的索引进行重置
              reg.lastIndex = 0;
            }
          }
        }
      }
      symbol = reg.exec(content);
    }
    console.timeEnd('buildTermsTree');
    return list;
  }
  restoreTermsTree(tree){
    tree = tree || this.termsTree || [];
    let content = '';
    tree.forEach(item => {
      content += item.s;
    });
    return content;
  }
  buildGrammarTree(tree, indexs){
    tree = tree || this.termsTree || [];
    indexs = indexs || this.linenos || [];
    let len = tree.length;
    let current = 0;
    let line = 0;
    let symbol;
    let res = [];
    let cTree; // 子树
    while(current < len - 1){
      symbol = tree[current++];
      switch(symbol.s.charAt(0)){
        case '\n':
            line += symbol.s.length;
          break;
        case 'v':
        case 'c':
        case 'l':
          if(/var|const|let/.test(symbol.s)){
            cTree = tree.slice(current - 1)
            res = res.concat(this.parseStatement(cTree, (type, context, line) => {
              if(line.length){
                console.log(line)
                let sent = this.fetchContent(line);// this.content.slice(line[0].i, line[line.length-1].i);
                return new TYPE.Statement(type, sent, current, symbol.l, symbol.i, line);
              }
              return [];
            }));
          }
          break;
        case 'f':
            if(symbol.s === 'function'){
              cTree = tree.slice(current);
              res = res.concat(this.parseFunction(cTree, (params, context, end, paramsBody, contextBody) => {
                let func = new TYPE.Functions(
                  'function', 
                  this.parseParams(params, paramsBody, current), 
                  this.parseContext(context, contextBody, current), 
                  current, symbol.l, symbol.i
                );
                func.child = this.buildGrammarTree(contextBody);
                current += end;
                return func;
              }));
            }
            break;
        default: break;
      }
    }
    return res;
  }
  /**
   * 取出内容
   * @param {array} line 首尾行
   * @param {boolean} contain 是否包含边界符
   */
  fetchContent(line, contain = true){
    let start = line[0];
    let end = line[line.length-1];
    return this.content.slice(
      contain ? start.i : start.i + start.s.length,
      contain ? end.i : end.i - end.s.length -  start.s.length
    )
  }
  parseParams(line, paramsBody, current){
    return {
      line: line,
      index: current,
      body: this.fetchContent(paramsBody, false)
    };
  }
  parseContext(line, contextBody, current){
    return {
      line: line,
      index: current,
      body: this.fetchContent(contextBody, false)
    };
  }
  parseStatement(tree, cb){
    let type = tree[0].s;
    let content = this.sreachBlock(tree, type, /(\,|;|\n)/g, false, (current) => {
      return [];
    });
    return cb(type, content, tree.slice.apply(tree, content));
  }
  /**
   * 
   * @param {array} tree 查找树
   * @param {function} cb 回调
   */
  parseFunction(tree, cb){
    let params = this.sreachBlock(tree, /\(/, /\)/, true);
    let context = this.sreachBlock(tree, /\{/, /\}/, true);
    let end = context[1];
    // 
    return cb(params, context, end, tree.slice.apply(tree, params), tree.slice.apply(tree, context));
  }
  /**
   * 
   * @param {array} tree 查找树
   * @param {string|RegExp} left 左边界
   * @param {string|RegExp} right 右边界
   * @param {boolean} nest 是否为嵌套
   * @param {function} error 不为嵌套, 且找到两个连续的左边界符时 
   */
  sreachBlock(tree = [], left, right, nest = false, error){

    let len = tree.length;
    let start = -1;
    let count = 0;
    let current = 0;
    let isFound = false;
    let symbol;
    let isError = false;
    // 如果不是字符串, 需传正则
    let leftReg = typeof left === 'string' ? new RegExp(left, 'g'): left;
    let rightReg = typeof right === 'string' ? new RegExp(right, 'g'): right;
    while(!isError && !isFound && current < len - 1){
      symbol = tree[current];
      if(leftReg.test(symbol.s)){
        if(start<0){
          start = current
        } else {
          if(!nest){
            isError = true;
          }
        }
        count++;
      } else if(rightReg.test(symbol.s)) {
        count--;
      }
      if(count === 0 && start >= 0){
        isFound = true;
      } else {
      }
      current++;
    }
    return isError ? error && error(current) : [start, current];
  }
  // 左右空格
  trim(str){
    str = str || '';
    return str.replace(/(^\s+|\s+$)/, '');
  }
  // 左空格
  trimLeft(str){
    str = str || '';
    return str.replace(/^\s+/, '');
  }
  // 右空格
  trimRight(str){
    str = str || '';
    return str.replace(/\s+$/, '');
  }
}
