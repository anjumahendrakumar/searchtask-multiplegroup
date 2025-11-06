import { defineConfig, devices } from '@playwright/test';

/**
 * Automated Search Testing Suite Configuration
 * Enterprise Playwright configuration for advanced search engine automation
 */
export default defineConfig({
  // Test execution settings
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  
  // Global test timeout and expectations
  timeout: 45000,
  expect: {
    timeout: 15000,
  },

  // Test output and reporting
  outputDir: 'validation-output/',
  
  // Global test configuration
  use: {
    // Evidence collection settings
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', 
    trace: 'retain-on-failure',
    
    // Browser behavior
    headless: false,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    
    // Navigation and interaction settings
    actionTimeout: 10000,
    navigationTimeout: 20000,
    
    // Browser launch options
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    },
  },

  // Single project configuration for focused testing
  projects: [
    {
      name: 'validation-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled', '--window-size=1920,1080']
        }
      },
    }
  ],

  // Enhanced reporting configuration
  reporter: [
    ['line'],
    ['html', { 
      outputFolder: 'validation-reports/html',
      open: 'never',
      attachmentsBaseURL: 'file:///'
    }],
    ['json', { 
      outputFile: 'validation-reports/results.json' 
    }],
    ['junit', { 
      outputFile: 'validation-reports/junit.xml' 
    }]
  ],

  // Development server configuration (if needed)
  webServer: process.env.START_SERVER ? {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  } : undefined,
});
