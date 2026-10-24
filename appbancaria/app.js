// Datos ficticios del prototipo y estado persistido en este navegador.
const demo = {
  user: {
    name: 'Mariana Ramirez',
    email: 'mariana@ejemplo.mx',
    phone: '55 1234 5678',
  },
  accounts: [
    {
      id: 'main',
      name: 'Cuenta principal',
      number: '6461 •••• •••• 4829',
      clabe: '646180157000004829',
      balance: 24750.8,
      created: '12 feb 2024',
      status: 'Activa',
    },
    {
      id: 'travel',
      name: 'Viajes',
      number: '6461 •••• •••• 1105',
      clabe: '646180157000001105',
      balance: 12800,
      created: '03 jun 2024',
      status: 'Activa',
    },
  ],
  transactions: [
    { name: 'Café Nómada', category: 'Comida y bebida', date: 'Hoy, 10:24', type: 'Gasto', amount: -128, icon: '☕' },
    { name: 'Nómina • Acme Studio', category: 'Ingreso', date: 'Ayer, 09:00', type: 'Ingreso', amount: 28500, icon: '↙' },
    { name: 'Supermercado Fresco', category: 'Hogar', date: '8 oct 2026', type: 'Gasto', amount: -1340.5, icon: '⌂' },
    { name: 'Transferencia a Ana', category: 'Transferencia', date: '7 oct 2026', type: 'Transferencia', amount: -850, icon: '↗' },
    { name: 'Depósito en efectivo', category: 'Depósito', date: '5 oct 2026', type: 'Depósito', amount: 2000, icon: '＋' },
    { name: 'Librería El Péndulo', category: 'Compras', date: '3 oct 2026', type: 'Gasto', amount: -460, icon: '▤' },
  ],
  spaces: [
    { name: 'Viaje a Oaxaca', goal: 22000, saved: 12800, date: '15 dic 2026' },
    { name: 'Colchón de tranquilidad', goal: 30000, saved: 8500, date: '31 mar 2027' },
  ],
  recipients: [{ name: 'Ana López', account: '646180157000002315' }],
  deposits: [],
  transfers: [],
  notifications: true,
  dark: false,
};

let state = JSON.parse(localStorage.getItem('rb-demo') || 'null') || demo;
let logged = localStorage.getItem('rb-login') === 'yes';
let page = logged ? 'inicio' : 'landing';
let activeAccount = state.accounts[0]?.id || 'main';
let showBalance = true;

// Valores de referencia solamente; no son cotizaciones ni operaciones reales.
const rates = { MXN: 1, USD: 17.24, EUR: 18.77, BTC: 1115000, ETH: 39800 };
const currency = { MXN: 'MX$', USD: '$', EUR: '€', BTC: '₿', ETH: 'Ξ' };

// Funciones compartidas de almacenamiento y presentación.
const persist = () => localStorage.setItem('rb-demo', JSON.stringify(state));
const account = () => state.accounts.find((item) => item.id === activeAccount) || state.accounts[0];
const money = (value) => new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
}).format(value);
const fmt = (value, code) => code === 'BTC' || code === 'ETH'
  ? `${currency[code]}${Number(value).toLocaleString('es-MX', { maximumFractionDigits: 6 })}`
  : new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: code === 'MXN' ? 'MXN' : code,
  }).format(value);
const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));
function toast(msg,error=false){let t=document.createElement('div');t.className='toast'+(error?' error':'');t.textContent=msg;document.querySelector('#toast-root').append(t);setTimeout(()=>t.remove(),2800)}

function greet(){return state.user.name.split(' ')[0]}

function nav(icon,label,key){return `<button class="nav-item ${page===key?'active':''}" onclick="go('${key}')">
      <span class="nav-icon">${icon}</span>${label}</button>`}
// Plantillas de la página pública y de sus secciones.
function landing(){return `<div class="landing">
      <header class="landing-nav">
      <div class="brand">
      <span class="brandmark">r.</span>RamirezBank</div>
      <div class="landing-links">
      <a href="#beneficios">Beneficios</a>
      <a href="#como">Cómo funciona</a>
      <a href="#preguntas">Preguntas frecuentes</a>
      </div>
      <div>
      <button class="btn ghost small" onclick="auth('login')">Iniciar sesión</button> <button class="btn primary small" onclick="auth('register')">Crear cuenta</button>
      </div>
      </header>
      <section class="landing-hero">
      <div class="hero-copy">
      <span class="eyebrow">Tu banco, a tu manera</span>
      <h1>Tu dinero merece vivir más tranquilo.</h1>
      <p>Una forma más simple y clara de manejar tu dinero. Sin filas, sin letras pequeñas: solo tú y tus planes.</p>
      <div class="hero-actions">
      <button class="btn primary" onclick="auth('register')">Abre tu cuenta gratis&nbsp; →</button>
      <button class="btn ghost" onclick="auth('login')">Ya tengo cuenta</button>
      </div>
      <div class="trust">
      <span>✳ Diseñado para tu día a día</span>
      <b>·</b>
      <span>🔒 Tu seguridad primero</span>
      </div>
      </div>
      <div class="visual-wrap">
      <div class="float-chip one">
      <span class="muted">Ahorro este mes</span>
      <div class="chip-amount">+$2,450</div>
      </div>
      <div class="hero-card">
      <div class="row">
      <div class="brand">
      <span class="brandmark" style="background:#ffffff20;color:var(--lime)">r.</span> RamirezBank</div>
      <span>✦</span>
      </div>
      <div class="eyebrow">Saldo disponible</div>
      <div class="balance">$24,750<span style="font-size:20px">.80</span>
      </div>
      <div style="color:#ccddd2">Tu tranquilidad también cuenta.</div>
      <div class="card-meta">
      <span>•••• •••• •••• 4829</span>
      <span>VISA&nbsp; ◉</span>
      </div>
      </div>
      <div class="float-chip two">
      <div style="display:flex;gap:10px;align-items:center">
      <span class="f-icon" style="margin:0;width:33px;height:33px">↗</span>
      <div>
      <b>Todo bajo control</b>
      <div class="muted" style="font-size:11px">Tus gastos, de un vistazo</div>
      </div>
      </div>
      </div>
      </div>
      </section>
      <section id="beneficios" class="features">
      <div class="section-inner">
      <div class="section-title">
      <span class="eyebrow">Todo lo que necesitas</span>
      <h2>La banca que te entiende</h2>
      <p class="muted">Herramientas claras para tomar mejores decisiones con tu dinero.</p>
      </div>
      <div class="feature-grid">
      <article class="feature">
      <div class="f-icon">↗</div>
      <h3>Transfiere con confianza</h3>
      <p>Envía dinero a quien quieras con un flujo claro y un comprobante a la mano.</p>
      </article>
      <article class="feature">
      <div class="f-icon">◉</div>
      <h3>Ahorra a tu ritmo</h3>
      <p>Crea espacios para tus planes y sigue tu progreso sin complicaciones.</p>
      </article>
      <article class="feature">
      <div class="f-icon">⌁</div>
      <h3>Todo bajo control</h3>
      <p>Entiende en qué gastas con movimientos y resúmenes fáciles de leer.</p>
      </article>
      <article class="feature">
      <div class="f-icon">▣</div>
      <h3>Tu cuenta, siempre lista</h3>
      <p>Consulta tus datos y administra distintas cuentas desde un solo lugar.</p>
      </article>
      <article class="feature">
      <div class="f-icon">◎</div>
      <h3>Una tarjeta para ti</h3>
      <p>Conoce los controles de tu tarjeta virtual y mantén el control en tus manos.</p>
      </article>
      <article class="feature">
      <div class="f-icon">♧</div>
      <h3>Diseñada pensando en ti</h3>
      <p>Privacidad y seguridad forman parte de cada detalle de la experiencia.</p>
      </article>
      </div>
      </div>
      </section>
      <section id="como" class="how">
      <div class="section-inner">
      <div class="section-title">
      <span class="eyebrow">Así de sencillo</span>
      <h2>Empieza en tres pasos</h2>
      </div>
      <div class="how-grid">
      <div class="step">
      <b>01 — CREA TU CUENTA</b>
      <h3>Un registro sencillo</h3>
      <p class="muted">Cuéntanos un poco de ti y prepara tu espacio RamirezBank.</p>
      </div>
      <div class="step">
      <b>02 — ORGANIZA TU DINERO</b>
      <h3>Todo en su lugar</h3>
      <p class="muted">Administra tus cuentas, tus transferencias y tus metas desde una app.</p>
      </div>
      <div class="step">
      <b>03 — VE TU PROGRESO</b>
      <h3>Decide con claridad</h3>
      <p class="muted">Sigue tus movimientos y avanza a tu propio ritmo.</p>
      </div>
      </div>
      </div>
      </section>
      <section id="preguntas" class="faq">
      <div class="section-inner">
      <div class="section-title">
      <span class="eyebrow">¿Tienes dudas?</span>
      <h2>Preguntas frecuentes</h2>
      </div>
      <details>
      <summary>¿Abrir una cuenta tiene algún costo?</summary>
      <p>En este prototipo, crear una cuenta de demostración es gratis. La disponibilidad de productos reales dependería de los servicios bancarios integrados.</p>
      </details>
      <details>
      <summary>¿Mis datos y mi dinero son reales?</summary>
      <p>No. Esta experiencia es una demostración: utiliza información ficticia y no procesa dinero ni transacciones reales.</p>
      </details>
      <details>
      <summary>¿Puedo usar RamirezBank desde mi celular?</summary>
      <p>Sí. La interfaz se adapta a teléfonos, tabletas y computadoras.</p>
      </details>
      <details>
      <summary>¿Cómo puedo recibir ayuda?</summary>
      <p>Visita el Centro de ayuda dentro de la aplicación o escríbenos a hola@ramirezbank.mx.</p>
      </details>
      </div>
      </section>
      <footer class="footer">
      <div class="footer-inner">
      <div>
      <div class="brand">
      <span class="brandmark">r.</span>RamirezBank</div>
      <p style="margin:10px 0 0">Tu dinero, en calma. · hola@ramirezbank.mx</p>
      </div>
      <div>
      <a href="#preguntas">Ayuda</a>
      <a href="#">Privacidad</a>
      <a href="#">Términos</a>
      <a href="#">Instagram</a>
      <a href="#">LinkedIn</a>
      </div>
      </div>
      </footer>
      </div>`}
