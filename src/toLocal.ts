/** @format */

import * as fs from 'fs';
import path from 'path';
import {readAllPosts, toLocalContent, POSTS_PATH} from './imageHelper';

const allPosts = readAllPosts();

// toLocalContent
allPosts.map(({content, postName}) => {
  const blogContent = toLocalContent(content);
  fs.writeFileSync(path.join(POSTS_PATH, postName), blogContent);
});
