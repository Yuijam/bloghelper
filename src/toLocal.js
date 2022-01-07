import * as fs from 'fs';
import path from 'path';
import {POSTS_PATH} from './config';
import {readAllPosts, toLocalContent} from './imageHelper';

const allPosts = readAllPosts();

// toLocalContent
allPosts.map(({content, postName}) => {
  const blogContent = toLocalContent(content);
  fs.writeFileSync(path.join(POSTS_PATH, postName), blogContent);
});