function shell() {
  const mobileItems = [
    ['⌂', 'Inicio', 'inicio'],
    ['▤', 'Movimientos', 'movimientos'],
    ['↗', 'Transferir', 'transferir'],
    ['◉', 'Ahorro', 'ahorro'],
    ['☰', 'Más', 'cuentas'],
  ];
  const mobileNav = mobileItems
    .map(([icon, label, target]) => `
      <button class="${page === target ? 'active' : ''}" onclick="go('${target}')">
        <i>${icon}</i>${label}
      </button>
    `)
    .join('');

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
      <span class="brandmark">r.</span>RamirezBank</div>
        <div class="side-label eyebrow">MENÚ PRINCIPAL</div>
        <nav class="nav-list">
          ${nav('⌂', 'Inicio', 'inicio')}
          ${nav('▣', 'Mis cuentas', 'cuentas')}
          ${nav('↗', 'Transferir', 'transferir')}
          ${nav('＋', 'Depositar', 'depositar')}
          ${nav('◉', 'Espacios de ahorro', 'ahorro')}
          ${nav('▤', 'Movimientos', 'movimientos')}
          ${nav('⇄', 'Conversor', 'conversor')}
          ${nav('▧', 'Tarjetas', 'tarjetas')}
        </nav>
        <div class="side-bottom">
          <nav class="nav-list">
            ${nav('⚙', 'Configuración', 'config')}
            ${nav('?', 'Ayuda', 'ayuda')}
          </nav>
          <div class="profile-mini">
            <div class="avatar">${greet()[0]}</div>
            <div style="flex:1">
              <b>${esc(greet())}</b>
              <div class="muted" style="font-size:11px">Cuenta personal</div>
            </div>
            <button class="icon-btn" onclick="logout()" title="Cerrar sesión">↪</button>
          </div>
        </div>
      </aside>
      <main class="main">
        <div class="topbar">
          <div class="row">
            <button class="icon-btn hamburger" onclick="toast('Menú disponible en el panel lateral')">☰</button>
            <div class="brand" style="display:none" id="mobile-brand">
              <span class="brandmark">r.</span>RamirezBank
            </div>
            <div>
              <div class="eyebrow">${new Intl.DateTimeFormat('es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              }).format(new Date())}</div>
            </div>
          </div>
          <div class="top-actions">
            <button class="icon-btn" onclick="go('notificaciones')" title="Notificaciones">♧</button>
            <button class="icon-btn" onclick="toggleTheme()" title="Cambiar tema">◐</button>
            <div class="avatar" onclick="go('config')" style="cursor:pointer">${greet()[0]}</div>
          </div>
        </div>
        <div class="content" id="content">
      </div>
      </main>
      <nav class="mobile-nav">${mobileNav}</nav>
    </div>
  `;
}

function txRows(list){return list.map(t=>`<div class="tx-row">
      <div class="tx-icon">${t.icon||'•'}</div>
      <div class="tx-desc">
      <b>${esc(t.name)}</b>
      <small>${esc(t.category||t.type)} · ${esc(t.date)}</small>
      </div>
      <div class="amount ${t.amount>0?'positive':''}">${t.amount>0?'+':'−'}${money(Math.abs(t.amount))}</div>
      </div>`).join('')||'<div class="empty">Aún no hay movimientos.</div>'}
function home(){let a=account();return `<div class="row" style="margin-bottom:22px">
      <div>
      <h1 class="greeting">Hola, ${esc(greet())} <span>☀</span>
      </h1>
      <div class="muted">Aquí tienes el resumen de tu dinero.</div>
      </div>
      <select aria-label="Seleccionar cuenta" onchange="activeAccount=this.value;render()" style="padding:10px;border:1px solid var(--line);border-radius:11px;background:#fff">${state.accounts.map(x=>`<option value="${x.id}" ${x.id===activeAccount?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
      </div>
      <div class="dashboard-grid">
      <div>
      <section class="account-card">
      <div class="row">
      <div class="eyebrow">${esc(a.name)}</div>
      <button class="icon-btn" style="color:white" onclick="showBalance=!showBalance;render()">${showBalance?'◉':'⊘'}</button>
      </div>
      <div class="balance">${showBalance?money(a.balance):'••••••••'}</div>
      <div style="font-size:12px;color:#d2e1d7">Saldo disponible</div>
      <div class="account-bottom">
      <div>
      <div style="margin-bottom:5px">${esc(a.number)}</div>
      <button class="icon-btn" style="color:#e2ede5;padding:5px 0" onclick="copyText('${a.clabe}')">Copiar CLABE　⧉</button>
      </div>
      <div>◈ VISA</div>
      </div>
      </section>
      <div class="quick-actions">
      <button class="quick" onclick="go('transferir')">
      <i>↗</i>
      <span>Transferir</span>
      </button>
      <button class="quick" onclick="go('depositar')">
      <i>＋</i>
      <span>Depositar</span>
      </button>
      <button class="quick" onclick="go('ahorro')">
      <i>◉</i>
      <span>Ahorrar</span>
      </button>
      <button class="quick" onclick="go('tarjetas')">
      <i>▧</i>
      <span>Pagar</span>
      </button>
      <button class="quick" onclick="go('movimientos')">
      <i>▤</i>
      <span>Movimientos</span>
      </button>
      </div>
      <section class="panel">
      <div class="section-head">
      <h2 class="panel-title">Movimientos recientes</h2>
      <button class="btn ghost small" onclick="go('movimientos')">Ver todos</button>
      </div>${txRows(state.transactions.slice(0,4))}</section>
      </div>
      <div>
      <section class="panel">
      <div class="row">
      <div>
      <div class="eyebrow">ESTE MES</div>
      <h2 style="font:700 24px Manrope;margin:8px 0">Tu resumen</h2>
      </div>
      <span class="pill">Octubre</span>
      </div>
      <div class="row" style="margin-top:17px">
      <div>
      <small class="muted">Ingresos</small>
      <div class="amount positive" style="font-size:18px">${money(28500)}</div>
      </div>
      <div>
      <small class="muted">Gastos</small>
      <div class="amount" style="font-size:18px">${money(2778.5)}</div>
      </div>
      </div>
      <div class="bar-chart">${[45,68,40,82,56,70,91].map((h,i)=>`<div class="bar-group">
      <div class="bar ${i===6?'active':''}" style="height:${h}%">
      </div>
      <span class="bar-label">${['L','M','M','J','V','S','D'][i]}</span>
      </div>`).join('')}</div>
      <div class="notice">Tu actividad va bien. Sigue revisando tus gastos cada semana.</div>
      </section>
      <section class="panel page-panel">
      <div class="section-head">
      <h2 class="panel-title">Tus espacios</h2>
      <button class="icon-btn" onclick="go('ahorro')">→</button>
      </div>${state.spaces.slice(0,2).map(s=>`<div style="margin:16px 0">
      <div class="row">
      <b>${esc(s.name)}</b>
      <small class="muted">${Math.round(s.saved/s.goal*100)}%</small>
      </div>
      <div class="progress">
      <i style="width:${Math.min(100,s.saved/s.goal*100)}%">
      </i>
      </div>
      <small class="muted">${money(s.saved)} de ${money(s.goal)}</small>
      </div>`).join('')}</section>
      <section class="panel page-panel">
      <div class="section-head">
      <h2 class="panel-title">Tu tarjeta virtual</h2>
      <button class="icon-btn" onclick="go('tarjetas')">→</button>
      </div>
      <div style="background:#173e32;color:#fff;padding:18px;border-radius:15px;margin-top:14px">
      <div class="row">
      <span class="brand" style="font-size:14px">r. RamirezBank</span>
      <span>◈</span>
      </div>
      <div style="margin:25px 0 13px;letter-spacing:.15em">•••• &nbsp;•••• &nbsp;•••• &nbsp;4829</div>
      <div class="row" style="font-size:10px;color:#c5d5cb">
      <span>MARIANA RAMIREZ</span>
      <span>VISA</span>
      </div>
      </div>
      </section>
      </div>
      </div>`}
function accountsPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">TU DINERO, ORGANIZADO</span>
      <h2>Mis cuentas</h2>
      </div>
      <button class="btn primary" onclick="modalAccount()">＋ Nueva cuenta</button>
      </div>
      <div class="accounts-grid">${state.accounts.map(a=>`<article class="account-tile">
      <div class="row">
      <span class="pill">${esc(a.status)}</span>
      <button class="icon-btn" onclick="activeAccount='${a.id}';go('inicio')">•••</button>
      </div>
      <h3>${esc(a.name)}</h3>
      <div class="account-number">${esc(a.number)}</div>
      <div class="money">${money(a.balance)}</div>
      <div class="row">
      <small class="muted">Desde ${esc(a.created)}</small>
      <button class="btn ghost small" onclick="activeAccount='${a.id}';go('movimientos')">Movimientos</button>
      </div>
      </article>`).join('')}</div>
      <div class="notice">Tus cuentas y saldos son ficticios y solo se guardan en este navegador.</div>`}
function savingsPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">TUS PLANES, PASO A PASO</span>
      <h2>Espacios de ahorro</h2>
      </div>
      <button class="btn primary" onclick="modalSpace()">＋ Crear espacio</button>
      </div>
      <div class="panel" style="margin-bottom:17px">
      <div class="row">
      <div>
      <small class="muted">Total en tus espacios</small>
      <div style="font:700 28px Manrope;margin-top:4px">${money(state.spaces.reduce((s,x)=>s+x.saved,0))}</div>
      </div>
      <div class="f-icon">◉</div>
      </div>
      </div>
      <div class="spaces-grid">${state.spaces.map((s,i)=>`<article class="space-tile">
      <div class="row">
      <span class="f-icon" style="margin:0">${['✈','♧','🚙','✳'][i%4]}</span>
      <button class="icon-btn" onclick="spaceAction(${i})">•••</button>
      </div>
      <h3>${esc(s.name)}</h3>
      <div class="money">${money(s.saved)}</div>
      <div class="row">
      <small class="muted">Meta: ${money(s.goal)}</small>
      <b style="color:var(--green)">${Math.min(100,Math.round(s.saved/s.goal*100))}%</b>
      </div>
      <div class="progress">
      <i style="width:${Math.min(100,s.saved/s.goal*100)}%">
      </i>
      </div>
      <div class="row">
      <small class="muted">Objetivo ${esc(s.date||'Sin fecha')}</small>
      <button class="btn soft small" onclick="spaceAction(${i})">＋ Aportar</button>
      </div>
      </article>`).join('')}</div>
      <p class="notice">Programa de aportaciones y ahorros simulados. No se mueve dinero real.</p>`}
function movementsPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">CONOCE TU ACTIVIDAD</span>
      <h2>Movimientos</h2>
      </div>
      <button class="btn ghost" onclick="toast('Tu estado de cuenta está listo para descargar')">↓ Estado de cuenta</button>
      </div>
      <div class="panel">
      <div class="row" style="margin-bottom:17px">
      <div>
      <small class="muted">Ingresos del mes</small>
      <div class="positive amount" style="font-size:20px">${money(28500)}</div>
      </div>
      <div>
      <small class="muted">Gastos del mes</small>
      <div class="amount" style="font-size:20px">${money(2778.5)}</div>
      </div>
      <div>
      <small class="muted">Balance</small>
      <div class="amount" style="font-size:20px">${money(25721.5)}</div>
      </div>
      </div>
      <div class="filters">
      <input id="tx-search" placeholder="Buscar movimiento" oninput="filterTx()">
      <select id="tx-type" onchange="filterTx()">
      <option>Todos los tipos</option>${['Ingreso','Gasto','Transferencia','Depósito'].map(t=>`<option>${t}</option>`).join('')}</select>
      <select onchange="toast('Mostrando movimientos de '+this.value)">
      <option>Este mes</option>
      <option>Últimos 3 meses</option>
      <option>Todo el historial</option>
      </select>
      </div>
      <div id="tx-list" style="margin-top:13px">${txRows(state.transactions)}</div>
      </div>
      <div class="dashboard-grid page-panel">
      <div class="panel">
      <h3 class="panel-title">Actividad semanal</h3>
      <div class="bar-chart">${[35,62,48,77,42,67,83].map((h,i)=>`<div class="bar-group">
      <div class="bar ${i===6?'active':''}" style="height:${h}%">
      </div>
      <span class="bar-label">${['L','M','M','J','V','S','D'][i]}</span>
      </div>`).join('')}</div>
      </div>
      <div class="panel">
      <h3 class="panel-title">Tus categorías</h3>${[['Hogar',44],['Comida y bebida',28],['Compras',17],['Otros',11]].map(([n,p])=>`<div style="margin-top:17px">
      <div class="row">
      <small>${n}</small>
      <b>${p}%</b>
      </div>
      <div class="progress">
      <i style="width:${p}%">
      </i>
      </div>
      </div>`).join('')}</div>
      </div>`}
function transferPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">ENVÍA DINERO CON CLARIDAD</span>
      <h2>Transferir</h2>
      </div>
      </div>
      <div class="dashboard-grid">
      <div class="panel">
      <div class="eyebrow" style="margin-bottom:17px">NUEVA TRANSFERENCIA · PASO 1 DE 2</div>
      <form onsubmit="reviewTransfer(event)">
      <div class="form-grid">
      <div class="field full">
      <label>Cuenta de origen</label>
      <select name="from">${state.accounts.map(a=>`<option value="${a.id}">${esc(a.name)} · ${money(a.balance)}</option>`).join('')}</select>
      </div>
      <div class="field full">
      <label>Destinatario</label>
      <select id="recipient-select" onchange="selectRecipient(this.value)">
      <option value="">Agregar un destinatario nuevo</option>${state.recipients.map((r,i)=>`<option value="${i}">${esc(r.name)} · ${r.account.slice(-4)}</option>`).join('')}</select>
      </div>
      <div class="field">
      <label>Nombre</label>
      <input name="recipient" required placeholder="Nombre del destinatario">
      </div>
      <div class="field">
      <label>CLABE o cuenta</label>
      <input name="clabe" required minlength="10" placeholder="18 dígitos">
      </div>
      <div class="field">
      <label>Cantidad (MXN)</label>
      <input type="number" min="1" step="0.01" name="amount" required placeholder="$ 0.00">
      </div>
      <div class="field">
      <label>Concepto</label>
      <input name="concept" maxlength="40" placeholder="Ej. Renta octubre">
      </div>
      <div class="field full">
      <label>¿Guardar destinatario?</label>
      <select name="save">
      <option value="no">No, gracias</option>
      <option value="yes">Sí, agregar a frecuentes</option>
      </select>
      </div>
      </div>
      <div class="notice">Revisa cuidadosamente los datos antes de confirmar. Esta es una operación de demostración.</div>
      <div class="form-actions">
      <button class="btn primary">Revisar transferencia →</button>
      </div>
      </form>
      </div>
      <div>
      <div class="panel">
      <div class="section-head">
      <h3 class="panel-title">Frecuentes</h3>
      </div>${state.recipients.map(r=>`<div class="tx-row">
      <div class="tx-icon">${r.name[0]}</div>
      <div class="tx-desc">
      <b>${esc(r.name)}</b>
      <small>•••• ${r.account.slice(-4)}</small>
      </div>
      <button class="btn ghost small" onclick="prefill('${esc(r.name)}','${r.account}')">Elegir</button>
      </div>`).join('')||'<div class="empty">Tus destinatarios frecuentes aparecerán aquí.</div>'}</div>
      <div class="panel page-panel">
      <div class="section-head">
      <h3 class="panel-title">Recientes</h3>
      </div>${state.transfers.slice(-3).reverse().map(t=>`<div class="tx-row">
      <div class="tx-icon">↗</div>
      <div class="tx-desc">
      <b>${esc(t.recipient)}</b>
      <small>${esc(t.date)}</small>
      </div>
      <div class="amount">${money(t.amount)}</div>
      </div>`).join('')||'<div class="empty">Aún no tienes transferencias.</div>'}</div>
      </div>
      </div>`}
function depositPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">AGREGA DINERO A TU CUENTA</span>
      <h2>Depositar</h2>
      </div>
      </div>
      <div class="feature-grid" style="margin-bottom:20px">
      <article class="feature">
      <div class="f-icon">⇄</div>
      <h3>Transferencia SPEI</h3>
      <p>Usa tu CLABE para enviar dinero desde otra cuenta. El tiempo depende del banco de origen.</p>
      <button class="btn soft small" style="margin-top:15px" onclick="copyText('${account().clabe}')">Copiar mi CLABE</button>
      </article>
      <article class="feature">
      <div class="f-icon">▣</div>
      <h3>Depósito en efectivo</h3>
      <p>En establecimientos participantes, solicita un depósito a cuenta. Podrían aplicar comisiones.</p>
      <button class="btn ghost small" style="margin-top:15px" onclick="showDepositInstructions()">Ver instrucciones</button>
      </article>
      <article class="feature">
      <div class="f-icon">＋</div>
      <h3>Agregar saldo demo</h3>
      <p>Prueba la experiencia de depósito con fondos ficticios de demostración.</p>
      <button class="btn primary small" style="margin-top:15px" onclick="modalDeposit()">Simular depósito</button>
      </article>
      </div>
      <div class="panel">
      <div class="section-head">
      <h3 class="panel-title">Historial de depósitos</h3>
      <span class="pill">${state.deposits.length} depósitos</span>
      </div>${state.deposits.map(d=>`<div class="tx-row">
      <div class="tx-icon">＋</div>
      <div class="tx-desc">
      <b>${esc(d.method)}</b>
      <small>${esc(d.date)} · ${esc(d.status)}</small>
      </div>
      <div class="amount positive">+${money(d.amount)}</div>
      </div>`).join('')||'<div class="empty">Tus depósitos aparecerán aquí.</div>'}</div>
      <div class="notice">Los métodos de esta pantalla son informativos. No se acepta ni procesa dinero real.</div>`}
function converterPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">UNA REFERENCIA RÁPIDA</span>
      <h2>Conversor de monedas</h2>
      </div>
      </div>
      <div class="dashboard-grid">
      <section class="panel">
      <h3 class="panel-title">Equivalencia estimada</h3>
      <p class="muted" style="margin-top:7px">Visualiza el equivalente de tu saldo en otra moneda.</p>
      <div class="form-grid" style="margin-top:20px">
      <div class="field">
      <label>Desde</label>
      <select id="conv-from" onchange="convert()">${Object.keys(rates).map(c=>`<option ${c==='MXN'?'selected':''}>${c}</option>`).join('')}</select>
      </div>
      <div class="field">
      <label>Hacia</label>
      <select id="conv-to" onchange="convert()">${Object.keys(rates).map(c=>`<option ${c==='USD'?'selected':''}>${c}</option>`).join('')}</select>
      </div>
      <div class="field full">
      <label>Cantidad</label>
      <input id="conv-amount" type="number" value="${account().balance}" oninput="convert()">
      </div>
      </div>
      <div class="converter-result">
      <div class="muted">Equivalencia aproximada</div>
      <strong id="conv-result">—</strong>
      </div>
      <div class="notice">Este es un cálculo informativo usando los tipos de cambio de referencia indicados abajo. No es una conversión, compra, venta ni transferencia de fondos.</div>
      </section>
      <section class="panel">
      <h3 class="panel-title">Tipos de cambio de referencia</h3>
      <p class="muted">Valores ilustrativos para el prototipo · 10 oct 2026</p>${[['USD','Dólar estadounidense',17.24],['EUR','Euro',18.77],['BTC','Bitcoin',1115000],['ETH','Ethereum',39800]].map(([c,n,r])=>`<div class="tx-row">
      <div class="tx-icon">${currency[c]}</div>
      <div class="tx-desc">
      <b>${c} · ${n}</b>
      <small>1 ${c} = ${money(r)}</small>
      </div>
      </div>`).join('')}<div class="notice">Los precios de activos digitales son ficticios y no provienen de una API de mercado.</div>
      </section>
      </div>`}
function configPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">A TU MANERA</span>
      <h2>Configuración</h2>
      </div>
      </div>
      <div class="dashboard-grid">
      <div class="panel">
      <h3 class="panel-title">Tu perfil</h3>
      <form onsubmit="saveProfile(event)" style="margin-top:17px">
      <div class="form-grid">
      <div class="field full">
      <label>Nombre completo</label>
      <input name="name" value="${esc(state.user.name)}" required>
      </div>
      <div class="field full">
      <label>Correo electrónico</label>
      <input name="email" type="email" value="${esc(state.user.email)}" required>
      </div>
      <div class="field full">
      <label>Teléfono</label>
      <input name="phone" value="${esc(state.user.phone||'')}">
      </div>
      </div>
      <div class="form-actions">
      <button class="btn primary">Guardar cambios</button>
      </div>
      </form>
      </div>
      <div>
      <section class="panel">
      <h3 class="panel-title">Seguridad y preferencias</h3>
      <div class="tx-row">
      <div class="tx-icon">⌑</div>
      <div class="tx-desc">
      <b>Autenticación de dos pasos</b>
      <small>Agrega una capa adicional a tu cuenta</small>
      </div>
      <button class="btn soft small" onclick="toggleSetting(this)">Activar</button>
      </div>
      <div class="tx-row">
      <div class="tx-icon">▣</div>
      <div class="tx-desc">
      <b>Dispositivos conectados</b>
      <small>Este dispositivo · Activo ahora</small>
      </div>
      <button class="icon-btn" onclick="toast('Solo hay un dispositivo activo en esta demo')">›</button>
      </div>
      <div class="tx-row">
      <div class="tx-icon">♧</div>
      <div class="tx-desc">
      <b>Notificaciones</b>
      <small>Alertas de movimientos y seguridad</small>
      </div>
      <button class="btn ${state.notifications?'soft':'ghost'} small" onclick="state.notifications=!state.notifications;persist();render()">${state.notifications?'Activas':'Pausadas'}</button>
      </div>
      <div class="tx-row">
      <div class="tx-icon">◐</div>
      <div class="tx-desc">
      <b>Apariencia</b>
      <small>Preferencia de tema</small>
      </div>
      <button class="btn ghost small" onclick="toggleTheme()">${state.dark?'Oscuro':'Claro'}</button>
      </div>
      <div class="tx-row">
      <div class="tx-icon">⌑</div>
      <div class="tx-desc">
      <b>Cambiar contraseña</b>
      <small>Actualiza tu acceso</small>
      </div>
      <button class="btn ghost small" onclick="modalPassword()">Cambiar</button>
      </div>
      <div class="tx-row">
      <div class="tx-icon">♧</div>
      <div class="tx-desc">
      <b>Privacidad</b>
      <small>Controla tus datos y permisos</small>
      </div>
      <button class="icon-btn" onclick="toast('Tus datos de demostración se guardan solo en este navegador')">›</button>
      </div>
      </section>
      <section class="panel page-panel">
      <h3 class="panel-title">Sesión</h3>
      <p class="muted" style="margin-top:8px">¿Terminaste por ahora?</p>
      <button class="btn ghost" onclick="logout()">Cerrar sesión</button>
      </section>
      </div>
      </div>`}
function cardsPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">PAGA CON TRANQUILIDAD</span>
      <h2>Tarjetas</h2>
      </div>
      <button class="btn ghost" onclick="toast('Tu tarjeta física estará disponible próximamente')">＋ Solicitar tarjeta</button>
      </div>
      <div class="cards-grid">
      <section class="panel">
      <div class="row">
      <h3 class="panel-title">Tarjeta virtual</h3>
      <span class="pill">${state.cardLocked?'Bloqueada':'Activa'}</span>
      </div>
      <div style="background:${state.cardLocked?'#727e77':'#173e32'};color:#fff;padding:22px;border-radius:17px;margin:19px 0">
      <div class="row">
      <span class="brand" style="font-size:14px">r. RamirezBank</span>
      <span>◈</span>
      </div>
      <div style="margin:34px 0 17px;letter-spacing:.15em;font-size:17px">4829 &nbsp; 2031 &nbsp; 8870 &nbsp; 4829</div>
      <div class="row" style="font-size:10px;color:#c5d5cb">
      <span>MARIANA RAMIREZ</span>
      <span>VISA</span>
      </div>
      </div>
      <button class="btn ${state.cardLocked?'primary':'ghost'}" onclick="state.cardLocked=!state.cardLocked;persist();render();toast(state.cardLocked?'Tarjeta bloqueada':'Tarjeta desbloqueada')">${state.cardLocked?'Desbloquear tarjeta':'Bloquear tarjeta'}</button>
      <button class="btn ghost" style="margin-left:8px" onclick="toast('Datos ficticios: CVV ••• · Vence 08/28')">Ver datos</button>
      </section>
      <section class="panel">
      <h3 class="panel-title">Controles de tarjeta</h3>
      <div class="tx-row">
      <div class="tx-icon">⌁</div>
      <div class="tx-desc">
      <b>Compras en línea</b>
      <small>Permite pagos por internet</small>
      </div>
      <button class="btn soft small" onclick="toggleSetting(this)">Activado</button>
      </div>
      <div class="tx-row">
      <div class="tx-icon">◎</div>
      <div class="tx-desc">
      <b>Compras internacionales</b>
      <small>Controla pagos fuera de México</small>
      </div>
      <button class="btn ghost small" onclick="toggleSetting(this)">Desactivado</button>
      </div>
      <div class="tx-row">
      <div class="tx-icon">⌖</div>
      <div class="tx-desc">
      <b>Límite diario de compras</b>
      <small>$15,000 MXN · ficticio</small>
      </div>
      <button class="icon-btn" onclick="toast('Límite de demostración: $15,000 MXN diarios')">›</button>
      </div>
      <p class="notice">Tarjeta virtual de demostración. No puede utilizarse para pagar.</p>
      </section>
      </div>`}
function helpPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">ESTAMOS PARA AYUDARTE</span>
      <h2>Centro de ayuda</h2>
      </div>
      </div>
      <div class="dashboard-grid">
      <section class="panel">
      <h3 class="panel-title">¿Cómo podemos ayudarte?</h3>
      <div class="field" style="margin-top:17px">
      <input placeholder="Busca un tema" oninput="toast(this.value?'Buscando en ayuda…':'')">
      </div>${[['Transferencias','Consulta, envía y revisa comprobantes.'],['Seguridad','Protege tu cuenta y tus dispositivos.'],['Cuentas y saldos','Administra tus cuentas y tus datos.'],['Ahorro','Crea espacios y sigue tus metas.']].map(([a,b])=>`<div class="tx-row">
      <div class="tx-icon">?</div>
      <div class="tx-desc">
      <b>${a}</b>
      <small>${b}</small>
      </div>
      <button class="icon-btn" onclick="toast('Abriendo artículo: ${a}')">›</button>
      </div>`).join('')}</section>
      <section class="panel">
      <h3 class="panel-title">Contacta con nosotros</h3>
      <p class="muted" style="margin-top:10px">Nuestro equipo de soporte está aquí para orientarte.</p>
      <button class="btn primary" onclick="location.href='mailto:hola@ramirezbank.mx'">✉ Escribir a soporte</button>
      <p class="notice">hola@ramirezbank.mx<br>Lunes a viernes · 9:00 a 18:00 h<br>Las consultas del prototipo no se procesan.</p>
      </section>
      </div>`}
function notificationsPage(){return `<div class="section-head">
      <div>
      <span class="eyebrow">AL DÍA CON TU CUENTA</span>
      <h2>Notificaciones</h2>
      </div>
      <button class="btn ghost small" onclick="toast('Notificaciones marcadas como leídas')">Marcar todas como leídas</button>
      </div>
      <div class="panel">${[['↙','¡Tu nómina llegó!','Recibiste $28,500.00 MXN · Ayer'],['◉','Vas avanzando en tu meta','Tu espacio Viaje a Oaxaca llegó al 58% · Hace 2 días'],['🔒','Inicio de sesión seguro','Accediste desde este dispositivo · 9 oct 2026']].map(([i,h,d])=>`<div class="tx-row">
      <div class="tx-icon">${i}</div>
      <div class="tx-desc">
      <b>${h}</b>
      <small>${d}</small>
      </div>
      <span class="pill">Nueva</span>
      </div>`).join('')}</div>`}
// Renderizado de las vistas y navegación interna.
function render() {
  if (!logged) {
    document.querySelector('#app').innerHTML = page === 'auth' ? authView() : landing();
    renderSupportWidget();
    return;
  }

  document.querySelector('#app').innerHTML = shell();
  const pages = {
    inicio: home,
    cuentas: accountsPage,
    ahorro: savingsPage,
    movimientos: movementsPage,
    transferir: transferPage,
    depositar: depositPage,
    conversor: converterPage,
    config: configPage,
    tarjetas: cardsPage,
    ayuda: helpPage,
    notificaciones: notificationsPage,
  };
  document.querySelector('#content').innerHTML = (pages[page] || home)();
  convert();

  if (innerWidth < 700) {
    document.querySelector('#mobile-brand').style.display = 'flex';
    document.querySelector('.topbar .eyebrow').parentElement.style.display = 'none';
  }

  renderSupportWidget();
}
function go(p){page=p;render();window.scrollTo(0,0)}
function authView() {
  const registerFields = window.authMode === 'register'
    ? `
      <div class="field">
        <label>Nombre completo</label>
        <input name="name" required placeholder="Tu nombre">
      </div>
    `
    : '';
  const title = window.authMode === 'register' ? 'Tu nuevo comienzo' : 'Qué gusto verte';
  const description = window.authMode === 'register'
    ? 'Crea tu espacio RamirezBank en unos pasos.'
    : 'Inicia sesión para ver tu dinero con claridad.';
  const submitLabel = window.authMode === 'register' ? 'Crear cuenta' : 'Iniciar sesión';
  const switchMode = window.authMode === 'register' ? 'login' : 'register';
  const switchLabel = window.authMode === 'register' ? 'Iniciar sesión' : 'Crear cuenta';

  return `
    <div style="padding:22px">
      <button class="icon-btn" onclick="page='landing';render()">← Volver</button>
      <div class="auth-box">
        <div class="brand"><span class="brandmark">r.</span>RamirezBank</div>
        <h1>${title}</h1>
        <p class="muted">${description}</p>
        <form onsubmit="submitAuth(event)">
          ${registerFields}
          <div class="field">
            <label>Correo electrónico</label>
            <input name="email" type="email" required placeholder="tu@correo.com">
          </div>
          <div class="field">
            <label>Contraseña</label>
            <input name="password" type="password" required minlength="6" placeholder="Al menos 6 caracteres">
          </div>
          <button class="btn primary">${submitLabel}</button>
        </form>
        <div class="row" style="margin-top:16px">
          <button class="icon-btn" onclick="auth('forgot')">¿Olvidaste tu contraseña?</button>
          <button class="icon-btn" onclick="auth('${switchMode}')">${switchLabel}</button>
        </div>
        <p class="notice">Prototipo: puedes usar cualquier correo y contraseña. Los datos son ficticios y se guardan solo en este navegador.</p>
      </div>
    </div>
  `;
}
function auth(mode) {
  window.authMode = mode;
  page = 'auth';
  render();
}

function submitAuth(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  if (window.authMode === 'forgot') {
    toast('Si el correo está registrado, recibirás instrucciones (demo).');
    auth('login');
    return;
  }

  if (window.authMode === 'register') {
    state.user.name = form.get('name');
    state.user.email = form.get('email');
    state.accounts = [{ ...demo.accounts[0], balance: 0 }, ...state.accounts.slice(1)];
    persist();
  } else {
    state.user.email = form.get('email');
  }

  localStorage.setItem('rb-login', 'yes');
  logged = true;
  page = 'inicio';
  render();
  toast(window.authMode === 'register'
    ? '¡Tu cuenta de demostración está lista!'
    : '¡Bienvenida de nuevo!');
}

function logout() {
  logged = false;
  localStorage.removeItem('rb-login');
  page = 'landing';
  render();
  toast('Cerraste sesión correctamente');
}


// Formularios y operaciones simuladas.
function modal(title,body){document.querySelector('#modal-root').innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
      <section class="modal">
      <div class="modal-head">
      <h2>${title}</h2>
      <button class="icon-btn" onclick="closeModal()">✕</button>
      </div>${body}</section>
      </div>`}

