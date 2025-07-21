const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs').promises;
const path = require('path');

// Test configurations for different viewport sizes
const VIEWPORT_CONFIGS = [
  {
    name: 'Mobile',
    width: 375,
    height: 667,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  },
  {
    name: 'Tablet',
    width: 768,
    height: 1024,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  },
  {
    name: 'Desktop',
    width: 1280,
    height: 720,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1
  },
  {
    name: 'Large Desktop',
    width: 1920,
    height: 1080,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1
  }
];

// Test URLs for different components
const TEST_URLS = [
  'http://localhost:3000/',
  'http://localhost:3000/login',
  'http://localhost:3000/admin/dashboard',
  'http://localhost:3000/student/dashboard'
];

class ResponsiveTestRunner {
  constructor() {
    this.browser = null;
    this.results = [];
    this.screenshotsDir = path.join(__dirname, 'test-screenshots');
    this.reportsDir = path.join(__dirname, 'test-reports');
  }

  async init() {
    // Create output directories
    await this.ensureDirectories();
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.screenshotsDir, { recursive: true });
      await fs.mkdir(this.reportsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async testFooterResponsiveness(page, url, viewport) {
    console.log(`Testing footer responsiveness for ${viewport.name} (${viewport.width}px)...`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.setViewport(viewport);
    
    // Wait for footer to load
    await page.waitForSelector('footer', { timeout: 5000 });
    
    // Test footer layout
    const footerLayout = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      const footerContent = footer.querySelector('.footer-content, .admin-footer-content, .student-footer-content');
      
      if (!footerContent) return null;
      
      const computedStyle = window.getComputedStyle(footerContent);
      const gridTemplateColumns = computedStyle.gridTemplateColumns;
      
      return {
        gridColumns: gridTemplateColumns,
        footerWidth: footerContent.offsetWidth,
        sections: footerContent.children.length
      };
    });
    
    // Expected behavior: multi-column for ≥768px, single column for <768px
    const expectedMultiColumn = viewport.width >= 768;
    const isMultiColumn = footerLayout && footerLayout.gridColumns && 
                          !footerLayout.gridColumns.includes('1fr') || 
                          footerLayout.gridColumns.split(' ').length > 1;
    
    const result = {
      url,
      viewport: viewport.name,
      width: viewport.width,
      footerLayout,
      expectedMultiColumn,
      actualMultiColumn: isMultiColumn,
      passed: expectedMultiColumn === isMultiColumn
    };
    
    console.log(`Footer test ${result.passed ? 'PASSED' : 'FAILED'} for ${viewport.name}`);
    return result;
  }

  async testDashboardLayout(page, url, viewport) {
    console.log(`Testing dashboard layout for ${viewport.name}...`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.setViewport(viewport);
    
    // Test dashboard stats grid
    const statsLayout = await page.evaluate(() => {
      const statsContainer = document.querySelector('.dashboard-stats');
      if (!statsContainer) return null;
      
      const computedStyle = window.getComputedStyle(statsContainer);
      const statCards = statsContainer.querySelectorAll('.stat-card');
      
      return {
        gridColumns: computedStyle.gridTemplateColumns,
        cardCount: statCards.length,
        containerWidth: statsContainer.offsetWidth
      };
    });
    
    // Test dashboard content layout
    const contentLayout = await page.evaluate(() => {
      const contentContainer = document.querySelector('.dashboard-content');
      if (!contentContainer) return null;
      
      const computedStyle = window.getComputedStyle(contentContainer);
      
      return {
        gridColumns: computedStyle.gridTemplateColumns,
        containerWidth: contentContainer.offsetWidth
      };
    });
    
    return {
      url,
      viewport: viewport.name,
      width: viewport.width,
      statsLayout,
      contentLayout
    };
  }

  async captureScreenshot(page, url, viewport) {
    const fileName = `${viewport.name.toLowerCase()}-${url.replace(/[^a-z0-9]/gi, '_')}.png`;
    const filePath = path.join(this.screenshotsDir, fileName);
    
    await page.screenshot({
      path: filePath,
      fullPage: true
    });
    
    console.log(`Screenshot saved: ${fileName}`);
    return filePath;
  }

  async runLighthouseAudit(url, viewport) {
    console.log(`Running Lighthouse audit for ${viewport.name}...`);
    
    try {
      const options = {
        logLevel: 'info',
        output: 'html',
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
        port: 9222,
        emulatedFormFactor: viewport.isMobile ? 'mobile' : 'desktop',
        screenEmulation: {
          mobile: viewport.isMobile,
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: viewport.deviceScaleFactor,
          disabled: false,
        }
      };
      
      const runnerResult = await lighthouse(url, options);
      
      // Save report
      const reportPath = path.join(this.reportsDir, `lighthouse-${viewport.name.toLowerCase()}-${Date.now()}.html`);
      await fs.writeFile(reportPath, runnerResult.report);
      
      console.log(`Lighthouse report saved: ${reportPath}`);
      
      return {
        viewport: viewport.name,
        scores: {
          performance: runnerResult.lhr.categories.performance.score * 100,
          accessibility: runnerResult.lhr.categories.accessibility.score * 100,
          bestPractices: runnerResult.lhr.categories['best-practices'].score * 100
        },
        reportPath
      };
    } catch (error) {
      console.error(`Lighthouse audit failed for ${viewport.name}:`, error);
      return null;
    }
  }

  async runComprehensiveTest() {
    console.log('Starting comprehensive cross-device testing...\n');
    
    const allResults = [];
    
    for (const viewport of VIEWPORT_CONFIGS) {
      console.log(`\n=== Testing ${viewport.name} (${viewport.width}x${viewport.height}) ===`);
      
      const page = await this.browser.newPage();
      
      for (const url of TEST_URLS) {
        try {
          console.log(`\nTesting URL: ${url}`);
          
          // Test footer responsiveness
          const footerResult = await this.testFooterResponsiveness(page, url, viewport);
          
          // Test dashboard layout (only for dashboard pages)
          let dashboardResult = null;
          if (url.includes('dashboard')) {
            dashboardResult = await this.testDashboardLayout(page, url, viewport);
          }
          
          // Capture screenshot
          const screenshotPath = await this.captureScreenshot(page, url, viewport);
          
          allResults.push({
            url,
            viewport: viewport.name,
            footerTest: footerResult,
            dashboardTest: dashboardResult,
            screenshot: screenshotPath
          });
          
        } catch (error) {
          console.error(`Error testing ${url} on ${viewport.name}:`, error);
        }
      }
      
      await page.close();
    }
    
    // Generate summary report
    await this.generateSummaryReport(allResults);
    
    return allResults;
  }

  async generateSummaryReport(results) {
    const reportPath = path.join(this.reportsDir, 'responsive-test-summary.json');
    
    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passedTests: results.filter(r => r.footerTest?.passed).length,
      failedTests: results.filter(r => r.footerTest?.passed === false).length,
      results: results
    };
    
    await fs.writeFile(reportPath, JSON.stringify(summary, null, 2));
    console.log(`\nSummary report saved: ${reportPath}`);
    
    // Print summary to console
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Total tests: ${summary.totalTests}`);
    console.log(`Passed: ${summary.passedTests}`);
    console.log(`Failed: ${summary.failedTests}`);
    console.log(`Success rate: ${Math.round((summary.passedTests / summary.totalTests) * 100)}%`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const tester = new ResponsiveTestRunner();
  
  try {
    await tester.init();
    await tester.runComprehensiveTest();
  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ResponsiveTestRunner;
