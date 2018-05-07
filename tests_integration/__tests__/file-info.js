"use strict";

const path = require("path");

const runPrettier = require("../runPrettier");
const prettier = require("../../tests_config/require_prettier");

expect.addSnapshotSerializer(require("../path-serializer"));

describe("extracts file-info for a js file", () => {
  runPrettier("cli/", ["--file-info", "something.js"]).test({
    status: 0
  });
});

describe("extracts file-info for a markdown file", () => {
  runPrettier("cli/", ["--file-info", "README.md"]).test({
    status: 0
  });
});

describe("extracts file-info for a known markdown file with no extension", () => {
  runPrettier("cli/", ["--file-info", "README"]).test({
    status: 0
  });
});

describe("extracts file-info with ignored=true for a file in .prettierignore", () => {
  runPrettier("cli/ignore-path/", ["--file-info", "regular-module.js"]).test({
    status: 0
  });
});

describe("extracts file-info with ignored=true for a file in a hand-picked .prettierignore", () => {
  runPrettier("cli/", [
    "--file-info",
    "regular-module.js",
    "--ignore-path=ignore-path/.prettierignore"
  ]).test({
    status: 0
  });
});

describe("extracts file-info for a file in not_node_modules", () => {
  runPrettier("cli/with-node-modules/", [
    "--file-info",
    "not_node_modules/file.js"
  ]).test({
    status: 0
  });
});

describe("extracts file-info with with ignored=true for a file in node_modules", () => {
  runPrettier("cli/with-node-modules/", [
    "--file-info",
    "node_modules/file.js"
  ]).test({
    status: 0
  });
});

describe("extracts file-info with ignored=false for a file in node_modules when --with-node-modules provided", () => {
  runPrettier("cli/with-node-modules/", [
    "--file-info",
    "node_modules/file.js",
    "--with-node-modules"
  ]).test({
    status: 0
  });
});

describe("extracts file-info with inferredParser=null for file.foo", () => {
  runPrettier("cli/", ["--file-info", "file.foo"]).test({
    status: 0
  });
});
describe("extracts file-info with inferredParser=foo when plugins are autoloaded", () => {
  runPrettier("cli/", [
    "--file-info",
    "file.foo",
    "--plugin",
    "../plugins/automatic/node_modules/@prettier/plugin-foo"
  ]).test({
    status: 0
  });
});

describe("extracts file-info with inferredParser=null when a plugin is hand-picked", () => {
  runPrettier("plugins/automatic/", ["--file-info", "file.foo"]).test({
    status: 0
  });
});

test("API getFileInfo with no args", () => {
  expect(() => prettier.getFileInfo()).toThrow();
});

test("API getFileInfo with filepath only", () => {
  expect(prettier.getFileInfo("README")).toMatchObject({
    ignored: false,
    inferredParser: "markdown"
  });
});

test("API getFileInfo with ignorePath", () => {
  const file = path.resolve(
    path.join(__dirname, "../cli/ignore-path/regular-module.js")
  );
  const ignorePath = path.resolve(
    path.join(__dirname, "../cli/ignore-path/.prettierignore")
  );

  expect(prettier.getFileInfo(file)).toMatchObject({
    ignored: false,
    inferredParser: "babylon"
  });

  expect(
    prettier.getFileInfo(file, {
      ignorePath
    })
  ).toMatchObject({
    ignored: true,
    inferredParser: "babylon"
  });
});

test("API getFileInfo with withNodeModules", () => {
  const file = path.resolve(
    path.join(__dirname, "../cli/with-node-modules/node_modules/file.js")
  );
  expect(prettier.getFileInfo(file)).toMatchObject({
    ignored: true,
    inferredParser: "babylon"
  });
  expect(
    prettier.getFileInfo(file, {
      withNodeModules: true
    })
  ).toMatchObject({
    ignored: false,
    inferredParser: "babylon"
  });
});

test("API getFileInfo with hand-picked plugins", () => {
  const file = "file.foo";
  const pluginPath = path.resolve(
    path.join(
      __dirname,
      "../plugins/automatic/node_modules/@prettier/plugin-foo"
    )
  );
  expect(prettier.getFileInfo(file)).toMatchObject({
    ignored: false,
    inferredParser: null
  });
  expect(
    prettier.getFileInfo(file, {
      plugins: [pluginPath]
    })
  ).toMatchObject({
    ignored: false,
    inferredParser: "foo"
  });
});
