import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';  // Import provideHttpClient and withFetch
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(withFetch())  // Ensure HttpClient is configured to use fetch API
  ]
})
.catch((err) => console.error(err));
