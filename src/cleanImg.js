import * as fs from 'fs';
import path from 'path';
import {POSTS_PATH, IMAGE_PATH, BLOG_ROOT_PATH, EXCEPT_PATH} from './config';
import {getAllPath, flatten} from './tools';
import {readAllPosts, getAllImagePaths, isBlogPath, isNetPath, isLocalPath} from './imageHelper';

const allPosts = readAllPosts();

const allImagePaths = allPosts.map(({content, postName}) => {
  return getAllImagePaths(content);
});

const allPostImgPath = flatten(allImagePaths);
// console.log(allPostImgPath);

const allDirPath = getAllPath(IMAGE_PATH, EXCEPT_PATH);
const allImgPathArr = flatten(allDirPath);
// console.log(allImgPathArr);
allImgPathArr.map(imgPath => {
  const using = allPostImgPath.find(p => {
    if (isNetPath(p)) {
      return false;
    }

    if (isBlogPath(p)) {
      const absPath = path.join(BLOG_ROOT_PATH, p);
      return imgPath === absPath;
    }
    return p === imgPath;
  });
  if (!using) {
    // fs.unlinkSync(imgPath);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
      // console.log(imgPath);
    }
    // console.log(fs.existsSync(imgPath));
  }
});
