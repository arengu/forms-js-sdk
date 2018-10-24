class MetaData {

  static _gup(name, url) {
    if (!url) {
      url = location.href;
    }
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regexS = '[\\?&]' + name + '=([^&#]*)';
    const regex = new RegExp(regexS);
    const results = regex.exec(url);
    return results == null ? null : results[1];
  }

  static getAll () {
    return {
      navigator: {
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
      },
      navigation: {
        referer: window.referrer,
        location: {
          url: window.location.href,
          protocol: window.location.protocol,
          host: window.location.host,
          path: window.location.pathname,
          parameters: window.location.search,
        },
        analytics: {
          ga: {
            utm_source: this._gup('utm_source'),
            utm_medium: this._gup('utm_medium'),
            utm_campaign: this._gup('utm_campaign'),
            utm_term: this._gup('utm_term'),
            utm_content: this._gup('utm_content'),
          },
        },
      },
      view: {
        screen: {
          height: window.screen.height,
          width: window.screen.width,
        },
        window: {
          height: window.innerHeight,
          width: window.innerWidth,
        },
      },
    };
  }

}

module.exports = MetaData;
