"use strict";

const createIgnorer = require("../common/create-ignorer");
const fs = require("fs");
const options = require("../main/options");

/** @param {{filepath: string, ignorePath: string, withNodeModules: boolean ...otherOptions }} opts */
function getFileInfo(opts) {
  let stats;
  try {
    stats = fs.statSync(opts.filepath);
  } catch (e) {
    // file / dir at filePath does not exist - no need to handle
  }
  const exists = (stats && stats.isFile()) || false;

  let ignored = false;
  if (opts.ignorePath) {
    const ignorer = createIgnorer(opts.ignorePath, opts.withNodeModules);
    ignored = ignorer.ignores(opts.filepath);
  }

  const inferredParser =
    options.inferParser(opts.filepath, opts.plugins) || null;

  return {
    exists,
    ignored,
    inferredParser
  };
}

module.exports = getFileInfo;
