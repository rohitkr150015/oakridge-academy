require('node:fs').mkdirSync(require('node:path').resolve(__dirname, '../qa'), {recursive:true});
const {chromium}=require('@playwright/test');
const fs=require('node:fs');const path=require('node:path');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const report=[];
for(const school of ['.'])for(const name of ['index','academics','admissions','campus','portal','contact']){
 await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:4177'}/${school}/${name}.html`);await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const results=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));report.push({school,page:name,violations:results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
 if(name==='campus'){await page.screenshot({path:path.resolve(__dirname,`../qa/${false?'north':'oak'}-campus-desktop.png`),fullPage:true});}
}
fs.writeFileSync(path.resolve(__dirname,'../qa/accessibility.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(r=>({school:r.school,page:r.page,violations:r.violations.length})),null,2));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
