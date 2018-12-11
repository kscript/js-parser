import { Core } from './core';
import TYPE from './type';
import { symbols } from 'ansi-colors';

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

    // 定义左右边界符, 配合type使用
    this.ambitMap = {
      '/*': {
        left: '/*',
        right: '*/'
      },
      '/': {
        left: '/',
        right: '/'
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

    let endIndex = 0;
    
    console.time('buildTermsTree');

    // 一些关键词, 包括: 声明/函数/判断/循环/分语句/条件/注释
    let reg = /(((\b)(var\s|let\s|const\s|function|if|for))|\'|\"|:|,|;|\{|\}|\(|\))|(==|[\+\-\*\/><=]|)=|\/(\/|\*)|\n+/g;

    while(symbol = reg.exec(content)){
      if(endIndex !== symbol.index){
        let text = content.slice(endIndex, symbol.index);
        // if(text){
          list.push({
            s: 'un',
            t: text,
            i: endIndex + cutIndx,
            l: line
          });
        // }
      }
      // 如果是换行, 记录一下行数
      if(symbol[0].charAt(0) === '\n'){
        list.push({
          s: symbol[0],
          i: symbol.index + cutIndx,
          l: line
        });
        // 递增时需使用length, 因为可能存在多个换行符
        line += symbol[0].length;
        endIndex = symbol.index + symbol[0].length;
      } else {
        // 没有左边界符时
        if(type === ''){
          if(symbol[0] === '"' || symbol[0] === '\'' || symbol[0] === '/*' || symbol[0] === '/'){
            type = symbol[0];
          } else {
            list.push({
              s: this.trim(symbol[0]),
              i: symbol.index + cutIndx,
              l: line
            });
            endIndex = symbol.index + symbol[0].length;
          }
        }

        // 这里的判断, 与上一个不是互斥关系, 不能使用 else if
        // (为了逻辑清晰, 从上一个条件语句中分离, 实际上也可以合并);

        if(type !== '' && this.ambitMap[type]){
          let block = content.slice(symbol.index + type.length);
          // 基于左边界查找右边界
          let index = block.indexOf(this.ambitMap[type].right);
          if(type === '/'){
            index = (block.match(/([^\\])\/|\n/g) || []).index || -1;
            // console.log(index);
            // 找右边界符前, 先找到了换行符
            if(index >= 0 && block.charAt(index) === '\n'){
              throw(new Error('Invalid regular expression: missing /'))
            }
          }
          if(index < 0){
            // 无注释结束标记, 后面的内容视为注释
            if(type === '/*'){
            
            // 无正则右边界符, 报错
            } else if(type === '/'){
              
            }else if(type === '"' || type === '\'' ){
              console.log(type, symbol.s, content.slice(0, 10))
              // debugger
              // throw(new Error('symbolError ' + type + 'at ' + line))
            }
            // content = '';
          } else {
            // 右边界在content中的实际位置
            // index += symbol.index;
            
            // 被左右边界包裹的内容
            text = block.slice(0, index);
            // 截取右边界后的内容作为新的content
            content = block.slice(index + this.ambitMap[type].right.length);
            // 统计这一段落有多少行
            line += (text.match(/\n/g) || []).length;
            // 剩余字符的位置
            cutIndx = len - content.length;
            list.push({
              s: type,
              t: text,
              i: cutIndx - text.length - type.length  - this.ambitMap[type].right.length,
              l: line
            });
            type = '';
            // 截取过字符串时, 需要对正则的索引进行重置
            reg.lastIndex = 0;
            endIndex = 0;
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
  buildGrammarTree(tree, no = 0, a, b){
    tree = tree || this.termsTree || [];
    // 收敛代码片段
    tree = this.convergenceSnippet(tree, no);
    // console.log(tree);
    // 收敛声明
    tree = this.convergenceStatement(tree, no, a, b);
    
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
          let block = this.realLine(context, realno);
          // 创建一个函数类型类
          let func = new TYPE.Functions(
            'function', 
            this.parseName(this.realLine(name, realno)),
            this.parseParams(this.realLine(params, realno)),
            this.parseContext(block),
            realno,
            symbol
          );
          func.child = this.buildGrammarTree(this.fetchTree(this.termsTree, block), block[0]);
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
   * 收敛代码片段
   * @param {Array} tree 词法树片段
   * @param {number} no 词法树片段 在 AST词法树 的位置
   */
  convergenceSnippet(tree, no = 0){
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
          let block = this.realLine(context, realno);
          // 创建一个函数类型类
          let func = new TYPE.Functions(
            'function', 
            this.parseName(this.realLine(name, realno)),
            this.parseParams(this.realLine(params, realno)),
            this.parseContext(block),
            realno,
            symbol
          );
          func.child = this.buildGrammarTree(this.fetchTree(cTree, context), block[0]);
          current += context[1];
          return func;
        }));
      } else if(/(\'|\")/.test(symbol.s)){
        list.push(new TYPE.StringBlock(symbol, realno));
      } else if(symbol.s === '/*'){
        list.push(new TYPE.AnnotationBlock(symbol, realno));
      } else {
        list.push(symbol);
      }
      current += 1;
    }
    return list;
  }
  /**
   * 收敛声明
   * @param {Array} tree 词法树片段
   * @param {number} no 词法树片段 在 AST词法树 的位置
   */
  convergenceStatement(tree, no = 0, a, b){
    // console.log(tree, no, a, b);
    
    tree = tree || this.termsTree || [];
    let list = [];
    let symbol;
    let current = 0;
    let len = tree.length;
    let realno;
    let type = '';
    let un;
    while (current < len) {
      symbol = tree[current];
      realno = current + no;
      if (/\b(var|let|const)/.test(symbol.s)) {
        let cTree = tree.slice(current);
        let result = this.parseStatement(cTree, (content) => {
          let statement = [];
          let end = content.length ? content[content.length - 1] : [0, 0];
          content.forEach(item => {
            // this.splitStatement(this.fetchTree(cTree, item), () => {
            //   // statement.push(new TYPE.Statement(type, left, right, symbol));
            // });
            let contentTree = this.splitStatement(type, this.fetchTree(cTree, item), realno, (type, name, value) => {
              // statement.push(new TYPE.Statement(type, this.fetchTree(cTree, item), realno, contentTree));
              statement.push(new TYPE.Statement(type, name, value, this.fetchTree(cTree, item), realno));
            });
            // cTree = cTree.slice(item[1]);
          });
          current += end[1];
          return statement;
        });
        if(result){
          list = list.concat(result);
        }
        // if(a){
        //   debugger;
        // }
      } else if(symbol.s === 'un'){
        this.convergenceUnknown(tree.slice(current), realno, (type, line, result) => {
          current += line;
          if (result) {
            list.push(result);
          }
        });
      } else {
        list.push(symbol);
      }
      current += 1;
    }
    return list;
  }
  /**
   * 收敛未知语句
   * @param {Array} symbol 在词法树中标志
   * @param {Array} tree 词法树
   * @param {Number} no 在主词法树中的位置
   */
  convergenceUnknown(tree = [], no = 0, cb){
    let len = tree.length
    let symbol;
    let type = 'un';
    let line = 0;
    if (len === 1) {
      symbol = new TYPE.StringBlock(tree[0], no);
    } else if(len > 1) {
      symbol = tree[0];
      let next = tree[1];
      if(next.s === '='){
        type = 'assignment';
        if(len === 2){
          return ;
        }
        line = 2;
        if(/(var|let|const|function|\n|,|;)/.test(tree[3].s)){
          line += 1;
        }
        symbol = this.parseAssignment(tree.slice(0,4), no);
      } else if(/(var|let|const|function|,|;|\n)/.test(next.s)){
        symbol = new TYPE.StringBlock(tree[0], no);
      }
    }
    return cb(type, line, symbol);
  }
  parseAssignment(tree, no){
    return new TYPE.Assignment(tree[0], tree[2], tree[3] || null, no);
  }
  verifyName(name){
    return this.trim(name);
  }
  splitStatement(type, tree = [], no = 0, cb){
    let left = this.searchBlockDiff(tree, /(var|let|const|,)/g, /=/g, 'block');
    let right = this.searchBlockDiff(tree, /=/g, /(\,|;|function)/g, 'block');
    let leftTree = this.fetchTree(tree, left[1] < 0? [0, tree.length] : left);
    let leftState = this.searchValid(leftTree, 
      this.createObjByList(['un']), 
      {},
      {}
    );
    let rightTree;
    let rightState;
    let name;
    let value;
    if(leftTree.length < tree.length){
      if(right[0] >= 0){
        rightTree = this.fetchTree(tree, right[1] < 0? [right[0], tree.length] : right);
        rightState = this.searchValid(rightTree,
          this.createObjByList(['=', ',', '\n']),
          {},
          this.createObjByList(['/*']),
        );
        value = ((rightState.otherList[0] || {}).symbol||{});
      }
    }

    if(leftState.len < 2){
      // throw(new Error(type + ' = 没有结束'));
    } else if(leftState.len === 2){
      if(res['un'] && res['un'].length === 1){
        name = this.verifyName(res['un'][0].t);
      }
    } else if(leftState.len >= 3){
      let res = leftState.res;
      if(res['un']){
        if(res['un'].length === 1){
          name = this.verifyName(res['un'][0].t);
        } else {
          // throw(new Error(type + ' = '));
        }
      }
    } else {
      // TODO: 需要处理声明中有其它字符; let /**/ name /* */;
    }
    // console.log(type, name, value, leftState, rightState)
    return cb ? cb(type, name, value) : [type, name, value];
  }
  createObjByList(list = [], value = 1){
    let res = {};
    list.forEach(item => {
      res[item] = value;
    });
    return res;
  }
  /**
   * 查询有效节点
   * @param {Array} tree 要查询的词法树
   * @param {Object} white 白名单
   * @param {Object} black 黑名单
   * @param {Object} black 忽略名单
   * @param {Object} black 其它
   */
  searchValid(tree = [], white = {}, black = {}, ignore = {}){
    let res = {};
    let count = 0;
    let whiteList = [];
    let blackList = [];
    let ignoreList = [];
    let otherList = [];
    let key;
    tree.forEach((symbol, index) => {
      key = /\n+/.test(symbol.s)? '\n' : symbol.s;
      if(symbol.s == 'un' && /^\s+$/.test(symbol.t)){
        return ;
      }
      if(white[key]){
        whiteList.push({
          index,
          symbol
        });
      } else if(ignore[key]){
        ignoreList.push({
          index,
          symbol
        });
      } else if(black[key]){
        blackList.push({
          index,
          symbol
        });
      } else {
        otherList.push({
          index,
          symbol
        });
      }
      if(!res[key]){
        count++;
        res[key] = [symbol];
      } else {
        res[key].push(symbol);
      }
      
    });

    return {
      res,
      count,
      blackList,
      whiteList,
      ignoreList,
      otherList,
      len: tree.length
    };
  }
  /**
   *  分析函数块
   * @param {Array} tree 查找树
   * @param {Function} cb 回调函数
   */
  parseFunction(tree, cb){
    let name = this.searchBlockDiff(tree, /function/, /\(/, 'block');
    let params = this.searchBlockDiff(tree, /\(/, /\)/, 'nest', ()=>{});
    let context = this.realLine(this.searchBlockDiff(tree.slice(params[1]), /\{/, /\}/, 'nest'), params[1]);

    return cb(name, params, context);
  }
  parseName(block){
    return this.trim(this.fetchContent(block));
  }
  parseParams(block){
    return new TYPE.FunctionParams(
      block,
      ''
    );
  }
  parseContext(block){
    return new TYPE.FunctionContext(
      block,
      ''
    );
  }
  parseStatement(tree, cb, left, right, mode = 'block'){
    if(tree.length < 2){
      return;
    }
    let res = [];
    let content = this.searchBlockDiff(tree, left || /(var|let|const)/g, right || /(\,|;|function|\n+)/g, mode);
    let end = content[1];
    let current;
    res = res.concat([content]);
    // 处理,和换行符
    if(/(\,|\n+)/.test(tree[end].s)){
      let curTree = tree.slice(end);
      if (tree[end].s === ',') {
        current = this.parseStatement(curTree, content2 => {
          return this.realLine(content2[0], end);
        }, /,/g, /(\,|;|function)/g);
        res.push(current);
      } else {
        // 最后一句是声明
        if(tree.length === end){

        } else {
          current = this.parseStatement(curTree, content2 => {
            if(content2.length){
              let resTree = curTree[content2[0][1]];
              if(/(var|let|const)/.test(resTree.s)){
                return [];
              }
            }
            return this.realLine(content2[0], end);
          }, /\n+/g, /(var|let|const|,|;|function)/g, 'ignore');
          current.length && res.push(current);
        }
      }
    } else {
      
    }

    // res是个数组列表
    return cb ? cb(res) : res;
  }
}
