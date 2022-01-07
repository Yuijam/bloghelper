import path from 'path';

export const BLOG_ROOT_PATH = 'D://code/blog/type-theme-master';
export const POSTS_PATH = path.join(BLOG_ROOT_PATH, '_posts');
export const IMAGE_PATH = path.join(BLOG_ROOT_PATH, 'images');
export const EXCEPT_PATH = [
  path.join(BLOG_ROOT_PATH, 'images', 'about'),
  // path.join(BLOG_ROOT_PATH, 'images', 'Computer-Networking'),
  // path.join(BLOG_ROOT_PATH, 'images', 'Docker-note'),
  // path.join(BLOG_ROOT_PATH, 'images', 'k8s'),
];
