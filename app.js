(function () {
/*** ==== TEMA ==== ***/
const themeSelect = document.getElementById('themeSelect');
function applyTheme(value){
  const root = document.documentElement;
  root.classList.remove('theme-classic','theme-opifex','theme-dark');
  if(value==='opifex') root.classList.add('theme-opifex');
  else if(value==='dark') root.classList.add('theme-dark');
  else root.classList.add('theme-classic');
  try{ localStorage.setItem('impTheme', value); }catch(e){}
}
(function initTheme(){
  const saved = (localStorage.getItem('impTheme')||'classic');
  themeSelect.value = saved;
  applyTheme(saved);
})();
themeSelect.addEventListener('change', (e)=> applyTheme(e.target.value));

/*** ==== PRESETS (FÚTBOL & CLASH) ==== ***/
const PRESETS = {
  equipos_arg: [
    "River Plate","Boca Juniors","Racing Club","Independiente","San Lorenzo","Huracán",
    "Vélez Sarsfield","Argentinos Juniors","Estudiantes LP","Gimnasia LP","Talleres","Belgrano",
    "Newell’s","Rosario Central","Colón","Unión","Lanús","Banfield","Defensa y Justicia","Godoy Cruz",
    "Atlético Tucumán","Tigre","Platense","Barracas Central","Instituto","Sarmiento","Arsenal",
    "Aldosivi","San Martín SJ","Quilmes","Ferro","All Boys","Temperley","Atlanta","Morón",
    "Patronato","Central Córdoba (SdE)","San Telmo","Agropecuario","Almirante Brown"
  ],
  // Quitados: LAFC, LA Galaxy, Inter Miami (equipos de USA)
  equipos_mundo: [
    "Barcelona","Real Madrid","Atlético de Madrid","Sevilla","Valencia","Villarreal",
    "Manchester City","Manchester United","Liverpool","Arsenal","Chelsea","Tottenham",
    "Bayern Múnich","Borussia Dortmund","RB Leipzig",
    "PSG","Juventus","Inter","Milan","Napoli",
    "Benfica","Porto","Sporting CP",
    "Ajax","PSV","Feyenoord",
    "Celtic","Rangers",
    "Flamengo","Palmeiras","Corinthians","Santos","São Paulo",
    "Galatasaray","Fenerbahçe",
    "Peñarol","Nacional (URU)",
    "Monterrey","Tigres UANL"
  ],
  jugadores_arg: [
    "Franco Armani","Enzo Pérez","Ignacio Fernández","Nicolás De la Cruz","Esequiel Barco","Pablo Solari","Miguel Borja","Milton Casco",
    "Marcos Rojo","Luis Advíncula","Edinson Cavani","Miguel Merentiel","Cristian Medina","Equi Fernández","Pol Fernández","Luca Langoni",
    "Facundo Colidio","Rodrigo Garro","Nahuel Bustos","Ulises Ortegoza","Michael Santos","Bruno Zapelli","Federico Girotti","Gastón Ávila",
    "Alan Varela","Nicolás Figal","Sergio Romero","Facundo Farías","Giuliano Galoppo","Thiago Almada"
  ],
  // Lista de figuras muy conocidas (sin jugadores de USA)
  jugadores_mundo: [
    "Lionel Messi","Kylian Mbappé","Erling Haaland","Jude Bellingham","Vinícius Júnior","Rodrygo",
    "Lautaro Martínez","Paulo Dybala","Harry Kane","Mohamed Salah","Kevin De Bruyne","Phil Foden",
    "Bukayo Saka","Martin Ødegaard","Robert Lewandowski","Pedri","Gavi","Luka Modric","Toni Kroos","Casemiro",
    "Neymar","Karim Benzema","Antoine Griezmann","Ousmane Dembélé","Bernardo Silva","Virgil van Dijk",
    "Trent Alexander-Arnold","Alisson","Ederson","Thibaut Courtois","Gianluigi Donnarumma","Jamal Musiala",
    "Joshua Kimmich","Leroy Sané","Marcus Rashford","Rúben Dias","Rodri","Federico Chiesa",
    "Khvicha Kvaratskhelia","Victor Osimhen","Theo Hernández"
  ],
  leyendas: [
    "Diego Maradona","Pelé","Ronaldinho","Zinedine Zidane","Ronaldo Nazário","Thierry Henry","Paolo Maldini","Alessandro Del Piero",
    "Francesco Totti","Andrea Pirlo","Xavi Hernández","Andrés Iniesta","David Beckham","Ryan Giggs","Wayne Rooney",
    "Andriy Shevchenko","Didier Drogba","Samuel Eto’o","Raúl","Gianluigi Buffon","Iker Casillas","Roberto Carlos","Cafu",
    "Gabriel Batistuta","Juan Román Riquelme","Ariel Ortega","Marcelo Gallardo","Fernando Redondo","Kaká","Rivaldo",
    "Ruud van Nistelrooy","Frank Lampard","Steven Gerrard","Javier Zanetti","Patrick Vieira","Luis Figo","Roberto Baggio",
    "George Weah","Hristo Stoichkov","Pavel Nedvěd","Bobby Charlton","George Best","Karl-Heinz Rummenigge","Lothar Matthäus","Eusébio"
  ],
  clash_comunes: ["Caballero","Arqueras","Esqueletos","Duendes","Bárbaros","Esbirros","Espíritu de Fuego","Espíritu de Hielo","Espíritu Sanador","Murciélagos","Descarga","Flechas","Bola de Nieve","Torre Tesla","Cañón","Horda de Esbirros","Bárbaros de Élite"],
  clash_especiales: ["Valquiria","Mosquetera","Gigante Noble","Horno","Choza de Duendes","Choza de Bárbaros","Recolector de Elixir","Mini P.E.K.K.A","Megaminion","Máquina Voladora","Montapuercos","Ballesta","Barril de Bárbaros","Tronco Rodante"],
  clash_epicas: ["Príncipe","Príncipe Oscuro","Bruja","Bruja Nocturna","Bebé Dragón","Globo Bombástico","PEKKA","Ejército de Esqueletos","Veneno","Rayo","Cohete","Furia","Espejo","Clon","Tornado","Gólem","Barril de Duendes","Guardias"],
  clash_legendarias: ["Princesa","El Tronco","Mago de Hielo","Leñador","Minero","Chispitas","Sabueso de Lava","Dragón Infernal","Cementerio","Bandida","Mago Eléctrico","Arquero Mágico","Fantasma Real","Pescador","Montacarneros"],
  clash_campeones: ["Caballero Dorado","Reina Arquera","Rey Esqueleto","Monje","Gran Minero"]
};
// “Todas las cartas”
PRESETS.clash_all = Array.from(new Set([
  ...PRESETS.clash_comunes,
  ...PRESETS.clash_especiales,
  ...PRESETS.clash_epicas,
  ...PRESETS.clash_legendarias,
  ...PRESETS.clash_campeones
]));

/*** ==== TOGGLES DE PRESET ==== ***/
const selectedKeys = new Set();
document.querySelectorAll('#presetButtons .toggle').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const key = btn.dataset.key;
    if(selectedKeys.has(key)){ selectedKeys.delete(key); btn.classList.remove('active'); }
    else{ selectedKeys.add(key); btn.classList.add('active'); }
  });
});
document.getElementById('btnClearPreset').addEventListener('click', ()=>{
  selectedKeys.clear();
  document.querySelectorAll('#presetButtons .toggle.active').forEach(b=>b.classList.remove('active'));
});
document.getElementById('btnAddPreset').addEventListener('click', ()=>{
  if(selectedKeys.size===0){ alert('Elegí al menos una categoría.'); return; }
  const ta = document.getElementById('playersInput');
  const existing = ta.value.split(/\n/).map(s=>s.trim()).filter(Boolean);
  const pool = [];
  selectedKeys.forEach(key => { (PRESETS[key]||[]).forEach(n => pool.push(n)); });
  const merged = Array.from(new Set(existing.concat(pool)));
  ta.value = merged.join('\n');
});

