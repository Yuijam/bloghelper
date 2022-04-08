/** @format */

import * as fs from 'fs';
import path, {resolve} from 'path';
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

const execImgRe = (re, str) => {
  const paths = [];
  while (true) {
    const res = re.exec(str);
    if (res && res[1]) {
      paths.push(res[1]);
    } else {
      break;
    }
  }
  return paths;
};
const getAllImagePaths = str => {
  const re = /!\[.*\]\((.*)\)/g;
  const re1 = /<img src="(.*?)".*\/>/g;

  const reArr = [re, re1];
  const paths = reArr.flatMap(r => execImgRe(r, str));
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

const toPostImgBlogPath = imgPath => imgPath.replace(config.IMAGE_ROOT_PATH, '');

const isWebp = imgPath => imgPath.match(/.webp$/gi);

const webpQulity = fileSizeInBytes => {
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
  if (fileSizeInMegabytes > 2) {
    return 20;
  }
  return 80;
};

const moveFileToPostImgDir = async (imgPath, postName) => {
  // decodeURI 用来处理有目录的路径，有个时候会出现%20这样的字符串，这种路径无法成功读取
  imgPath = decodeURI(imgPath);
  if (!fs.existsSync(imgPath)) {
    throw `${postName}: ${imgPath} is not exist!`;
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
  try {
    await sharp(imgPath)
      .webp({quality: webpQulity(fileSizeInMegabytes)})
      .toFile(newImgPath); //记住了，不能在生成webp图片的时候，删除掉原来的图，如果是原本就在images下的还好，如果是博客目录之外的就会删掉原图
  } catch (err) {
    console.log(`Error on to webp: imgPath = ${imgPath}, postName = ${postName} newImgPath = ${newImgPath}, ${err}`);
  }
  return newImgPath;
};

const toBlogPath = async (imgPath, postName) => {
  if (!isLocalPath(imgPath)) {
    return imgPath;
  }

  if (!isWebp(imgPath)) {
    const newPath = await moveFileToPostImgDir(imgPath, postName);
    return toPostImgBlogPath(newPath);
  }

  return toPostImgBlogPath(imgPath);
};

const isPosixPath = p => p.includes('/');

const toLocalPath = imgPath => {
  if (isLocalPath(imgPath) || isNetPath(imgPath)) {
    return imgPath;
  }

  if (!isPosixPath(imgPath)) {
    imgPath = imgPath.split('\\').join('/');
  }
  return path.join(config.IMAGE_ROOT_PATH, imgPath);
};

const getPostTitle = content => {
  const re = /---[\s\S]*title:(.*)[\s\S]*---/;
  const res = re.exec(content);
  if (res) {
    if (res[1]) {
      return res[1].trim();
    } else {
      throw `check the title of ${content.substring(0, 30)}`;
    }
  }
  throw `title not found ${content.substring(0, 30)}`;
};

const toBlogContent = async content => {
  const allImagePaths = getAllImagePaths(content);
  if (allImagePaths.length === 0) {
    return content;
  }

  const postName = getPostTitle(content);
  const newPathsPromise = allImagePaths.map(async cur => await toBlogPath(cur, postName));
  const newPaths = await Promise.all(newPathsPromise);
  let res = content;
  allImagePaths.map((path, index) => {
    const newPath = newPaths[index];
    if (!newPath) {
      throw `${path} newPath not exist`;
    }
    res = res.replace(path, newPath);
  });

  // 以防忘记
  // 这里主要是有个时候图片的alt里面的内容太复杂的话，解析会有问题，他有可能不会解析成img标签
  // 图片就无法显示，所以干脆alt里的内容全部清空掉
  // 解释下下面两行，首先re会匹配到一个图片字符串的前面和后面两部分，需要的是把前面那部分[]中的内容置空
  // $2表示匹配到的后面那部分，这里原封不动的返回
  const removeImgAltRe = /(!\[.*\])(\(.*\))/g;
  res = res.replaceAll(removeImgAltRe, '![]$2');
  return res;
};

const toLocalContent = content => {
  const allImagePaths = getAllImagePaths(content);
  if (allImagePaths.length === 0) {
    return content;
  }

  return allImagePaths.reduce((acc, cur) => {
    const localPath = toLocalPath(cur);
    // console.log(localPath);
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
