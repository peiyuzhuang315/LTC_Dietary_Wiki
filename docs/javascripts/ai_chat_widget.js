/**
 * LTC Wiki – 全站 AI 聊天浮窗
 * 功能：固定位置浮窗 + Gemini AI 問答 + 詞條推薦 + Google 搜尋連結
 */
(function () {
  const GEMINI_API_KEY = "AIzaSyBOFiq-y9oZft2hqBzFqc7ZvMmy0P0ngxQ";
  const WIKI_BASE = "https://peiyuzhuang315.github.io/LTC_Dietary_Wiki";

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
    "熱量補充","個人化客製","永續包裝","標籤規範","ESG永續策略","失智症","咀嚼困難",
    "銀髮膳食","介護食","吸入性肺炎","肌少症","中風後飲食","心臟病飲食","癌症飲食",
    "長照"
  ];

  const SYSTEM_PROMPT = `你是「長照膳食百科 AI」，專屬於「長照膳食實戰百科」網站的智能助理。
知識庫含 130+ 個長照膳食詞條和 10 篇深度文章。
回答規則：
1. 繁體中文，語氣專業直接
2. 絕對不說寒暄語、開場白、「您好！」「很高興」等，直接進入重點
3. 回答長度適中（200-400 字），條列清晰，必要時適度加長
4. 問題超出範疇請用一句話說明並引導回長照膳食主題
5. 回答結尾必須輸出：「📖 關聯詞條：詞條A、詞條B、詞條C」`;

  function extractTerms(text) {
    const re = /📖\s*關聯詞條[：:]\s*([^\n]+)/;
    const m = text.match(re);
    return m ? m[1].split(/[、,，]/).map(t => t.replace(/[\*🔗📖📝]+/g, "").trim()).filter(Boolean) : [];
  }

  // --- 建立 Widget HTML ---
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
      height:520px; max-height:calc(100vh - 110px);
      background:var(--md-default-bg-color, #fff);
      border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,.18);
      display:flex; flex-direction:column; overflow:hidden;
      transform:scale(.85) translateY(20px); opacity:0;
      transition:transform .2s, opacity .2s; pointer-events:none; }
    #ltc-widget.visible { transform:scale(1) translateY(0); opacity:1; pointer-events:auto; }

    #ltc-widget-header { background:#00897b; color:white; padding:12px 16px;
      font-weight:700; font-size:.95rem; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; }
    #ltc-widget-header span { font-size:.8rem; opacity:.85; }

    #ltc-messages { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:10px; }

    .ltc-msg-user { align-self:flex-end; background:#00897b; color:white;
      padding:8px 12px; border-radius:14px 14px 2px 14px; font-size:.88rem;
      max-width:85%; word-break:break-word; }
    .ltc-msg-ai { align-self:flex-start; background:var(--md-code-bg-color, #f5f5f5);
      padding:10px 12px; border-radius:14px 14px 14px 2px; font-size:.85rem;
      max-width:95%; line-height:1.6; white-space:pre-wrap; word-break:break-word; }
    .ltc-msg-loading { align-self:flex-start; color:#888; font-size:.85rem; padding:4px 0; }

    .ltc-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
    .ltc-term-chip { background:#00897b; color:white !important; padding:2px 10px;
      border-radius:14px; font-size:.78rem; text-decoration:none !important;
      font-weight:500; transition:opacity .15s; }
    .ltc-term-chip:hover { opacity:.8; }
    .ltc-google-chip { background:#f1f3f4; color:#1a73e8 !important; padding:2px 10px;
      border-radius:14px; font-size:.78rem; text-decoration:none !important;
      border:1px solid #dadce0; transition:background .15s; }
    .ltc-google-chip:hover { background:#e8eaed; }
    .ltc-viewfull { display:inline-block; margin-top:4px; font-size:.78rem;
      color:#00897b !important; text-decoration:underline !important; }

    #ltc-input-row { display:flex; padding:10px 12px; gap:8px; border-top:1px solid var(--md-default-fg-color--lightest, #eee); flex-shrink:0; }
    #ltc-input { flex:1; padding:8px 10px; border-radius:8px; border:1.5px solid #ccc;
      font-size:.88rem; outline:none; font-family:inherit;
      background:var(--md-default-bg-color, #fff); color:var(--md-typeset-color, #222);
      resize:none; height:38px; line-height:1.4; }
    #ltc-input:focus { border-color:#00897b; }
    #ltc-send { background:#00897b; color:white; border:none; border-radius:8px;
      padding:0 14px; cursor:pointer; font-size:1.2rem; flex-shrink:0;
      transition:opacity .15s; }
    #ltc-send:hover { opacity:.85; }
    #ltc-send:disabled { opacity:.5; cursor:not-allowed; }
    
    @media (max-width:480px) {
      #ltc-widget { right:12px; bottom:76px; width:calc(100vw - 24px); }
      #ltc-fab { bottom:16px; right:16px; width:50px; height:50px; }
    }
  `;
  document.head.appendChild(style);

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
      <div class="ltc-msg-ai">您好！我是長照膳食 AI 助理，請問您有什麼問題嗎？例如：「長輩吞嚥困難怎麼辦？」「IDDSI 幾級適合我家長輩？」</div>
    </div>
    <div id="ltc-input-row">
      <textarea id="ltc-input" placeholder="輸入問題…（Enter 送出）" rows="1"></textarea>
      <button id="ltc-send">➤</button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(widget);

  // Toggle open/close
  fab.addEventListener("click", () => {
    const isOpen = widget.classList.contains("visible");
    widget.classList.toggle("visible", !isOpen);
    fab.classList.toggle("open", !isOpen);
    if (!isOpen) document.getElementById("ltc-input").focus();
  });

  // Enter to send
  document.getElementById("ltc-input").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  document.getElementById("ltc-send").addEventListener("click", sendMessage);

  async function sendMessage() {
    const input = document.getElementById("ltc-input");
    const q = input.value.trim();
    if (!q) return;

    const msgBox = document.getElementById("ltc-messages");
    input.value = "";
    document.getElementById("ltc-send").disabled = true;

    // User bubble
    const userBubble = document.createElement("div");
    userBubble.className = "ltc-msg-user";
    userBubble.textContent = q;
    msgBox.appendChild(userBubble);

    // Loading
    const loading = document.createElement("div");
    loading.className = "ltc-msg-loading";
    loading.textContent = "⏳ AI 思考中…";
    msgBox.appendChild(loading);
    msgBox.scrollTop = msgBox.scrollHeight;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: q }] }],
            generationConfig: {
              temperature: 0.5,
              thinkingConfig: { thinkingBudget: 0 }
            }
          })
        }
      );
      loading.remove();

      if (!res.ok) throw new Error(`API 錯誤 ${res.status}`);
      const data = await res.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!answer) throw new Error("AI 未回傳內容");

      const cleanAnswer = answer
        .replace(/📖\s*關聯詞條[：:][^\n]+/g, "")
        .trim();

      const aiBubble = document.createElement("div");
      aiBubble.className = "ltc-msg-ai";
      aiBubble.textContent = cleanAnswer;
      msgBox.appendChild(aiBubble);

      // 詞條 chips
      const termNames = extractTerms(answer);
      const matched = termNames.filter(t => WIKI_TERMS.includes(t));
      if (matched.length > 0) {
        const chips = document.createElement("div");
        chips.className = "ltc-chips";
        matched.forEach(t => {
          const a = document.createElement("a");
          a.className = "ltc-term-chip";
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
      const searchKws = matched.slice(0, 2).concat([q.slice(0, 15)]).filter(Boolean);
      searchKws.forEach(kw => {
        const a = document.createElement("a");
        a.className = "ltc-google-chip";
        a.href = `https://www.google.com/search?q=${encodeURIComponent("長照膳食 " + kw)}`;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "🔍 " + kw;
        googleChips.appendChild(a);
      });
      // 查看完整 AI 問答頁連結
      const fullLink = document.createElement("a");
      fullLink.className = "ltc-viewfull";
      fullLink.href = `${WIKI_BASE}/chat/`;
      fullLink.target = "_blank";
      fullLink.textContent = "→ 開啟完整 AI 問答頁面";
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
