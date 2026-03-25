/**
 * LTC Wiki – 全站 AI 聊天浮窗（含長照專家角色系統 + Markdown 渲染）
 */
(function () {
  const WORKER_URL = "https://ltc-ai-proxy.peiyuzhuang.workers.dev";
  const WIKI_BASE = "https://peiyuzhuang315.github.io/LTC_Dietary_Wiki";

  // ── 長照專家角色 ──────────────────────────────────────────────
  const EXPERTS = [
    { emoji:"📋", color:"#1565c0", digitalTitle:"失能評估引擎", realRole:"照服專員",
      persona:"你以失能評估引擎（照服專員）身份回答，專長分析照護需求、判定失能等級與補助資格。",
      skills:["NLP 語意分析","CMS 評估演算法"],
      keywords:["失能","失能評估","CMS","照顧服務","照服員","申請居家","照服","長照","長期照護","老人照護","居家照護","安養","護理之家","機構照護","日照"] },
    { emoji:"🗂️", color:"#6a1b9a", digitalTitle:"照護方案架構師", realRole:"個管師",
      persona:"你以照護方案架構師（個管師）身份回答，專長生成個人化照護計畫與服務媒合。",
      skills:["排程優化","資源分配邏輯"],
      keywords:["照護計畫","個管","服務媒合","方案","排程","個案管理","照護團隊","多職種","整合照顧"] },
    { emoji:"🩺", color:"#c62828", digitalTitle:"臨床監測守護者", realRole:"居家護理師",
      persona:"你以臨床監測守護者（居家護理師）身份回答，專長監控生命徵象、傷口照護與慢性病管理。",
      skills:["生理數據分析","遠端傷口辨識"],
      keywords:["血壓","血糖","傷口","護理","生命徵象","體溫","心跳","居家護理","換藥","導尿","慢性病","高血壓","糖尿病","心臟病","腎臟病","感染","發燒","脫水","水腫"] },
    { emoji:"🏃", color:"#2e7d32", digitalTitle:"復能動態指導員", realRole:"物理/職能治療師",
      persona:"你以復能動態指導員（物理/職能治療師）身份回答，專長分析跌倒風險與指導復健動作。",
      skills:["電腦視覺","人體骨架偵測"],
      keywords:["跌倒","復健","走路","行走","平衡","關節","職能治療","物理治療","復能","肌力","ADL","中風","帕金森","步態","輪椅使用","站立","臥床復健","體能","運動"] },
    { emoji:"🥗", color:"#00897b", digitalTitle:"精準營養規劃師", realRole:"營養師",
      persona:"你以精準營養規劃師（營養師）身份回答，專長設計個人化膳食計畫、吞嚥質地調整與管灌配方。",
      skills:["膳食圖像辨識","營養成分資料庫"],
      keywords:["飲食","吞嚥","營養","食物","管灌","膳食","配方","熱量","蛋白質","吃","進食","不吃飯","限鉀","低鈉","老人","長者","老年","長輩","銀髮","補充品","保健食品","奶粉","保健","維他命","鈣","鐵","益生菌","腸道","骨質","肌少症","體重","食慾","口味","質地","IDDSI","增稠","糊狀","適合","產品"] },
    { emoji:"🙌", color:"#f57c00", digitalTitle:"虛擬日常助理", realRole:"照服員",
      persona:"你以虛擬日常助理（照顧服務員）身份回答，專長日常照護操作、翻身移位技巧。",
      skills:["IoT 裝置連動","SOP 指引系統"],
      keywords:["翻身","移位","餵藥","日常照顧","排泄","大便","排便","尿","洗澡","清潔","臥床","喂食","尿布","皮膚","壓瘡","照顧","看護","外傭","外籍看護","陪伴","生活協助"] },
    { emoji:"🏛️", color:"#0277bd", digitalTitle:"福利資源導航員", realRole:"社工",
      persona:"你以福利資源導航員（社工）身份回答，專長媒合政府補助資源與解讀長照政策。",
      skills:["政策大數據檢索","風險情緒偵測"],
      keywords:["補助","申請","政策","長照2.0","福利","補貼","社工","法規","1966","長照服務","補助資格","資源","救助","低收入","弱勢","喘息服務","社區資源","日照中心"] },
    { emoji:"💙", color:"#7b1fa2", digitalTitle:"情緒共感代理人", realRole:"心理師",
      persona:"你以情緒共感代理人（心理師）身份回答，專長傾聽照顧者壓力與提供情緒支持。",
      skills:["情感運算","CBT 對話引導"],
      keywords:["壓力","情緒","失眠","憂鬱","焦慮","心理","崩潰","辛苦","照顧壓力","心情","傷心","撐不住","喘息","失智症","認知","記憶","行為問題","遊走","拒食","暴躁"] },
    { emoji:"💊", color:"#d84315", digitalTitle:"智慧用藥安全員", realRole:"藥師",
      persona:"你以智慧用藥安全員（藥師）身份回答，專長偵測藥物交互作用與重複用藥風險。",
      skills:["藥物交互作用比對","雲端藥歷串接"],
      keywords:["藥物","用藥","藥","副作用","藥單","服藥","藥師","藥物交互","重複用藥","安眠藥","抗生素","保健品","補充劑","成分","效果","交互作用","禁忌","注意事項","飯前","飯後"] },
    { emoji:"🏠", color:"#558b2f", digitalTitle:"空間改造成型師", realRole:"輔具評估員",
      persona:"你以空間改造成型師（輔具評估員）身份回答，專長規劃居家無障礙環境與輔具選配。",
      skills:["AR 擴增實境","3D 建模分析"],
      keywords:["輔具","扶手","坡道","無障礙","居家改造","輪椅","助行器","浴室安全","防跌","住宅修繕","改建","安全","環境","家具","床","馬桶","淋浴"] }
  ];

  const LTC_GENERAL_KW = ["照護","長照","老人","長者","老年","長輩","銀髮","失智","安養","護理","老化"];

  function detectExperts(q) {
    const scores = {};
    EXPERTS.forEach((e, i) => {
      let s = 0;
      e.keywords.forEach(kw => { if (q.includes(kw)) s++; });
      if (s > 0) scores[i] = s;
    });
    const matched = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]).slice(0, 2)
      .map(([i]) => EXPERTS[+i]);
    if (matched.length === 0 && LTC_GENERAL_KW.some(kw => q.includes(kw))) {
      return [EXPERTS.find(e => e.digitalTitle === "精準營養規劃師")];
    }
    return matched;
  }


  function buildPrompt(experts) {
    if (!experts.length) return BASE_PROMPT;
    let p = BASE_PROMPT + `\n\n【本題啟動的專家角色】\n${experts[0].persona}\n核心技能：${experts[0].skills.join('、')}。`;
    if (experts[1]) p += `\n協作角色：${experts[1].digitalTitle}（${experts[1].realRole}），技能：${experts[1].skills.join('、')}。`;
    return p + `\n回答時展現該角色的專業深度。`;
  }

  // ── 輕量 Markdown 渲染 ─────────────────────────────────────────
  function renderMd(text) {
    const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const fmt = s => esc(s)
      .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
      .replace(/\*(.+?)\*/g,"<em>$1</em>")
      .replace(/`(.+?)`/g,"<code>$1</code>");

    const lines = text.split("\n");
    let html = "", inUl = false, inOl = false;
    for (const line of lines) {
      if (/^#{1,3}\s/.test(line)) {
        if (inUl) { html += "</ul>"; inUl=false; }
        if (inOl) { html += "</ol>"; inOl=false; }
        const tag = line.startsWith("# ") ? "h4" : "h5";
        html += `<${tag}>${fmt(line.replace(/^#+\s/,""))}</${tag}>`;
        continue;
      }
      const olM = line.match(/^\d+\.\s+(.*)/);
      if (olM) {
        if (inUl) { html += "</ul>"; inUl=false; }
        if (!inOl) { html += "<ol>"; inOl=true; }
        html += `<li>${fmt(olM[1])}</li>`; continue;
      }
      const ulM = line.match(/^[\*\-]\s+(.*)/);
      if (ulM) {
        if (inOl) { html += "</ol>"; inOl=false; }
        if (!inUl) { html += "<ul>"; inUl=true; }
        html += `<li>${fmt(ulM[1])}</li>`; continue;
      }
      if (inUl) { html += "</ul>"; inUl=false; }
      if (inOl) { html += "</ol>"; inOl=false; }
      html += line.trim() === "" ? "<br>" : `<p>${fmt(line)}</p>`;
    }
    if (inUl) html += "</ul>";
    if (inOl) html += "</ol>";
    return html;
  }

  function extractTerms(text) {
    const re = /📖\s*關聯詞條[：:]\s*([^\n]+)/;
    const m = text.match(re);
    return (m && m[1]) ? m[1].split(/[、,，]/).map(t => t.replace(/[\*🔗📖📝]+/g,"").trim()).filter(Boolean) : [];
  }

  // ── CSS ─────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #ltc-fab { position:fixed; bottom:24px; right:24px; z-index:9998;
      width:56px; height:56px; border-radius:50%; background:#00897b;
      box-shadow:0 4px 16px rgba(0,0,0,.25); border:none; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:transform .2s, box-shadow .2s; }
    #ltc-fab:hover { transform:scale(1.08); box-shadow:0 6px 20px rgba(0,0,0,.3); }
    #ltc-fab svg { fill:white; width:26px; height:26px; }
    #ltc-fab .ltc-close-icon { display:none; }
    #ltc-fab.open .ltc-chat-icon { display:none; }
    #ltc-fab.open .ltc-close-icon { display:block; }
    #ltc-widget { position:fixed; bottom:90px; right:24px; z-index:9997;
      width:360px; max-width:calc(100vw - 32px);
      height:540px; max-height:calc(100vh - 110px);
      background:var(--md-default-bg-color, #fff);
      border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,.18);
      display:flex; flex-direction:column; overflow:hidden;
      transform:scale(.85) translateY(20px); opacity:0;
      transition:transform .2s, opacity .2s; pointer-events:none; }
    #ltc-widget.visible { transform:scale(1) translateY(0); opacity:1; pointer-events:auto; }
    #ltc-widget-header { background:#00897b; color:white; padding:12px 16px;
      font-weight:700; font-size:.95rem; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; }
    #ltc-widget-header span { font-size:.8rem; opacity:.85; }
    #ltc-messages { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px; }
    .ltc-msg-user { align-self:flex-end; background:#00897b; color:white;
      padding:8px 12px; border-radius:14px 14px 2px 14px; font-size:.88rem;
      max-width:85%; word-break:break-word; }
    .ltc-msg-ai { align-self:flex-start; background:var(--md-code-bg-color, #f5f5f5);
      padding:10px 12px; border-radius:14px 14px 14px 2px; font-size:.85rem;
      max-width:95%; line-height:1.65; word-break:break-word; }
    .ltc-msg-ai p { margin: 0 0 .4em; }
    .ltc-msg-ai ul, .ltc-msg-ai ol { margin:.3em 0 .3em 1.2em; padding:0; }
    .ltc-msg-ai li { margin:.15em 0; }
    .ltc-msg-ai h4 { margin:.5em 0 .2em; font-size:.9rem; }
    .ltc-msg-ai h5 { margin:.4em 0 .15em; font-size:.85rem; }
    .ltc-msg-ai strong { font-weight:600; }
    .ltc-msg-ai code { background:rgba(0,0,0,.07); padding:1px 4px; border-radius:3px; font-size:.82rem; }
    .ltc-msg-loading { align-self:flex-start; color:#888; font-size:.85rem; padding:4px 0; }
    .ltc-expert-badge { align-self:flex-start; display:flex; align-items:center; gap:8px;
      padding:6px 10px; border-radius:8px; border-left:3px solid;
      background:var(--md-code-bg-color, #f5f5f5); font-size:.8rem; max-width:95%; }
    .ltc-expert-badge-title { font-weight:700; }
    .ltc-expert-badge-role { opacity:.7; font-size:.73rem; }
    .ltc-chips { display:flex; flex-wrap:wrap; gap:5px; margin-top:2px; }
    .ltc-term-chip { color:white !important; padding:2px 8px;
      border-radius:12px; font-size:.75rem; text-decoration:none !important; }
    .ltc-google-chip { background:#f1f3f4; color:#1a73e8 !important; padding:2px 8px;
      border-radius:12px; font-size:.75rem; text-decoration:none !important; border:1px solid #dadce0; }
    .ltc-viewfull { font-size:.75rem; color:#00897b !important; text-decoration:underline !important; }
    #ltc-input-row { display:flex; padding:10px 12px; gap:8px;
      border-top:1px solid var(--md-default-fg-color--lightest, #eee); flex-shrink:0; }
    #ltc-input { flex:1; padding:8px 10px; border-radius:8px; border:1.5px solid #ccc;
      font-size:.88rem; outline:none; font-family:inherit;
      background:var(--md-default-bg-color, #fff); color:var(--md-typeset-color, #222);
      resize:none; height:38px; line-height:1.4; }
    #ltc-input:focus { border-color:#00897b; }
    #ltc-send { background:#00897b; color:white; border:none; border-radius:8px;
      padding:0 14px; cursor:pointer; font-size:1.2rem; flex-shrink:0; transition:opacity .15s; }
    #ltc-send:hover { opacity:.85; }
    #ltc-send:disabled { opacity:.5; cursor:not-allowed; }
    @media (max-width:480px) {
      #ltc-widget { right:12px; bottom:76px; width:calc(100vw - 24px); }
      #ltc-fab { bottom:16px; right:16px; width:50px; height:50px; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────
  const fab = document.createElement("button");
  fab.id = "ltc-fab";
  fab.setAttribute("aria-label", "開啟 AI 問答");
  fab.innerHTML = `
    <svg class="ltc-chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    <svg class="ltc-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
  `;

  const widget = document.createElement("div");
  widget.id = "ltc-widget";
  widget.innerHTML = `
    <div id="ltc-widget-header">
      <div>🤖 長照膳食 AI 助理</div>
      <span>基於 130+ 詞條知識庫</span>
    </div>
    <div id="ltc-messages">
      <div class="ltc-msg-ai">請問有什麼長照膳食問題需要協助？</div>
    </div>
    <div id="ltc-input-row">
      <textarea id="ltc-input" placeholder="輸入問題…（Enter 送出）" rows="1"></textarea>
      <button id="ltc-send">➤</button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(widget);

  fab.addEventListener("click", () => {
    const isOpen = widget.classList.contains("visible");
    widget.classList.toggle("visible", !isOpen);
    fab.classList.toggle("open", !isOpen);
    if (!isOpen) document.getElementById("ltc-input").focus();
  });

  document.getElementById("ltc-input").addEventListener("keydown", e => {
    // isComposing = true 代表 IME 選字中（注音/倉頡/拼音），Enter 不送出
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault(); sendMessage();
    }
  });
  document.getElementById("ltc-send").addEventListener("click", sendMessage);

  // ── 發送訊息 ───────────────────────────────────────────────────
  async function sendMessage() {
    const input = document.getElementById("ltc-input");
    const q = input.value.trim();
    if (!q) return;

    const experts = detectExperts(q);
    const msgBox = document.getElementById("ltc-messages");
    input.value = "";
    document.getElementById("ltc-send").disabled = true;

    const userBubble = document.createElement("div");
    userBubble.className = "ltc-msg-user";
    userBubble.textContent = q;
    msgBox.appendChild(userBubble);

    const loading = document.createElement("div");
    loading.className = "ltc-msg-loading";
    loading.textContent = "⏳ AI 思考中…";
    msgBox.appendChild(loading);
    msgBox.scrollTop = msgBox.scrollHeight;

    try {
      const res = await fetch(
        `${WORKER_URL}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: buildPrompt(experts) }] },
            contents: [{ role: "user", parts: [{ text: q }] }],
            generationConfig: { temperature: 0.5, thinkingConfig: { thinkingBudget: 0 } }
          })
        }
      );
      loading.remove();

      if (!res.ok) throw new Error(`API 錯誤 ${res.status}`);
      const data = await res.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!answer) throw new Error("AI 未回傳內容");

      const cleanAnswer = answer.replace(/📖\s*關聯詞條[：:][^\n]+/g,"").trim();

      // 專家名片
      if (experts.length > 0) {
        const badge = document.createElement("div");
        badge.className = "ltc-expert-badge";
        badge.style.borderColor = experts[0].color;
        badge.innerHTML = `<span style="font-size:1.2rem">${experts[0].emoji}</span>
          <div>
            <div class="ltc-expert-badge-title" style="color:${experts[0].color}">${experts[0].digitalTitle}</div>
            <div class="ltc-expert-badge-role">${experts[0].realRole}${experts[1] ? ` × ${experts[1].realRole}` : ""}</div>
            <div class="ltc-chips">${experts[0].skills.map(s=>`<span class="ltc-term-chip" style="background:${experts[0].color}">${s}</span>`).join("")}</div>
          </div>`;
        msgBox.appendChild(badge);
      }

      // AI 回答（Markdown 渲染）
      const aiBubble = document.createElement("div");
      aiBubble.className = "ltc-msg-ai";
      aiBubble.innerHTML = renderMd(cleanAnswer);
      msgBox.appendChild(aiBubble);

      // 詞條 chips
      const termNames = extractTerms(answer);
      if (termNames.length > 0) {
        const chips = document.createElement("div");
        chips.className = "ltc-chips";
        termNames.forEach(t => {
          const a = document.createElement("a");
          a.className = "ltc-term-chip";
          a.style.background = "#00897b";
          a.href = `${WIKI_BASE}/${encodeURIComponent(t)}/`;
          a.target = "_blank";
          a.textContent = t;
          chips.appendChild(a);
        });
        msgBox.appendChild(chips);
      }

      // Google 搜尋 chips
      const googleChips = document.createElement("div");
      googleChips.className = "ltc-chips";
      const searchKws = termNames.slice(0,2).concat([q.slice(0,15)]).filter(Boolean);
      searchKws.forEach(kw => {
        const a = document.createElement("a");
        a.className = "ltc-google-chip";
        a.href = `https://www.google.com/search?q=${encodeURIComponent("長照膳食 " + kw)}`;
        a.target = "_blank"; a.rel = "noopener";
        a.textContent = "🔍 " + kw;
        googleChips.appendChild(a);
      });
      const fullLink = document.createElement("a");
      fullLink.className = "ltc-viewfull";
      fullLink.href = `${WIKI_BASE}/chat/`;
      fullLink.target = "_blank";
      fullLink.textContent = "→ 完整問答頁";
      googleChips.appendChild(fullLink);
      msgBox.appendChild(googleChips);

    } catch (err) {
      loading.remove();
      const errBubble = document.createElement("div");
      errBubble.className = "ltc-msg-ai";
      errBubble.style.color = "#c62828";
      errBubble.textContent = "⚠️ " + err.message;
      msgBox.appendChild(errBubble);
    } finally {
      document.getElementById("ltc-send").disabled = false;
      msgBox.scrollTop = msgBox.scrollHeight;
    }
  }
})();
