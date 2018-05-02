"use strict";

const createIgnorer = require("../common/create-ignorer");
const fs = require("fs");
const options = require("../main/options");

function getFileInfo(filePath, opts, ignorePath, doNotIgnoreNodeModules) {
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch (e) {
    // file / dir at filePath does not exist - no need to handle
  }
  const exists = (stats && stats.isFile()) || false;

  const ignorer = createIgnorer(ignorePath, doNotIgnoreNodeModules);
  const ignored = ignorer.ignores(filePath);

  const normalizedOpts = options.normalize(
    Object.assign({}, opts, { filepath: filePath })
  );
  const inferredParser =
    options.inferParser(filePath, normalizedOpts.plugins) || null;

  return {
    exists,
    ignored,
    inferredParser
  };
}

module.exports = getFileInfo;
