"use strict";

const createIgnorer = require("../common/create-ignorer");
const options = require("../main/options");

function getFileInfo(filePath, opts, ignorePath, doNotIgnoreNodeModules) {
  const normalizedOpts = options.normalize(
    Object.assign({}, opts, { filepath: filePath })
  );
  const inferredParser = options.inferParser(filePath, normalizedOpts.plugins);

  const ignorer = createIgnorer(ignorePath, doNotIgnoreNodeModules);

  const parser = inferredParser || normalizedOpts.parser;
  const parserIsFallback = inferredParser !== normalizedOpts.parser;
  const ignored = ignorer.ignores(filePath);
  const formattable = parser && !parserIsFallback && !ignored;

  return {
    parser,
    parserIsFallback,
    ignored,
    formattable
  };
}

module.exports = getFileInfo;
