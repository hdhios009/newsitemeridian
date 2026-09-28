/* Public model catalog, verified 2026-09-27. No credentials or provider integrations. */
(() => {
  'use strict';
  const catalogDate='2026-09-27';
  const models=Object.freeze([
    {id:'gpt',name:'GPT',family:'GPT',provider:'OpenAI',image:'assets/models/openai-blossom.svg',accent:'#1d1d1f',defaultVersion:'gpt-6-sol'},
    {id:'claude',name:'Claude',family:'Claude',provider:'Anthropic',image:'assets/models/claude.png',accent:'#bf765b',defaultVersion:'claude-sonnet-5'},
    {id:'deepseek',name:'DeepSeek',family:'DeepSeek',provider:'DeepSeek',image:'assets/models/deepseek.svg',accent:'#496dff',defaultVersion:'deepseek-flash'},
    {id:'qwen',name:'Qwen',family:'Qwen',provider:'Alibaba Cloud',image:'assets/models/qwen.png',accent:'#7657db',defaultVersion:'qwen3.7-plus-2026-05-26'}
  ].map(Object.freeze));
  const sources={gpt:'https://developers.openai.com/api/docs/models',claude:'https://platform.claude.com/docs/en/models/overview',deepseek:'https://api-docs.deepseek.com/quick_start/pricing/',qwen:'https://www.alibabacloud.com/help/en/model-studio/model-pricing'};
  const variants=Object.freeze([
    {familyId:'gpt',id:'gpt-6-luna',name:'GPT-6 Luna',note:'modelEconomy',input:.10,output:.50,tier:'openai'},
    {familyId:'gpt',id:'gpt-6-sol',name:'GPT-6 Sol',note:'modelBalanced',input:2,output:10,tier:'openai'},
    {familyId:'gpt',id:'gpt-6-astra',name:'GPT-6 Astra',note:'modelAdvanced',input:10,output:50,tier:'openai'},
    {familyId:'claude',id:'claude-haiku-4-5-20251001',name:'Claude Haiku 4.5',note:'modelEconomy',input:1,output:5},
    {familyId:'claude',id:'claude-sonnet-5',name:'Claude Sonnet 5',note:'modelBalanced',input:2,output:10},
    {familyId:'claude',id:'claude-opus-5-5',name:'Claude Opus 5.5',note:'modelAdvanced',input:4,output:20},
    {familyId:'claude',id:'claude-fable-5-1',name:'Claude Fable 5.1',note:'modelAdvanced',input:10,output:50},
    {familyId:'deepseek',id:'deepseek-flash',name:'DeepSeek V4.1 Flash',note:'modelEconomy',input:.30,output:1.20,tier:'deepseek'},
    {familyId:'deepseek',id:'deepseek-v4-pro',name:'DeepSeek V4 Pro',note:'modelAdvanced',input:1.32,output:3.96,tier:'deepseek'},
    {familyId:'qwen',id:'qwen3.8-flash',name:'Qwen3.8 Flash',note:'modelEconomy',input:.15,output:.47},
    {familyId:'qwen',id:'qwen3.7-plus-2026-05-26',name:'Qwen3.7 Plus',note:'modelBalanced',input:.40,output:1.60,tier:'qwen'}
  ].map(v=>Object.freeze({...v,source:sources[v.familyId]})));
  const defaults=Object.freeze(['deepseek','qwen']);
  // Provisional commercial terms for the private beta interface; server must confirm quotes.
  const wallet=Object.freeze({currency:'USD',creditsPerUsd:1000,markupBasisPoints:5000,minTopUp:1000,creditStep:10,presets:Object.freeze([1000,5000,10000,25000]),pricingVersion:'council-wallet-2026-09-27-draft'});
  const getVariant=(familyId,id)=>variants.find(v=>v.familyId===familyId&&v.id===id);
  function normalizeSelection(value){
    const ids=Array.isArray(value)?models.filter(m=>value.includes(m.id)).map(m=>m.id):[];
    return ids.length>=1&&ids.length<=4?ids:[...defaults];
  }
  function validSelection(value){
    return Array.isArray(value)&&value.length>=1&&value.length<=4&&new Set(value).size===value.length&&value.every(id=>models.some(m=>m.id===id));
  }
  function normalizeVersions(value){return Object.fromEntries(models.map(m=>[m.id,getVariant(m.id,value?.[m.id])?value[m.id]:m.defaultVersion]));}
  function validVersions(ids,versions){return validSelection(ids)&&ids.every(id=>!!getVariant(id,versions?.[id]));}
  function selectionDetails(ids,versions){
    if(!validVersions(ids,versions))throw new RangeError('Invalid model version');
    return ids.map(familyId=>({familyId,modelId:versions[familyId]}));
  }
  globalThis.CouncilConfig=Object.freeze({models,variants,defaults,wallet,catalogDate,getVariant,normalizeSelection,validSelection,normalizeVersions,validVersions,selectionDetails});
})();
