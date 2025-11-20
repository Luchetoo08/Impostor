// ====== Palabras (categorías) ======
const wordPools = {
    "Clubes ARG": [],       // API
    "Clubes Mundo": [],     // API
    "Jugadores ARG": [],    // API
    "Jugadores Mundo": [],  // API
    "Clash Royale": [],     // API (cartas)
    "CESD": [
        "Lucho", "Pedro", "Spalletti", "Luana", "Francisco", "Lucas", "Tiziano", "Enzo", "Santiago", "Uriel", "Guada", "Uma", "Aileen", "Sofia Storero", "Genaro", "Joaquin", "Bruno Farias", "Ursula", "Camila 3ro", "Guada 3ro", "Mechi", "Facu Ortiz", "Dario", "Fede Torre", "Oriana", "Mariano", "Jorge Flores", "Soledad Rolfo", "Julieta Zaragoza", "Carolina Orellano", "Franco Almada", "Franco García", "Veronica Schulthess", "Laura Geric", "Laura Ingrassia", "Cristian Soloa", "Claudia Pedri", "Carolina Companys", "Mariana Menzaghi", "Mariana Rodriguez", "Gala", "Agostina", "Carla", "Montse", "Azul", "Carro", "Susan", "Gaby Pucheta", "Marcos Gómez", "Alejandra Moreno", "David Toscano", "Denis Molina", "Gonzalo", "Isabella 4to", "Juan Pablo Cicaré"
    ],
    "Leyendas": [
        "Maradona", "Pelé", "Zidane", "Ronaldinho", "Ronaldo Nazário", "Cruyff", "Beckenbauer", "Maldini", "Xavi", "Iniesta", "Henry", "Baggio", "Figo", "Romário", "Shevchenko", "Rooney", "Ibrahimović", "Roberto Carlos", "Cafu", "Totti",
        "Nedvěd", "Gattuso", "Pirlo", "Kaká", "Eto'o", "Cannavaro", "Del Piero", "Stoichkov", "Van Basten", "Platini"
    ],
    "Países": [
        "Estados Unidos", "China", "India", "Brasil", "Rusia", "Reino Unido", "Francia", "Alemania", "Italia", "España",
        "Canadá", "México", "Japón", "Corea del Sur", "Australia", "Argentina", "Chile", "Colombia", "Perú", "Uruguay",
        "Portugal", "Países Bajos", "Bélgica", "Suiza", "Suecia", "Noruega", "Dinamarca", "Finlandia", "Polonia", "Austria",
        "Irlanda", "Grecia", "República Checa", "Hungría", "Turquía", "Israel", "Arabia Saudita", "Emiratos Árabes Unidos", "Qatar", "Egipto",
        "Marruecos", "Sudáfrica", "Nigeria", "Kenia", "Argelia", "Etiopía", "Ghana", "Indonesia", "Tailandia", "Vietnam"
    ]
};

// ====== Estado ======
const state = {
    room: null,
    players: [],
    selectedCategories: new Set(),
    usedWords: new Set(),
    currentWord: null, // string o {tipo, nombre, imagen}
    impostorIdxs: [],
    configImpostorCount: 1, // [FIX] Separate config count
    liveImpostorCount: 1,   // [FIX] Separate live count
    alive: [],
    revealStep: 0,
    revealed: false,
    selectedAccused: null,
};

// ====== Helpers ======
const $ = sel => document.querySelector(sel);
const randInt = n => Math.floor(Math.random() * n);
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const genRoom = () => Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[randInt(32)]).join('');
const escapeHtml = str => String(str).replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", "&gt;": ">", "\"": "&quot;", "'": "&#39;" }[s]));
function getImpostorNames() { return state.impostorIdxs.map(i => state.players[i]).filter(Boolean); }

const save = () => localStorage.setItem('impostor-lite', JSON.stringify({ players: state.players, used: [...state.usedWords] }));
const load = () => {
    try {
        const d = JSON.parse(localStorage.getItem('impostor-lite') || '{}');
        if (Array.isArray(d.players)) state.players = d.players.slice(0, 16);
        if (Array.isArray(d.used)) state.usedWords = new Set(d.used);
    } catch { }
};

