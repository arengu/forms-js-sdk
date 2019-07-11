import { AutoMagic, SDK } from './sdk';

declare const global: { ArenguForms?: null | SDK };

if (global.ArenguForms) {
  console.warn('Arengu Forms SDK has been loaded several times');
} else {
  global.ArenguForms = SDK;
  AutoMagic.init();
}

export default SDK;
