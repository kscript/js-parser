export const verify = (str) => {
  return str = typeof str === 'string'? str : '';
}
export const trim = (str) => {
  return verify(str).replace(/(^\s+|\s+$)/, '');
}
export const trimLeft = (str) => {
  return verify(str).replace(/^\s+/, '');
}
export const trimRight = (str) => {
  return verify(str).replace(/(^\s+|\s+$)/, '');
}

export default {
  trim,
  trimLeft,
  trimRight
}
