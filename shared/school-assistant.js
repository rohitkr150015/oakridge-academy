/* Local FAQ assistant. No API, credentials, live staff or message submission. */
(() => {
 'use strict';
 const info = window.schoolInfo;
 if (!info) return;
 const $ = s => document.querySelector(s);

 if (document.body.dataset.page === 'contact') {
  const location = document.createElement('section');
  location.className = 'section soft-section school-location';
  location.id = 'school-location';
  location.innerHTML = `<div class="wrap"><div class="section-heading"><div><span class="eyebrow">Find your way to us</span><h2>A new beginning in Varanasi.</h2></div><span class="pill gold">Sample campus location</span></div><div class="location-layout"><div class="location-copy"><span class="location-pin" aria-hidden="true">⌖</span><h3>${info.brand}</h3><address>${info.area}, Varanasi<br>Uttar Pradesh, India</address><p>Come explore our school community. Plan a visit with the Welcome Centre before you travel.</p><div class="actions"><a class="btn" href="${info.directionsUrl}" target="_blank" rel="noopener noreferrer">Get directions ↗</a><a class="btn outline" href="#contact-form">Plan a visit ↗</a></div><p class="small location-disclaimer">This template uses ${info.area} as an illustrative location. The map and directions show the neighbourhood, not a verified school campus.</p></div><div class="location-map" id="location-map"><div class="map-preview" aria-hidden="true"><span class="map-river"></span><span class="map-road road-one"></span><span class="map-road road-two"></span><span class="map-road road-three"></span><span class="map-area">VARANASI</span><span class="map-marker">⌖<b>${info.area}</b></span></div><div class="map-caption"><span><strong>${info.area}, Varanasi</strong><small>Illustrative area preview · Not to scale</small></span><button class="btn white" id="load-map">View interactive map ↗</button></div></div></div></div>`;
  $('#main').append(location);
  $('#load-map').addEventListener('click', () => {
   const frame = document.createElement('iframe');
   frame.title = `${info.area}, Varanasi neighbourhood map`;
   frame.src = `https://maps.google.com/maps?q=${info.mapQuery}&z=14&output=embed`;
   frame.referrerPolicy = 'no-referrer-when-downgrade';
   frame.allowFullscreen = true;
   $('#location-map').replaceChildren(frame);
   const fallback = document.createElement('p');
   fallback.className = 'map-fallback';
   fallback.innerHTML = `Map requires an internet connection. <a href="${info.directionsUrl}" target="_blank" rel="noopener noreferrer">Open directions in Google Maps ↗</a>`;
   $('#location-map').append(fallback);
   frame.focus();
  });
 }

 const chatIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-4 3 1.6-6A8 8 0 1 1 20 11.5Z" stroke="currentColor" stroke-width="1.5"/><path d="M7 10h8M7 14h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
 const root = document.createElement('div');
 root.className = 'school-chat';
 root.innerHTML = `<button class="chat-launcher" id="chat-launcher" aria-expanded="false" aria-controls="school-chat-panel" aria-label="Open school chatbot">${chatIcon}<span>Ask ${info.short}</span><span class="chat-launcher-dot" aria-hidden="true"></span></button><section class="chat-panel" id="school-chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden><header class="chat-header"><span class="chat-avatar" aria-hidden="true">${chatIcon}</span><div><h2 id="chat-title">${info.short} Guide</h2><p>Your school questions, made simple.</p></div><button id="chat-close" class="chat-icon-button" aria-label="Close school chatbot">×</button></header><div class="chat-info"><span>School FAQ assistant · Front-end demo</span><button id="chat-reset" type="button">Clear chat</button></div><div class="chat-messages" id="chat-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Chat conversation"></div><div class="chat-suggestions" aria-label="Suggested questions"><button data-chat-topic="admissions">Admissions</button><button data-chat-topic="fees">Fees</button><button data-chat-topic="location">School location</button><button data-chat-topic="visit">Book a visit</button></div><form class="chat-form" id="chat-form"><label class="sr-only" for="chat-input">Ask a school question</label><input id="chat-input" autocomplete="off" maxlength="500" placeholder="Ask in English or Hinglish…" required><button aria-label="Send message" type="submit">↑</button></form><p class="chat-footnote">Local answers, not live support. Please don’t share personal details.</p></section>`;
 document.body.append(root);
 const storageKey = `school-chat-${document.body.dataset.theme}-v1`;
 const suggestions = {admissions:'How do admissions work?',fees:'What are the school fees?',location:'Where is the school?',visit:'How can I book a campus visit?'};
 const topics = {
  admissions:{terms:/\b(admission[s]?|apply|application|enrol|enroll|registration|admisson|dakhila|daakhila|seat[s]?)\b|दाखिला|प्रवेश/i,text:'Admissions enquiries are open for 2027–28, from Early Years onwards. Explore the programmes, complete the three-step enquiry preview, then plan a campus conversation. Availability would be confirmed by a school admissions team.',hi:'2027–28 ke admissions ke liye Early Years se enquiry kar sakte hain. Admissions page par 3-step form aur document checklist hai. Yeh demo enquiry hai; koi application submit nahi hoti.',links:[['admissions.html','Explore admissions'],['resources.html','Admissions checklist']]},
  fees:{terms:/\b(fee[s]?|cost|price|payment|pay|scholarship[s]?|scholarship|kitna|kitni|paisa|pese)\b|फीस|शुल्क/i,text:'The portal shows an illustrative Grade 8 Term II statement: ₹32,000 tuition + ₹6,000 transport = ₹38,000. These are sample amounts, not a published school fee schedule. The resource centre also has a sample scholarship guide.',hi:'Portal mein Grade 8 ke Term II ki sample fees ₹32,000 tuition + ₹6,000 transport, total ₹38,000 hai. Yeh demo amounts hain, actual school fees nahi. Scholarship guide resources mein milegi.',links:[['portal.html','View fee demo'],['resources.html','Scholarship guide']]},
  location:{terms:/\b(where|reach|location|address|map|direction[s]?|varanasi|banaras|sarnath|lanka|kahan|kaha|kidhar|pata)\b|कहाँ|कहां|पता|वाराणसी/i,text:`${info.brand} uses a sample location in ${info.address}. The contact page includes an area map and Google Maps directions. This is a fictional school location; the directions lead to the neighbourhood.`,hi:`${info.brand} ki sample location ${info.address} hai. Contact page par area map aur directions hain. Yeh fictional school location hai; map neighbourhood dikhata hai.`,links:[['contact.html#school-location','See school location'],[info.directionsUrl,'Open Google Maps']]},
  visit:{terms:/\b(visit|tour|book|booking|appointment|milna|dekhna|aana|ghumna)\b|मिलना|घूमना/i,text:'You can preview a campus visit on the contact page: choose “Campus visit”, a preferred date and a time. Visits are planned for about 60 minutes. The Welcome Centre hours are Monday–Friday, 8:00 am–4:00 pm. This demo does not create a booking.',hi:'Contact page par “Campus visit” select karke date aur time choose karein. Visit lagbhag 60 minutes ki hai. Welcome Centre Monday–Friday, 8 am–4 pm hai. Demo mein actual booking nahi hoti.',links:[['contact.html','Plan a campus visit'],['campus.html','Explore the 3D campus']]},
  transport:{terms:/\b(bus|buses|transport|pickup|pick.up|drop|route[s]?)\b|बस|ट्रांसपोर्ट/i,text:'The transport page has three sample routes with pickup points and morning timings. Sample afternoon departure is 3:15 pm. Routes are illustrative, and there is no live bus tracking in this template.',hi:'Transport page par 3 sample routes, pickup points aur timings hain. Afternoon departure ka sample time 3:15 pm hai. Yeh demo routes hain; live bus tracking nahi hai.',links:[['transport.html','Explore transport'],['contact.html','Transport enquiry']]},
  timings:{terms:/\b(time|timing[s]?|hour[s]?|open|opening|close|closing|kab|baje|samay)\b|समय|बजे/i,text:'The sample school day runs from 8:00 am to 3:00 pm. Early Years has a shorter day ending at 11:30 am. The Welcome Centre is available Monday–Friday, 8:00 am–4:00 pm. See Academics for age-specific daily schedules.',hi:'Sample school timings 8 am–3 pm hain. Early Years ka din 11:30 am tak hai. Welcome Centre Monday–Friday, 8 am–4 pm hai. Grade ke hisaab se daily schedules Academics page par hain.',links:[['academics.html','View daily schedules']]},
  academics:{terms:/\b(class|classes|grade[s]?|age|curriculum|syllabus|academic[s]?|subject[s]?|nursery|kindergarten|padhai)\b|कक्षा|पढ़ाई/i,text:'There are four learning stages: Early Years (ages 3–6), Primary (6–11), Middle School (11–14), and Senior School (14–18). Each pathway includes subject areas, a sample daily routine and learning support.',hi:'4 learning stages hain: Early Years (3–6), Primary (6–11), Middle (11–14), Senior (14–18). Academics page par subjects, schedules aur learning support dekhein.',links:[['academics.html','Explore learning pathways'],['resources.html','Learning resources']]},
  calendar:{terms:/\b(calendar|holiday[s]?|event[s]?|notice[s]?|announcement[s]?|exam[s]?|chutti|chhutti)\b|छुट्टी|परीक्षा/i,text:'The academic calendar lets you browse months, filter events and download a calendar file. The notice board has searchable announcements for admissions, academics, parents and transport. All dates are sample content.',hi:'Academic calendar mein month change, events filter aur calendar download kar sakte hain. Notice board par searchable updates hain. Dates sample content hain.',links:[['calendar.html','Academic calendar'],['notices.html','Notice board']]},
  facilities:{terms:/\b(campus|3d|facilit(y|ies)|library|lab[s]?|sports|club[s]?|music|art[s]?)\b/i,text:'Explore the interactive 3D campus: the Learning Block, Innovation Centre, Learning Commons and Sports Pavilion. School life includes STEM, arts, sports and service clubs.',hi:'3D campus mein Learning Block, Innovation Centre, Learning Commons aur Sports Pavilion explore karein. Clubs mein STEM, arts, sports aur service options hain.',links:[['campus.html','Open 3D campus'],['student-life.html','Explore clubs']]},
  portal:{terms:/\b(portal|login|log.in|password|report[s]?|attendance|assignment[s]?)\b/i,text:'The family portal has Parent, Student and Teacher demo views. Explore assignments, attendance, reports, fee statements and appointments. No account or password is required, and all records are fictional.',hi:'Family portal mein Parent, Student aur Teacher demo views hain. Login/password ki zaroorat nahi. Assignments, attendance, reports aur fees dekh sakte hain; records fictional hain.',links:[['portal.html','Open family portal']]},
  support:{terms:/\b(human|staff|counsell?or|support|contact|help|wellbeing|bully|bullying|phone|number|email|baat|madad)\b|मदद|संपर्क/i,text:'For an admissions conversation or student support, use the contact-page enquiry preview. This assistant cannot connect you to live staff. No real school phone number or email is configured in this template.',hi:'Admissions ya student support ke liye contact-page enquiry preview use karein. Yeh bot live staff se connect nahi karta. Template mein real phone/email configured nahi hai.',links:[['contact.html','Contact & visit'],['wellbeing.html','Student wellbeing']]},
  greeting:{terms:/^(hi|hello|hey|namaste|namaskar|hii|नमस्ते)[! .?]*$/i,text:`Hello! I’m the ${info.short} Guide. Ask me about admissions, fees, learning stages, school timings, transport or our Varanasi location.`,hi:`Namaste! Main ${info.short} Guide hoon. Admissions, fees, timings, transport ya Varanasi location ke baare mein poochhein.`,links:[]},
  thanks:{terms:/\b(thank[s]?|thank.you|shukriya|dhanyavad|धन्यवाद)\b/i,text:'You’re welcome! I’m here if you have another school question.',hi:'Aapka swagat hai! School ke baare mein aur kuch poochhna ho toh batayein.',links:[]}
 };
 let history = [];
 let language = 'en';
 try {
  const saved = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) history = saved.filter(m => m && ['user','bot'].includes(m.role) && typeof m.text === 'string' && m.text.length <= 1200).slice(-40).map(m => ({role:m.role,text:m.text,topic:topics[m.topic]?m.topic:null}));
 } catch { /* Local files and restricted storage still work in memory. */ }
 function save(){try{sessionStorage.setItem(storageKey,JSON.stringify(history.slice(-40)));}catch{}}
 function appendMessage(message, persist=true){
  const item=document.createElement('div');item.className=`chat-message ${message.role}`;
  const label=document.createElement('span');label.className='chat-message-label';label.textContent=message.role==='user'?'You':`${info.short} Guide`;
  const text=document.createElement('p');text.textContent=message.text;item.append(label,text);
  if(message.role==='bot' && topics[message.topic]?.links.length){
   const links=document.createElement('div');links.className='chat-links';
   for(const [href,title] of topics[message.topic].links){const a=document.createElement('a');a.href=href;a.textContent=title+' ↗';if(href.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}links.append(a);}
   item.append(links);
  }
  $('#chat-messages').append(item);
  if(persist){history.push(message);history=history.slice(-40);save();}
  while($('#chat-messages').children.length>40)$('#chat-messages').firstElementChild.remove();
  $('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;
 }
 function welcome(){appendMessage({role:'bot',text:`Hi, welcome to ${info.brand}! I can help with admissions, fees, school life and finding our Varanasi location. What would you like to know?`,topic:null});}
 if(history.length)history.forEach(m=>appendMessage(m,false));else welcome();
 function openChat(open){$('#school-chat-panel').hidden=!open;$('#chat-launcher').setAttribute('aria-expanded',String(open));$('#chat-launcher').setAttribute('aria-label',open?'Close school chatbot':'Open school chatbot');if(open){$('#chat-input').focus();$('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;}else $('#chat-launcher').focus();}
 $('#chat-launcher').addEventListener('click',()=>openChat($('#school-chat-panel').hidden));
 $('#chat-close').addEventListener('click',()=>openChat(false));
 $('#school-chat-panel').addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();openChat(false);}});
 $('#chat-reset').addEventListener('click',()=>{history=[];language='en';$('#chat-messages').replaceChildren();$('#chat-input').value='';welcome();$('#chat-input').focus();});
 function answer(value, forcedTopic){
  const question=value.trim().slice(0,500);if(!question)return;
  if(/[\u0900-\u097f]|\b(hai|hain|kya|kaise|kahan|kaha|kitna|kitni|kab|baje|mujhe|chahiye|batao|namaste)\b/i.test(question))language='hi';
  appendMessage({role:'user',text:question,topic:null});
  const topic=forcedTopic || Object.keys(topics).find(key=>topics[key].terms.test(question));
  appendMessage(topic?{role:'bot',text:topics[topic][language==='hi'?'hi':'text'],topic}:{role:'bot',text:language==='hi'?'Is sawaal ka jawab mere school FAQ mein nahi hai. Admissions, fees, timings, transport ya location ke baare mein poochhein. Kisi specific enquiry ke liye Contact page dekhein.':'I don’t have that answer in my school FAQs yet. Try admissions, fees, timings, transport or location. For a specific enquiry, the contact page is the best next step.',topic:'support'});
  $('#chat-input').value='';$('#chat-input').focus();
 }
 $('#chat-form').addEventListener('submit',e=>{e.preventDefault();answer($('#chat-input').value);});
 document.querySelectorAll('[data-chat-topic]').forEach(b=>b.addEventListener('click',()=>answer(suggestions[b.dataset.chatTopic],b.dataset.chatTopic)));
})();
