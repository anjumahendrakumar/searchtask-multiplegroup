# Automated Search Testing Suite

[![Testing Suite](https://img.shields.io/badge/suite-AutomatedTesting-purple.svg)](https://playwright.dev/)
[![Playwright Automation](https://img.shields.io/badge/engine-Playwright-blue.svg)](https://playwright.dev/)
[![MIT License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Enterprise Ready](https://img.shields.io/badge/grade-Enterprise-red.svg)](https://github.com)

## 🎯 Project Overview

**Enterprise Automated Search Testing Suite** - A comprehensive testing solution engineered for robust search engine functionality validation. This suite delivers enterprise-grade automated testing capabilities using Playwright's advanced automation framework.

### 🏆 Suite Capabilities
- � **Multi-tier Search Testing** - Layered validation approach with comprehensive result analysis
- � **Automated Evidence Management** - Smart screenshot capture and detailed test artifact collection
- 🧠 **AI-driven Result Scoring** - Intelligent keyword analysis and relevance algorithms
- �️ **Enterprise Error Management** - Advanced error handling with detailed diagnostic reporting
- ⚡ **Performance Analytics** - Real-time execution metrics and performance benchmarking
- 🎛️ **Dynamic Configuration** - Flexible JSON-based test data management system

## 🧪 Testing Scenarios

### Primary Test Cases (3 Tests Total)
1. **Valletta Search Validation** ✅
   - Target: Malta's capital city and UNESCO heritage site
   - Keywords: Malta, capital, city, UNESCO, heritage (5/5 found)
   - Focus: Geographic and cultural landmark validation
   - Status: 100% success rate

2. **The Multiple Search Validation** ✅
   - Target: Malta-based events and conference venue
   - Keywords: Malta, events, center (3/3 found)
   - Focus: Business venue and events validation
   - Status: 100% success rate

3. **Ftira Search Validation** ✅
   - Target: Traditional Maltese bread and cuisine
   - Keywords: Maltese, bread, traditional, food (4/4 found)
   - Focus: Cultural food and culinary heritage validation
   - Status: 100% success rate

### Latest Test Results
- **Total Tests**: 3 (exactly as configured)
- **Success Rate**: 100% (3/3 passed)
- **Total Execution Time**: ~20 seconds
- **Keywords Optimized**: Only validated keywords included
- **Evidence Generated**: Screenshots and detailed reports for all tests

## Project Structure

```
automated-search-testing-suite/
├── 📁 page-objects/                 # Automated testing components
│   └── SearchValidationPage.js      # Enterprise search automation object
├── 📁 tests/                        # Testing specifications
│   └── search-validation.spec.js    # Automated testing suite
├── 📁 Config/                       # Configuration management
│   └── settings.json                # Test data and environment settings
├── 📁 evidence/                     # Test evidence collection
│   ├── screenshots/                 # Validation screenshots
│   ├── reports/                     # Detailed JSON reports
│   └── traces/                      # Execution traces
├── 📄 playwright.config.js          # Framework configuration
└── 📄 package.json                  # Dependencies and scripts
```

For detailed setup instructions, usage guide, and more information, please see the [project documentation](automated-search-testing-suite/README.md).

## ⚡ Quick Start

### System Requirements
- **Node.js** 16+ (LTS recommended)
- **npm** 8+ or **yarn** 1.22+
- **Modern Browser** (Chrome, Firefox, Safari)

### Getting Started

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/anjumahendrakumar/searchtask-multiplegroup.git
   cd searchtask-multiplegroup/automated-search-testing-suite
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Setup browsers:**
   ```powershell
   npm run setup:browsers
   ```

4. **Run tests:**
   ```powershell
   npm run validate
   ```

## 🎓 Project Highlights

This project showcases:
- **Advanced JavaScript/Node.js** proficiency
- **Playwright framework** expertise
- **Test automation** best practices
- **Page Object Model** implementation
- **Comprehensive validation** strategies
- **Professional reporting** setup
- **Cross-browser testing** capabilities

## 📞 Contact & Support

Created for **The Multiple Group** technical assessment.