function closeModal(){document.querySelector('#modal-root').innerHTML=''}

function modalAccount(){modal('Crear una cuenta',`<form onsubmit="createAccount(event)">
      <div class="field">
      <label>Nombre de la cuenta</label>
      <input name="name" required placeholder="Ej. Gastos del hogar">
      </div>
      <p class="notice">Se creará una cuenta ficticia con saldo inicial de $0 MXN.</p>
      <div class="form-actions">
      <button type="button" class="btn ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn primary">Crear cuenta</button>
      </div>
      </form>`)}

function createAccount(event) {
  event.preventDefault();
  const name = new FormData(event.target).get('name');
  const id = `a${Date.now()}`;
  const accountNumber = String(Math.floor(Math.random() * 8999) + 1000);
  const clabeSuffix = String(Math.floor(Math.random() * 89999) + 10000);

  state.accounts.push({
    id,
    name,
    number: `6461 •••• •••• ${accountNumber}`,
    clabe: `64618015700000${clabeSuffix}`,
    balance: 0,
    created: new Date().toLocaleDateString('es-MX'),
    status: 'Activa',
  });
  persist();
  activeAccount = id;
  closeModal();
  render();
  toast('Cuenta creada');
}


function modalSpace(){modal('Crear espacio de ahorro',`<form onsubmit="createSpace(event)">
      <div class="form-grid">
      <div class="field full">
      <label>Nombre de tu plan</label>
      <input name="name" required placeholder="Ej. Vacaciones">
      </div>
      <div class="field">
      <label>Meta (MXN)</label>
      <input name="goal" type="number" min="1" required placeholder="20000">
      </div>
      <div class="field">
      <label>Aportación inicial (MXN)</label>
      <input name="saved" type="number" min="0" value="0">
      </div>
      <div class="field full">
      <label>Fecha objetivo</label>
      <input name="date" type="date">
      </div>
      <div class="field full">
      <label>Aportación programada</label>
      <select name="schedule">
      <option>Sin programación</option>
      <option>Semanal</option>
      <option>Quincenal</option>
      <option>Mensual</option>
      </select>
      </div>
      </div>
      <div class="form-actions">
      <button type="button" class="btn ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn primary">Crear espacio</button>
      </div>
      </form>`)}

