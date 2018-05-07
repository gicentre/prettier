"use strict";

const createIgnorer = require("../common/create-ignorer");
const options = require("../main/options");

/**
 * @param {string} filePath
 * @param {{ ignorePath?: string, withNodeModules?: boolean, plugins: object }} opts
 */
function getFileInfo(filePath, opts) {
  let ignored = false;
  const ignorer = createIgnorer(opts.ignorePath, opts.withNodeModules);
  ignored = ignorer.ignores(filePath);

  const inferredParser = options.inferParser(filePath, opts.plugins) || null;

  return {
    ignored,
    inferredParser
  };
}

module.exports = getFileInfo;
