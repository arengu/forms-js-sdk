import { FacebookButtonView } from "./FacebookButtonView";
import { ISocialButtonListener, ISocialButtonView } from "../SocialInputView";
import { ISocialConfig, SocialProvider } from "../../../../form/model/FormModel";

export const ButtonViewFactory = {
  create(socialC: ISocialConfig, buttonL: ISocialButtonListener): ISocialButtonView {
    switch (socialC.provider) {
      case SocialProvider.FACEBOOK:
        return FacebookButtonView.create(socialC, buttonL);
    }
  }
}