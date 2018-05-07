"use strict";

const createIgnorer = require("../common/create-ignorer");
const options = require("../main/options");

/**
 * @param {string} filePath
 * @param {{ ignorePath?: string, withNodeModules?: boolean, plugins: object }} opts
 *
 * Please note that prettier.getFileInfo() expects opts.plugins to be an array of paths,
 * not an object. A transformation from this array to an object is automatically done
 * internally by the method wrapper. See withPlugins() in index.js.
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
