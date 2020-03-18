import { ICookieModel } from '../../form/model/CookieModel';

export const CookieHelper = {
  set(cookie: ICookieModel): void {
    const value = encodeURIComponent(cookie.value);
    let newCookie = `${cookie.name}=${value};path=${cookie.path};max-age=${cookie.maxAge}`;

    if (cookie.domain) {
      newCookie += `;domain=${cookie.domain}`;
    }

    if (cookie.secure) {
      newCookie += ';secure';
    }

    newCookie += `;sameSite=${cookie.sameSite.toLowerCase()}`;

    document.cookie = newCookie;
  },
};
