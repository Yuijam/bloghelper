/** @format */

import * as fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import config from './config.js';
import tools from './tools.js';

const isNetPath = imgPath => imgPath.slice(0, 4) === 'http';
const isBlogPath = imgPath => imgPath.startsWith('/images') || imgPath.startsWith('\\images');
const isLocalPath = imgPath => !isNetPath(imgPath) && !isBlogPath(imgPath);

const readAllPosts = () =>
  fs.readdirSync(config.POSTS_PATH).map(name => ({
    content: fs.readFileSync(path.join(config.POSTS_PATH, name), 'utf8'),
    postName: name,
  }));

const getAllImagePaths = str => {
  const imageTagsReg = /\!\[.*?\].*?(png|jpg|webp|jpeg|gif)\)/gi; // 问号一个不能少，表示非贪心
  const imageTags = str.match(imageTagsReg);

  if (!imageTags) {
    return [];
  }

  const pathReg = /\(.+\)/g; // 提取括号以及括号中内容
  const pathsWithParentheses = tools.flatten(imageTags.map(item => item.match(pathReg)));
  const paths = pathsWithParentheses.map(item => item.slice(1, -1));
  return paths;
};

const getPostImgDirPath = postName => path.join(config.BLOG_ROOT_PATH, 'images', postName);

const isPostImgDirExist = postName => fs.existsSync(getPostImgDirPath(postName));

const isPostImgExistInDir = (imgPath, postName) => fs.existsSync(toPostImgPath(imgPath, postName));

const toPostImgPath = (originPath, postName) => {
  const filename = path.basename(originPath);
  const idx = filename.lastIndexOf('.');
  const realFilename = filename.slice(0, idx);
  return path.join(getPostImgDirPath(postName), realFilename + '.webp');
};

const toPostImgBlogPath = (imgPath, postName) => {
  const res = toPostImgPath(imgPath, postName).match(/.images.*/g);
  if (!res) {
    console.log(`${imgPath}, ${postName}: image blog path convert failed`);
    return '';
  }
  return res[0];
};

const isWebp = imgPath => imgPath.slice(-4) === '.webp';

const webpQulity = fileSizeInBytes => {
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
  if (fileSizeInMegabytes > 2) {
    return 20;
  }
  return 80;
};

const moveFileToPostImgDir = (imgPath, postName) => {
  console.log(imgPath, postName);
  if (!fs.existsSync(imgPath)) {
    throw `${imgPath} is not exist!`;
  }

  if (!isPostImgDirExist(postName)) {
    fs.mkdirSync(getPostImgDirPath(postName));
  }

  if (isPostImgExistInDir(imgPath, postName) && isWebp(imgPath)) {
    return;
  }

  const newImgPath = toPostImgPath(imgPath, postName);

  const stats = fs.statSync(imgPath);
  // Convert the file size to megabytes (optional)
  const fileSizeInMegabytes = stats.size / (1024 * 1024);
  sharp(imgPath)
    .webp({quality: webpQulity(fileSizeInMegabytes)})
    .toFile(newImgPath) // 记住了，不能在生成webp图片的时候，删除掉原来的图，如果是原本就在images下的还好，如果是博客目录之外的就会删掉原图
    .catch(function (err) {
      console.log(err);
    });
};

const toBlogPath = (imgPath, postName) => {
  if (!isLocalPath(imgPath)) {
    return imgPath;
  }

  if (!isWebp(imgPath)) {
    moveFileToPostImgDir(imgPath, postName);
  }
  return toPostImgBlogPath(imgPath, postName);
};

const toLocalPath = imgPath => {
  if (isLocalPath(imgPath) || isNetPath(imgPath)) {
    return imgPath;
  }
  return path.join(config.BLOG_ROOT_PATH, imgPath);
};

const getPostTitle = content => {
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

const toBlogContent = content => {
  const allImagePaths = getAllImagePaths(content);
  return allImagePaths.reduce((acc, cur) => {
    const postName = getPostTitle(content);
    const blogPath = toBlogPath(cur, postName);
    return acc.replace(cur, blogPath);
  }, content);
};

const toLocalContent = content => {
  const allImagePaths = getAllImagePaths(content);
  return allImagePaths.reduce((acc, cur) => {
    const localPath = toLocalPath(cur);
    return localPath === cur ? acc : acc.replace(cur, localPath);
  }, content);
};

export default {
  isNetPath,
  isBlogPath,
  isLocalPath,
  readAllPosts,
  getAllImagePaths,
  toBlogContent,
  toLocalContent,
};