function createSpace(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.spaces.push({
    name: form.get('name'),
    goal: Number(form.get('goal')),
    saved: Number(form.get('saved')),
    date: form.get('date') || 'Sin fecha',
    schedule: form.get('schedule'),
  });
  persist();
  closeModal();
  render();
  toast('Espacio de ahorro creado');
}


function spaceAction(i){let s=state.spaces[i];modal(esc(s.name),`<p class="muted">${money(s.saved)} guardados de ${money(s.goal)} · ${Math.round(s.saved/s.goal*100)}% de avance</p>
      <form onsubmit="updateSpace(event,${i})">
      <div class="field">
      <label>Cantidad (MXN)</label>
      <input name="amount" type="number" min="1" step="0.01" required placeholder="0.00">
      </div>
      <div class="form-actions">
      <button type="button" class="btn ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn ghost" name="action" value="out" type="submit">Retirar</button>
      <button class="btn primary" name="action" value="in" type="submit">＋ Agregar</button>
      </div>
      </form>
      <p class="notice">Los movimientos son simulados y no afectan fondos reales.</p>`)}

function updateSpace(event, index) {
  event.preventDefault();
  const amount = Number(new FormData(event.target).get('amount'));
  const action = event.submitter.value;
  const space = state.spaces[index];

  if (action === 'out' && amount > space.saved) {
    toast('No hay suficiente saldo en este espacio', true);
    return;
  }

  space.saved += action === 'in' ? amount : -amount;
  persist();
  closeModal();
  render();
  toast(action === 'in' ? 'Aportación agregada' : 'Retiro realizado');
}


