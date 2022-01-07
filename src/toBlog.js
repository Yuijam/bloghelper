/** @format */

import * as fs from 'fs';
import path from 'path';
import config from './config.js';

// import {readAllPosts, toBlogContent} from './imageHelper.js';
import imageHelper from './imageHelper.js';

const allPosts = imageHelper.readAllPosts();
console.log(allPosts);
// toBlogContent
// allPosts.map(({content, postName}) => {
//   const blogContent = toBlogContent(content);
//   fs.writeFileSync(path.join(POSTS_PATH, postName), blogContent);
// });
