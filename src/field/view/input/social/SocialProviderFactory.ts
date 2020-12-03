import { ISocialProviderConfig, SocialProvider } from "../../../../form/model/FormModel";
import { ISocialProviderPresenter } from "./base/SocialProviderPresenter";
import { FacebookProviderPresenter } from "./facebook/FacebookProviderPresenter";
import { GoogleProviderPresenter } from "./google/GoogleProviderPresenter";

export const SocialProviderFactory = {
  create(socialC: ISocialProviderConfig): ISocialProviderPresenter {
    switch (socialC.provider) {
      case SocialProvider.FACEBOOK:
        return FacebookProviderPresenter.create(socialC);

      case SocialProvider.GOOGLE:
        return GoogleProviderPresenter.create(socialC);
    }
  }
}
