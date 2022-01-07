/** @format */

import * as fs from 'fs';
// import path from 'path';

const content = fs.readFileSync('./2020-02-24-双缝干涉实验.md', 'utf8');
// const start = content.indexOf('---');
const str = content.substring(3, 10);
// const res = content.match(/---.*---/g);
const getAllIndexOf = (s, t) => {
  const start = s.indexOf(t);
  const end = s.indexOf(t, start + t.length);
  return [start, end];
};
const [start, end] = getAllIndexOf(content, '---');
console.log(start, end);
const substr = content.substring(start + 3, end);
console.log(substr);
const arr = substr.split('\n');
// const title = arr
//   .find(str => str.includes('title'))
//   .split(':')[1]
//   .trim();
// console.log(title);
