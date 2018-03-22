"use strict";

const findup = require("findup-sync");
const globby = require("globby");
const resolve = require("resolve");

function loadPlugins(plugins) {
  const alreadyLoadedPlugins = (plugins || []).filter(
    plugin => plugin instanceof Object
  );
  const alreadyLoadedPluginNames = deduplicate(
    alreadyLoadedPlugins.map(plugin => plugin.name)
  );

  const userPluginNames = (plugins || []).filter(
    plugin => typeof plugin === "string"
  );

  const internalPlugins = [
    require("../language-js"),
    require("../language-css"),
    require("../language-handlebars"),
    require("../language-graphql"),
    require("../language-markdown"),
    require("../language-html"),
    require("../language-vue")
  ];

  const nodeModulesDir = findup("node_modules", { pwd: __dirname });
  const autoPluginNames = findPluginsInNodeModules(nodeModulesDir).filter(
    name =>
      userPluginNames.indexOf(name) === -1 &&
      alreadyLoadedPluginNames.indexOf(name) === -1
  );

  const userPluginPaths = userPluginNames.map(name =>
    resolve.sync(name, { basedir: process.cwd() })
  );
  const autoPluginPaths = autoPluginNames.map(name =>
    resolve.sync(name, { basedir: nodeModulesDir })
  );

  const externalPluginNames = userPluginNames.concat(autoPluginNames);
  const externalPluginPaths = userPluginPaths.concat(autoPluginPaths);

  const externalPlugins = externalPluginPaths.map((pluginPath, i) =>
    Object.assign({ name: externalPluginNames[i] }, eval("require")(pluginPath))
  );
  return deduplicate(
    alreadyLoadedPlugins.concat(internalPlugins, externalPlugins)
  );
}

function deduplicate(items) {
  const uniqItems = [];
  for (const item of items) {
    if (uniqItems.indexOf(item) < 0) {
      uniqItems.push(item);
    }
  }
  return uniqItems;
}

function findPluginsInNodeModules(nodeModulesDir) {
  const pluginPackageJsonPaths = globby.sync(
    ["prettier-plugin-*/package.json", "@prettier/plugin-*/package.json"],
    { cwd: nodeModulesDir }
  );
  return pluginPackageJsonPaths.map(packageJsonPath =>
    packageJsonPath.replace(/(\/|\\)package.json$/i, "")
  );
}

module.exports = loadPlugins;
