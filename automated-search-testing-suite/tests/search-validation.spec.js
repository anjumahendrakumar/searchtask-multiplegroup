import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { SearchValidationPage } from '../page-objects/SearchValidationPage.js';

// Load test configuration synchronously
const configurationPath = path.resolve('Config/settings.json');
const testConfig = JSON.parse(fs.readFileSync(configurationPath, 'utf8'));

/**
 * Automated Search Testing Suite
 * 
 * Enterprise-grade automated testing framework for search engine validation
 * Executes comprehensive test scenarios with intelligent result verification
 */
test.describe('Automated Search Testing Suite', () => {
  let searchValidator;
  let testResults = [];

  test.beforeEach(async ({ page }) => {
    console.log('🔧 Setting up test...');
    searchValidator = new SearchValidationPage(page);
    
    console.log('🌐 Navigating to search engine...');
    // Navigate to search engine
    await searchValidator.navigateToSearchEngine(testConfig.environment.searchEngine);
    
    console.log('📸 Capturing initial state...');
    // Capture initial state
    await searchValidator.captureEvidence('initial_state', testConfig.validation.screenshotPath);
    console.log('✅ Setup complete');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Capture final state on test completion
    if (testInfo.status !== 'passed') {
      await searchValidator.captureEvidence(
        `failure_${testInfo.title.replace(/\s+/g, '_')}`, 
        testConfig.validation.screenshotPath
      );
    }
  });

  // Dynamic test generation for each search query
  for (const [index, queryData] of testConfig.testData.searchQueries.entries()) {
    test(`Automated Test Case ${index + 1}: ${queryData.term}`, async ({ page }, testInfo) => {
      const testStartTime = Date.now();
      
      try {
        console.log(`\n🚀 Initiating automated test for: "${queryData.term}"`);
        
        // Phase 1: Execute search automation
        console.log('🤖 Phase 1: Executing automated search...');
        await searchValidator.executeSearch(queryData.term);
        
        // Phase 2: Capture test evidence
        console.log('📸 Phase 2: Capturing test evidence...');
        const evidencePath = await searchValidator.captureEvidence(
          `test_results_${queryData.term.replace(/\s+/g, '_')}`,
          testConfig.validation.screenshotPath
        );
        
        // Attach screenshot to test report
        const screenshotBuffer = await page.screenshot({ fullPage: true });
        await testInfo.attach(`Search Results - ${queryData.term}`, {
          body: screenshotBuffer,
          contentType: 'image/png'
        });
        
        // Phase 3: Execute result validation
        console.log('� Phase 3: Executing result validation...');
        const validationResults = await searchValidator.validateSearchResults(
          queryData.expectedKeywords,
          testConfig.validation.minResultCount
        );
        
        // Phase 4: Data extraction and analysis
        console.log('� Phase 4: Analyzing extracted data...');
        const resultData = await searchValidator.extractResultData();
        
        // Phase 5: Automated assertions
        console.log('🎯 Phase 5: Running automated assertions...');
        
        // Assert minimum result count
        expect(validationResults.totalResults).toBeGreaterThanOrEqual(
          testConfig.validation.minResultCount
        );
        
        // Assert keyword presence (at least 50% of keywords should be found)
        const keywordSuccessRate = Object.values(validationResults.keywordMatches)
          .filter(match => match === true).length / queryData.expectedKeywords.length;
        
        expect(keywordSuccessRate).toBeGreaterThanOrEqual(0.5);
        
        // Verify results are relevant (check if result titles contain search terms or keywords)
        const searchWords = queryData.term.toLowerCase().split(' ');
        const searchTermsInResults = resultData.some(result => {
          const titleText = result.title.toLowerCase();
          const descriptionText = result.description.toLowerCase();
          return searchWords.some(word => 
            titleText.includes(word) || descriptionText.includes(word)
          ) || queryData.expectedKeywords.some(keyword => 
            titleText.includes(keyword.toLowerCase()) || descriptionText.includes(keyword.toLowerCase())
          );
        });
        expect(searchTermsInResults).toBe(true);
        
        // Store test results for reporting
        const testDuration = Date.now() - testStartTime;
        testResults.push({
          searchTerm: queryData.term,
          duration: testDuration,
          resultCount: validationResults.totalResults,
          keywordMatches: validationResults.keywordMatches,
          evidencePath: evidencePath,
          resultData: resultData.slice(0, 3), // Store top 3 results
          status: 'PASSED'
        });
        
        console.log(`✅ Validation completed successfully in ${testDuration}ms`);
        console.log(`📈 Results: ${validationResults.totalResults} found, Keywords: ${Object.keys(validationResults.keywordMatches).length}`);
        
      } catch (error) {
        console.error(`❌ Validation failed: ${error.message}`);
        
        // Capture failure evidence
        await searchValidator.captureEvidence(
          `failure_${queryData.term.replace(/\s+/g, '_')}`,
          testConfig.validation.screenshotPath
        );
        
        // Store failure information
        testResults.push({
          searchTerm: queryData.term,
          duration: Date.now() - testStartTime,
          error: error.message,
          status: 'FAILED'
        });
        
        throw error;
      }
    });
  }
});