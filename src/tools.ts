/** @format */

import * as fs from 'fs';
import path from 'path';

type DeepArray<T> = (T | DeepArray<T>)[];

export const getAllPath = (dirname: string, exceptArr?: string[]): DeepArray<string> => {
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

export const flatten = (arr: any[]): any[] => {
  const newArr = [].concat(...arr);
  return newArr.some(Array.isArray) ? flatten(newArr) : newArr;
};
