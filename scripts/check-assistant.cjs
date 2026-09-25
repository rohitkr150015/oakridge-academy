require('node:fs').mkdirSync(require('node:path').resolve(__dirname, '../qa'), {recursive:true});
const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];const report=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:4177';
 const schools=[['.','Lanka','oak']];
 for(const [school,area,name] of schools){
  const go=p=>page.goto(`${base}/${school}/${p}.html`);
  await go('index');
  assert((await page.locator('footer').innerText()).includes(area+', Varanasi'));
  assert(!(await page.locator('body').innerText()).includes('Ranchi'));
  await page.getByRole('button',{name:'Open school chatbot',exact:true}).click();
  const panel=page.locator('#school-chat-panel');
  await panel.getByRole('button',{name:'School location',exact:true}).click();
  assert((await page.locator('.chat-message.bot').last().innerText()).includes(area));
  assert((await panel.getByRole('link',{name:'Open Google Maps'}).getAttribute('href')).includes(encodeURIComponent(area+', Varanasi')));
  await panel.getByRole('button',{name:'Fees',exact:true}).click();
  assert((await page.locator('.chat-message.bot').last().innerText()).includes('₹38,000'));
  await page.getByLabel('Ask a school question').fill('school kahan hai?');await page.getByRole('button',{name:'Send message',exact:true}).click();
  assert((await page.locator('.chat-message.bot').last().innerText()).includes('sample location'));
  const count=await page.locator('.chat-message').count();
  await go('academics');await page.getByRole('button',{name:'Open school chatbot',exact:true}).click();assert.equal(await page.locator('.chat-message').count(),count);
  await page.getByLabel('Ask a school question').fill('unicorn spaceship');await page.getByRole('button',{name:'Send message',exact:true}).click();
  assert((await page.locator('.chat-message.bot').last().innerText()).includes('don’t have that answer'));
  await page.getByLabel('Ask a school question').fill('<img src=x onerror=alert(1)>');await page.getByRole('button',{name:'Send message',exact:true}).click();assert.equal(await page.locator('.chat-messages img').count(),0);
  await page.getByRole('button',{name:'Clear chat',exact:true}).click();assert.equal(await page.locator('.chat-message').count(),1);
  await panel.getByRole('button',{name:'Admissions',exact:true}).click();await panel.getByRole('link',{name:'Explore admissions'}).waitFor();
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const axe=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector('.school-chat'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)}));});assert.deepEqual(axe,[]);
  await page.screenshot({path:path.resolve(__dirname,`../qa/${name}-chat-desktop.png`)});
  await page.getByLabel('Ask a school question').focus();await page.keyboard.press('Escape');assert(!(await panel.isVisible()));assert(await page.getByRole('button',{name:'Open school chatbot'}).evaluate(e=>e===document.activeElement));
  await go('contact');assert((await page.locator('#school-location').innerText()).includes(area));
  await page.locator('#school-location').scrollIntoViewIfNeeded();await page.screenshot({path:path.resolve(__dirname,`../qa/${name}-location-desktop.png`)});
  await page.route('https://maps.google.com/**',route=>route.fulfill({contentType:'text/html',body:'<html><body>Map provider test response</body></html>'}));
  await page.getByRole('button',{name:'View interactive map'}).click();assert((await page.locator('#location-map iframe').getAttribute('src')).includes(encodeURIComponent(area+', Varanasi')));await page.getByRole('link',{name:'Open directions in Google Maps'}).waitFor();
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open school chatbot',exact:true}).click();await page.screenshot({path:path.resolve(__dirname,`../qa/${name}-chat-mobile.png`)});
  for(const size of [{width:390,height:844},{width:320,height:568},{width:390,height:450}]){await page.setViewportSize(size);const box=await panel.boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=size.width&&box.y+box.height<=size.height,'Chat panel inside viewport');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');}
  await page.setViewportSize({width:1440,height:1000});
  for(const p of ['index','about','academics','admissions','campus','student-life','notices','calendar','gallery','resources','transport','wellbeing','community','contact','portal']){await go(p);assert.equal(await page.locator('#chat-launcher').count(),1);assert((await page.locator('footer').innerText()).includes(area+', Varanasi'));}
  report.push(`${name}: chatbot on 15 pages; FAQ answers; Hinglish; session history; clear; safe text rendering; keyboard close; accessibility; mobile bounds; location and map URL PASS`);
 }
 assert.deepEqual(errors,[]);report.push('No browser runtime errors. Map-provider response mocked; external provider rendering requires internet.');
 fs.writeFileSync(path.resolve(__dirname,'../qa/chatbot-verification.txt'),report.join('\n'));console.log(report.join('\n'));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
