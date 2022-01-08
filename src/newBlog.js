/** @format */

import readline from 'readline';
import path from 'path';
import fs from 'fs';
import config from './config.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const header = `---
layout: post
title: INPUT_TITLE
tags: [INPUT_TAGS]
---
`;

const getFilename = title => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const newTitle = title.trim().replaceAll(/\s+/g, '-');
  return `${year}-${month}-${day}-${newTitle}.md`;
};

const getFileHeader = (title, tags) => header.replace('INPUT_TITLE', title.trim()).replace('INPUT_TAGS', tags);

rl.question(`Input The Title: \n`, title => {
  const filename = getFilename(title);
  rl.question(`Input The Tags (press Enter if not necessary) \n`, tags => {
    const filepath = path.join(config.POSTS_PATH, filename);
    const fileHeader = getFileHeader(title, tags);
    fs.writeFileSync(filepath, fileHeader);
    rl.close();
  });
});
