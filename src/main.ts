import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production ||environment.name=='qa' || environment.name=='uat') {
   enableProdMode();
   window.console.log=()=>{}
}
// import 'node_modules/zone.js/dist/zone';

// import 'zone.js';

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
});
