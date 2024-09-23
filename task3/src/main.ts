import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Combine appConfig with provideHttpClient
const combinedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Spread existing providers if any
    provideHttpClient()             // Add HttpClient provider
  ]
};

bootstrapApplication(AppComponent, combinedConfig)
  .catch(err => console.error(err));
