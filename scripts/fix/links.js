/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { IS_WINDOWS } from '../../test/utils.js';
import { processData } from '../../test/linter/test-links.js';

/**
 * @param {string} filename
 */
const fixLinks = (filename) => {
  const errors = processData(filename);
  const original = fs.readFileSync(filename, 'utf-8').trim();
  let data = original;

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    data = data.replace(/\r/g, '');
  }

  for (const error of errors) {
    if (error.expected) {
      data = data.replace(error.actual, error.expected);
    }
  }

  if (original !== data) {
    fs.writeFileSync(filename, data + '\n', 'utf-8');
  }
};

export default fixLinks;
