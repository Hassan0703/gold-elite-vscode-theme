const vscode = require('vscode');

const CONFIG_NS = 'goldElite';

function isFeatureEnabled(key) {
  const c = vscode.workspace.getConfiguration(CONFIG_NS);
  if (!c.get('experience.enabled', true)) return false;
  return c.get(key, true);
}

function cssLink(wv, ctx, file) {
  return wv.asWebviewUri(vscode.Uri.file(ctx.asAbsolutePath(file))).toString();
}

let bootPanel = undefined;

function showBootV2(context) {
  if (!isFeatureEnabled('bootSequence.enabled')) return;
  const ws = context.workspaceState;
  if (ws.get('bootSequence.hasShownThisSession')) return;
  ws.update('bootSequence.hasShownThisSession', true);

  const rm = vscode.workspace.getConfiguration('workbench').get('reduceMotion', false);

  bootPanel = vscode.window.createWebviewPanel(
    'goldElite.boot', 'Gold Elite',
    { viewColumn: vscode.ViewColumn.Active, preserveFocus: true },
    { enableScripts: true, localResourceRoots: [vscode.Uri.file(context.extensionPath)] }
  );

  const shapesUrl = cssLink(bootPanel.webview, context, 'webview-assets/gold-elite-shapes.css');
  const dur = rm ? 600 : 3400;

  bootPanel.webview.html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<link rel="stylesheet" href="${shapesUrl}">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#0A0A0A;display:flex;align-items:center;justify-content:center;font-family:sans-serif;overflow:hidden}
.container{text-align:center;position:relative}
.logo-svg{width:140px;height:140px}
.logo-svg rect{fill:none;stroke:#FFD700;stroke-width:2}
${rm?'':`
.logo-draw{stroke-dasharray:400;stroke-dashoffset:400;animation:ld 900ms cubic-bezier(0.4,0,0.2,1) forwards}
.hex-group{opacity:0;animation:hxf 700ms cubic-bezier(0.34,1.56,0.64,1) 900ms forwards}
@keyframes ld{to{stroke-dashoffset:0}}
@keyframes hxf{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
.dual-line{height:2px;width:0;animation:dl 600ms ease-out 1600ms forwards}
@keyframes dl{to{width:240px}}
.title{color:#E7E3D6;font-size:28px;letter-spacing:4px;opacity:0;animation:tf 500ms ease-out 2200ms forwards}
@keyframes tf{to{opacity:1}}
`}
${rm?'.logo-draw{stroke-dashoffset:0}.hex-group{opacity:1}.dual-line{height:2px;width:240px;margin-top:20px}.title{color:#E7E3D6;font-size:28px;letter-spacing:4px;opacity:1}':''}
.hex-row{display:flex;gap:8px;justify-content:center;margin-top:16px}
.hex-row .ge-hex-badge{width:24px;height:24px}
</style></head><body>
<div class="container">
<svg class="logo-svg" viewBox="0 0 140 140">
  <rect class="logo-draw" x="15" y="15" width="110" height="110" rx="18"/>
  <text x="70" y="88" text-anchor="middle" fill="#FFD700" font-family="sans-serif" font-weight="bold" font-size="54">GE</text>
</svg>
<div class="hex-group hex-row">
  <div class="ge-hex-badge ge-hex-badge--gold"></div>
  <div class="ge-hex-badge ge-hex-badge--emerald"></div>
  <div class="ge-hex-badge ge-hex-badge--gold"></div>
  <div class="ge-hex-badge ge-hex-badge--emerald"></div>
  <div class="ge-hex-badge ge-hex-badge--gold"></div>
  <div class="ge-hex-badge ge-hex-badge--emerald"></div>
</div>
<div class="dual-line ge-dual-sweep" style="margin:20px auto 0"></div>
<div class="title">GOLD ELITE</div>
</div>
<script>(function(){const vscode=acquireVsCodeApi();const d=${dur};
function go(){vscode.postMessage({type:'bootDone'})}
window.addEventListener('keydown',go);window.addEventListener('click',go);
setTimeout(go,d)})()</script>
</body></html>`;

  bootPanel.webview.onDidReceiveMessage(msg => {
    if (msg.type === 'bootDone') {
      if (bootPanel) { bootPanel.dispose(); bootPanel = undefined; }
      openCommandCenter(context);
    }
  });
}

function openCommandCenter(context) {
  if (!isFeatureEnabled('commandCenter.enabled')) return;
  const autoOpen = vscode.workspace.getConfiguration(CONFIG_NS).get('commandCenter.autoOpenOnStartup', true);
  if (!autoOpen) return;
  vscode.commands.executeCommand('workbench.view.extension.goldElite').then(undefined, () => {});
}

class CCProvider {
  constructor(ctx) {
    this.ctx = ctx; this.view = undefined; this._pt = undefined;
    this._se = 0; this._sla = 0; this._slr = 0; this._tc = 0; this._fc = 0; this._nc = 0;
    this.ctx.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(e => { try {
        this._se++;
        for (const c of e.contentChanges) {
          const added = c.text.split('\n').length - 1;
          const removed = c.range.end.line - c.range.start.line;
          this._sla += added;
          this._slr += removed;
        }
      } catch(er) { console.error('GE: CC text change error',er); } })
    );
  }
  resolveWebviewView(v) {
    this.view = v;
    v.webview.options = { enableScripts: true, localResourceRoots: [vscode.Uri.file(this.ctx.extensionPath)] };
    this._render();
    this._start();
    v.webview.onDidReceiveMessage(msg => {
      if (msg.t === 'open' && msg.p) {
        const uri = vscode.Uri.file(msg.p);
        vscode.workspace.openTextDocument(uri).then(doc => {
          vscode.window.showTextDocument(doc, { preserveFocus: false });
        });
      }
    });
    v.onDidDispose(() => this._stop());
  }
  _render() {
    if (!this.view) return;
    const ft = this.ctx.workspaceState.get('focusTimer.seconds', 0);
    this.view.webview.html = this._html(ft);
  }
  _getShapes() {
    return this.view ? cssLink(this.view.webview, this.ctx, 'webview-assets/gold-elite-shapes.css') : '';
  }
  _html(ft) {
    const br = this._gb(); const uc = this._gu(); const ab = this._ga();
    const re = this._gr(); const s = this._getShapes();
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<link rel="stylesheet" href="${s}">
<style>
*{margin:0;padding:0;box-sizing:border-box;color:#E7E3D6;font-family:-apple-system,BlinkMacSystemFont,sans-serif}
body{background:#0A0A0A;padding:16px;font-size:11px;line-height:1.5}
.ge-header{display:flex;align-items:center;height:36px;padding:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:1.8px;color:#BFA53A;text-transform:uppercase;border-bottom:1px solid #2A2820;margin-bottom:16px}
.ge-header span{color:#BFA53A}
.ge-section{margin-bottom:16px}
.ge-section:last-child{margin-bottom:0}
.ge-section-title{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#6E6A5E;padding:0 0 8px 0}
.ge-card-content{padding:4px 0}
.ge-file-card{background:#111111;border:1px solid #2A2820;border-radius:3px;padding:8px 12px;margin-bottom:6px;cursor:pointer;transition:border-color 0.15s}
.ge-file-card:hover{border-color:#BFA53A;background:#141410}
.ge-file-name{font-size:12px;font-weight:500;color:#E7E3D6;line-height:1.4;display:flex;align-items:center;gap:8px}
.ge-file-path{font-size:10px;color:#6E6A5E;margin-top:2px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ge-empty-state{font-size:11px;color:#6E6A5E;padding:4px 0;font-style:italic}
.ge-ach-row{display:flex;align-items:center;gap:10px;padding:5px 0}
.ge-ach-name{font-size:11px;font-weight:500;line-height:1.4}
.ge-ach-desc{font-size:9px;color:#6E6A5E;margin-top:1px;line-height:1.3}
</style></head><body>
<div class="ge-header"><span>✦ Gold Elite</span></div>
<div class="ge-section">
<div class="ge-facet-card ge-facet-card--gold">
<div class="ge-section-title" style="padding:12px 16px 8px">Session</div>
<div class="ge-stat-row"><span class="ge-stat-label">Edits</span><span class="ge-stat-value" style="color:#FFD700">${this._se}</span></div>
<div class="ge-stat-row"><span class="ge-stat-label">Lines</span><span class="ge-stat-value" style="color:#2ECC9A">+${this._sla}&thinsp;/&thinsp;−${this._slr}</span></div>
<div class="ge-stat-row" style="padding-bottom:12px"><span class="ge-stat-label">Focus</span><span class="ge-stat-value" style="color:#FFD700">${Math.floor(ft/60)}m</span></div>
</div>
</div>
<div class="ge-section">
<div class="ge-facet-card ge-facet-card--emerald">
<div class="ge-section-title" style="padding:12px 16px 8px">Git</div>
<div class="ge-stat-row"><span class="ge-stat-label">Branch</span><span class="ge-stat-value" style="color:#2ECC9A">${br}</span></div>
<div class="ge-stat-row"><span class="ge-stat-label">Uncommitted</span><span class="ge-stat-value" style="color:#FFD700">${uc}</span></div>
<div class="ge-stat-row" style="padding-bottom:12px"><span class="ge-stat-label">Ahead&thinsp;/&thinsp;Behind</span><span class="ge-stat-value" style="color:#2ECC9A">${ab}</span></div>
</div>
</div>
<div class="ge-section">
<div class="ge-facet-card ge-facet-card--gold">
<div class="ge-section-title" style="padding:12px 16px 8px">Annotations</div>
<div class="ge-stat-row"><span class="ge-stat-label">TODO</span><span class="ge-stat-value" style="color:#FFD700">${this._tc}</span></div>
<div class="ge-stat-row"><span class="ge-stat-label">FIXME</span><span class="ge-stat-value" style="color:#E06C4A">${this._fc}</span></div>
<div class="ge-stat-row" style="padding-bottom:12px"><span class="ge-stat-label">NOTE</span><span class="ge-stat-value" style="color:#2ECC9A">${this._nc}</span></div>
</div>
</div>
<div class="ge-section">
<div class="ge-section-title">Recent Files</div>
${re.length===0?'<div class="ge-empty-state">No recent files</div>':
  re.map(f=>`<div class="ge-file-card" data-p="${f.path}"><div class="ge-file-name"><span class="ge-diamond-bullet"></span>${f.name}</div><div class="ge-file-path">${f.path}</div></div>`).join('')}
</div>
<div class="ge-section">
<div class="ge-section-title">Achievements</div>
${this._ach()}
</div>
<script>
(function(){const vscode=acquireVsCodeApi();
document.querySelectorAll('.ge-file-card').forEach(function(e){
e.addEventListener('click',function(){vscode.postMessage({t:'open',p:this.dataset.p})})})})()
</script></body></html>`;
  }
  _ach() {
    const all = ['firstLight','momentum','nightOwl','streakKeeper','bracketMaster','debugger','cleanSweep','theElite'];
    const nm = {firstLight:'First Light',momentum:'Momentum',nightOwl:'Night Owl',streakKeeper:'Streak Keeper',
      bracketMaster:'Bracket Master',debugger:'Debugger',cleanSweep:'Clean Sweep',theElite:'The Elite'};
    const ds = {firstLight:'First file saved',momentum:'100 saves',nightOwl:'Saved 12am–4am',
      streakKeeper:'7-day streak',bracketMaster:'10K brackets',debugger:'10 debug sessions',
      cleanSweep:'Zero TODOs',theElite:'All unlocked'};
    const emeraldA = ['bracketMaster','debugger','cleanSweep'];
    const st = this.ctx.globalState;
    return all.map(a => {
      const u = st.get(`achievement.${a}`, false);
      let badge = 'ge-hex-badge--gold ge-hex-badge--sm';
      if (emeraldA.includes(a)) badge = 'ge-hex-badge--emerald ge-hex-badge--sm';
      if (a === 'theElite') badge = 'ge-hex-badge--gold ge-hex-badge--sm';
      const icon = a === 'theElite'
        ? '<div class="ge-hex-badge ge-hex-badge--emerald ge-hex-badge--sm"><div class="ge-hex-badge ge-hex-badge--gold ge-hex-badge--xs"></div></div>'
        : `<div class="${badge}"></div>`;
      return `<div class="ge-ach-row" style="opacity:${u?1:0.45}">
        ${icon}<div><div class="ge-ach-name" style="color:${u?'#FFD700':'#6E6A5E'}">${nm[a]}</div>
        <div class="ge-ach-desc">${ds[a]}</div></div></div>`;
    }).join('');
  }
  _gb() { try { const g=vscode.extensions.getExtension('vscode.git');
    if(!g||!g.isActive||!g.exports)return'—';const a=g.exports.getAPI(1);
    if(!a||!a.repositories||!a.repositories.length)return'—';const r=a.repositories[0];
    if(!r.state||!r.state.HEAD)return'—';return r.state.HEAD.name||'—'
  }catch(e){}return'—' }
  _gu() { try { const g=vscode.extensions.getExtension('vscode.git');
    if(!g||!g.isActive||!g.exports)return'—';const a=g.exports.getAPI(1);
    if(!a||!a.repositories||!a.repositories.length)return'—';
    return(a.repositories[0].state.workingTreeChanges||[]).length
  }catch(e){}return'—' }
  _ga() { try { const g=vscode.extensions.getExtension('vscode.git');
    if(!g||!g.isActive||!g.exports)return'—';const a=g.exports.getAPI(1);
    if(!a||!a.repositories||!a.repositories.length)return'—';const h=a.repositories[0].state.HEAD;
    if(!h||h.ahead===undefined)return'—';return h.ahead+'/'+h.behind
  }catch(e){}return'—' }
  _gr() { return (this.ctx.globalState.get('recentFiles',[])).slice(0,5) }
  _start() { this._tick(); this._pt=setInterval(()=>this._tick(),5000) }
  _stop() { if(this._pt){clearInterval(this._pt);this._pt=undefined} }
  _tick() {
    try {
      if(!isFeatureEnabled('commandCenter.enabled'))return;
      const e=vscode.window.activeTextEditor;
      if(e){const t=e.document.getText();
        this._tc=(t.match(/\/\/\s*TODO|#\s*TODO|<!--\s*TODO/g)||[]).length;
        this._fc=(t.match(/\/\/\s*FIXME|#\s*FIXME|<!--\s*FIXME/g)||[]).length;
        this._nc=(t.match(/\/\/\s*NOTE|#\s*NOTE|<!--\s*NOTE/g)||[]).length}
      if(this.view){this._render()}
    }catch(e){console.error('GE: tick error',e)}
  }
}

let focusTI = undefined, idleI = undefined;
let focusSB = undefined, savePSB = undefined, streakSB = undefined, hudSB = undefined;
let _sbSetup = false;

function setupSB(ctx) {
  if (!isFeatureEnabled('livingStatusBar.enabled')) return;
  if (_sbSetup) return;
  _sbSetup = true;

  focusSB = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 5);
  focusSB.text = '⏱ 0m'; focusSB.color = '#BFA53A'; focusSB.tooltip = 'Gold Elite — Focus timer'; focusSB.show();

  savePSB = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 4);
  savePSB.text = '○'; savePSB.color = '#1F8F6B'; savePSB.tooltip = 'Gold Elite — Save pulse'; savePSB.show();

  streakSB = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 3);
  streakSB.color = '#FFD700'; streakSB.show();

  hudSB = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 2);
  hudSB.color = '#FFD700'; hudSB.show();

  ctx.subscriptions.push(focusSB, savePSB, streakSB, hudSB);
  lastAct = Date.now();

  focusTI = setInterval(() => {
    if (!isFeatureEnabled('livingStatusBar.enabled')) return;
    if (Date.now() - lastAct > 120000) return;
    const s = ctx.workspaceState.get('focusTimer.seconds', 0);
    ctx.workspaceState.update('focusTimer.seconds', s + 30);
    focusSB.text = `⏱ ${Math.floor((s+30)/60)}m`;
  }, 30000);

  idleI = setInterval(() => {
    if (!isFeatureEnabled('livingStatusBar.enabled')) return;
    if (Date.now() - lastAct > 120000) streakSB.text = '⏸';
  }, 60000);

  ctx.subscriptions.push(
    vscode.window.onDidChangeWindowState(e => { lastAct = e.focused ? Date.now() : 0; }),
    vscode.workspace.onDidChangeTextDocument(() => { lastAct = Date.now(); })
  );
  const streak = ctx.globalState.get('streak.count', 0);
  streakSB.text = streak >= 2 ? `🔥 ${streak}d` : '';
  _updateHUD(ctx);
  ctx.subscriptions.push({ dispose: () => { if(focusTI){clearInterval(focusTI);focusTI=undefined} if(idleI){clearInterval(idleI);idleI=undefined} _sbSetup=false } });
}

let lastAct = 0;

function updateStreak(ctx) {
  if (!hudSB || !isFeatureEnabled('livingStatusBar.enabled')) return;
  const today = new Date().toDateString();
  const last = ctx.globalState.get('streak.lastDate', '');
  if (last === today) { _updateHUD(ctx); return; }
  let streak = ctx.globalState.get('streak.count', 0);
  const y = new Date(Date.now() - 86400000).toDateString();
  if (last === y || last === '') streak = last === '' ? 1 : streak + 1;
  else streak = 1;
  ctx.globalState.update('streak.lastDate', today);
  ctx.globalState.update('streak.count', streak);
  streakSB.text = streak >= 2 ? `🔥 ${streak}d` : '';
  _updateHUD(ctx);
  checkA(ctx, 'streakKeeper', () => streak >= 7);
}

function _updateHUD(ctx) {
  if (!hudSB) return;
  if (!isFeatureEnabled('achievements.enabled')) { hudSB.text=''; return; }
  const all = ['firstLight','momentum','nightOwl','streakKeeper','bracketMaster','debugger','cleanSweep','theElite'];
  const unlocked = all.filter(a => ctx.globalState.get(`achievement.${a}`, false)).length;
  const total = all.length;
  const filled = '▰'.repeat(unlocked);
  const empty = '▱'.repeat(total - unlocked);
  hudSB.text = `🏆 ${filled}${empty} ${unlocked}/${total}`;
}

function onSave(ctx) {
  trackRecent(ctx);
  ctx.globalState.update('totalSaves', (ctx.globalState.get('totalSaves', 0) + 1));
  if (isFeatureEnabled('livingStatusBar.enabled')) {
    if (savePSB) { savePSB.text = '●'; savePSB.color = '#FFD700';
      setTimeout(() => { if(savePSB){savePSB.text='○';savePSB.color='#1F8F6B'} }, 800); }
    updateStreak(ctx);
  }
  checkA(ctx, 'firstLight', () => ctx.globalState.get('totalSaves', 0) >= 1);
  checkA(ctx, 'momentum', () => ctx.globalState.get('totalSaves', 0) >= 100);
  if (isFeatureEnabled('achievements.enabled')) {
    nightOwl(ctx);
    cleanSweepC(ctx);
  }
}

function trackRecent(ctx) {
  const e = vscode.window.activeTextEditor; if(!e)return;
  const p = e.document.uri.fsPath;
  const n = (e.document.fileName.split('/').pop()||e.document.fileName.split('\\').pop());
  let r = ctx.globalState.get('recentFiles', []);
  r = r.filter(x => x.path !== p); r.unshift({name:n,path:p,time:Date.now()});
  if(r.length>20)r=r.slice(0,20);
  ctx.globalState.update('recentFiles', r);
}

function checkA(ctx, key, cond) {
  if(!isFeatureEnabled('achievements.enabled')||ctx.globalState.get(`achievement.${key}`,false))return;
  if(!cond())return;
  ctx.globalState.update(`achievement.${key}`,true);
  achToast(ctx, key); _updateHUD(ctx);
}

function nightOwl(ctx) {
  if(ctx.globalState.get('achievement.nightOwl',false))return;
  const h=new Date().getHours();
  if(h>=0&&h<4){ctx.globalState.update('achievement.nightOwl',true);achToast(ctx,'nightOwl');_updateHUD(ctx)}
}

function cleanSweepC(ctx) {
  if(ctx.globalState.get('achievement.cleanSweep',false))return;
  const e=vscode.window.activeTextEditor;if(!e)return;
  const has=/\/\/\s*TODO|#\s*TODO/.test(e.document.getText());
  const p=ctx.globalState.get('cleanSweep.prevHadTodo',false);
  if(p&&!has){ctx.globalState.update('achievement.cleanSweep',true);achToast(ctx,'cleanSweep');_updateHUD(ctx)}
  ctx.globalState.update('cleanSweep.prevHadTodo',has);
}

const ACH_NAMES = {firstLight:'First Light',momentum:'Momentum',nightOwl:'Night Owl',
  streakKeeper:'Streak Keeper',bracketMaster:'Bracket Master',debugger:'Debugger',
  cleanSweep:'Clean Sweep',theElite:'The Elite'};
const ACH_EMERALD = ['bracketMaster','debugger','cleanSweep'];

function achToast(ctx, key) {
  const rm = vscode.workspace.getConfiguration('workbench').get('reduceMotion', false);
  let badgeClass = 'ge-hex-badge--gold';
  if (ACH_EMERALD.includes(key)) badgeClass = 'ge-hex-badge--emerald';
  let badgeIcon = '';
  if (key === 'theElite') {
    badgeIcon = '🏅';
  } else {
    badgeIcon = '✨';
  }

  vscode.window.showInformationMessage(`🏆 ${ACH_NAMES[key]||key} unlocked!`, 'View Achievements').then(r => {
    if (r === 'View Achievements') {
      vscode.commands.executeCommand('workbench.view.extension.goldElite');
    }
  });

  setTimeout(() => {
    const all=['firstLight','momentum','nightOwl','streakKeeper','bracketMaster','debugger','cleanSweep','theElite'];
    const uc=all.filter(a=>ctx.globalState.get(`achievement.${a}`,false)).length;
    if(uc>=7)checkA(ctx,'theElite',()=>true);
  }, 500);
}

let flashDec = undefined, todoDec = undefined, fixmeDec = undefined, noteDec = undefined, scanTimer = undefined;
let _decSetup = false;

function setupDec(ctx) {
  if (!isFeatureEnabled('saveFlash.enabled')) return;
  if (_decSetup) return;
  _decSetup = true;

  flashDec = vscode.window.createTextEditorDecorationType({border:'2px solid #FFD700',borderWidth:'0 0 0 2px'});
  ctx.subscriptions.push(flashDec);
  todoDec = vscode.window.createTextEditorDecorationType({
    gutterIconPath:vscode.Uri.file(ctx.asAbsolutePath('assets/images/todo-marker.svg')),
    isWholeLine:true,backgroundColor:'#1A1A1A'});
  fixmeDec = vscode.window.createTextEditorDecorationType({
    gutterIconPath:vscode.Uri.file(ctx.asAbsolutePath('assets/images/fixme-marker.svg')),
    isWholeLine:true,backgroundColor:'#3A2A0E'});
  noteDec = vscode.window.createTextEditorDecorationType({
    gutterIconPath:vscode.Uri.file(ctx.asAbsolutePath('assets/images/note-marker.svg')),
    isWholeLine:true});
  ctx.subscriptions.push(todoDec,fixmeDec,noteDec);

  ctx.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc => {
    if (!isFeatureEnabled('saveFlash.enabled') || !flashDec) return;
    const ed = vscode.window.activeTextEditor;
    if (!ed || ed.document.uri.toString() !== doc.uri.toString()) return;
    const r = new vscode.Range(ed.document.lineAt(0).range.start, ed.document.lineAt(ed.document.lineCount-1).range.end);
    if (flashDec) flashDec.dispose();
    flashDec = vscode.window.createTextEditorDecorationType({border:'2px solid #FFD700', borderWidth:'0 0 0 2px'});
    ctx.subscriptions.push(flashDec);
    ed.setDecorations(flashDec, [{range: r}]);
    setTimeout(() => {
      if (flashDec) ed.setDecorations(flashDec, []);
    }, 400);
  }));

  ctx.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => scanA()),
    vscode.workspace.onDidChangeTextDocument(() => {
      if (scanTimer) clearTimeout(scanTimer);
      scanTimer = setTimeout(() => scanA(), 500);
    })
  );
  scanA();
}

