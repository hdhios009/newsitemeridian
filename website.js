(() => {
 'use strict';
 const panels=['positions','challenge','decision'];
 function selectPanel(id,focus=false){for(const name of panels){const b=document.getElementById('demo-'+name),p=document.getElementById('panel-'+name);if(!b||!p)continue;const on=id===name;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;p.hidden=!on;}if(focus)document.getElementById('demo-'+id)?.focus();}
 panels.forEach((name,i)=>{const b=document.getElementById('demo-'+name);b?.addEventListener('click',()=>selectPanel(name));b?.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%3;if(e.key==='ArrowLeft')n=(i+2)%3;if(e.key==='Home')n=0;if(e.key==='End')n=2;if(n!==undefined){e.preventDefault();selectPanel(panels[n],true);}});});
 const form=document.getElementById('support-form');form?.addEventListener('submit',async e=>{e.preventDefault();const message=document.getElementById('support-message'),error=document.getElementById('support-error');if(message.value.trim().length<10){error.textContent='Опишите вопрос чуть подробнее: не менее 10 символов.';error.hidden=false;message.setAttribute('aria-invalid','true');message.focus();return;}error.hidden=true;message.removeAttribute('aria-invalid');
 if(CouncilActions.connected('support.send')){
  const button=form.querySelector('button[type=submit]');button.disabled=true;
  try{await CouncilActions.run('support.send',{topic:document.getElementById('support-topic').value,message:message.value.trim()});const dlg=document.getElementById('support-dialog');dlg.querySelector('h2').textContent='Сообщение отправлено';dlg.querySelector('p').textContent='Спасибо за обратную связь.';dlg.showModal();}
  catch{error.textContent='Сообщение не отправлено. Попробуйте ещё раз.';error.hidden=false;}finally{button.disabled=false;}
  return;
 }
 const dlg=document.getElementById('support-dialog');dlg.querySelector('p').textContent='Текст подготовлен в этой вкладке. Сервис поддержки пока не подключён, поэтому сообщение никому не отправлено.';dlg.showModal();});
 document.getElementById('support-close')?.addEventListener('click',()=>document.getElementById('support-dialog').close());
 document.getElementById('copy-support')?.addEventListener('click',async()=>{const text=document.getElementById('support-message').value;const status=document.getElementById('support-status');try{await navigator.clipboard.writeText(text);status.textContent='Сообщение скопировано.';}catch{status.textContent='Копирование недоступно. Выделите текст в форме вручную.';}});
 if(document.body.dataset.publicPage==='checkout'){
  const packs=CouncilConfig.packs;
  const p=packs.find(p=>p.id===new URLSearchParams(location.search).get('pack'))||packs[1];
  document.getElementById('pack-name').textContent=p.name;document.getElementById('pack-amount').textContent=p.amount+' баллов';document.getElementById('pack-price').textContent=p.price.toLocaleString('ru-RU')+' ₽';
  document.getElementById('checkout-close').onclick=()=>document.getElementById('checkout-dialog').close();
  document.getElementById('checkout-button').onclick=async e=>{
   const button=e.currentTarget;
   if(!CouncilActions.connected('billing.checkout')){document.getElementById('checkout-dialog').showModal();return;}
   button.disabled=true;button.setAttribute('aria-busy','true');
   try{await CouncilActions.run('billing.checkout',{packId:p.id});}
   catch{const dlg=document.getElementById('checkout-dialog');dlg.querySelector('h2').textContent='Не удалось перейти к оплате';dlg.querySelector('p').textContent='Повторите попытку. Статус оплаты нужно проверять в истории операций.';dlg.showModal();}
   finally{button.disabled=false;button.removeAttribute('aria-busy');}
  };

 }
})();
