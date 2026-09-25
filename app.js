/* ===== Utilidades Pequeños Genios (mejoras) ===== */
const PG = {
  scores: JSON.parse(localStorage.getItem('pg_scores') || '{}'),
  medals: JSON.parse(localStorage.getItem('pg_medals') || '{}'),
  save() {
    localStorage.setItem('pg_scores', JSON.stringify(this.scores));
    localStorage.setItem('pg_medals', JSON.stringify(this.medals));
    this.renderMedals();
  },
  toast(msg, ms=2600) {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._tt);
    this._tt = setTimeout(() => t.classList.remove('show'), ms);
  },
  confetti(n=40) {
    const colors = ['#ffd23f','#ff8a3d','#4dd8ff','#ff4d5e','#4ade80','#fef8ec'];
    for(let i=0;i<n;i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random()*100 + 'vw';
      p.style.background = colors[i%colors.length];
      p.style.width = (6+Math.random()*8)+'px';
      p.style.height = (6+Math.random()*8)+'px';
      p.style.borderRadius = Math.random()>.5 ? '50%' : '2px';
      document.body.appendChild(p);
      const dx = (Math.random()-0.5)*200;
      const dy = 400 + Math.random()*500;
      const rot = Math.random()*720;
      p.animate([
        { transform:'translate(0,0) rotate(0)', opacity:1 },
        { transform:`translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity:0 }
      ], { duration: 1200+Math.random()*900, easing:'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
    }
  },
  // Web Audio beeps (no external files)
  _ac: null,
  tone(freq=880, dur=0.12, type='sine', vol=0.08) {
    try {
      if(!this._ac) this._ac = new (window.AudioContext||window.webkitAudioContext)();
      const o = this._ac.createOscillator();
      const g = this._ac.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g); g.connect(this._ac.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, this._ac.currentTime + dur);
      o.stop(this._ac.currentTime + dur + 0.02);
    } catch(e){}
  },
  sfxOk(){ this.tone(880,0.1); setTimeout(()=>this.tone(1175,0.12),90); },
  sfxBad(){ this.tone(220,0.18,'square',0.06); },
  sfxWin(){ this.tone(523,0.1); setTimeout(()=>this.tone(659,0.1),100); setTimeout(()=>this.tone(784,0.18),200); },
  award(medalId, label) {
    if(this.medals[medalId]) return;
    this.medals[medalId] = true;
    this.save();
    this.toast('🏅 ¡Medalla desbloqueada! ' + label);
    this.confetti(55);
    this.sfxWin();
  },
  renderMedals() {
    const bar = document.getElementById('medalBar');
    if(!bar) return;
    const defs = [
      {id:'memo', label:'Memoria', emoji:'🧠'},
      {id:'circuito', label:'Circuito', emoji:'🔌'},
      {id:'polar', label:'Polaridad', emoji:'🔋'},
      {id:'cables', label:'Cables', emoji:'🔗'},
      {id:'quiz', label:'Quiz', emoji:'🏆'},
      {id:'lab', label:'Laboratorio', emoji:'⚡'},
      {id:'ohm', label:'Ohm', emoji:'📐'}
    ];
    bar.innerHTML = defs.map(d => 
      `<div class="medal ${this.medals[d.id]?'earned':''}" title="${d.label}"><span>${d.emoji}</span>${d.label}</div>`
    ).join('');
  }
};
window.PG = PG;
document.addEventListener('DOMContentLoaded', () => PG.renderMedals());

/* ============================================================
   DATA: componentes con SVG inline (sin imágenes externas)
   ============================================================ */
const ICONS = {
  resistencia: `<svg viewBox="0 0 64 64" aria-label="Símbolo de resistencia">
    <polyline points="4,32 12,32 17,20 25,44 33,20 41,44 47,32 60,32" fill="none" stroke="#ff8a3d" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`,
  led: `<svg viewBox="0 0 64 64" aria-label="Símbolo de LED">
    <line x1="4" y1="32" x2="20" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <polygon points="20,16 20,48 44,32" fill="none" stroke="#ff4d5e" stroke-width="3" stroke-linejoin="round"/>
    <line x1="44" y1="16" x2="44" y2="48" stroke="#ff4d5e" stroke-width="3"/>
    <line x1="44" y1="32" x2="60" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <g stroke="#ff4d5e" stroke-width="2" fill="none" stroke-linecap="round">
      <line x1="34" y1="12" x2="42" y2="4"/><polyline points="35,4 42,4 42,11"/>
      <line x1="42" y1="18" x2="50" y2="10"/><polyline points="43,10 50,10 50,17"/>
    </g>
  </svg>`,
  bateria: `<svg viewBox="0 0 64 64" aria-label="Símbolo de pila">
    <line x1="4" y1="32" x2="20" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <line x1="20" y1="14" x2="20" y2="50" stroke="#ff8a3d" stroke-width="3"/>
    <line x1="28" y1="22" x2="28" y2="42" stroke="#ff8a3d" stroke-width="6"/>
    <line x1="28" y1="32" x2="36" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <line x1="36" y1="14" x2="36" y2="50" stroke="#ff8a3d" stroke-width="3"/>
    <line x1="44" y1="22" x2="44" y2="42" stroke="#ff8a3d" stroke-width="6"/>
    <line x1="44" y1="32" x2="60" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <text x="14" y="11" fill="#fef8ec" font-size="11">+</text>
    <text x="50" y="11" fill="#fef8ec" font-size="11">−</text>
  </svg>`,
  interruptor: `<svg viewBox="0 0 64 64" aria-label="Símbolo de interruptor">
    <line x1="4" y1="42" x2="16" y2="42" stroke="#ffd23f" stroke-width="3"/>
    <circle cx="16" cy="42" r="4" fill="#ff8a3d"/>
    <circle cx="48" cy="42" r="4" fill="#ff8a3d"/>
    <line x1="48" y1="42" x2="60" y2="42" stroke="#ffd23f" stroke-width="3"/>
    <line x1="16" y1="42" x2="43" y2="20" stroke="#ff8a3d" stroke-width="3"/>
  </svg>`,
  capacitor: `<svg viewBox="0 0 64 64" aria-label="Símbolo de capacitor electrolítico">
    <line x1="6" y1="32" x2="26" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <line x1="26" y1="16" x2="26" y2="48" stroke="#4dd8ff" stroke-width="4"/>
    <path d="M38 16 Q34 32 38 48" fill="none" stroke="#4dd8ff" stroke-width="4"/>
    <line x1="38" y1="32" x2="58" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <text x="19" y="11" fill="#fef8ec" font-size="10">+</text>
  </svg>`,
  ldr: `<svg viewBox="0 0 64 64" aria-label="Símbolo de LDR">
    <polyline points="4,34 10,34 15,24 22,42 29,24 36,42 41,34 48,34" fill="none" stroke="#4dd8ff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <g stroke="#ffd23f" stroke-width="2" fill="none" stroke-linecap="round">
      <line x1="12" y1="8" x2="22" y2="18"/><polyline points="14,18 22,18 22,10"/>
      <line x1="22" y1="5" x2="32" y2="15"/><polyline points="24,15 32,15 32,7"/>
    </g>
  </svg>`,
  buzzer: `<svg viewBox="0 0 64 64" aria-label="Símbolo de buzzer">
    <line x1="4" y1="46" x2="16" y2="46" stroke="#ffd23f" stroke-width="3"/>
    <line x1="16" y1="46" x2="16" y2="52" stroke="#ffd23f" stroke-width="3"/>
    <circle cx="30" cy="34" r="20" fill="none" stroke="#ff8a3d" stroke-width="3"/>
    <path d="M40 22 Q50 34 40 46" fill="none" stroke="#4dd8ff" stroke-width="3"/>
    <path d="M46 16 Q60 34 46 52" fill="none" stroke="#4dd8ff" stroke-width="2"/>
  </svg>`,
  motor: `<svg viewBox="0 0 64 64" aria-label="Símbolo de motor DC">
    <line x1="4" y1="32" x2="14" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <line x1="50" y1="32" x2="60" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="#ff8a3d" stroke-width="3"/>
    <text x="32" y="39" text-anchor="middle" fill="#fef8ec" font-size="16" font-family="monospace">M</text>
  </svg>`,
  potenciometro: `<svg viewBox="0 0 64 64" aria-label="Símbolo de potenciómetro">
    <polyline points="4,40 10,40 15,30 22,48 29,30 36,48 41,40 48,40" fill="none" stroke="#ff8a3d" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <line x1="26" y1="10" x2="26" y2="30" stroke="#4dd8ff" stroke-width="3"/>
    <polygon points="19,16 26,6 33,16" fill="#4dd8ff"/>
  </svg>`,
  transistor: `<svg viewBox="0 0 64 64" aria-label="Símbolo de transistor NPN">
    <circle cx="32" cy="32" r="22" fill="none" stroke="#ff8a3d" stroke-width="3"/>
    <line x1="6" y1="32" x2="20" y2="32" stroke="#ffd23f" stroke-width="3"/>
    <line x1="20" y1="18" x2="20" y2="46" stroke="#ffd23f" stroke-width="3"/>
    <line x1="20" y1="24" x2="42" y2="12" stroke="#ffd23f" stroke-width="3"/>
    <line x1="42" y1="12" x2="42" y2="4" stroke="#ffd23f" stroke-width="3"/>
    <line x1="20" y1="40" x2="42" y2="52" stroke="#ffd23f" stroke-width="3"/>
    <line x1="42" y1="52" x2="42" y2="60" stroke="#ffd23f" stroke-width="3"/>
    <polygon points="34,44 43,53 32,49" fill="#ffd23f"/>
  </svg>`
,
  jumper: `<svg viewBox='0 0 64 64'><path d='M10 46 C10 16 54 16 54 46' fill='none' stroke='#ffd23f' stroke-width='4'/><circle cx='10' cy='46' r='5' fill='#ff8a3d'/><circle cx='54' cy='46' r='5' fill='#ff8a3d'/></svg>`,
  pulsador: `<svg viewBox='0 0 64 64'><line x1='5' y1='44' x2='20' y2='44' stroke='#ffd23f' stroke-width='3'/><line x1='44' y1='44' x2='59' y2='44' stroke='#ffd23f' stroke-width='3'/><circle cx='20' cy='44' r='4' fill='#ff8a3d'/><circle cx='44' cy='44' r='4' fill='#ff8a3d'/><line x1='20' y1='44' x2='44' y2='44' stroke='#4dd8ff' stroke-width='3'/><line x1='32' y1='44' x2='32' y2='20' stroke='#ff8a3d' stroke-width='4'/><circle cx='32' cy='17' r='5' fill='#ff8a3d'/></svg>`,
  fusible: `<svg viewBox='0 0 64 64'><line x1='5' y1='32' x2='18' y2='32' stroke='#ffd23f' stroke-width='3'/><rect x='18' y='22' width='28' height='20' rx='5' fill='none' stroke='#ff8a3d' stroke-width='3'/><line x1='24' y1='32' x2='40' y2='32' stroke='#4dd8ff' stroke-width='3'/><line x1='46' y1='32' x2='59' y2='32' stroke='#ffd23f' stroke-width='3'/></svg>`,
  rele: `<svg viewBox='0 0 64 64'><rect x='12' y='12' width='40' height='40' rx='6' fill='none' stroke='#ff8a3d' stroke-width='3'/><path d='M18 40 Q26 24 34 40' fill='none' stroke='#4dd8ff' stroke-width='3'/><line x1='34' y1='40' x2='48' y2='22' stroke='#ffd23f' stroke-width='3'/></svg>`,
  diodo: `<svg viewBox='0 0 64 64'><line x1='5' y1='32' x2='20' y2='32' stroke='#ffd23f' stroke-width='3'/><polygon points='20,16 20,48 44,32' fill='none' stroke='#4dd8ff' stroke-width='3'/><line x1='44' y1='16' x2='44' y2='48' stroke='#ff8a3d' stroke-width='4'/><line x1='44' y1='32' x2='59' y2='32' stroke='#ffd23f' stroke-width='3'/></svg>`,
  transformador: `<svg viewBox='0 0 64 64'><path d='M8 20 Q16 26 8 32 Q16 38 8 44' fill='none' stroke='#4dd8ff' stroke-width='3'/><path d='M56 20 Q48 26 56 32 Q48 38 56 44' fill='none' stroke='#4dd8ff' stroke-width='3'/><line x1='24' y1='12' x2='24' y2='52' stroke='#ff8a3d' stroke-width='3'/><line x1='40' y1='12' x2='40' y2='52' stroke='#ff8a3d' stroke-width='3'/></svg>`,
  microcontrolador: `<svg viewBox='0 0 64 64'><rect x='16' y='16' width='32' height='32' rx='4' fill='none' stroke='#ff8a3d' stroke-width='3'/><text x='32' y='37' text-anchor='middle' fill='#ffd23f' font-size='11' font-family='monospace'>MCU</text><g stroke='#4dd8ff' stroke-width='3'><line x1='8' y1='22' x2='16' y2='22'/><line x1='8' y1='32' x2='16' y2='32'/><line x1='8' y1='42' x2='16' y2='42'/><line x1='48' y1='22' x2='56' y2='22'/><line x1='48' y1='32' x2='56' y2='32'/><line x1='48' y1='42' x2='56' y2='42'/></g></svg>`

};

const COMPONENTS = [
{id:'resistencia', name:'Resistencia', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9ECckDic6UWG2czLkKyiLmX_h4uKFjBoNUm0YxA5ALQ&s=10',
 figure:'Figura 1. Resistencia',
 desc:'Se opone al paso de la corriente eléctrica (se mide en ohms Ω). Se usa para proteger componentes como el LED de corrientes muy altas.'},
{id:'led', name:'LED', pol:true,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkjgqrqza2pYjGnt6KtZBfbhZVT0R63av6oJd71OHfKw&s=10',
 figure:'Figura 2. LED',
 desc:'Diodo que emite luz cuando la corriente pasa en el sentido correcto. Tiene pata larga (+) y pata corta (−). ¡No lo conectes al revés!'},
{id:'capacitor', name:'Capacitor', pol:'mixed',
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVpaKlvEMAbaPfWEVHcWDcVv69sBeuMMwiKm1BJ66hkg&s=10',
 figure:'Figura 3. Capacitor',
 desc:'Almacena energía eléctrica un rato. Los electrolíticos SÍ son polarizados (tienen + y −). Los cerámicos y de poliéster NO son polarizados.'},
{id:'transistor', name:'Transistor', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFuFLW-9ZPDbd3I4iDvjUnEydc9NgA8S7tkzGDdgNRtw&s=10',
 figure:'Figura 4. Transistor',
 desc:'Tiene 3 patas (emisor, base y colector). Sirve como interruptor o amplificador controlado por una pequeña corriente.'},
{id:'ldr', name:'LDR (Fotoresistencia)', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSnxR62BeaY4Re-NIdcLIkybvi6wpcEWV9LzIB8UIn6g&s=10',
 figure:'Figura 5. LDR',
 desc:'Su resistencia cambia según la luz: con mucha luz baja la resistencia; en la oscuridad sube. Ideal para sensores de día/noche.'},
{id:'jumper', name:'Jumpers', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD0rFENPIwa0Er1HpJJlQzdbNreRVhpdB65AEdEKxyjA&s=10',
 figure:'Figura 6. Jumpers',
 desc:'Cables cortos para conectar componentes en la protoboard sin soldar. Permiten armar y desarmar circuitos rápido.'},
{id:'pulsador', name:'Pulsador', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvxjcXa_OdcZ6295-1Bt1FaQMk7SSf69D9mT5tK9mK6A&s=10',
 figure:'Figura 7. Pulsador',
 desc:'Cierra el circuito solo mientras lo mantienes presionado. Al soltar, se abre otra vez.'},
{id:'interruptor', name:'Interruptor', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFrH-czBDOFBEc0i9ZfuUZa_UzHfGqKcvqhHxNM7-9pw&s=10',
 figure:'Figura 8. Interruptor',
 desc:'Abre o cierra el circuito y se queda en esa posición hasta que lo cambies. Como el switch de la luz de tu casa.'},
{id:'buzzer', name:'Buzzer (Zumbador)', pol:true,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRPRt1f02brwlBtcjQXF1sfMzPRo30tVRAIqeQl8hF1g&s=10',
 figure:'Figura 9. Buzzer',
 desc:'Emite un sonido cuando recibe corriente. Muchos buzzers activos tienen polaridad (+ y −).'},
{id:'motor', name:'Motor DC', pol:true,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLeFKBM-hdyypYqZQf5jlKzrf3usja74FB6joBtGOd9g&s=10',
 figure:'Figura 10. Motor DC',
 desc:'Convierte electricidad en movimiento (gira). Si inviertes los cables, gira al revés.'},
{id:'bateria', name:'Batería / Pila', pol:true,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqcgXX2MPCBllLmBkXtM632h--FZcqjsIhgHjtxcxZ7w&s=10',
 figure:'Figura 11. Batería',
 desc:'Fuente de energía del circuito. Tiene polo positivo (+) y negativo (−). Nunca la cortocircuites.'},
{id:'potenciometro', name:'Potenciómetro', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9t-CxqhqwMEKRX1JpTNem2CWs6pqRXUmvt1RQsFx6cw&s=10',
 figure:'Figura 12. Potenciómetro',
 desc:'Resistencia variable: al girar el eje cambias cuánta corriente deja pasar. Sirve para volumen o brillo.'},
{id:'fusible', name:'Fusible', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvHrHl8lN8STBizvdOf_fGRTIXDXXKBsXzV6ZcXsTf4g&s=10',
 figure:'Figura 13. Fusible',
 desc:'Protección: si pasa demasiada corriente, se funde y abre el circuito para evitar daños o incendios.'},
{id:'rele', name:'Relé', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT62XvFFdHFPjT9t4FUuxGuffEauBB4WoR0y3MCk_E3yQ&s=10',
 figure:'Figura 14. Relé',
 desc:'Interruptor electromagnético: una corriente pequeña controla otra más grande (por ejemplo, un motor).'},
{id:'diodo', name:'Diodo rectificador', pol:true,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5gIXYddxsXJXBd9Iq14l0dvKXo-DWYe9bs1R3eR1oFg&s=10',
 figure:'Figura 15. Diodo',
 desc:'Deja pasar la corriente solo en un sentido (del ánodo al cátodo). El LED es un tipo especial de diodo.'},
{id:'transformador', name:'Transformador', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk2THA4dzoV-_aTMc6FIt2Ke_1qF2MiZjKvrMlOPlVfA&s=10',
 figure:'Figura 16. Transformador',
 desc:'Sube o baja el voltaje en corriente alterna (AC). Se usa en cargadores y fuentes de alimentación.'},
{id:'microcontrolador', name:'Microcontrolador', pol:false,
 image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbCbuTRrFEy_UGEunifS3cmv1eBAQU0YM3JrD0LaDw5w&s=10',
 figure:'Figura 17. Microcontrolador',
 desc:'Cerebro programable del circuito (como Arduino). Ejecuta instrucciones y controla LEDs, motores y sensores.'}
];

const SYMBOL_LABELS = {
  resistencia:'R', led:'LED', capacitor:'C', transistor:'Q', ldr:'LDR', jumper:'J',
  pulsador:'PB', interruptor:'SW', buzzer:'BZ', motor:'M', bateria:'B', potenciometro:'POT',
  fusible:'F', rele:'K', diodo:'D', transformador:'T', microcontrolador:'MCU'
};

/* ============================================================
   FONDO: pulsos de corriente viajando por la pantalla
   ============================================================ */
(function spawnPulses(){
  const layer = document.getElementById('pulseLayer');
  const colors = ['', 'blue', 'red'];
  for(let i=0;i<16;i++){
    const p = document.createElement('div');
    const c = colors[i % colors.length];
    p.className = 'pulse ' + c;
    p.style.top = (6 + Math.random()*88) + 'vh';
    p.style.animationDuration = (6 + Math.random()*9) + 's';
    p.style.animationDelay = (-Math.random()*10) + 's';
    layer.appendChild(p);
  }
})();
(function spawnDrift(){
  const layer = document.getElementById('driftLayer');
  const icons = ['⚡','🔋','💡','🔌','🧲','⚙️','📡','🔧'];
  for(let i=0;i<14;i++){
    const d = document.createElement('div');
    d.className = 'drift-icon';
    d.textContent = icons[i % icons.length];
    d.style.left = (Math.random()*96) + 'vw';
    d.style.fontSize = (18 + Math.random()*22) + 'px';
    d.style.animationDuration = (14 + Math.random()*16) + 's';
    d.style.animationDelay = (-Math.random()*20) + 's';
    layer.appendChild(d);
  }
})();

/* ============================================================
   CENTRO DE TEORÍA — un set de contenido por nivel
   ============================================================ */
const THEORY_PRIMARIA = [
  {
    title:'Ley de Ohm: la fórmula mágica',
    body:`<p>La <b>Ley de Ohm</b> nos dice cómo se relacionan tres cosas en un circuito:</p>
      <p style="text-align:center; font-size:1.4rem; font-weight:800; color:#ffd23f; margin:14px 0;">I = V ÷ R</p>
      <ul style="margin:10px 0 10px 20px; line-height:1.7;">
        <li><b>V</b> = Voltaje (la “fuerza” de la pila, en voltios)</li>
        <li><b>R</b> = Resistencia (lo que frena la corriente, en ohms Ω)</li>
        <li><b>I</b> = Corriente (cuánta electricidad pasa, en amperios o mA)</li>
      </ul>
      <p>Imagina el voltaje como la presión del agua, la resistencia como un grifo y la corriente como la cantidad de agua que sale.</p>
      <p style="text-align:center; font-weight:700; margin:0 0 8px;">Ejemplos de la Ley de Ohm</p>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Voltaje</th><th>Resistencia</th><th>Corriente</th><th>Resultado</th></tr></thead>
          <tbody>
            <tr><td>9 V</td><td>300 Ω</td><td style="color:#4ade80;font-weight:700">30 mA</td><td>Ideal y seguro</td></tr>
            <tr><td>9 V</td><td>1 000 Ω</td><td style="color:#4ade80;font-weight:700">9 mA</td><td>Corriente más baja</td></tr>
            <tr><td>3 V</td><td>150 Ω</td><td style="color:#4ade80;font-weight:700">20 mA</td><td>Correcto</td></tr>
            <tr><td>9 V</td><td>100 Ω</td><td style="color:#ff5c5c;font-weight:700">90 mA</td><td>¡Demasiada corriente!</td></tr>
          </tbody>
        </table>
      </div>
      <p style="margin-top:12px;"><b>Regla fácil:</b> Más resistencia → menos corriente. Más voltaje → más corriente.</p>`,
    diagram:`<svg viewBox="0 0 280 130">
      <polygon points="140,15 40,110 240,110" fill="none" stroke="#ff8a3d" stroke-width="3"/>
      <text x="140" y="50" text-anchor="middle" fill="#ffd23f" font-size="22" font-weight="700">V</text>
      <text x="80" y="100" text-anchor="middle" fill="#4dd8ff" font-size="18" font-weight="700">I</text>
      <text x="200" y="100" text-anchor="middle" fill="#ff8a3d" font-size="18" font-weight="700">R</text>
      <text x="140" y="125" text-anchor="middle" fill="#fef8ec" font-size="11">Voltaje = Corriente × Resistencia</text>
    </svg>`
  },
  {
    title:'¿Qué es un circuito eléctrico?',
    body:`<p style="text-align:center; font-size:1.15rem; font-weight:700; color:#ffd23f; margin-bottom:12px;">
        ¡La corriente necesita un camino REDONDO!
      </p>
      <p>Imagina una pista de carreras 🏎️. Los electrones salen del <b>+</b> de la pila, dan la vuelta completa y <b>regresan al −</b>. Si hay un hueco en la pista… ¡se detienen todos!</p>
      <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin:16px 0;">
        <div style="background:rgba(0,0,0,0.25); border-radius:12px; padding:10px 14px; text-align:center; min-width:120px;">
          <div style="font-size:1.6rem;">🔋</div>
          <b>1. Fuente</b><br><span style="font-size:0.85rem;opacity:0.85">La pila da energía</span>
        </div>
        <div style="background:rgba(0,0,0,0.25); border-radius:12px; padding:10px 14px; text-align:center; min-width:120px;">
          <div style="font-size:1.6rem;">💡</div>
          <b>2. Carga</b><br><span style="font-size:0.85rem;opacity:0.85">Usa la energía</span>
        </div>
        <div style="background:rgba(0,0,0,0.25); border-radius:12px; padding:10px 14px; text-align:center; min-width:120px;">
          <div style="font-size:1.6rem;">🔌</div>
          <b>3. Cables</b><br><span style="font-size:0.85rem;opacity:0.85">Cierran el camino</span>
        </div>
      </div>
      <p style="text-align:center; margin-top:8px;"><b>Regla de oro:</b> Si el camino no está cerrado… ¡no hay corriente!</p>`,
    diagram:`<svg viewBox="0 0 300 160">
      <!-- Top wire -->
      <line x1="50" y1="30" x2="250" y2="30" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>
      <!-- Bottom wire (return to negative) -->
      <line x1="50" y1="130" x2="250" y2="130" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>
      <!-- Left side - Battery -->
      <line x1="50" y1="30" x2="50" y2="55" stroke="#ffd23f" stroke-width="4"/>
      <line x1="38" y1="55" x2="62" y2="55" stroke="#4ade80" stroke-width="3"/>
      <line x1="38" y1="68" x2="62" y2="68" stroke="#4ade80" stroke-width="8"/>
      <line x1="50" y1="68" x2="50" y2="130" stroke="#ffd23f" stroke-width="4"/>
      <text x="22" y="60" fill="#4ade80" font-size="14" font-weight="700">+</text>
      <text x="22" y="80" fill="#ff8a3d" font-size="14" font-weight="700">−</text>
      <!-- Right side - Load -->
      <line x1="250" y1="30" x2="250" y2="55" stroke="#ffd23f" stroke-width="4"/>
      <circle cx="250" cy="80" r="22" fill="rgba(255,138,61,0.15)" stroke="#ff8a3d" stroke-width="3"/>
      <text x="250" y="85" text-anchor="middle" fill="#fef8ec" font-size="13" font-weight="700">Carga</text>
      <line x1="250" y1="102" x2="250" y2="130" stroke="#ffd23f" stroke-width="4"/>
      <!-- Direction arrows -->
      <polygon points="140,24 152,30 140,36" fill="#ffd23f"/>
      <polygon points="160,136 148,130 160,124" fill="#ffd23f"/>
      <!-- Labels -->
      <text x="150" y="18" text-anchor="middle" fill="#ffd23f" font-size="11">sale del +</text>
      <text x="150" y="152" text-anchor="middle" fill="#ffd23f" font-size="11">regresa al −</text>
    </svg>`
  },
  {
    title:'Polaridad: el sentido importa',
    body:`<p>Algunos componentes son <b>polarizados</b>: solo funcionan si los conectas en el sentido correcto. Otros son <b>no polarizados</b> y funcionan en cualquier sentido.</p>
      <p><b>Polarizados</b> (tienen + y −): pila, LED, capacitor electrolítico, buzzer, motor.</p>
      <p><b>No polarizados</b>: resistencia, interruptor, pulsador, jumpers.</p>
      <p>Si conectas al revés un componente polarizado, puede que no funcione o incluso se dañe. Por eso siempre hay que revisar el terminal positivo (+) y el negativo (−).</p>`,
    diagram:`<svg viewBox="0 0 260 100"><line x1="60" y1="55" x2="95" y2="55" stroke="#ffd23f" stroke-width="4"/>
      <polygon points="95,35 95,75 135,55" fill="#ff4d5e" stroke="#ff4d5e" stroke-width="2"/>
      <line x1="135" y1="35" x2="135" y2="75" stroke="#ff4d5e" stroke-width="4"/>
      <line x1="135" y1="55" x2="170" y2="55" stroke="#ffd23f" stroke-width="4"/>
      <text x="60" y="20" text-anchor="middle" fill="#fef8ec" font-size="12">ánodo (+)</text>
      <text x="170" y="20" text-anchor="middle" fill="#fef8ec" font-size="12">cátodo (−)</text>
      <text x="95" y="94" text-anchor="middle" fill="#fef8ec" font-size="12">triángulo</text>
      <text x="135" y="94" text-anchor="middle" fill="#fef8ec" font-size="12">barra</text></svg>
      <p style="margin-top:12px;"><b>Cómo reconocer el LED real:</b></p>
      <ul style="margin:8px 0 10px 20px; line-height:1.55;">
        <li><b>Patita larga</b> = positivo (ánodo +)</li>
        <li><b>Patita corta</b> = negativo (cátodo −)</li>
        <li>También el LED tiene un <b>lado plano</b> en la base: ese lado es el negativo (−)</li>
      </ul>
      <p>Si lo conectas al revés, el LED no enciende (y a veces se daña). ¡Siempre revisa las patitas!</p>`
  },
  {
    title:'Simbología electrónica',
    body:`<p>Cada componente tiene un <b>símbolo</b> especial para dibujar esquemas de circuitos. Es como un idioma dibujado:</p>
      <ul style="margin:10px 0 10px 20px; line-height:1.7;">
        <li>Un <b>zigzag</b> = Resistencia</li>
        <li>Un <b>triángulo apuntando a una barra</b> = LED o diodo</li>
        <li>Dos <b>líneas paralelas</b> = Capacitor</li>
        <li>Líneas largas y cortas = Pila / Batería</li>
        <li>Una <b>abertura</b> = Interruptor</li>
      </ul>
      <p>Aprender estos símbolos te permite leer cualquier esquema de circuito. ¡Practica en el juego de Memorama!</p>`,
    diagram:`<svg viewBox="0 0 280 90"><line x1="8" y1="45" x2="20" y2="45" stroke="#ffd23f" stroke-width="3"/>
      <polyline points="20,45 26.0,45 30.7,35 35.3,55 40.0,35 44.7,55 49.3,35 54.0,45 60,45" fill="none" stroke="#ff8a3d" stroke-width="3" stroke-linejoin="round"/>
      <line x1="60" y1="45" x2="72" y2="45" stroke="#ffd23f" stroke-width="3"/>
      <line x1="100" y1="45" x2="115" y2="45" stroke="#ffd23f" stroke-width="3"/>
      <polygon points="115,28 115,62 145,45" fill="#ff4d5e" stroke="#ff4d5e" stroke-width="2"/>
      <line x1="145" y1="28" x2="145" y2="62" stroke="#ff4d5e" stroke-width="3"/>
      <line x1="145" y1="45" x2="160" y2="45" stroke="#ffd23f" stroke-width="3"/>
      <line x1="190" y1="25" x2="190" y2="65" stroke="#4dd8ff" stroke-width="4"/><path d="M205 25 Q198 45 205 65" fill="none" stroke="#4dd8ff" stroke-width="4"/></svg>`
  },
  {
    title:'Circuito en serie',
    body:`<p style="text-align:center;font-size:1.1rem;font-weight:700;color:#ffd23f;">Un solo camino ➡️ si se rompe uno, se apaga todo</p>
      <p>Los componentes van <b>uno detrás del otro</b>, como amigos tomados de la mano. La corriente sale del <b>+</b>, pasa por todos y <b>regresa al −</b>.</p>
      <p>Si un componente falla → se interrumpe el camino → todo se apaga.</p>
      <p>💡 Ejemplo: las guirnaldas de Navidad antiguas. Se fundía un foco y se apagaba toda la cadena.</p>`,
    diagram:`<svg viewBox="0 0 400 115">
      <line x1="15" y1="45" x2="35" y2="45" stroke="#fde047" stroke-width="3"/>
      <line x1="35" y1="25" x2="35" y2="65" stroke="#4ade80" stroke-width="3"/>
      <line x1="45" y1="33" x2="45" y2="57" stroke="#4ade80" stroke-width="6"/>
      <text x="40" y="18" text-anchor="middle" fill="#4ade80" font-size="14" font-weight="800">+</text>
      <line x1="45" y1="45" x2="60" y2="45" stroke="#fde047" stroke-width="3"/>
      <line x1="60" y1="25" x2="60" y2="65" stroke="#fb923c" stroke-width="3"/>
      <line x1="70" y1="33" x2="70" y2="57" stroke="#fb923c" stroke-width="6"/>
      <text x="65" y="18" text-anchor="middle" fill="#fb923c" font-size="14" font-weight="800">−</text>
      <text x="52" y="80" text-anchor="middle" fill="#fef8ec" font-size="11">PILA</text>
      <line x1="70" y1="45" x2="105" y2="45" stroke="#fde047" stroke-width="3"/>
      <polygon points="103,39 115,45 103,51" fill="#fde047"/>
      <polyline points="115,45 123,45 129,33 137,57 145,33 153,57 159,45 170,45" fill="none" stroke="#fb923c" stroke-width="3" stroke-linejoin="round"/>
      <text x="142" y="26" text-anchor="middle" fill="#fb923c" font-size="12" font-weight="700">R1</text>
      <line x1="170" y1="45" x2="210" y2="45" stroke="#fde047" stroke-width="3"/>
      <polyline points="210,45 218,45 224,33 232,57 240,33 248,57 254,45 265,45" fill="none" stroke="#fb923c" stroke-width="3" stroke-linejoin="round"/>
      <text x="237" y="26" text-anchor="middle" fill="#fb923c" font-size="12" font-weight="700">R2</text>
      <line x1="265" y1="45" x2="310" y2="45" stroke="#fde047" stroke-width="3"/>
      <line x1="310" y1="45" x2="310" y2="90" stroke="#fde047" stroke-width="3"/>
      <line x1="310" y1="90" x2="52" y2="90" stroke="#fde047" stroke-width="3"/>
      <line x1="52" y1="90" x2="52" y2="65" stroke="#fde047" stroke-width="3"/>
      <polygon points="58,88 52,98 46,88" fill="#fde047"/>
      <text x="180" y="12" text-anchor="middle" fill="#4ade80" font-size="12" font-weight="700">SALE DEL POSITIVO (+)</text>
      <text x="180" y="108" text-anchor="middle" fill="#fb923c" font-size="12" font-weight="700">REGRESA AL NEGATIVO (−)</text>
    </svg>`
  },
  {
    title:'Circuito en paralelo',
    body:`<p style="text-align:center;font-size:1.1rem;font-weight:700;color:#ffd23f;">Varios caminos ➡️ si se rompe uno, los demás siguen</p>
      <p>Cada componente tiene <b>su propia rama</b>. Todos salen del <b>+</b> y todos regresan al <b>−</b>, pero por caminos separados.</p>
      <p>Si una rama falla → las otras siguen funcionando.</p>
      <p>💡 Ejemplo: las luces de tu casa. Apagas una y las demás siguen encendidas.</p>`,
    diagram:`<svg viewBox="0 0 400 175">
      <line x1="15" y1="55" x2="35" y2="55" stroke="#fde047" stroke-width="3"/>
      <line x1="35" y1="35" x2="35" y2="75" stroke="#4ade80" stroke-width="3"/>
      <line x1="45" y1="43" x2="45" y2="67" stroke="#4ade80" stroke-width="6"/>
      <text x="40" y="28" text-anchor="middle" fill="#4ade80" font-size="14" font-weight="800">+</text>
      <line x1="45" y1="55" x2="60" y2="55" stroke="#fde047" stroke-width="3"/>
      <line x1="60" y1="35" x2="60" y2="75" stroke="#fb923c" stroke-width="3"/>
      <line x1="70" y1="43" x2="70" y2="67" stroke="#fb923c" stroke-width="6"/>
      <text x="65" y="28" text-anchor="middle" fill="#fb923c" font-size="14" font-weight="800">−</text>
      <text x="52" y="90" text-anchor="middle" fill="#fef8ec" font-size="11">PILA</text>
      <line x1="35" y1="35" x2="35" y2="18" stroke="#fde047" stroke-width="3"/>
      <line x1="35" y1="18" x2="360" y2="18" stroke="#fde047" stroke-width="3.5"/>
      <polygon points="100,12 112,18 100,24" fill="#fde047"/>
      <line x1="70" y1="75" x2="70" y2="130" stroke="#fde047" stroke-width="3"/>
      <line x1="70" y1="130" x2="360" y2="130" stroke="#fde047" stroke-width="3.5"/>
      <line x1="360" y1="18" x2="360" y2="130" stroke="#fde047" stroke-width="3.5"/>
      <line x1="160" y1="18" x2="160" y2="45" stroke="#fde047" stroke-width="3"/>
      <polyline points="160,45 160,55 148,65 172,75 148,85 160,95" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="138" y="72" fill="#fb923c" font-size="13" font-weight="700">R1</text>
      <line x1="160" y1="95" x2="160" y2="130" stroke="#fde047" stroke-width="3"/>
      <line x1="270" y1="18" x2="270" y2="45" stroke="#fde047" stroke-width="3"/>
      <polyline points="270,45 270,55 258,65 282,75 258,85 270,95" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="248" y="72" fill="#fb923c" font-size="13" font-weight="700">R2</text>
      <line x1="270" y1="95" x2="270" y2="130" stroke="#fde047" stroke-width="3"/>
      <text x="200" y="10" text-anchor="middle" fill="#4ade80" font-size="12" font-weight="700">SALE DEL POSITIVO (+)</text>
      <text x="200" y="155" text-anchor="middle" fill="#fb923c" font-size="12" font-weight="700">REGRESA AL NEGATIVO (−)</text>
    </svg>`
  }
];
const theoryList = document.getElementById('theoryList');
function renderTheory(){
  const set = THEORY_PRIMARIA;
  theoryList.innerHTML = '';
  set.forEach((t,i)=>{
    const item = document.createElement('div');
    item.className = 'theory-item';
    item.innerHTML = `
      <div class="theory-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="theory-head-left">
          <span class="theory-num mono">0${i+1}</span>
          <h3>${t.title}</h3>
        </div>
        <span class="theory-chevron">⌄</span>
      </div>
      <div class="theory-body">
        <div class="theory-mini-diagram">${t.diagram}</div>
        ${t.body}
      </div>`;
    theoryList.appendChild(item);
  });
  if(theoryList.firstElementChild) theoryList.firstElementChild.classList.add('open');
}


/* ============================================================
   ZONA DE JUEGOS: cambio de pestaña
   ============================================================ */

/* ============================================================
   JUEGO: LABERINTO DE LA CORRIENTE
   ============================================================ */
const LAB_LEVELS = {
  1: {
    rows:5, cols:5,
    grid:[
      [0,0,1,0,0],
      [1,0,1,0,1],
      [0,0,0,0,1],
      [0,1,1,0,0],
      [0,0,0,1,0]
    ],
    start:[0,0], end:[4,4]
  },
  2: {
    rows:6, cols:6,
    grid:[
      [0,0,1,0,0,0],
      [1,0,1,0,1,0],
      [0,0,0,1,0,0],
      [0,1,0,0,0,1],
      [0,1,1,1,0,0],
      [0,0,0,0,0,0]
    ],
    start:[0,0], end:[5,5]
  },
  3: {
    rows:7, cols:7,
    grid:[
      [0,0,1,0,0,1,0],
      [1,0,1,0,1,0,0],
      [0,0,0,0,1,0,1],
      [0,1,1,0,0,0,0],
      [0,0,1,1,0,1,0],
      [1,0,0,0,0,1,0],
      [0,0,1,0,0,0,0]
    ],
    start:[0,0], end:[6,6]
  }
};
let labState = {level:1, pos:[0,0], steps:0, path:new Set()};

function setLabLevel(n){
  labState.level = n;
  document.querySelectorAll('.lab-level-btn').forEach(b=>b.classList.toggle('active', +b.dataset.level===n));
  initLaberinto();
}

function initLaberinto(){
  const L = LAB_LEVELS[labState.level];
  labState.pos = [...L.start];
  labState.steps = 0;
  labState.path = new Set([L.start.join(',')]);
  labWon = false;
  labHolding = false;
  const stepsEl = document.getElementById('labSteps');
  if(stepsEl) stepsEl.textContent = 0;
  const res = document.getElementById('labResult');
  if(res){ res.textContent=''; res.className='cb-result'; }
  renderLaberinto();
}

function renderLaberinto(){
  const L = LAB_LEVELS[labState.level];
  const grid = document.getElementById('labGrid');
  if(!grid) return;
  grid.style.gridTemplateColumns = 'repeat(' + L.cols + ', 48px)';
  grid.innerHTML = '';
  for(let r=0;r<L.rows;r++){
    for(let c=0;c<L.cols;c++){
      const cell = document.createElement('div');
      const key = r+','+c;
      const isWall = L.grid[r][c]===1;
      const isStart = r===L.start[0] && c===L.start[1];
      const isEnd = r===L.end[0] && c===L.end[1];
      const isPlayer = r===labState.pos[0] && c===labState.pos[1];
      const onPath = labState.path.has(key);

      cell.className = 'lab-cell';
      if(isWall) cell.classList.add('wall');
      else if(isPlayer) cell.classList.add('player');
      else if(isStart) cell.classList.add('start');
      else if(isEnd) cell.classList.add('end');
      else if(onPath) cell.classList.add('path');

      if(isPlayer) cell.textContent = '⚡';
      else if(isStart) cell.textContent = '🔋';
      else if(isEnd) cell.textContent = '💡';
      else if(isWall) cell.textContent = '⬛';
      else cell.textContent = '';

      if(!isWall){
        cell.style.touchAction = 'none';
        cell.onpointerdown = (function(rr,cc){ return function(e){ labPointerDown(rr,cc,e); }; })(r,c);
        cell.onpointerenter = (function(rr,cc){ return function(){ labPointerEnter(rr,cc); }; })(r,c);
        cell.onclick = (function(rr,cc){ return function(){ tryMoveLab(rr,cc); }; })(r,c);
      }
      grid.appendChild(cell);
    }
  }
}

let labHolding = false;
let labWon = false;

function tryMoveLab(r,c){
  if(labWon) return;
  const L = LAB_LEVELS[labState.level];
  if(L.grid[r][c]===1) return;
  const pr = labState.pos[0], pc = labState.pos[1];
  if(Math.abs(r-pr)+Math.abs(c-pc)!==1) return;
  labState.pos = [r,c];
  labState.steps++;
  labState.path.add(r+','+c);
  const stepsEl = document.getElementById('labSteps');
  if(stepsEl) stepsEl.textContent = labState.steps;
  renderLaberinto();
  if(r===L.end[0] && c===L.end[1]){
    labWon = true;
    labHolding = false;
    const res = document.getElementById('labResult');
    res.innerHTML = '✅ ¡Llegaste! La corriente encendió el LED en ' + labState.steps + ' pasos.';
    res.className = 'cb-result ok';
    if(window.PG){ PG.sfxWin(); PG.confetti(40); PG.toast('🌀 ¡Laberinto completado!'); }
  }
}

function moveLab(r,c){ tryMoveLab(r,c); }

function labPointerDown(r,c,e){
  e.preventDefault();
  labHolding = true;
  tryMoveLab(r,c);
}
function labPointerEnter(r,c){
  if(labHolding) tryMoveLab(r,c);
}
function laberintoPointerUp(){ labHolding = false; }

// global release
if(typeof window._laberintoPointerUpBound === 'undefined'){
  window.addEventListener('pointerup', laberintoPointerUp);
  window.addEventListener('pointercancel', laberintoPointerUp);
  window._laberintoPointerUpBound = true;
}

/* ============================================================
   JUEGO: PUZZLE DE COMPONENTES
   ============================================================ */
const PUZ_POOL = [
  {id:'resistencia', name:'Resistencia'},
  {id:'led', name:'LED'},
  {id:'bateria', name:'Pila'},
  {id:'interruptor', name:'Interruptor'},
  {id:'capacitor', name:'Capacitor'},
  {id:'ldr', name:'LDR'},
  {id:'buzzer', name:'Buzzer'},
  {id:'motor', name:'Motor'},
  {id:'potenciometro', name:'Potenciómetro'},
  {id:'transistor', name:'Transistor'}
];
let puzLevel = 'facil';
let puzState = {items:[], placed:{}};

function setPuzLevel(level){
  puzLevel = level;
  document.querySelectorAll('.puz-level-btn').forEach(b=>b.classList.toggle('active', b.dataset.level===level));
  initPuzzle();
}

function initPuzzle(){
  const n = puzLevel==='facil' ? 4 : (puzLevel==='normal' ? 6 : 8);
  const pool = PUZ_POOL.filter(function(p){ return ICONS[p.id]; }).sort(function(){ return Math.random()-0.5; }).slice(0,n);
  puzState.items = pool;
  puzState.placed = {};
  const score = document.getElementById('puzScore');
  const total = document.getElementById('puzTotal');
  if(score) score.textContent = 0;
  if(total) total.textContent = n;
  const res = document.getElementById('puzResult');
  if(res){ res.textContent=''; res.className='cb-result'; }
  renderPuzzle();
}

function renderPuzzle(){
  const board = document.getElementById('puzBoard');
  if(!board) return;
  board.innerHTML = '';

  const slotsCol = document.createElement('div');
  slotsCol.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:520px;';
  const names = puzState.items.slice().sort(function(){ return Math.random()-0.5; });
  names.forEach(function(item){
    const slot = document.createElement('div');
    slot.className = 'puz-slot' + (puzState.placed[item.id] ? ' filled' : '');
    slot.dataset.id = item.id;
    var inner = '<span style="font-size:0.85rem;font-weight:700;text-align:center;">' + item.name + '</span>';
    if(puzState.placed[item.id]){
      inner += '<div style="width:48px;height:48px;">' + (ICONS[item.id]||'') + '</div>';
    } else {
      inner += '<div class="puz-drop" data-id="' + item.id + '" style="min-height:40px;width:100%;"></div>';
    }
    slot.innerHTML = inner;
    slot.addEventListener('dragover', function(e){ e.preventDefault(); });
    slot.addEventListener('drop', function(e){
      e.preventDefault();
      var id = e.dataTransfer.getData('text/plain');
      placePuzzle(id, item.id, slot);
    });
    slotsCol.appendChild(slot);
  });

  const piecesCol = document.createElement('div');
  piecesCol.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:520px;margin-top:8px;';
  const pieces = puzState.items.slice().sort(function(){ return Math.random()-0.5; });
  pieces.forEach(function(item){
    if(puzState.placed[item.id]) return;
    const piece = document.createElement('div');
    piece.className = 'puz-piece';
    piece.draggable = true;
    piece.dataset.id = item.id;
    piece.innerHTML = ICONS[item.id] || item.name;
    piece.addEventListener('dragstart', function(e){ e.dataTransfer.setData('text/plain', item.id); });
    piecesCol.appendChild(piece);
  });

  board.appendChild(slotsCol);
  const label = document.createElement('div');
  label.style.cssText = 'width:100%;text-align:center;opacity:0.7;font-size:0.85rem;margin:8px 0 4px;';
  label.textContent = 'Arrastra el símbolo hacia su nombre';
  board.appendChild(label);
  board.appendChild(piecesCol);
}

function placePuzzle(pieceId, slotId, slotEl){
  if(puzState.placed[pieceId]) return;
  if(pieceId === slotId){
    puzState.placed[pieceId] = true;
    var score = Object.keys(puzState.placed).length;
    document.getElementById('puzScore').textContent = score;
    if(window.PG) PG.sfxOk();
    renderPuzzle();
    if(score >= puzState.items.length){
      var res = document.getElementById('puzResult');
      res.innerHTML = '✅ ¡Puzzle completo! Reconociste todos los componentes.';
      res.className = 'cb-result ok';
      if(window.PG){ PG.confetti(45); PG.toast('🧩 ¡Puzzle resuelto!'); }
    }
  } else {
    slotEl.classList.add('wrong');
    if(window.PG) PG.sfxBad();
    setTimeout(function(){ slotEl.classList.remove('wrong'); }, 600);
  }
}


function switchGame(name){
  document.querySelectorAll('.game-tab').forEach(t=>t.classList.toggle('active', t.dataset.game===name));
  document.querySelectorAll('.game-view').forEach(v=>v.classList.toggle('active', v.id === 'game-'+name));
  if(name==='cables' && !wireInitDone){ initWireGame(); wireInitDone = true; }
  if(name==='ohm' && typeof updateOhmLive==='function') updateOhmLive();
  if(name==='puzzle' && typeof initPuzzle==='function') initPuzzle();
  if(name==='polaridad' && typeof initPolarity==='function') initPolarity();
  if(name==='armado' && typeof initCircuitBuilder==='function') initCircuitBuilder();
  if(name==='memorama' && typeof initMemory==='function') initMemory();
  if(name==='serieparalelo'){
    if(typeof renderSerie==='function') renderSerie();
    if(typeof renderParalelo==='function') renderParalelo();
  }
  if(name==='quiz' && typeof initQuiz==='function') initQuiz();
}

/* ============================================================
   JUEGO 5 (nuevo): CONECTA LOS CABLES
   ============================================================ */
let wireInitDone = false;
const WIRE_COMPONENTS = [
  {id:'bateria', label:'PILA', x:40, y:40, w:120, h:70,
    terms:[{id:'batt_neg', tag:'-', dx:0, dy:35},{id:'batt_pos', tag:'+', dx:120, dy:35}]},
  {id:'interruptor', label:'INTERRUPTOR', x:460, y:30, w:140, h:70,
    terms:[{id:'sw_l', tag:'', dx:0, dy:35},{id:'sw_r', tag:'', dx:140, dy:35}]},
  {id:'resistencia', label:'RESISTENCIA', x:460, y:220, w:140, h:70,
    terms:[{id:'res_l', tag:'', dx:0, dy:35},{id:'res_r', tag:'', dx:140, dy:35}]},
  {id:'led', label:'LED', x:40, y:210, w:130, h:90,
    terms:[{id:'led_neg', tag:'-', dx:30, dy:90},{id:'led_pos', tag:'+', dx:100, dy:90}]}
];
const WIRE_PAIRS = [
  ['batt_pos','sw_l'],
  ['sw_r','res_r'],
  ['res_l','led_pos'],
  ['led_neg','batt_neg']
];
let wireConnected = []; // array of [a,b] arrays already made
let wireDrag = null; // {fromId, x1,y1}

function wireTermPos(termId){
  for(const c of WIRE_COMPONENTS){
    for(const t of c.terms){
      if(t.id===termId) return {x:c.x+t.dx, y:c.y+t.dy};
    }
  }
  return null;
}
function wirePairMatches(a,b){
  // Pares exactos permitidos (polarizados fijos + no polarizados en cualquier sentido)
  const allowed = [
    // pila (+) → interruptor (cualquier lado: no tiene polaridad)
    ['batt_pos','sw_l'], ['batt_pos','sw_r'],
    // interruptor → resistencia (ambos sin polaridad)
    ['sw_l','res_l'], ['sw_l','res_r'], ['sw_r','res_l'], ['sw_r','res_r'],
    // resistencia → LED (+)
    ['res_l','led_pos'], ['res_r','led_pos'],
    // LED (−) → pila (−)
    ['led_neg','batt_neg']
  ];
  return allowed.some(p => (p[0]===a&&p[1]===b) || (p[0]===b&&p[1]===a));
}
function wireCircuitLooksValid(){
  // 4 cables y cada terminal de componente usado a lo sumo 1 vez
  if(wireConnected.length !== 4) return false;
  const used = {};
  for(const [a,b] of wireConnected){
    if(used[a] || used[b]) return false;
    used[a]=1; used[b]=1;
  }
  // debe incluir conexión al LED+ y LED- y pila+ y pila-
  const flat = wireConnected.flat();
  return flat.includes('batt_pos') && flat.includes('batt_neg') && flat.includes('led_pos') && flat.includes('led_neg');
}
function wireAlreadyConnected(a,b){
  return wireConnected.some(p => (p[0]===a&&p[1]===b) || (p[0]===b&&p[1]===a));
}


function wireTermLabel(id){
  const map = {
    batt_pos:'Pila (+)', batt_neg:'Pila (−)',
    sw_l:'Interruptor', sw_r:'Interruptor',
    res_l:'Resistencia', res_r:'Resistencia',
    led_pos:'LED (+)', led_neg:'LED (−)'
  };
  return map[id] || id;
}
function wireErrorMessage(a, b){
  const A = wireTermLabel(a), B = wireTermLabel(b);
  // RIESGOS / quemar componentes
  if((a==='batt_pos' && b==='batt_neg') || (b==='batt_pos' && a==='batt_neg'))
    return '🔥 <b>Cortocircuito</b>: no unes (+) con (−) de la pila. La pila se calienta y puede danarse.';
  if((a==='batt_pos' && b==='led_pos') || (a==='led_pos' && b==='batt_pos') ||
     (a==='batt_pos' && b==='led_neg') || (a==='led_neg' && b==='batt_pos'))
    return '🔥 <b>Riesgo de quemar el LED</b>: falta la <b>resistencia</b>. Sin ella pasa demasiada corriente y el LED se quema.';
  if((a==='batt_neg' && b==='led_pos') || (a==='led_pos' && b==='batt_neg'))
    return '⚠️ <b>Polaridad al reves</b>: el (−) de la pila no va al (+) del LED. El LED no enciende y puede danarse.';
  if((a==='led_pos' && b==='led_neg') || (a==='led_neg' && b==='led_pos'))
    return '❌ No conectes las dos patitas del LED entre si. Cada una va a un lado del circuito.';
  if((a.startsWith('led_') && b.startsWith('led_')))
    return '❌ Ese cable en el LED no es correcto.';
  if((a==='batt_pos' && (b.startsWith('sw_')||b.startsWith('res_'))) || (b==='batt_pos' && (a.startsWith('sw_')||a.startsWith('res_'))))
    return '✅ Casi: el (+) de la pila si puede ir al interruptor, pero sigue el orden: pila (+) → interruptor → resistencia → LED (+)';
  if((a==='batt_neg' && (b.startsWith('sw_')||b.startsWith('res_'))) || (b==='batt_neg' && (a.startsWith('sw_')||a.startsWith('res_'))))
    return '❌ El <b>(−)</b> de la pila se conecta al final con el <b>LED pata corta (−)</b>, no al interruptor ni a la resistencia.';
  if((a.startsWith('res_') && b==='led_neg') || (b.startsWith('res_') && a==='led_neg'))
    return '⚠️ La resistencia debe ir al <b>LED pata larga (+)</b>, no a la pata corta. Polaridad del LED importa.';
  if((a.startsWith('sw_') && b.startsWith('led_')) || (b.startsWith('sw_') && a.startsWith('led_')))
    return '🔥 Falta la <b>resistencia</b> entre el interruptor y el LED. Sin resistencia el LED puede quemarse.';
  return '❌ <b>'+A+'</b> con <b>'+B+'</b> no es el camino seguro.<br><small>Orden: pila (+) → interruptor → resistencia → LED (+) larga → LED (−) corta → pila (−). Sin resistencia = LED quemado.</small>';
}

function initWireGame(){
  wireConnected = [];
  wireDrag = null;
  document.getElementById('wireCount').textContent = '0';
  document.getElementById('wireResult').textContent = '';
  document.getElementById('wireResult').className = 'cb-result';
  renderWireBoard();
}
function toggleWireHint(){
  document.getElementById('wireHint').classList.toggle('show');
}

function renderWireBoard(){
  const svg = document.getElementById('wireSvg');
  if(!svg) return;
  const complete = (typeof wireCircuitLooksValid==='function' ? wireCircuitLooksValid() : wireConnected.length === 4);
  let parts = '';

  // cables hechos
  wireConnected.forEach(function(pair){
    var a = pair[0], b = pair[1];
    var p1 = wireTermPos(a), p2 = wireTermPos(b);
    if(!p1||!p2) return;
    var mx = (p1.x+p2.x)/2;
    parts += '<path class="wire-line done" data-wire="1" d="M'+p1.x+','+p1.y+' C'+mx+','+p1.y+' '+mx+','+p2.y+' '+p2.x+','+p2.y+'" fill="none" stroke="#4ade80" stroke-width="5" stroke-linecap="round" stroke-dasharray="12 8"/>';
  });

  WIRE_COMPONENTS.forEach(function(c){
    if(c.id==='bateria'){
      // pila realista
      parts += '<rect x="'+c.x+'" y="'+(c.y+8)+'" width="'+c.w+'" height="54" rx="8" fill="#f4a13c" stroke="#a5651a" stroke-width="2"/>';
      parts += '<rect x="'+(c.x+c.w/2-12)+'" y="'+c.y+'" width="24" height="12" rx="3" fill="#6b6b6b"/>';
      parts += '<text x="'+(c.x+c.w/2)+'" y="'+(c.y+40)+'" text-anchor="middle" fill="#3d2405" font-size="14" font-weight="800">PILA</text>';
      parts += '<text x="'+(c.x+18)+'" y="'+(c.y+28)+'" fill="#3d2405" font-size="16" font-weight="800">-</text>';
      parts += '<text x="'+(c.x+c.w-18)+'" y="'+(c.y+28)+'" text-anchor="middle" fill="#3d2405" font-size="16" font-weight="800">+</text>';
    } else if(c.id==='interruptor'){
      parts += '<rect x="'+c.x+'" y="'+c.y+'" width="'+c.w+'" height="'+c.h+'" rx="12" fill="#1a3d32" stroke="#5eead4" stroke-width="2"/>';
      parts += '<rect x="'+(c.x+30)+'" y="'+(c.y+22)+'" width="80" height="26" rx="13" fill="#2f6b45" stroke="#4ade80" stroke-width="2"/>';
      parts += '<circle cx="'+(c.x+90)+'" cy="'+(c.y+35)+'" r="10" fill="#fef8ec"/>';
      parts += '<text x="'+(c.x+c.w/2)+'" y="'+(c.y+16)+'" text-anchor="middle" fill="#fef8ec" font-size="11" font-weight="700">INTERRUPTOR</text>';
      parts += '<text x="'+(c.x+c.w/2)+'" y="'+(c.y+c.h-6)+'" text-anchor="middle" fill="#94a3b8" font-size="9">sin polaridad</text>';
    } else if(c.id==='resistencia'){
      parts += '<rect x="'+c.x+'" y="'+c.y+'" width="'+c.w+'" height="'+c.h+'" rx="12" fill="#1a3d32" stroke="#fb923c" stroke-width="2"/>';
      // cuerpo resistencia
      parts += '<rect x="'+(c.x+35)+'" y="'+(c.y+22)+'" width="70" height="28" rx="6" fill="#d4a574" stroke="#8a6a3a" stroke-width="1.5"/>';
      parts += '<rect x="'+(c.x+45)+'" y="'+(c.y+22)+'" width="6" height="28" fill="#1a1a1a"/>';
      parts += '<rect x="'+(c.x+58)+'" y="'+(c.y+22)+'" width="6" height="28" fill="#b45309"/>';
      parts += '<rect x="'+(c.x+71)+'" y="'+(c.y+22)+'" width="6" height="28" fill="#dc2626"/>';
      parts += '<rect x="'+(c.x+90)+'" y="'+(c.y+22)+'" width="6" height="28" fill="#ca8a04"/>';
      parts += '<text x="'+(c.x+c.w/2)+'" y="'+(c.y+16)+'" text-anchor="middle" fill="#fef8ec" font-size="11" font-weight="700">RESISTENCIA</text>';
      parts += '<text x="'+(c.x+c.w/2)+'" y="'+(c.y+c.h-6)+'" text-anchor="middle" fill="#94a3b8" font-size="9">sin polaridad</text>';
    } else if(c.id==='led'){
      var glow = complete;
      // cuerpo LED (domo)
      parts += '<path d="M'+(c.x+35)+' '+(c.y+55)+' V'+(c.y+28)+' A30 30 0 0 1 '+(c.x+95)+' '+(c.y+28)+' V'+(c.y+55)+' Z" fill="'+(glow?'#ff4d5e':'#5a2030')+'" stroke="#ff8a9a" stroke-width="2" style="'+(glow?'filter:drop-shadow(0 0 12px #ff4d5e)':'')+'"/>';
      parts += '<rect x="'+(c.x+35)+'" y="'+(c.y+52)+'" width="60" height="10" fill="#3d1520"/>';
      // patita LARGA = + (derecha)
      parts += '<line x1="'+(c.x+100)+'" y1="'+(c.y+62)+'" x2="'+(c.x+100)+'" y2="'+(c.y+90)+'" stroke="#4ade80" stroke-width="4" stroke-linecap="round"/>';
      parts += '<text x="'+(c.x+100)+'" y="'+(c.y+18)+'" text-anchor="middle" fill="#4ade80" font-size="11" font-weight="800">+ larga</text>';
      // patita CORTA = - (izquierda)
      parts += '<line x1="'+(c.x+30)+'" y1="'+(c.y+62)+'" x2="'+(c.x+30)+'" y2="'+(c.y+82)+'" stroke="#fb923c" stroke-width="4" stroke-linecap="round"/>';
      parts += '<text x="'+(c.x+30)+'" y="'+(c.y+18)+'" text-anchor="middle" fill="#fb923c" font-size="11" font-weight="800">- corta</text>';
      parts += '<text x="'+(c.x+65)+'" y="'+(c.y+48)+'" text-anchor="middle" fill="#fef8ec" font-size="12" font-weight="800">LED</text>';
      if(glow) parts += '<text x="'+(c.x+65)+'" y="'+(c.y+8)+'" text-anchor="middle" font-size="16">✨</text>';
    }

    // terminales (circulos para conectar)
    c.terms.forEach(function(t){
      var isConn = wireConnected.some(function(p){ return p.indexOf(t.id)>=0; });
      var tx = c.x+t.dx, ty = c.y+t.dy;
      var col = isConn ? '#4ade80' : '#fde047';
      parts += '<circle class="wire-terminal '+(isConn?'connected':'')+'" data-term="'+t.id+'" cx="'+tx+'" cy="'+ty+'" r="11" fill="'+(isConn?'#4ade80':'#0b1f18')+'" stroke="'+col+'" stroke-width="3" style="cursor:pointer"/>';
      if(t.tag){
        parts += '<text x="'+tx+'" y="'+(ty-16)+'" text-anchor="middle" fill="'+col+'" font-size="13" font-weight="800" style="pointer-events:none">'+t.tag+'</text>';
      }
    });
  });

  // estilo de animacion DENTRO del SVG (no depende de CSS externo)
  var styleAnim = '<defs><style type="text/css">'
    + '@keyframes wireDash { to { stroke-dashoffset: -40; } }'
    + '@keyframes wireDrawIn { from { stroke-dashoffset: 400; } to { stroke-dashoffset: 0; } }'
    + 'path.wire-line.done { animation: wireDrawIn 0.5s ease-out forwards, wireDash 0.7s linear infinite; }'
    + 'path.wire-line.temp { stroke: #fde047; stroke-width: 4; stroke-dasharray: 8 6; animation: wireDash 0.45s linear infinite; }'
    + '</style></defs>';
  svg.innerHTML = styleAnim + parts;

  // forzar animacion por JS por si el CSS del SVG falla en algunos navegadores
  svg.querySelectorAll('path.wire-line.done').forEach(function(path, idx){
    try {
      var len = path.getTotalLength ? path.getTotalLength() : 200;
      path.style.strokeDasharray = '12 8';
      path.style.strokeDashoffset = '0';
      path.animate(
        [
          { strokeDashoffset: len },
          { strokeDashoffset: 0 }
        ],
        { duration: 450, easing: 'ease-out', fill: 'forwards' }
      );
      // flujo continuo despues
      setTimeout(function(){
        path.style.strokeDasharray = '12 8';
        path.animate(
          [
            { strokeDashoffset: 0 },
            { strokeDashoffset: -40 }
          ],
          { duration: 700, iterations: Infinity }
        );
      }, 460);
    } catch(e) {}
  });

  svg.querySelectorAll('.wire-terminal').forEach(function(circle){
    circle.addEventListener('pointerdown', onWirePointerDown);
  });
}

function svgPoint(svg, clientX, clientY){
  const pt = svg.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if(!ctm) return {x:0,y:0};
  const loc = pt.matrixTransform(ctm.inverse());
  return {x:loc.x, y:loc.y};
}

function onWirePointerDown(e){
  e.preventDefault();
  const termId = e.target.dataset.term;
  const svg = document.getElementById('wireSvg');
  const pos = wireTermPos(termId);
  wireDrag = {fromId: termId, x:pos.x, y:pos.y};
  drawTempWire(pos.x, pos.y);
}
function onWirePointerMove(e){
  if(!wireDrag) return;
  const svg = document.getElementById('wireSvg');
  const p = svgPoint(svg, e.clientX, e.clientY);
  drawTempWire(p.x, p.y);
}
function drawTempWire(x2,y2){
  const svg = document.getElementById('wireSvg');
  if(!svg || !wireDrag) return;
  let temp = svg.querySelector('.wire-line.temp');
  if(!temp){
    temp = document.createElementNS('http://www.w3.org/2000/svg','path');
    temp.setAttribute('class','wire-line temp');
    temp.setAttribute('fill','none');
    temp.setAttribute('stroke','#fde047');
    temp.setAttribute('stroke-width','4');
    temp.setAttribute('stroke-linecap','round');
    temp.setAttribute('stroke-dasharray','8 6');
    svg.appendChild(temp);
    try {
      temp.animate(
        [{ strokeDashoffset: 0 }, { strokeDashoffset: -28 }],
        { duration: 400, iterations: Infinity }
      );
    } catch(e) {}
  }
  temp.setAttribute('d', 'M'+wireDrag.x+','+wireDrag.y+' L'+x2+','+y2);
}
function onWirePointerUp(e){
  if(!wireDrag) return;
  const svg = document.getElementById('wireSvg');
  const p = svgPoint(svg, e.clientX, e.clientY);
  // find nearest terminal within threshold
  let best = null, bestDist = 26;
  WIRE_COMPONENTS.forEach(c=>{
    c.terms.forEach(t=>{
      if(t.id === wireDrag.fromId) return;
      const pos = wireTermPos(t.id);
      const d = Math.hypot(pos.x-p.x, pos.y-p.y);
      if(d < bestDist){ bestDist = d; best = t.id; }
    });
  });
  const result = document.getElementById('wireResult');
  if(best){
    if(wireAlreadyConnected(wireDrag.fromId, best)){
      result.innerHTML = 'ℹ️ Ese cable <b>ya está puesto</b>. Prueba otra terminal del camino.';
      result.className = 'cb-result';
    } else if(wirePairMatches(wireDrag.fromId, best)){
      wireConnected.push([wireDrag.fromId, best]);
      document.getElementById('wireCount').textContent = wireConnected.length;
      result.innerHTML = '✅ Cable bien puesto ('+wireConnected.length+'/4). Sigue cerrando el camino.';
      result.className = 'cb-result ok';
      if(window.PG && PG.sfxOk) try{ PG.sfxOk(); }catch(e){}
      if((typeof wireCircuitLooksValid==='function' && wireCircuitLooksValid())){
        result.innerHTML = '✅ ¡Circuito cerrado! La resistencia protege al LED y la corriente fluye con seguridad.';
        if(window.PG){ PG.sfxWin(); PG.confetti(40); PG.toast('🔗 ¡Cables perfectos!'); PG.award('cables','Experto en Cables'); }
        result.className = 'cb-result ok';
      }
    } else {
      flashBadWire(wireDrag.fromId, best);
      result.innerHTML = wireErrorMessage(wireDrag.fromId, best);
      result.className = 'cb-result bad';
      if(window.PG && PG.sfxBad) try{ PG.sfxBad(); }catch(e){}
    }
  }
  wireDrag = null;
  renderWireBoard();
}
function cancelWireDrag(){
  wireDrag = null;
  renderWireBoard();
}

// listeners globales para arrastrar cables (animacion incluida)
if(typeof window.wireGlobalListeners === 'undefined'){
  window.wireGlobalListeners = true;
  window.addEventListener('pointermove', function(e){ if(typeof onWirePointerMove==='function') onWirePointerMove(e); });
  window.addEventListener('pointerup', function(e){ if(typeof onWirePointerUp==='function') onWirePointerUp(e); });
  window.addEventListener('pointercancel', function(e){ if(typeof onWirePointerUp==='function') onWirePointerUp(e); });
}

function flashBadWire(a,b){
  const svg = document.getElementById('wireSvg');
  if(!svg) return;
  const p1 = wireTermPos(a), p2 = wireTermPos(b);
  if(!p1||!p2) return;
  const bad = document.createElementNS('http://www.w3.org/2000/svg','path');
  bad.setAttribute('class','wire-line bad wire-burn');
  bad.setAttribute('d', 'M'+p1.x+','+p1.y+' L'+p2.x+','+p2.y);
  bad.setAttribute('stroke', '#ff5c5c');
  bad.setAttribute('stroke-width', '5');
  bad.setAttribute('fill', 'none');
  bad.setAttribute('stroke-linecap', 'round');
  svg.appendChild(bad);
  // chispas de peligro
  const mx = (p1.x+p2.x)/2, my = (p1.y+p2.y)/2;
  const boom = document.createElementNS('http://www.w3.org/2000/svg','text');
  boom.setAttribute('x', mx);
  boom.setAttribute('y', my);
  boom.setAttribute('text-anchor', 'middle');
  boom.setAttribute('font-size', '22');
  boom.textContent = '🔥';
  svg.appendChild(boom);
  setTimeout(function(){ bad.remove(); boom.remove(); }, 900);
}

/* ============================================================
   RENDER: tarjetas de componentes
   ============================================================ */
const compGrid = document.getElementById('compGrid');
COMPONENTS.forEach(c=>{
  const card = document.createElement('div');
  card.className='comp-card';
  card.setAttribute('role','button');
  card.setAttribute('tabindex','0');
  card.setAttribute('aria-label', c.name);
  let polClass = 'no', polText = '○ NO POLARIZADO';
  if(c.pol === true){ polClass = 'si'; polText = '⚡ POLARIZADO'; }
  else if(c.pol === 'mixed'){ polClass = 'mix'; polText = '⚡ / ○ SEGÚN TIPO'; }
  const icon = ICONS[c.id] || '';
  card.innerHTML = `
    <div class="comp-photo-wrap">
      <img class="component-photo" src="${c.image}" alt="${c.name}" loading="lazy"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="comp-photo-fallback" style="display:none">${icon}</div>
    </div>
    <div class="comp-symbol">${icon}</div>
    <span class="figure">${c.figure}</span>
    <h3>${c.name}</h3>
    <div class="comp-meta">
      <span class="pol-tag ${polClass}">${polText}</span>
      <span class="symbol-label">Símbolo: ${SYMBOL_LABELS[c.id] || c.id.toUpperCase()}</span>
    </div>
    <p>${c.desc}</p>`;
  card.onclick=()=>card.classList.toggle('open');
  card.onkeydown=(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); card.classList.toggle('open'); } };
  compGrid.appendChild(card);
});

/* ============================================================
   JUEGO 1: MEMORAMA (con niveles)
   ============================================================ */
let memoState = {flipped:[], matched:0, moves:0, lock:false, pairs:4, level:'facil'};

// Solo componentes que tienen icono SVG seguro
const MEMO_SAFE = ['resistencia','led','bateria','interruptor','capacitor','ldr','buzzer','motor','potenciometro','transistor'];

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function setMemoLevel(level){
  memoState.level = level;
  if(level==='facil') memoState.pairs = 4;
  else if(level==='normal') memoState.pairs = 6;
  else memoState.pairs = 8;
  // update buttons
  document.querySelectorAll('.memo-level-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.level===level);
  });
  initMemory();
}

function initMemory(){
  memoState.flipped = [];
  memoState.matched = 0;
  memoState.moves = 0;
  memoState.lock = false;
  const movesEl = document.getElementById('memoMoves');
  const pairsEl = document.getElementById('memoPairs');
  const totalEl = document.getElementById('memoTotal');
  if(movesEl) movesEl.textContent = 0;
  if(pairsEl) pairsEl.textContent = 0;
  if(totalEl) totalEl.textContent = memoState.pairs;

  // Elegir componentes seguros que existan en ICONS
  const available = MEMO_SAFE.filter(id => ICONS[id]);
  const pool = shuffle(available).slice(0, memoState.pairs);

  let cards = [];
  pool.forEach(id=>{
    const comp = COMPONENTS.find(c=>c.id===id) || {id, name:id};
    cards.push({type:'name', id, label:comp.name});
    cards.push({type:'icon', id, label:comp.name});
  });
  cards = shuffle(cards);

  const grid = document.getElementById('memoGrid');
  if(!grid) return;
  grid.innerHTML = '';
  // Ajustar columnas según cantidad
  const cols = memoState.pairs <= 4 ? 4 : (memoState.pairs <= 6 ? 4 : 4);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  cards.forEach((c,i)=>{
    const el = document.createElement('div');
    el.className = 'memo-card';
    el.dataset.id = c.id;
    el.dataset.index = i;
    const iconHtml = (c.type==='icon' && ICONS[c.id]) ? ICONS[c.id] : '';
    const nameHtml = c.type==='name' ? `<span style="font-size:0.75rem;font-weight:700;text-align:center;padding:4px;">${c.label}</span>` : '';
    el.innerHTML = `<div class="memo-inner">
      <div class="memo-face memo-front"></div>
      <div class="memo-face memo-back">${iconHtml}${nameHtml}</div>
    </div>`;
    el.onclick = ()=>flipMemo(el);
    grid.appendChild(el);
  });
}

function flipMemo(el){
  if(memoState.lock || el.classList.contains('flip') || el.classList.contains('matched')) return;
  el.classList.add('flip');
  memoState.flipped.push(el);

  if(memoState.flipped.length === 2){
    memoState.moves++;
    const movesEl = document.getElementById('memoMoves');
    if(movesEl) movesEl.textContent = memoState.moves;
    memoState.lock = true;
    const [a,b] = memoState.flipped;

    if(a.dataset.id === b.dataset.id){
      // Match!
      setTimeout(()=>{
        a.classList.add('matched');
        b.classList.add('matched');
        memoState.matched++;
        const pairsEl = document.getElementById('memoPairs');
        if(pairsEl) pairsEl.textContent = memoState.matched;
        if(window.PG) PG.sfxOk();

        if(memoState.matched >= memoState.pairs){
          if(window.PG){
            PG.toast('🎉 ¡Memorama completo!');
            PG.confetti(50);
            PG.award('memo', 'Maestro de la Memoria');
          }
          if(typeof saveScore==='function') saveScore('memo_moves', memoState.moves);
        }
        memoState.flipped = [];
        memoState.lock = false;
      }, 420);
    } else {
      // No match
      setTimeout(()=>{
        a.classList.remove('flip');
        b.classList.remove('flip');
        memoState.flipped = [];
        memoState.lock = false;
      }, 750);
    }
  }
}

// Inicializar en nivel fácil
if(document.getElementById('memoGrid')) initMemory();

/* ============================================================
   JUEGO 2: ARMA EL CIRCUITO (drag & drop)
   ============================================================ */
const CIRCUIT_LEVELS = {
  facil: {
    parts: [
      {id:'bateria', label:'Pila', icon:ICONS.bateria},
      {id:'resistencia', label:'Resistencia', icon:ICONS.resistencia},
      {id:'led', label:'LED', icon:ICONS.led}
    ],
    order: ['bateria','resistencia','led'],
    hint: 'Pila (+) → Resistencia → LED → regreso al (−)'
  },
  normal: {
    parts: [
      {id:'bateria', label:'Pila', icon:ICONS.bateria},
      {id:'interruptor', label:'Interruptor', icon:ICONS.interruptor},
      {id:'resistencia', label:'Resistencia', icon:ICONS.resistencia},
      {id:'led', label:'LED', icon:ICONS.led}
    ],
    order: ['bateria','interruptor','resistencia','led'],
    hint: 'Pila (+) → Interruptor → Resistencia → LED → regreso al (−)'
  },
  dificil: {
    parts: [
      {id:'bateria', label:'Pila', icon:ICONS.bateria},
      {id:'interruptor', label:'Interruptor', icon:ICONS.interruptor},
      {id:'resistencia', label:'Resistencia', icon:ICONS.resistencia},
      {id:'led', label:'LED', icon:ICONS.led},
      {id:'buzzer', label:'Buzzer', icon:ICONS.buzzer || ICONS.led}
    ],
    order: ['bateria','interruptor','resistencia','led','buzzer'],
    hint: 'Pila (+) → Interruptor → Resistencia → LED → Buzzer → regreso al (−)'
  }
};
let circuitLevel = 'facil';

function setCircuitLevel(level){
  circuitLevel = level;
  document.querySelectorAll('.cb-level-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.level===level);
  });
  initCircuitBuilder();
}

function initCircuitBuilder(){
  const lvl = CIRCUIT_LEVELS[circuitLevel] || CIRCUIT_LEVELS.facil;
  const tray = document.getElementById('cbParts');
  const slotsWrap = document.getElementById('cbSlots');
  if(!tray || !slotsWrap) return;
  const res = document.getElementById('cbResult');
  if(res){ res.textContent=''; res.className='cb-result'; }
  tray.innerHTML='';
  const shuffled = [...lvl.parts].sort(()=>Math.random()-0.5);
  shuffled.forEach(p=>{
    const el = document.createElement('div');
    el.className='cb-part';
    el.draggable = true;
    el.dataset.id = p.id;
    // Show polarity hint on polarized parts
    let pol = '';
    if(p.id==='led' || p.id==='bateria' || p.id==='buzzer') pol = ' <small style="opacity:.7">(+ −)</small>';
    el.innerHTML = `${p.icon}<span>${p.label}${pol}</span>`;
    el.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', p.id); });
    tray.appendChild(el);
  });
  // Circuito CERRADO: camino de ida + retorno al negativo
  slotsWrap.innerHTML='';
  slotsWrap.className = 'cb-slots cb-closed-loop';
  const n = lvl.order.length;
  const top = document.createElement('div');
  top.className = 'cb-loop-top';
  const startLabel = document.createElement('div');
  startLabel.className = 'cb-pol-label';
  startLabel.innerHTML = '<b style="color:#4ade80">+</b><br><small>salida</small>';
  top.appendChild(startLabel);
  for(let i=0;i<n;i++){
    const slot = document.createElement('div');
    slot.className='cb-slot';
    slot.dataset.index = i;
    slot.dataset.filled = '';
    slot.textContent = `Espacio ${i+1}`;
    slot.addEventListener('dragover', e=>e.preventDefault());
    slot.addEventListener('drop', e=>{
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      placeInSlot(slot, id);
    });
    top.appendChild(slot);
    if(i<n-1){
      const wire = document.createElement('div');
      wire.className='cb-wire';
      top.appendChild(wire);
    }
  }
  const endLabel = document.createElement('div');
  endLabel.className = 'cb-pol-label';
  endLabel.innerHTML = '<b style="color:#f87171">−</b><br><small>regreso</small>';
  top.appendChild(endLabel);
  slotsWrap.appendChild(top);
  const bottom = document.createElement('div');
  bottom.className = 'cb-loop-bottom';
  bottom.innerHTML = '<span class="cb-return-wire"></span><span class="cb-return-label">↩ Camino de regreso al (−) de la pila — circuito cerrado</span><span class="cb-return-wire"></span>';
  slotsWrap.appendChild(bottom);
}
function placeInSlot(slot, id){
  if(slot.dataset.filled) return;
  const lvl = CIRCUIT_LEVELS[circuitLevel] || CIRCUIT_LEVELS.facil;
  const part = lvl.parts.find(p=>p.id===id);
  if(!part) return;
  const trayItem = document.querySelector(`#cbParts .cb-part[data-id="${id}"]`);
  if(!trayItem || trayItem.classList.contains('used')) return;
  slot.dataset.filled = id;
  slot.classList.add('filled');
  slot.innerHTML = `${part.icon}<span>${part.label}</span>`;
  trayItem.classList.add('used');
}
function testCircuit(){
  const lvl = CIRCUIT_LEVELS[circuitLevel] || CIRCUIT_LEVELS.facil;
  const slots = [...document.querySelectorAll('#cbSlots .cb-slot')];
  const order = slots.map(s=>s.dataset.filled);
  const result = document.getElementById('cbResult');
  const labels = {bateria:'Pila', resistencia:'Resistencia', led:'LED', interruptor:'Interruptor', buzzer:'Buzzer'};
  if(order.includes('')){
    const empty = order.map((x,i)=>x?'':(i+1)).filter(Boolean);
    result.innerHTML = `⚠️ Faltan piezas en el espacio ${empty.join(', ')}. Completa el camino del (+) al (−) antes de probar.`;
    result.className = 'cb-result bad';
    return;
  }
  const correct = JSON.stringify(order) === JSON.stringify(lvl.order);
  if(correct){
    result.innerHTML = '✅ ¡Circuito cerrado correcto! La corriente sale del <b>(+)</b>, pasa por los componentes y regresa al <b>(−)</b>.';
    if(window.PG){ PG.sfxWin(); PG.confetti(45); PG.toast('🔌 ¡Circuito armado!'); PG.award('circuito','Constructor de Circuitos'); }
    result.className = 'cb-result ok';
    slots.forEach(s=>s.style.borderColor='#4ade80');
  } else {
    // Feedback específico por posición
    const tips = [];
    slots.forEach((s,i)=>{
      const got = order[i], need = lvl.order[i];
      if(got !== need){
        s.style.borderColor = '#ff5c5c';
        tips.push(`Espacio ${i+1}: pusiste <b>${labels[got]||got}</b>, debería ir <b>${labels[need]||need}</b>`);
      } else {
        s.style.borderColor = '#4ade80';
      }
    });
    // Reglas didácticas extra
    const hasBattFirst = order[0] === 'bateria';
    const hasLed = order.includes('led');
    const hasR = order.includes('resistencia');
    let extra = '';
    if(!hasBattFirst) extra += '<li>La <b>pila</b> debe estar al inicio: de ahí sale la corriente (+).</li>';
    if(hasLed && !hasR) extra += '<li>Sin <b>resistencia</b> el LED puede quemarse: siempre protégelo.</li>';
    if(order.indexOf('led') < order.indexOf('resistencia') && hasR && hasLed)
      extra += '<li>La resistencia conviene <b>antes</b> del LED para limitar la corriente.</li>';
    result.innerHTML = `❌ El circuito aún no está bien cerrado.<ul style="text-align:left;margin:8px auto;max-width:420px;line-height:1.45;">${tips.map(t=>'<li>'+t+'</li>').join('')}${extra}</ul><p style="margin-top:6px;opacity:.9">Pista: <b>${lvl.hint}</b></p>`;
    result.className = 'cb-result bad';
    if(window.PG && PG.sfxBad) try{ PG.sfxBad(); }catch(e){}
  }
}
initCircuitBuilder();

/* ============================================================
   JUEGO 3: POLARIDAD
   ============================================================ */
const POL_ITEMS = [
  {name:'LED', correct:'A', svg:(hi)=>`<svg viewBox="0 0 200 180">
    <polygon points="70,55 70,105 110,80" fill="#ff4d5e" stroke="#ff4d5e" stroke-width="2"/>
    <line x1="110" y1="55" x2="110" y2="105" stroke="#ff4d5e" stroke-width="4"/>
    <line x1="30" y1="80" x2="70" y2="80" stroke="#ffd23f" stroke-width="4"/>
    <line x1="110" y1="80" x2="150" y2="80" stroke="#ffd23f" stroke-width="4"/>
    <g stroke="#ff4d5e" stroke-width="2" fill="none" stroke-linecap="round">
      <line x1="95" y1="35" x2="103" y2="27"/><polyline points="96,27 103,27 103,34"/>
      <line x1="103" y1="41" x2="111" y2="33"/><polyline points="104,33 111,33 111,40"/>
    </g>
    <line x1="30" y1="80" x2="30" y2="150" stroke="${hi==='A'?'#ffd23f':'#7a7a7a'}" stroke-width="5"/>
    <line x1="150" y1="80" x2="150" y2="150" stroke="${hi==='B'?'#ffd23f':'#7a7a7a'}" stroke-width="5"/>
    <text x="30" y="168" fill="#fef8ec" text-anchor="middle" font-size="16">A</text>
    <text x="150" y="168" fill="#fef8ec" text-anchor="middle" font-size="16">B</text>
    <text x="30" y="20" fill="#fef8ec" text-anchor="middle" font-size="12">ánodo (+)</text>
    <text x="150" y="20" fill="#fef8ec" text-anchor="middle" font-size="12">cátodo (−)</text>
  </svg>`, hint:'El ánodo (+) está en el lado de entrada del diodo y el cátodo (−) se identifica con la barra.'},
  {name:'Pila / Batería', correct:'B', svg:(hi)=>`<svg viewBox="0 0 200 180">
    <rect x="50" y="60" width="100" height="60" rx="6" fill="none" stroke="#ff8a3d" stroke-width="4"/>
    <rect x="150" y="78" width="16" height="24" fill="#ff8a3d"/>
    <text x="65" y="98" fill="${hi==='A'?'#ffd23f':'#fef8ec'}" font-size="26">−</text>
    <text x="150" y="98" fill="${hi==='B'?'#ffd23f':'#fef8ec'}" font-size="26">+</text>
    <text x="60" y="145" fill="#fef8ec" text-anchor="middle" font-size="16">A</text>
    <text x="158" y="145" fill="#fef8ec" text-anchor="middle" font-size="16">B</text>
  </svg>`, hint:'En una pila AA, el botón metálico saliente identifica el terminal positivo (+).'},
  {name:'Capacitor electrolítico', correct:'A', svg:(hi)=>`<svg viewBox="0 0 200 180">
    <line x1="80" y1="45" x2="80" y2="125" stroke="#4dd8ff" stroke-width="5"/>
    <path d="M120 45 Q90 85 120 125" fill="none" stroke="#4dd8ff" stroke-width="5"/>
    <line x1="80" y1="125" x2="80" y2="155" stroke="${hi==='A'?'#ffd23f':'#7a7a7a'}" stroke-width="5"/>
    <line x1="120" y1="125" x2="120" y2="155" stroke="${hi==='B'?'#ffd23f':'#7a7a7a'}" stroke-width="5"/>
    <text x="67" y="35" fill="#fef8ec" font-size="14">+</text>
    <text x="133" y="35" fill="#fef8ec" font-size="14">−</text>
    <text x="80" y="175" fill="#fef8ec" text-anchor="middle" font-size="16">A</text>
    <text x="120" y="175" fill="#fef8ec" text-anchor="middle" font-size="16">B</text>
  </svg>`, hint:'En este capacitor electrolítico, A está marcado como positivo (+) y B como negativo (−).'}
];
let polState = {order:[], idx:0, score:0, answered:false, total:5};
let polLevel = 'facil';

function setPolLevel(level){
  polLevel = level;
  if(level==='facil') polState.total = 5;
  else if(level==='normal') polState.total = 7;
  else polState.total = Math.min(10, POL_ITEMS.length);
  document.querySelectorAll('.pol-level-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.level===level);
  });
  const tot = document.getElementById('polTotal');
  if(tot) tot.textContent = polState.total;
  initPolarity();
}

function initPolarity(){
  if(typeof polState.total === 'undefined') polState.total = 5;
  const n = Math.min(polState.total, POL_ITEMS.length);
  polState.order = [...POL_ITEMS.keys()].sort(()=>Math.random()-0.5).slice(0, n);
  polState.idx = 0; polState.score = 0; polState.answered=false;
  const sc = document.getElementById('polScore');
  const tot = document.getElementById('polTotal');
  if(sc) sc.textContent = 0;
  if(tot) tot.textContent = n;
  renderPolarity();
}
function renderPolarity(){
  const item = POL_ITEMS[polState.order[polState.idx]];
  document.getElementById('polItem').innerHTML = `<h3 style="text-align:center;margin-bottom:6px;">${item.name}</h3>${item.svg('')}`;
  document.getElementById('polFeedback').textContent='';
  document.getElementById('polFeedback').className='feedback';
  polState.answered=false;
}
function answerPolarity(choice){
  if(polState.answered) return;
  polState.answered = true;
  const item = POL_ITEMS[polState.order[polState.idx]];
  const fb = document.getElementById('polFeedback');
  document.getElementById('polItem').innerHTML = `<h3 style="text-align:center;margin-bottom:6px;">${item.name}</h3>${item.svg(choice)}`;
  if(choice === item.correct){
    polState.score++;
    document.getElementById('polScore').textContent = polState.score;
    fb.textContent = '✅ ¡Correcto! ' + item.hint;
    if(window.PG){ PG.sfxOk(); }
    if(polState.score >= polState.total && window.PG){ PG.award('polar','Maestro de la Polaridad'); PG.confetti(40); PG.toast('🔋 ¡Polaridad dominada!'); if(typeof saveScore==='function') saveScore('polar_score', polState.score); }
    fb.className = 'feedback ok';
  } else {
    fb.textContent = '❌ Casi. ' + item.hint;
    if(window.PG){ PG.sfxBad(); }
    fb.className = 'feedback bad';
  }
  setTimeout(()=>{
    polState.idx++;
    if(polState.idx >= polState.order.length){
      document.getElementById('polItem').innerHTML = `<h3 style="text-align:center;">🏁 Terminaste: ${polState.score}/${polState.order.length}</h3>`;
      document.getElementById('polFeedback').innerHTML = '<button class="btn" onclick="initPolarity()">Jugar de nuevo</button>';
      document.getElementById('polFeedback').className='feedback';
    } else {
      renderPolarity();
    }
  }, 1900);
}
initPolarity();

/* ============================================================
   JUEGO 4: SERIE VS PARALELO
   ============================================================ */
function switchSP(view){
  document.querySelectorAll('.sp-tab').forEach(t=>t.classList.toggle('active', t.dataset.view===view));
  var vs = document.getElementById('view-serie');
  var vp = document.getElementById('view-paralelo');
  if(vs) vs.classList.toggle('active', view==='serie');
  if(vp) vp.classList.toggle('active', view==='paralelo');
  if(view==='serie' && typeof renderSerie==='function') renderSerie();
  if(view==='paralelo' && typeof renderParalelo==='function') renderParalelo();
}
function ledSVG(on){
  // Patita larga = ánodo (+), patita corta = cátodo (−)
  return `<svg class="led-visual" viewBox="0 0 90 95">
    <path d="M28 52 V30 A16 16 0 0 1 60 30 V52 Z" fill="${on?'#ff4d5e':'#2a2a2a'}" stroke="${on?'#ffb454':'#666'}" stroke-width="2.5" style="filter:${on?'drop-shadow(0 0 12px #ff4d5e)':'none'}"/>
    <rect x="28" y="50" width="32" height="6" fill="#5a3030"/>
    <!-- lado plano del cátodo -->
    <line x1="28" y1="30" x2="28" y2="52" stroke="#888" stroke-width="2"/>
    <!-- patita LARGA = + (ánodo) derecha -->
    <line x1="58" y1="56" x2="58" y2="88" stroke="${on?'#4ade80':'#888'}" stroke-width="3"/>
    <text x="58" y="94" text-anchor="middle" font-size="9" fill="#4ade80" font-weight="700">+</text>
    <!-- patita CORTA = − (cátodo) izquierda -->
    <line x1="32" y1="56" x2="32" y2="78" stroke="${on?'#f87171':'#888'}" stroke-width="3"/>
    <text x="32" y="90" text-anchor="middle" font-size="9" fill="#f87171" font-weight="700">−</text>
  </svg>`;
}
function switchSVG(on){
  return `<svg viewBox="0 0 60 40" style="width:50px;height:34px;">
    <circle cx="8" cy="30" r="4" fill="#ffd23f"/><circle cx="52" cy="30" r="4" fill="#ffd23f"/>
    <line x1="8" y1="30" x2="${on?'50':'34'}" y2="${on?'30':'14'}" stroke="${on?'#4ade80':'#ff5c5c'}" stroke-width="4"/>
  </svg>`;
}


/* ============================================================
   JUEGO: SERIE VS PARALELO (SVG conectado + objetivo)
   ============================================================ */
var serieSwitches = [true, true, true];
var paraSwitches = [true, true, true];
var spGoalDone = { serie: false, paralelo: false };

function renderSerie(){
  var wrap = document.getElementById('serieCircuit');
  if(!wrap) return;
  var allOn = serieSwitches[0] && serieSwitches[1] && serieSwitches[2];
  var goal;
  if(allOn){
    goal = '🎯 Objetivo: toca <b>un</b> interruptor (SW) y ábrelo. En serie, si se abre uno, se apagan <b>todos</b> los LEDs.';
  } else {
    goal = '✅ ¡Bien! El camino se cortó y se apagaron <b>todos</b>. Así funciona la serie.';
    if(!spGoalDone.serie && window.PG){ spGoalDone.serie = true; PG.sfxOk(); PG.toast('💡 Serie entendida'); }
  }

  function swBtn(i){
    var on = serieSwitches[i];
    var col = on ? '#4ade80' : '#f87171';
    return '<button type="button" onclick="toggleSerie('+i+')" style="margin:0 2px;padding:8px 10px;border-radius:12px;border:2px solid '+col+';background:#0a1f18;color:#fef8ec;font-weight:800;cursor:pointer;">SW'+(i+1)+' '+(on?'ON':'OFF')+'</button>';
  }
  function ledDot(on, n){
    var bg = on ? '#ff4d5e' : '#333';
    var sh = on ? '0 0 14px #ff4d5e' : 'none';
    return '<div style="display:inline-flex;flex-direction:column;align-items:center;margin:0 4px;"><div style="width:26px;height:26px;border-radius:50%;background:'+bg+';box-shadow:'+sh+';border:2px solid #888;"></div><span style="font-size:11px;margin-top:3px;">LED'+n+'</span></div>';
  }

  var html = '';
  html += '<div style="max-width:540px;margin:0 auto;padding:16px;border:2px solid #fde047;border-radius:18px;background:#071a14;">';
  html += '<div style="text-align:center;font-size:13px;color:#4ade80;font-weight:800;margin-bottom:8px;">CIRCUITO EN SERIE — un solo camino</div>';
  // closed loop box
  html += '<div style="border:3px solid #fde047;border-radius:14px;padding:14px 10px;position:relative;">';
  html += '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;">';
  html += '<div style="text-align:center;"><div style="color:#4ade80;font-weight:800;">+</div><div style="font-size:28px;">🔋</div><div style="color:#fb923c;font-weight:800;">−</div></div>';
  html += '<span style="color:#fde047;font-size:20px;">━</span>';
  for(var i=0;i<3;i++){
    html += swBtn(i);
    html += '<span style="color:#fb923c;font-weight:800;">R</span>';
    html += ledDot(allOn, i+1);
    if(i<2) html += '<span style="color:#fde047;font-size:20px;">━</span>';
  }
  html += '</div>';
  html += '<div style="text-align:center;margin-top:10px;font-size:12px;color:#fde047;">↺ cable de retorno al negativo de la pila</div>';
  html += '</div>';
  html += '<p style="text-align:center;margin:12px 0 0;font-size:14px;line-height:1.45;">'+goal+'</p>';
  html += '<p style="text-align:center;margin:6px 0 0;font-weight:800;color:'+(allOn?'#4ade80':'#f87171')+';">'+(allOn?'⚡ Hay corriente':'⛔ No hay corriente')+'</p>';
  html += '</div>';
  wrap.innerHTML = html;
}

function toggleSerie(i){
  serieSwitches[i] = !serieSwitches[i];
  renderSerie();
}

function renderParalelo(){
  var wrap = document.getElementById('paraleloCircuit');
  if(!wrap) return;

  var goal;
  if(paraSwitches[0] && paraSwitches[1] && paraSwitches[2]){
    goal = '🎯 Objetivo: apaga <b>solo SW2</b>. LED1 y LED3 deben seguir encendidos.';
  } else if(!paraSwitches[1] && paraSwitches[0] && paraSwitches[2]){
    goal = '✅ ¡Exacto! En paralelo, una rama apagada <b>no apaga</b> las otras.';
    if(!spGoalDone.paralelo && window.PG){ spGoalDone.paralelo = true; PG.sfxOk(); PG.toast('💡 Paralelo entendido'); }
  } else {
    goal = 'Cada rama tiene su propio camino del <b style="color:#4ade80">+</b> al <b style="color:#fb923c">−</b>.';
  }

  function swBtn(i){
    var on = paraSwitches[i];
    var col = on ? '#4ade80' : '#f87171';
    return '<button type="button" onclick="toggleParalelo('+i+')" style="padding:8px 10px;border-radius:12px;border:2px solid '+col+';background:#0a1f18;color:#fef8ec;font-weight:800;cursor:pointer;">SW'+(i+1)+' '+(on?'ON':'OFF')+'</button>';
  }
  function ledDot(on, n){
    var bg = on ? '#ff4d5e' : '#333';
    var sh = on ? '0 0 14px #ff4d5e' : 'none';
    return '<div style="display:flex;flex-direction:column;align-items:center;"><div style="width:26px;height:26px;border-radius:50%;background:'+bg+';box-shadow:'+sh+';border:2px solid #888;"></div><span style="font-size:11px;margin-top:3px;">LED'+n+'</span></div>';
  }

  var html = '';
  html += '<div style="max-width:480px;margin:0 auto;padding:16px;border:2px solid #fde047;border-radius:18px;background:#071a14;">';
  html += '<div style="text-align:center;font-size:13px;color:#4ade80;font-weight:800;margin-bottom:8px;">CIRCUITO EN PARALELO — varios caminos</div>';
  html += '<div style="text-align:center;margin-bottom:6px;"><span style="color:#4ade80;font-weight:800;">+</span> 🔋 <span style="color:#fb923c;font-weight:800;">−</span></div>';
  // top rail
  html += '<div style="height:5px;background:#fde047;border-radius:3px;margin:0 8px 12px;"></div>';
  html += '<div style="display:flex;justify-content:space-around;gap:10px;">';
  for(var i=0;i<3;i++){
    var on = paraSwitches[i];
    html += '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;">';
    html += '<div style="width:5px;height:16px;background:#fde047;"></div>';
    html += '<div style="font-size:11px;opacity:0.85;">RAMA '+(i+1)+'</div>';
    html += swBtn(i);
    html += '<div style="color:#fb923c;font-weight:800;font-size:12px;">R</div>';
    html += ledDot(on, i+1);
    html += '<div style="width:5px;height:16px;background:#fde047;"></div>';
    html += '</div>';
  }
  html += '</div>';
  // bottom rail
  html += '<div style="height:5px;background:#fde047;border-radius:3px;margin:12px 8px 0;"></div>';
  html += '<p style="text-align:center;margin:12px 0 0;font-size:14px;line-height:1.45;">'+goal+'</p>';
  html += '</div>';
  wrap.innerHTML = html;
}

function toggleParalelo(i){
  paraSwitches[i] = !paraSwitches[i];
  renderParalelo();
}

// dibujar cuando el DOM este listo
function initSerieParalelo(){
  renderSerie();
  renderParalelo();
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initSerieParalelo);
} else {
  initSerieParalelo();
}




/* ============================================================
   JUEGO: QUIZ — un set de preguntas por nivel
   ============================================================ */
const QUIZ_PRIMARIA = [
  {q:'¿Qué función cumple una resistencia en un circuito con LED?', opts:['Aumenta la corriente','Limita la corriente y protege al LED','Produce luz','Almacena energía'], correct:1, diagram:ICONS.resistencia},
  {q:'¿Cuál es el terminal positivo de un LED en el símbolo?', opts:['El cátodo, marcado por la barra','El ánodo, en el lado de entrada del diodo','Cualquiera, porque no tiene polaridad','La resistencia'], correct:1, diagram:ICONS.led},
  {q:'¿Qué puede pasar si conectamos un LED sin resistencia a una pila?', opts:['Puede recibir demasiada corriente y dañarse','La pila deja de funcionar','El LED se convierte en interruptor','No ocurre nada'], correct:0},
  {q:'¿Cuál de estos componentes NO tiene polaridad?', opts:['LED','Pila','Resistencia','Capacitor electrolítico'], correct:2},
  {q:'¿Qué hace un interruptor?', opts:['Almacena energía','Abre o cierra el paso de corriente','Cambia la resistencia con la luz','Produce sonido'], correct:1, diagram:ICONS.interruptor},
  {q:'Si en un circuito en paralelo se apaga un LED, ¿qué pasa con los demás?', opts:['También se apagan todos','Siguen encendidos','Se queman','Cambian de color'], correct:1}
];
let quizState = {idx:0, score:0, answered:false};
function initQuiz(){
  quizState = {idx:0, score:0, answered:false};
  renderQuiz();
}
function renderQuiz(){
  const QUIZ = QUIZ_PRIMARIA;
  const panel = document.getElementById('quizPanel');
  if(quizState.idx >= QUIZ.length){
    if(window.PG){
      if(typeof saveScore==='function') saveScore('quiz_score', quizState.score);
      if(quizState.score === QUIZ.length){ PG.award('quiz','Genio del Quiz'); PG.confetti(60); PG.sfxWin(); }
      else if(quizState.score >= Math.ceil(QUIZ.length*0.6)){ PG.toast('🏆 ¡Buen resultado en el Quiz!'); PG.sfxOk(); }
    }
    panel.innerHTML = `<div class="quiz-final">
      <div style="font-size:0.8rem;opacity:0.7;font-family:'Space Mono',monospace;">RESULTADO FINAL</div>
      <div class="score">${quizState.score}/${QUIZ.length}</div>
      <p style="opacity:0.8;">${quizState.score===QUIZ.length ? '¡Perfecto! Eres un experto en electrónica ⚡' : quizState.score>=Math.ceil(QUIZ.length*0.6) ? '¡Muy bien! Ya dominas los conceptos clave.' : 'Sigue explorando los juegos de arriba para reforzar 💪'}</p>
      <button class="btn" onclick="initQuiz()">Intentar de nuevo</button>
    </div>`;
    return;
  }
  const q = QUIZ[quizState.idx];
  quizState.answered = false;
  let progress = '';
  for(let i=0;i<QUIZ.length;i++) progress += `<div class="${i<quizState.idx?'done':''}"></div>`;
  panel.innerHTML = `
    <div class="quiz-progress">${progress}</div>
    <div class="quiz-q">${quizState.idx+1}. ${q.q}</div>
    ${q.diagram ? `<div class="quiz-diagram">${q.diagram}</div>` : ''}
    <div class="quiz-opts" id="quizOpts"></div>`;
  const optsWrap = document.getElementById('quizOpts');
  q.opts.forEach((opt,i)=>{
    const btn = document.createElement('button');
    btn.className='quiz-opt';
    btn.textContent = opt;
    btn.onclick = ()=>answerQuiz(i);
    optsWrap.appendChild(btn);
  });
}
function answerQuiz(i){
  if(quizState.answered) return;
  quizState.answered = true;
  const QUIZ = QUIZ_PRIMARIA;
  const q = QUIZ[quizState.idx];
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach((o,idx)=>{
    if(idx===q.correct) o.classList.add('correct');
    else if(idx===i) o.classList.add('wrong');
  });
  if(i===q.correct) quizState.score++;
  setTimeout(()=>{
    quizState.idx++;
    renderQuiz();
  }, 1100);
}

/* ============================================================
   LABORATORIO DE CIRCUITOS — simulador libre, sin login
   Motor: Union-Find. Un LED enciende si su terminal 'a' (ánodo)
   queda en el mismo grupo que el (+) de la pila, y su terminal
   'b' (cátodo) queda en el mismo grupo que el (−) de la pila,
   siguiendo cables + resistencias (siempre conducen) + interruptores
   cerrados. Se itera para permitir LEDs en serie.
   ============================================================ */
let lab = { instances: [], wires: [], nextId: 1, lastResult: null };
const LAB_LIMITS = {bateria:1, resistencia:4, led:4, interruptor:2, motor:2, buzzer:2, pulsador:2, diodo:2, capacitor:2, ldr:2, potenciometro:2, fusible:1};
const LAB_LABELS = {bateria:'PILA', resistencia:'RESISTENCIA', led:'LED', interruptor:'INTERRUPTOR', motor:'MOTOR', buzzer:'BUZZER', pulsador:'PULSADOR', diodo:'DIODO', capacitor:'CAPACITOR', ldr:'LDR', potenciometro:'POT', fusible:'FUSIBLE'};

/* valores reales editables: click (sin arrastrar) en la pila o la resistencia
   para ciclar entre valores comunes, como un multímetro/selector real */
const RESISTOR_VALUES = [100,220,330,470,680,1000,2200,4700,10000];
const BATTERY_VOLTAGES = [1.5,3,4.5,6,9,12];
const LED_COLORS = {
  red:   {hex:'#c0505a', lit:'#ff5c5c', vf:2.0},
  yellow:{hex:'#b3922b', lit:'#ffd23f', vf:2.1},
  green: {hex:'#3d7a52', lit:'#4ade80', vf:2.2},
  blue:  {hex:'#3a5f8a', lit:'#4dd8ff', vf:3.2},
  white: {hex:'#8a8a80', lit:'#ffffff', vf:3.2}
};
const LED_COLOR_KEYS = Object.keys(LED_COLORS);
const RESISTOR_BAND_COLORS = {
  100:['brown','black','brown'], 220:['red','red','brown'], 330:['orange','orange','brown'],
  470:['yellow','violet','brown'], 680:['blue','gray','brown'], 1000:['brown','black','red'],
  2200:['red','red','red'], 4700:['yellow','violet','red'], 10000:['brown','black','orange']
};
const COLOR_HEX = {black:'#1a1a1a',brown:'#6b4423',red:'#d61f1f',orange:'#ff8a3d',yellow:'#e8c700',green:'#2e8b57',blue:'#3a6ea5',violet:'#8a3fd6',gray:'#8a8a8a',white:'#f0f0f0'};
function labResLabel(v){ return v>=1000 ? (v/1000)+'kΩ' : v+'Ω'; }
function labVLabel(v){ return v+'V'; }
const 
LAB_GRID = 20;

/* ===== Protoboard real: agujeros con nodos eléctricos ===== */
const BB = {
  ox: 30, oy: 52,
  pitch: 15,
  cols: 42,
  rowsTop: 5,
  rowsBot: 5,
  railTopY: 22,
  railBotY: 358,
  railOx: 30,
  // canal visual entre top y bot
  get channelY(){ return this.oy + this.rowsTop * this.pitch + 6; },
  get botOy(){ return this.oy + this.rowsTop * this.pitch + 18; }
};
function bbHoleXY(col, row, zone){
  col = Math.max(0, Math.min(BB.cols-1, col|0));
  row = Math.max(0, Math.min(4, row|0));
  if(zone==='rail+') return {x: BB.railOx + col*BB.pitch, y: BB.railTopY};
  if(zone==='rail-') return {x: BB.railOx + col*BB.pitch, y: BB.railBotY};
  const x = BB.ox + col*BB.pitch;
  if(zone==='top') return {x, y: BB.oy + row*BB.pitch};
  return {x, y: BB.botOy + row*BB.pitch};
}
function bbNetId(zone, col, row){
  if(zone==='rail+') return 'RAIL_POS';
  if(zone==='rail-') return 'RAIL_NEG';
  // tira vertical: toda la columna de esa mitad es el mismo nodo (como protoboard)
  if(zone==='top') return 'T'+col;
  return 'B'+col;
}
function bbParseHole(hid){
  if(!hid || typeof hid!=='string') return null;
  const p = hid.split(':');
  if(p[0]==='rail+'||p[0]==='rail-') return {zone:p[0], col:+p[1]||0, row:0};
  return {zone:p[0], col:+p[1]||0, row:+p[2]||0};
}
function bbHoleId(zone, col, row){
  if(zone==='rail+'||zone==='rail-') return zone+':'+col;
  return zone+':'+col+':'+row;
}


function labAddComponent(type){
  const count = lab.instances.filter(i=>i.type===type).length;
  if(count >= (LAB_LIMITS[type]||4)) return;
  const id = type+'_'+(lab.nextId++);
  const idx = lab.instances.length;
  const col = idx % 4, row = Math.floor(idx/4);
  const inst = {id, type, x: 20+col*165, y: 55+row*100, closed:true};
  if(type==='resistencia') inst.value = 220;
  if(type==='bateria') inst.voltage = 9;
  if(type==='led') inst.color = 'red';
  if(type==='pulsador') inst.closed = false; // se mantiene pulsado al hacer clic
  if(type==='diodo') inst.closed = true;
  if(type==='capacitor') inst.value = 100; // µF (simbólico en DC)
  if(type==='ldr'){ inst.value = 5000; inst.light = true; } // ohms: luz=bajo, oscuro=alto
  if(type==='potenciometro') inst.value = 5000;
  if(type==='fusible'){ inst.closed = true; inst.blown = false; }
  lab.instances.push(inst);
  lab.lastResult = null;
  renderLab();
}
function labRemoveInstance(id){
  lab.instances = lab.instances.filter(i=>i.id!==id);
  lab.wires = lab.wires.filter(([a,b])=>!a.startsWith(id+'_') && !b.startsWith(id+'_'));
  lab.lastResult = null;
  renderLab();
}
function labTermPos(id, suffix){
  const inst = lab.instances.find(i=>i.id===id);
  if(!inst) return null;
  const hid = suffix==='a' ? inst.holeA : inst.holeB;
  if(hid){
    const h = bbParseHole(hid);
    if(h) return bbHoleXY(h.col, h.row, h.zone);
  }
  // fallback cuerpo libre
  return {x: inst.x + (suffix==='a'?0:100), y: inst.y+28};
}
function labAssignDefaultHoles(inst){
  // Cada componente nuevo ocupa 2 columnas libres en la zona TOP (arriba del canal)
  const usedCols = new Set();
  lab.instances.forEach(o=>{
    [o.holeA, o.holeB].forEach(hid=>{
      const h = bbParseHole(hid);
      if(h && h.zone==='top') usedCols.add(h.col);
    });
  });
  let baseCol = 1;
  while(usedCols.has(baseCol) || usedCols.has(baseCol+1) || usedCols.has(baseCol+2) || usedCols.has(baseCol+3)){
    baseCol += 4;
    if(baseCol > BB.cols-5) { baseCol = 1; break; }
  }
  const row = 2; // fila del medio de la tira superior
  inst.holeA = bbHoleId('top', baseCol, row);
  inst.holeB = bbHoleId('top', baseCol+3, row);
  labLayoutFromHoles(inst);
}

function labLayoutFromHoles(inst){
  if(!inst.holeA || !inst.holeB) return;
  const pa = labTermPos(inst.id,'a');
  const pb = labTermPos(inst.id,'b');
  if(!pa || !pb) return;
  const ha = bbParseHole(inst.holeA);
  const hb = bbParseHole(inst.holeB);
  // Pila en rieles: cuerpo a la izquierda entre riel + y −
  if(inst.type==='bateria' && ha && hb &&
     ((ha.zone==='rail+' && hb.zone==='rail-') || (ha.zone==='rail-' && hb.zone==='rail+'))){
    const x = Math.min(pa.x, pb.x) + 36;
    inst.x = Math.max(8, x - 50);
    inst.y = 160;
    return;
  }
  const midX = (pa.x + pb.x) / 2;
  const pinY = Math.min(pa.y, pb.y);
  inst.x = midX - 50;
  inst.y = Math.max(42, pinY - 56);
}

function labPinNet(inst, suffix){
  const hid = suffix==='a' ? inst.holeA : inst.holeB;
  const h = bbParseHole(hid);
  if(!h) return null;
  return bbNetId(h.zone, h.col, h.row);
}
function labParseKey(key){
  const idx = key.lastIndexOf('_');
  return {id:key.slice(0,idx), suffix:key.slice(idx+1)};
}

let labDragMode = null;
let labDragData = null;
let labPendingTerminal = null;
let labPendingHole = null; // agujero de protoboard seleccionado
 // click-to-connect: first terminal selected

/* ---- dibujo de una pieza según su tipo, con estética "protoboard" ---- */
function labDrawComponentArt(inst, diag){
  const x=inst.x, y=inst.y, cx=x+50, cy=y+28;
  const active = diag && diag.active;
  const ledDef = LED_COLORS[inst.color||'red'];
  const glowColor = inst.type==='led' ? (diag.status==='danger' ? '#ffffff' : ledDef.lit) : '#ffd23f';
  const glowRadius = active ? (inst.type==='led' ? 4 + 14*(diag.brightness||0) : 8) : 0;
  const glow = active ? `style="filter:drop-shadow(0 0 ${glowRadius}px ${glowColor})"` : '';
  if(inst.type==='resistencia'){
    const bands = RESISTOR_BAND_COLORS[inst.value] || RESISTOR_BAND_COLORS[220];
    return `<rect x="${x+18}" y="${y+14}" width="64" height="28" rx="6" fill="#d9c8a0" stroke="#8a7a55" stroke-width="1.5"/>
      <rect x="${x+30}" y="${y+14}" width="6" height="28" fill="${COLOR_HEX[bands[0]]}"/>
      <rect x="${x+40}" y="${y+14}" width="6" height="28" fill="${COLOR_HEX[bands[1]]}"/>
      <rect x="${x+50}" y="${y+14}" width="6" height="28" fill="${COLOR_HEX[bands[2]]}"/>
      <rect x="${x+66}" y="${y+14}" width="6" height="28" fill="#d4af37"/>`;
  }
  if(inst.type==='led'){
    // Solo marca; el dibujo real del LED se hace en renderLab con las posiciones de agujeros
    return '';
  }
  if(inst.type==='bateria'){
    return `<rect x="${x+12}" y="${y+12}" width="76" height="34" rx="3" fill="#2c2c2c" stroke="#111" stroke-width="1.5"/>
      <rect x="${x+12}" y="${y+12}" width="28" height="34" rx="3" fill="#c62828"/>
      <rect x="${x+42}" y="${y+4}" width="16" height="10" rx="2" fill="#bdbdbd" stroke="#757575"/>
      <text x="${x+26}" y="${y+34}" text-anchor="middle" fill="#fff" style="font-size:10px;font-weight:800;pointer-events:none;">+</text>
      <text x="${x+62}" y="${y+34}" text-anchor="middle" fill="#eee" style="font-size:10px;font-weight:800;pointer-events:none;">−</text>
      <text x="${x+50}" y="${y+28}" text-anchor="middle" fill="#ffd54f" style="font-size:9px;font-weight:700;pointer-events:none;">${labVLabel(inst.voltage||9)}</text>`;
  }
  if(inst.type==='interruptor'){
    const on = inst.closed;
    return `<rect x="${x+26}" y="${y+18}" width="48" height="20" rx="10" fill="${on?'#2f6b45':'#6b2f2f'}" stroke="${on?'#4ade80':'#ff5c5c'}" stroke-width="1.5"/>
      <circle cx="${on? x+64 : x+36}" cy="${y+28}" r="8" fill="#fef8ec"/>`;
  }
  if(inst.type==='motor'){
    const spin = active ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="0.8s" repeatCount="indefinite"/>` : '';
    return `<circle cx="${cx}" cy="${cy}" r="20" fill="#3b3b3b" stroke="#8a8a8a" stroke-width="2"/>
      <g>${spin}
        <line x1="${cx-14}" y1="${cy}" x2="${cx+14}" y2="${cy}" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy-14}" x2="${cx}" y2="${cy+14}" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="4" fill="#fef8ec"/>`;
  }
  if(inst.type==='buzzer'){
    const rings = active ? `
      <circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#4dd8ff" stroke-width="2" opacity="0.8">
        <animate attributeName="r" values="10;22;10" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite"/>
      </circle>` : '';
    return `<circle cx="${cx}" cy="${cy}" r="18" fill="#e8e2d0" stroke="#8a7a55" stroke-width="2"/>
      ${[0,1,2].map(i=>`<circle cx="${cx-8+i*8}" cy="${cy}" r="1.6" fill="#6b6b6b"/>`).join('')}
      ${rings}`;
  }
  if(inst.type==='pulsador'){
    const down = inst.closed;
    return `<rect x="${x+30}" y="${y+14}" width="40" height="28" rx="6" fill="#455a64" stroke="#263238" stroke-width="1.5"/>
      <rect x="${x+38}" y="${y+(down?22:12)}" width="24" height="14" rx="4" fill="${down?'#4ade80':'#ef5350'}"/>
      <text x="${cx}" y="${y+50}" text-anchor="middle" fill="#aaa" style="font-size:8px">clic</text>`;
  }
  if(inst.type==='diodo'){
    const on = active;
    return `<polygon points="${x+28},${cy} ${x+55},${cy-14} ${x+55},${cy+14}" fill="${on?'#ffd54f':'#666'}" stroke="#333"/>
      <line x1="${x+55}" y1="${cy-14}" x2="${x+55}" y2="${cy+14}" stroke="#333" stroke-width="3"/>
      <text x="${x+22}" y="${y+14}" fill="#4ade80" style="font-size:9px;font-weight:700">A</text>
      <text x="${x+70}" y="${y+14}" fill="#f87171" style="font-size:9px;font-weight:700">K</text>`;
  }
  if(inst.type==='capacitor'){
    return `<line x1="${x+40}" y1="${y+12}" x2="${x+40}" y2="${y+44}" stroke="#333" stroke-width="3"/>
      <line x1="${x+52}" y1="${y+12}" x2="${x+52}" y2="${y+44}" stroke="#333" stroke-width="3"/>
      <line x1="${x+20}" y1="${cy}" x2="${x+40}" y2="${cy}" stroke="#555" stroke-width="2"/>
      <line x1="${x+52}" y1="${cy}" x2="${x+80}" y2="${cy}" stroke="#555" stroke-width="2"/>
      <text x="${cx}" y="${y+54}" text-anchor="middle" fill="#888" style="font-size:8px">${inst.value||100}µF</text>`;
  }
  if(inst.type==='ldr'){
    const light = inst.light !== false;
    return `<circle cx="${cx}" cy="${cy}" r="16" fill="${light?'#fff59d':'#37474f'}" stroke="#5d4037" stroke-width="2"/>
      <path d="M${cx-8} ${cy-6} L${cx+8} ${cy+6} M${cx+8} ${cy-6} L${cx-8} ${cy+6}" stroke="#5d4037" stroke-width="2"/>
      <text x="${cx}" y="${y+54}" text-anchor="middle" fill="#aaa" style="font-size:8px">${light?'luz':'oscuro'}</text>`;
  }
  if(inst.type==='potenciometro'){
    return `<circle cx="${cx}" cy="${cy}" r="16" fill="#6d4c41" stroke="#3e2723" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${cx+12}" y2="${cy-8}" stroke="#ffd23f" stroke-width="2.5" stroke-linecap="round"/>
      <text x="${cx}" y="${y+54}" text-anchor="middle" fill="#aaa" style="font-size:8px">${inst.value||5000}Ω</text>`;
  }
  if(inst.type==='fusible'){
    const blown = inst.blown;
    return `<rect x="${x+22}" y="${y+18}" width="56" height="20" rx="4" fill="${blown?'#b71c1c':'#eceff1'}" stroke="#546e7a" stroke-width="1.5"/>
      <line x1="${x+30}" y1="${cy}" x2="${x+70}" y2="${cy}" stroke="${blown?'#ff5252':'#37474f'}" stroke-width="2" stroke-dasharray="${blown?'4 3':'0'}"/>
      <text x="${cx}" y="${y+54}" text-anchor="middle" fill="${blown?'#ff5252':'#888'}" style="font-size:8px">${blown?'FUNDIDO':'OK'}</text>`;
  }
  return '';
}

function renderLab(){
  const svg = document.getElementById('labSvg');
  if(!svg) return;
  let html = `<defs>
    <pattern id="breadboardHoles" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.6" fill="#8a8070"/>
      <circle cx="10" cy="10" r="0.9" fill="#3d3830"/>
    </pattern>
    <filter id="wireGlow"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- Cuerpo protoboard -->
  <rect x="0" y="0" width="700" height="380" rx="12" fill="#d4c9a8"/>
  <rect x="4" y="4" width="692" height="372" rx="10" fill="none" stroke="#a89878" stroke-width="2"/>
  <!-- Riel positivo (rojo) -->
  <rect x="10" y="8" width="680" height="28" rx="4" fill="#e8c8c8"/>
  <rect x="14" y="12" width="4" height="20" rx="1" fill="#c62828"/>
  <text x="28" y="27" fill="#b71c1c" style="font-size:12px;font-weight:700;font-family:monospace;">+  Riel positivo (rojo)</text>
  <!-- Riel negativo (azul/negro) -->
  <rect x="10" y="344" width="680" height="28" rx="4" fill="#c5d0e0"/>
  <rect x="14" y="348" width="4" height="20" rx="1" fill="#1565c0"/>
  <text x="28" y="363" fill="#0d47a1" style="font-size:12px;font-weight:700;font-family:monospace;">−  Riel negativo (azul)</text>
  <!-- Zona central con agujeros -->
  <rect x="10" y="42" width="680" height="296" fill="#cfc4a4"/>`;
  // Canal entre zona top y bot (calculado)
  const cy = BB.channelY;
  html += `<rect x="10" y="${cy}" width="680" height="12" fill="#b8ad8e" opacity="0.95"/>
  <text x="350" y="${cy+10}" text-anchor="middle" fill="#5a5348" style="font-size:9px;font-family:monospace;">canal · misma columna = conectados</text>`;

  // --- Agujeros reales clicables ---
  const occupied = new Set();
  lab.instances.forEach(inst=>{
    const diag = (lab.lastResult && lab.lastResult.details[inst.id]) || {active:false};
    const active = diag.active;
    const isSwitch = inst.type==='interruptor';
    const boxClass = 'lab-comp-box' + (active?' lit':'') + (isSwitch ? (inst.closed?' switch-closed':' switch-open') : '') + (diag.status==='danger'?' danger':'');
    let labelText = LAB_LABELS[inst.type] || inst.type;
    if(inst.type==='resistencia') labelText = labResLabel(inst.value||220);
    if(inst.type==='bateria') labelText = 'PILA ' + labVLabel(inst.voltage||9);
    if(inst.type==='ldr') labelText = 'LDR ' + (inst.light===false?'oscuro':'luz');
    if(inst.type==='potenciometro') labelText = 'POT ' + (inst.value||5000) + 'Ω';
    if(inst.type==='fusible') labelText = inst.blown ? 'FUSIBLE ✕' : 'FUSIBLE';
    if(inst.type==='pulsador') labelText = inst.closed ? 'PULSADO' : 'PULSADOR';
    const pa = labTermPos(inst.id,'a') || {x:inst.x, y:inst.y+28};
    const pb = labTermPos(inst.id,'b') || {x:inst.x+100, y:inst.y+28};
    const clsA = 'wire-terminal' + (labPendingTerminal===inst.id+'_a'?' pending':'') + (lab.wires.some(([a,b])=>a===inst.id+'_a'||b===inst.id+'_a')?' connected':'');
    const clsB = 'wire-terminal' + (labPendingTerminal===inst.id+'_b'?' pending':'') + (lab.wires.some(([a,b])=>a===inst.id+'_b'||b===inst.id+'_b')?' connected':'');

    if(inst.type==='led'){
      const ledDef = LED_COLORS[inst.color||'red'];
      let domeColor = ledDef.hex || '#e53935';
      if(active){
        if(diag.status==='danger') domeColor = '#ffffff';
        else domeColor = ledDef.lit || domeColor;
      }
      // Ordenar: izquierda = + larga (a), derecha = - corta (b)
      var left = pa.x <= pb.x ? pa : pb;
      var right = pa.x <= pb.x ? pb : pa;
      var leftIsAnode = (pa.x <= pb.x); // a es anodo; si a esta a la izquierda, OK
      // Forzar: siempre dibujar + en terminal a y - en terminal b
      var anode = pa;   // +
      var cathode = pb; // -
      var midX = (anode.x + cathode.x) / 2;
      var holeY = Math.min(anode.y, cathode.y);
      var bodyY = holeY - 56;
      var glow = active ? ('filter:drop-shadow(0 0 14px '+domeColor+')') : '';

      html += '<g data-role="body" data-inst="'+inst.id+'">';
      // fondo opaco para que no se vean agujeros atras
      html += '<rect x="'+(midX-36)+'" y="'+(bodyY-4)+'" width="72" height="58" rx="12" fill="#d4c9a8" opacity="0.92"/>';
      // cupula LED opaca
      html += '<ellipse cx="'+midX+'" cy="'+(bodyY+26)+'" rx="20" ry="18" fill="'+domeColor+'" stroke="#4a1520" stroke-width="2" style="'+glow+'"/>';
      html += '<rect x="'+(midX-16)+'" y="'+(bodyY+36)+'" width="32" height="10" rx="2" fill="#1a0a10" stroke="#4a1520"/>';
      // lado plano = catodo (lado de pb / -)
      var flatX = cathode.x > anode.x ? (midX+18) : (midX-18);
      html += '<line x1="'+flatX+'" y1="'+(bodyY+14)+'" x2="'+flatX+'" y2="'+(bodyY+38)+'" stroke="#f5f5f5" stroke-width="3"/>';
      // PATA LARGA (+) = anodo a — mas gruesa y empieza mas arriba
      html += '<line x1="'+anode.x+'" y1="'+(bodyY+46)+'" x2="'+anode.x+'" y2="'+anode.y+'" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/>';
      // PATA CORTA (-) = catodo b — mas delgada y empieza mas abajo (se ve mas corta)
      html += '<line x1="'+cathode.x+'" y1="'+(bodyY+54)+'" x2="'+cathode.x+'" y2="'+cathode.y+'" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round"/>';
      // etiquetas claras
      html += '<text x="'+anode.x+'" y="'+(bodyY+8)+'" text-anchor="middle" fill="#14532d" font-size="11" font-weight="800">+ LARGA</text>';
      html += '<text x="'+cathode.x+'" y="'+(bodyY+8)+'" text-anchor="middle" fill="#9a3412" font-size="11" font-weight="800">- CORTA</text>';
      if(diag.status==='danger'){
        html += '<text x="'+midX+'" y="'+(bodyY-6)+'" text-anchor="middle" fill="#dc2626" font-size="11" font-weight="800">🔥 mucha corriente</text>';
      } else if(active){
        html += '<text x="'+midX+'" y="'+(bodyY-6)+'" text-anchor="middle" fill="#15803d" font-size="11">✓ encendido</text>';
      }
      html += '<circle class="'+clsA+'" data-role="terminal" data-key="'+inst.id+'_a" cx="'+anode.x+'" cy="'+anode.y+'" r="9" fill="#052e16" stroke="#16a34a" stroke-width="3"></circle>';
      html += '<circle class="'+clsB+'" data-role="terminal" data-key="'+inst.id+'_b" cx="'+cathode.x+'" cy="'+cathode.y+'" r="9" fill="#431407" stroke="#ea580c" stroke-width="3"></circle>';
      html += '<circle data-role="delete" data-inst="'+inst.id+'" cx="'+(midX+34)+'" cy="'+(bodyY+2)+'" r="9" fill="#fecaca" stroke="#dc2626" stroke-width="2"></circle>';
      html += '<text data-role="delete" data-inst="'+inst.id+'" x="'+(midX+34)+'" y="'+(bodyY+6)+'" text-anchor="middle" fill="#7f1d1d" style="font-size:12px;font-weight:800;pointer-events:none;">×</text>';
      html += '</g>';
    } else {
      html += '<g data-role="body" data-inst="'+inst.id+'">';
      html += '<rect class="'+boxClass+'" x="'+inst.x+'" y="'+inst.y+'" width="100" height="56" rx="10" fill-opacity="0.03"/>';
      html += labDrawComponentArt(inst, diag);
      html += '<text class="wire-comp-label" x="'+(inst.x+50)+'" y="'+(inst.y+52)+'" text-anchor="middle" style="font-size:9px;pointer-events:none;fill:#1a1a1a;font-weight:700;">'+labelText+(active?' ✓':'')+'</text>';
      if(isSwitch){
        html += '<text x="'+(inst.x+50)+'" y="'+(inst.y-4)+'" text-anchor="middle" fill="'+(inst.closed?'#2f6b45':'#8a2e2e')+'" style="font-size:9px;font-family:monospace;pointer-events:none;">'+(inst.closed?'CERRADO (toca)':'ABIERTO (toca)')+'</text>';
      } else if(inst.type==='bateria'){
        html += '<text x="'+(inst.x+50)+'" y="'+(inst.y-4)+'" text-anchor="middle" fill="#b45309" style="font-size:9px;pointer-events:none;">toca: cambiar V</text>';
      } else if(inst.type==='resistencia'){
        html += '<text x="'+(inst.x+50)+'" y="'+(inst.y-4)+'" text-anchor="middle" fill="#b45309" style="font-size:9px;pointer-events:none;">toca: cambiar ohm</text>';
      }
      const bodyMidY = inst.y + 52;
      const legA = inst.type==='bateria' ? '#4ade80' : '#6b7280';
      const legB = inst.type==='bateria' ? '#fb923c' : '#6b7280';
      html += '<line x1="'+pa.x+'" y1="'+bodyMidY+'" x2="'+pa.x+'" y2="'+pa.y+'" stroke="'+legA+'" stroke-width="2.5" stroke-linecap="round"/>';
      html += '<line x1="'+pb.x+'" y1="'+bodyMidY+'" x2="'+pb.x+'" y2="'+pb.y+'" stroke="'+legB+'" stroke-width="2.5" stroke-linecap="round"/>';
      html += '<circle class="'+clsA+'" data-role="terminal" data-key="'+inst.id+'_a" cx="'+pa.x+'" cy="'+pa.y+'" r="8" fill="#0b1f18" stroke="'+legA+'" stroke-width="2.5"></circle>';
      html += '<circle class="'+clsB+'" data-role="terminal" data-key="'+inst.id+'_b" cx="'+pb.x+'" cy="'+pb.y+'" r="8" fill="#0b1f18" stroke="'+legB+'" stroke-width="2.5"></circle>';
      html += '<circle data-role="delete" data-inst="'+inst.id+'" cx="'+(inst.x+92)+'" cy="'+(inst.y+8)+'" r="8" fill="rgba(255,92,92,0.3)" stroke="#ff5c5c" stroke-width="1.5"></circle>';
      html += '<text data-role="delete" data-inst="'+inst.id+'" x="'+(inst.x+92)+'" y="'+(inst.y+11)+'" text-anchor="middle" fill="#7a1414" style="font-size:10px;pointer-events:none;">×</text>';
      html += '</g>';
    }
  });

  svg.innerHTML = html;

  svg.querySelectorAll('[data-role="hole"]').forEach(el=>el.addEventListener('pointerdown', labHoleDown));
  svg.querySelectorAll('[data-role="terminal"]').forEach(el=>el.addEventListener('pointerdown', labTerminalDown));
  svg.querySelectorAll('[data-role="body"]').forEach(el=>el.addEventListener('pointerdown', labBodyDown));
  svg.querySelectorAll('[data-role="delete"]').forEach(el=>{
    el.addEventListener('pointerdown', (e)=>{ e.stopPropagation(); labRemoveInstance(e.currentTarget.dataset.inst); });
  });
  svg.querySelectorAll('[data-role="wire"]').forEach(el=>{
    el.addEventListener('pointerdown', (e)=>{
      e.stopPropagation(); e.preventDefault();
      const idx = parseInt(e.currentTarget.dataset.idx, 10);
      if(!isNaN(idx)) labWireClick(idx);
    });
  });
  svg.onpointermove = labPointerMove;
  svg.onpointerup = labPointerUp;
  svg.onpointerleave = ()=>{ labDragMode=null; labDragData=null; renderLab(); };
}

function labSetHint(msg){
  const el = document.getElementById('labHintBar');
  if(el) el.textContent = msg || 'LED: pata larga (+) / pata corta (-) · Toca circulo y luego otro · Misma columna = conectados';
}
function labConnectWire(fromKey, toKey){
  if(!fromKey || !toKey || fromKey===toKey) return false;
  const exists = lab.wires.some(([a,b])=>(a===fromKey&&b===toKey)||(a===toKey&&b===fromKey));
  if(exists){
    if(window.PG) PG.toast('Ese cable ya está conectado');
    return false;
  }
  lab.wires.push([fromKey, toKey]);
  lab.lastResult = null;
  if(window.PG){ PG.sfxOk(); PG.toast('⚡ Cable conectado'); }
  return true;
}

function labHoleDown(e){
  e.preventDefault(); e.stopPropagation();
  const holeId = e.target.dataset.hole;
  if(!holeId) return;
  // Si hay un terminal pendiente, clavarlo en este agujero
  if(labPendingTerminal){
    const {id, suffix} = labParseKey(labPendingTerminal);
    const inst = lab.instances.find(i=>i.id===id);
    if(inst){
      // ¿agujero ocupado por otra patita?
      const taken = lab.instances.some(o=>{
        if(o.id===id) return false;
        return o.holeA===holeId || o.holeB===holeId;
      });
      if(taken){
        if(window.PG) PG.toast('Ese agujero ya tiene una patita');
        return;
      }
      if(suffix==='a') inst.holeA = holeId; else inst.holeB = holeId;
      // Reposicionar cuerpo entre las dos patitas
      const pa = labTermPos(id,'a'), pb = labTermPos(id,'b');
      if(pa && pb){
        inst.x = Math.min(pa.x, pb.x) - 10;
        inst.y = (pa.y+pb.y)/2 - 28;
      }
      labPendingTerminal = null;
      labPendingHole = null;
      lab.lastResult = null;
      labSetHint && labSetHint('Patita clavada en el agujero. Une la otra o simula.');
      renderLab();
      return;
    }
  }
  // Seleccionar agujero para mostrar nodo (feedback)
  labPendingHole = (labPendingHole===holeId) ? null : holeId;
  const net = (function(){
    const h = bbParseHole(holeId);
    return h ? bbNetId(h.zone,h.col,h.row) : '';
  })();
  labSetHint && labSetHint('Agujero '+holeId+' · nodo '+net+' (misma columna = conectados). Toca una patita y luego un agujero para clavarla.');
  renderLab();
}

function labTerminalDown(e){
  e.preventDefault(); e.stopPropagation();
  const key = e.target.dataset.key;
  if(!key) return;

  // Click-to-connect mode (primary for kids)
  if(labPendingTerminal){
    if(labPendingTerminal === key){
      // same terminal → cancel
      labPendingTerminal = null;
      labSetHint();
      renderLab();
      return;
    }
    labConnectWire(labPendingTerminal, key);
    labPendingTerminal = null;
    labSetHint();
    renderLab();
    return;
  }

  // First click: select terminal (pending) + also allow drag
  labPendingTerminal = key;
  const p = labParseKey(key);
  const pos = labTermPos(p.id, p.suffix);
  labDragMode = 'wire';
  labDragData = {fromKey:key, x:pos.x, y:pos.y, startedAt: Date.now()};
  labSetHint('👆 Ahora toca el OTRO conector para completar el cable (o arrastra)');
  renderLab();
  drawLabTemp(pos.x, pos.y);
}
function labBodyDown(e){
  e.preventDefault(); e.stopPropagation();
  const id = e.currentTarget.dataset.inst;
  const inst = lab.instances.find(i=>i.id===id);
  if(!inst) return;
  const svg = document.getElementById('labSvg');
  const p = svgPoint(svg, e.clientX, e.clientY);
  labDragMode='move';
  labDragData = {id, startX:p.x, startY:p.y, origX:inst.x, origY:inst.y, moved:false};
}
function labPointerMove(e){
  if(!labDragMode) return;
  const svg = document.getElementById('labSvg');
  const p = svgPoint(svg, e.clientX, e.clientY);
  if(labDragMode==='wire'){
    drawLabTemp(p.x,p.y);
  } else if(labDragMode==='move'){
    const dx = p.x-labDragData.startX, dy = p.y-labDragData.startY;
    if(Math.abs(dx)>4||Math.abs(dy)>4) labDragData.moved=true;
    const inst = lab.instances.find(i=>i.id===labDragData.id);
    if(inst){
      const rawX = Math.max(6, Math.min(590, labDragData.origX+dx));
      const rawY = Math.max(46, Math.min(272, labDragData.origY+dy));
      inst.x = Math.round(rawX/LAB_GRID)*LAB_GRID;
      inst.y = Math.round(rawY/LAB_GRID)*LAB_GRID;
      if(typeof labSyncHolesOne==='function') labSyncHolesOne(inst);
      renderLab();
    }
  }
}
function drawLabTemp(x2,y2){
  const svg = document.getElementById('labSvg');
  let temp = svg.querySelector('.wire-line.temp');
  if(!temp){
    temp = document.createElementNS('http://www.w3.org/2000/svg','path');
    temp.setAttribute('class','wire-line temp');
    svg.appendChild(temp);
  }
  temp.setAttribute('d', `M${labDragData.x},${labDragData.y} L${x2},${y2}`);
}
function labPointerUp(e){
  if(!labDragMode) return;
  const svg = document.getElementById('labSvg');
  if(labDragMode==='wire'){
    const p = svgPoint(svg, e.clientX, e.clientY);
    let best=null, bestDist=22;
    lab.instances.forEach(inst=>{
      ['a','b'].forEach(suffix=>{
        const key = inst.id+'_'+suffix;
        if(key===labDragData.fromKey) return;
        const pos = labTermPos(inst.id,suffix);
        const d = Math.hypot(pos.x-p.x,pos.y-p.y);
        if(d<bestDist){bestDist=d;best=key;}
      });
    });
    const elapsed = Date.now() - (labDragData.startedAt||0);
    // If user dragged far enough to another terminal → connect and clear pending
    if(best){
      labConnectWire(labDragData.fromKey, best);
      labPendingTerminal = null;
      labSetHint();
    } else if(elapsed < 280){
      // short tap without moving: keep pending for click-to-connect (already set)
    } else {
      // long drag that didn't land → cancel pending
      labPendingTerminal = null;
      labSetHint();
    }
    lab.lastResult = null;
  } else if(labDragMode==='move'){
    if(!labDragData.moved){
      const inst = lab.instances.find(i=>i.id===labDragData.id);
      if(inst){
        if(inst.type==='interruptor'){ inst.closed = !inst.closed; lab.lastResult=null; }
        else if(inst.type==='resistencia'){
          const idx = RESISTOR_VALUES.indexOf(inst.value||220);
          inst.value = RESISTOR_VALUES[(idx+1)%RESISTOR_VALUES.length];
          lab.lastResult=null;
        } else if(inst.type==='bateria'){
          const idx = BATTERY_VOLTAGES.indexOf(inst.voltage||9);
          inst.voltage = BATTERY_VOLTAGES[(idx+1)%BATTERY_VOLTAGES.length];
          lab.lastResult=null;
        } else if(inst.type==='led'){
          const idx = LED_COLOR_KEYS.indexOf(inst.color||'red');
          inst.color = LED_COLOR_KEYS[(idx+1)%LED_COLOR_KEYS.length];
          lab.lastResult=null;
        }
      }
    }
  }
  labDragMode=null; labDragData=null;
  renderLab();
}

function clearLab(){
  lab = { instances: [], wires: [], nextId: 1, lastResult: null };
  labPendingTerminal = null;
  labSetHint();
  const r = document.getElementById('labResult');
  r.textContent=''; r.className='cb-result';
  document.getElementById('labMaterials').innerHTML='';
  renderLab();
}

function simulateLab(){
  const battery = lab.instances.find(i=>i.type==='bateria');
  const result = document.getElementById('labResult');
  if(!battery){
    result.textContent = '⚠️ Agrega una pila para poder simular el circuito.';
    result.className='cb-result bad';
    return;
  }
  const V = battery.voltage || 9;

  /* --- Conexiones por AGUJEROS de protoboard ---
     Mismo nodo eléctrico si comparten tira (columna top/bot) o el mismo riel +/- .
     No hace falta cable entre dos patitas en la misma tira. */
  const columnPairs = [];
  const pins = [];
  lab.instances.forEach(inst=>{
    ['a','b'].forEach(suf=>{
      const net = labPinNet(inst, suf);
      if(net) pins.push({key: inst.id+'_'+suf, net});
    });
  });
  for(let i=0;i<pins.length;i++){
    for(let j=i+1;j<pins.length;j++){
      if(pins[i].net && pins[i].net === pins[j].net)
        columnPairs.push([pins[i].key, pins[j].key]);
    }
  }

  // --- grafo base: cables + columnas compartidas + resistencias + interruptores cerrados ---
  const parent = {};
  function makeSet(k){ if(!(k in parent)) parent[k]=k; }
  function find(k){ makeSet(k); return parent[k]===k ? k : (parent[k]=find(parent[k])); }
  function union(a,b){ makeSet(a); makeSet(b); const ra=find(a), rb=find(b); if(ra!==rb) parent[ra]=rb; }

  lab.instances.forEach(inst=>{
    makeSet(inst.id+'_a'); makeSet(inst.id+'_b');
    // Pasivos conductores (en DC el capacitor se trata como abierto)
    if(inst.type==='resistencia') union(inst.id+'_a', inst.id+'_b');
    if(inst.type==='ldr') union(inst.id+'_a', inst.id+'_b');
    if(inst.type==='potenciometro') union(inst.id+'_a', inst.id+'_b');
    if(inst.type==='fusible' && inst.closed && !inst.blown) union(inst.id+'_a', inst.id+'_b');
    if(inst.type==='interruptor' && inst.closed) union(inst.id+'_a', inst.id+'_b');
    if(inst.type==='pulsador' && inst.closed) union(inst.id+'_a', inst.id+'_b');
    // Diodo y LED conducen solo si el circuito los polariza bien (se resuelve en fases activas)
  });
  lab.wires.forEach(([a,b])=>union(a,b));
  columnPairs.forEach(([a,b])=>union(a,b));

  const actives = lab.instances.filter(i=>['led','motor','buzzer','diodo'].includes(i.type));

  // --- fase 1: activación directa/en cadena (mismo tipo en serie, ej. 2 LEDs) ---
  const litSet = new Set();
  let changed = true, iterations = 0;
  while(changed && iterations < 10){
    changed = false; iterations++;
    actives.forEach(dev=>{
      if(litSet.has(dev.id)) return;
      const a = dev.id+'_a', b = dev.id+'_b';
      if(find(a)===find(battery.id+'_a') && find(b)===find(battery.id+'_b')){
        litSet.add(dev.id);
        union(a,b);
        changed = true;
      }
    });
  }

  // --- fase 2: grafo "máximo" (asumiendo que TODOS los componentes activos conducen)
  // para detectar cadenas mixtas (ej. motor + buzzer en serie) que la fase 1 no resuelve sola ---
  const parent2 = {...parent};
  function find2(k){ if(!(k in parent2)) parent2[k]=k; return parent2[k]===k ? k : (parent2[k]=find2(parent2[k])); }
  function union2(a,b){ find2(a); find2(b); const ra=find2(a), rb=find2(b); if(ra!==rb) parent2[ra]=rb; }
  actives.forEach(dev=>union2(dev.id+'_a', dev.id+'_b'));
  const battSetMax = find2(battery.id+'_a');
  const loopPossible = find2(battery.id+'_b') === battSetMax;

  if(loopPossible){
    actives.forEach(dev=>{
      if(litSet.has(dev.id)) return;
      if(find2(dev.id+'_a')===battSetMax && find2(dev.id+'_b')===battSetMax){
        litSet.add(dev.id);
      }
    });
  }

  const liveWires = new Set();
  if(litSet.size>0){
    lab.wires.forEach(([a,b],idx)=>{
      if(find2(a)===battSetMax && find2(b)===battSetMax) liveWires.add(idx);
    });
  }

  // --- fase 3: Ley de Ohm real. Dijkstra desde (+) y desde (−) de la pila,
  // sumando los ohmios de las resistencias que hay en el camino de cada LED
  // (las columnas compartidas cuentan como cable, resistencia 0) ---
  const adj = {};
  function addEdge(a,b,w){ (adj[a]=adj[a]||[]).push([b,w]); (adj[b]=adj[b]||[]).push([a,w]); }
  lab.wires.forEach(([a,b])=>addEdge(a,b,0));
  columnPairs.forEach(([a,b])=>addEdge(a,b,0));
  lab.instances.forEach(inst=>{
    if(inst.type==='resistencia') addEdge(inst.id+'_a', inst.id+'_b', inst.value||220);
    if(inst.type==='ldr') addEdge(inst.id+'_a', inst.id+'_b', inst.light===false ? 50000 : (inst.value||5000));
    if(inst.type==='potenciometro') addEdge(inst.id+'_a', inst.id+'_b', inst.value||5000);
    if(inst.type==='fusible' && inst.closed && !inst.blown) addEdge(inst.id+'_a', inst.id+'_b', 0.1);
    if(inst.type==='interruptor' && inst.closed) addEdge(inst.id+'_a', inst.id+'_b', 0);
    if(inst.type==='pulsador' && inst.closed) addEdge(inst.id+'_a', inst.id+'_b', 0);
    if(['led','motor','buzzer','diodo'].includes(inst.type) && litSet.has(inst.id)) addEdge(inst.id+'_a', inst.id+'_b', 0);
  });
  function dijkstra(start){
    const dist = {}; dist[start]=0; const done = new Set();
    while(true){
      let u=null, best=Infinity;
      for(const k in dist){ if(!done.has(k) && dist[k]<best){ best=dist[k]; u=k; } }
      if(u===null) break;
      done.add(u);
      (adj[u]||[]).forEach(([v,w])=>{
        const nd = dist[u]+w;
        if(dist[v]===undefined || nd<dist[v]) dist[v]=nd;
      });
    }
    return dist;
  }
  const distPos = dijkstra(battery.id+'_a');
  const distNeg = dijkstra(battery.id+'_b');

  const details = {};
  let anyDanger = false, anyDim = false, missingResistor = false;
  lab.instances.forEach(inst=>{
    if(inst.type==='resistencia' || inst.type==='bateria' || inst.type==='interruptor'){
      details[inst.id] = {active:false};
      return;
    }
    const active = litSet.has(inst.id);
    if(!active){ details[inst.id] = {active:false}; return; }
    if(inst.type!=='led'){ details[inst.id] = {active:true}; return; }
    const rUp = distPos[inst.id+'_a'], rDown = distNeg[inst.id+'_b'];
    const rTotal = (rUp!==undefined && rDown!==undefined) ? rUp+rDown : 0;
    const vf = (LED_COLORS[inst.color||'red']||LED_COLORS.red).vf;
    const effV = Math.max(0, V - vf);
    let mA, status, brightness;
    if(rTotal<=0){
      mA = Infinity; status = 'danger'; anyDanger = true; missingResistor = true; brightness = 1;
    } else {
      mA = Math.round((effV/rTotal)*1000);
      brightness = Math.max(0.12, Math.min(1, mA/20));
      if(mA > 40){ status = 'danger'; anyDanger = true; }
      else if(mA < 4){ status = 'dim'; anyDim = true; }
      else status = 'ok';
    }
    details[inst.id] = {active:true, status, mA: mA===Infinity?'∞':mA, rTotal, brightness};
  });

  // Fusible se funde con sobrecorriente
  lab.instances.forEach(inst=>{
    if(inst.type==='fusible' && !inst.blown){
      let over = anyDanger;
      Object.values(details).forEach(d=>{
        if(d && (d.mA==='∞' || (typeof d.mA==='number' && d.mA>50))) over = true;
      });
      if(over){
        inst.blown = true;
        inst.closed = false;
        litSet.clear();
        details[inst.id] = {active:false, status:'blown'};
      }
    }
  });
  lab.lastResult = {lit: litSet, liveWires, details};
  renderLab();
  // Multímetro virtual
  (function updateMeter(){
    const mV = document.getElementById('meterV');
    const mI = document.getElementById('meterI');
    const mS = document.getElementById('meterStatus');
    if(!mV) return;
    mV.textContent = V + ' V';
    let iEst = 0;
    let danger = false;
    Object.keys(details).forEach(id=>{
      const d = details[id];
      if(d && d.mA && d.mA!=='∞') iEst += Number(d.mA)||0;
      if(d && d.current_mA) iEst += d.current_mA;
      if(d && d.status==='danger') danger = true;
    });
    // fallback estimate from LEDs lit
    if(!iEst && litSet.size){
      const Ravg = 220;
      iEst = litSet.size * (V / Ravg) * 1000;
    }
    mI.textContent = iEst ? (Math.round(iEst) + ' mA') : '0 mA';
    if(danger){ mS.textContent = '⚠ Sobrecorriente'; mS.style.color = '#ff5c5c'; }
    else if(litSet.size){ mS.textContent = 'Circuito OK'; mS.style.color = '#4ade80'; }
    else { mS.textContent = 'Sin corriente'; mS.style.color = '#fbbf24'; }
  })();

  const leds = actives.filter(i=>i.type==='led');
  const motors = actives.filter(i=>i.type==='motor');
  const buzzers = actives.filter(i=>i.type==='buzzer');

  if(actives.length===0){
    result.textContent = 'Agrega al menos un LED, motor o buzzer para ver si tu circuito funciona.';
    result.className='cb-result';
  } else if(litSet.size===0){
    result.innerHTML = lab.instances.some(i=>i.type==='fusible'&&i.blown) ? '🧯 <b>Fusible fundido</b> por sobrecorriente. Clic en el fusible para resetearlo y agrega una resistencia.' : '❌ Nada se activa. Cierra el circuito (pila → componentes → pila), cierra interruptores/pulsadores y revisa el diodo (A→K).';
    result.className='cb-result bad';
  } else {
    const parts = [];
    if(leds.length) parts.push(`💡 ${[...litSet].filter(id=>leds.some(l=>l.id===id)).length}/${leds.length} LED(s)`);
    if(motors.length) parts.push(`⚙️ ${[...litSet].filter(id=>motors.some(m=>m.id===id)).length}/${motors.length} motor(es) girando`);
    if(buzzers.length) parts.push(`🔊 ${[...litSet].filter(id=>buzzers.some(bz=>bz.id===id)).length}/${buzzers.length} buzzer(s) sonando`);
    let msg = `✅ ${parts.join(' · ')}. Pila a ${V}V.`;
    if(anyDanger) msg += missingResistor ? ' 🔥 ¡Corto circuito! Falta resistencia en el camino de un LED, se puede quemar.' : ' 🔥 Corriente demasiado alta en algún LED: sube el valor de la resistencia o baja el voltaje.';
    else if(anyDim) msg += ' 🔅 Algún LED recibe muy poca corriente y se verá tenue: baja el valor de la resistencia.';
    // Ohm live formula for first lit LED
    let ohmHtml = '';
    const firstLed = leds.find(l => litSet.has(l.id));
    if(firstLed && details[firstLed.id] && details[firstLed.id].rTotal !== undefined){
      const d = details[firstLed.id];
      const vf = (LED_COLORS[firstLed.color||'red']||LED_COLORS.red).vf;
      if(d.rTotal > 0 && d.mA !== '∞'){
        ohmHtml = `<div class="ohm-box"><span class="formula">Ley de Ohm:</span> I = (V − Vf) / R = (${V} − ${vf}) / ${d.rTotal} ≈ <b>${d.mA} mA</b></div>`;
      }
    }
    result.innerHTML = msg + ohmHtml;
    result.className = anyDanger ? 'cb-result bad' : (anyDim ? 'cb-result' : 'cb-result ok');
    if(window.PG && litSet.size > 0 && !anyDanger){
      PG.sfxOk();
      if(!PG.medals.lab){ PG.award('lab','Ingeniero de Laboratorio'); PG.confetti(35); }
      // Buzzer sound if any buzzer is lit
      if(buzzers.some(bz => litSet.has(bz.id))){
        PG.tone(880, 0.35, 'square', 0.05);
        setTimeout(()=>PG.tone(880, 0.2, 'square', 0.04), 400);
      }
    } else if(window.PG && anyDanger){ PG.sfxBad(); }
  }
}

const LAB_PRESETS = {
  simple: {
    label:'LED simple',
    materials:['1 pila de 9V','1 resistencia 220Ω','1 LED','jumpers'],
    instances:[
      // Pila clavada en rieles + y − (estilo Tinkercad / protoboard real)
      {id:'bateria_1', type:'bateria', voltage:9, closed:true,
        holeA:'rail+:2', holeB:'rail-:2'},
      // Resistencia y LED en zona top; jumpers desde rieles
      {id:'resistencia_1', type:'resistencia', value:220, closed:true,
        holeA:'top:8:1', holeB:'top:12:1'},
      {id:'led_1', type:'led', color:'red', closed:true,
        holeA:'top:12:3', holeB:'top:16:1'}
    ],
    // Jumpers: riel+ → R, LED− → riel−  (columna 12 une R con LED+)
    wires:[
      ['bateria_1_a','resistencia_1_a'],
      ['led_1_b','bateria_1_b']
    ]
  },
  interruptor: {
    label:'LED con interruptor',
    materials:['1 pila de 9V','1 interruptor','1 resistencia 220Ω','1 LED','jumpers'],
    instances:[
      {id:'bateria_1', type:'bateria', voltage:9, closed:true, holeA:'rail+:2', holeB:'rail-:2'},
      {id:'interruptor_1', type:'interruptor', closed:true, holeA:'top:6:1', holeB:'top:10:1'},
      {id:'resistencia_1', type:'resistencia', value:220, closed:true, holeA:'top:10:3', holeB:'top:14:1'},
      {id:'led_1', type:'led', color:'red', closed:true, holeA:'top:14:3', holeB:'top:18:1'}
    ],
    wires:[
      ['bateria_1_a','interruptor_1_a'],
      ['led_1_b','bateria_1_b']
    ]
  },
  paralelo: {
    label:'2 LEDs en paralelo',
    materials:['1 pila de 9V','2 resistencias de 220Ω a 330Ω','2 LEDs','cables o jumpers'],
    instances:[
      {id:'bateria_1', type:'bateria', x:10, y:100, closed:true, voltage:9},
      {id:'resistencia_1', type:'resistencia', x:230, y:30, closed:true, value:220},
      {id:'led_1', type:'led', x:450, y:30, closed:true},
      {id:'resistencia_2', type:'resistencia', x:230, y:190, closed:true, value:220},
      {id:'led_2', type:'led', x:450, y:190, closed:true}
    ],
    wires:[
      ['bateria_1_a','resistencia_1_a'],['resistencia_1_b','led_1_a'],['led_1_b','bateria_1_b'],
      ['bateria_1_a','resistencia_2_a'],['resistencia_2_b','led_2_a'],['led_2_b','bateria_1_b']
    ]
  },
  serie: {
    label:'2 LEDs en serie',
    materials:['1 pila de 9V','1 resistencia de 220Ω a 470Ω','2 LEDs','cables o jumpers'],
    instances:[
      {id:'bateria_1', type:'bateria', x:10, y:150, closed:true, voltage:9},
      {id:'resistencia_1', type:'resistencia', x:160, y:150, closed:true, value:330},
      {id:'led_1', type:'led', x:320, y:150, closed:true, color:'red'},
      {id:'led_2', type:'led', x:480, y:150, closed:true, color:'green'}
    ],
    wires:[['bateria_1_a','resistencia_1_a'],['resistencia_1_b','led_1_a'],['led_1_b','led_2_a'],['led_2_b','bateria_1_b']]
  },
  motor: {
    label:'Motor + interruptor',
    materials:['1 pila de 9V','1 interruptor','1 motor DC','cables o jumpers'],
    instances:[
      {id:'bateria_1', type:'bateria', x:40, y:150, closed:true, voltage:9},
      {id:'interruptor_1', type:'interruptor', x:240, y:150, closed:true},
      {id:'motor_1', type:'motor', x:440, y:150, closed:true}
    ],
    wires:[['bateria_1_a','interruptor_1_a'],['interruptor_1_b','motor_1_a'],['motor_1_b','bateria_1_b']]
  },
  buzzer: {
    label:'Buzzer + LED',
    materials:['1 pila de 9V','1 resistencia 220Ω','1 LED','1 buzzer','cables'],
    instances:[
      {id:'bateria_1', type:'bateria', x:10, y:100, closed:true, voltage:9},
      {id:'resistencia_1', type:'resistencia', x:200, y:40, closed:true, value:220},
      {id:'led_1', type:'led', x:400, y:40, closed:true},
      {id:'buzzer_1', type:'buzzer', x:300, y:200, closed:true}
    ],
    wires:[
      ['bateria_1_a','resistencia_1_a'],['resistencia_1_b','led_1_a'],['led_1_b','bateria_1_b'],
      ['bateria_1_a','buzzer_1_a'],['buzzer_1_b','bateria_1_b']
    ]
  }
};

function labDemoLED(){
  try {
    if(typeof showView==='function') showView('laboratorio');
    loadPreset('simple'); // clave real del preset LED simple
    if(window.PG && PG.toast) PG.toast('💡 Pila en rieles +/− · LED listo');
  } catch(err){
    console.error(err);
    alert('No se pudo cargar la demo: '+(err.message||err));
  }
}


function labSyncHolesOne(inst){
  [['a','holeA'],['b','holeB']].forEach(([suf, prop])=>{
    const px = inst.x + (suf==='a'?0:100);
    const py = inst.y + 28;
    let bestD=1e9, bestId=null;
    for(let c=0;c<BB.cols;c++){
      for(const zone of ['top','bot']){
        const rows = zone==='top'?BB.rowsTop:BB.rowsBot;
        for(let r=0;r<rows;r++){
          const p = bbHoleXY(c,r,zone);
          const d = Math.hypot(p.x-px, p.y-py);
          if(d<bestD){ bestD=d; bestId=bbHoleId(zone,c,r); }
        }
      }
      for(const zone of ['rail+','rail-']){
        const p = bbHoleXY(c,0,zone);
        const d = Math.hypot(p.x-px, p.y-py);
        if(d<bestD){ bestD=d; bestId=bbHoleId(zone,c,0); }
      }
    }
    inst[prop] = bestId;
  });
  if(inst.holeA===inst.holeB){
    const h = bbParseHole(inst.holeB);
    if(h) inst.holeB = bbHoleId(h.zone, Math.min(BB.cols-1, h.col+4), h.row);
  }
}
function labHolesFromPositions(){
  lab.instances.forEach(inst=>labSyncHolesOne(inst));
}


function loadPreset(key){
  const p = LAB_PRESETS[key] || LAB_PRESETS.simple;
  if(!p){ console.error('Preset no encontrado', key); return; }
  lab.instances = p.instances.map(i=>({...i}));
  lab.wires = p.wires.map(w=>[...w]);
  lab.nextId = 10;
  lab.instances.forEach(inst=>{
    if(inst.type==='bateria' && (!inst.holeA || !inst.holeB ||
        !(String(inst.holeA).startsWith('rail') && String(inst.holeB).startsWith('rail')))){
      // Forzar pila a rieles +/−
      inst.holeA = 'rail+:2';
      inst.holeB = 'rail-:2';
    } else if(!inst.holeA || !inst.holeB){
      labSyncHolesOne(inst);
    }
    labLayoutFromHoles(inst);
  });
  lab.lastResult = null;
  const r = document.getElementById('labResult');
  r.textContent = `Receta "${p.label}" cargada. Pulsa "Simular" para probarla, o cópiala con tus componentes reales en casa.`;
  r.className='cb-result';
  document.getElementById('labMaterials').innerHTML = `<div class="lab-materials"><b>🧰 Materiales:</b><ul>${p.materials.map(m=>`<li>${m}</li>`).join('')}</ul></div>`;
  renderLab();
  setTimeout(function(){ try{ simulateLab(); }catch(err){ console.error(err); } }, 50);
}



/* ============================================================
   JUEGO: LEY DE OHM
   ============================================================ */
const OHM_QUESTIONS = [
  {q:'Si la pila es de 9 V y la resistencia es de 300 Ω, ¿cuánta corriente circula?', opts:['30 mA','3 mA','300 mA','90 mA'], correct:0, hint:'I = V ÷ R = 9 ÷ 300 = 0,03 A = 30 mA'},
  {q:'¿Qué pasa si aumentas la resistencia y dejas el mismo voltaje?', opts:['La corriente baja','La corriente sube','El voltaje cambia','Nada'], correct:0, hint:'Más R → menos I (I = V/R)'},
  {q:'Un LED se ve muy brillante y se puede quemar. ¿Qué puedes hacer?', opts:['Poner una resistencia más grande','Quitar la resistencia','Subir el voltaje','Cortar un cable'], correct:0, hint:'Más resistencia limita la corriente'},
  {q:'Pila de 6 V y resistencia de 200 Ω. ¿Cuántos mA hay?', opts:['30 mA','12 mA','3 mA','1200 mA'], correct:0, hint:'I = 6 ÷ 200 = 0,03 A = 30 mA'},
  {q:'La fórmula de la Ley de Ohm es:', opts:['I = V ÷ R','V = I ÷ R','R = V × I','I = V × R'], correct:0, hint:'Corriente = Voltaje dividido entre Resistencia'},
  {q:'Si V = 12 V y quieres unos 20 mA, ¿qué resistencia usas aproximadamente?', opts:['600 Ω','12 Ω','20 Ω','2400 Ω'], correct:0, hint:'R = V ÷ I = 12 ÷ 0,02 = 600 Ω'},
  {q:'¿Qué unidad usamos para la corriente en circuitos de LED?', opts:['mA (miliamperios)','Voltios','Ohmios','Watts'], correct:0, hint:'Los LEDs suelen usar 10–20 mA'},
];

let ohmState = {idx:0, score:0, answered:false, order:[]};

function updateOhmLive(){
  const V = parseFloat(document.getElementById('ohmV')?.value || 9);
  const R = parseFloat(document.getElementById('ohmR')?.value || 300);
  const I_mA = Math.round((V / R) * 1000);
  const vLab = document.getElementById('ohmVLabel');
  const rLab = document.getElementById('ohmRLabel');
  const calc = document.getElementById('ohmCalc');
  const led = document.getElementById('ohmLed');
  const ledText = document.getElementById('ohmLedText');
  if(vLab) vLab.textContent = V + ' V';
  if(rLab) rLab.textContent = R + ' Ω';
  if(calc) calc.innerHTML = `I = ${V} ÷ ${R} = <b>${I_mA} mA</b>`;
  if(led){
    // brightness based on current (typical LED ~15-20mA full)
    let bright = Math.min(1, Math.max(0.08, I_mA / 25));
    let danger = I_mA > 40;
    let dim = I_mA < 5;
    led.style.opacity = bright;
    led.style.transform = `scale(${0.7 + bright*0.4})`;
    led.style.boxShadow = danger
      ? `0 0 ${20+I_mA}px #fff, 0 0 40px #ff4d5e`
      : `0 0 ${12*bright}px #ff4d5e`;
    if(ledText){
      if(danger) ledText.textContent = '🔥 ¡Mucha corriente! El LED se puede quemar';
      else if(dim) ledText.textContent = '🔅 Muy poca corriente — LED tenue';
      else ledText.textContent = '💡 LED con buen brillo (~' + I_mA + ' mA)';
    }
  }
}

function initOhmGame(){
  ohmState = {
    idx: 0,
    score: 0,
    answered: false,
    order: [...OHM_QUESTIONS.keys()].sort(()=>Math.random()-0.5).slice(0,5)
  };
  const sc = document.getElementById('ohmScore');
  const tot = document.getElementById('ohmTotal');
  if(sc) sc.textContent = '0';
  if(tot) tot.textContent = '5';
  updateOhmLive();
  renderOhmChallenge();
}

function renderOhmChallenge(){
  const host = document.getElementById('ohmChallenge');
  if(!host) return;
  if(ohmState.idx >= ohmState.order.length){
    if(window.PG){
      if(ohmState.score >= 4){ PG.award('ohm','Maestro de Ohm'); PG.confetti(50); PG.sfxWin(); }
      else if(ohmState.score >= 3){ PG.toast('📐 ¡Buen trabajo con Ohm!'); PG.sfxOk(); }
      if(typeof saveScore==='function') saveScore('ohm_score', ohmState.score);
    }
    host.innerHTML = `<div style="text-align:center;">
      <div style="font-size:2rem;font-weight:800;color:var(--wire-yellow);">${ohmState.score}/5</div>
      <p>${ohmState.score===5?'¡Perfecto! Dominas la Ley de Ohm ⚡': ohmState.score>=3?'¡Muy bien! Sigue practicando con los deslizadores.':'Prueba mover V y R arriba y vuelve a intentar.'}</p>
      <button class="btn" onclick="initOhmGame()">Jugar de nuevo</button>
    </div>`;
    return;
  }
  const q = OHM_QUESTIONS[ohmState.order[ohmState.idx]];
  ohmState.answered = false;
  host.innerHTML = `
    <div class="ohm-q">${ohmState.idx+1}. ${q.q}</div>
    <div class="ohm-opts" id="ohmOpts"></div>
    <div class="feedback" id="ohmFeedback" style="margin-top:12px;"></div>`;
  const wrap = document.getElementById('ohmOpts');
  q.opts.forEach((opt,i)=>{
    const btn = document.createElement('button');
    btn.className = 'ohm-opt';
    btn.textContent = opt;
    btn.onclick = ()=>answerOhm(i);
    wrap.appendChild(btn);
  });
}

function answerOhm(i){
  if(ohmState.answered) return;
  ohmState.answered = true;
  const q = OHM_QUESTIONS[ohmState.order[ohmState.idx]];
  const opts = document.querySelectorAll('#ohmOpts .ohm-opt');
  const fb = document.getElementById('ohmFeedback');
  opts.forEach((o,idx)=>{
    if(idx===q.correct) o.classList.add('correct');
    else if(idx===i) o.classList.add('wrong');
  });
  if(i===q.correct){
    ohmState.score++;
    document.getElementById('ohmScore').textContent = ohmState.score;
    if(fb){ fb.textContent = '✅ ¡Correcto! ' + q.hint; fb.className='feedback ok'; }
    if(window.PG) PG.sfxOk();
  } else {
    if(fb){ fb.textContent = '❌ ' + q.hint; fb.className='feedback bad'; }
    if(window.PG) PG.sfxBad();
  }
  setTimeout(()=>{
    ohmState.idx++;
    renderOhmChallenge();
  }, 1600);
}


/* ============================================================
   FEATURE PACK: guardar, pasos, borrar cables, medallas,
   diploma, código de colores, ranking, idiomas
   ============================================================ */
function toggleLabSteps(){
  const el = document.getElementById('labSteps');
  if(!el) return;
  el.style.display = el.style.display==='none' ? 'block' : 'none';
}
function saveLabCircuit(){
  const data = { instances: lab.instances, wires: lab.wires, nextId: lab.nextId };
  localStorage.setItem('pg_lab_circuit', JSON.stringify(data));
  if(window.PG) PG.toast('💾 Circuito guardado en este navegador');
}
function loadLabCircuit(){
  const raw = localStorage.getItem('pg_lab_circuit');
  if(!raw){ if(window.PG) PG.toast('No hay circuito guardado'); return; }
  try{
    const data = JSON.parse(raw);
    lab.instances = data.instances||[];
    lab.wires = data.wires||[];
    lab.nextId = data.nextId||10;
    lab.lastResult = null;
    labPendingTerminal = null;
    renderLab();
    if(window.PG) PG.toast('📂 Circuito cargado');
  }catch(e){ if(window.PG) PG.toast('Error al cargar'); }
}
function resetMedals(){
  if(!confirm('¿Reiniciar todas las medallas y puntajes?')) return;
  if(window.PG){
    PG.medals = {};
    PG.scores = {};
    PG.save();
    PG.toast('Medallas reiniciadas');
  }
}
function checkAllMedals(){
  if(!window.PG) return;
  const need = ['memo','circuito','polar','cables','quiz','lab','ohm'];
  if(need.every(k => PG.medals[k])){
    setTimeout(()=>{
      document.getElementById('diplomaOverlay')?.classList.add('show');
      PG.confetti(80);
      PG.sfxWin();
    }, 600);
  }
}
// Hook into award
if(window.PG){
  const _award = PG.award.bind(PG);
  PG.award = function(id, label){
    _award(id, label);
    checkAllMedals();
  };
}
function downloadDiploma(){
  const nameEl = document.getElementById('diplomaName');
  const input = document.getElementById('diplomaNameInput');
  let name = (input && input.value.trim()) || (nameEl && nameEl.textContent) || 'Un(a) pequeño(a) genio(a)';
  if(input && input.value.trim()) updateDiplomaName(input.value);
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Certificado Pequeños Genios</title>
  <style>
    body{font-family:Georgia,serif;text-align:center;padding:48px;color:#0b1f18;background:#fef8ec;}
    h2{font-size:1.8rem;margin:12px 0;color:#0b3d2e;}
    .name{font-size:1.6rem;font-weight:700;color:#0b3d2e;border-bottom:2px solid #ffd23f;display:inline-block;padding:4px 24px;margin:12px 0;}
    p{line-height:1.5;max-width:480px;margin:8px auto;}
  </style></head><body>
  <div style="font-size:2.5rem;">🏅</div>
  <h2>¡Certificado Pequeños Genios!</h2>
  <p>Se otorga el presente reconocimiento a</p>
  <div class="name">${name.replace(/</g,'')}</div>
  <p>por dominar los fundamentos de electrónica básica:<br>componentes, polaridad, circuitos y laboratorio virtual.</p>
  <p style="margin-top:20px;font-size:.9rem;opacity:.75;">U.E. La Primera · Fe y Alegría · El Alto, Bolivia</p>
  </body></html>`);
  w.document.close();
  w.focus();
  setTimeout(()=>w.print(), 250);
}

/* --- Borrar cable al hacer click --- */
function labWireClick(idx){
  if(idx<0 || idx>=lab.wires.length) return;
  lab.wires.splice(idx, 1);
  lab.lastResult = null;
  if(window.PG){ PG.sfxBad(); PG.toast('Cable eliminado'); }
  renderLab();
}

/* Patch: make wires clickable in renderLab — we intercept after wires are drawn */
const _origRenderLab = typeof renderLab === 'function' ? renderLab : null;

/* Color code game state */
const COLOR_CODE = [
  {name:'Negro', val:0, mult:1, color:'#1a1a1a'},
  {name:'Marrón', val:1, mult:10, color:'#6b3a1f'},
  {name:'Rojo', val:2, mult:100, color:'#c0392b'},
  {name:'Naranja', val:3, mult:1000, color:'#e67e22'},
  {name:'Amarillo', val:4, mult:10000, color:'#f1c40f'},
  {name:'Verde', val:5, mult:100000, color:'#27ae60'},
  {name:'Azul', val:6, mult:1000000, color:'#2980b9'},
  {name:'Violeta', val:7, mult:10000000, color:'#8e44ad'},
  {name:'Gris', val:8, mult:100000000, color:'#7f8c8d'},
  {name:'Blanco', val:9, mult:1000000000, color:'#ecf0f1'}
];
let ccBands = [1, 0, 2]; // brown black red = 1000Ω
function renderColorCode(){
  const host = document.getElementById('colorCodeHost');
  if(!host) return;
  const b0 = COLOR_CODE[ccBands[0]], b1 = COLOR_CODE[ccBands[1]], b2 = COLOR_CODE[ccBands[2]];
  const ohms = (b0.val*10 + b1.val) * b2.mult;
  let label = ohms >= 1e6 ? (ohms/1e6)+' MΩ' : ohms >= 1000 ? (ohms/1000)+' kΩ' : ohms+' Ω';
  host.innerHTML = `
    <div class="resistor-visual">
      <div class="resistor-lead"></div>
      <div class="resistor-body">
        <div class="resistor-band" style="background:${b0.color}"></div>
        <div class="resistor-band" style="background:${b1.color}"></div>
        <div class="resistor-band" style="background:${b2.color}"></div>
        <div class="resistor-band" style="background:#d4a574"></div>
        <div class="resistor-band" style="background:#c9a227"></div>
      </div>
      <div class="resistor-lead"></div>
    </div>
    <p style="text-align:center;font-size:1.2rem;font-weight:800;">Valor: <span style="color:var(--wire-yellow)">${label}</span> ±5%</p>
    <p style="text-align:center;opacity:.7;font-size:.85rem;">Toca una banda y elige el color</p>
    <div class="band-row">
      <span style="opacity:.6;font-size:.75rem;">1ª</span>
      ${COLOR_CODE.map((c,i)=>`<button class="band-btn ${ccBands[0]===i?'selected':''}" style="background:${c.color}" onclick="setBand(0,${i})" title="${c.name}">${c.val}</button>`).join('')}
    </div>
    <div class="band-row">
      <span style="opacity:.6;font-size:.75rem;">2ª</span>
      ${COLOR_CODE.map((c,i)=>`<button class="band-btn ${ccBands[1]===i?'selected':''}" style="background:${c.color}" onclick="setBand(1,${i})" title="${c.name}">${c.val}</button>`).join('')}
    </div>
    <div class="band-row">
      <span style="opacity:.6;font-size:.75rem;">×</span>
      ${COLOR_CODE.map((c,i)=>`<button class="band-btn ${ccBands[2]===i?'selected':''}" style="background:${c.color}" onclick="setBand(2,${i})" title="${c.name} ×">${c.name[0]}</button>`).join('')}
    </div>`;
}
function setBand(pos, idx){
  ccBands[pos] = idx;
  renderColorCode();
  if(window.PG) PG.sfxOk();
}

/* Leaderboard */
function saveScore(game, value){
  if(!window.PG) return;
  const key = game;
  const prev = PG.scores[key];
  // lower is better for moves, higher for quiz
  if(game==='memo_moves'){
    if(prev===undefined || value < prev) PG.scores[key]=value;
  } else {
    if(prev===undefined || value > prev) PG.scores[key]=value;
  }
  PG.save();
  renderLeaderboard();
}
function renderLeaderboard(){
  const el = document.getElementById('leaderboardHost');
  if(!el || !window.PG) return;
  const s = PG.scores;
  el.innerHTML = `<div class="leaderboard"><h4>🏆 RÉCORDS LOCALES</h4>
    <li>Memorama (menos movimientos): <b>${s.memo_moves??'—'}</b></li>
    <li>Quiz (aciertos): <b>${s.quiz_score??'—'}</b></li>
    <li>Polaridad: <b>${s.polar_score??'—'}</b></li>
  </div>`;
}




/* ============================================================
   INICIALIZACIÓN GENERAL
   ============================================================ */
renderTheory();
initQuiz();

/* ===== Navegación por ventanas (views) ===== */
function showView(id) {
  // teoría vive dentro de inicio
  if (id === 'teoria') id = 'inicio';
  const views = document.querySelectorAll('.view');
  views.forEach(v => v.classList.remove('view-active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('view-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Nav active
  document.querySelectorAll('#mainNav a').forEach(a => {
    a.classList.toggle('nav-active', a.dataset.view === id);
  });
  // Update hash without jump
  if (history.replaceState) {
    history.replaceState(null, '', '#' + id);
  } else {
    location.hash = id;
  }
  // Trigger useful inits when opening certain views
  if ((id === 'inicio' || id === 'teoria') && typeof renderTheory === 'function') {
    try { renderTheory(); } catch(e) {}
  }
  if (id === 'juegos' && window.PG && typeof PG.renderMedals === 'function') {
    try { PG.renderMedals(); } catch(e) {}
  }
  if (id === 'laboratorio' && typeof renderLab === 'function') {
    try { renderLab(); } catch(e) {}
  }
  if (id === 'codigo-colores' && typeof renderColorCode === 'function') {
    try { renderColorCode(); } catch(e) {}
  }
}

// On load: respect hash or show inicio
function initViews() {
  const hash = (location.hash || '#inicio').replace('#', '') || 'inicio';
  const valid = ['inicio','componentes','juegos','codigo-colores','laboratorio'];
  showView(valid.includes(hash) ? hash : 'inicio');
}
window.addEventListener('DOMContentLoaded', initViews);
window.addEventListener('hashchange', () => {
  const hash = (location.hash || '#inicio').replace('#', '') || 'inicio';
  const valid = ['inicio','componentes','juegos','codigo-colores','laboratorio'];
  if (valid.includes(hash)) showView(hash);
});

renderLab();
if(typeof initOhmGame==='function') initOhmGame();
if(typeof renderColorCode==='function') renderColorCode();
if(typeof renderLeaderboard==='function') renderLeaderboard();
if(window.PG) PG.renderMedals();

/* ===== Nombre personalizado en certificado ===== */
function updateDiplomaName(val){
  const name = (val || '').trim() || 'Un(a) pequeño(a) genio(a)';
  const el = document.getElementById('diplomaName');
  if(el) el.textContent = name;
  try { localStorage.setItem('pg_student_name', name === "Un(a) pequeño(a) genio(a)" ? '' : name); } catch(e){}
}
function loadDiplomaName(){
  let saved = '';
  try { saved = localStorage.getItem('pg_student_name') || ''; } catch(e){}
  const input = document.getElementById('diplomaNameInput');
  const el = document.getElementById('diplomaName');
  if(saved){
    if(el) el.textContent = saved;
    if(input) input.value = saved;
  }
}
(function hookDiplomaShow(){
  const obs = () => {
    const ov = document.getElementById('diplomaOverlay');
    if(!ov) return;
    const apply = () => {
      if(ov.classList.contains('show')){
        loadDiplomaName();
        const input = document.getElementById('diplomaNameInput');
        if(input) setTimeout(function(){ input.focus(); }, 300);
      }
    };
    const mo = new MutationObserver(apply);
    mo.observe(ov, { attributes:true, attributeFilter:['class'] });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', obs);
  else obs();
})();


/* ===== Tutorial de bienvenida ===== */
let tutStep = 0;
const TUT_TOTAL = 3;
function shouldShowTutorial(){
  try { return localStorage.getItem('pg_tutorial_done') !== '1'; } catch(e){ return true; }
}
function openTutorial(){
  const ov = document.getElementById('tutorialOverlay');
  if(!ov) return;
  tutStep = 0;
  renderTutorialStep();
  ov.style.display = 'flex';
  ov.classList.add('show');
  ov.setAttribute('aria-hidden','false');
}
function closeTutorial(skip){
  const ov = document.getElementById('tutorialOverlay');
  if(ov){
    ov.classList.remove('show');
    ov.setAttribute('aria-hidden','true');
    ov.style.display = 'none';
  }
  try { localStorage.setItem('pg_tutorial_done', '1'); } catch(e){}
}
function renderTutorialStep(){
  document.querySelectorAll('.tutorial-step').forEach(el=>{
    const n = parseInt(el.dataset.step, 10);
    el.hidden = n !== tutStep;
  });
  const dots = document.getElementById('tutDots');
  if(dots){
    dots.innerHTML = '';
    for(let i=0;i<TUT_TOTAL;i++){
      const s = document.createElement('span');
      if(i===tutStep) s.className = 'active';
      dots.appendChild(s);
    }
  }
  const next = document.getElementById('tutNext');
  if(next) next.textContent = tutStep >= TUT_TOTAL-1 ? '¡Empezar!' : 'Siguiente';
}
function tutorialNext(){
  if(tutStep >= TUT_TOTAL-1){
    closeTutorial(false);
    // Llevar a teoría dentro de inicio
    if(typeof showView === 'function'){
      showView('inicio');
      setTimeout(()=>{
        const t = document.getElementById('teoria');
        if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
      }, 200);
    }
    return;
  }
  tutStep++;
  renderTutorialStep();
}
// Tutorial solo manual (boton ruta) — no auto-abrir (bloqueaba toda la pagina)
// document.addEventListener('DOMContentLoaded', ()=>{
//   if(shouldShowTutorial()){ setTimeout(openTutorial, 600); }
// });
// Cerrar si quedo pegado de una sesion anterior
document.addEventListener('DOMContentLoaded', ()=>{
  try { closeTutorial(true); } catch(e) {}
  var ov = document.getElementById('tutorialOverlay');
  if(ov){
    ov.classList.remove('show');
    ov.setAttribute('aria-hidden','true');
    ov.addEventListener('click', function(e){
      if(e.target === ov) closeTutorial(true);
    });
  }
});
// Botón opcional para volver a ver el tutorial (si existe)
window.replayTutorial = function(){
  try { localStorage.removeItem('pg_tutorial_done'); } catch(e){}
  openTutorial();
};
