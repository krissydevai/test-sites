/* ============================================================
   NETCONG DENTISTRY — shared behaviors (loaded on every page)
   Everything is null-guarded so each page only runs what it has.
   ============================================================ */
(function(){
  "use strict";

  /* ---- nav scrolled state ---- */
  var nav=document.getElementById('nav');
  if(nav){
    var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>10); };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }

  /* ---- mobile menu ---- */
  var burger=document.getElementById('burger'),
      menu=document.getElementById('mobileMenu'),
      scrim=document.getElementById('scrim');
  if(burger&&menu&&scrim){
    var setMenu=function(open){
      burger.classList.toggle('open',open);
      menu.classList.toggle('open',open);
      scrim.classList.toggle('show',open);
      scrim.style.display=open?'block':'none';
      burger.setAttribute('aria-expanded',open?'true':'false');
      document.body.style.overflow=open?'hidden':'';
    };
    burger.addEventListener('click',function(){ setMenu(!menu.classList.contains('open')); });
    scrim.addEventListener('click',function(){ setMenu(false); });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
  }

  /* ---- scroll reveal ---- */
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.14, rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  }

  /* ---- before/after whitening slider (home only) ---- */
  var stage=document.getElementById('baStage'),
      after=document.getElementById('baAfter'),
      handle=stage?stage.querySelector('.ba-handle'):null;
  if(stage&&after&&handle){
    var dragging=false;
    var setPos=function(clientX){
      var r=stage.getBoundingClientRect();
      var p=Math.max(4,Math.min(96,((clientX-r.left)/r.width)*100));
      after.style.width=p+'%'; handle.style.left=p+'%';
    };
    stage.addEventListener('mousedown',function(e){ dragging=true; setPos(e.clientX); });
    window.addEventListener('mousemove',function(e){ if(dragging) setPos(e.clientX); });
    window.addEventListener('mouseup',function(){ dragging=false; });
    stage.addEventListener('mousemove',function(e){ if(!('ontouchstart' in window)) setPos(e.clientX); });
    stage.addEventListener('touchstart',function(e){ dragging=true; setPos(e.touches[0].clientX); },{passive:true});
    stage.addEventListener('touchmove',function(e){ if(dragging) setPos(e.touches[0].clientX); },{passive:true});
    stage.addEventListener('touchend',function(){ dragging=false; });
  }

  /* ---- generic form validator (any form.js-validate) ---- */
  var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validate(input){
    var v=input.value, t=(input.getAttribute('type')||'text').toLowerCase();
    if(t==='email') return emailRe.test(v);
    if(t==='tel')   return v.replace(/\D/g,'').length>=7;
    return v.trim().length>0;
  }
  document.querySelectorAll('form.js-validate').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      form.querySelectorAll('[required]').forEach(function(input){
        var field=input.closest('.field'); var good=validate(input);
        if(field) field.classList.toggle('invalid',!good);
        if(!good) ok=false;
      });
      if(ok){
        var parent=form.parentElement;
        var success=parent.querySelector('.form-success, .chat-sent');
        form.style.display='none';
        var alt=parent.querySelector('.chat-alt'); if(alt) alt.style.display='none';
        if(success){ success.classList.add('show'); if(!parent.classList.contains('chat-body')) success.scrollIntoView({behavior:'smooth',block:'center'}); }
      }
    });
    form.querySelectorAll('input,textarea').forEach(function(inp){
      inp.addEventListener('input',function(){ var f=inp.closest('.field'); if(f&&f.classList.contains('invalid')) f.classList.remove('invalid'); });
    });
  });

  /* ---- set min date = today on any date input ---- */
  var today=(function(){ var t=new Date(); return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0'); })();
  document.querySelectorAll('input[type=date]').forEach(function(d){ d.min=today; });

  /* ---- back to top ---- */
  var toTop=document.getElementById('toTop');
  if(toTop){
    var toggleTop=function(){ toTop.classList.toggle('show', window.scrollY>520); };
    window.addEventListener('scroll',toggleTop,{passive:true}); toggleTop();
    toTop.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  }

  /* ---- live chat / help widget ---- */
  var launcher=document.getElementById('chatLauncher'),
      panel=document.getElementById('chatPanel'),
      chatClose=document.getElementById('chatClose'),
      badge=launcher?launcher.querySelector('.cl-badge'):null;
  function openChat(o){
    if(!panel||!launcher) return;
    panel.classList.toggle('open',o);
    launcher.classList.toggle('hide',o);
    launcher.setAttribute('aria-expanded',o?'true':'false');
    if(toTop) toTop.classList.toggle('tucked',o);
    if(o){ if(badge) badge.style.display='none'; setTimeout(function(){ var f=document.getElementById('cName'); if(f) f.focus(); },420); }
  }
  if(launcher&&panel){
    launcher.addEventListener('click',function(){ openChat(true); });
    if(chatClose) chatClose.addEventListener('click',function(){ openChat(false); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&panel.classList.contains('open')) openChat(false); });
  }

  /* ---- QA hooks for screenshots ---- */
  if(location.hash.indexOf('qa-reveal')>-1){ document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); }
  if(location.hash.indexOf('qa-chat')>-1){ openChat(true); }
  if(location.hash.indexOf('qa-top')>-1 && toTop){ toTop.classList.add('show'); }
})();
