---
hide:
  - navigation
  - toc
---

<style>
:root { --accent: #00897b; --bg: #0f172a; --card: #1e293b; --border: #334155; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body, .md-content { background: var(--bg) !important; color: #e2e8f0 !important; }
.md-header, .md-footer, .md-sidebar { display: none !important; }
.md-main__inner { margin: 0 !important; max-width: 100% !important; }
.md-content__inner { padding: 0 !important; margin: 0 !important; }

#admin-app { font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; padding: 0; }

/* Top Bar */
.admin-topbar {
  background: linear-gradient(135deg, #00897b, #0097a7);
  padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem;
  box-shadow: 0 2px 20px rgba(0,0,0,.3);
}
.admin-topbar h1 { font-size: 1.2rem; font-weight: 700; color: #fff; }
.admin-topbar small { opacity: .7; font-size: .8rem; color: #fff; }
.tab-bar { display: flex; gap: .5rem; margin-left: auto; }
.tab-btn {
  padding: .5rem 1.2rem; border-radius: 8px; border: none; cursor: pointer;
  font-size: .85rem; font-weight: 600; transition: all .2s;
  background: rgba(255,255,255,.15); color: #fff;
}
.tab-btn.active { background: #fff; color: #00897b; }
.tab-btn:hover:not(.active) { background: rgba(255,255,255,.25); }

/* Layout */
.admin-body { padding: 1.5rem 2rem; }

/* Cards */
.card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.2rem 1.5rem; margin-bottom: 1rem;
  transition: box-shadow .2s;
}
.card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.3); }
.card-title { font-weight: 700; font-size: 1rem; margin-bottom: .4rem; }
.card-meta { font-size: .78rem; opacity: .6; display: flex; gap: 1rem; flex-wrap: wrap; }
.badge {
  display: inline-block; padding: .15rem .6rem; border-radius: 20px;
  font-size: .72rem; font-weight: 700;
}
.badge-blue { background: #1e3a5f; color: #60a5fa; }
.badge-green { background: #14532d; color: #4ade80; }
.badge-yellow { background: #422006; color: #fbbf24; }

/* Buttons */
.btn {
  padding: .45rem 1rem; border-radius: 8px; border: none; cursor: pointer;
  font-size: .82rem; font-weight: 600; transition: all .2s;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #00796b; }
.btn-danger { background: #7f1d1d; color: #fca5a5; }
.btn-outline { background: transparent; border: 1px solid var(--border); color: #94a3b8; }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn-sm { padding: .3rem .7rem; font-size: .78rem; }

/* Gap list */
.gap-row {
  display: flex; align-items: center; gap: 1rem;
  padding: .9rem 1.2rem; background: var(--card);
  border: 1px solid var(--border); border-radius: 10px; margin-bottom: .6rem;
}
.gap-count {
  min-width: 2.5rem; height: 2.5rem; border-radius: 50%;
  background: var(--accent); color: #fff; display: flex;
  align-items: center; justify-content: center; font-weight: 800; font-size: .9rem;
}
.gap-term { font-weight: 700; flex: 1; }
.gap-q { font-size: .78rem; opacity: .6; flex: 2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gap-actions { display: flex; gap: .5rem; }

/* Draft viewer */
.draft-content-box {
  background: #0f172a; border: 1px solid var(--border); border-radius: 8px;
  padding: 1rem; font-size: .82rem; line-height: 1.8; white-space: pre-wrap;
  max-height: 300px; overflow-y: auto; margin-top: .8rem; color: #94a3b8;
  display: none;
}

/* Status bar */
#status-bar {
  position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
  background: #1e293b; border: 1px solid var(--border); border-radius: 50px;
  padding: .7rem 1.5rem; font-size: .85rem; display: none;
  box-shadow: 0 8px 30px rgba(0,0,0,.4); z-index: 9999; color: #e2e8f0;
}

/* Loading spinner */
.spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; margin-right: .4rem; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Tabs */
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* section header */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.section-header h2 { font-size: 1rem; font-weight: 700; }

/* Empty state */
.empty-state { text-align: center; padding: 3rem; opacity: .4; font-size: .9rem; }
</style>

<div id="admin-app">
  <div class="admin-topbar">
    <div>
      <h1>🌱 知識飛輪管理後台</h1>
      <small>長照膳食實戰百科 · 全自動內容成長系統</small>
    </div>
    <div class="tab-bar">
      <button class="tab-btn active" onclick="switchTab('gaps')">📡 知識缺口</button>
      <button class="tab-btn" onclick="switchTab('drafts')">✍️ 草稿審核</button>
    </div>
  </div>

  <div class="admin-body">

    <!-- Tab 1: 知識缺口 -->
    <div id="tab-gaps" class="tab-panel active">
      <div class="section-header">
        <h2>📡 知識缺口排行榜</h2>
        <button class="btn btn-primary btn-sm" onclick="loadGaps()">🔄 重新整理</button>
      </div>
      <div id="gaps-list"><div class="empty-state">載入中...</div></div>
    </div>

    <!-- Tab 2: 草稿審核 -->
    <div id="tab-drafts" class="tab-panel">
      <div class="section-header">
        <h2>✍️ 草稿審核區</h2>
        <div style="display:flex;gap:.5rem;">
          <select id="draft-filter" onchange="loadDrafts()" style="background:var(--card);border:1px solid var(--border);color:#e2e8f0;padding:.4rem .8rem;border-radius:8px;font-size:.82rem;">
            <option value="🤖 AI草稿">🤖 AI草稿</option>
            <option value="🔍 審核中">🔍 審核中</option>
            <option value="✅ 核准發布">✅ 核准發布</option>
            <option value="📦 已發布">📦 已發布</option>
            <option value="all">全部</option>
          </select>
          <button class="btn btn-outline btn-sm" onclick="loadDrafts()">🔄 重新整理</button>
        </div>
      </div>
      <div id="drafts-list"><div class="empty-state">載入中...</div></div>
    </div>

  </div>
</div>

<div id="status-bar"></div>

<script>
const WORKER = "https://ltc-wiki-worker.peiyuzhuang.workers.dev";

// ── 切換 Tab ────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', ['gaps','drafts'][i] === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (tab === 'gaps') loadGaps();
  if (tab === 'drafts') loadDrafts();
}

// ── 狀態提示 ────────────────────────────────────────────────
function showStatus(msg, duration = 3000) {
  const bar = document.getElementById('status-bar');
  bar.innerHTML = msg; bar.style.display = 'block';
  clearTimeout(bar._t);
  if (duration > 0) bar._t = setTimeout(() => bar.style.display = 'none', duration);
}

// ── 載入知識缺口 ─────────────────────────────────────────────
async function loadGaps() {
  const container = document.getElementById('gaps-list');
  container.innerHTML = '<div class="empty-state">⏳ 載入中...</div>';
  try {
    const res = await fetch(`${WORKER}/admin/gaps`);
    const { gaps } = await res.json();
    if (!gaps || gaps.length === 0) {
      container.innerHTML = '<div class="empty-state">目前尚無知識缺口記錄 🎉</div>';
      return;
    }
    container.innerHTML = gaps.map(g => `
      <div class="gap-row" id="gap-${encodeURIComponent(g.term)}">
        <div class="gap-count">${g.count}</div>
        <div class="gap-term">${g.term}</div>
        <div class="gap-q">${g.question || '—'}</div>
        <div class="gap-actions">
          <button class="btn btn-primary btn-sm" onclick="generateDraft('${escHtml(g.term)}','${escHtml(g.question)}',this)">
            🤖 生成草稿
          </button>
        </div>
      </div>`).join('');
  } catch (e) {
    container.innerHTML = `<div class="empty-state">❌ 載入失敗：${e.message}</div>`;
  }
}

// ── 生成草稿 ─────────────────────────────────────────────────
async function generateDraft(term, question, btn) {
  if (!confirm(`確定要為「${term}」生成 AI 草稿嗎？（約需 20-30 秒）`)) return;
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>AI 撰寫中...';
  showStatus('⏳ AI 正在撰寫草稿，請稍候...', 0);
  try {
    const res = await fetch(`${WORKER}/admin/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term, question })
    });
    const data = await res.json();
    if (data.success) {
      showStatus(`✅ 草稿完成！共 ${data.chars} 字，已存入 Notion 審核區。`, 5000);
      btn.innerHTML = '✅ 已生成';
      btn.style.background = '#14532d';
    } else {
      throw new Error(data.error || '未知錯誤');
    }
  } catch (e) {
    showStatus(`❌ 生成失敗：${e.message}`, 5000);
    btn.innerHTML = orig;
    btn.disabled = false;
  }
}

// ── 載入草稿 ─────────────────────────────────────────────────
async function loadDrafts() {
  const container = document.getElementById('drafts-list');
  const status = document.getElementById('draft-filter').value;
  container.innerHTML = '<div class="empty-state">⏳ 載入中...</div>';
  try {
    const res = await fetch(`${WORKER}/admin/drafts?status=${encodeURIComponent(status)}`);
    const { drafts } = await res.json();
    if (!drafts || drafts.length === 0) {
      container.innerHTML = '<div class="empty-state">目前此狀態沒有草稿</div>';
      return;
    }
    container.innerHTML = drafts.map(d => `
      <div class="card" id="draft-${d.id}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
          <div>
            <div class="card-title">📄 ${d.term}</div>
            <div class="card-meta">
              <span>${new Date(d.createdTime).toLocaleString('zh-TW')}</span>
              <span>${d.content.length} 字</span>
              <span class="badge ${statusBadge(d.status)}">${d.status}</span>
            </div>
          </div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" onclick="toggleContent('${d.id}')">👁 展開</button>
            ${d.status !== '📦 已發布'
              ? `<button class="btn btn-primary btn-sm" onclick="publishDraft('${d.id}','${escHtml(d.term)}','${escHtml(d.content.replace(/'/g,"&#39;"))}',this)">🚀 核准並發布</button>`
              : '<span class="badge badge-green">已上線</span>'}
          </div>
        </div>
        <div class="draft-content-box" id="content-${d.id}">${escHtml(d.content)}</div>
      </div>`).join('');
  } catch (e) {
    container.innerHTML = `<div class="empty-state">❌ 載入失敗：${e.message}</div>`;
  }
}

function toggleContent(id) {
  const box = document.getElementById('content-' + id);
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
}

function statusBadge(s) {
  if (s.includes('草稿')) return 'badge-blue';
  if (s.includes('已發布')) return 'badge-green';
  return 'badge-yellow';
}

// ── 核准並發布 ───────────────────────────────────────────────
async function publishDraft(pageId, term, content, btn) {
  if (!confirm(`確定要發布「${term}」嗎？\n文章將直接推送至 GitHub Pages，約 1-2 分鐘後上線。`)) return;
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>發布中...';
  showStatus('🚀 正在透過 GitHub API 發布文章...', 0);
  try {
    const res = await fetch(`${WORKER}/admin/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, term, content })
    });
    const data = await res.json();
    if (data.success) {
      showStatus(`✅ 發布成功！約 1-2 分鐘後可至 <a href="${data.url}" target="_blank" style="color:#4ade80">這裡</a> 查看`, 8000);
      btn.closest('.card').querySelector('.badge') && (btn.closest('.card').querySelector('.badge').textContent = '📦 已發布');
      btn.innerHTML = '✅ 已發布';
      btn.style.background = '#14532d';
    } else {
      throw new Error(data.error || '未知錯誤');
    }
  } catch(e) {
    showStatus(`❌ 發布失敗：${e.message}`, 5000);
    btn.innerHTML = orig;
    btn.disabled = false;
  }
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// 初始化
loadGaps();
</script>
