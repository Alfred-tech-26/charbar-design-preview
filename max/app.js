/* Progressive enhancements. Every menu and core journey works without JavaScript. */
document.documentElement.classList.replace('no-js','js');
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
$$('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
let lastDialogTrigger=null;
function openDialog(dialog,trigger){if(!dialog?.showModal)return;lastDialogTrigger=trigger;dialog.showModal();document.body.classList.add('modal-open');$('.close-dialog',dialog)?.focus();}
function closeDialog(dialog){dialog.close();}
$$('dialog').forEach(dialog=>{
 $('.close-dialog',dialog)?.addEventListener('click',()=>closeDialog(dialog));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog);}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('.nav-toggle')?.setAttribute('aria-expanded','false');lastDialogTrigger?.focus({preventScroll:true});});
});
const nav=$('#mobile-nav'),toggle=$('.nav-toggle');
if(nav&&toggle)toggle.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','true');openDialog(nav,toggle);});
const photos=[
 ['grill.webp','A cook tending Charbar’s wood-fired Argentine parrilla','At the parrilla.','The fire at the heart of the kitchen.'],
 ['fire.webp','Cooks working over the wood fire at Charbar','A little smoke.','Alberta ingredients. Argentine fire. The care of the person at the grill.'],
 ['dining-room.webp','Timber beams and brick in Charbar’s dining room','A room with stories.','The historic Simmons Building, home to charbar since 2015.'],
 ['gallery-wall.webp','Charbar’s gallery wall with its gilded mirror and photographs','Collected over time.','A little character on the walls. A lot around the table.'],
 ['at-table.webp','Friends sharing a meal beside the Bow River','Stay a little longer.','A gathering on the rooftop, with the river just below.'],
 ['provoleta.webp','A fork lifting melted provoleta cheese from its hot dish','For the middle.','Blistered provoleta. Best passed around while it’s hot.']
];
const gallery=$('#photo-gallery');let photoIndex=0;
function showPhoto(index){photoIndex=(index+photos.length)%photos.length;const [file,alt,title,caption]=photos[photoIndex];$('#gallery-image').src='assets/'+file;$('#gallery-image').alt=alt;$('#gallery-title').textContent=title;$('#gallery-caption').textContent=caption;$('#gallery-count').textContent=String(photoIndex+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');$('#gallery-status').textContent=`Photograph ${photoIndex+1} of ${photos.length}: ${title}`;}
if(gallery){$$('.gallery-trigger').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showPhoto(Number(link.dataset.photo)||0);openDialog(gallery,link);}));$('#gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));$('#gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));gallery.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+(event.key==='ArrowRight'?1:-1));}});}
// Native video controls, deliberate playback only: no offscreen downloads or surprise motion.
const film=$('#kitchen-film');if(film){document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();});}
// Live filtering never removes the published HTML content from the page source.
const search=$('#menu-search');
if(search){
 const items=$$('.menu-item'),categories=$$('.menu-category'),status=$('#search-status');
 const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const filter=()=>{const query=normalize(search.value),terms=query.split(/\s+/).filter(Boolean);let count=0;items.forEach(item=>{const found=terms.every(term=>normalize(item.dataset.search).includes(term));item.hidden=!found;if(found)count++;});categories.forEach(category=>category.hidden=!$('.menu-item:not([hidden])',category));$('#no-results').hidden=count>0;status.textContent=query?`${count} ${count===1?'item':'items'} found`:`${items.length} items on this menu`;};
 search.addEventListener('input',filter);$('.menu-search').addEventListener('submit',event=>event.preventDefault());
 const reset=()=>{search.value='';filter();search.focus();};$('#clear-search').addEventListener('click',reset);$('#reset-search').addEventListener('click',reset);
 $$('.menu-sidebar a').forEach(link=>link.addEventListener('click',()=>{search.value='';filter();}));filter();
}
$$('.print-menu').forEach(button=>button.addEventListener('click',()=>window.print()));
// Email composer. No network submission, storage, or implied reservation.
const eventForm=$('#event-form');
if(eventForm){
 const date=$('[name=date]',eventForm),today=new Date(),localDate=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');date.min=localDate;
 eventForm.addEventListener('submit',event=>{event.preventDefault();if(!eventForm.reportValidity())return;const values=Object.fromEntries(new FormData(eventForm));const subject=`Charbar gathering enquiry — ${values.occasion}`;const body=`Hello Charbar events team,\n\nI’d like to enquire about a gathering.\n\nName: ${values.name}\nEmail: ${values.email}\nPreferred date: ${values.date}\nGuests: ${values.guests}\nOccasion: ${values.occasion}\nPreferred setting: ${values.space}\n\n${values.notes||'I’d love to hear about the options.'}\n\nThank you,\n${values.name}`;$('#enquiry-text').value=body;$('#send-enquiry').href='mailto:events@charbar.ca?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);$('#enquiry-preview').hidden=false;$('#copy-status').textContent='';$('#enquiry-preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});$('#enquiry-text').focus({preventScroll:true});});
 $('#copy-enquiry').addEventListener('click',async()=>{const area=$('#enquiry-text');try{await navigator.clipboard.writeText(area.value);$('#copy-status').textContent='Copied. Paste this into an email to events@charbar.ca.';}catch{area.focus();area.select();$('#copy-status').textContent='Your draft is selected. Copy it and paste it into an email to events@charbar.ca.';}});
}

const categoryJump=$('#category-jump');
if(categoryJump)categoryJump.addEventListener('change',()=>{if(!categoryJump.value)return;if(search){search.value='';search.dispatchEvent(new Event('input'));}const target=document.getElementById(categoryJump.value);if(target){history.pushState(null,'','#'+categoryJump.value);target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}});
if(categoryJump){
 const syncCategory=()=>{let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{}categoryJump.value=[...categoryJump.options].some(option=>option.value===id)?id:'';};
 syncCategory();window.addEventListener('hashchange',syncCategory);window.addEventListener('popstate',syncCategory);
}
