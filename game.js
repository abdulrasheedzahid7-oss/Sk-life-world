(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const canvas = $("world");
  const ctx = canvas.getContext("2d");
  const state = {
    name:"Player", age:10, day:1, minutes:8*60, coins:100, level:1, xp:0,
    health:100, energy:85, hunger:25, mood:80, learning:10,
    location:"Home", x:480, y:355, questDone:false, logs:["Your new life adventure begins!"]
  };
  const clamp = n => Math.max(0,Math.min(100,Math.round(n)));
  const scenes = {
    Home:{sky:"#8bc8df",ground:"#75b879",accent:"#f1c77b"},
    Park:{sky:"#9bd9ed",ground:"#65b875",accent:"#f4d06f"},
    School:{sky:"#9bc9e3",ground:"#8cae78",accent:"#e8c66f"},
    Shop:{sky:"#9ac8e2",ground:"#8bb67c",accent:"#f0bd66"},
    Town:{sky:"#91c3dc",ground:"#83aa78",accent:"#d5c18b"}
  };
  function log(message){state.logs.unshift(message);state.logs=state.logs.slice(0,8);$("eventLog").innerHTML=state.logs.map(x=>"<li>"+escapeHTML(x)+"</li>").join("");}
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),1900);}
  function timeText(){const h=Math.floor(state.minutes/60)%24,m=state.minutes%60;return String((h%12)||12).padStart(2,"0")+":"+String(m).padStart(2,"0")+" "+(h>=12?"PM":"AM");}
  function update(){
    $("playerName").textContent=state.name;$("ageLabel").textContent="Age "+state.age+" · "+(state.age<18?"Student":"Adult");
    $("dayLabel").textContent="Day "+state.day;$("clockLabel").textContent=timeText();$("locationTitle").textContent=state.location;
    $("cashLabel").textContent="🪙 "+state.coins;$("levelLabel").textContent="LVL "+state.level;
    for(const key of ["health","energy","hunger","mood","learning"]){$(key+"Value").textContent=state[key];$(key+"Bar").style.width=state[key]+"%";}
    $("questBar").style.width=(state.questDone?100:0)+"%";$("questProgress").textContent=(state.questDone?1:0)+" / 1 completed";
    $("questText").textContent=state.questDone?"Daily quest complete! Great work.":"Study for a little while and build your knowledge.";
    document.querySelectorAll(".location").forEach(b=>b.classList.toggle("active",b.dataset.location===state.location));
  }
  function roundedRect(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function drawTree(x,y,scale=1){ctx.fillStyle="#79543a";ctx.fillRect(x-5*scale,y,10*scale,38*scale);ctx.fillStyle="#267e55";ctx.beginPath();ctx.arc(x,y-7*scale,25*scale,0,Math.PI*2);ctx.fill();ctx.fillStyle="#399a62";ctx.beginPath();ctx.arc(x-12*scale,y-18*scale,15*scale,0,Math.PI*2);ctx.fill();}
  function drawBuilding(x,y,w,h,color,label){roundedRect(x,y,w,h,7,color);ctx.fillStyle="#e8f3ee";for(let yy=y+17;yy<y+h-12;yy+=27)for(let xx=x+14;xx<x+w-10;xx+=27){ctx.fillRect(xx,yy,12,13);}ctx.fillStyle="#21394b";ctx.fillRect(x+w/2-12,y+h-35,24,35);ctx.fillStyle="#fff";ctx.font="bold 13px Inter";ctx.textAlign="center";ctx.fillText(label,x+w/2,y-9);}
  function drawCharacter(){const x=state.x,y=state.y;ctx.fillStyle="#0003";ctx.beginPath();ctx.ellipse(x,y+20,19,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#263d67";ctx.fillRect(x-12,y-1,24,23);ctx.fillStyle="#e9b88f";ctx.beginPath();ctx.arc(x,y-15,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#273246";ctx.beginPath();ctx.arc(x,y-20,12,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(x-7,y-16,3,3);ctx.fillRect(x+4,y-16,3,3);}
  function draw(){
    const s=scenes[state.location];ctx.clearRect(0,0,960,540);ctx.fillStyle=s.sky;ctx.fillRect(0,0,960,540);
    ctx.fillStyle="#fff9";ctx.beginPath();ctx.arc(820,80,35,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=s.ground;ctx.fillRect(0,290,960,250);
    ctx.fillStyle="#c9b88d";ctx.fillRect(0,400,960,72);
    ctx.fillStyle="#eee0b9";for(let x=0;x<960;x+=80)ctx.fillRect(x,434,42,4);
    if(state.location==="Home"){drawBuilding(105,165,260,190,"#d78e69","HOME");drawTree(690,300,1.4);drawTree(810,300,1.1);roundedRect(435,330,145,45,8,"#b87c4b");}
    if(state.location==="Park"){drawTree(190,320,1.7);drawTree(340,315,1.4);drawTree(760,320,1.8);drawTree(850,315,1.2);roundedRect(440,330,140,15,7,"#b67b47");}
    if(state.location==="School"){drawBuilding(270,135,420,220,"#d5a95e","SCHOOL");drawTree(130,315,1.2);drawTree(810,315,1.2);}
    if(state.location==="Shop"){drawBuilding(300,185,350,170,"#b77bdb","SHOP");roundedRect(390,285,170,28,5,"#f5d57c");}
    if(state.location==="Town"){drawBuilding(90,175,170,180,"#879ebc","CAFE");drawBuilding(380,125,190,230,"#7f9ec5","LIBRARY");drawBuilding(690,175,170,180,"#c58c76","MARKET");}
    drawCharacter();
    ctx.fillStyle="#17334b";ctx.font="bold 14px Inter";ctx.textAlign="left";ctx.fillText(state.name, state.x-ctx.measureText(state.name).width/2, state.y-42);
  }
  function advance(minutes){state.minutes+=minutes;if(state.minutes>=24*60){state.day+=Math.floor(state.minutes/(24*60));state.minutes%=24*60;state.energy=clamp(state.energy-10);state.hunger=clamp(state.hunger+12);log("A new day begins. Take care of yourself!");}state.hunger=clamp(state.hunger+Math.max(1,Math.floor(minutes/90)));update();draw();}
  function act(type){
    const actions={
      eat:()=>{if(state.coins<5){toast("You need 5 coins for a snack.");return;}state.coins-=5;state.hunger=clamp(state.hunger-30);state.mood=clamp(state.mood+5);log("You enjoyed a healthy snack.");advance(15);},
      sleep:()=>{state.energy=clamp(state.energy+55);state.health=clamp(state.health+8);log("You rested and recovered energy.");advance(120);},
      study:()=>{state.energy=clamp(state.energy-12);state.learning=clamp(state.learning+12);state.mood=clamp(state.mood-2);state.xp+=20;state.questDone=true;log("You studied and learned something new. +20 XP");advance(45);},
      play:()=>{state.energy=clamp(state.energy-10);state.mood=clamp(state.mood+14);state.health=clamp(state.health+3);log("You had fun playing outside.");advance(35);},
      social:()=>{state.mood=clamp(state.mood+12);state.energy=clamp(state.energy-4);log("You spent time talking with a neighbour.");advance(20);},
      explore:()=>{state.energy=clamp(state.energy-8);state.mood=clamp(state.mood+6);state.coins+=3;log("You explored the area and found 3 coins.");advance(30);}
    };
    if(actions[type]){actions[type]();if(state.xp>=100){state.level++;state.xp-=100;toast("Level up! You reached level "+state.level);}update();}
  }
  function setLocation(location){if(!scenes[location])return;state.location=location;state.x=480;state.y=355;log("You travelled to "+location+".");update();draw();}
  function move(dx,dy){state.x=Math.max(35,Math.min(925,state.x+dx));state.y=Math.max(260,Math.min(470,state.y+dy));draw();}
  document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>act(b.dataset.action)));
  document.querySelectorAll("[data-location]").forEach(b=>b.addEventListener("click",()=>setLocation(b.dataset.location)));
  document.querySelectorAll("[data-move]").forEach(b=>b.addEventListener("click",()=>{const d=b.dataset.move;move(d==="left"?-20:d==="right"?20:0,d==="up"?-20:d==="down"?20:0);}));
  document.addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(["arrowup","w"].includes(k)){e.preventDefault();move(0,-15);}if(["arrowdown","s"].includes(k)){e.preventDefault();move(0,15);}if(["arrowleft","a"].includes(k)){e.preventDefault();move(-15,0);}if(["arrowright","d"].includes(k)){e.preventDefault();move(15,0);}});
  $("nameBtn").addEventListener("click",()=>{const name=prompt("What should your character be called?",state.name);if(name&&name.trim()){state.name=name.trim().slice(0,18);update();draw();}});
  $("clearLog").addEventListener("click",()=>{state.logs=[];$("eventLog").innerHTML="";});
  $("saveBtn").addEventListener("click",()=>{try{localStorage.setItem("sk-life-world-save",JSON.stringify(state));toast("Game saved on this device.");}catch(e){toast("Save is unavailable in this browser.");}});
  try{const saved=JSON.parse(localStorage.getItem("sk-life-world-save")||"null");if(saved&&typeof saved==="object"){for(const key of Object.keys(state))if(key in saved)state[key]=saved[key];}}catch(e){console.warn("Save could not be loaded.");}
  update();draw();
})();