// ====== Navegación / Render ======
function show(id) {
    ["#screen-menu", "#screen-lobby", "#screen-reveal", "#screen-discuss",
        "#screen-vote", "#screen-results", "#screen-cards"
    ].forEach(
        s => $(s).classList.add('hidden')
    );
    $(id).classList.remove('hidden');
}

function renderPlayers() {
    const wrap = $('#players'); wrap.innerHTML = '';
    state.players.forEach((name, i) => {
        const el = document.createElement('div');
        el.className = 'pill';
        el.draggable = true; // Make draggable
        el.dataset.index = i; // Store index
        el.innerHTML = `<span>${escapeHtml(name)}</span> <span class="x" title="Quitar" data-i="${i}">✖</span>`;

        // Drag Events
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragenter', handleDragEnter);
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('dragleave', handleDragLeave);
        el.addEventListener('drop', handleDrop);
        el.addEventListener('dragend', handleDragEnd);

        wrap.appendChild(el);
    });
}

// ====== Drag & Drop Logic ======
let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    if (dragSrcEl !== this) {
        const srcIdx = parseInt(dragSrcEl.dataset.index);
        const targetIdx = parseInt(this.dataset.index);

        // Reorder array
        const item = state.players.splice(srcIdx, 1)[0];
        state.players.splice(targetIdx, 0, item);

        save();
        renderPlayers();
        updateStartButton();
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.pill').forEach(el => {
        el.classList.remove('over');
    });
}

function renderCategories() {
    const box = $('#categories'); box.innerHTML = '';
    Object.keys(wordPools).forEach(cat => {
        const el = document.createElement('div');
        el.className = 'selectable';
        el.dataset.cat = cat;
        let extra;
        if (
            cat === "Clubes ARG" ||
            cat === "Clubes Mundo" ||
            cat === "Jugadores ARG" ||
            cat === "Jugadores Mundo" ||
            cat === "Clash Royale"
        ) {
            extra = 'API';
        } else {
            extra = (wordPools[cat].length + " palabras");
        }
        el.innerHTML = `<strong>${cat}</strong><div class="muted">${extra}</div>`;
        if (state.selectedCategories.has(cat)) el.classList.add('selected');
        box.appendChild(el);
    });
}

function updateStartButton() {
    const ok = state.players.length >= 3 && state.selectedCategories.size > 0 && !!state.currentWord;
    const btn = $('#startRound');
    if (btn) btn.disabled = !ok;
}

function updateRoundBanner() {
    const banner = $('#roundBanner');
    const textEl = $('#roundCatsText');
    if (!banner || !textEl) return;
    if (state.selectedCategories.size === 0) {
        banner.classList.add('hidden');
        textEl.textContent = '';
        return;
    }
    const cats = Array.from(state.selectedCategories);
    textEl.textContent = cats.join(' · ');
    banner.classList.remove('hidden');
}

// ====== APIs ======
const API_CLUBES_ARG = "https://6918a60a21a963594870c317.mockapi.io/clubesarg";
const API_CLUBES_MUNDO = "https://6918a60a21a963594870c317.mockapi.io/clubesmundo";
const API_JUG_ARG = "https://691930719ccba073ee9257b2.mockapi.io/jugadoresarg";
const API_JUG_MUNDO = "https://691930719ccba073ee9257b2.mockapi.io/jugadoresmundo";

const API_COMUNES = "https://6917a7c721a96359486d94bb.mockapi.io/comunes";
const API_ALTAS = "https://6917a7c721a96359486d94bb.mockapi.io/cartas2";

let cacheClubesArg = null;
let cacheClubesMundo = null;
let cacheJugArg = null;
let cacheJugMundo = null;
let allCards = [];

async function ensureClubesArg() {
    if (!cacheClubesArg) {
        const r = await fetch(API_CLUBES_ARG);
        cacheClubesArg = await r.json();
    }
    return cacheClubesArg;
}
async function ensureClubesMundo() {
    if (!cacheClubesMundo) {
        const r = await fetch(API_CLUBES_MUNDO);
        cacheClubesMundo = await r.json();
    }
    return cacheClubesMundo;
}
async function ensureJugArg() {
    if (!cacheJugArg) {
        const r = await fetch(API_JUG_ARG);
        cacheJugArg = await r.json();
    }
    return cacheJugArg;
}
async function ensureJugMundo() {
    if (!cacheJugMundo) {
        const r = await fetch(API_JUG_MUNDO);
        cacheJugMundo = await r.json();
    }
    return cacheJugMundo;
}

