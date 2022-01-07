/** @format */

import path from 'path';

const BLOG_ROOT_PATH = '/Users/yuijam/Documents/yuijam.github.io';
const POSTS_PATH = path.join(BLOG_ROOT_PATH, '_posts');
const IMAGE_PATH = path.join(BLOG_ROOT_PATH, 'images');
const EXCEPT_PATH = [
  path.join(BLOG_ROOT_PATH, 'images', 'about'),
  // path.join(BLOG_ROOT_PATH, 'images', 'Computer-Networking'),
  // path.join(BLOG_ROOT_PATH, 'images', 'Docker-note'),
  // path.join(BLOG_ROOT_PATH, 'images', 'k8s'),
];

export default {
  BLOG_ROOT_PATH,
  POSTS_PATH,
  IMAGE_PATH,
  EXCEPT_PATH,
};
