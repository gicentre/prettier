"use strict";

const ignore = require("ignore");
const fs = require("fs");
const path = require("path");

function createIgnorer(ignoreFilePath, withNodeModules) {
  const resolvedIgnoreFilePath = path.resolve(ignoreFilePath);
  let ignoreText = "";

  try {
    ignoreText = fs.readFileSync(resolvedIgnoreFilePath, "utf8");
  } catch (readError) {
    if (readError.code !== "ENOENT") {
      throw new Error(
        `Unable to read ${resolvedIgnoreFilePath}: ${readError.message}`
      );
    }
  }

  const ignorer = ignore().add(ignoreText);
  if (!withNodeModules) {
    ignorer.add("node_modules");
  }
  return ignorer;
}

module.exports = createIgnorer;
