import { Core } from './core';
import TYPE from './type';

export class AST extends Core {
  constructor(content, option){
    super(content, option);
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
    this.grammarTree = this.buildGrammarTree(this.termsTree, 0, true);
    // this.grammarTree = this.buildGrammarTree(this.termsTree, 0);
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
      '(': {
        left: '(',
        right: ')'
      },
      ')': {
        left: '(',
        right: ')'
      },
      '{': {
        left: '{',
        right: '{'
      },
      '}': {
        left: '{',
        right: '{'
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
        // type === '(' || type === '{'
        if(type === ''){
          if(type === '"' || type === '\'' || symbol[0] === '/*'){
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
              } else if(type === '"' || type === '\'' ){
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
  buildGrammarTree(tree, no, first){
    tree = tree || this.termsTree || [];
    let len = tree.length;
    let current = 0;
    let line = 0;
    let symbol;
    let res = [];
    let cTree; // 子树
    let realno;
    let old = null;
    while(current < len - 1){
      symbol = tree[current];
      realno = current + no;
      // if (
      //   (!first && !/var|let|const|function/.test(symbol.s))
      //   ||
      //   (first && /var|let|const|function/.test(symbol.s))
      // ) {
        switch(symbol.s.charAt(0)){
          case '\n':
              line += symbol.s.length;
              old = null;
            break;
          case ',':
            // console.log(old, symbol);
            if(old){
              cTree = tree.slice(current);
              res = res.concat(this.parseStatement(cTree, realno, symbol, old));
            }
            break;
          // case '(':
          //   cTree = tree.slice(current);
          //   res = res.concat(this.parseBracket(cTree, realno));
          //   break;
          case ';':
            old = null;
            break;
          case 'v':
          case 'c':
          case 'l':
            if(/var|const|let/.test(symbol.s)){
              old = symbol;
              cTree = tree.slice(current);
              let Statement = this.parseStatement(cTree, realno, symbol);
              this.splitStatement(Statement, (left, right, leftContent, rightContent) => {
                Statement.child = [new TYPE.StatementLeft(left, leftContent)];
                right.length && Statement.child.push(new TYPE.StatementRight(right, rightContent));
                // Statement.child = this.buildGrammarTree(cTree.slice.apply(cTree, Statement.block), realno + Statement.block[0]);
              });
              res = res.concat(Statement);
            }
            break;
          case 'f':
              if(symbol.s === 'function'){
                cTree = tree.slice(current);
                res = res.concat(this.parseFunction(cTree, (name, params, context) => {
  
                  let func = new TYPE.Functions(
                    'function', 
                    this.parseName(this.realLine(name, realno)),
                    this.parseParams(this.realLine(params, realno)),
                    this.parseContext(this.realLine(context, realno)),
                    realno,
                    symbol
                  );
                  func.child = this.buildGrammarTree(cTree.slice.apply(cTree, context), realno + context[0]);
                  current += context[1];
                  return func;
                }));
              }
              break;
          default: 
            old && res.concat(symbol);
          break;
        }
      // }
      current++;

    }

    return res;
  }
  splitStatement(Statement, cb){
    let tree = this.fetchTree(Statement.block);
    let left = this.searchBlock(tree, /var/g, /(=|\,|\;)/g);
    let right = this.searchBlock(tree, /=/g, /(=|\,|\;)/g);

    let leftBlock = this.realLine(left, Statement.treeno);
    let rightBlock = right[0] < 0 ? [] : this.realLine(right, Statement.treeno);
    // console.log({
    //   left,
    //   leftBlock,
    //   leftContent: this.fetchContent(leftBlock),
    //   right,
    //   rightBlock,
    //   rightContent: this.fetchContent(rightBlock),
    //   Statement
    // });
    return cb(
      leftBlock, 
      rightBlock,
      this.fetchContent(leftBlock),
      this.fetchContent(rightBlock)
    );
  }
  /**
   * 取出内容
   * @param {array} block 截取范围
   */
  fetchContent(block, left = 0, right = 0){
    try{
      let start = this.termsTree[block[0]];
      let end = this.termsTree[block[block.length-1]];
      return this.content.slice(start.i + start.s.length + left, end.i + right);
    }catch(e){
      // debugger;
      // console.log(block, e);
      return [];
    }
  }
  fetchTree(block){
    let start = block[0];
    let end = block[block.length-1] + 1;
    return this.termsTree.slice(start, end);
  }
  parseParams(block){
    return new TYPE.FunctionParams(
      block,
      this.fetchContent(block, false)
    );
  }
  parseContext(block){
    return new TYPE.FunctionContext(
      block
      // this.fetchContent(block, false)
    );
  }
  parseName(block){
    return this.trim(this.fetchContent(block, false));
  }
  parseBracket(tree, realno){
    let content = this.searchBlockDiff(tree, /\(/, /\)/g, true);
    return new TYPE.Bracket(this.fetchContent(this.realLine(content, realno)), this.realLine(content, realno));
  }
  parseStatement(tree, realno, symbol, old, cb){
    let type = (old || {}).s || tree[0].s;
    let content = old ? this.searchBlock(tree, /\,/g, /(\,|;|\n)/g) : this.searchBlockDiff(tree, type, /(\,|;|\n)/g, false, (current) => {
      return [];
    });
    let line = tree.slice.apply(tree, content);

    type = type.slice(0, -1);
    let Statement = [];
    let block = this.realLine(content, realno);
    if(line.length){
      let body = this.fetchContent(block);
      Statement = new TYPE.Statement(type, '', body, block, realno, symbol);
    }
    return Statement;
  }
  /**
   * 
   * @param {array} tree 查找树
   * @param {function} cb 回调
   */
  parseFunction(tree, cb){
    let name = this.searchBlockDiff(tree, /function/, /\(/, true);
    let params = this.searchBlockDiff(tree, /\(/, /\)/, true);
    let context = this.searchBlockDiff(tree, /\{/, /\}/, true);
    return cb(name, params, context, tree.slice.apply(tree, params), tree.slice.apply(tree, context));
  }
  
  realLine(line, current){
    return (line || []).map(item => {
      return item + current;
    })
  }
  /**
   * 
   * @param {array} tree 查找树
   * @param {string|RegExp} left 左边界
   * @param {string|RegExp} right 右边界
   * @param {boolean} nest 是否为嵌套
   * @param {function} error 不为嵌套, 且找到两个连续的左边界符时 
   */
  searchBlockDiff(tree = [], left, right, nest = false, error){

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
        current++;
      }
    }
    return isError ? error && error(current) : [start, current];
  }
  searchBlock(tree = [], left, right){
    let symbol;
    let start = -1;
    let current = 0;
    let isFound = false;
    let len = tree.length;
    let leftReg = typeof left === 'string' ? new RegExp(left, 'g'): left;
    let rightReg = typeof right === 'string' ? new RegExp(right, 'g'): right;
    let ignore;
    let hasFunction = false;
    while(!isFound && current < len - 1){
      symbol = tree[current];
      // 如果有函数, 跳出函数
      if (hasFunction) {
        if(/(\{)/.test(symbol.s)){
          ignore = this.searchBlockDiff(tree.slice(current), /(\{)/g, /(\})/g, true);
          if(ignore.length){
            current += ignore[1];
          }
          current--;
        }
      } else {
        if(start < 0){
          if(leftReg.test(symbol.s)){
            start = current;
          }
        } else {
          if(/function/.test(symbol.s)){
            hasFunction = true;
          }
          
          // 会触发结束的分支, 需将current减去1
          if(/(\(|\{)/.test(symbol.s)){
            ignore = this.searchBlockDiff(tree.slice(current), /(\(|\{)/g, /(\)|\})/g, true);
            if(ignore.length){
              current += ignore[1];
            }
            current--;
          } else if(rightReg.test(symbol.s)) {
            isFound = true;
            current--;
          }
        }
      }
      current++;
    }
    return [start, current];
  }
 
}