function reviewTransfer(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const details = Object.fromEntries(form);
  const sourceAccount = state.accounts.find((item) => item.id === details.from);

  if (Number(details.amount) > sourceAccount.balance) {
    toast('El saldo de la cuenta no es suficiente', true);
    return;
  }

  const encodedDetails = encodeURIComponent(JSON.stringify(details));
  modal('Revisa tu transferencia', `
    <div class="panel" style="background:#f8faf8;box-shadow:none">
      <div class="row"><span class="muted">A</span><b>${esc(details.recipient)}</b></div>
      <div class="row" style="margin-top:14px"><span class="muted">CLABE</span><b>${esc(details.clabe)}</b></div>
      <div class="row" style="margin-top:14px"><span class="muted">Desde</span><b>${esc(sourceAccount.name)}</b></div>
      <div class="row" style="margin-top:14px"><span class="muted">Concepto</span><b>${esc(details.concept || 'Sin concepto')}</b></div>
      <div style="text-align:center;padding:20px">
        <small class="muted">Importe</small>
        <div style="font:700 29px Manrope">${money(Number(details.amount))}</div>
      </div>
    </div>
    <p class="notice">Confirma solo si los datos son correctos. Transferencia ficticia de demostración.</p>
    <div class="form-actions">
      <button class="btn ghost" onclick="closeModal()">Editar</button>
      <button class="btn primary" onclick="confirmTransfer('${encodedDetails}')">Confirmar transferencia</button>
    </div>
  `);
}


function confirmTransfer(encodedDetails) {
  const details = JSON.parse(decodeURIComponent(encodedDetails));
  const sourceAccount = state.accounts.find((item) => item.id === details.from);
  const amount = Number(details.amount);

  if (amount > sourceAccount.balance) {
    closeModal();
    toast('El saldo ya no es suficiente', true);
    return;
  }

  sourceAccount.balance -= amount;
  const transfer = {
    recipient: details.recipient,
    amount,
    date: new Date().toLocaleString('es-MX'),
    concept: details.concept,
    reference: String(Math.floor(Math.random() * 900000000) + 100000000),
    clabe: details.clabe,
  };
  state.transfers.push(transfer);
  state.transactions.unshift({
    name: `Transferencia a ${details.recipient}`,
    category: 'Transferencia',
    date: 'Ahora',
    type: 'Transferencia',
    amount: -amount,
    icon: '↗',
  });

  if (details.save === 'yes' && !state.recipients.some((item) => item.account === details.clabe)) {
    state.recipients.push({ name: details.recipient, account: details.clabe });
  }

  persist();
  const receipt = state.transfers.at(-1);
  modal('Comprobante de transferencia', `
    <div style="text-align:center;padding:12px">
      <div style="font-size:38px;color:#36815c">✓</div>
      <h3>Transferencia realizada</h3>
      <strong style="font:700 29px Manrope">${money(amount)}</strong>
      <p class="muted">A ${esc(details.recipient)}</p>
    </div>
    <div class="panel" style="box-shadow:none;background:#f8faf8">
      <div class="row"><span class="muted">Concepto</span><b>${esc(details.concept || 'Sin concepto')}</b></div>
      <div class="row" style="margin-top:12px"><span class="muted">Referencia</span><b>${receipt.reference}</b></div>
      <div class="row" style="margin-top:12px"><span class="muted">Fecha</span><b>${receipt.date}</b></div>
    </div>
    <div class="form-actions">
      <button class="btn primary" onclick="closeModal();go('transferir')">Listo</button>
      <button class="btn ghost" onclick="toast('Comprobante guardado en esta demostración')">Compartir</button>
    </div>
    <p class="notice">Comprobante de demostración. No corresponde a una operación bancaria real.</p>
  `);
  render();
}


function selectRecipient(i){if(i==='')return;let r=state.recipients[+i];document.querySelector('[name=recipient]').value=r.name;document.querySelector('[name=clabe]').value=r.account}

function prefill(n,a){document.querySelector('[name=recipient]').value=n;document.querySelector('[name=clabe]').value=a;window.scrollTo({top:0,behavior:'smooth'});toast('Destinatario seleccionado')}
function modalDeposit(){modal('Simular depósito',`<form onsubmit="makeDeposit(event)">
      <div class="field">
      <label>Cuenta destino</label>
      <select name="account">${state.accounts.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select>
      </div>
      <div class="field" style="margin-top:13px">
      <label>Método</label>
      <select name="method">
      <option>Depósito de demostración</option>
      <option>Transferencia SPEI (simulada)</option>
      </select>
      </div>
      <div class="field" style="margin-top:13px">
      <label>Cantidad (MXN)</label>
      <input name="amount" type="number" min="1" required placeholder="1000">
      </div>
      <div class="form-actions">
      <button type="button" class="btn ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn primary">Confirmar depósito</button>
      </div>
      </form>
      <p class="notice">No se mueve dinero real.</p>`)}

function makeDeposit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const targetAccount = state.accounts.find((item) => item.id === form.get('account'));
  const amount = Number(form.get('amount'));

  targetAccount.balance += amount;
  state.deposits.push({
    method: form.get('method'),
    amount,
    date: new Date().toLocaleString('es-MX'),
    status: 'Completado · demo',
  });
  state.transactions.unshift({
    name: form.get('method'),
    category: 'Depósito',
    date: 'Ahora',
    type: 'Depósito',
    amount,
    icon: '＋',
  });

  persist();
  closeModal();
  render();
  toast('Depósito de demostración agregado');
}


function showDepositInstructions(){modal('Depósito en efectivo',`<p>En un servicio compatible, solicita un depósito a cuenta y proporciona la CLABE de tu cuenta RamirezBank.</p>
      <div class="panel" style="box-shadow:none;background:#f7faf7">
      <small class="muted">CLABE de ${esc(account().name)}</small>
      <div style="font-weight:700;margin:7px 0">${account().clabe}</div>
      </div>
      <p class="notice">Consulta las comisiones y límites directamente con el establecimiento. Las instrucciones son informativas; esta demo no recibe dinero.</p>
      <div class="form-actions">
      <button class="btn primary" onclick="closeModal()">Entendido</button>
      </div>`)}
