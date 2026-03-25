/**
 * LTC Wiki – 全站 AI 聊天浮窗（含長照專家角色系統 + Markdown 渲染）
 */
(function () {
  const WORKER_URL = "https://ltc-wiki-worker.peiyuzhuang.workers.dev";
  const WIKI_BASE = "https://peiyuzhuang315.github.io/LTC_Dietary_Wiki";

  // ── 長照專家角色 ──────────────────────────────────────────────
  const EXPERTS = [
    { id:"care_assessor", emoji:"📋", color:"#1565c0", realRole:"照服專員", digitalTitle:"長照需求評估師",
      skills:["NLP 語意分析","CMS 評估演算法"],
      persona:"你以失能評估引擎（照服專員）身份回答，專長分析照護需求、判定失能等級與補助資格。",
      keywords:["失能","失能評估","CMS","照顧服務","照服員","申請居家","照服","長照","長期照護","老人照護","居家照護","安養","護理之家","機構照護","日照"] },
    { id:"case_manager", emoji:"🗂️", color:"#6a1b9a", realRole:"個管師", digitalTitle:"照護計畫規劃師",
      skills:["排程優化","資源分配邏輯"],
      persona:"你以照護方案架構師（個管師）身份回答，專長生成個人化照護計畫與服務媒合。",
      keywords:["照護計畫","個管","服務媒合","方案","排程","個案管理","照護團隊","多職種","整合照顧"] },
    { id:"home_nurse", emoji:"🩺", color:"#c62828", realRole:"居家護理師", digitalTitle:"居家護理照護師",
      skills:["生理數據分析","遠端傷口辨識"],
      persona:"你以臨床監測守護者（居家護理師）身份回答，專長監控生命徵象、傷口照護與慢性病管理。",
      keywords:["血壓","血糖","傷口","護理","生命徵象","體溫","心跳","居家護理","換藥","導尿","慢性病","高血壓","糖尿病","心臟病","腎臟病","感染","發燒","脫水","水腫"] },
    { id:"therapist", emoji:"🏃", color:"#2e7d32", realRole:"物理/職能治療師", digitalTitle:"復能復健指導師",
      skills:["電腦視覺","人體骨架偵測"],
      persona:"你以復能動態指導員（物理/職能治療師）身份回答，專長分析跌倒風險與指導復健動作。",
      keywords:["跌倒","復健","走路","行走","平衡","關節","職能治療","物理治療","復能","肌力","ADL","中風","帕金森","步態","輪椅使用","站立","臥床復健","體能","運動"] },
    { id:"nutritionist", emoji:"🥗", color:"#00897b", realRole:"營養師", digitalTitle:"精準營養規劃師",
      skills:["膳食圖像辨識","營養成分資料庫"],
      persona:"你以精準營養規劃師（營養師）身份回答，專長設計個人化膳食計畫與質地調整。",
      keywords:["飲食","吞嚥","營養","食物","管灌","膳食","配方","熱量","蛋白質","吃","進食","不吃飯","限鉀","低鈉","老人","長者","銀髮","補充品","保健食品","IDDSI","增稠"] },
    { id:"care_worker", emoji:"🙌", color:"#f57c00", realRole:"照服員", digitalTitle:"日常生活照顧師",
      skills:["IoT 裝置連動","SOP 指引系統"],
      persona:"你以虛擬日常助理（照顧服務員）身份回答，專長日常照護操作、翻身移位技巧。",
      keywords:["翻身","移位","餵藥","日常照顧","排泄","大便","尿","洗澡","清潔","臥床","尿布","壓瘡","看護","陪同"] },
    { id:"social_worker", emoji:"🏛️", color:"#0277bd", realRole:"社工", digitalTitle:"社會福利諮詢師",
      skills:["政策大數據檢索","風險情緒偵測"],
      persona:"你以福利資源導航員（社工）身份回答，專長媒合政府補助資源與解讀政策。",
      keywords:["補助","申請","政策","長照2.0","福利","補貼","社工","法規","1966","長照服務","資源"] },
    { id:"psychologist", emoji:"💙", color:"#7b1fa2", realRole:"心理師", digitalTitle:"心理健康諮詢師",
      skills:["情感運算","CBT 對話引導"],
      persona:"你以情緒共感代理人（心理師）身份回答，專長傾聽照顧者壓力與情緒支持。",
      keywords:["壓力","情緒","失眠","憂鬱","焦慮","心理","崩潰","辛苦","照顧壓力","心情","撐不住","喘息"] },
    { id:"pharmacist", emoji:"💊", color:"#d84315", realRole:"藥師", digitalTitle:"藥物安全諮詢師",
      skills:["藥物交互作用比對","串接雲端藥歷"],
      persona:"你以智慧用藥安全員（藥師）身份回答，專長偵測藥物交互作用與重複用藥風險。",
      keywords:["藥物","用藥","藥","副作用","藥單","服藥","藥師","藥物交互","重複用藥","安眠藥","抗生素"] },
    { id:"assistive_tech", emoji:"🏠", color:"#558b2f", realRole:"輔具評估員", digitalTitle:"居家環境改善師",
      skills:["AR 擴增實境","3D 建模分析"],
      persona:"你以空間改造成型師（輔具評估員）身份回答，專長規劃居家無障礙環境與輔具選配。",
      keywords:["輔具","扶手","坡道","無障礙","居家改造","輪椅","助行器","浴室安全","防跌","住宅修繕"] }
  ];

  // Widget 內層維護的詞條庫 (用於比對缺失詞條)
  const WIKI_TERMS = [
    "吞嚥障礙","IDDSI","肌少症","吸入性肺炎","口腔衰弱","增稠劑","糊狀餐","質地調整飲食",
    "失智症飲食","失智預防飲食","帕金森氏症飲食","中風後飲食","管灌飲食","糖尿病飲食",
    "腎臟病飲食","心臟病飲食","癌症飲食","安寧照護和飲食","衰弱階段","尊嚴進食","進食安全",
    "蛋白質補充","精準營養","骨骼保健","腸道調理","運動介入","口腔健康","共餐","送餐",
    "口感及味道","水分管理","體重管理","老年厭食症","老年跌倒預防","壓瘡預防和飲食",
    "睡眠與飲食","藥物與飲食交互作用","節慶飲食","素食長照","台灣原住民飲食文化",
    "長照2.0","居家補助申請","低收入戶補助","膳費補助","長照聯盟",
    "GHP食品良好衛生規範","HACCP認證","ISO22000認證","TQF","CAS標章","Eatender銀髮友善食品標章",
    "留存檢體","食品安全衛生管理法","食品添加劑",
    "B2B團膳市場","中央廚房","成本控制","供應鏈管理","機構KPI","ROI分析","出口策略",
    "冷鏈技術","數位通路App訂餐","AI智慧營養管理","3D列印食物","MNA篩檢工具",
    "營養師","言語治療師","職能治療師","多職種協力","照護人員訓練",
    "超高齡社會","銀髮經濟","全球發展現況","社區整合照顧","機構選擇指南",
    "漢典食品","護力養Basicare","銀色大門","格林全食物","聯夏食品","奇美食品","佳樂美",
    "IDDSI測試方法","質地分級","口腔衰弱評估","口腔癌術後飲食","老年憂鬱症與進食",
    "熱量補充","個人化客製","永續包裝","標籤規範","ESG永續策略"
  ];

  const BASE_PROMPT = `你是「長照膳食百科 AI」，專屬於「長照膳食實戰百科」網站的智能助理。
知識庫含 130+ 個詞條和 10 篇深度文章。
【陪伴與護照建立原則】
1. 建立個案人物誌 (Care Profile)：請從對話歷史判斷被照顧者（個案）的背景樣貌。
   - 若缺乏關鍵資訊（如年齡、性別、疾病狀況），請在解答後，自然地拋出「1 個」好回答的小問題。
   - 範例：「不知道爺爺今年幾歲了呢？假牙還戴得住嗎？」
   - 絕對禁止連環逼問。每次只需輕柔問 1 個細節，讓家屬覺得被接住。
2. 同理心優先：若含情緒訊號（如「怎麼辦」「累」「撐不住」），用 1-2 句話真誠同理辛苦，再切入專業建議。禁止空洞開場（「問得好」）。
3. 語氣專業直接、條列清晰。分段雙換行以利對話氣泡渲染。`;

  const LTC_GENERAL_KW = ["照護","長照","老人","長者","老年","長輩","銀髮","失智","安養","護理","老化"];

  function detectExperts(q) {
    const scores = {};
    EXPERTS.forEach(e => {
      let s = 0;
      e.keywords.forEach(kw => { if (q.includes(kw)) s++; });
      if (s > 0) scores[e.id] = s;
    });
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1]).slice(0, 5) // 同步 5 位上限
      .map(([id]) => EXPERTS.find(e => e.id === id));
  }

  function buildPrompt(experts) {
    const deanInstruction = `\n\n【長照督導院長】
【寫作要求】：你是一位充滿智慧與溫度的機構負責人。請實現以下四件事（缺一不可）：
① **誠摯同理**：1-2 句話深刻感謝家屬堅持。讓對方感到被看見、被理解。
② **精闢總結**：整合專家建議，點出一個「現在馬上就能做的」具體行動。
③ **專業導讀**：明確說出：「為了讓您更安心，我們已在下方整理了與本題相關的**專業詞條與深度文章**，強烈建議您點閱深入了解。照顧路上，正確的知識是您最強大的後盾。」
④ **建立信賴**：結語語氣要穩定、溫暖。不僵化套版。`;
    
    // 若無專家，直接以院長身份回應
    if (!experts.length) {
      return BASE_PROMPT + `\n\n【本題啟動代表：長照督導院長】
你是院長，負責接待與引導。請以溫暖、穩重的口吻回話：
① 介紹自己是院長。
② 鼓勵使用者詢問具體的照顧或營養問題。
③ 強調點閱下方「專業詞條與文章」的重要性。` + deanInstruction;
    }
    
    return BASE_PROMPT + `\n\n【本題啟動的專家角色】\n` +
      experts.map(e => `・${e.digitalTitle}：${e.persona}`).join('\n') +
      `\n\n請以各專家觀點分別回答，最後必須加上【長照督導院長】段落。` +
      deanInstruction;
  }

  function parseSections(answer, experts) {
    const DEAN_KEY = "長照督導院長";
    const clean = t => t.replace(/📖\s*關聯詞條[：:][^\n]+/g,'').replace(/📝\s*推薦文章[：:][^\n]+/g,'').trim();

    // 若無特定專家（一般性問題），全數交由院長渲染
    if (experts.length === 0) {
      let deanText = answer;
      const dIdx = answer.indexOf(`【${DEAN_KEY}】`);
      if (dIdx !== -1) deanText = answer.slice(dIdx + `【${DEAN_KEY}】`.length);
      else if (answer.includes(`【本題啟動代表：長照督導院長】`)) deanText = answer.replace(`【本題啟動代表：長照督導院長】`, '');
      return { sections: [], dean: clean(deanText) };
    }

    let main = answer, dean = null;
    const dIdx = answer.indexOf(`【${DEAN_KEY}】`);
    if (dIdx !== -1) { dean = clean(answer.slice(dIdx + `【${DEAN_KEY}】`.length)); main = answer.slice(0, dIdx); }
    const mRe = /【([^】]+)】/g, markers = []; let m;
    while ((m = mRe.exec(main)) !== null) {
      const e = experts.find(ex => ex.digitalTitle.includes(m[1]) || m[1].includes(ex.digitalTitle));
      if (e) markers.push({ e, i: m.index, l: m[0].length });
    }
    if (!markers.length) return { sections: (experts.length > 0) ? [{ e: experts[0], text: clean(main) }] : [], dean };
    const sections = [];
    for (let i = 0; i < markers.length; i++) {
      const start = markers[i].i + markers[i].l;
      const end = markers[i+1] ? markers[i+1].i : main.length;
      sections.push({ e: markers[i].e, text: clean(main.slice(start, end)) });
    }
    return { sections, dean };
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
    #ltc-fab.open .ltc-chat-icon { display:none; }
    #ltc-fab.open .ltc-close-icon { display:block; }
    #ltc-widget { position:fixed; bottom:90px; right:24px; z-index:9997;
      width:360px; max-width:calc(100vw - 32px);
      height:540px; max-height:calc(100vh - 110px);
      background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,.18);
      display:flex; flex-direction:column; overflow:hidden;
      transform:scale(.85) translateY(20px); opacity:0;
      transition:transform .2s, opacity .2s; pointer-events:none; }
    #ltc-widget.visible { transform:scale(1) translateY(0); opacity:1; pointer-events:auto; }
    #ltc-widget-header { background:#00897b; color:white; padding:12px 16px;
      font-weight:700; font-size:.95rem; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; }
    #ltc-messages { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px; }
    .ltc-msg-user { align-self:flex-end; background:#00897b; color:white;
      padding:8px 12px; border-radius:14px 14px 2px 14px; font-size:.88rem; max-width:85%; }
    .ltc-msg-ai { align-self:flex-start; background:#f5f5f5;
       padding:10px 12px; border-radius:14px 14px 14px 2px; font-size:.85rem; max-width:95%; line-height:1.65; }
    .ltc-msg-ai p { margin: 0 0 .4em; }
    .ltc-expert-card { align-self:flex-start; display:flex; align-items:center; gap:8px;
      padding:6px 10px; border-radius:8px; border-left:3px solid; background:#f9f9f9; font-size:.8rem; max-width:95%; }
    .ltc-dean-card { margin-top:8px; display:inline-flex; align-items:center; gap:6px; background:#fffdf2; border:1.5px solid #f9a825; border-radius:8px; padding:6px 10px; align-self:flex-start; max-width:95%; font-weight:700; color:#e65100; font-size:.8rem; }
    .ltc-dean-bubble { align-self:flex-start; background:#fffdf2; border:1px solid #fbc02d; padding:10px 12px; border-radius:14px 14px 14px 2px; font-size:.85rem; max-width:95%; line-height:1.65; color:#444; }
    .ltc-chips { display:flex; flex-wrap:wrap; gap:5px; margin-top:2px; padding-left:4px; }
    .ltc-term-chip { background:#00897b; color:white !important; padding:2px 8px; border-radius:12px; font-size:.75rem; text-decoration:none !important; }
    .ltc-google-chip { background:#f1f3f4; color:#1a73e8 !important; padding:2px 8px; border-radius:12px; font-size:.75rem; border:1px solid #dadce0; }
    #ltc-input-row { display:flex; padding:10px 12px; gap:8px; border-top:1px solid #eee; flex-shrink:0; }
    #ltc-input { flex:1; padding:8px 10px; border-radius:8px; border:1.5px solid #ccc; font-size:.88rem; outline:none; height:38px; resize:none; }
    #ltc-send { background:#00897b; color:white; border:none; border-radius:8px; padding:0 14px; cursor:pointer; font-size:1.2rem; }
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────
  const fab = document.createElement("button"); fab.id = "ltc-fab";
  fab.innerHTML = `
    <svg class="ltc-chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    <svg class="ltc-close-icon" viewBox="0 0 24 24" style="display:none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
  const widget = document.createElement("div"); widget.id = "ltc-widget";
  widget.innerHTML = `<div id="ltc-widget-header">🤖 長照膳食 AI 助理 <span>130+ 詞條庫</span></div><div id="ltc-messages"><div class="ltc-msg-ai">請問有什麼長照膳食問題需要協助？</div></div><div id="ltc-input-row"><textarea id="ltc-input" placeholder="輸入問題…"></textarea><button id="ltc-send">➤</button></div>`;
  document.body.appendChild(fab); document.body.appendChild(widget);

  fab.onclick = () => { const v = widget.classList.toggle("visible"); fab.querySelector(".ltc-chat-icon").style.display = v?"none":""; fab.querySelector(".ltc-close-icon").style.display = v?"":"none"; if(v) document.getElementById("ltc-input").focus(); };
  document.getElementById("ltc-input").onkeydown = e => { if(e.key==="Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendMessage(); } };
  document.getElementById("ltc-send").onclick = sendMessage;

  let widgetHistory = JSON.parse(sessionStorage.getItem('ltc_widget_history') || '[]');

  async function sendMessage() {
    const input = document.getElementById("ltc-input"), q = input.value.trim(); if (!q) return;
    
    // 寫入對話紀錄
    widgetHistory.push({ role: "user", parts: [{ text: q }] });
    if (widgetHistory.length > 20) widgetHistory = widgetHistory.slice(-20);

    const experts = detectExperts(q), msgBox = document.getElementById("ltc-messages");
    input.value = ""; document.getElementById("ltc-send").disabled = true;

    const uB = document.createElement("div"); uB.className="ltc-msg-user"; uB.textContent=q; msgBox.appendChild(uB);
    const ld = document.createElement("div"); ld.className="ltc-msg-loading"; ld.textContent="⏳ AI 思考中…"; msgBox.appendChild(ld);
    msgBox.scrollTop = msgBox.scrollHeight;

    try {
      const res = await fetch(WORKER_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ system_instruction:{parts:[{text:buildPrompt(experts)}]}, contents:widgetHistory, generationConfig:{temperature:0.5} }) });
      ld.remove(); if (!res.ok) throw new Error("API 錯誤");
      const d = await res.json(), ans = d.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!ans) throw new Error("無效的回傳");

      // 將 AI 回覆存入歷史紀錄
      widgetHistory.push({ role: "model", parts: [{ text: ans }] });
      sessionStorage.setItem('ltc_widget_history', JSON.stringify(widgetHistory));

      const { sections, dean } = parseSections(ans, experts);

      sections.forEach(sec => {
        const card = document.createElement("div"); card.className="ltc-expert-card"; card.style.borderColor=sec.e.color;
        card.innerHTML = `<span style="font-size:1.1rem">${sec.e.emoji}</span><div><b style="color:${sec.e.color}">${sec.e.digitalTitle}</b> <small style="opacity:.6">· ${sec.e.realRole}</small></div>`;
        msgBox.appendChild(card);
        
        // 氣泡化：依雙換行將回覆切成獨立對話框
        const blocks = sec.text.split(/(?:\r?\n){2,}/).map(t => t.trim()).filter(Boolean);
        blocks.forEach(b => {
          const bEl = document.createElement("div"); bEl.className="ltc-msg-ai"; bEl.innerHTML=renderMd(b); msgBox.appendChild(bEl);
        });
      });

      if (dean) {
        const dC = document.createElement("div"); dC.className="ltc-dean-card";
        dC.innerHTML = `🏅 長照督導院長 <small style="opacity:.7;font-weight:normal">· 跨域照護統籌</small>`;
        msgBox.appendChild(dC);
        
        // 氣泡化院長段落
        const blocks = dean.split(/(?:\r?\n){2,}/).map(t => t.trim()).filter(Boolean);
        blocks.forEach(b => {
          const bEl = document.createElement("div"); bEl.className="ltc-dean-bubble"; bEl.innerHTML=renderMd(b); msgBox.appendChild(bEl);
        });
      }

      const terms = extractTerms(ans);
      const missingTerms = [];

      if (terms.length) {
        const div = document.createElement("div"); div.className="ltc-chips";
        terms.forEach(t => { 
          const inWiki = WIKI_TERMS.includes(t);
          if (!inWiki) missingTerms.push(t);
          
          const a = document.createElement("a"); 
          a.className = inWiki ? "ltc-term-chip" : "ltc-google-chip"; 
          a.href = inWiki ? `${WIKI_BASE}/${encodeURIComponent(t)}/` : `https://www.google.com/search?q=${encodeURIComponent("長照膳食 " + t)}`; 
          a.target = "_blank"; 
          a.textContent = t; 
          div.appendChild(a); 
        });
        msgBox.appendChild(div);
      }

      // Phase 5: 發送缺口紀錄到 Notion
      if (missingTerms.length > 0) {
        missingTerms.forEach(term => {
          fetch(`${WORKER_URL}/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source: "Widget 浮動視窗", question: q, term: term })
          }).catch(err => console.warn("Failed to log missing term from widget", err));
        });
      }
    } catch (e) { ld.remove(); const eb=document.createElement("div"); eb.className="ltc-msg-ai"; eb.style.color="#c62828"; eb.textContent="⚠️ "+e.message; msgBox.appendChild(eb); }
    finally { document.getElementById("ltc-send").disabled = false; msgBox.scrollTop = msgBox.scrollHeight; }
  }
})();
