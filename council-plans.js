/* Subscription interface. All balances, quotes and mutations require verified server responses. */
(() => {
 'use strict';
 const U=CouncilUI,I=CouncilI18n,C=CouncilConfig,{esc,t,format,money}=U;
 Object.assign(I.copy,{
 plansTitle:['Ваш темп. Ваш Council.','Your pace. Your Council.','您的节奏，您的 Council。'],
 plansLead:['Один баланс для всех моделей. Выберите подписку или пополните его на свою сумму.','One balance for every model. Choose a subscription or add your own amount.','所有模型共用一个余额。选择订阅，或按需充值。'],
 plansHeading:['Выберите свой объём','Choose your allowance','选择您的额度'],
 monthly:['в месяц','per month','每月'], perMonth:['/ месяц','/ month','/月'],
 monthlyCredits:['{n} кредитов каждый месяц','{n} credits every month','每月 {n} 积分'],
 planBasic:['Для регулярных личных задач.','For regular personal work.','适合日常个人任务。'],
 planPro:['Для проектов, к которым возвращаются каждый день.','For projects you work on every day.','适合每天推进的项目。'],
 planMax:['Для большого объёма работы.','For a larger workload.','适合大量任务。'],
 planBonus:['На {n}% больше кредитов','{n}% more credits','多 {n}% 积分'],
 planBonusNote:['По сравнению с разовым пополнением на ту же сумму.','Compared with a one-time top-up of the same amount.','与相同金额的一次性充值相比。'],
 planSelect:['Выбрать {name}','Choose {name}','选择 {name}'],
 allModels:['GPT, Claude, DeepSeek и Qwen','GPT, Claude, DeepSeek and Qwen','GPT、Claude、DeepSeek 和 Qwen'],
 sameWallet:['Свободный выбор моделей','Choose your own models','自由选择模型'],
 topUpAnytime:['Можно пополнить в любой момент','Top up whenever you need','随时可以充值'],
 customPlan:['Индивидуальный','Custom','自选额度'],
 customLead:['Столько, сколько нужно вам. Один платёж, без подписки.','Just the amount you need. One payment, no subscription.','按需购买，一次付费，无需订阅。'],
 customButton:['Выбрать объём','Choose an amount','选择额度'],
 addCredits:['Пополнить','Top up','充值'],
 planTerms:['Подписка продлевается ежемесячно. Кредиты пакета действуют до конца оплаченного периода; разовые пополнения сохраняются. Отменить продление можно в управлении подпиской.','Subscriptions renew monthly. Plan credits expire at the end of the paid period; one-time top-ups remain available. Cancel renewal in subscription settings.','订阅按月自动续费。套餐积分在已付费周期结束时到期，一次性充值积分继续保留。可在订阅设置中取消续费。'],
 creditExplanation:['Кредиты — общий бюджет Council. Расход зависит от выбранных версий моделей, объёма текста и этапов обсуждения.','Credits are your shared Council budget. Usage depends on model versions, text volume and discussion rounds.','积分是 Council 的共用预算。消耗取决于模型版本、文本量及讨论轮次。'],
 balanceLoading:['Загружаем баланс…','Loading balance…','正在加载余额…'],
 balanceUnavailable:['Баланс пока недоступен.','Balance is currently unavailable.','暂时无法获取余额。'],
 balanceRetry:['Повторить','Try again','重试'],
 balanceGuest:['Войдите, чтобы увидеть баланс и подписку.','Sign in to see your balance and subscription.','登录以查看余额和订阅。'],
 accountPlan:['Ваш тариф','Your plan','当前套餐'],
 noPlan:['Без подписки','No subscription','未订阅'],
 managePlan:['Управление подпиской','Manage subscription','管理订阅'],
 currentPlan:['Текущий тариф','Current plan','当前套餐'],
 scheduledPlan:['Выбран на следующий месяц','Scheduled for next month','已设为下期套餐'],
 balanceBreakdown:['Состав баланса','Balance details','余额明细'],
 monthlyRemaining:['Из подписки','From subscription','订阅剩余'],
 purchasedRemaining:['Разовые пополнения','One-time top-ups','一次性充值'],
 expiresOn:['Действуют до {date}','Available until {date}','有效期至 {date}'],
 noExpiry:['Без ежемесячного сгорания','No monthly expiry','不会按月到期'],
 renewOn:['Следующий платёж: {amount} · {date}','Next payment: {amount} · {date}','下次付款：{amount} · {date}'],
 endsOn:['Продление отключено. Период оплачен до {date}.','Renewal is off. Your paid period ends on {date}.','已关闭续费。已付费周期截止至 {date}。'],
 paymentIssue:['Не удалось продлить подписку. Проверьте оплату в своём кабинете платежей.','Renewal failed. Check payment in your billing account.','续费失败，请在支付账户中查看付款情况。'],
 nextPlan:['С {date}: {name}','From {date}: {name}','自 {date} 起：{name}'],
 cancelRenewal:['Отменить продление','Cancel renewal','取消续费'],
 cancelExplanation:['Нового списания не будет. Оплаченный период и разовые пополнения сохраняются.','There will be no next renewal charge. Your paid period and one-time top-ups remain available.','不会再次续费扣款。已付费周期和一次性充值余额继续有效。'],
 cancelDone:['Продление отменено сервером.','Renewal cancellation confirmed.','已确认取消续费。'],
 changeExplanation:['Новый тариф начнёт действовать со следующего периода. Сейчас деньги не списываются.','The new plan starts next billing period. There is no charge now.','新套餐从下个账单周期开始生效，现在不会扣款。'],
 changePlan:['Изменить тариф','Change plan','更改套餐'],
 changeDone:['Смена тарифа подтверждена.','Plan change confirmed.','已确认更改套餐。'],
 quoteButton:['Перейти к оформлению','Continue to checkout','继续订购'],
 quoteTerms:['{amount} каждый месяц. {credits} кредитов на оплаченный период.','{amount} every month. {credits} credits per paid period.','每月 {amount}，每个已付费周期 {credits} 积分。'],
 subscriptionConsent:['Согласен с ежемесячным продлением и условиями подписки.','I agree to monthly renewal and the subscription terms.','我同意按月自动续费及订阅条款。'],
 subscriptionPay:['Оформить подписку','Subscribe','订阅'],
 paymentConnecting:['Проверяем условия…','Checking terms…','正在核对条款…'],
 subscriptionError:['Не удалось подтвердить операцию. Проверьте соединение и попробуйте ещё раз.','The operation could not be confirmed. Check your connection and try again.','无法确认操作，请检查网络后重试。'],
 subscriptionOffline:['Оформление подписки ещё не подключено. Деньги не списаны.','Subscription checkout is not connected yet. No money was charged.','订阅支付尚未连接，没有扣款。'],
 historyUnavailable:['История появится после подключения платёжного кабинета.','History will be available when billing is connected.','连接支付服务后可查看历史记录。'],
 historyEmpty:['Операций пока нет.','No transactions yet.','暂无交易记录。'],
 operationDate:['Дата','Date','日期'], operationType:['Операция','Transaction','操作'], operationCredits:['Кредиты','Credits','积分'],
 tx_subscription:['Начисление по подписке','Subscription credits','订阅积分'],
 tx_topup:['Пополнение','Top-up','充值'], tx_usage:['Использование','Usage','使用'],
 tx_refund:['Возврат','Refund','退款'], tx_expiry:['Окончание срока','Expiry','到期'],
 tx_adjustment:['Корректировка','Adjustment','调整'],
 chooseLogin:['Войдите или зарегистрируйтесь','Sign in or create an account','登录或注册'],
 nextPaymentTerms:['Следующие списания — ежемесячно от даты первого успешного платежа.','Subsequent charges are monthly from the first successful payment date.','后续扣款按首次成功付款日期每月进行。']
 });
 const plan=id=>C.subscriptions.plans.find(p=>p.id===id);
 const user=()=>CouncilSession.current?.user.id||null;
 const date=x=>new Intl.DateTimeFormat(I.locale,{day:'numeric',month:'short',year:'numeric'}).format(new Date(x));
 const isDate=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
 const nonnegative=x=>Number.isFinite(x)&&x>=0&&x<=Number.MAX_SAFE_INTEGER;
 const num=x=>new Intl.NumberFormat(I.locale,{maximumFractionDigits:2}).format(x);
 let mounted=null, requestId=0, snapshot=null, snapshotOwner=null, loading=false, failed=false, busy=false, actionVersion=0;
 function validBalance(r,owner){
  if(!r||r.userId!==owner||!nonnegative(r.availableCredits)||!nonnegative(r.subscriptionCredits)||!nonnegative(r.topUpCredits))return false;
  if(Math.abs(r.availableCredits-r.subscriptionCredits-r.topUpCredits)>.000001)return false;
  if(r.subscriptionCredits>0&&!isDate(r.creditsExpireAt))return false;
  if(r.subscription!==null){
   const s=r.subscription;
   if(!s||!plan(s.planId)||!['active','canceling','past_due'].includes(s.status)||!isDate(s.periodEnd)||s.currency!=='USD'||!Number.isSafeInteger(s.renewalAmountMinor)||s.renewalAmountMinor<=0)return false;
   if(s.nextPlanId!=null&&!plan(s.nextPlanId))return false;
  }
  return Array.isArray(r.transactions)&&r.transactions.length<=100&&r.transactions.every(x=>typeof x.id==='string'&&isDate(x.createdAt)&&['subscription','topup','usage','refund','expiry','adjustment'].includes(x.type)&&Number.isFinite(x.credits)&&Math.abs(x.credits)<=Number.MAX_SAFE_INTEGER);
 }
 function current(){return snapshotOwner===user()?snapshot:null;}
 function loggedIn(){
  if(user())return true;
  U.dialog(t('chooseLogin'),'<p class="prose">'+esc(t('balanceGuest'))+'</p><div class="dialog-actions"><a class="button subtle" href="signup.html?returnTo=balance.html">'+esc(t('signup'))+'</a><a class="button dark" href="login.html?returnTo=balance.html">'+esc(t('login'))+'</a></div>');
  return false;
 }
 function custom(){
  U.dialog(t('customPlan'),'<div id="subscription-topup"></div>',{wide:true,onOpen:d=>{
   CouncilBudget.mount(d.querySelector('#subscription-topup'));
   d.querySelector('.page-heading')?.remove();
  }});
 }
 function render(){
  if(!mounted?.isConnected)return;
  const r=current(),s=r?.subscription;
  const status=!user()?t('balanceGuest'):loading?t('balanceLoading'):t('balanceUnavailable');
  const subtitle=s?(s.status==='canceling'?t('endsOn',{date:date(s.periodEnd)}):s.status==='past_due'?t('paymentIssue'):t('renewOn',{amount:money(s.renewalAmountMinor/100),date:date(s.periodEnd)})):t('sameWallet');
  mounted.innerHTML='<header class="page-heading plans-heading"><h1>'+esc(t('plansTitle'))+'</h1><p>'+esc(t('plansLead'))+'</p></header>'+
   '<section class="membership-overview" aria-label="'+esc(t('balance'))+'"><div class="membership-total"><span>'+esc(t('availableBalance'))+'</span><strong id="available-balance">'+(r?num(r.availableCredits):'—')+'</strong><span>'+(r?esc(t('credits')):esc(status))+'</span></div><div class="membership-plan">'+
   (r?'<span>'+esc(t('accountPlan'))+'</span><strong>'+esc(s?plan(s.planId).name:t('noPlan'))+'</strong><p>'+esc(subtitle)+'</p>'+(s?.nextPlanId?'<p>'+esc(t('nextPlan',{name:plan(s.nextPlanId).name,date:date(s.periodEnd)}))+'</p>':''):'')+
   '<div class="membership-actions"><button class="button dark" data-add>'+esc(t('addCredits'))+'</button>'+(s?'<button class="button subtle" data-manage>'+esc(t('managePlan'))+'</button>':'')+
   (!user()?'<a class="text-link" href="login.html?returnTo=balance.html">'+esc(t('login'))+'</a>':failed?'<button class="text-link" data-reload>'+esc(t('balanceRetry'))+'</button>':'')+'</div></div>'+
   (r?'<details class="membership-breakdown"><summary>'+esc(t('balanceBreakdown'))+'</summary><div><p><span>'+esc(t('monthlyRemaining'))+'</span><strong>'+num(r.subscriptionCredits)+'</strong><small>'+(r.subscriptionCredits>0?esc(t('expiresOn',{date:date(r.creditsExpireAt)})):'—')+'</small></p><p><span>'+esc(t('purchasedRemaining'))+'</span><strong>'+num(r.topUpCredits)+'</strong><small>'+esc(t('noExpiry'))+'</small></p></div></details>':'')+'</section>'+
   '<section aria-labelledby="plans-heading"><h2 class="plans-section-title" id="plans-heading">'+esc(t('plansHeading'))+'</h2><div class="subscription-grid">'+C.subscriptions.plans.map(p=>{
    const active=s?.planId===p.id,scheduled=s?.nextPlanId===p.id;
    return '<article class="subscription-card'+(p.id==='pro'?' subscription-card-pro':'')+'"><div class="plan-name-row"><h3>'+esc(p.name)+'</h3>'+(p.bonusPercent?'<span class="plan-bonus">+'+p.bonusPercent+'%</span>':'')+'</div><p class="plan-description">'+esc(t('plan'+p.name))+'</p><p class="plan-price"><strong>'+esc(money(p.amountMinor/100))+'</strong><span>'+esc(t('perMonth'))+'</span></p><p class="plan-allowance">'+esc(t('monthlyCredits',{n:format(p.credits)}))+'</p><ul><li>'+esc(t('sameWallet'))+'</li><li>'+esc(t('topUpAnytime'))+'</li><li>'+(p.bonusPercent?esc(t('planBonus',{n:p.bonusPercent})):esc(t('allModels')))+'</li></ul><button class="button '+(p.id==='pro'?'dark':'subtle')+' full" data-plan="'+p.id+'" '+(active||scheduled?'disabled':'')+'>'+esc(active?t('currentPlan'):scheduled?t('scheduledPlan'):t('planSelect',{name:p.name}))+'</button></article>';
   }).join('')+'</div><p class="plans-bonus-note">'+esc(t('planBonusNote'))+'</p><article class="custom-plan-row"><div><h3>'+esc(t('customPlan'))+'</h3><p>'+esc(t('customLead'))+'</p></div><button class="button subtle" data-custom>'+esc(t('customButton'))+U.icon('chevron')+'</button></article><div class="plans-explanation"><p>'+esc(t('planTerms'))+'</p><p>'+esc(t('creditExplanation'))+'</p><a class="text-link" href="terms.html">'+esc(t('terms'))+'</a></div></section>'+
   '<section class="billing-history"><h2 class="plans-section-title">'+esc(t('transactions'))+'</h2>'+(r?(r.transactions.length?'<div class="billing-table-wrap"><table><thead><tr><th>'+esc(t('operationDate'))+'</th><th>'+esc(t('operationType'))+'</th><th>'+esc(t('operationCredits'))+'</th></tr></thead><tbody>'+r.transactions.map(x=>'<tr><td>'+esc(date(x.createdAt))+'</td><td>'+esc(t('tx_'+x.type))+'</td><td>'+esc(num(x.credits))+'</td></tr>').join('')+'</tbody></table></div>':'<p>'+esc(t('historyEmpty'))+'</p>'):'<p>'+esc(t(user()?'historyUnavailable':'balanceGuest'))+'</p>')+'</section>';
  mounted.querySelectorAll('[data-add],[data-custom]').forEach(b=>b.onclick=custom);
  mounted.querySelector('[data-manage]')?.addEventListener('click',manage);
  mounted.querySelector('[data-reload]')?.addEventListener('click',load);
  mounted.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>choose(b.dataset.plan));
 }
 async function load(){
  const id=++requestId,owner=user();loading=!!owner;failed=false;snapshot=null;snapshotOwner=null;render();
  if(!owner)return;
  if(!CouncilActions.connected('billing.balance')){loading=false;failed=true;render();return;}
  try{const r=await CouncilActions.run('billing.balance',{});if(id!==requestId||owner!==user())return;if(!validBalance(r,owner))throw new Error('Invalid balance');snapshot=r;snapshotOwner=owner;}
  catch{if(id!==requestId||owner!==user())return;failed=true;}
  if(id===requestId){loading=false;render();}
 }
 async function guarded(action,payload,button,onResult){
  if(busy)return;
  if(!loggedIn())return;
  if(!CouncilActions.connected(action)){U.notice(t('balance'),t('subscriptionOffline'));return;}
  const owner=user(),version=actionVersion,dialog=document.getElementById('council-dialog');
  const stillCurrent=()=>owner===user()&&version===actionVersion&&button.isConnected&&dialog?.open;
  busy=true;button.disabled=true;
  try{const r=await CouncilActions.run(action,payload);if(stillCurrent())await onResult(r,owner);}
  catch{if(stillCurrent())U.notice(t('balance'),t('subscriptionError'));}
  finally{busy=false;if(button.isConnected)button.disabled=false;}
 }
 function choose(id){
  const p=plan(id);if(!p)return;
  const s=current()?.subscription;
  if(s){schedule(id);return;}
  U.dialog(p.name,'<p class="subscription-confirm-price">'+esc(money(p.amountMinor/100))+' <span>'+esc(t('perMonth'))+'</span></p><p class="prose">'+esc(t('monthlyCredits',{n:format(p.credits)}))+'</p><p class="subscription-conditions">'+esc(t('planTerms'))+'</p><div class="dialog-actions"><button class="button dark" data-get-subscription>'+esc(t('quoteButton'))+'</button></div>',{onOpen:d=>d.querySelector('[data-get-subscription]').onclick=e=>{
   guarded('billing.subscription.quote',{planId:p.id,pricingVersion:C.wallet.pricingVersion},e.currentTarget,(q,owner)=>{
    if(!q||q.userId!==owner||typeof q.id!=='string'||!q.id||q.planId!==p.id||q.credits!==p.credits||q.amountMinor!==p.amountMinor||q.currency!=='USD'||q.interval!=='month'||q.recurring!==true||q.pricingVersion!==C.wallet.pricingVersion||!isDate(q.expiresAt)||Date.parse(q.expiresAt)<=Date.now()||typeof q.description!=='string'||!q.description)throw new Error('Invalid subscription quote');
    confirmQuote(q,owner);
   });
  }});
 }
 function confirmQuote(q,owner){
  U.dialog(t('subscriptionPay'),'<p class="subscription-confirm-price">'+esc(money(q.amountMinor/100))+' <span>'+esc(t('perMonth'))+'</span></p><p class="prose">'+esc(t('quoteTerms',{amount:money(q.amountMinor/100),credits:format(q.credits)}))+'</p><p class="subscription-conditions">'+esc(q.description)+'</p><p class="subscription-conditions">'+esc(t('nextPaymentTerms'))+'</p><label class="subscription-consent"><input id="subscription-consent" type="checkbox"><span>'+esc(t('subscriptionConsent'))+' <a href="terms.html" target="_blank" rel="noopener">'+esc(t('terms'))+'</a></span></label><div class="dialog-actions"><button class="button dark" data-subscribe disabled>'+esc(t('subscriptionPay'))+'</button></div>',{onOpen:d=>{
   const consent=d.querySelector('#subscription-consent'),button=d.querySelector('[data-subscribe]');
   consent.onchange=()=>button.disabled=!consent.checked;
   button.onclick=()=>{if(!consent.checked||owner!==user())return;if(Date.parse(q.expiresAt)<=Date.now()){U.notice(t('balance'),t('subscriptionError'));return;}
    guarded('billing.checkout',{quoteId:q.id,consent:{recurring:true,pricingVersion:q.pricingVersion}},button,payment=>{
     const url=U.safeUrl(payment?.url);if(!url||new URL(url).protocol!=='https:')throw new Error('Invalid payment URL');location.assign(url);
    });
   };
  }});
 }
 function schedule(id){
  const s=current()?.subscription,p=plan(id);if(!s||!p)return;
  U.dialog(t('changePlan'),'<p class="prose">'+esc(t('nextPlan',{name:p.name,date:date(s.periodEnd)}))+'</p><p class="subscription-conditions">'+esc(t('changeExplanation'))+'</p><p class="prose">'+esc(t('quoteTerms',{amount:money(p.amountMinor/100),credits:format(p.credits)}))+'</p><div class="dialog-actions"><button class="button dark" data-confirm-change>'+esc(t('changePlan'))+'</button></div>',{onOpen:d=>d.querySelector('[data-confirm-change]').onclick=e=>guarded('billing.subscription.change',{planId:p.id,pricingVersion:C.wallet.pricingVersion},e.currentTarget,(r,owner)=>{
   if(r?.userId!==owner||r.accepted!==true||r.scheduledPlanId!==p.id||!isDate(r.effectiveAt)||Date.parse(r.effectiveAt)<=Date.now())throw new Error('Invalid change response');U.closeDialog();U.toast(t('changeDone'));load();
  })});
 }
 function manage(){
  const s=current()?.subscription;if(!s)return;
  U.dialog(t('managePlan'),'<p class="subscription-confirm-price">'+esc(plan(s.planId).name)+'</p><p class="prose">'+esc(t('expiresOn',{date:date(s.periodEnd)}))+'</p><p class="subscription-conditions">'+esc(t('cancelExplanation'))+'</p><div class="dialog-actions">'+(s.status!=='canceling'?'<button class="button subtle danger" data-cancel-renewal>'+esc(t('cancelRenewal'))+'</button>':'<p>'+esc(t('endsOn',{date:date(s.periodEnd)}))+'</p>')+'</div>',{onOpen:d=>d.querySelector('[data-cancel-renewal]')?.addEventListener('click',e=>guarded('billing.subscription.cancel',{},e.currentTarget,(r,owner)=>{
   if(r?.userId!==owner||r.accepted!==true||r.cancelAtPeriodEnd!==true||!isDate(r.effectiveAt))throw new Error('Invalid cancellation response');U.closeDialog();U.toast(t('cancelDone'));load();
  }))});
 }
 function mount(container){mounted=container;snapshot=null;snapshotOwner=null;load();}
 document.addEventListener('council:session',()=>{actionVersion++;requestId++;U.closeDialog();snapshot=null;snapshotOwner=null;loading=false;render();});
 document.addEventListener('council:before-language',()=>{actionVersion++;});
 globalThis.CouncilPlans=Object.freeze({mount,validBalance});
})();

