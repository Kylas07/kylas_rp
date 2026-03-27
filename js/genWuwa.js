
// ═══════════════════════════════════════════════════════════════════
// DONNÉES NEXUS
// ═══════════════════════════════════════════════════════════════════
const NX_REGIONS = [
  {
    id: 'huanglong',
    label: 'Huanglong',
    extraClass: '',
    nexus: [
      { id: 'nx-baie-wuming',         label: 'Baie Wuming',                       on: false },
      { id: 'nx-foret-aveuglante',    label: 'Forêt Aveuglante',                  on: false },
      { id: 'nx-jinzhou',             label: 'Jinzhou',                            on: false },
      { id: 'nx-plaine-nord',         label: 'Plaine Centrale - Nord',             on: false },
      { id: 'nx-plaine-est',          label: 'Plaine Centrale - Est',              on: false },
      { id: 'nx-haut-roches',         label: 'Le Haut des Roches',                 on: false },
      { id: 'nx-mont-firm',           label: 'Mont Firmament',                     on: false },
      { id: 'nx-mont-firm-hong',      label: 'Mont Firmament - Hongzhen',          on: false },
      { id: 'nx-montagnes-tigres',    label: 'Montagnes Tigres',                   on: false },
      { id: 'nx-plaine-norchute',     label: 'Plaine de Nor-Chute',                on: false },
      { id: 'nx-port-guixu',         label: 'Port de Guixu',                      on: false },
      { id: 'nx-tourbe',              label: 'Tourbe Piaulante',                   on: false },
      { id: 'nx-yunling',             label: 'Yunling-la-Vallée',                  on: false },
    ]
  },
  {
    id: 'littoral',
    label: 'Le Littoral Noir',
    extraClass: 'ln',
    nexus: [
      { id: 'nx-tethys',             label: 'Centre de Tethys',                   on: false },
      { id: 'nx-tethys-sud',         label: 'Centre de Tethys - Sud',             on: false },
      { id: 'nx-tethys-est',         label: 'Centre de Tethys - Est',             on: false },
      { id: 'nx-havre-germes',       label: 'Havre de germes',                    on: false },
      { id: 'nx-observatoire',       label: 'Observatoire TD',                    on: false },
    ]
  },
  {
    id: 'rinascita',
    label: 'Rinascita',
    extraClass: '',
    nexus: [
      { id: 'nx-riccioli',           label: 'Îles de Riccioli',                   on: false },
      { id: 'nx-ragunna',            label: 'Ragunna',                            on: false },
      { id: 'nx-averardo',           label: "Chambre forte d'Averardo",            on: false },
      { id: 'nx-domaine-sacre',      label: 'Domaine Sacré',                      on: false },
      { id: 'nx-eaux-beohr',         label: 'Eaux de Beohr',                      on: false },
      { id: 'nx-thessaleo',          label: 'Hautes Terres de Thessaleo',          on: false },
      { id: 'nx-havre-mur-nord',     label: 'Havre des Murmures - Île au nord',   on: false },
      { id: 'nx-havre-mur',          label: 'Havre des Murmures',                 on: false },
      { id: 'nx-fagacees',           label: 'Péninsule des Fagacées',             on: false },
      { id: 'nx-nimbus',             label: 'Sanctuaire de Nimbus',               on: false },
      { id: 'nx-trepas',             label: 'Trépas du Pénitent',                 on: false },
      { id: 'nx-septimont',          label: 'Septimont',                          on: false },
      { id: 'nx-canyon',             label: 'Canyon du ...',                      on: false },
      { id: 'nx-os-titan',           label: "Plaine d'Os du Titan",               on: false },
      { id: 'nx-sanguis-landes',     label: 'Plateaux de Sanguis - Landes d\'asphodèles', on: false },
      { id: 'nx-sanguis-repaire',    label: 'Plateaux de Sanguis - Repaire du chasseur',  on: false },
      { id: 'nx-sanguis-terres',     label: 'Plateaux de Sanguis - Terres déchues',       on: false },
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════
// INIT NEXUS UI
// ═══════════════════════════════════════════════════════════════════
function buildNexusUI() {
  const container = document.getElementById('nx-regions-container');
  container.innerHTML = '';
  NX_REGIONS.forEach(region => {
    const div = document.createElement('div');
    div.className = 'sec';
    const synced = region.nexus.filter(n=>n.on).length;
    div.innerHTML = `
      <div class="sh">
        <span>${region.label}</span>
        <span class="nx-count"><span id="nxc-${region.id}">${synced}</span> / ${region.nexus.length}</span>
      </div>
      <div class="sb">
        <div class="nx-actions">
          <button class="nx-btn" onclick="nxRegionAll('${region.id}',true)">Tout synchroniser</button>
          <button class="nx-btn" onclick="nxRegionAll('${region.id}',false)">Tout désynchroniser</button>
        </div>
        <div class="nx-grid" id="nxg-${region.id}"></div>
      </div>`;
    container.appendChild(div);

    const grid = document.getElementById('nxg-' + region.id);
    region.nexus.forEach(nx => {
      const tag = document.createElement('div');
      tag.className = 'nx-tag' + (nx.on ? ' on' : '') + (region.extraClass === 'ln' ? ' ln-style' : '');
      tag.id = 'nxt-' + nx.id;
      tag.innerHTML = `<span class="dot"></span><span>${nx.label}</span>`;
      tag.onclick = () => toggleNx(nx.id, region.id);
      grid.appendChild(tag);
    });
  });
  updateNxTotalCount();
}

function toggleNx(nxId, regionId) {
  const region = NX_REGIONS.find(r => r.id === regionId);
  const nx = region.nexus.find(n => n.id === nxId);
  nx.on = !nx.on;
  const tag = document.getElementById('nxt-' + nxId);
  tag.classList.toggle('on', nx.on);
  // update region counter
  const synced = region.nexus.filter(n=>n.on).length;
  document.getElementById('nxc-' + regionId).textContent = synced;
  updateNxTotalCount();
}

function nxRegionAll(regionId, state) {
  const region = NX_REGIONS.find(r => r.id === regionId);
  region.nexus.forEach(nx => {
    nx.on = state;
    const tag = document.getElementById('nxt-' + nx.id);
    if(tag) tag.classList.toggle('on', state);
  });
  const synced = region.nexus.filter(n=>n.on).length;
  document.getElementById('nxc-' + regionId).textContent = synced;
  updateNxTotalCount();
}

function updateNxTotalCount() {
  const total = NX_REGIONS.reduce((s,r) => s + r.nexus.length, 0);
  const synced = NX_REGIONS.reduce((s,r) => s + r.nexus.filter(n=>n.on).length, 0);
  const el = document.getElementById('nx-total-count');
  if(el) el.innerHTML = `Total synchronisés : <span>${synced} / ${total}</span>`;
}

// ═══════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════
function sw(name) {
  document.querySelectorAll('.tp').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById('tp-'+name).classList.add('on');
  document.querySelectorAll('.tab').forEach(t=>{
    if(t.getAttribute('onclick')==="sw('"+name+"')") t.classList.add('on');
  });
  if(name==='export'){
    const c=document.getElementById('out').textContent;
    if(!c.startsWith('—')) document.getElementById('preview-frame').srcdoc=buildPreview(c);
  }
}

// ═══════════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════════
function utotal() {
  const ids=['s-res','s-for','s-int','s-con','s-dex','s-cha','s-per'];
  const t=ids.reduce((s,id)=>s+(parseInt(document.getElementById(id).value)||0),0);
  const ok=t===36;
  ['tp1','tp2'].forEach(id=>{
    const p=document.getElementById(id);if(!p)return;
    p.textContent=t+' / 36';
    p.style.color=ok?'var(--ok)':'var(--err)';
    p.style.borderColor=ok?'rgba(90,158,122,.5)':'rgba(158,90,90,.5)';
    p.style.background=ok?'rgba(90,158,122,.1)':'rgba(158,90,90,.1)';
  });
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════
function sv(id,v){const e=document.getElementById(id);if(e)e.value=v||'';}
function ss(id,v){
  const e=document.getElementById(id);if(!e)return;
  for(const o of e.options)if(o.value.toLowerCase()===(v||'').toLowerCase()){e.value=o.value;return;}
}
function g(id){return(document.getElementById(id)?.value||'').trim();}

function previewBanner(){
  const url=g('f-banner');
  const th=document.getElementById('banner-th');
  const ph=document.getElementById('banner-ph');
  if(url){th.src=url;th.style.display='block';ph.style.display='none';}
  else{th.style.display='none';ph.style.display='flex';}
}

// ═══════════════════════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════════════════════
const DEMO = `<center><div class="wer" style="--banner:url('https://64.media.tumblr.com/745d63eaa3f969a2ecd3d94b6dfad59c/4bc0f8bc73c44050-58/s1280x1920/0a82ca42f41b83c59b1a9443e8b8255bc08f8cb7.gif');"><div class="card"><div class="header"><div><div class="name">Caligula Kerberos</div><div class="chips"><span>Feat : Richard I</span><span>Source : Fate Series</span></div></div></div><div class="wergrid"><div><div class="box"><div class="row"><b>Type</b><span>Résonateur</span></div><div class="row"><b>Élément</b><span>Spectro</span></div><div class="row"><b>Arme</b><span>Epée à une main</span></div><div class="row"><b>Équipement</b><span>Intermédiaire</span></div><div class="row"><b>Domaine expert</b><span>Gestion de l'effort</span></div><div class="row"><b>Domaine bon</b><span>Déduction instinctive</span></div><div class="row"><b>Domaine moyen</b><span>Charisme naturel</span></div><div class="stats"><div class="stat"><span>Résonance</span></div><div class="val">— 07</div><div class="stat"><span>Force</span></div><div class="val">— 04</div><div class="stat"><span>Intelligence</span></div><div class="val">— 02</div><div class="stat"><span>Constitution</span></div><div class="val">— 09</div><div class="stat"><span>Dextérité</span></div><div class="val">— 04</div><div class="stat"><span>Charisme</span></div><div class="val">— 07</div><div class="stat"><span>Perception</span></div><div class="val">— 03</div></div></div></div><div class="wercol"><div class="skills"><div class="skill"><div class="k"><b>Attaque de base</b></div><div class="d">L'arme de prédilection de Caligula est l'épée.</div></div><div class="skill"><div class="k"><b>Compétence Résonatrice</b></div><div class="d">[b]Forge lumineuse : [/b]\nCaligula concentre la lumière autour de sa main.</div></div><div class="skill"><div class="k"><b>Libération Résonatrice</b></div><div class="d">[b]Lamentation lumineuse : [/b]\nCaligula absorbe la lumière des environs.</div></div><div class="skill"><div class="k"><b>Effet négatif</b></div><div class="d">- Dans un endroit sombre, la puissance est impactée.</div></div></div></div></div></div></div>
<div class="nexus"><div class="nx on"><div class="ico"></div><div class="z">Baie Wuming</div></div><div class="nx"><div class="ico"></div><div class="z">Forêt Aveuglante</div></div><div class="nx"><div class="ico"></div><div class="z">Jinzhou</div></div><div class="nx"><div class="ico"></div><div class="z">Plaine Centrale - Nord</div></div><div class="nx"><div class="ico"></div><div class="z">Plaine Centrale - Est</div></div><div class="nx"><div class="ico"></div><div class="z">Le Haut des Roches</div></div><div class="nx"><div class="ico"></div><div class="z">Mont Firmament</div></div><div class="nx"><div class="ico"></div><div class="z">Mont Firmament - Hongzhen</div></div><div class="nx"><div class="ico"></div><div class="z">Montagnes Tigres</div></div><div class="nx"><div class="ico"></div><div class="z">Plaine de Nor-Chute</div></div><div class="nx"><div class="ico"></div><div class="z">Port de Guixu</div></div><div class="nx"><div class="ico"></div><div class="z">Tourbe Piaulante</div></div><div class="nx"><div class="ico"></div><div class="z">Yunling-la-Vallée</div></div></div>
<div class="nexus"><div class="nx ln"><div class="ico"></div><div class="z">Centre de Tethys</div></div><div class="nx ln"><div class="ico"></div><div class="z">Centre de Tethys - Sud</div></div><div class="nx ln"><div class="ico"></div><div class="z">Centre de Tethys - Est</div></div><div class="nx ln"><div class="ico"></div><div class="z">Havre de germes</div></div><div class="nx ln"><div class="ico"></div><div class="z">Observatoire TD</div></div></div>
<div class="nexus"><div class="nx"><div class="ico"></div><div class="z">Îles de Riccioli</div></div><div class="nx on"><div class="ico"></div><div class="z">Ragunna</div></div><div class="nx"><div class="ico"></div><div class="z">Chambre forte d'Averardo</div></div><div class="nx"><div class="ico"></div><div class="z">Domaine Sacré</div></div><div class="nx"><div class="ico"></div><div class="z">Eaux de Beohr</div></div><div class="nx"><div class="ico"></div><div class="z">Hautes Terres de Thessaleo</div></div><div class="nx"><div class="ico"></div><div class="z">Havre des Murmures - Île au nord</div></div><div class="nx"><div class="ico"></div><div class="z">Havre des Murmures</div></div><div class="nx"><div class="ico"></div><div class="z">Péninsule des Fagacées</div></div><div class="nx"><div class="ico"></div><div class="z">Sanctuaire de Nimbus</div></div><div class="nx"><div class="ico"></div><div class="z">Trépas du Pénitent</div></div><div class="nx"><div class="ico"></div><div class="z">Septimont</div></div><div class="nx"><div class="ico"></div><div class="z">Canyon du ...</div></div><div class="nx"><div class="ico"></div><div class="z">Plaine d'Os du Titan</div></div><div class="nx"><div class="ico"></div><div class="z">Plateaux de Sanguis - Landes d'asphodèles</div></div><div class="nx"><div class="ico"></div><div class="z">Plateaux de Sanguis - Repaire du chasseur</div></div><div class="nx"><div class="ico"></div><div class="z">Plateaux de Sanguis - Terres déchues</div></div></div></center>`;

function demo(){document.getElementById('raw').value=DEMO;parse();}

// ═══════════════════════════════════════════════════════════════════
// PARSER
// ═══════════════════════════════════════════════════════════════════

// Correspondance label → id interne, pour la mise à jour des nexus via le HTML collé
const NX_LABEL_MAP = {};
NX_REGIONS.forEach(r => r.nexus.forEach(nx => {
  NX_LABEL_MAP[nx.label.toLowerCase().trim()] = { regionId: r.id, nxId: nx.id };
}));

function parse() {
  const raw = document.getElementById('raw').value.trim();
  const pst = document.getElementById('pst');
  if(!raw){pst.className='st er';pst.textContent='✕ Aucun HTML à analyser.';return;}

  const doc = new DOMParser().parseFromString(raw,'text/html');
  const found = [];

  // Nom
  const ne=doc.querySelector('.name');
  if(ne){sv('f-name',ne.textContent.trim());found.push('nom');}

  // Chips
  doc.querySelectorAll('.chips span').forEach(c=>{
    const t=c.textContent.trim();
    if(t.startsWith('Feat')){sv('f-feat',t.replace(/^Feat\s*:\s*/,'').trim());found.push('feat');}
    if(t.startsWith('Source')){sv('f-source',t.replace(/^Source\s*:\s*/,'').trim());found.push('source');}
  });

  // Banner
  const werEl=doc.querySelector('.wer,[style*="--banner"]');
  if(werEl){
    const m=(werEl.getAttribute('style')||'').match(/--banner\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    if(m){sv('f-banner',m[1].trim());previewBanner();found.push('bannière');}
  }

  // Rows
  doc.querySelectorAll('.row').forEach(r=>{
    const b=r.querySelector('b')?.textContent?.trim();
    const v=r.querySelector('span')?.textContent?.trim();
    if(!b||!v)return;
    if(b==='Élément'){ss('f-element',v);found.push('élément');}
    if(b==='Arme'){ss('f-arme',v);found.push('arme');}
    if(b==='Équipement'){ss('f-equip',v);found.push('équipement');}
    if(b==='Domaine expert'){sv('f-dom1',v);found.push('domaine expert');}
    if(b==='Domaine bon'){sv('f-dom2',v);found.push('domaine bon');}
    if(b==='Domaine moyen'){sv('f-dom3',v);found.push('domaine moyen');}
  });

  // Stats
  const statMap={'résonance':'s-res','force':'s-for','intelligence':'s-int','constitution':'s-con','dextérité':'s-dex','charisme':'s-cha','perception':'s-per'};
  const statEls=doc.querySelectorAll('.stat');
  const valEls=doc.querySelectorAll('.val');
  let sc=0;
  statEls.forEach((el,i)=>{
    const name=(el.querySelector('span')||el).textContent.trim().toLowerCase();
    const num=parseInt((valEls[i]?.textContent||'').replace(/[^0-9]/g,''));
    const id=statMap[name];
    if(id&&!isNaN(num)){sv(id,num);sc++;}
  });
  if(sc)found.push(sc+' stats');

  // Skills
  doc.querySelectorAll('.skill').forEach(sk=>{
    const title=(sk.querySelector('.k b')||sk.querySelector('b'))?.textContent?.trim()||'';
    const desc=sk.querySelector('.d')?.textContent?.trim()||'';
    const tl=title.toLowerCase();
    if(tl.includes('attaque de base')){sv('f-atk',desc);found.push('attaque de base');}
    if(tl.includes('compétence')){
      const m=desc.match(/\[b\]([^\[]+?)\s*:\s*\[\/b\]\s*([\s\S]*)/);
      if(m){sv('f-cnom',m[1].trim());sv('f-cdesc',m[2].trim());}else sv('f-cdesc',desc);
      found.push('compétence');
    }
    if(tl.includes('libération')||tl.includes('liberation')){
      const m=desc.match(/\[b\]([^\[]+?)\s*:\s*\[\/b\]\s*([\s\S]*)/);
      if(m){sv('f-lnom',m[1].trim());sv('f-ldesc',m[2].trim());}else sv('f-ldesc',desc);
      found.push('libération');
    }
    if(tl.includes('négatif')||tl.includes('negatif')){sv('f-neg',desc);found.push('effets négatifs');}
  });

  // ── NEXUS ──────────────────────────────────────────────────────
  // Reset tout d'abord
  NX_REGIONS.forEach(r=>r.nexus.forEach(nx=>nx.on=false));

  // Parcourt tous les .nx du HTML collé
  let nxFound = 0;
  doc.querySelectorAll('.nx').forEach(el=>{
    const label = el.querySelector('.z')?.textContent?.trim()||'';
    const isOn  = el.classList.contains('on');
    const key   = label.toLowerCase().trim();
    const match = NX_LABEL_MAP[key];
    if(match){
      const region = NX_REGIONS.find(r=>r.id===match.regionId);
      const nx     = region.nexus.find(n=>n.id===match.nxId);
      nx.on = isOn;
      nxFound++;
    }
  });

  if(nxFound>0) found.push(nxFound+' nexus');

  // Rebuild UI
  buildNexusUI();
  utotal();

  if(!found.length){
    pst.className='st er';
    pst.innerHTML='✕ Aucun champ reconnu. Vérifie le HTML collé.';
  } else {
    pst.className='st ok';
    pst.innerHTML='✓ '+found.length+' éléments extraits : '+found.join(', ')+'.'
      +' <a href="#" onclick="sw(\'edit\');return false;" style="color:var(--accent);text-decoration:underline;">→ Éditer</a>'
      +' · <a href="#" onclick="sw(\'nexus\');return false;" style="color:var(--accent);text-decoration:underline;">→ Nexus</a>';
  }
}

// ═══════════════════════════════════════════════════════════════════
// GENERATE HTML
// ═══════════════════════════════════════════════════════════════════
const STAT_LABELS=[['Résonance','s-res'],['Force','s-for'],['Intelligence','s-int'],['Constitution','s-con'],['Dextérité','s-dex'],['Charisme','s-cha'],['Perception','s-per'],['À venir','']];

function buildNexusHTML() {
  let out = '';
  NX_REGIONS.forEach(region => {
    const nxItems = region.nexus.map(nx => {
      const onClass = nx.on ? ' on' : '';
      const lnClass = region.extraClass === 'ln' ? ' ln' : '';
      return `<div class="nx${onClass}${lnClass}"><div class="ico"></div><div class="z">${nx.label}</div></div>`;
    }).join('');
    out += `\n<div class="nexus">${nxItems}</div>\n`;
  });
  return out;
}

function gen() {
  const total=STAT_LABELS.slice(0,-1).reduce((s,[,id])=>s+(parseInt(g(id))||0),0);
  const sh=STAT_LABELS.map(([n,id])=>`<div class="stat"><span>${n}</span></div><div class="val">— ${id?g(id)||'—':''}</div>`).join('\n');
  const banner=g('f-banner');

  // Nexus HTML par région avec titres
  const [hl, ln, ri] = NX_REGIONS;
  const nxHuanglong = hl.nexus.map(nx=>`<div class="nx${nx.on?' on':''}"><div class="ico"></div><div class="z">${nx.label}</div></div>`).join('');
  const nxLittoral  = ln.nexus.map(nx=>`<div class="nx${nx.on?' on':''} ln"><div class="ico"></div><div class="z">${nx.label}</div></div>`).join('');
  const nxRinascita = ri.nexus.map(nx=>`<div class="nx${nx.on?' on':''}"><div class="ico"></div><div class="z">${nx.label}</div></div>`).join('');

  const code=`<link rel="stylesheet" href="https://dl.dropboxusercontent.com/scl/fi/lkrq151wvs70qn4k1pz66/wer-fichetechnique.css?rlkey=yoj55d4obazodjn6o39lnql0h&st=3dmwqvog&">
<center><div class="wer" style="--banner:url('${banner}');"><div class="card"><div class="header"><div><div class="name">${g('f-name')}</div><div class="chips"><span>Feat : ${g('f-feat')}</span><span>Source : ${g('f-source')}</span></div></div></div><div class="wergrid"><div><div class="box" style="border: var(--border3);background:linear-gradient(45deg,#13423e7a,#403028);"><h3 style="color:var(--accent2);">Fiche technique</h3><div class="row"><b>Type</b><span>Résonateur</span></div>
<div class="row"><b>Élément</b><span>${g('f-element')}</span></div>
<div class="row"><b>Arme</b><span>${g('f-arme')}</span></div>
<div class="row"><b>Équipement</b><span>${g('f-equip')}</span></div>
<div class="row"><b>Domaine expert</b><span>${g('f-dom1')}</span></div>
<div class="row"><b>Domaine bon</b><span>${g('f-dom2')}</span></div>
<div class="row"><b>Domaine moyen</b><span>${g('f-dom3')}</span></div><div class="sep"></div><div class="mini minirow"><span>Stats</span><span class="pill"><b>Total</b> ${total} / 36</span></div><div class="sep"></div><div class="stats">
${sh}</div></div></div><div class="wercol"><details class="acc" open><summary><span class="acc-title" style="color:var(--accent2);">Capacités</span><span class="x">+</span></summary><div class="body skills"><div class="skill"><div class="k"><b>Attaque de base</b><span class="mini">—</span></div><div class="d">${g('f-atk')}</div></div>
<div class="skill"><div class="k"><b>Compétence Résonatrice</b><span class="mini">—</span></div><div class="d">[b]${g('f-cnom')} : [/b]
${g('f-cdesc')}

</div></div>
<div class="skill"><div class="k"><b>Libération Résonatrice</b><span class="mini">—</span></div><div class="d">[b]${g('f-lnom')} : [/b]
${g('f-ldesc')}</div></div>
<div class="skill"><div class="k"><b>Effet négatif</b><span class="mini">—</span></div><div class="d">${g('f-neg')}</div></div></div></details></div></div><div class="fullstack"><div class="box"><h3 style="color:var(--accent2);">Matériaux</h3><div class="mini">Stockage des matériaux</div><div class="sep"></div><div class="inv"><div class="it"><img src="https://placehold.jp/21222e/ffffff/50x50.png" alt=""><div class="t">Matériau — Quantité</div></div></div></div>

<div class="box"><h3>Nexus synchronisés</h3><div class="mini">Ajouter <b>on</b> après nx du code, pour valider la synchronisation avec le Nexus.<br><br><b>Huanglong</b></div><div class="sep"></div><div class="nexus">${nxHuanglong}</div>

<div class="mini"><b>Le Littoral Noir</b></div><div class="sep"></div><div class="nexus">${nxLittoral}</div>

<div class="mini"><b>Rinascita</b></div><div class="sep"></div><div class="nexus">${nxRinascita}</div></div>

<div class="box"><h3>Montures &amp; skins</h3><div class="mini">Icônes + libellés.</div><div class="sep"></div><div class="inv"><div class="it"><img src="https://2img.net/i.imgur.com/IjNC2h7.png" alt=""><div class="t">Monture — Nom</div></div></div></div></div></div></div></center>`;

  document.getElementById('out').textContent = code;
  return code;
}

// ═══════════════════════════════════════════════════════════════════
// PREVIEW / COPY / DOWNLOAD
// ═══════════════════════════════════════════════════════════════════
const FORUM_ROOT=`:root{--text:#333;--red:#D31141;--link:#000;--light:#FFF;--lighter:#fafafa;--grey:#F4F4F4;--greyer:#E5E5E5;--border:1px solid #E5E5E5;--font:'Open Sans';--gap-size:16px;--ease:cubic-bezier(0.4,0.0,0.2,1);--ease-bounce:cubic-bezier(0.43,0.09,0.38,2.56);}
:root{--accent1:#43897a;--accent2:#b39b73;--accent3:#6aaf81;--accent4:#785c50;--white:#fff;--bgmono:url(https://2img.net/i.imgur.com/vrX4zlV.png);--bgimg2:url(https://dl.dropboxusercontent.com/scl/fi/giapuol45q5oso33ds3o2/WER-bg3.png?rlkey=3ts8moh58upf4ljngich7ryst&st=p9rtqpl7&dl=0);--marco1:url(https://2img.net/i.imgur.com/e3iy4xG.png);--marco2:url(https://2img.net/i.imgur.com/BSD5SkR.png);--bg1:#2e2e2e;--bg2:#090e0d;--bg3:#14191a;--bg4:#090e0d54;--text1:#dfdfdf;--text2:#ebebeb;--text3:#b4b4b4;--text4:#606579;--font1:"Playfair Display","sans-serif";--font2:italic 12px Playfair Display,serif;--font3:Montserrat,Verdana,sans-serif;--font4:12px / 130% Cambria,sans serif;--font5:Qestero;--grad1:linear-gradient(45deg,var(--accent4),var(--accent1));--grad5:linear-gradient(45deg,var(--accent1),transparent);--border1:1px solid #524a3bc9;--border2:1px solid #3f4154;--border3:1px solid var(--gold6);--border4:1px solid var(--gold7);--hua:#D9C45E;--lin:#5AB5D6;--rag:#64C4AC;--sep:#D16645;--fra:#B55757;--neu:#91A1E3;--gdbkimg:url(https://2img.net/i.imgur.com/IjNC2h7.png);--imgcirc:url(https://2img.net/i.imgur.com/4EGOViU.png);--gold1:#5c5245;--gold2:#5d3c24;--gold3:#f9cb7c;--gold4:#a07454;--gold5:#b29a68;--gold6:#a49075;--gold7:#6b5f47;--accentg1:#43897a;--accentg2:#767676;--accentg3:#8b6347;}`;

function buildPreview(code){
  return`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${FORUM_ROOT}</style></head><body style="background:#14191a;padding:1rem;">${code}</body></html>`;
}

function rp(){
  const c=document.getElementById('out').textContent;
  if(!c.startsWith('—'))document.getElementById('preview-frame').srcdoc=buildPreview(c);
}

function cp(){
  const c=document.getElementById('out').textContent;
  if(c.startsWith('—'))return;
  navigator.clipboard.writeText(c).then(()=>{
    const b=event.target,o=b.textContent;b.textContent='✓ Copié !';setTimeout(()=>b.textContent=o,1500);
  });
}

function dl(){
  const c=document.getElementById('out').textContent;
  if(c.startsWith('—'))return;
  const a=Object.assign(document.createElement('a'),{
    href:URL.createObjectURL(new Blob([c],{type:'text/html'})),
    download:`fiche-${g('f-name').replace(/\s+/g,'-').toLowerCase()||'perso'}.html`
  });
  a.click();
}

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
buildNexusUI();
utotal();
