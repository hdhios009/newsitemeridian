/* Front-end forms only. Never sends or stores entered email/password values. */
(() => {
 'use strict';
 const root=document.getElementById('auth-root');if(!root)return;
 const screen=document.body.dataset.screen||'signup';
 const info=document.getElementById('auth-message');
 const field=(name,label,type='text',autocomplete='off',placeholder='')=>`<div class="form-field"><label for="${name}">${label}</label><div class="form-input-wrap"><input id="${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" ${name==='code'?'inputmode="numeric" maxlength="6"':''} ${name==='password'?'minlength="8" maxlength="128"':''} ${name==='email'?'maxlength="254"':''} placeholder="${placeholder}" aria-describedby="${name}-error" required>${type==='password'?`<button type="button" class="password-toggle" data-toggle-password="${name}" aria-label="Показать пароль">Показать</button>`:''}</div><p id="${name}-error" class="field-error" hidden></p></div>`;
 const google='<button type="button" class="google-button" id="google-auth" data-server-action="auth.google"><img src="assets/auth/google-g.png" alt="" width="20" height="20">Продолжить с Google</button><div class="auth-divider">или по почте</div>';
 const configurations={
  signup:{eyebrow:'Ваше пространство для решений',title:'Создать аккаунт',intro:'Создайте аккаунт, чтобы возвращаться к обсуждениям.',body:`${google}<form id="auth-form" novalidate>${field('email','Электронная почта','email','email','you@example.com')}${field('password','Пароль','password','new-password','Не менее 8 символов')}<label class="consent-check"><input type="checkbox" name="consent" id="consent" aria-describedby="consent-error"><span>Принимаю <a href="terms.html">условия использования</a> и ознакомлен с <a href="privacy.html">описанием обработки данных</a>.</span></label><p class="field-error" id="consent-error" hidden></p><button class="primary-button full" type="submit">Создать аккаунт <span aria-hidden="true">→</span></button></form><p class="auth-alternate">Уже есть аккаунт? <a href="login.html">Войти</a></p>`},
  login:{eyebrow:'С возвращением',title:'Войти в Council',intro:'Войдите, чтобы открыть своё пространство.',body:`${google}<form id="auth-form" novalidate>${field('email','Электронная почта','email','email','you@example.com')}${field('password','Пароль','password','current-password','Введите пароль')}<div class="forgot-row"><a href="forgot-password.html">Не помню пароль</a></div><button class="primary-button full" type="submit">Войти <span aria-hidden="true">→</span></button></form><p class="auth-alternate">Первый раз здесь? <a href="signup.html">Создать аккаунт</a></p>`},
  verify:{eyebrow:'Ещё один шаг',title:'Подтвердите почту.',intro:'Введите шестизначный код подтверждения.',body:`<form id="auth-form" novalidate>${field('code','Код подтверждения','text','one-time-code','000000')}<button class="primary-button full" type="submit">Подтвердить</button></form><button class="resend-button" id="resend">Отправить код ещё раз</button><p class="auth-alternate"><a href="signup.html">Изменить почту</a></p>`},
  forgot:{eyebrow:'Восстановление доступа',title:'Начнём с почты.',intro:'Укажите адрес, который использовали при регистрации.',body:`<form id="auth-form" novalidate>${field('email','Электронная почта','email','email','you@example.com')}<button class="primary-button full" type="submit">Продолжить</button></form><p class="auth-alternate"><a href="login.html">Вернуться ко входу</a></p>`},
  reset:{eyebrow:'Новый пароль',title:'Вернитесь к своим идеям.',intro:'Выберите пароль, который ещё не использовали для Council.',body:`<form id="auth-form" novalidate>${field('password','Новый пароль','password','new-password','Не менее 8 символов')}${field('confirm','Повторите пароль','password','new-password','Ещё раз')}<button class="primary-button full" type="submit">Сохранить пароль</button></form><p class="auth-alternate"><a href="login.html">Вернуться ко входу</a></p>`},
  welcome:{eyebrow:'Начните с того, что важно',title:'Что обсудим первым?',intro:'Выберите задачу для первого обсуждения.',body:`<div class="welcome-options" role="radiogroup" aria-label="Первый пример"><label><input type="radio" name="first-task" value="mvp" checked><span><strong>План и объём MVP</strong><small>Что сделать сейчас, а что отложить.</small></span><span aria-hidden="true">→</span></label><label><input type="radio" name="first-task" value="pricing"><span><strong>Оплата и тарифы</strong><small>Сравнить варианты и увидеть допущения.</small></span><span aria-hidden="true">→</span></label><label><input type="radio" name="first-task" value="launch"><span><strong>Первые пользователи</strong><small>Выбрать следующий эксперимент.</small></span><span aria-hidden="true">→</span></label></div><button class="primary-button full" id="welcome-continue">Открыть Council</button><p class="auth-alternate"><a href="beta.html">Начать с пустого вопроса</a></p>`}
 };
 const c=configurations[screen]||configurations.signup;
 root.innerHTML=`<h1>${c.title}</h1><p class="auth-intro">${c.intro}</p>${c.body}`;
 function showMessage(title,text,link,linkText){info.querySelector('h2').textContent=title;info.querySelector('p').textContent=text;const a=info.querySelector('a');a.hidden=!link;if(link){a.href=link;a.textContent=linkText;}info.showModal();info.querySelector('h2').tabIndex=-1;info.querySelector('h2').focus();}
 info.querySelector('button').onclick=()=>info.close();
 document.getElementById('google-auth')?.addEventListener('click',async e=>{
  if(!CouncilActions.connected('auth.google')){showMessage('Вход через Google','Вход через Google пока недоступен. Попробуйте позже.');return;}
  const button=e.currentTarget;button.disabled=true;
  try{await CouncilActions.run('auth.google',{});}catch{showMessage('Вход не завершён','Попробуйте ещё раз или войдите по почте.');}finally{button.disabled=false;}
 });
 document.getElementById('resend')?.addEventListener('click',async e=>{
  if(!CouncilActions.connected('auth.resend')){showMessage('Не удалось отправить код','Отправка писем пока недоступна. Письмо не отправлено.');return;}
  const button=e.currentTarget;button.disabled=true;
  try{await CouncilActions.run('auth.resend',{});showMessage('Проверьте почту','Запрос на повторную отправку принят.');}catch{showMessage('Не удалось отправить код','Попробуйте ещё раз чуть позже.');}finally{button.disabled=false;}
 });
 root.querySelectorAll('[data-toggle-password]').forEach(b=>b.onclick=()=>{const input=document.getElementById(b.dataset.togglePassword);const show=input.type==='password';input.type=show?'text':'password';b.textContent=show?'Скрыть':'Показать';b.setAttribute('aria-label',show?'Скрыть пароль':'Показать пароль');});
 const form=document.getElementById('auth-form');
 const formAction={signup:'auth.register',login:'auth.login',verify:'auth.verify',forgot:'auth.recover',reset:'auth.reset'}[screen];
 if(formAction)form?.querySelector('button[type=submit]')?.setAttribute('data-server-action',formAction);
 function resetForm(){form?.reset();root.querySelectorAll('[data-toggle-password]').forEach(b=>{document.getElementById(b.dataset.togglePassword).type='password';b.textContent='Показать';b.setAttribute('aria-label','Показать пароль');});}
 function clearFieldError(input){if(!input?.id)return;const node=document.getElementById(input.id+'-error');if(node)node.hidden=true;input.removeAttribute('aria-invalid');}
 form?.addEventListener('input',e=>clearFieldError(e.target));
 form?.addEventListener('change',e=>clearFieldError(e.target));
 function error(name,text){const input=document.getElementById(name),node=document.getElementById(name+'-error');if(!input||!node)return;node.textContent=text;node.hidden=false;input.setAttribute('aria-invalid','true');}
 form?.addEventListener('submit',async e=>{
  e.preventDefault();root.querySelectorAll('.field-error').forEach(n=>n.hidden=true);root.querySelectorAll('[aria-invalid]').forEach(n=>n.removeAttribute('aria-invalid'));const values=Object.fromEntries(new FormData(form));let first=null;
  const check=(name,bad,message)=>{if(bad){error(name,message);first??=name;}};
  if(['login','signup','forgot'].includes(screen))check('email',!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((values.email||'').trim()),'Введите адрес в формате name@example.com.');
  if(['signup','reset'].includes(screen))check('password',(values.password||'').length<8,'Нужно не менее 8 символов.');
  if(screen==='login')check('password',!values.password,'Введите пароль.');
  if(screen==='signup')check('consent',!values.consent,'Отметьте ознакомление с условиями использования.');
  if(screen==='reset')check('confirm',values.confirm!==values.password,'Пароли не совпадают.');
  if(screen==='verify')check('code',!/^\d{6}$/.test(values.code||''),'Введите шестизначный код.');
  if(first){document.getElementById(first).focus();return;}
  const action={signup:'auth.register',login:'auth.login',verify:'auth.verify',forgot:'auth.recover',reset:'auth.reset'}[screen];
  const submit=form.querySelector('button[type=submit]');
  const connected=CouncilActions.connected(action);
  if(connected){
   submit.disabled=true;submit.setAttribute('aria-busy','true');
   try{await CouncilActions.run(action,values);}
   catch{showMessage('Не удалось продолжить','Проверьте данные и повторите попытку.');return;}
   finally{submit.disabled=false;submit.removeAttribute('aria-busy');}
  }
  resetForm();
  if(connected){
   if(screen==='signup')location.href='verify.html';
   if(screen==='login')location.href='beta.html';
   if(screen==='verify')location.href='welcome.html';
   if(screen==='forgot')showMessage('Проверьте почту','Если аккаунт с таким адресом существует, отправлена инструкция по восстановлению.');
   if(screen==='reset')showMessage('Пароль обновлён','Теперь можно войти с новым паролем.','login.html','Войти');
   return;
  }
  const unavailable={signup:['Регистрация пока недоступна','Аккаунт не создан. Попробуйте позже.'],login:['Вход пока недоступен','Не удалось войти. Попробуйте позже.'],verify:['Подтверждение пока недоступно','Код не проверен. Попробуйте позже.'],forgot:['Восстановление пока недоступно','Письмо не отправлено. Попробуйте позже.'],reset:['Не удалось изменить пароль','Пароль не изменён. Попробуйте позже.']}[screen];
  if(unavailable)showMessage(...unavailable);
 });
 document.getElementById('welcome-continue')?.addEventListener('click',()=>{const value=root.querySelector('input[name=first-task]:checked')?.value||'mvp';location.href='beta.html?preset='+encodeURIComponent(value);});
 window.addEventListener('pagehide',resetForm);
})();
