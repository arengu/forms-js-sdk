const BaseView = require('../base/BaseView');

class FormView extends BaseView {

  constructor (model, steps, defaultStep, presenter) {
    super();

    this.formM = model;
    this.formP = presenter;

    this.stepsP = steps;

    this.currStep = this.stepsP[defaultStep];

    this.html = null;
  }

  /*
   * Internal methods
   */
  _buildForm () {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('novalidate', 'novalidate');

    const presenter = this.formP;
    form.onsubmit = function onSubmit (evt) {
      evt.preventDefault();
      presenter.onNext();
    };

    this.stepsP
      .map((s) => s.render())
      .forEach((n) => form.appendChild(n));

    if (this.currStep) {
      this.currStep.show();
    }

    return form;
  }

  // use URLSearchParams() when IE will hasn't use
  _gup(name, url) {
    if (!url) {
      url = location.href;
    }
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regexS = '[\\?&]' + name + '=([^&#]*)';
    const regex = new RegExp(regexS);
    const results = regex.exec(url);
    return results == null ? null : results[1];
  }


  /*
   * View actions
   */
  build () {
    const { id } = this.formM;

    const container = document.createElement('div');
    container.classList.add(`af-form-${id}`);
    container.classList.add('af-form');

    const node = this._buildForm();
    container.appendChild(node);

    this.html = container;
  }

  navigate (index) {
    this.currStep.hide();

    this.currStep = this.stepsP[index];

    this.currStep.show();
  }

  getMetaData () {
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

  static create () {
    return new FormView(...arguments);
  }

}

module.exports = FormView;
