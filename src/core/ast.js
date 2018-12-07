
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
    // this.grammar(this.termsTree);
  }
  terms(){
    this.lines = this.annotation(this.lines);
    // this.termsTree = this.parseTermsTree(this.lines);
    this.termsTree = this.buildTermsTree(this.lines);
  }
  parseTermsTree(lines){
    return '';
  }
  grammar(lines){
    let content = '__C__';
    let mode = '';
    lines = lines || this.lines;
    lines.forEach(item => {
      item = this.restoreByTermsTree([item], content, '');
      if(!this.Statement(item, content)){
        if(!this.Function(item, content)){
        } else {
          mode = 'function';
        }
      } else {
        mode = 'statement';
      }
  })
  }
  Statement(str, content){
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
    let res = str.match(/^(var|let|const)\s+(.*?)\s{0,}([=,;])\s{0,}(.*?)(,|;|)$/);
    if(res){
      value = this.parseStatementValue(res);
      this.grammarTree.push({
        mode: res[1],
        name: res[2],
        type: res[3],
        value: res[4],
        end: res[5],
        result: res
      });
      this.log('@parseStatement result?', str, res, value);
    } else {
      value = this.parseStatementValue(result);
      this.grammarTree.push({
        mode: result[1],
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
  Function(str, content){
    // 查找 var|let|const ..
    let result = str.match(/function\s+(.*?)\s{0,}/);
    // 如果找到, 说明是声明语句, 继续解析
    if (result) {
      return this.parseFunction(result);
    } else {
      return false;
    }
  }
  parseFunction(result){

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
  buildTermsTree(lines){
    let stringTree = this.formatString(lines);
    return stringTree
  }
  createRegExp(map, mode){
    let obj = {};
    let text = [];
    for(let key in map){
      if(map.hasOwnProperty(key)){
        if(!obj[key]){
          obj[key] = 1;
          text.push(key);
        }
        if(!obj[map[key]]){
          obj[map[key]] = 1;
          text.push(map[key]);
        }
      }
    }
    return new RegExp( '(' + text.join("|") + ')', mode);
  }
  // 处理字符串
  formatString(lines, map){
    map = map || {
      '\'': '\'',
      '"': '"'
      // ,'{': '}'
    }
    lines = lines || this.lines || [];
    let symbol;
    let group = [];
    let list = [];
    let type = 'line';
    let symbols = [];
    let text = '';
    let blockno = 0;
    let count = 0;
    let reg = this.createRegExp(map, 'g');

    lines.forEach((item, lineno) => {
      if (item) {
        reg.lastIndex = 0;
        symbols = item.match(reg) || [];
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
              symbol: '',
              scope: '',
              type: type,
              t: 0
            }]);
          }
        } else if(symbols.length === 1){
          // 如果是段落
          if(type === 'block'){
            // 如果符号可以匹配 右引号
            
            if(map[symbol] === symbols[0]){
              let index = item.indexOf(map[symbol]);
              text += '\n' + item.slice(0, index);
              group.push({
                line: blockno,
                left: '',
                index: index,
                content: text,
                right: '',
                symbol: map[symbol],
                scope: symbol,
                type: type,
                t:1
              });
              if(index + symbol.length < item.length - 1){
                group.push({
                  line: blockno,
                  left: '',
                  content: '',
                  right: item.slice(index + map[symbol].length),
                  symbol: map[symbol],
                  scope: symbol,
                  type: type,
                  t:2
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
              symbol: '',
              scope: symbol,
              type: type,
              t:4
            });
            // map[symbol]
            text += item.slice(item.indexOf(symbol) + symbol.length);
          }
        // 找到多个
        } else {
          let result = this.formatSymbol(item, symbols, map, lineno);
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
      }
    });
    // 符号没有闭合
    if(symbol !== ''){
      
    }
    return list;
  }
  /**
   * 还原字符串
   * @param {array} tree 经过处理字符串函数buildTermsTree后的数据 数据结构[[{}]]
   * @param {string=} content 是否用指定字符占位 (传递 空字符串 或 非字符串时, 将使用默认值, 不传则使用原始文本)
   */
  restoreByTermsTree(tree, content, segmentation){
    let text = '';
    segmentation = arguments.length > 2 ? typeof segmentation === 'string' ? segmentation : '\n' : '\n';
    content = arguments.length > 1 ? typeof content === 'string' ? content : '__CONTENT__' : '';
    tree = tree || this.termsTree || [];
    tree.forEach(line => {
      (line || []).forEach(item => {
        if(item.symbol){
          text += item.left + (item.symbol !== item.scope ? item.scope: item.symbol) + (content || item.content) + item.symbol + item.right;
        } else {
          text += item.left + item.right;
        }
      });
      text += segmentation;
    });
    return text;
  }

  formatFunction(lines){

  }

  formatBlock(lines){
    lines = lines || this.lines;
    lines.forEach(item => {
      
    })
  }
  
  formatSymbol(text, list, map, lineno){
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
      // debugger
      // 左引号
      if(symbol === ''){
        symbol = item;
        symbolLen = symbol.length;
        index = text.indexOf(symbol);
        left = text.slice(0, index);
        text = text.slice(index + symbol.length);
        // 右引号
      } else if(map[symbol] === item){

        symbolLen = map[symbol].length;
        index = text.indexOf(map[symbol]);
        content = text.slice(0, index);
        result.push({
          line: lineno,
          index: count,
          left: left,
          content: content,
          right: '',
          symbol: symbol,
          scope: symbol,
          type: 'line',
          t: 5
        });
        symbol = '';
      }
      count += index + symbolLen;
    });

    result.push({
      line: lineno,
      index: count,
      left: '',
      content: '',
      right: text.slice(index + symbolLen),
      symbol: symbol,
      scope: symbol,
      type: 'line',
      t: 6
    });

    // 如果 符号不是空的, 说明是在左引号前停止
    return [
      symbol,
      result
    ]
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

