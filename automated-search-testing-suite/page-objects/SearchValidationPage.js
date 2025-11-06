import { expect } from '@playwright/test';


export class SearchValidationPage {
  /**
   * Initialize Enterprise Search Automation Engine
   * @param {import('@playwright/test').Page} pageInstance - Playwright automation context
   */
  constructor(pageInstance) {
    this.pageInstance = pageInstance;
    
    // Enhanced locator strategies with fallback options
    this.locators = {
      searchBox: 'textarea[name="q"]:not([aria-hidden="true"]), input[name="q"]:not([aria-hidden="true"])',
      searchButton: 'input[type="submit"], button[type="submit"]',
      resultContainers: '#search, #rso, main',
      resultHeaders: 'h3, .LC20lb, .yuRUbf h3, [data-ved] h3',
      resultDescriptions: '.VwiC3b, [data-sncf], .s, .lEBKkf, .st',
      loadingIndicator: '[data-ved], .g, .tF2Cxc'
    };
    
    // Configuration constants
    this.config = {
      waitTimeout: 10000,
      navigationTimeout: 30000,
      screenshotOptions: { fullPage: true, type: 'png' }
    };
  }

  /**
   * Navigate to search engine with enhanced error handling
   * @param {string} searchEngineUrl - Target search engine URL
   * @returns {Promise<void>}
   */
  async navigateToSearchEngine(searchEngineUrl) {
    try {
      await this.pageInstance.goto(searchEngineUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: this.config.navigationTimeout 
      });

      // Wait for the page to be ready
      await this.pageInstance.waitForTimeout(2000);

      // Handle privacy/cookie consent dialogs
      await this._handleConsentDialogs();
      
      // Ensure we're on the main search page (not images or other tabs)
      await this._ensureMainSearchPage();
      
      console.log(`✅ Successfully navigated to: ${searchEngineUrl}`);
    } catch (error) {
      throw new Error(`Navigation failed: ${error.message}`);
    }
  }

  /**
   * Execute search operation with validation
   * @param {string} searchTerm - Query term to search for
   * @returns {Promise<void>}
   */
  async executeSearch(searchTerm) {
    try {
      console.log(`🔍 Executing search for: "${searchTerm}"`);
      
      // Wait for search input to be available and visible
      await this.pageInstance.waitForSelector(this.locators.searchBox, { 
        timeout: 10000,
        state: 'visible'
      });
      
      // Find the main search input (not the one in images or other sections)
      const searchInput = this.pageInstance.locator('textarea[name="q"]').first();
      
      // Ensure we're on the main search page (not images)
      const currentUrl = this.pageInstance.url();
      if (currentUrl.includes('tbm=isch')) {
        // If we're on images, go back to main search
        await this.pageInstance.goto('https://www.google.com');
        await this.pageInstance.waitForSelector('textarea[name="q"]', { timeout: 5000 });
      }
      
      // Clear and input search term
      await searchInput.click();
      await searchInput.clear();
      await searchInput.fill(searchTerm);
      
      // Submit search using Enter key
      await searchInput.press('Enter');
      
      // Wait for results to load
      await this.pageInstance.waitForSelector(this.locators.resultContainers, {
        timeout: this.config.waitTimeout
      });
      
      console.log(`✅ Search completed for: "${searchTerm}"`);
    } catch (error) {
      throw new Error(`Search execution failed: ${error.message}`);
    }
  }

  /**
   * Capture evidence screenshot with metadata
   * @param {string} screenshotName - Name for the screenshot file
   * @param {string} evidenceFolder - Folder path for evidence storage
   * @returns {Promise<string>} Screenshot file path
   */
  async captureEvidence(screenshotName, evidenceFolder = 'evidence') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${screenshotName}_${timestamp}.png`;
    const filePath = `${evidenceFolder}/${fileName}`;
    
    await this.pageInstance.screenshot({
      path: filePath,
      ...this.config.screenshotOptions
    });
    
    console.log(`📸 Evidence captured: ${filePath}`);
    return filePath;
  }

  /**
   * Validate search results against expected keywords
   * @param {Array<string>} expectedKeywords - Keywords that should appear in results
   * @param {number} minResultCount - Minimum number of results expected
   * @returns {Promise<Object>} Validation results object
   */
  async validateSearchResults(expectedKeywords, minResultCount = 3) {
    const validationResults = {
      totalResults: 0,
      keywordMatches: {},
      isValid: false
    };

    try {
      // Get all result elements
      const resultElements = await this.pageInstance.locator(this.locators.resultHeaders).all();
      validationResults.totalResults = resultElements.length;

      // Validate minimum result count
      expect(validationResults.totalResults).toBeGreaterThanOrEqual(minResultCount);
      
      // Check for keyword presence
      const pageContent = await this.pageInstance.textContent('body');
      const contentLower = pageContent.toLowerCase();
      
      for (const keyword of expectedKeywords) {
        const keywordLower = keyword.toLowerCase();
        const isPresent = contentLower.includes(keywordLower);
        validationResults.keywordMatches[keyword] = isPresent;
        
        if (isPresent) {
          console.log(`✅ Keyword found: "${keyword}"`);
        } else {
          console.log(`❌ Keyword missing: "${keyword}"`);
        }
      }

      // Determine overall validation status
      const keywordMatchCount = Object.values(validationResults.keywordMatches)
        .filter(match => match === true).length;
      
      validationResults.isValid = keywordMatchCount >= Math.ceil(expectedKeywords.length / 2);
      
      console.log(`📊 Validation Summary: ${keywordMatchCount}/${expectedKeywords.length} keywords found`);
      
      return validationResults;
    } catch (error) {
      throw new Error(`Result validation failed: ${error.message}`);
    }
  }

  /**
   * Get detailed result information for analysis
   * @returns {Promise<Array>} Array of result objects with title and description
   */
  async extractResultData() {
    const resultData = [];
    
    try {
      const resultTitles = await this.pageInstance.locator(this.locators.resultHeaders).all();
      const resultDescriptions = await this.pageInstance.locator(this.locators.resultDescriptions).all();
      
      for (let i = 0; i < Math.min(resultTitles.length, 10); i++) {
        const titleText = await resultTitles[i].textContent() || '';
        const descriptionText = i < resultDescriptions.length 
          ? await resultDescriptions[i].textContent() || '' 
          : '';
        
        resultData.push({
          position: i + 1,
          title: titleText.trim(),
          description: descriptionText.trim()
        });
      }
      
      console.log(`📋 Extracted ${resultData.length} result entries`);
      return resultData;
    } catch (error) {
      console.warn(`⚠️ Result extraction warning: ${error.message}`);
      return resultData;
    }
  }

  /**
   * Private method to ensure we're on the main search page
   * @private
   */
  async _ensureMainSearchPage() {
    try {
      // Check if we're on images or other specialized search
      const currentUrl = this.pageInstance.url();
      if (currentUrl.includes('tbm=')) {
        // Go to main search page
        await this.pageInstance.goto('https://www.google.com');
        await this.pageInstance.waitForTimeout(1000);
      }
      
      // Click on "All" tab if visible to ensure we're on web search
      const allTab = this.pageInstance.locator('a[data-ved]:has-text("All"), a:has-text("All")');
      if (await allTab.isVisible({ timeout: 2000 })) {
        await allTab.click();
        await this.pageInstance.waitForTimeout(1000);
      }
    } catch (error) {
      // Continue if we can't find the "All" tab
      console.log('Note: Could not ensure main search page, continuing...');
    }
  }

  /**
   * Private method to handle consent/privacy dialogs
   * @private
   */
  async _handleConsentDialogs() {
    const consentSelectors = [
      'button:has-text("Accept all")',
      'button:has-text("I agree")',
      'button:has-text("Accept")',
      '[id*="accept"], [class*="accept"]'
    ];

    for (const selector of consentSelectors) {
      try {
        const element = this.pageInstance.locator(selector);
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click();
          console.log(`✅ Handled consent dialog: ${selector}`);
          await this.pageInstance.waitForTimeout(1000);
          break;
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }
  }
}