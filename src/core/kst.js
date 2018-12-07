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
    // let reg = /(\s+|var\s|let\s|const\s|function|if|for|'|"|\{|\}|\(|\)|([\+\-\*\/><]|)=|:|\n|,|;|\/\*|\*\/|\/\/|\/|\+\+|--|={2,3}|\d+|\w+|\.)/g;
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
    let current = 0;
    let line = 0;
    let len = tree.length;
    let symbol;
    let res = [];
    while(current < len - 1){
      symbol = tree[current++];
      switch(symbol.s.charAt(0)){
        case '\n':
            line += symbol.s.length;
          break;
            break;
        case 'f':
            if(symbol.s === 'function'){
              res = res.concat(this.parseFunction(tree.slice(current), (params, context, funcs) => {
                let func = new TYPE.Functions(params, context, current, symbol.l, symbol.i);
                current += context[1];
                return [func].concat(funcs);
              }));
            }
            break;
        default: break;
      }
    }
    return res;
  }
  parseFunction(tree, cb){
    let params = this.sreachBlock(tree, '(', ')', true);
    let context = this.sreachBlock(tree, '{', '}', true);
    return cb(params, context, this.buildGrammarTree(tree.slice.apply(tree, context)));
  }
  sreachBlock(tree = [], left, right, nest = false){
    let len = tree.length;
    let start = -1;
    let count = 0;
    let current = 0;
    let isFound = false;
    let symbol;
    while(!isFound && current < len - 1){
      symbol = tree[current];
      if(symbol.s === left){
        start < 0 && (start = current);
        count++;
      } else if(symbol.s === right) {
        count--;
      }
      if(count === 0 && start >= 0){
        isFound = true;
      }
      current++;
    }
    return [start, current];
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
