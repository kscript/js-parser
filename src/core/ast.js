export class AST {
  constructor(sentence){
    this.logs = [];
    // 输入语句
    this.sentence = sentence || '';
    // 分行
    this.list = this.lines = this.sentence.split("\n");
    // 词法树
    this.termsTree = [];
    // 语法树
    this.grammarTree = [];
    // 调用解析器
    this.parse();
  }
  log(){
    this.logs.push(arguments);
  }
  parse(){
    this.terms();
    this.grammar();
  }
  terms(){
    this.lines = this.annotation(this.lines);
    this.termsTree = this.buildTermsTree(this.lines);
  }
  grammar(lines){
    lines = lines || this.lines;
    lines.forEach(item => {
      this.Statement(item, result => {
        if(!this.Statement(result)){
          if(!this.Function(result)){
          }
        }
      });
    })
  }
  Statement(str){
    // 查找 var|let|const ..
    let result = str.match(/^(var|let|const)\s+([^\s=])/);
    // 如果找到, 说明是声明语句, 继续解析
    if (result) {
      return this.parseStatement(result);
    } else {
      return false;
    }
  }
  parseStatement(result){
    let value = '';
    let str = result.input;
    let res = str.match(/^(var|let|const)\s+(.*?)\s{0,}([=,;])\s{0,}(.*?)$/);
    if(res){
      value = this.parseStatementValue(res);
      this.grammarTree.push({
        type: res[1],
        name: res[2],
        value: value,
        result: res
      });
      this.log('@parseStatement result?', str, res, value);
    } else {
      value = this.parseStatementValue(result);
      this.grammarTree.push({
        type: result[1],
        name: result[2],
        value: value,
        result: result
      });
      this.log('@parseStatement result?!', str, result);
    }
  }
  parseStatementValue(value){
    return value;
  }
  Function(str, parse){
    // 查找 var|let|const ..
    let result = str.match(/function\s+(.*?)\s{0,}/);
    // 如果找到, 说明是声明语句, 继续解析
    if (result) {
      return this.parseStatement(result);
    } else {
      return false;
    }
  }
  // 去注释, 保留行信息
  annotation(lines){
    let list = [];
    let type = 'line';
    lines = lines || this.lines || [];
    lines.forEach(item => {
      if (type === 'block') {
        if (/\*\//.test(item)) {
          type = 'line';
          item = item.replace(/^(.*?)\*\//g, '');
        } else {
          item = '';
        }
      }
      if (type === 'line'){
        if (/\/\*/.test(item)) {
          type = 'block';
          item = item.replace(/\/\*(.*?)$/g, '');
        } else {
          item = item.replace(/\/\/(.*?)$/g, '');
        }
      }
      list.push(item);
    });
    if(type === 'block'){
      // throw(new Error(''))
    }
    return list;
  }
  // 处理字符串
  buildTermsTree(lines, symbol){
    lines = lines || this.lines || [];
    let group = [];
    let list = [];
    let type = 'line';
    let symbols = [];
    let text = '';
    let blockno = 0;
    lines.forEach((item, lineno) => {
      if (item) {
        symbols = item.match(/('|")/g) || [];

        if(symbols.length === 0){
          if(type === 'block'){
            text += '\n' + item;
          } else {
            // 不是段落 且 没有找到引号, 为新行
            list.push([{
              line: lineno,
              left: item,
              content: '',
              right: '',
              symbol: ''
            }]);
          }
        } else if(symbols.length === 1){
          // 如果是段落
          if(type === 'block'){
            // 如果符号可以匹配 右引号
            if(symbol === symbols[0]){
              let index = item.indexOf(symbol);
              text += '\n' + item.slice(0, index);
              group.push({
                line: blockno,
                left: '',
                index: index,
                content: text,
                right: '',
                symbol: symbol
              });
              if(index + symbol.length < item.length - 1){
                group.push({
                  line: blockno,
                  left: '',
                  content: '',
                  right: item.slice(index + symbol.length),
                  symbol: symbol
                });
              }
              list.push(group);
              // 引号闭合
              symbol = '';
              text = '';
              type = 'line';
              blockno = 0;
              group = [];
            } else {
              text += '\n' + item;
            }
          } else {
            // 如果没有记录段落的开始行号
            if (blockno === 0) {
              blockno = lineno;
              // 左引号
              symbol = symbols[0];
            }
            type = 'block';
            group.push({
              line: blockno,
              index: 0,
              left: item.slice(0, item.indexOf(symbol)),
              content: '',
              right: '',
              symbol: ''
            });
            text += item.slice(item.indexOf(symbol) + symbol.length);
          }
        // 找到多个
        } else {
          let result = this.formatSymbol(item, symbols, lineno);
          symbol = result[0];
          if(symbol){
            type = 'block';
            text += result[1].right;
          } else {
            text = '';
            type = 'line';
          }
          list.push(result[1]);
        }
      } else {
        // list.push([]);
      }
    });
    if(type === 'block'){
    }
    return list;
  }
  restoreByTermsTree(tree){
    let text = '';
    tree = tree || this.termsTree || [];
    tree.forEach(line => {
      line.forEach(item => {
        if(item.symbol){
          text += item.left + item.symbol + item.content + item.symbol + item.right;
        } else {
          text += item.left + item.right;
        }
      });
      text += '\n';
    });
    return text;
  }
  // 
  buildTermsTree2(lines){
    let tree = [];
    let list = [];
    let index;
    let result = [];
    let state = {
      type: 'line'
    };
    let text = '';
    let symbol = '"';
    lines = lines || this.lines || [];

    lines.forEach(item => {
      // 先判断是否是段落文本
      if(state.type === 'block'){
        index = item.indexOf(symbol);
        // 如果没找到, 记录一下, 继续往下一行
        if(index === -1){
          text += '\n' + item;
          return ;
        } else {
          // 如果找到, 将这一段截取出来.
          tree.push({
            index: 0,
            symbol: '',
            content: text + item.slice(0, index),
            right: '',
            left: ''
          });
          // 继续找剩下的
          item = item.slice(index + symbol.length);
        }
      } 
      list = item.match(/("|')/g) || [];
      // 没找到字符串
      if(list.length === 0){
        if(item){
          tree.push({
            index: 0,
            symbol: '',
            content: '',
            right: '',
            left: item
          })
        } else {
          tree.push({
          });
        }
      // 找到一个
      } else if(list.length === 1){
        symbol = list[0];
        state.type = 'block';
        text = item.slice(item.indexOf(symbol));
      // 找到多个
      } else {
        result = this.formatSymbol(item, list);
        if (result[0]) {
          state.type = 'block';
          text = result[1].slice(-1)[0].right;
        } else {
          tree = tree.concat(result[1]);
        }
      }
    });

    return tree;
  }
  formatSymbol(text, list, lineno){
    lineno = lineno || 0;
    let symbol = '';
    let symbolLen = 0;
    let res;
    let index;
    let left;
    let flag = true;
    let result = [];
    let count = 0;
    let content;
    list.forEach(item => {
      // 左引号
      if(symbol === ''){
        symbol = item;
        symbolLen = symbol.length;
        index = text.indexOf(symbol);
        left = text.slice(0, index);
        text = text.slice(index + symbol.length);
        // 右引号
      } else if(symbol === item){
        // res = this.splitSymbol(text, symbol);
        // left = res.left;
        symbolLen = symbol.length;
        index = text.indexOf(symbol);
        content = text.slice(0, index);
        result.push({
          line: lineno,
          index: count,
          left: left,
          content: content,
          right: '',
          symbol: symbol
        });
        symbol = '';
      }
      count += index + symbol.length;
    });

    result.push({
      line: lineno,
      index: count,
      left: '',
      content: '',
      right: text.slice(index + symbolLen),
      symbol: symbol
    });

    // 如果 符号不是空的, 说明是在左引号前停止
    return [
      symbol,
      result
    ]
  }
  splitSymbol (text, symbol){
    let index = text.indexOf(symbol);
    let nextIndex = text.slice(index + symbol.length).indexOf(symbol);
    let left = text.slice(0, index);
    let content = text.slice(index + symbol.length, nextIndex);
    return {
      index,
      nextIndex,
      left,
      content,
      symbol
    };
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
