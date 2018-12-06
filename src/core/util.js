export const isArray = function (o) {
  if (o && typeof o === "object" && isFinite(o.length)) {
    if (o.length >= 0 && o.length === Math.floor(o.length) && o.length < 4294967296) {
      return true;
    }
  }
  return false;
}
export const withOption = function(str, opt) {
  opt = Object.assign({
      _e: each
  }, opt || {});
  var code = 'var methods = this.methods,data = this.data;with(window){with(methods){with(data){with(opt){' + str + '}}}}';
  //console.log(code);
  return new Function('opt', code).bind(this)(opt);
}

export const each = function (source, fn) {
  if (source instanceof Array || isArray(source)) {
    for (var i = 0, len = source.length; i < len; i++) {
      fn.call(source, i, source[i]);
    }
  } else if (source instanceof Object) {
    //var num = 0;
    for (var k in source) {
      fn.call(source, k, source[k]);
    }
  }
}

export const set = function (obj, propName, value, fn) {
  // console.log(obj, propName, value, fn)
  if (obj !== undefined && propName !== undefined) {
    try {
      Object.defineProperty(obj, propName, {
        get: function () {
          return value;
        },
        set: function (newValue) {
          value = newValue;
          fn && fn(newValue);
        },
        enumerable: true,
        configurable: true
      });
    } catch (error) {
      console.log(error, "browser not supported.");
    }
  }
}
export const proxy = function(key) {
  var self = this;
  var newKey = '_' + key;
  var value = self[key];

  if (!self[key]) {
    set(self, key, {});
  }
  try {
    Object.defineProperty(self, newKey, {
      get: function () {
        return value;
      },
      set: function (newValue) {
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  } catch (error) {
    console.log(error, self, arguments, "browser not supported.");
  }
}

export default {
  each,
  isArray,
  set,
  proxy
}
