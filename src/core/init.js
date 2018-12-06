import { each, set } from './util';
import { replaceNode } from './vdom';
import directives, { directive, parseDirective } from './directives';
const Cache = {
    uid: [],
    count: 0,
    getOption: function (uid, key) {
        return Cache.uid[uid][key];
    },
    setOption: function (uid, key, val) {
        Cache.uid[uid][key] = val;
    }
}
const init = {
    directives: directives,
    subscriber: function(){
        console.log(this, arguments);
    },
    initOption: function (option) {
        if (option.el) {
            this.el = document.querySelector(option.el);
        }
        init.createUid.call(this);
        // proxy.call(this, 'data');
        set.call(this, this, 'data', {}, init.subscriber.bind(this));
        init.bindData.call(this, this, 'data', option.data);
        init.bindMethod.call(this, 'methods', option.methods);
        init.bindMethod.call(this, 'filters', option.filters);
        init.bindMethod.call(this, 'computed', option.computed);
        init.parseTpl.call(this);
    },
    bindData(obj, k, propertys) {
        let target = obj[k];
        propertys = propertys || {};
        each(propertys, (key, item) => {
            set.call(this, target, key, item, init.subscriber.bind(this));
            //如果值为对象,继续绑定
            if (item instanceof Object) {
                init.bindData.call(this, target, key, item);
            }
        });
        return this;
    },
    bindMethod(k, methods) {
        this[k] = {};
        each(methods, (index, item) => {
            if (item instanceof Function) {
                this.methods[index] = item;
            }
        })
        return this;
    },

    parseTpl() {
        var data = this.data;
        var dom = Cache.getOption(this.uid, 'dom');
        if(!dom){
            dom = this.el.cloneNode(true);
            Cache.setOption(this.uid, 'dom', dom);
        }
        var vnode = dom.cloneNode(true);
        parseDirective.call(this, vnode, dom);
        replaceNode.call(this, this.el.parentNode, this.el, vnode);
        this.el = vnode;
    },
    createUid() {
        Cache.count = Cache.count || 0;
        Cache.uid[Cache.count] = {
            vm: this
        };
        this.uid = Cache.count++;
        return this;
    }
}


export default init;
