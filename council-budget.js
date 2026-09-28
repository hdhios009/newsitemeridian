/* Shared Council wallet UI and reference API costs. Real quotes and settlement require the server. */
(() => {
 'use strict';
 const C=CouncilConfig;
 const rates=Object.freeze(Object.fromEntries(['deepseek','qwen','gpt','claude'].map(id=>{const m=C.models.find(m=>m.id===id),v=C.getVariant(id,m.defaultVersion);return [id,Object.freeze({id,modelId:v.id,version:v.name,input:v.input,output:v.output,source:v.source})];})));
 const date=C.catalogDate;
 const valid=n=>Number.isSafeInteger(n)&&n>=0;
 function unitRate(id,options={},modelId){const v=C.getVariant(id,modelId===undefined?rates[id]?.modelId:modelId);if(!v)throw new RangeError('No verified rate');let input=v.input,output=v.output;if(v.tier==='deepseek'&&options.period==='offpeak'){input*=.5;output*=.5;}if(v.tier==='qwen'&&options.context==='long'){input*=3;output*=3;}if(v.tier==='openai'&&options.openaiContext==='long'){input*=2;output*=1.5;}return {input,output};}
 function calculate(lines,options={}){if(!Array.isArray(lines))throw new TypeError('Expected lines');let totalMicro=0;const seen=new Set();const result=lines.map(line=>{if(seen.has(line.id))throw new RangeError('Duplicate model');seen.add(line.id);if(!valid(line.input)||!valid(line.output))throw new RangeError('Invalid token quantity');const r=unitRate(line.id,options,line.modelId);const micro=line.input*r.input+line.output*r.output;totalMicro+=micro;return {...line,modelId:line.modelId===undefined?rates[line.id].modelId:line.modelId,rates:r,cost:micro/1e6};});return {lines:result,total:Math.round(totalMicro*100)/100/1e6,currency:'USD',date};}
 function topUp(credits){
  const w=C.wallet;
  if(!Number.isSafeInteger(credits)||credits<w.minTopUp||credits%w.creditStep!==0)throw new RangeError('Invalid credit quantity');
  const amountMinor=credits/(w.creditsPerUsd/100);
  if(!Number.isSafeInteger(amountMinor))throw new RangeError('Invalid currency precision');
  return {credits,currency:w.currency,amountMinor,amount:amountMinor/100,pricingVersion:w.pricingVersion};
 }
 function parseCredits(value){
  const digits=String(value??'').replace(/[\s\u00a0\u202f]/g,'');
  if(!/^\d+$/.test(digits))return null;
  const n=Number(digits);return Number.isSafeInteger(n)?n:null;
 }
 function defaults(){return {credits:5000};}
 function clean(value){try{topUp(value?.credits);return {credits:value.credits};}catch{return defaults();}}
 function usageCredits(apiCost){if(typeof apiCost!=='number'||!Number.isFinite(apiCost)||apiCost<0)throw new RangeError('Invalid API cost');const result=apiCost*C.wallet.creditsPerUsd*(1+C.wallet.markupBasisPoints/10000);if(!Number.isFinite(result)||result>Number.MAX_SAFE_INTEGER)throw new RangeError('Invalid usage precision');return result;}
 function mount(container,readOnly=false){
  const U=CouncilUI,{t,esc,money,format}=U,w=C.wallet;let order=clean(U.read('wallet-topup',defaults(),true));let inFlight=false;
  const amount=topUp(order.credits);
  const fee=t('walletFee',{percent:format(w.markupBasisPoints/100)});
  container.innerHTML=`${readOnly?'':`<div class="page-heading"><h1>${esc(t('walletTitle'))}</h1><p>${esc(t('walletLead'))}</p></div>`}<div class="wallet-layout"><section class="wallet-amount"><h2>${esc(t(readOnly?'walletReceive':'walletAmount'))}</h2>${readOnly?`<p class="wallet-receipt">${format(order.credits)}<span>${esc(t('credits'))}</span></p><a class="text-link" href="balance.html">${esc(t('walletEdit'))}</a>`:`<div class="credit-presets" role="group" aria-label="${esc(t('credits'))}">${w.presets.map(n=>`<button type="button" data-credits="${n}" aria-pressed="${order.credits===n}"><strong>${format(n)}</strong><span>${money(topUp(n).amount)}</span></button>`).join('')}</div><div class="field wallet-custom"><label for="wallet-credits">${esc(t('walletCustom'))}</label><div class="wallet-input-wrap"><input id="wallet-credits" type="text" inputmode="numeric" autocomplete="off" value="${order.credits}" aria-describedby="wallet-hint wallet-error"><span>${esc(t('credits'))}</span></div><p class="field-note" id="wallet-hint">${esc(t('walletRange',{min:format(w.minTopUp),step:format(w.creditStep)}))}</p><p class="form-error" id="wallet-error" role="alert" hidden></p></div>`}<p class="wallet-conversion">${esc(t('walletRate',{n:format(w.creditsPerUsd),price:money(1)}))}</p><div class="wallet-explanation"><h3>${esc(t('walletUsage'))}</h3><p>${esc(t('walletUsageBody'))}</p><p>${esc(fee)}</p><p class="wallet-example">${esc(t('walletExample',{api:money(1),n:format(usageCredits(1)),retail:money(usageCredits(1)/w.creditsPerUsd)}))}</p><p class="wallet-definition">${esc(t('walletDistinct'))}</p></div></section><aside class="wallet-summary"><span>${esc(t('walletTotal'))}</span><strong class="wallet-price" data-total>${money(amount.amount)}</strong><div class="wallet-credit-total"><span>${esc(t('walletReceive'))}</span><strong data-receive>${format(order.credits)}</strong></div><button class="button dark full" data-quote-next>${esc(t(readOnly?'walletCheckout':'walletNext'))}${U.icon('chevron')}</button><p>${esc(t('walletQuoteNote'))}</p></aside></div>`;
  function update(value){
   const input=container.querySelector('#wallet-credits'),error=container.querySelector('#wallet-error');const n=parseCredits(value);let result;
   try{result=topUp(n);}catch{if(input){input.setAttribute('aria-invalid','true');error.hidden=false;error.textContent=n===null&&/^\d+$/.test(String(value).replace(/\s/g,''))?t('walletLarge'):t('walletInvalid',{min:format(w.minTopUp),step:format(w.creditStep)});}container.querySelector('[data-total]').textContent='—';container.querySelector('[data-receive]').textContent='—';container.querySelectorAll('[data-credits]').forEach(b=>b.setAttribute('aria-pressed','false'));return false;}
   if(input){input.removeAttribute('aria-invalid');error.hidden=true;}order={credits:n};container.querySelector('[data-total]').textContent=money(result.amount);container.querySelector('[data-receive]').textContent=format(n);container.querySelectorAll('[data-credits]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.credits)===n)));U.write('wallet-topup',order,true);return true;
  }
  container.querySelector('#wallet-credits')?.addEventListener('input',e=>update(e.target.value));
  container.querySelectorAll('[data-credits]').forEach(b=>b.onclick=()=>{const input=container.querySelector('#wallet-credits');input.value=b.dataset.credits;update(input.value);});
  container.querySelector('[data-quote-next]').onclick=async e=>{
   if(inFlight)return;
   if(!readOnly&&!update(container.querySelector('#wallet-credits').value)){container.querySelector('#wallet-credits').focus();return;}
   if(CouncilSession.status!=='authenticated'){CouncilSession.reveal();return;}
   U.write('wallet-topup',order,true);
   if(!readOnly){location.href='checkout.html';return;}
   if(!CouncilActions.connected('billing.quote')||!CouncilActions.connected('billing.checkout')){U.notice(t('balance'),t('paymentUnavailable'));return;}
   inFlight=true;const button=e.currentTarget;button.disabled=true;
   try{
    const verified=await CouncilActions.run('billing.quote',{credits:order.credits,pricingVersion:w.pricingVersion});
    if(!verified||typeof verified.id!=='string'||!verified.id||verified.credits!==order.credits||!Number.isSafeInteger(verified.amountMinor)||verified.amountMinor<=0||typeof verified.currency!=='string'||!/^[A-Z]{3}$/.test(verified.currency)||typeof verified.formattedTotal!=='string'||!verified.formattedTotal||typeof verified.description!=='string'||!verified.description||!Number.isFinite(Date.parse(verified.expiresAt))||Date.parse(verified.expiresAt)<=Date.now())throw new Error('Invalid server quote');
    U.dialog(t('walletCheckout'),`<p class="wallet-confirm-price">${esc(verified.formattedTotal)}</p><p class="prose">${esc(t('walletConfirmed',{n:format(verified.credits)}))}</p><p class="muted prose">${esc(verified.description)}</p><div class="dialog-actions"><button class="button dark" id="confirm-server-quote">${esc(t('walletPay'))}</button></div>`,{onOpen:d=>d.querySelector('#confirm-server-quote').onclick=async ev=>{ev.currentTarget.disabled=true;try{if(Date.parse(verified.expiresAt)<=Date.now())throw new Error('Expired quote');const payment=await CouncilActions.run('billing.checkout',{quoteId:verified.id});const url=U.safeUrl(payment?.url);if(!url||new URL(url).protocol!=='https:')throw new Error('Invalid checkout');location.assign(url);}catch{U.notice(t('balance'),t('walletCheckoutError'));}}});
   }catch{U.notice(t('balance'),t('walletCheckoutError'));}finally{inFlight=false;if(button.isConnected)button.disabled=false;}
  };
 }
 globalThis.CouncilBudget=Object.freeze({rates,date,calculate,valid,topUp,parseCredits,usageCredits,clean,defaults,mount});
})();