async function ensureCardsLoaded() {
    if (allCards.length) return allCards;
    const r1 = await fetch(API_COMUNES);
    const r2 = await fetch(API_ALTAS);
    const d1 = await r1.json();
    const d2 = await r2.json();
    allCards = [...d1, ...d2];
    return allCards;
}

// ====== Helpers: pick desde APIs ======
async function pickFromApi(type) {
    let data;
    if (type === 'club-arg') {
        data = await ensureClubesArg();
    } else if (type === 'club-mundo') {
        data = await ensureClubesMundo();
    } else if (type === 'jug-arg') {
        data = await ensureJugArg();
    } else if (type === 'jug-mundo') {
        data = await ensureJugMundo();
    } else {
        return false;
    }

    if (!Array.isArray(data) || data.length === 0) {
        alert('No hay datos en la API seleccionada.');
        return false;
    }

    const disponibles = data.filter(item => !state.usedWords.has(item.nombre));
    const pool = disponibles.length ? disponibles : data;
    const elegido = choice(pool);
    const nombre = elegido.nombre || elegido.name || 'Sin nombre';
    const imagen = elegido.imagen || elegido.image || '';

    state.currentWord = { tipo: type, nombre, imagen };
    state.usedWords.add(nombre);
    save();
    return true;
}

async function pickFromClashApi() {
    const data = await ensureCardsLoaded();
    if (!Array.isArray(data) || data.length === 0) {
        alert('No hay cartas en la API de Clash Royale.');
        return false;
    }

    const disponibles = data.filter(c => !state.usedWords.has(c.name));
    const pool = disponibles.length ? disponibles : data;
    const elegido = choice(pool);
    const nombre = elegido.name || 'Carta';
    const imagen = elegido.imagen || elegido.image || '';

    state.currentWord = {
        tipo: 'cr-card',
        nombre,
        imagen
    };
    state.usedWords.add(nombre);
    save();
    return true;
}

// ====== Juego: elegir palabra mezclando categorías ======
async function pickWord() {
    if (state.selectedCategories.size === 0) {
        alert('Elegí al menos una categoría.');
        return false;
    }

    const cats = Array.from(state.selectedCategories);
    const cat = choice(cats); // categoría elegida para esta ronda

    // Categorías API
    if (cat === "Clubes ARG") {
        return await pickFromApi('club-arg');
    }
    if (cat === "Clubes Mundo") {
        return await pickFromApi('club-mundo');
    }
    if (cat === "Jugadores ARG") {
        return await pickFromApi('jug-arg');
    }
    if (cat === "Jugadores Mundo") {
        return await pickFromApi('jug-mundo');
    }
    if (cat === "Clash Royale") {
        return await pickFromClashApi();
    }

    // Categorías con arrays (CESD, Leyendas, Países)
    let pool = wordPools[cat] || [];
    if (!pool.length) {
        alert('No hay palabras en la categoría seleccionada.');
        return false;
    }

    const fresh = pool.filter(w => !state.usedWords.has(w));
    const usable = fresh.length ? fresh : pool;
    const word = choice(usable);

    state.currentWord = word;
    state.usedWords.add(word);
    save();
    return true;
}

function startRound() {
    // [FIX] Force sync from DOM to handle browser auto-fill on reload
    const checkedRadio = document.querySelector('input[name="impostors"]:checked');
    if (checkedRadio) {
        state.configImpostorCount = parseInt(checkedRadio.value, 10) || 1;
    }

    // [FIX] Use configImpostorCount instead of impostorCount
    const desired = Math.max(1, Math.min(state.configImpostorCount, Math.max(1, state.players.length - 1)));
    const chosen = new Set();
    while (chosen.size < desired) {
        chosen.add(randInt(state.players.length));
    }
    state.impostorIdxs = Array.from(chosen);
    // [FIX] Initialize liveImpostorCount
    state.liveImpostorCount = state.impostorIdxs.length;

    state.alive = Array(state.players.length).fill(true);
    state.revealStep = 0;
    state.revealed = false;
    updateRoundBanner();
    show('#screen-reveal');
    renderReveal();
    // [FIX] Use liveImpostorCount
    $('#impostorsLeft').textContent = state.liveImpostorCount;
}

