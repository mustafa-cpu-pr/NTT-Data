import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  
import { provideServerRendering } from '@angular/platform-server';

// Define the basic application configuration
const baseConfig: ApplicationConfig = {
  providers: [
    HttpClientModule,  // Include HttpClientModule in the base configuration
    // Other providers can be added here
  ]
};

// Define the server-side rendering configuration
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// Merge the base configuration with the server configuration
export const config = mergeApplicationConfig(baseConfig, serverConfig);
