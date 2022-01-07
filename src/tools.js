import * as fs from 'fs';
import path from 'path';

export const getAllPath = (dirname, exceptArr) => {
  const dirArr = fs.readdirSync(dirname);
  const subDirArr = dirArr.map(relativePath => {
    const tmpPath = path.join(dirname, relativePath);
    if (exceptArr) {
      const isExcept = exceptArr.find(e => e === tmpPath);
      if (isExcept) {
        return '';
      }
    }
    if (fs.statSync(tmpPath).isDirectory()) {
      return getAllPath(tmpPath);
    }
    return tmpPath;
  });
  return subDirArr;
};

export const flatten = (arr) => {
  const newArr = [].concat(...arr);
  return newArr.some(Array.isArray) ? flatten(newArr) : newArr;
};
