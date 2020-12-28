enum ScriptState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

interface ISDKListener {
  (sdk: stripe.StripeStatic): void;
}

export class StripeSDKImpl {

  public static readonly SDK_URL = 'https://js.stripe.com/v3/';

  public state: ScriptState;

  public listeners: ISDKListener[];

  constructor() {
    this.state = ScriptState.INIT;

    this.listeners = [];
  }

  getSDK(listener: ISDKListener): void {
    if (this.state === ScriptState.LOADED) {
      return listener(Stripe);
    }

    this.listeners.push(listener);

    if (this.state === ScriptState.INIT) {
      this._loadSDK();
    }
  }

  _loadSDK(): void {
    this.state = ScriptState.LOADING;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = StripeSDKImpl.SDK_URL;

    script.addEventListener('load', () => {
      this.state = ScriptState.LOADED;

      const queue = this.listeners;

      this.listeners = [];

      queue.forEach((cb) => cb(Stripe));
    });

    document.body.appendChild(script);
  }
}

export const StripeSDK: StripeSDKImpl = new StripeSDKImpl();
