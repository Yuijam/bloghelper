/** @format */

import * as fs from 'fs';
import path from 'path';
import {POSTS_PATH} from './config';

import {readAllPosts, toBlogContent} from './imageHelper';

const allPosts = readAllPosts();

// toBlogContent
allPosts.map(({content, postName}) => {
  const blogContent = toBlogContent(content);
  fs.writeFileSync(path.join(POSTS_PATH, postName), blogContent);
});
