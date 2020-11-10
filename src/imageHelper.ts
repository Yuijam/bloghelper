/** @format */

import * as fs from 'fs';
import path from 'path';

const BLOG_ROOT_PATH = '.';
export const POSTS_PATH = path.join(BLOG_ROOT_PATH, '_posts');

const isNetPath = (imgPath: string) => imgPath.slice(0, 4) === 'http';
const isBlogPath = (imgPath: string) => imgPath.startsWith('/images');
const isLocalPath = (imgPath: string) => !isNetPath(imgPath) && !isBlogPath(imgPath);

const flatten = (arr: any[]): any[] => {
  const newArr = [].concat(...arr);
  return newArr.some(Array.isArray) ? flatten(newArr) : newArr;
};

export const readAllPosts = () =>
  fs.readdirSync(POSTS_PATH).map(name => ({
    content: fs.readFileSync(path.join(POSTS_PATH, name), 'utf8'),
    postName: name,
  }));

const getAllImagePaths = (str: string) => {
  const imageTagsReg = /\!\[.*?\].*?(png|jpg)\)/gi; // 问号一个不能少，表示非贪心
  const imageTags = str.match(imageTagsReg);

  if (!imageTags) {
    return [];
  }

  const pathReg = /\(.+\)/g; // 提取括号以及括号中内容
  const pathsWithParentheses = flatten(imageTags.map(item => item.match(pathReg)));
  const paths = pathsWithParentheses.map(item => item.slice(1, -1));
  return paths;
};

const getPostImgDirPath = (postName: string) => path.join(__dirname, 'images', postName);

const isPostImgDirExist = (postName: string) => fs.existsSync(getPostImgDirPath(postName));

const toPostImgPath = (originPath: string, postName: string) => {
  const filename = path.basename(originPath);
  return path.join(getPostImgDirPath(postName), filename);
};

const toPostImgBlogPath = (imgPath: string, postName: string) => {
  const res = toPostImgPath(imgPath, postName).match(/.images.*/g);
  if (!res) {
    console.log(`${imgPath}, ${postName}: image blog path convert failed`);
    return '';
  }
  return res[0];
};

const moveFileToPostImgDir = (imgPath: string, postName: string) => {
  if (!fs.existsSync(imgPath)) {
    throw `${imgPath} is not exist!`;
  }

  if (!isPostImgDirExist(postName)) {
    fs.mkdirSync(getPostImgDirPath(postName));
  }

  // fs.renameSync(imgPath, toPostImgPath(imgPath, postName));
  fs.copyFileSync(imgPath, toPostImgPath(imgPath, postName));
};

const toBlogPath = (imgPath: string, postName: string) => {
  if (!isLocalPath(imgPath)) {
    return imgPath;
  }

  moveFileToPostImgDir(imgPath, postName);
  return toPostImgBlogPath(imgPath, postName);
};

const toLocalPath = (imgPath: string) => {
  if (isLocalPath(imgPath)) {
    return imgPath;
  }
  return path.join(__dirname, imgPath);
};

const getPostTitle = (content: string) => {
  const headerTag = '---';
  const start = content.indexOf(headerTag);
  const end = content.indexOf(headerTag, start + headerTag.length);
  const header = content.substring(start + headerTag.length, end);
  const titleTag = header.split('\n').find(str => str.includes('title'));
  if (!titleTag) {
    throw `title not found!${content.substring(0, 30)}`;
  }
  return titleTag.split(':')[1].trim();
};

export const toBlogContent = (content: string) => {
  const allImagePaths = getAllImagePaths(content);
  return allImagePaths.reduce((acc, cur) => {
    const postName = getPostTitle(content);
    const blogPath = toBlogPath(cur, postName);
    return acc.replace(cur, blogPath);
  }, content);
};

export const toLocalContent = (content: string) => {
  const allImagePaths = getAllImagePaths(content);
  return allImagePaths.reduce((acc, cur) => {
    const localPath = toLocalPath(cur);
    return localPath === cur ? acc : acc.replace(cur, localPath);
  }, content);
};
