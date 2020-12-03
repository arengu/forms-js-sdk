import { AsyncButtonViewImpl, IAsyncButtonView } from "../../../../../block/navigation/button/async/AsyncButtonView";

const CSS_CLASSES = ['af-social-provider', 'af-social-google'];

export const GoogleProviderView = {
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
