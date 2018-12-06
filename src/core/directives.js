import { each, withOption } from './util';
import { replaceNode } from './vdom';
export const directives = {
  "v-if": {
    bind: function (vm, root, node) {
      this.vm = vm;
      this.root = root;
      this.node = node;
    },
    get: function () {
      this.sent = this.node.getAttribute("v-if");
      this.node.removeAttribute("v-if");
      return this.sent !== null;
    },
    parse: function () {
      this.node.directives = this.node.directives || {};
      this.code = "return " + this.sent;
    },
    insert: function () {
      !withOption.call(this.vm, this.code) && Vue.replaceNode(this.root, this.node, document.createComment(""));
    },
    unbind: function () {
      delete this.vm;
      delete this.root;
      delete this.node;
    }
  },
  "v-show": {
    bind: function (vm, root, node) {
      this.vm = vm;
      this.root = root;
      this.node = node;
    },
    get: function () {
      this.sent = this.node.getAttribute("v-show");
      this.node.removeAttribute("v-show");
      return this.sent !== null;
    },
    parse: function () {
      this.node.directives = this.node.directives || {};
      this.code = "return " + this.sent;
    },
    insert: function () {
      !withOption.call(this.vm, this.code) && replaceNode(this.root, this.node, document.createComment(""));
    },
    unbind: function () {
      delete this.vm;
      delete this.root;
      delete this.node;
    }
  },
  "v-model": {
    bind: function (vm, root, node) {
      this.vm = vm;
      this.root = root;
      this.node = node;
    },
    get: function () {
      this.sent = this.node.getAttribute("v-model");
      this.node.removeAttribute("v-model");
      return this.sent !== '';
    },
    parse: function () {
      this.code = "return " + this.sent;
    },
    insert: function () {
      this.node.value = withOption.call(this.vm, this.code);
    },
    unbind: function () {
      delete this.vm;
      delete this.root;
      delete this.node;
    }
  },
  "v-for": {
    bind: function (vm, root, node) {
      this.vm = vm;
      this.root = root;
      this.node = node;
    },
    get: function () {
      this.sent = this.node.getAttribute("v-for");
      this.node.removeAttribute("v-for");
      this.text = this.node.innerHTML;
      return this.sent !== null;
    },
    parse: function () {
      var sents = this.sent.replace(/\s+/g, " ").split(" in ");
      var left = sents[0].match(/[a-zA-z$_][a-zA-z$_0-9]+/g);//按变量规则取
      var right = sents[1].match(/[a-zA-z$_][a-zA-z$_0-9]+/g);
      this.code = '_e(' + right + ',function(' + left + '){each.apply(this,arguments)});';
    },
    insert: function () {
      var self = this;
      Vue.withOption.call(this.vm, this.code, {
        each: function (index, vo) {
          node = self.node.cloneNode(true);
          node.innerHTML = node.innerHTML.replace(/\{\{(.*?)\}\}/g, function (s, m) {
            return Vue.withOption.call(self.vm, "return " + m, { vo: vo });
          });
          Vue.insertNode(self.node.parentNode, self.node, node);
        }
      });
      Vue.removeNode(this.node.parentNode, this.node);
    },
    unbind: function () {
      delete this.vm;
      delete this.root;
      delete this.node;
    }
  }
}

//以dom为索引以vnode为模板
export const parseDirective = function (vnode, dom) {
  var self = this;
  var list = [];
  var dirs = directives;
  var node, tpl;
  var nums = 0;
  each(dirs, function (key, dir) {
    each(dom.childNodes, function (index, item) {
      node = vnode.childNodes[index];
      if (node && node.nodeType == 1) {
        //vnode只是映射,ignores属性设置在dom上才能持久
        item.ignores = item.ignores || {};
        if (!item.ignores[key]) {
          dir.bind(self, vnode, node);
          if (dir.get()) {
            dir.parse();
            dir.insert();
          } else {
            item.ignores[key] = true;
          }
          dir.unbind();
        }
      }
    });
  });
  return this;
}
//注册指令
export const directive = function (dir, option) {
  var self = this;
  var defaults = {
    bind: function () {
    },
    get: function () {
    },
    parse: function () {
    },
    insert: function () {
    },
    unbind: function () {
    }
  };
  option = Object.assign(option, defaults);
  this.directives = this.directives || {};
  this.directives[dir] = option;
}
export default directives