function scanA() {
  if(!isFeatureEnabled('saveFlash.enabled'))return;
  const ed=vscode.window.activeTextEditor;if(!ed||!todoDec||!fixmeDec||!noteDec)return;
  const tr=[],fr=[],nr=[];
  for(let i=0;i<ed.document.lineCount;i++){const l=ed.document.lineAt(i);
    if(/\/\/\s*TODO|#\s*TODO/.test(l.text))tr.push(l.range);
    if(/\/\/\s*FIXME|#\s*FIXME/.test(l.text))fr.push(l.range);
    if(/\/\/\s*NOTE|#\s*NOTE/.test(l.text))nr.push(l.range)}
  ed.setDecorations(todoDec,tr);ed.setDecorations(fixmeDec,fr);ed.setDecorations(noteDec,nr);
}

function resetAllData(ctx) {
  const gKeys = ctx.globalState.keys();
  for (let i = 0; i < gKeys.length; i++) {
    const k = gKeys[i];
    if (k.startsWith('achievement.') || k.startsWith('streak.') || k === 'totalSaves' || k === 'recentFiles' || k === 'ecoPrompted' || k === 'cleanSweep.prevHadTodo')
      ctx.globalState.update(k, undefined);
  }
  const wKeys = ctx.workspaceState.keys();
  for (let i = 0; i < wKeys.length; i++) {
    const k = wKeys[i];
    if (k.startsWith('focusTimer') || k === 'bootSequence.hasShownThisSession')
      ctx.workspaceState.update(k, undefined);
  }
  vscode.window.showInformationMessage('Gold Elite: All local data has been reset.');
}

function setupEco(ctx) {
  if(!isFeatureEnabled('ecosystemTheming.enabled'))return;
  const prompted=ctx.globalState.get('ecoPrompted',[]);
  const chk=(id,name,extId,fn)=>{if(prompted.includes(id))return;const ex=vscode.extensions.getExtension(extId);if(!ex)return;
    vscode.window.showInformationMessage('Gold Elite: Align '+name+' colors?','Apply','Not now').then(r=>{
      if(r==='Apply'){fn();vscode.window.showInformationMessage('Gold Elite: '+name+' settings applied.')}
      const p=ctx.globalState.get('ecoPrompted',[]);p.push(id);ctx.globalState.update('ecoPrompted',p);})};
  chk('gitlens','GitLens','eamodio.gitlens',()=>{
    const c=vscode.workspace.getConfiguration(),t=vscode.ConfigurationTarget.Global;
    c.update('gitlens.currentLine.backgroundColor','#1A1A1280',t);
    c.update('gitlens.currentLineHover.backgroundColor','#1E1B0D',t);});
  chk('gitgraph','Git Graph','mhutchie.git-graph',()=>{
    vscode.workspace.getConfiguration().update('git-graph.graph.colors',['#FFD700','#2ECC9A','#BFA53A','#1F8F6B'],vscode.ConfigurationTarget.Global);});
  chk('errorlens','Error Lens','usernamehw.errorlens',()=>{
    const c=vscode.workspace.getConfiguration(),t=vscode.ConfigurationTarget.Global;
    c.update('errorLens.errorBackground','#4A2A1A',t);c.update('errorLens.warningBackground','#4A3A1A',t);
    c.update('errorLens.infoBackground','#0E3A2C',t);});
}

function teardown() {
  if(focusTI){clearInterval(focusTI);focusTI=undefined}
  if(idleI){clearInterval(idleI);idleI=undefined}
  if(focusSB){focusSB.dispose();focusSB=undefined}
  if(savePSB){savePSB.dispose();savePSB=undefined}
  if(streakSB){streakSB.dispose();streakSB=undefined}
  if(hudSB){hudSB.dispose();hudSB=undefined}
  if(flashDec){flashDec.dispose();flashDec=undefined}
  if(todoDec){todoDec.dispose();todoDec=undefined}
  if(fixmeDec){fixmeDec.dispose();fixmeDec=undefined}
  if(noteDec){noteDec.dispose();noteDec=undefined}
  if(scanTimer){clearTimeout(scanTimer);scanTimer=undefined}
  if(bootPanel){bootPanel.dispose();bootPanel=undefined}
  _sbSetup = false;
  _decSetup = false;
}

function activate(ctx) {
  try {
    ctx.subscriptions.push(
      vscode.commands.registerCommand('gold-elite-2-0.openFontPage',()=>vscode.env.openExternal(vscode.Uri.parse('https://github.com/microsoft/cascadia-code/releases'))),
      vscode.commands.registerCommand('gold-elite-2-0.replayBoot',()=>{ctx.workspaceState.update('bootSequence.hasShownThisSession',false);showBootV2(ctx);}),
      vscode.commands.registerCommand('gold-elite-2-0.resetAllData',()=>resetAllData(ctx)),
      vscode.commands.registerCommand('gold-elite-2-0.diagnose',()=>{
        const c=vscode.workspace.getConfiguration(CONFIG_NS);
        const items=[['Master switch',c.get('experience.enabled',true)],
          ['Boot sequence',c.get('bootSequence.enabled',true)],['Command Center',c.get('commandCenter.enabled',true)],
          ['Status bar',c.get('livingStatusBar.enabled',true)],['Save flash',c.get('saveFlash.enabled',true)],
          ['Achievements',c.get('achievements.enabled',true)],['Ecosystem theming',c.get('ecosystemTheming.enabled',true)],
          ['SB setup flag',_sbSetup],['Dec setup flag',_decSetup],
          ['hudSB exists',!!hudSB],['focusSB exists',!!focusSB],['savePSB exists',!!savePSB],
          ['flashDec exists',!!flashDec],['bootPanel exists',!!bootPanel],
          ['Boot shown this session',ctx.workspaceState.get('bootSequence.hasShownThisSession',false)],
          ['Is active',true]];
        vscode.window.showInformationMessage('Gold Elite diagnostics:\n'+items.map(([k,v])=>`  ${k}: ${v}`).join('\n'));
      }),
      vscode.window.registerWebviewViewProvider('goldElite.commandCenter',new CCProvider(ctx))
    );

    setTimeout(() => {
      try {
        const hb = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
        hb.text = '✦ GE'; hb.color = '#FFD700'; hb.tooltip = 'Gold Elite v2 — Active'; hb.show();
        ctx.subscriptions.push(hb);
      } catch(e) { console.error('GE: hb error',e); }
    }, 100);

    setTimeout(() => {
      try { showBootV2(ctx); } catch(e) { console.error('GE: boot error',e); }
      try { setupSB(ctx); } catch(e) { console.error('GE: SB error',e); }
      try { setupDec(ctx); } catch(e) { console.error('GE: dec error',e); }
      try { setupEco(ctx); } catch(e) { console.error('GE: eco error',e); }
      try {
        ctx.subscriptions.push(
          vscode.workspace.onDidSaveTextDocument(doc => { try { if (isFeatureEnabled('experience.enabled')) onSave(ctx); } catch(e) { console.error('GE: save error',e); } }),
          vscode.workspace.onDidChangeConfiguration(e => {
            try {
              if (!e.affectsConfiguration(CONFIG_NS)) return;
              const master = vscode.workspace.getConfiguration(CONFIG_NS).get('experience.enabled', true);
              if (!master) { teardown(); return; }
            } catch(e) { console.error('GE: config change error',e); }
          })
        );
      } catch(e) { console.error('GE: subscription error',e); }
    }, 500);
  } catch(e) { console.error('GE: activation error',e); }
}

function deactivate() {}

module.exports = { activate, deactivate };
