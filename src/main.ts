import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// fetch('assets/condigfb.json').then(resp => resp.json()).then(config => {
//   window['firebase_config'] = config.firebase;
//   window['config'] = config;
//   platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
// });

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