function convert() {
  const amountInput = document.querySelector('#conv-amount');
  const fromCurrency = document.querySelector('#conv-from');
  const toCurrency = document.querySelector('#conv-to');
  const result = document.querySelector('#conv-result');
  if (!amountInput || !fromCurrency || !toCurrency || !result) return;

  const converted = (Number(amountInput.value) || 0)
    * rates[fromCurrency.value]
    / rates[toCurrency.value];
  result.textContent = fmt(converted, toCurrency.value);
}


function filterTx() {
  const query = document.querySelector('#tx-search').value.toLowerCase();
  const type = document.querySelector('#tx-type').value;
  const matches = state.transactions.filter((transaction) => {
    const matchesText = !query
      || transaction.name.toLowerCase().includes(query)
      || transaction.category.toLowerCase().includes(query);
    const matchesType = type === 'Todos los tipos' || transaction.type === type;
    return matchesText && matchesType;
  });

  document.querySelector('#tx-list').innerHTML = txRows(matches);
}


function copyText(value) {
  if (!navigator.clipboard) {
    toast(`CLABE: ${value}`);
    return;
  }

  navigator.clipboard.writeText(value)
    .then(() => toast('CLABE copiada'))
    .catch(() => toast(`CLABE: ${value}`));
}


function saveProfile(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.user.name = form.get('name');
  state.user.email = form.get('email');
  state.user.phone = form.get('phone');
  persist();
  render();
  toast('Perfil actualizado');
}


function toggleSetting(button) {
  const isActive = button.textContent.includes('Activado')
    || button.textContent.includes('Activar');
  button.textContent = isActive ? 'Desactivado' : 'Activado';
  button.classList.toggle('soft', !isActive);
  toast(isActive ? 'Preferencia desactivada' : 'Preferencia activada');
}


// Cambiar contraseña: flujo de demostración local, sin conexión a un servidor.
function modalPassword() {
  modal('Cambiar contraseña', `
    <form onsubmit="event.preventDefault();closeModal();toast('Contraseña de demostración actualizada')">
      <div class="field">
        <label>Contraseña actual</label>
        <input type="password" required>
      </div>
      <div class="field" style="margin-top:13px">
        <label>Nueva contraseña</label>
        <input type="password" required minlength="6">
      </div>
      <div class="field" style="margin-top:13px">
        <label>Confirmar contraseña</label>
        <input type="password" required minlength="6">
      </div>
      <div class="form-actions">
        <button class="btn ghost" type="button" onclick="closeModal()">Cancelar</button>
        <button class="btn primary">Actualizar</button>
      </div>
    </form>
    <p class="notice">El cambio se simula localmente y no se envía a un servidor.</p>
  `);
}

// Respuestas frecuentes de RamirezBank: todo el contenido es local y determinista.
const supportTopics = [
  {
    keywords: ['hola', 'buenas', 'saludo'],
    answer: '¡Hola! Soy el asistente de ayuda de RamirezBank. Puedo orientarte sobre acceso, cuentas, transferencias, depósitos, ahorro, tarjetas, movimientos y seguridad. Elige un tema o escribe tu pregunta.',
  },
  {
    keywords: ['crear cuenta', 'registro', 'registrarme', 'abrir cuenta', 'darme de alta'],
    answer: 'Para crear tu cuenta de demostración, pulsa “Crear cuenta” en la página principal. Ingresa nombre, correo y una contraseña de al menos 6 caracteres. No se verifica identidad ni se abre una cuenta bancaria real.',
  },
  {
    keywords: ['iniciar sesión', 'iniciar sesion', 'entrar', 'acceder', 'no puedo iniciar', 'login', 'acceso'],
    answer: 'Pulsa “Iniciar sesión” e ingresa tu correo y contraseña. Esta demo acepta datos ficticios y no comprueba credenciales con un servidor. Si olvidaste tu contraseña, elige “¿Olvidaste tu contraseña?” en el formulario.',
  },
  {
    keywords: ['olvidé mi contraseña', 'olvide mi contraseña', 'recuperar contraseña', 'restablecer contraseña', 'contraseña olvidada'],
    answer: 'En la pantalla de acceso selecciona “¿Olvidaste tu contraseña?”. El prototipo muestra el flujo de recuperación, pero no envía un correo ni cambia credenciales en un servidor.',
  },
  {
    keywords: ['cerrar sesión', 'cerrar sesion', 'salir', 'desconectar'],
    answer: 'Pulsa el icono de salida junto a tu perfil, o abre Configuración y selecciona “Cerrar sesión”. Se cerrará la sesión de demostración en este navegador.',
  },
  {
    keywords: ['editar perfil', 'cambiar nombre', 'cambiar correo', 'teléfono', 'telefono', 'perfil'],
    answer: 'Abre Configuración y edita nombre, correo o teléfono en “Tu perfil”. Pulsa “Guardar cambios”. Los datos se guardan solo localmente en este navegador.',
  },
  {
    keywords: ['ocultar saldo', 'mostrar saldo', 'ver saldo', 'saldo disponible', 'cuánto dinero', 'cuanto dinero', 'saldo'],
    answer: 'En Inicio, pulsa el icono de ojo en la tarjeta de cuenta para mostrar u ocultar el saldo. Los importes son ficticios y sirven solo para probar la interfaz.',
  },
  {
    keywords: ['clabe', 'número de cuenta', 'numero de cuenta', 'copiar cuenta', 'datos bancarios'],
    answer: 'En Inicio pulsa “Copiar CLABE” debajo de los datos de cuenta. También puedes consultar tus cuentas en “Mis cuentas”. Los números son ficticios: no los uses para enviar dinero.',
  },
  {
    keywords: ['crear otra cuenta', 'nueva cuenta', 'mis cuentas', 'cambiar de cuenta', 'cuentas adicionales', 'cuenta'],
    answer: 'En “Mis cuentas” puedes revisar nombre, saldo, número, fecha y estado. Usa “Nueva cuenta” para crear una cuenta de demostración y el selector de Inicio para cambiar entre ellas.',
  },
  {
    keywords: ['hacer transferencia', 'transferir dinero', 'enviar dinero', 'transferencia', 'transferir', 'destinatario', 'comprobante de transferencia'],
    answer: 'En “Transferir”, selecciona cuenta de origen, destinatario y CLABE; escribe cantidad y concepto. Revisa los datos y confirma para ver un comprobante de demostración. No se envía dinero real.',
  },
  {
    keywords: ['transferencia rechazada', 'transferencia fallida', 'transferencia pendiente', 'no llega transferencia', 'historial de transferencias'],
    answer: 'Las transferencias de la demo se reflejan de inmediato en el saldo ficticio y en Movimientos. Si no aparece, revisa la cuenta seleccionada y el historial. No hay conexión SPEI ni transferencias reales.',
  },
  {
    keywords: ['límite de transferencia', 'limite de transferencia', 'monto máximo', 'monto maximo'],
    answer: 'Este prototipo no envía dinero ni aplica límites bancarios reales. La transferencia simulada solo valida que el saldo ficticio cubra el importe.',
  },
  {
    keywords: ['depositar dinero', 'hacer depósito', 'hacer deposito', 'depósito en efectivo', 'deposito en efectivo', 'spei', 'depositar', 'depósito'],
    answer: 'En “Depositar” hay instrucciones informativas para SPEI y efectivo, y un botón para simular un depósito. La demo no recibe dinero ni se conecta a SPEI o a establecimientos.',
  },
  {
    keywords: ['historial de depósitos', 'historial de depositos', 'depósito no aparece', 'deposito no aparece'],
    answer: 'Los depósitos simulados aparecen en el historial de la sección “Depositar” y en “Movimientos”. No existe confirmación de depósitos bancarios reales en este prototipo.',
  },
  {
    keywords: ['crear espacio de ahorro', 'meta de ahorro', 'apartado', 'espacio de ahorro', 'ahorrar', 'aportación programada', 'aportacion programada', 'ahorro'],
    answer: 'En “Espacios de ahorro” crea un plan, elige meta, aportación inicial, frecuencia y fecha objetivo. Puedes ver el progreso y agregar o retirar saldo ficticio; no se aparta dinero real.',
  },
  {
    keywords: ['retirar ahorro', 'sacar dinero del ahorro', 'retirar de espacio'],
    answer: 'Abre el menú del espacio de ahorro y selecciona retirar. El retiro está limitado al saldo ficticio guardado en ese espacio y no afecta una cuenta bancaria real.',
  },
  {
    keywords: ['convertir moneda', 'tipo de cambio', 'dólar', 'dolar', 'euro', 'bitcoin', 'ethereum', 'criptomoneda', 'conversor', 'moneda'],
    answer: 'En “Conversor” puedes ver equivalencias entre MXN, USD, EUR, BTC y ETH. Los tipos de cambio son ilustrativos, no cotizaciones en tiempo real. Solo muestra un equivalente: no compra ni convierte fondos.',
  },
  {
    keywords: ['buscar movimiento', 'filtrar movimientos', 'categoría de gasto', 'categoria de gasto', 'ingresos y gastos', 'historial de movimientos', 'movimientos', 'movimiento'],
    answer: 'En “Movimientos” busca por comercio o categoría y filtra por tipo y periodo. También puedes revisar el resumen mensual, categorías y gráficas de actividad.',
  },
  {
    keywords: ['estado de cuenta', 'descargar estado'],
    answer: 'El botón de estado de cuenta muestra una confirmación visual, pero esta demo no genera ni descarga un documento bancario oficial.',
  },
  {
    keywords: ['tarjeta virtual', 'datos de tarjeta', 'cvv', 'pagar con tarjeta', 'tarjeta'],
    answer: 'En “Tarjetas” puedes ver la tarjeta virtual de demostración y sus controles. Sus datos son ficticios; no sirven para pagar ni retirar dinero.',
  },
  {
    keywords: ['bloquear tarjeta', 'desbloquear tarjeta', 'tarjeta perdida', 'perdí mi tarjeta', 'perdi mi tarjeta'],
    answer: 'En “Tarjetas” pulsa “Bloquear tarjeta” o “Desbloquear tarjeta” para cambiar el estado visual. La acción no bloquea una tarjeta bancaria real.',
  },
  {
    keywords: ['notificaciones', 'notificación', 'notificacion', 'alertas', 'avisos'],
    answer: 'Abre el icono de notificaciones para revisar avisos de ejemplo. En Configuración puedes activar o pausar la preferencia; no se envían alertas reales.',
  },
  {
    keywords: ['cambiar contraseña', 'nueva contraseña', 'cambiar password', 'contraseña'],
    answer: 'En Configuración, dentro de Seguridad y preferencias, pulsa “Cambiar contraseña”. El formulario es demostrativo y no actualiza credenciales en un servidor.',
  },
  {
    keywords: ['autenticación de dos factores', 'autenticacion de dos factores', 'dos pasos', '2fa'],
    answer: 'La opción de autenticación de dos pasos en Configuración solo cambia la preferencia visual. No se envían códigos ni se activa una protección real en este prototipo.',
  },
  {
    keywords: ['dispositivo conectado', 'dispositivos', 'sesiones activas', 'perdí mi teléfono', 'perdi mi telefono', 'dispositivo'],
    answer: 'Configuración muestra este dispositivo como activo en la demostración. No hay gestión de sesiones de servidor ni forma de cerrar remotamente otros dispositivos.',
  },
  {
    keywords: ['mis datos', 'privacidad', 'seguridad', 'datos reales', 'es real', 'dinero real'],
    answer: 'RamirezBank aquí es un prototipo: saldos, cuentas, destinatarios y operaciones son ficticios. Algunas preferencias se guardan localmente en tu navegador. No ingreses datos bancarios reales.',
  },
  {
    keywords: ['comisiones', 'comisión', 'comision', 'costo', 'cuánto cuesta', 'cuanto cuesta', 'es gratis'],
    answer: 'La demo no cobra ni procesa operaciones. Los costos, comisiones y condiciones de un producto bancario real dependerían de los servicios que se integren posteriormente.',
  },
  {
    keywords: ['préstamo', 'prestamo', 'crédito', 'credito', 'cuenta empresarial', 'retirar efectivo', 'cajero'],
    answer: 'Los préstamos, cuentas empresariales y retiros de efectivo no están disponibles en este prototipo. La interfaz actual es una demostración y no ofrece productos bancarios reales.',
  },
  {
    keywords: ['contactar soporte', 'contacto', 'hablar con alguien', 'soporte', 'ayuda humana', 'ayuda'],
    answer: 'Puedes abrir el Centro de ayuda desde el menú y usar el contacto de ejemplo hola@ramirezbank.mx. Este correo es ilustrativo y el prototipo no garantiza atención real. Nunca compartas contraseñas ni códigos.',
  },
  {
    keywords: ['error', 'no funciona', 'problema', 'pantalla en blanco', 'se trabó', 'se trabo'],
    answer: 'Si algo no responde, actualiza la página y vuelve a intentarlo. Para ayudarte mejor, dime si el problema es con acceso, cuentas, transferencias, depósitos, ahorro o tarjeta. No compartas datos confidenciales.',
  },
];

