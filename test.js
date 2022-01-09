/** @format */

import * as fs from 'fs';
// import path from 'path';

// const content = fs.readFileSync('./2020-02-24-双缝干涉实验.md', 'utf8');
// const start = content.indexOf('---');
// const str = content.substring(3, 10);
// const res = content.match(/---.*---/g);
// const getAllIndexOf = (s, t) => {
//   const start = s.indexOf(t);
//   const end = s.indexOf(t, start + t.length);
//   return [start, end];
// };
// const [start, end] = getAllIndexOf(content, '---');
// console.log(start, end);
// const substr = content.substring(start + 3, end);
// console.log(substr);
// const arr = substr.split('\n');
// const title = arr
//   .find(str => str.includes('title'))
//   .split(':')[1]
//   .trim();
// console.log(title);

// let str = '--- title: hellowld ---';
// const re = /---[\s\S]*title:(.*)[\s\S]*---/;
// let res = re.exec(str);
// console.log(res);

// const imgPat1 = '![image-20210213192139190](images/k8s/image-20210213192139190.png)'; // blog image
// const imgPat2 = '![](https://i.loli.net/2020/01/02/1x2kGIKEMQvgLnD.jpg)'; // net image
// const imgPat3 = '![image-20210213192139190](User/kobe/Documents/images/k8simage-20210213192139190.webp)'; // local image
// const imgPat4 = '<img src="/Users/sophie/Downloads/IMG_4158.jpg" alt="IMG_4158" style="zoom:50%;" />';

// const imgRe = /!\[.*\]\((.*)\)/;
// let res1 = imgRe.exec(imgPat1);
// let res2 = imgRe.exec(imgPat2);
// let res3 = imgRe.exec(imgPat3);
// console.log('res1', res1[1]);
// console.log('res2', res2[1]);
// console.log('res3', res3[1]);

// const imgRe1 = /<img src="(.*?)".*\/>/;
// let res4 = imgRe1.exec(imgPat4);
// console.log(res4[1]);

// let title = '  hello   reaor fdaf ';
// title = title.trim().replaceAll(/\s+/g, '-');
// console.log(title);

// let content = `

// ![[异域动漫发布]24[00_00_49][20130913-163608-0].JPG](/images/Test hellow/[异域动漫发布]24[00_00_49][20130913-163608-0].webp)

// say something~~~~

// hellow rold

// ![afdfaf](/images/Test hellow/[異域字幕組][銀魂2][Gi[00_05_07][20140207-143014-0].webp)

// `;

// let re = /(!\[.*\])(\(.*\))/g;
// // let ress = re.exec(content);
// // console.log(ress);
// const rrr = content.replaceAll(re, '![]$2');
// console.log(rrr);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

const p = '/Users/yuijam/Library/Application%20Support/marktext/images/2022-01-09-11-53-39-image.png';
const p1 = decodeURI(p);
console.log(p1);
const re = fs.existsSync(p1);
console.log(re);