function renderReveal() {
    const i = state.revealStep;
    const name = state.players[i] || '—';
    $('#revealPlayer').textContent = name;
    state.revealed = false;
    $('#btnShow').disabled = false;

    // [ANIMATION] Reset animation state
    const card = $('#revealCard');
    card.className = 'notice'; // Reset classes
    card.innerHTML = 'Toquen <strong>Mostrar</strong> para ver su palabra/rol';

    // [ANIMATION] Add pulse to button
    $('#btnShow').classList.add('animate-pulse');
}

function nextReveal() {
    if (!state.revealed) {
        alert('Primero toca "Mostrar" para ver tu rol.');
        return;
    }
    if (state.revealStep < state.players.length - 1) {
        state.revealStep++;
        renderReveal();
    } else {
        show('#screen-discuss');
    }
}

function beginVoting() {
    state.selectedAccused = null;
    show('#screen-vote');
    renderVote();
}

function renderVote() {
    const playersLeft = state.alive.filter(Boolean).length;
    $('#playersLeft').textContent = playersLeft;
    // [FIX] Use liveImpostorCount
    $('#impostorsLeft').textContent = state.liveImpostorCount;
    const list = $('#voteList'); list.innerHTML = '';
    state.players.forEach((name, i) => {
        if (!state.alive[i]) return;
        const b = document.createElement('button');
        b.className = 'btn selectable' + (state.selectedAccused === i ? ' selected' : '');
        b.style.textAlign = 'left';
        b.innerHTML = `👤 ${escapeHtml(name)}`;
        b.onclick = () => { state.selectedAccused = i; renderVote(); };
        list.appendChild(b);
    });
}

function confirmVote() {
    if (state.selectedAccused == null) {
        alert('Elegí a quién acusan.');
        return;
    }
    const accused = state.selectedAccused;
    state.alive[accused] = false;
    const wasImpostor = state.impostorIdxs.includes(accused);
    if (wasImpostor) {
        // [FIX] Decrement liveImpostorCount, NOT configImpostorCount
        state.liveImpostorCount--;
        state.impostorIdxs = state.impostorIdxs.filter(x => x !== accused);
    }

    showResultsAfterVote(accused, wasImpostor);
}

function showResultsAfterVote(accused, wasImpostor) {
    const playersLeft = state.alive.filter(Boolean).length;
    // [FIX] Use liveImpostorCount
    const crewLeft = playersLeft - state.liveImpostorCount;
    const accusedText = accused == null ? 'Nadie' : state.players[accused];

    let outcome = null;
    // [FIX] Use liveImpostorCount
    if (state.liveImpostorCount === 0) {
        outcome = 'crew';
    } else if (state.liveImpostorCount === crewLeft) {
        outcome = 'impostors';
    }

    const verdict = accused == null
        ? '⏸️ Decidieron no eliminar a nadie'
        : (wasImpostor ? '✅ Era el IMPOSTOR' : '❌ No era el impostor');

    let wordBlock = '';
    if (outcome !== null) {
        let palabraMostrada = '';
        if (state.currentWord) {
            if (typeof state.currentWord === 'object') {
                palabraMostrada = state.currentWord.nombre || '';
            } else {
                palabraMostrada = String(state.currentWord);
            }
        }
        if (palabraMostrada) {
            wordBlock = `
            <p class="muted">Palabra de la ronda:</p>
            <div class="big">${escapeHtml(palabraMostrada)}</div>
            <div class="spacer"></div>
          `;
        }
    } else {
        wordBlock = `
          <p class="muted">La palabra permanecerá oculta hasta que termine la partida.</p>
          <div class="spacer"></div>
        `;
    }

    // [FIX] Use liveImpostorCount
    let statusLine = `👥 Vivos: <strong>${playersLeft}</strong> | 🎭 Impostores restantes: <strong>${state.liveImpostorCount}</strong>`;
    if (outcome === 'crew') statusLine += ' — 🏆 Ganan los tripulantes';
    if (outcome === 'impostors') statusLine += ' — 🏴 Ganan los impostores';

    const impostorsLine = outcome === 'impostors'
        ? `<p class="muted">Impostor(es): <strong>${getImpostorNames().map(escapeHtml).join(', ')}</strong></p>`
        : '';

    $('#resultsBox').innerHTML = `
        ${wordBlock}
        <p>Acusado: <strong>${escapeHtml(accusedText)}</strong></p>
        <p>${verdict}</p>
        ${impostorsLine}
        <div class="spacer"></div>
        <div class="chip">${statusLine}</div>
      `;

    const btnCont = $('#continueRound');
    const btnAgain = $('#playAgain');
    if (outcome === null) {
        btnCont.classList.remove('hidden');
        btnAgain.classList.add('hidden');
    } else {
        btnCont.classList.add('hidden');
        btnAgain.classList.remove('hidden');
    }

    show('#screen-results');
}

