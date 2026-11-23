(function(){
 'use strict';
 const $ = id => document.getElementById(id);
 const input=$('email-input'),status=$('form-status'),validation=$('validation'),empty=$('empty-state'),result=$('result-content');
 const updateCount=()=>{$('char-count').textContent=`${input.value.length} characters`;};
 const hideResult=()=>{result.hidden=true;empty.hidden=false;$('feedback-status').textContent='';};
 input.addEventListener('input',()=>{updateCount();validation.hidden=true;if(!result.hidden){hideResult();status.textContent='Message changed. Analyze again to update the result.';}});
 $('sample-btn').addEventListener('click',()=>{input.value=SecureMailAnalyzer.SAMPLE;updateCount();validation.hidden=true;hideResult();status.textContent='Fictional phishing sample loaded. Ready to analyze.';input.focus();});
 $('analyze-btn').addEventListener('click',()=>{
   const r=SecureMailAnalyzer.analyze(input.value);
   if (!r.valid) {hideResult();validation.textContent=r.error;validation.hidden=false;status.textContent='Analysis not run: more information is required.';input.focus();return;}
   validation.hidden=true;empty.hidden=true;result.hidden=false;
   $('risk-label').textContent=r.label;$('risk-score').textContent=String(r.score);$('risk-summary').textContent=r.summary;$('recommendation-text').textContent=r.action;
   $('meter').style.width=r.score+'%';$('meter').style.background=r.score>=65?'#cf4b50':r.score>=35?'#d59b33':'#439c78';
   $('meter-wrap').setAttribute('aria-label',`Rule-based demonstration score: ${r.score} out of 100`);
   const band=document.querySelector('.risk-band');band.className='risk-band'+(r.score>=65?'':r.score>=35?' mid':' low');
   $('signals').replaceChildren(...r.signals.map(x=>{const li=document.createElement('li');li.textContent=x;return li;}));
   $('feedback-status').textContent='';status.textContent='Rule-based demonstration complete. No email was sent or uploaded.';
   if(window.innerWidth<761) result.scrollIntoView({behavior:'smooth',block:'start'});
 });
 $('report-btn').addEventListener('click',()=>{$('feedback-status').textContent='Demo feedback recorded locally: report this as suspicious. Nothing was sent.';});
 $('disagree-btn').addEventListener('click',()=>{$('feedback-status').textContent='Demo feedback recorded locally: you disagree with this assessment. Nothing was sent.';});
 $('retry-btn').addEventListener('click',()=>{hideResult();validation.hidden=true;status.textContent='Edit your message and run another analysis.';input.focus();});
 updateCount();
})();
