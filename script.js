
(()=>{
'use strict';
const $=id=>document.getElementById(id),slides=[...document.querySelectorAll('.slide')];
const demoIndex=slides.length-1;
let current=0;
function fit(){const r=document.querySelector('.viewport').getBoundingClientRect();document.documentElement.style.setProperty('--scale',Math.min(r.width/1280,r.height/720));}
window.addEventListener('resize',fit);fit();
function render(){
  slides.forEach((s,i)=>{const active=i===current;s.classList.toggle('active',active);s.inert=!active;s.setAttribute('aria-hidden',String(!active));});
  $('slideCount').textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  $('slideTitle').textContent=slides[current].dataset.title;
  $('prevBtn').disabled=current===0;$('nextBtn').textContent=current===demoIndex?'Voltar ao início ↺':'Próximo →';
  $('progressValue').style.width=(current+1)/slides.length*100+'%';
  history.replaceState(null,'','#'+(current+1));

}
function go(index){current=(index+slides.length)%slides.length;render();}
$('prevBtn').onclick=()=>{if(current>0)go(current-1);};$('nextBtn').onclick=()=>go(current+1);
$('fullBtn').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});else document.documentElement.requestFullscreen?.().catch(()=>{});};
$('blackout').onclick=()=>{$('blackout').hidden=true;};
document.addEventListener('keydown',e=>{
  const el=document.activeElement;if(e.ctrlKey||e.altKey||e.metaKey||el?.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(el?.tagName))return;
  const key=e.key.toLowerCase();if(key==='b'){e.preventDefault();$('blackout').hidden=!$('blackout').hidden;return;}
  if(!$('blackout').hidden){if(key==='escape')$('blackout').hidden=true;return;}
  if(key==='arrowright'||key==='pagedown'){e.preventDefault();go(current+1);}
  else if(key==='arrowleft'||key==='pageup'){e.preventDefault();if(current>0)go(current-1);}
  else if(key==='home'){e.preventDefault();go(0);}else if(key==='end'){e.preventDefault();go(demoIndex);}
  else if(key===' '&&!['BUTTON','A'].includes(el?.tagName)){e.preventDefault();go(current+1);}
  else if(key==='f'){$('fullBtn').click();}
});
const start=Number(location.hash.slice(1));if(Number.isInteger(start)&&start>=1&&start<=slides.length)current=start-1;
window.addEventListener('hashchange',()=>{const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>=1&&n<=slides.length)go(n-1);});
render();
})();
