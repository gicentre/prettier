"use strict";

const runPrettier = require("../runPrettier");
const EOL = require("os").EOL;

describe("automatically loads 'prettier-plugin-*' from --plugin-search-dir", () => {
  runPrettier("plugins/automatic", [
    "file.txt",
    "--parser=foo",
    `--plugin-search-dir=.`
  ]).test({
    stdout: "foo+contents" + EOL,
    stderr: "",
    status: 0,
    write: []
  });
});

describe("automatically loads '@prettier/plugin-*' from --plugin-search-dir", () => {
  runPrettier("plugins/automatic", [
    "file.txt",
    "--parser=bar",
    `--plugin-search-dir=.`
  ]).test({
    stdout: "bar+contents" + EOL,
    stderr: "",
    status: 0,
    write: []
  });
});
