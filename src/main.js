import {Vue} from "./core";
console.log(new Vue({
  el: '#app',
  data: {
    show: false,
    index: 1
  },
  methods: {
    init(){
      console.log(this)
    }
  }
}), [Vue])
