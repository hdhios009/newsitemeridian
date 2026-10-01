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
 function rateNano(usdPerMillion){const scaled=usdPerMillion*1000,nano=Math.round(scaled);if(!Number.isFinite(usdPerMillion)||usdPerMillion<0||Math.abs(scaled-nano)>1e-6)throw new RangeError('Invalid rate');return nano;}
 function variantById(modelId){return C.variants.find(v=>v.id===modelId)||null;}
 function orderQuote(order){
  if(!order||!Array.isArray(order.lines))throw new TypeError('Expected order');
  const seen=new Set();let api=0n;
  const lines=order.lines.map(line=>{
   if(!line||typeof line.modelId!=='string'||seen.has(line.modelId))throw new RangeError('Duplicate model');
   seen.add(line.modelId);const variant=variantById(line.modelId);if(!variant)throw new RangeError('Unknown model');
   if(!valid(line.inputTokens)||!valid(line.outputTokens)||(line.inputTokens===0&&line.outputTokens===0))throw new RangeError('Invalid token quantity');
   api+=BigInt(line.inputTokens)*BigInt(rateNano(variant.input))+BigInt(line.outputTokens)*BigInt(rateNano(variant.output));
   return {modelId:line.modelId,inputTokens:line.inputTokens,outputTokens:line.outputTokens};
  });
  const searchUnits=order.searchUnits??0;
  if(!valid(searchUnits))throw new RangeError('Invalid search quantity');
  if(!lines.length&&searchUnits===0)throw new RangeError('Empty order');
  api+=BigInt(searchUnits)*8000000n;
  const retail=api*(10000n+BigInt(C.wallet.markupBasisPoints))/10000n,cent=10000000n,amountMinor=Number((retail+cent-1n)/cent);
  if(!Number.isSafeInteger(amountMinor)||amountMinor<=0)throw new RangeError('Invalid amount');
  return {lines,searchUnits,amountMinor,currency:C.wallet.currency,pricingVersion:C.wallet.pricingVersion,markupBasisPoints:C.wallet.markupBasisPoints};
 }
 function supplierCents(plan){
  let api=0n;
  for(const row of plan.allowances){const variant=variantById(row.modelId);api+=BigInt(row.input)*BigInt(rateNano(variant.input))+BigInt(row.output)*BigInt(rateNano(variant.output));}
  api+=BigInt(plan.searchUnits)*8000000n;const cents=api/10000000n;if(api%10000000n!==0n)throw new RangeError('Inexact supplier cost');return Number(cents);
 }
 function blankOrder(){return {lines:[{modelId:'deepseek-flash',inputTokens:0,outputTokens:0},{modelId:'qwen3.8-flash',inputTokens:0,outputTokens:0}],searchUnits:0};}
 function readOrder(value){
  const source=value&&Array.isArray(value.lines)?value:blankOrder();
  const lines=source.lines.filter(line=>variantById(line?.modelId)).map(line=>({modelId:line.modelId,inputTokens:valid(line.inputTokens)?line.inputTokens:0,outputTokens:valid(line.outputTokens)?line.outputTokens:0}));
  const unique=[];for(const line of lines){if(!unique.some(x=>x.modelId===line.modelId))unique.push(line);}
  return {lines:unique.length?unique:blankOrder().lines,searchUnits:valid(source.searchUnits)?source.searchUnits:0};
 }
 function mount(container,readOnly=false){
  const U=CouncilUI,{t,esc,money,format}=U;let order=readOrder(U.read('token-order',null,true));let inFlight=false;
  const options=selected=>C.variants.map(v=>`<option value="${esc(v.id)}" ${v.id===selected?'selected':''}>${esc(v.name)}</option>`).join('');
  function linePrice(line){try{return money(orderQuote({lines:[line],searchUnits:0}).amountMinor/100);}catch{return '—';}}
  function paint(){
   container.innerHTML=`<div class="token-order"><div class="token-lines">${order.lines.map((line,index)=>`<section class="token-line"><div class="token-line-head">${C.models.find(m=>m.id===variantById(line.modelId).familyId)?`<img src="${esc(C.models.find(m=>m.id===variantById(line.modelId).familyId).image)}" alt="" width="22" height="22">`:''}<select id="token-model-${index}" data-token-model="${index}" aria-label="${esc(t('models'))}" ${readOnly?'disabled':''}>${options(line.modelId)}</select><button type="button" class="icon-button" data-remove-line="${index}" aria-label="${esc(t('delete'))}" ${readOnly?'hidden':''}>${U.icon('trash')}</button></div><div class="token-quantities"><div class="field"><label for="token-in-${index}">${esc(t('tokenIn'))}</label><input id="token-in-${index}" data-token-in="${esc(line.modelId)}" inputmode="numeric" autocomplete="off" value="${line.inputTokens?format(line.inputTokens):''}" ${readOnly?'readonly':''}></div><div class="field"><label for="token-out-${index}">${esc(t('tokenOut'))}</label><input id="token-out-${index}" data-token-out="${esc(line.modelId)}" inputmode="numeric" autocomplete="off" value="${line.outputTokens?format(line.outputTokens):''}" ${readOnly?'readonly':''}></div></div><p class="token-line-price" data-line-price>${esc(linePrice(line))}</p></section>`).join('')}</div>${readOnly?'':`<button type="button" class="button subtle" data-add-line>${esc(t('addModelLine'))}</button>`}<div class="field token-search"><label for="search-units">${esc(t('searchUnits'))}</label><input id="search-units" inputmode="numeric" autocomplete="off" value="${order.searchUnits?format(order.searchUnits):''}" ${readOnly?'readonly':''}><p class="field-note">${esc(t('searchUnitPrice'))}</p></div><aside class="token-summary"><span>${esc(t('orderTotal'))}</span><strong data-total>—</strong><button class="button dark full" data-quote-next>${esc(t(readOnly?'walletCheckout':'walletNext'))}</button><p>${esc(t('orderRoundNote'))}</p><p class="form-error" id="token-order-error" role="alert" hidden></p></aside></div>`;
   refresh();
   if(!readOnly){
    container.querySelector('[data-add-line]').onclick=()=>{const next=C.variants.find(v=>!order.lines.some(line=>line.modelId===v.id));if(!next)return;order.lines.push({modelId:next.id,inputTokens:0,outputTokens:0});paint();};
    container.querySelectorAll('[data-remove-line]').forEach(b=>b.onclick=()=>{order.lines.splice(Number(b.dataset.removeLine),1);paint();});
    container.querySelectorAll('[data-token-model]').forEach(s=>s.onchange=()=>{order.lines[Number(s.dataset.tokenModel)].modelId=s.value;paint();});
    container.querySelectorAll('[data-token-in],[data-token-out]').forEach(input=>input.addEventListener('input',()=>{const line=order.lines.find(x=>x.modelId===(input.dataset.tokenIn||input.dataset.tokenOut));const n=parseCredits(input.value);if(input.dataset.tokenIn)line.inputTokens=n??-1;else line.outputTokens=n??-1;input.toggleAttribute('aria-invalid',n===null&&input.value.trim()!=='');refresh();}));
    container.querySelector('#search-units').addEventListener('input',e=>{const n=parseCredits(e.target.value);order.searchUnits=n??-1;e.target.toggleAttribute('aria-invalid',n===null&&e.target.value.trim()!=='');refresh();});
   }
  }
  function refresh(){
   const error=container.querySelector('#token-order-error'),total=container.querySelector('[data-total]');
   container.querySelectorAll('.token-line').forEach((row,index)=>{const line=order.lines[index];const price=row.querySelector('[data-line-price]');if(price)price.textContent=line&&valid(line.inputTokens)&&valid(line.outputTokens)?linePrice(line):'—';});
   try{const quote=orderQuote(order);total.textContent=money(quote.amountMinor/100);if(error)error.hidden=true;U.write('token-order',order,true);return quote;}
   catch{total.textContent='—';if(error){error.hidden=false;error.textContent=t('orderInvalid');}return null;}
  }
  paint();
  container.querySelector('[data-quote-next]').onclick=async e=>{
   if(inFlight)return;const quote=refresh();if(!quote){container.querySelector('[aria-invalid],#token-order-error')?.focus?.();return;}
   if(!readOnly){location.href='checkout.html';return;}
   if(!CouncilActions.connected('billing.quote')||!CouncilActions.connected('billing.checkout')){U.notice(t('balance'),t('paymentUnavailable'));return;}
   inFlight=true;const button=e.currentTarget;button.disabled=true;
   try{
    const verified=await CouncilActions.run('billing.quote',{kind:'tokens',pricingVersion:quote.pricingVersion,lines:quote.lines,searchUnits:quote.searchUnits});
    const same=verified&&Array.isArray(verified.lines)&&verified.lines.length===quote.lines.length&&verified.lines.every((line,i)=>line.modelId===quote.lines[i].modelId&&line.inputTokens===quote.lines[i].inputTokens&&line.outputTokens===quote.lines[i].outputTokens)&&verified.searchUnits===quote.searchUnits&&verified.amountMinor===quote.amountMinor&&verified.currency==='USD'&&verified.pricingVersion===quote.pricingVersion&&typeof verified.id==='string'&&verified.id&&typeof verified.description==='string'&&verified.description&&Number.isFinite(Date.parse(verified.expiresAt))&&Date.parse(verified.expiresAt)>Date.now();
    if(!same)throw new Error('Invalid server quote');
    U.dialog(t('walletCheckout'),`<p class="wallet-confirm-price">${esc(money(verified.amountMinor/100))}</p><p class="muted prose">${esc(verified.description)}</p><div class="dialog-actions"><button class="button dark" id="confirm-server-quote">${esc(t('walletPay'))}</button></div>`,{onOpen:d=>d.querySelector('#confirm-server-quote').onclick=async ev=>{ev.currentTarget.disabled=true;try{if(Date.parse(verified.expiresAt)<=Date.now())throw new Error('Expired quote');const payment=await CouncilActions.run('billing.checkout',{quoteId:verified.id});const url=U.safeUrl(payment?.url);if(!url||new URL(url).protocol!=='https:')throw new Error('Invalid checkout');location.assign(url);}catch{U.notice(t('balance'),t('walletCheckoutError'));}}});
   }catch{U.notice(t('balance'),t('walletCheckoutError'));}finally{inFlight=false;if(button.isConnected)button.disabled=false;}
  };
 }
 globalThis.CouncilBudget=Object.freeze({rates,date,calculate,valid,topUp,parseCredits,usageCredits,clean,defaults,orderQuote,supplierCents,readOrder,blankOrder,mount});
})();
