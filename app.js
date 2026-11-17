'use strict';
document.documentElement.classList.remove('no-js');
const menus = {
 dinner: {heading:'A taste of charbar',time:'FROM THE KITCHEN, ALL DAY',image:'provoleta',alt:'A fork lifts melted provoleta cheese from its hot dish',caption:'Provoleta. Best shared while it’s hot.',label:'Read the full all-day menu',url:'https://www.charbar.ca/s/CHARBAR_MENU_ALL-DAY-WEB-101426-sjhs.pdf',groups:[
  ['To begin',[['Traditional empanadas','Slow-cooked beef, hot sauce butter','18'],['Blistered provoleta','Salsa criolla, watercress, sourdough','19'],['Tableside ceviche mixto','Red shrimp, octopus & ahi tuna','23'],['Steak tartare','Dry-aged Alberta beef, charred sourdough','29']]],
  ['From the kitchen',[['New York strip steak','12 oz Alberta beef, Poplar Bluff potatoes','65'],['Butcher steak','7 oz Gemstone grass-fed beef, crispy potatoes','39'],['Grilled whole branzino','Tomato locro, beef chorizo, sofrito','46'],['Stuffed pasta “Sorrentinos”','Fresh cheese, pecans, crema de limon, pepita pesto','30']]]
 ]},
 brunch:{heading:'A slower start',time:'SATURDAY & SUNDAY · 10 AM–4 PM',image:'brunch',alt:'Eggs and greens at Charbar’s weekend brunch',caption:'A reason to make a morning of it.',label:'Read the full brunch menu',url:'https://www.charbar.ca/s/CHARBAR_Menu_Brunch-WEB-101426-98fa.pdf',groups:[
  ['Start here',[['Breakfast breads & butter','Fresh biscuits, jam, whipped butter','12'],['Yogurt parfait','Vanilla yogurt, granola, fruit, dulce de leche','13'],['Argentine empanadas','Slow-cooked beef, hot sauce butter, two eggs','20'],['Avocado toast','Avocado, fried eggs, Sidewalk Citizen sourdough','19']]],
  ['Stay for brunch',[['Charbar Benedict','Biscuit, poached eggs, brown butter hollandaise','23'],['Asadora breakfast','Thick-cut bacon, beef chorizo, eggs, sourdough','23'],['Butcher steak & eggs','7 oz Gemstone beef, two eggs, chipotle potatoes','42'],['Brunch with bubbles','Orange, grapefruit, sour cherry or fig; per glass','6.50']]]
 ]},
 drinks:{heading:'Something from the bar',time:'COCKTAILS & SOMETHING WITHOUT',image:'cocktail',alt:'A Charbar cocktail in a coupe with a citrus garnish',caption:'The first round, or the last word.',label:'Read the full drinks menu',url:'https://www.charbar.ca/s/Use-UpCHARBAR_Beverage-Menu_-101426.pdf',groups:[
  ['Cocktails',[['Crimson Lady · 2.25 oz','Mezcal, amaro, sherry, blackberry & lime','18'],['Midas Touch · 2 oz','Sweet potato pisco, fig, lemon & cardamom','18'],['Harvest Eclipse · 2.25 oz','Gin, ginger, apple sage, egg white & Lambrusco','18'],['Si Fueras Mía · 2.25 oz','Chocolate tequila, Licor 43, dulce de leche & coffee','18']]],
  ['Zero proof',[['Apple Sage Lemonade','Seared apple sage syrup, lemon & water','9'],['Blackberry Rooibos Warmer','Blackberry syrup & vanilla rooibos tea','9'],['Figgy Fizzy','Fig, blood orange, lemon & soda','9']]]
 ]}
};
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectMenu(tab,focus=false){
 const data=menus[tab.dataset.menu];
 tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});
 const panel=document.querySelector('#menu-panel');panel.setAttribute('aria-labelledby',tab.id);
 document.querySelector('#menu-heading').textContent=data.heading;
 document.querySelector('#menu-time').textContent=data.time;
 const photo=document.querySelector('#table-food');photo.src='assets/'+data.image+'.webp';photo.alt=data.alt;
 document.querySelector('#food-caption').textContent=data.caption;
 const columns=data.groups.map(([title,dishes])=>{
  const col=document.createElement('div'),h=document.createElement('h4');h.textContent=title;col.append(h);
  dishes.forEach(([name,description,price])=>{const article=document.createElement('article'),heading=document.createElement('h5'),amount=document.createElement('span'),p=document.createElement('p');article.className='dish';heading.append(document.createTextNode(name+' '));amount.textContent=price;heading.append(amount);p.textContent=description;article.append(heading,p);col.append(article);});return col;
 });
 document.querySelector('#menu-items').replaceChildren(...columns);
 const link=document.querySelector('#full-menu');link.href=data.url;link.firstElementChild.textContent=data.label;
 panel.classList.remove('panel-change');void panel.offsetWidth;panel.classList.add('panel-change');
 if(focus)tab.focus();
}
tabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectMenu(tab));
 tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectMenu(tabs[next],true);}});
});
const nav=document.querySelector('#mobile-nav'),toggle=document.querySelector('.nav-toggle');
const gallery=document.querySelector('#photo-gallery');
function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.querySelector('.close-button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(dialog===nav)toggle.setAttribute('aria-expanded','false');});
 dialog.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const all=[...dialog.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]')].filter(x=>x.getClientRects().length),first=all[0],last=all.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
});
toggle.addEventListener('click',()=>{openDialog(nav);toggle.setAttribute('aria-expanded','true');});
nav.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{nav.close();const target=document.querySelector(a.hash);if(target){target.tabIndex=-1;target.focus({preventScroll:true});}}));
matchMedia('(min-width:851px)').addEventListener('change',e=>{if(e.matches&&nav.open)nav.close();});
const photos=[
 ['grill','At the parrilla.','The wood-fired Argentine grill is at the heart of the kitchen. A cook, the coals, and a little patience.','A cook tending Charbar’s Argentine wood-fired grill'],
 ['dining-room','In good company.','Timber beams, exposed brick and a view into the kitchen. The Simmons Building has been part of Calgary since 1912.','Charbar’s dining room with brick walls, timber beams and laid tables'],
 ['gallery-wall','A room of stories.','Portraits, a gilded mirror, keepsakes collected along the way. A few of the details that make this room ours.','Charbar’s gallery wall, with an ornate mirror and old photographs'],
 ['at-table','Everyone together.','Long tables, shared plates, and the Bow River just beyond. For celebrations, our events team can help bring everyone together.','Guests dining together on the rooftop overlooking the Bow River'],
 ['terrace','Upstairs at Simmons.','Connie and John’s seasonal rooftop patio: pizza, a drink, and a little more sky. Check current availability before visiting.','Connie and John’s rooftop patio overlooking the Bow River']
];let photoIndex=0;
function showPhoto(index){photoIndex=(index+photos.length)%photos.length;const[file,title,description,alt]=photos[photoIndex];const img=document.querySelector('#gallery-image');img.src='assets/'+file+'.webp';img.alt=alt;document.querySelector('#gallery-title').textContent=title;document.querySelector('#gallery-description').textContent=description;document.querySelector('#gallery-counter').textContent='0'+(photoIndex+1)+' / 05';document.querySelector('#gallery-live').textContent='Photograph '+(photoIndex+1)+' of 5: '+title;}
document.querySelectorAll('.gallery-open').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showPhoto(Number(el.dataset.photo)||0);openDialog(gallery);}));
document.querySelector('#gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
document.querySelector('#gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));
gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
document.querySelector('#year').textContent=new Date().getFullYear();
const kitchenFilm=document.querySelector('#kitchen-film');
const filmToggle=document.querySelector('.film-toggle');
let filmUserControlled=false,filmStarted=false;
function updateFilmControl(){filmToggle.firstChild.textContent=kitchenFilm.paused?'Play the kitchen film ':'Pause the kitchen film ';filmToggle.lastElementChild.textContent=kitchenFilm.paused?'▷':'Ⅱ';}
filmToggle.addEventListener('click',()=>{
 filmUserControlled=true;
 if(kitchenFilm.paused){
  const rect=kitchenFilm.getBoundingClientRect();
  if(rect.top<76||rect.bottom>innerHeight)kitchenFilm.scrollIntoView({block:'center',behavior:'instant'});
  kitchenFilm.focus({preventScroll:true});
  kitchenFilm.play().catch(()=>{});
 }else kitchenFilm.pause();
});
kitchenFilm.addEventListener('pointerdown',()=>{filmUserControlled=true;});
kitchenFilm.addEventListener('play',updateFilmControl);
kitchenFilm.addEventListener('pause',updateFilmControl);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
 new IntersectionObserver(entries=>{entries.forEach(({isIntersecting})=>{
  if(filmUserControlled)return;
  if(!isIntersecting){kitchenFilm.pause();return;}
  if(!filmStarted&&!filmUserControlled&&!reducedMotion.matches&&!navigator.connection?.saveData){filmStarted=true;kitchenFilm.play().catch(()=>{});}
 });},{threshold:.35}).observe(kitchenFilm);
}
reducedMotion.addEventListener('change',e=>{if(e.matches)kitchenFilm.pause();});
