"use strict";

const createIgnorer = require("../common/create-ignorer");
const options = require("../main/options");

/**
 * @param {string} filepath
 * @param {{ ignorePath?: string, withNodeModules?: boolean, plugins: object }} opts
 */
function getFileInfo(filepath, opts) {
  let ignored = false;
  const ignorer = createIgnorer(opts.ignorePath, opts.withNodeModules);
  ignored = ignorer.ignores(filepath);

  const inferredParser = options.inferParser(filepath, opts.plugins) || null;

  return {
    ignored,
    inferredParser
  };
}

module.exports = getFileInfo;
