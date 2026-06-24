import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:false, userDataDir:'/tmp/cprofile2', args:['--no-sandbox','--window-size=1440,900']});
const p = await b.newPage();
await p.goto('http://localhost:5174/simon-birthday-meetup-36/?slides',{waitUntil:'networkidle0'});
await p.click('.sl-fs-btn');
await new Promise(r=>setTimeout(r,900));
await p.screenshot({path:'/tmp/present_mode.png'});  // present overlay (should be opaque, cover overview)
await p.keyboard.press('Escape');
await new Promise(r=>setTimeout(r,1200));
await p.screenshot({path:'/tmp/overview_after.png'}); // overview after exit
await b.close();
