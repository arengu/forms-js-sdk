import { AsyncButtonViewImpl, IAsyncButtonView } from "../../../../../block/navigation/button/async/AsyncButtonView";

const CSS_CLASSES = ['af-social-provider', 'af-social-facebook'];

export const FacebookProviderView = {
  create(text: string): IAsyncButtonView {
    return new AsyncButtonViewImpl(
      {
        button: {
          text,
        },
        container: {
          classes: CSS_CLASSES,
        },
      },
    );
  }
}