// ====== Cartas Clash Royale (MockAPI) ======
function getRarezaColor(r) {
    if (r === "Común") return "#b9b9b9";
    if (r === "Especial") return "#4bc9ff";
    if (r === "Épica") return "#c66bff";
    if (r === "Legendaria") return "#ffb300";
    if (r === "Campeón") return "#1e88e5";
    return "#ffffff";
}

function renderCards(list) {
    const grid = document.getElementById("cardsGrid");
    grid.innerHTML = "";
    if (!list || list.length === 0) {
        grid.innerHTML = `<p class="muted">No se encontraron cartas para este filtro.</p>`;
        return;
    }
    list.forEach(carta => {
        const card = document.createElement("div");
        const color = getRarezaColor(carta.rareza);
        card.className = "cr-card";
        card.innerHTML = `
          <img class="cr-card-img" src="${carta.imagen}" alt="${escapeHtml(carta.name)}">
          <div class="cr-card-name" style="color:${color}">${escapeHtml(carta.name)}</div>
          <div class="cr-card-rareza">${escapeHtml(carta.rareza || "")}</div>
        `;
        grid.appendChild(card);
    });
}

async function loadCards() {
    const grid = document.getElementById("cardsGrid");
    grid.innerHTML = `<p class="muted">Cargando cartas...</p>`;
    try {
        await ensureCardsLoaded();
        renderCards(allCards);
    } catch (e) {
        console.error(e);
        grid.innerHTML = `<p class="muted">Error al cargar las cartas.</p>`;
    }
}

function filterCardsByRareza(rareza) {
    if (!allCards.length) return;
    if (rareza === "all") {
        renderCards(allCards);
    } else {
        renderCards(allCards.filter(c => c.rareza === rareza));
    }
}

// ====== Eventos UI ======
$('#createQuick').addEventListener('click', () => {
    state.room = genRoom();
    $('#roomCode').textContent = `Sala ${state.room}`;
    show('#screen-lobby');
    renderPlayers();
    renderCategories();
    updateRoundBanner();
    updateStartButton();
});

$('#backMenu2').addEventListener('click', () => show('#screen-menu'));
$('#btnBackMenu').addEventListener('click', () => show('#screen-menu'));
$('#btnReset').addEventListener('click', () => {
    if (confirm('¿Seguro que querés reiniciar la aplicación?')) {
        localStorage.removeItem('impostor-lite');
        location.reload();
    }
});

$('#playerName').addEventListener('keydown', e => { if (e.key === 'Enter') addPlayer(); });
$('#addPlayer').addEventListener('click', addPlayer);

function addPlayer() {
    const name = $('#playerName').value.trim();
    if (!name) return;
    if (state.players.includes(name)) { alert('Ese nombre ya está en la lista.'); return; }
    if (state.players.length >= 16) { alert('Máximo 16 jugadores.'); return; }
    state.players.push(name);
    $('#playerName').value = '';
    renderPlayers();
    updateStartButton();
    save();
}

$('#players').addEventListener('click', e => {
    if (e.target.classList.contains('x')) {
        const i = +e.target.getAttribute('data-i');
        state.players.splice(i, 1);
        renderPlayers();
        updateStartButton();
        save();
    }
});

$('#categories').addEventListener('click', e => {
    const item = e.target.closest('.selectable');
    if (!item) return;
    const cat = item.getAttribute('data-cat');
    if (state.selectedCategories.has(cat)) state.selectedCategories.delete(cat);
    else state.selectedCategories.add(cat);
    item.classList.toggle('selected');
    updateStartButton();
    updateRoundBanner();
});

