const puppeteer = require('puppeteer');
const path = require('path');

const breakpoints = [
  { width: 320, name: 'mobile' },
  { width: 768, name: 'tablet' },
  { width: 1024, name: 'laptop' },
  { width: 1440, name: 'desktop' }
];

async function captureFooterScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    for (const breakpoint of breakpoints) {
      console.log(`Capturing screenshot at ${breakpoint.width}px...`);
      
      // Set viewport
      await page.setViewport({
        width: breakpoint.width,
        height: 800,
        deviceScaleFactor: 1
      });
      
      // Wait a moment for layout to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Scroll to footer
      await page.evaluate(() => {
        const footer = document.querySelector('.footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      
      // Wait for scroll to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot of just the footer
      const footer = await page.$('.footer');
      if (footer) {
        await footer.screenshot({
          path: `screenshots/footer-${breakpoint.name}-${breakpoint.width}px.png`,
          type: 'png'
        });
        console.log(`✓ Screenshot saved: footer-${breakpoint.name}-${breakpoint.width}px.png`);
      } else {
        console.log(`✗ Footer not found at ${breakpoint.width}px`);
      }
    }
    
    // Also capture full page screenshots for context
    for (const breakpoint of breakpoints) {
      await page.setViewport({
        width: breakpoint.width,
        height: 1200,
        deviceScaleFactor: 1
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await page.screenshot({
        path: `screenshots/fullpage-${breakpoint.name}-${breakpoint.width}px.png`,
        fullPage: true,
        type: 'png'
      });
      console.log(`✓ Full page screenshot saved: fullpage-${breakpoint.name}-${breakpoint.width}px.png`);
    }
    
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureFooterScreenshots();
