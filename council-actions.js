/* UI-to-backend boundary. This file never calls a model, stores credentials or takes a payment. */
(() => {
  'use strict';
  const allowed=new Set(['discussion.create','discussion.reply','discussion.cancel','history.list','history.get','history.rename','history.delete','session.get','auth.logout','auth.register','auth.login','auth.google','auth.verify','auth.resend','auth.recover','auth.reset','profile.update','account.export','account.delete','account.sessions.revoke','billing.balance','billing.quote','billing.checkout','billing.subscription.quote','billing.subscription.change','billing.subscription.cancel','support.send']);
  class IntegrationRequired extends Error {
    constructor(action){super('Server handler is not connected.');this.name='IntegrationRequired';this.code='INTEGRATION_REQUIRED';this.action=action;}
  }
  let handlers=Object.create(null);
  function connect(next){
    if(!next||typeof next!=='object')throw new TypeError('Expected an object of handlers');
    const prepared=Object.create(null);
    for(const [key,value] of Object.entries(next)){
      if(!allowed.has(key)||typeof value!=='function')throw new TypeError('Unknown action or invalid handler: '+key);
      prepared[key]=value;
    }
    handlers=prepared;
  }
  function connected(action){return allowed.has(action)&&Object.hasOwn(handlers,action);}
  async function run(action,payload,options={}){
    if(!allowed.has(action))throw new TypeError('Unknown action: '+action);
    if(options.signal?.aborted)throw new DOMException('Operation cancelled','AbortError');
    if(!connected(action))throw new IntegrationRequired(action);
    return handlers[action](payload,{signal:options.signal,onEvent:options.onEvent});
  }
  globalThis.CouncilActions=Object.freeze({connect,connected,run,IntegrationRequired});
})();