$('#toggleAllCats').addEventListener('click', () => {
    const all = Object.keys(wordPools);
    const allSelected = all.every(c => state.selectedCategories.has(c));
    state.selectedCategories = new Set(allSelected ? [] : all);
    renderCategories();
    updateStartButton();
    updateRoundBanner();
});

document.querySelectorAll('input[name="impostors"]').forEach(r => {
    r.addEventListener('change', () => {
        const val = parseInt(r.value, 10);
        // [FIX] Update configImpostorCount
        state.configImpostorCount = isNaN(val) ? 1 : val;
    });
});

$('#btnShuffle').addEventListener('click', async () => {
    if (state.selectedCategories.size === 0) { alert('Elegí al menos una categoría.'); return; }
    const ok = await pickWord();
    if (ok) {
        updateStartButton();
        alert('Palabra elegida para la ronda.');
    }
});

$('#startRound').addEventListener('click', async () => {
    if (!(state.players.length >= 3)) { alert('Mínimo 3 jugadores.'); return; }
    if (state.selectedCategories.size === 0) { alert('Seleccioná categorías.'); return; }
    if (!state.currentWord) {
        const ok = await pickWord();
        if (!ok) return;
    }
    startRound();
});

$('#btnShow').addEventListener('click', () => {
    if (state.revealed) return;
    const i = state.revealStep;
    const isImp = state.impostorIdxs.includes(i);

    let text;

    if (isImp) {
        text = 'Eres el <strong>IMPOSTOR</strong><br/><span class="muted">Tu palabra es: <em>???</em></span>';
    } else {
        if (state.currentWord && typeof state.currentWord === 'object') {
            const { tipo, nombre, imagen } = state.currentWord;
            let label = 'Tu palabra es';
            if (tipo === 'club-arg' || tipo === 'club-mundo') label = 'Tu club es';
            else if (tipo === 'jug-arg' || tipo === 'jug-mundo') label = 'Tu jugador es';
            else if (tipo === 'cr-card') label = 'Tu carta es';

            const img = imagen
                ? `<img src="${imagen}" alt="${escapeHtml(nombre)}" style="width:120px;height:120px;object-fit:contain;display:block;margin:0 auto 8px;">`
                : '';

            text = `
            ${img}
            <div>${label}: <strong>${escapeHtml(nombre)}</strong></div>
          `;
        } else {
            text = `Tu palabra es: <strong>${escapeHtml(state.currentWord)}</strong>`;
        }
    }

    // [ANIMATION] Trigger reveal
    const card = $('#revealCard');
    card.innerHTML = `<div class="reveal-content">${text}</div>`;
    card.classList.add('reveal-active');
    if (isImp) card.classList.add('impostor-reveal');

    state.revealed = true;
    $('#btnShow').disabled = true;
    $('#btnShow').classList.remove('animate-pulse');
});

$('#btnNext').addEventListener('click', nextReveal);
$('#goVote').addEventListener('click', beginVoting);
$('#confirmVote').addEventListener('click', confirmVote);
$('#skipVote').addEventListener('click', () => { showResultsAfterVote(null, false); });
$('#continueRound').addEventListener('click', () => { beginVoting(); });
$('#playAgain').addEventListener('click', async () => {
    const ok = await pickWord();
    if (ok) startRound();
});
$('#toLobby').addEventListener('click', () => { show('#screen-lobby'); updateStartButton(); });

// Navegación a cartas
document.getElementById('btnOpenCards').addEventListener('click', () => {
    show('#screen-cards');
    loadCards();
});

document.getElementById('backFromCards').addEventListener('click', () => {
    show('#screen-menu');
});

// Filtros de rareza
document.getElementById('btnFilterAll').addEventListener('click', () => filterCardsByRareza('all'));
document.getElementById('btnFilterComunes').addEventListener('click', () => filterCardsByRareza('Común'));
document.getElementById('btnFilterEspeciales').addEventListener('click', () => filterCardsByRareza('Especial'));
document.getElementById('btnFilterEpicas').addEventListener('click', () => filterCardsByRareza('Épica'));
document.getElementById('btnFilterLegendarias').addEventListener('click', () => filterCardsByRareza('Legendaria'));
document.getElementById('btnFilterCampeones').addEventListener('click', () => filterCardsByRareza('Campeón'));

// init
load();
renderCategories();
