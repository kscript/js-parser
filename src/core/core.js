import { trim, trimLeft, trimRight} from './util';

export class Core {
  constructor(content, option){
    this.content = content;
    this.option = option;
    this.trim = trim;
    this.trimLeft = trimLeft;
    this.trimRight = trimRight;
  }
}
export default {
  Core
}
