(() => {
 'use strict';
 const U=CouncilUI,{t,esc}=U,screen=document.body.dataset.screen;
 function render(){
  const root=document.getElementById('auth-root');
  if(!root)return;
  if(screen==='welcome'){root.innerHTML=`<h1>${esc(t('welcome'))}</h1><p class="auth-intro">${esc(t('welcomeIntro'))}</p><div class="welcome-links">${[['mvp','caseMvp'],['pricing','casePricing'],['launch','caseLaunch']].map(([id,key])=>`<a href="index.html?preset=${id}">${esc(t(key))} ↗</a>`).join('')}<a href="index.html">${esc(t('newChat'))} →</a></div>`;return;}
  document.title=t('welcomeTitle')+' — Council';
  const back=new URLSearchParams(location.search).get('returnTo')||'index.html';
  root.innerHTML=`<h1>${esc(t('welcomeTitle'))}</h1><p class="auth-intro">${esc(t('welcomeLead'))}</p><button class="google-button" id="google-auth" type="button"><img src="assets/auth/google-g.png" width="19" height="19" alt="">${esc(t('google'))}</button><p class="form-error" id="auth-error" role="alert" hidden></p><p class="auth-note">${esc(t('googleOnlyNote'))}</p>`;
  root.querySelector('#google-auth').onclick=()=>U.continueWithGoogle(root.querySelector('#google-auth'),back);
 }
 document.addEventListener('DOMContentLoaded',render);
 document.addEventListener('council:language',render);
})();