function normalizeSupport(value) {
  return String(value)
    .toLocaleLowerCase('es-MX')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
    .trim();
}

// Para integrar IA después, reemplaza answer() por un adaptador de servicio.
// Hoy mode='rules': nunca hace solicitudes de red ni genera respuestas con IA.
const supportAdapter = {
  mode: 'rules',
  answer(question) {
    const query = normalizeSupport(question);
    const matches = supportTopics.flatMap((topic) => topic.keywords
      .map((keyword) => ({ topic, keyword: normalizeSupport(keyword) }))
      .filter(({ keyword }) => query.includes(keyword)));
    matches.sort((first, second) => second.keyword.length - first.keyword.length);

    return matches[0]?.topic.answer
      || 'No encontré una respuesta exacta. Puedo orientarte sobre registro, acceso, cuentas, transferencias, depósitos, ahorro, monedas, movimientos, tarjetas, seguridad, privacidad y soporte. Prueba con una pregunta más específica o abre el Centro de ayuda.';
  },
};

let supportOpen = false;
let supportMessages = [];

function renderSupportWidget() {
  const root = document.querySelector('#support-widget');
  if (!root) return;

  const suggestions = ['Transferencias', 'Depósitos', 'Ahorro', 'Acceso y contraseña'];
  const messageMarkup = supportMessages.length
    ? supportMessages.map((message) => `
      <div class="support-message ${message.from === 'user' ? 'user' : 'bot'}">${esc(message.text)}</div>
    `).join('')
    : `
      <div class="support-message bot">¡Hola! Soy el asistente de ayuda de RamirezBank. Estoy aquí para orientarte sobre la app.</div>
      <div class="support-message bot">Elige un tema o escribe tu duda. Mis respuestas son automáticas y no usan IA.</div>
    `;

  root.innerHTML = `
    ${supportOpen ? `
      <section class="support-window" role="dialog" aria-label="Chat de ayuda RamirezBank">
        <header class="support-header">
          <span class="support-mark">r.</span>
          <div>
            <b>Ayuda RamirezBank</b>
            <small>Respuestas rápidas · Disponible ahora</small>
          </div>
          <button class="support-close" aria-label="Cerrar chat" onclick="supportOpen=false;renderSupportWidget()">×</button>
        </header>
        <div class="support-messages" id="support-messages" aria-live="polite">${messageMarkup}</div>
        <div class="support-suggestions">
          ${suggestions.map((suggestion) => `
            <button type="button" onclick="askSupport('${suggestion}')">${suggestion}</button>
          `).join('')}
        </div>
        <form class="support-form" onsubmit="sendSupport(event)">
          <input name="question" aria-label="Escribe tu pregunta" placeholder="Escribe tu pregunta…" maxlength="300" autocomplete="off" required>
          <button aria-label="Enviar mensaje">Enviar</button>
        </form>
        <div class="support-footnote">Asistente automático · No compartas contraseñas ni códigos</div>
      </section>
    ` : ''}
    <button class="support-launcher" aria-label="Abrir chat de ayuda" aria-expanded="${supportOpen}" onclick="supportOpen=!supportOpen;renderSupportWidget();document.querySelector('#support-messages')?.scrollTo(0,9999)">
      <span class="support-mark">✳</span>
      <span>${supportOpen ? 'Cerrar ayuda' : '¿Te ayudamos?'}</span>
    </button>
  `;
}

function addSupportMessage(from, text) {
  supportMessages.push({ from, text });
  if (supportMessages.length > 40) supportMessages = supportMessages.slice(-40);
}

function askSupport(question) {
  addSupportMessage('user', question);
  addSupportMessage('bot', supportAdapter.answer(question));
  renderSupportWidget();
  document.querySelector('#support-messages')?.scrollTo(0, 9999);
}

function sendSupport(event) {
  event.preventDefault();
  const input = event.currentTarget.elements.question;
  const question = input.value.trim();
  if (!question) return;
  askSupport(question);
}

function applyTheme() {
  document.documentElement.style.setProperty('--bg', state.dark ? '#111b16' : '#f5f7f5');
  document.documentElement.style.setProperty('--paper', state.dark ? '#1b2821' : '#fff');
  document.documentElement.style.setProperty('--ink', state.dark ? '#e9f0ea' : '#1b2b25');
  document.documentElement.style.setProperty('--line', state.dark ? '#2b3930' : '#e9eeea');
}

function toggleTheme() {
  state.dark = !state.dark;
  applyTheme();
  persist();
  toast(state.dark ? 'Tema oscuro activado' : 'Tema claro activado');
}
applyTheme();
render();
