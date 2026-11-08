export function mountQonticNotebook(root=document){
  const runs=[...root.querySelectorAll('[data-qn-run]')];
  const close=()=>runs.forEach(run=>{const menu=run.querySelector('[data-qn-run-menu]');if(menu)menu.hidden=true;run.querySelector('[data-qn-run-menu-toggle]')?.setAttribute('aria-expanded','false')});
  runs.forEach(run=>{const menu=run.querySelector('[data-qn-run-menu]');const toggle=run.querySelector('[data-qn-run-menu-toggle]');toggle?.addEventListener('click',event=>{event.stopPropagation();const opening=menu.hidden;close();menu.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening))});menu?.addEventListener('click',close)});
  document.addEventListener('click',event=>{if(!event.target.closest('[data-qn-run]'))close()});
  root.querySelectorAll('[data-qn-result-collapse]').forEach(button=>button.addEventListener('click',()=>{const panel=button.closest('.qn-results');const body=panel.querySelector('.readout');body.hidden=!body.hidden;button.textContent=body.hidden?'+':'−'}));
  root.querySelector('[data-qn-theme]')?.addEventListener('click',event=>{const dark=document.body.classList.toggle('qn-dark');event.currentTarget.setAttribute('aria-pressed',String(dark));event.currentTarget.textContent=dark?'Light':'Dark'});
  root.querySelectorAll('[data-qn-representation]').forEach(button=>button.addEventListener('click',()=>{root.querySelectorAll('[data-qn-representation]').forEach(item=>item.classList.toggle('active',item===button));root.dispatchEvent(new CustomEvent('qontic:representation',{detail:{representation:button.dataset.qnRepresentation},bubbles:true}))}));
  return{closeMenu:close};
}
