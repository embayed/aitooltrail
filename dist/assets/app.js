const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#navigation').classList.toggle('open',open);});
const form=document.querySelector('#filters');
if(form){
 const fields=['q','category','pricing','sort'].map(name=>form.elements.namedItem(name));
 const [q,category,pricing,sort]=fields,params=new URLSearchParams(location.search);
 for(const f of fields)if(params.has(f.name))f.value=params.get(f.name);
 const cards=[...document.querySelectorAll('.tool-card')];
 function update(){let count=0;const words=q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
 cards.sort((a,b)=>sort.value==='recent'?b.dataset.added.localeCompare(a.dataset.added):a.dataset.name.localeCompare(b.dataset.name));
 for(const card of cards){card.hidden=!(words.every(w=>card.dataset.search.includes(w))&&(!category.value||card.dataset.categories.split(' ').includes(category.value))&&(!pricing.value||card.dataset.free==='true'));if(!card.hidden)count++;card.parentElement.append(card);}
 document.querySelector('#result-count').textContent=`${count} ${count===1?'tool':'tools'} found`;document.querySelector('#no-results').hidden=count>0;
 const next=new URLSearchParams();for(const f of fields)if(f.value)next.set(f.name,f.value);history.replaceState(null,'',location.pathname+(next.size?'?'+next:''));}
 form.addEventListener('submit',e=>{e.preventDefault();update();});form.addEventListener('input',update);
 document.querySelector('#clear-filters').addEventListener('click',()=>{form.reset();update();q.focus();});update();
}
