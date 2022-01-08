/** @format */

import * as fs from 'fs';
import path from 'path';
import config from './config.js';

import imageHelper from './imageHelper.js';

const allPosts = imageHelper.readAllPosts();
// toBlogContent
allPosts.map(async ({content, postName}) => {
  const blogContent = await imageHelper.toBlogContent(content);
  fs.writeFileSync(path.join(config.POSTS_PATH, postName), blogContent);
});
