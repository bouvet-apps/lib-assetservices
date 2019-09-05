const libs = {
  i18n: require("/lib/xp/i18n"),
  util: require("/lib/util"),
  cache: require("/lib/cache"),
  context: require("/lib/xp/context")
};

const getLanguage = (defaultLanguage = "en") => libs.portal.getSite().language || defaultLanguage;

const phraseCache = libs.cache.newCache({
  size: 3,
  expire: 60 * 60 * 24
});

exports.get = (req) => {
  if (req.params.paths) {
    const locale = libs.util.getLanguage();
    const keys = libs.util.data.forceArray(req.params.paths);
    const phrases = phraseCache.get(locale + keys, () => {
      const allPhrases = libs.i18n.getPhrases(locale, ["site/i18n/phrases"]);
      const selected = {};
      keys.forEach((key) => {
        selected[key] = allPhrases[key];
      });
      return selected;
    });
    return {
      body: phrases
    };
  }

  return {
    body: libs.i18n.getPhrases(getLanguage(), ["site/i18n/phrases"])
  };
};

exports.post = (req) => {
  if (req.body) {
    const parsed = JSON.parse(req.body);
    if (parsed.paths) {
      const locale = getLanguage();
      const keys = libs.util.data.forceArray(parsed.paths);
      const phrases = phraseCache.get(locale + keys, () => {
        const allPhrases = libs.i18n.getPhrases(locale, ["site/i18n/phrases"]);
        const selected = {};
        keys.forEach((key) => {
          selected[key] = allPhrases[key];
        });
        return selected;
      });
      return {
        body: phrases
      };
    }
  }
  return {
    body: libs.i18n.getPhrases(getLanguage(), ["site/i18n/phrases"])
  };
};
