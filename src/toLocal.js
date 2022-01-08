/** @format */

import * as fs from 'fs';
import path from 'path';
import config from './config.js';
import imageHelper from './imageHelper.js';

const allPosts = imageHelper.readAllPosts();

// toLocalContent
allPosts.map(({content, postName}) => {
  const blogContent = imageHelper.toLocalContent(content);
  fs.writeFileSync(path.join(config.POSTS_PATH, postName), blogContent);
});
