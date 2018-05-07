"use strict";

const createIgnorer = require("../common/create-ignorer");
const options = require("../main/options");

/**
 * @param {string} filepath
 * @param {{ ignorePath?: string, withNodeModules?: boolean, plugins: object }} opts
 */
function getFileInfo(filepath, opts) {
  opts = opts || {};

  let ignored = false;
  if (opts.ignorePath) {
    const ignorer = createIgnorer(opts.ignorePath, opts.withNodeModules);
    ignored = ignorer.ignores(opts.filepath);
  }

  const inferredParser =
    options.inferParser(opts.filepath, opts.plugins) || null;

  return {
    ignored,
    inferredParser
  };
}

module.exports = getFileInfo;