/*** ==== ESTADO ==== ***/
const state = { players: [], word: '', showWord: true, impostors: 1, revealIndex: 0, round: 1, votes: new Map(), log: [] };

/*** ==== HELPERS ==== ***/
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const screens = {
  setup: $('#screen-setup'),
  reveal: $('#screen-reveal'),
  meeting: $('#screen-meeting'),
  vote: $('#screen-vote'),
  roundSummary: $('#screen-round-summary'),
  results: $('#screen-results')
};
function go(to){
  Object.values(screens).forEach(el=>el.classList.add('hidden'));
  screens[to].classList.remove('hidden');
  document.getElementById('btnHome').style.display = (to==='setup') ? 'none' : '';
}
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }
function sample(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function alivePlayers(){ return state.players.filter(p=>p.alive); }
function countRole(role){ return state.players.filter(p=>p.alive && p.role===role).length; }
function updateAliveInfo(){ $('#aliveInfo').textContent = `Vivos: ${alivePlayers().length} (Civiles ${countRole('civil')} • Impostores ${countRole('impostor')})`; }
function logEvent(text){ state.log.push(`[Ronda ${state.round}] ${text}`); renderLog(); }
function renderLog(){ $('#eventLog').innerHTML = state.log.map(li=>`<li>${li}</li>`).join(''); }

/*** ==== PALABRA SOLO DESDE CATEGORÍAS ==== ***/
function getWordPoolFromSelection(){
  const pool = [];
  selectedKeys.forEach(key=> (PRESETS[key]||[]).forEach(n => pool.push(n)));
  return Array.from(new Set(pool));
}

/*** ==== DEMO ==== */
$('#btnDemo').addEventListener('click', ()=>{
  $('#playersInput').value = 'Lucho\nPedro\nTizi\nSpa\nRulo\nLucas';
  $('#impostorsInput').value = 2;
  $('#secretWordInput').value = ''; // probar aleatoria desde categorías
  ['equipos_arg','clash_comunes'].forEach(k=>{
    const btn = document.querySelector(`#presetButtons .toggle[data-key="${k}"]`);
    if(btn && !selectedKeys.has(k)){ selectedKeys.add(k); btn.classList.add('active'); }
  });
});

/*** ==== INICIAR PARTIDA ==== */
$('#btnStart').addEventListener('click', ()=>{
  const raw = $('#playersInput').value.split(/\n|,/).map(s=>s.trim()).filter(Boolean);
  const uniq = Array.from(new Set(raw));
  if(uniq.length < 3){ alert('Necesitás al menos 3 jugadores.'); return; }
  const impostors = Math.max(1, Math.min(parseInt($('#impostorsInput').value||'1',10), Math.floor(uniq.length/2)));
  state.impostors = impostors;
  state.showWord = $('#showWordSelect').value==='yes';

  let word = ($('#secretWordInput').value||'').trim();
  if(!word){
    const pool = getWordPoolFromSelection();
    if(pool.length===0){
      alert('Para elegir la palabra al azar, seleccioná al menos una categoría o escribí una palabra manualmente.');
      return;
    }
    word = sample(pool);
  }
  state.word = word.toUpperCase();

  state.players = uniq.map(name=>({name, alive:true, role:'civil'}));
  const idxs = shuffle([...Array(uniq.length).keys()]).slice(0, impostors);
  idxs.forEach(i=> state.players[i].role='impostor');

  state.revealIndex = 0;
  state.round = 1;
  state.votes = new Map();
  state.log = [];
  logEvent(`Partida iniciada. Palabra: ${state.showWord? state.word : 'oculta'}. Impostores: ${state.impostors}.`);

  $('#roundInfo').textContent = `Revelación de roles • Palabra: ${state.showWord? state.word : 'oculta'}`;
  renderReveal();
  go('reveal');
});

/*** ==== BOTÓN INICIO ==== */
document.getElementById('btnHome').addEventListener('click', ()=>{
  if(confirm('¿Volver al menú de inicio? Se cancelará la partida en curso.')){
    state.players = []; state.word = ''; state.revealIndex = 0; state.round = 1; state.votes = new Map(); state.log = [];
    go('setup');
  }
});

/*** ==== REVELAR ==== ***/
function renderReveal(){
  const p = state.players[state.revealIndex];
  $('#revealPlayer').textContent = p.name;
  $('#revealContent').innerHTML = '';
  $('#btnShow').classList.remove('hidden');
  $('#btnHide').classList.add('hidden');
}
$('#btnShow').addEventListener('click', ()=>{
  const p = state.players[state.revealIndex];
  const isImp = p.role==='impostor';
  const word = state.showWord && !isImp ? `<span class="badge green">PALABRA: ${state.word}</span>` : `<span class="badge red">Sos IMPOSTOR. Sin palabra.</span>`;
  $('#revealContent').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px;align-items:center">
      <div class="badge ${isImp?'red':'green'}">${isImp?'IMPOSTOR':'CIVIL'}</div>
      ${word}
    </div>`;
  $('#btnShow').classList.add('hidden');
  $('#btnHide').classList.remove('hidden');
});
$('#btnHide').addEventListener('click', ()=>{
  if(state.revealIndex < state.players.length-1){ state.revealIndex++; renderReveal(); }
  else{ renderMeeting(); go('meeting'); }
});
$('#btnBackOne').addEventListener('click', ()=>{ if(state.revealIndex>0){ state.revealIndex--; renderReveal(); } });
$('#btnSkipToMeeting').addEventListener('click', ()=>{ renderMeeting(); go('meeting'); });

/*** ==== REUNIÓN ==== ***/
function renderMeeting(){
  updateAliveInfo();
  $('#playersList').innerHTML = state.players.map(p=>`
    <div class="player-card">
      <h4 class="${p.alive?'':'dead'}">${p.name}</h4>
      <div class="hint">${p.alive?'Vivo':'Eliminado'}</div>
    </div>`).join('');
  renderLog();
}
$('#btnSummary').addEventListener('click', ()=>{
  const civ = countRole('civil'), imp = countRole('impostor');
  alert(`Ronda ${state.round}\nVivos: ${civ+imp} (Civiles ${civ} • Impostores ${imp})`);
});
$('#btnCallVote').addEventListener('click', ()=> startVoting());
$('#btnStartVote').addEventListener('click', ()=> startVoting());
$('#btnNextRound').addEventListener('click', ()=>{
  state.round++; logEvent('Se pasó de ronda sin eliminación.');
  checkWin();
  if(screens.results.classList.contains('hidden')){ renderMeeting(); alert(`Comienza la ronda ${state.round}.`); }
});

/*** ==== REGISTRAR KILL ==== ***/
$('#btnRegisterKill').addEventListener('click', ()=>{
  const alive = alivePlayers();
  const civs = alive.filter(p=>p.role==='civil');
  if(civs.length===0){ alert('No quedan civiles.'); return; }
  const name = prompt(`Nombre del eliminado:\n${civs.map(p=>p.name).join(', ')}`);
  if(!name) return;
  const victim = state.players.find(p=>p.name.toLowerCase()===name.trim().toLowerCase() && p.alive);
  if(!victim){ alert('Nombre inválido o jugador no está vivo.'); return; }
  victim.alive = false;
  logEvent(`Kill registrada: ${victim.name} cayó.`);
  renderMeeting();
  checkWin();
});

/*** ==== VOTACIÓN ==== ***/
function startVoting(){
  state.votes = new Map();
  $('#voteRound').textContent = `Ronda ${state.round}`;
  const alive = alivePlayers();
  const grid = $('#voteGrid');
  grid.innerHTML = '';
  let voterIndex = 0;
  const order = shuffle(alive.map(p=>p.name)); // orden oculto

  function renderPrompt(){
    const voter = order[voterIndex];
    grid.innerHTML = `
      <div class="center" style="grid-column:1/-1">
        <div class="badge">Vota: ${voter}</div>
        <div class="hint">Elegí a quién eliminar o saltá voto.</div>
      </div>` +
      alive.map(p=>{
        const dead = !p.alive;
        const cls = `vote-btn ${dead?'dead':''}`;
        return `<button class="${cls}" data-target="${p.name}" ${dead?'disabled':''}>${p.name}</button>`;
      }).join('') +
      `<button class="vote-btn" data-target="__skip__">Saltar voto</button>`;

    $$('#voteGrid .vote-btn').forEach(btn=> btn.addEventListener('click', ()=>{
      const target = btn.dataset.target;
      state.votes.set(voter, target==='__skip__'? null : target);
      voterIndex++;
      if(voterIndex < order.length){ renderPrompt(); }
      else{ grid.insertAdjacentHTML('afterbegin', `<div class="hint" style="grid-column:1/-1">Todos votaron. Cerrá la votación.</div>`); }
    }));
  }
  renderPrompt();
  go('vote');
}
$('#btnCancelVote').addEventListener('click', ()=>{ renderMeeting(); go('meeting'); });

$('#btnCloseVote').addEventListener('click', ()=>{
  const tally = {};
  for(const [,target] of state.votes){ if(!target) continue; tally[target] = (tally[target]||0)+1; }
  if(Object.keys(tally).length===0){ logEvent('Votación sin votos.'); showSummary(null, {}); return; }
  let max = Math.max(...Object.values(tally));
  let top = Object.keys(tally).filter(n=>tally[n]===max);
  let eliminated = top.length>1 ? sample(top) : top[0];
  if(top.length>1) logEvent(`Empate entre ${top.join(', ')}. Se elimina al azar: ${eliminated}`);
  else logEvent(`Eliminado: ${eliminated}`);
  const p = state.players.find(x=>x.name===eliminated);
  if(p) p.alive=false;
  showSummary(eliminated, tally, top.length>1?top:null);
});
function showSummary(eliminated, tally, tie){
  $('#sumRoundChip').textContent = `Resumen ronda ${state.round}`;
  const tallyStr = Object.keys(tally).length ? Object.entries(tally).map(([n,c])=>`${n}: ${c}`).join(' • ') : '';
  $('#summaryBody').innerHTML = `
    <div class="summary-card">
      <p><strong>Eliminado:</strong> ${eliminated || 'Nadie'}</p>
      ${tie && tie.length?`<p class="hint">Empate entre: ${tie.join(', ')}</p>`:''}
      ${tallyStr?`<p class="hint">Conteo: ${tallyStr}</p>`:''}
    </div>`;
  go('roundSummary');
}

/*** ==== CONTINUAR / FIN ==== ***/
$('#btnSummaryContinue').addEventListener('click', ()=>{
  const finished = checkWin();
  if(!finished){
    state.round++;
    renderMeeting();
    go('meeting');
    alert(`Comienza la ronda ${state.round}.`);
  }
});
function checkWin(){
  const civ = countRole('civil'), imp = countRole('impostor');
  if(imp===0){
    $('#winnerText').textContent = '¡Ganaron los Civiles!';
    $('#winnerSub').textContent = `Todos los impostores fueron descubiertos. Palabra: ${state.word}.`;
    logEvent('Fin de partida: victoria civil.'); go('results'); return true;
  }
  if(imp>=civ){
    $('#winnerText').textContent = '¡Ganaron los Impostores!';
    $('#winnerSub').textContent = `Los impostores alcanzaron a los civiles (${imp} vs ${civ}).`;
    logEvent('Fin de partida: victoria impostora.'); go('results'); return true;
  }
  return false;
}

/*** ==== NUEVA PARTIDA ==== ***/
$('#btnNewGame').addEventListener('click', ()=>{
  $('#playersInput').value=''; $('#secretWordInput').value=''; $('#impostorsInput').value=1; $('#showWordSelect').value='yes';
  state.log = []; go('setup');
});

})();
