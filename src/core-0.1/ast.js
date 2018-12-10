import { Core } from './core';
import TYPE from './type';

export class AST extends Core {
  constructor(content, option){
    super(content, option);

    this.content = content;
    this.option = option;

    // 分行
    this.lines = content.split("\n");
    // 每行首字符在源码的实际位置
    this.linenos = this.lineIndex();

    // 词法树
    this.termsTree = [];

    // 语法树
    this.grammarTree = [];

    // 调用解析器
    this.parse();
  }

  parse(){
    // 词法树
    this.termsTree = this.buildTermsTree();
    // 语法树
    this.grammarTree = this.buildGrammarTree(this.termsTree, 0);
  }
  
  /**
   * 构建词法树
   * @param {String} content 需要构建词法树的源码
   */
  buildTermsTree(content){
    content = content || this.content || '';

    let symbol;
    let list = [];
    let line = 0;
    let len = content.length;

    // 缓存一些需要处理的类型
    let type = '';
    // 取出一部分文本
    let text = '';
    // 截取位置
    let cutIndx = 0;
    // 定义左右边界符, 配合type使用
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

    // 一些关键词, 包括: 声明/函数/判断/循环/分语句/条件/注释
    let reg = /(var\s|let\s|const\s|function|if|for|\.|'|"|:|,|;|\{|\}|\(|\))|(==|[\+\-\*\/><=]|)=|\/\/|\/\*|\*\/|\n+/g;

    while(symbol = reg.exec(content)){
      // 如果是换行, 记录一下行数
      if(symbol[0].charAt(0) === '\n'){
        list.push({
          s: symbol[0],
          i: symbol.index + cutIndx,
          l: line
        });
        // 递增时需使用length, 因为可能存在多个换行符
        line += symbol[0].length;
      } else {
        // 没有左边界符时
        if(type === ''){
          if(type === '"' || type === '\'' || symbol[0] === '/*'){
            type = symbol[0];
          } else {
            list.push({
              s: symbol[0],
              i: symbol.index + cutIndx,
              l: line
            });
          }
        }

        // 这里的判断, 与上一个不是互斥关系, 不能使用 else if
        // (为了逻辑清晰, 从上一个条件语句中分离, 实际上也可以合并);

        if(type !== '' && map[type]){
          // 基于左边界查找右边界
          let index = content.slice(symbol.index + type.length).indexOf(map[type].right);
          if(index < 0){
            // 无注释结束标记, 后面的内容视为注释              
            if(type === '/*'){
            
            // 无右引号标记, 报错
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
            // 截取右边界后的内容作为新的content
            content = content.slice(index + type.length + map[type].right.length);

            // 统计这一段落有多少行
            line += (text.match(/\n/g) || []).length;
            // 剩余字符的位置
            cutIndx = len - content.length;

            list.push({
              s: type,
              t: text,
              i: cutIndx - text.length - type.length  - map[type].right.length,
              l: line
            });
            type = '';
            // 截取过字符串时, 需要对正则的索引进行重置
            reg.lastIndex = 0;
          }
        }
      }
    }
    console.timeEnd('buildTermsTree');
    return list;
  }
  /**
   * 构建语法树
   * @param {String} tree 词法树
   */
  buildGrammarTree(tree, no = 0){
    tree = tree || this.termsTree || [];
    // 收敛函数块
    tree = this.convergenceFunction(tree, no);
    return tree;
  }
  /**
   * 收敛一个函数块
   * @param {Array} tree 词法树片段
   * @param {number} no 词法树片段 在 AST词法树 的位置
   */
  convergenceFunction(tree, no = 0){
    tree = tree || this.termsTree || [];
    let list = [];
    let symbol;
    let current = 0;
    let len = tree.length;
    let realno;
    while (current < len) {
      symbol = tree[current];
      realno = current + no;
      if (symbol.s === 'function') {
        let cTree = tree.slice(current);
        list.push(this.parseFunction(cTree, (name, params, context) => {
          // 创建一个函数类型类
          let func = new TYPE.Functions(
            'function', 
            this.parseName(this.realLine(name, realno)),
            this.parseParams(this.realLine(params, realno)),
            this.parseContext(this.realLine(context, realno)),
            realno,
            symbol
          );
          // func.child = this.convergenceFunction(cTree.slice.apply(cTree, context), realno + context[0]);
          current += context[1];
          return func;
        }));
      } else {
        list.push(symbol);
      }
      current += 1;
    }
    return list;
  }
  /**
   *  分析函数块
   * @param {Array} tree 查找树
   * @param {Function} cb 回调函数
   */
  parseFunction(tree, cb){
    let name = this.searchBlockDiff(tree, /function/, /\(/, true);
    let params = this.searchBlockDiff(tree, /\(/, /\)/, true);
    let context = this.realLine(this.searchBlockDiff(tree.slice(params[1]), /\{/, /\}/, true), params[1]);

    return cb(name, params, context);
  }
  parseName(block){
    return this.trim(this.fetchContent(block));
  }
  parseParams(block){
    return new TYPE.FunctionParams(
      block,
      '',
      this.buildGrammarTree(this.fetchTree(block), block[0])
    );
  }
  parseContext(block){
    return new TYPE.FunctionContext(
      block,
      '',
      this.buildGrammarTree(this.fetchTree(block), block[0])
      // this.fetchContent(block)
    );
  }
}
