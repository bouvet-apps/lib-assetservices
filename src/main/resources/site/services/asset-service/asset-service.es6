const libs = {
  portal: require("/lib/xp/portal"),
  util: require("/lib/util"),
  cache: require("/lib/cache"),
  context: require("/lib/xp/context")
};

const assetCache = libs.cache.newCache({
  size: 3,
  expire: 60 * 60 * 24
});

const getAssets = (paths) => {
  paths = libs.util.forceArray(parsed.paths);
  const urls = assetCache.get(paths, () => {
    const _urls = {};
    paths.forEach((path) => {
      _urls[path] = libs.portal.assetUrl({ path: path });
    });
    return _urls;
  });
  return {
    body: urls
  };
};

exports.post = (req) => {
  if (req.body) {
    const parsed = JSON.parse(req.body);
    if (parsed.paths) {
      return getAssets(parsed.paths);
    }
  }
  return {
    body: {}
  };
};

exports.get = (req) => {
  if (req.params.paths) {
    return getAssets(parsed.paths);
  }
  return {
    body: {}
  };
};
