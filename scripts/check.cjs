require('node:fs').mkdirSync(require('node:path').resolve(__dirname, '../qa'), {recursive:true});
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4177';
const pages = ['index','about','academics','admissions','campus','student-life','notices','calendar','gallery','resources','transport','wellbeing','community','contact','portal'];
const schools = ['.'];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[];const results=[];
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 for(const school of schools){
  for(const p of pages){
   await page.goto(`${base}/${school}/${p}.html`);await page.waitForLoadState('networkidle');
   await page.locator('img').evaluateAll(async images=>{images.forEach(i=>i.loading='eager');await Promise.all(images.map(i=>i.decode().catch(()=>{})));});
   assert.equal(await page.locator('main h1').count(),1,`${school}/${p}: one main heading`);
   const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[],`${school}/${p}: images`);
   const missing=await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>!h||h==='#'));assert.deepEqual(missing,[],`${school}/${p}: no placeholder links`);
   const linkTargets=await page.locator('a[href]').evaluateAll(links=>[...new Set(links.map(a=>a.href).filter(h=>h.startsWith(location.origin)&&!h.includes('#')))]);
   for(const href of linkTargets){const response=await context.request.get(href);assert(response.ok(),`Broken link: ${href}`);}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${school}/${p}: desktop overflow`);
   if(['index','campus','portal','admissions','gallery'].includes(p))await page.screenshot({path:path.join(root,'qa',`${false?'north':'oak'}-${p}-desktop.png`),fullPage:true});
   await page.setViewportSize({width:390,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${school}/${p}: mobile overflow`);
   if(['index','campus','portal'].includes(p))await page.screenshot({path:path.join(root,'qa',`${false?'north':'oak'}-${p}-mobile.png`),fullPage:true});
   await page.setViewportSize({width:1440,height:1000});results.push(`${school}/${p}: desktop, mobile, assets and links PASS`);
  }
  const go=p=>page.goto(`${base}/${school}/${p}.html`);
  await go('academics');await page.getByRole('tab',{name:'Senior School',exact:true}).click();await page.getByRole('heading',{name:'Purposeful choices. Confident next steps.'}).waitFor();
  await go('admissions');await page.getByLabel('Parent / guardian name').fill('Sample Parent');await page.getByLabel('Email address',{exact:true}).fill('parent@example.com');await page.getByLabel('Phone number').fill('+91 90000 00000');await page.getByRole('button',{name:'Continue'}).click();await page.getByLabel('Child’s first name').fill('Sample Child');await page.getByLabel('Applying for').selectOption('Grade 8');await page.getByRole('button',{name:'Continue'}).click();await page.getByRole('button',{name:'Back'}).click();assert.equal(await page.getByLabel('Child’s first name').inputValue(),'Sample Child');await page.getByRole('button',{name:'Continue'}).click();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Create preview'}).click();const enquiryDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Download summary'}).click();assert.equal((await enquiryDownload).suggestedFilename(),'enquiry-preview.txt');await page.getByRole('button',{name:'Start again'}).click();assert.equal(await page.getByLabel('Parent / guardian name').inputValue(),'');
  await go('campus');await page.getByRole('button',{name:'Explore The Innovation Centre',exact:true}).click();await page.locator('#campus-detail').getByRole('heading',{name:'The Innovation Centre'}).waitFor();const initial=await page.locator('#campus-ground').evaluate(e=>getComputedStyle(e).transform);await page.getByRole('button',{name:'Rotate campus right'}).click();assert.notEqual(await page.locator('#campus-ground').evaluate(e=>getComputedStyle(e).transform),initial);await page.getByRole('button',{name:'Reset',exact:true}).click();
  await go('notices');await page.getByLabel('Search notices').fill('zznonexistent');await page.getByRole('heading',{name:'No matching announcements.'}).waitFor();await page.getByLabel('Search notices').fill('');await page.getByRole('button',{name:'Admissions',exact:true}).click();assert.equal(await page.locator('.notice-row').count(),1);await page.getByRole('button',{name:'Read notice'}).click();assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('dialog').isVisible()));
  await go('calendar');await page.getByRole('button',{name:'Next month'}).click();assert.equal(await page.locator('#month-title').textContent(),'October 2026');await page.getByRole('button',{name:'10 October 2026, school event',exact:true}).click();await page.getByRole('heading',{name:'Parent–mentor conversations',exact:true}).waitFor();const calendarDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Download calendar'}).click();assert.equal((await calendarDownload).suggestedFilename(),'academic-calendar.ics');
  await go('gallery');await page.getByRole('button',{name:'Arts',exact:true}).click();assert.equal(await page.locator('.gallery-card').count(),1);await page.locator('.gallery-card').click();assert(await page.locator('dialog img').isVisible());await page.getByRole('button',{name:'Next photo'}).click();await page.getByRole('button',{name:'Close dialog'}).click();
  await go('resources');await page.getByLabel('Search resources').fill('handbook');assert.equal(await page.locator('.resource').count(),1);const resourceDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Download guide'}).click();assert.equal((await resourceDownload).suggestedFilename(),'family-handbook.txt');
  await go('transport');await page.getByLabel('Explore a sample route').selectOption('2');await page.getByRole('heading',{name:'Route 03 · South loop'}).waitFor();assert((await page.locator('#route-map').textContent()).includes('Garden Estate'));
  await go('portal');await page.getByRole('button',{name:'Assignments',exact:true}).click();await page.getByRole('button',{name:'Mark complete',exact:true}).first().click();assert.equal(await page.getByRole('button',{name:'Mark incomplete',exact:true}).count(),1);await page.getByRole('button',{name:'Appointments',exact:true}).click();await page.getByRole('button',{name:'Select appointment',exact:true}).first().click();assert.equal(await page.getByRole('button',{name:'Cancel selection',exact:true}).count(),1);await page.getByRole('button',{name:'Select appointment',exact:true}).last().click();assert.equal(await page.getByRole('button',{name:'Cancel selection',exact:true}).count(),1);await page.getByRole('tab',{name:'Teacher',exact:true}).click();assert.equal(await page.locator('#portal-person').textContent(),'Ms. Maya Sen');await page.getByRole('button',{name:'Fees',exact:true}).click();await page.getByRole('button',{name:'Preview fee statement'}).click();await page.getByRole('heading',{name:'Total: ₹ 38,000'}).waitFor();await page.keyboard.press('Escape');
  await go('contact');await page.getByLabel('Your name', {exact:true}).fill('Sample Visitor');await page.getByLabel('Email address',{exact:true}).fill('visitor@example.com');await page.getByLabel('Preferred date').fill('2027-02-08');await page.getByRole('button',{name:'Preview enquiry'}).click();assert((await page.locator('dialog').textContent()).includes('2027-02-08'));await page.keyboard.press('Escape');await page.getByLabel('I’d like to talk about').selectOption('General enquiry');assert(!(await page.getByLabel('Preferred date').isVisible()));
  await go('student-life');await page.getByRole('button',{name:'STEM',exact:true}).click();assert.equal(await page.locator('#club-grid .card').count(),2);await page.getByRole('button',{name:'Explore this club'}).first().click();await page.getByLabel('Your name',{exact:true}).fill('Sample Learner');await page.getByLabel('Email address',{exact:true}).fill('learner@example.com');await page.getByRole('button',{name:'Preview interest'}).click();await page.getByRole('heading',{name:'You’ve found a new possibility.'}).waitFor();await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open navigation'}).click();await page.locator('#navigation').getByRole('link',{name:'Academics',exact:true}).click();await page.getByRole('tab',{name:'Middle School',exact:true}).waitFor();await page.setViewportSize({width:1440,height:1000});
  results.push(`${school}: admissions, academics, campus, notices, calendar, gallery, resources, transport, portal, contact, clubs and mobile navigation PASS`);
 }
 assert.deepEqual(errors,[],'Browser runtime and HTTP errors');
 // Check the direct-file experience, too.
 await page.goto('file:///'+path.join(root,schools[0],'index.html').replaceAll('\\','/'));await page.getByRole('heading',{name:'A place to learn. A space to become.'}).waitFor();
 results.push('Direct file opening PASS');
 fs.writeFileSync(path.join(root,'qa','verification.txt'),results.join('\n')+'\nNo runtime errors or failed requests.\n');
 console.log(results.join('\n'));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
