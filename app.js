document.addEventListener("DOMContentLoaded", () => {
  const API = "http://localhost:8080/api/symptoms";
  const PERIOD_KEY = "herhealthPeriodDates";
  let symptoms = [];
  let periods = readPeriods();
  const $ = id => document.getElementById(id);
  const escapeHtml = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  const formatDate = s => { if (!s) return "Date not provided"; const d = new Date(`${s}T00:00:00`); return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}); };
  const nameOf = s => s.name || s.symptomName || "Symptom";
  function severityOf(v) { const n=Number(v); if (!Number.isNaN(n)) return n<=3?"Mild":n<=6?"Moderate":"Severe"; const s=String(v||"").toLowerCase(); return ["mild","moderate","severe"].includes(s)?s[0].toUpperCase()+s.slice(1):"Not specified"; }
  async function request(url, options={}) { const r=await fetch(url,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}}); if(!r.ok){const t=await r.text().catch(()=> "");throw new Error(t||`HTTP ${r.status}`);} if(r.status===204)return null; return (r.headers.get("content-type")||"").includes("application/json")?r.json():null; }
  function message(id, text, type="") { const e=$(id); if(e){e.textContent=text;e.className=type;} }
  const toggle=$("menuToggle"), nav=$("navLinks");
  if(toggle&&nav){toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});}
  function readPeriods(){try{const x=JSON.parse(localStorage.getItem(PERIOD_KEY)||"[]");return Array.isArray(x)?x:[];}catch{return [];}}
  function savePeriods(){try{localStorage.setItem(PERIOD_KEY,JSON.stringify(periods));return true;}catch{return false;}}
  async function loadSymptoms(){
    try { symptoms=await request(API)||[]; if(!Array.isArray(symptoms))symptoms=[]; message("apiStatus","Connected to HerHealth API","ok"); render(); }
    catch(e){console.error(e);message("apiStatus","API connection failed. Start Spring Boot and check CORS.","error");if($("symptomList"))$("symptomList").textContent="Could not connect to the backend. Check that http://localhost:8080/api/symptoms works.";if($("symptomInsight"))$("symptomInsight").textContent="Records are unavailable while the API is disconnected.";}
  }
  const form=$("symptomForm"), nameInput=$("symptomName"), otherGroup=$("otherSymptomGroup"), otherInput=$("otherSymptom"), dateInput=$("symptomDate");
  if(dateInput){dateInput.max=today();if(!dateInput.value)dateInput.value=today();}
  if(nameInput&&otherGroup&&otherInput){const update=()=>{const other=nameInput.value==="Other";otherGroup.hidden=!other;otherInput.required=other;if(!other)otherInput.value="";};nameInput.addEventListener("change",update);update();}
  if(form)form.addEventListener("submit",async e=>{
    e.preventDefault();
    const chosen=nameInput?.value||"", name=chosen==="Other"?(otherInput?.value.trim()||""):chosen;
    const date=dateInput?.value||"", severity=Number($("severity")?.value), notes=$("symptomNotes")?.value.trim()||"", duration=$("duration")?.value||"";
    if(!name||!date||!severity){message("formMessage","Please complete all required fields.","error");return;}
    if(date>today()){message("formMessage","Choose today or an earlier date.","error");return;}
    const button=$("saveSymptomButton");if(button){button.disabled=true;button.textContent="Saving…";}
    try{
      await request(API,{method:"POST",body:JSON.stringify({name,date,severity,notes})});
      await loadSymptoms();form.reset();if(dateInput){dateInput.value=today();dateInput.max=today();}if(otherGroup)otherGroup.hidden=true;if(otherInput)otherInput.required=false;
      message("formMessage",duration?"Symptom saved to MySQL. Duration is not persisted by the current backend.":"Symptom saved successfully to MySQL!","ok");
    }catch(err){console.error(err);message("formMessage","Could not save. Check backend, CORS and API validation. "+err.message,"error");}
    finally{if(button){button.disabled=false;button.textContent="Save Symptom";}}
  });
  function render(){
    const sorted=[...symptoms].sort((a,b)=>String(b.date||"").localeCompare(String(a.date||""))||Number(b.id||0)-Number(a.id||0));
    if($("totalSymptoms"))$("totalSymptoms").textContent=symptoms.length;
    if($("highSeverityCount"))$("highSeverityCount").textContent=symptoms.filter(s=>Number(s.severity)>=7||severityOf(s.severity)==="Severe").length;
    if($("latestSymptom"))$("latestSymptom").textContent=sorted.length?nameOf(sorted[0]):"None";
    const list=$("symptomList");
    if(list)list.innerHTML=sorted.length?sorted.map(s=>{const sev=severityOf(s.severity);return `<article class="symptom-item"><div><h3>${escapeHtml(nameOf(s))}</h3><p>${escapeHtml(formatDate(s.date))}</p><span class="severity ${sev.toLowerCase()}">${escapeHtml(sev)}</span> <span class="hint">Score: ${escapeHtml(s.severity)}</span>${s.notes?`<p><b>Notes:</b> ${escapeHtml(s.notes)}</p>`:""}</div><button class="btn danger" data-delete-id="${escapeHtml(s.id)}">Delete</button></article>`;}).join(""):`<div class="empty"><h3>No symptoms recorded yet</h3><p>Your saved entries will appear here.</p><a class="btn" href="tracker.html">Track a Symptom</a></div>`;
    const counts={Mild:0,Moderate:0,Severe:0};symptoms.forEach(s=>counts[severityOf(s.severity)]++);
    if($("symptomInsight"))$("symptomInsight").textContent=symptoms.length?`You have recorded ${symptoms.length} entr${symptoms.length===1?"y":"ies"}. Most common severity: ${Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0].toLowerCase()}. This is not a medical diagnosis.`:"Start recording symptoms to see a summary.";
    if($("severityChart")){const max=Math.max(1,...Object.values(counts));$("severityChart").innerHTML=Object.entries(counts).map(([k,v])=>`<div class="chart-row"><b>${k}</b><div class="bar-track"><div class="bar ${k.toLowerCase()}" style="width:${v/max*100}%"></div></div><b>${v}</b></div>`).join("");}
    renderPeriods();
  }
  const symptomList=$("symptomList");
  if(symptomList)symptomList.addEventListener("click",async e=>{const b=e.target.closest("[data-delete-id]");if(!b)return;if(!confirm("Delete this symptom from the database?"))return;b.disabled=true;try{await request(`${API}/${encodeURIComponent(b.dataset.deleteId)}`,{method:"DELETE"});await loadSymptoms();}catch(err){alert("Delete failed. Your backend must implement DELETE /api/symptoms/{id}. "+err.message);b.disabled=false;}});
  const periodForm=$("periodForm"), periodInput=$("periodStartDate");if(periodInput)periodInput.max=today();
  if(periodForm)periodForm.addEventListener("submit",e=>{e.preventDefault();const d=periodInput.value;if(!d)return message("periodMessage","Select a period start date.","error");if(d>today())return message("periodMessage","Choose today or an earlier date.","error");if(periods.includes(d))return message("periodMessage","This date is already saved.","error");periods=[...periods,d].sort();if(!savePeriods())return message("periodMessage","Could not save in browser storage.","error");periodForm.reset();message("periodMessage","Period date saved in this browser.","ok");renderPeriods();});
  function renderPeriods(){const ul=$("periodHistory");if(ul)ul.innerHTML=periods.length?[...periods].sort().reverse().map(d=>`<li>${escapeHtml(formatDate(d))}</li>`).join(""):"<li>No period dates saved yet.</li>";}
  renderPeriods();if($("symptomList")||$("totalSymptoms")||form)loadSymptoms();
});