# 長照膳食 AI 問答

<div id="ltc-chat-container">

<div class="chat-intro">
  <p>💡 <strong>輸入您的問題</strong>，AI 將根據本知識庫的 130+ 個詞條為您解答，並推薦相關文章。</p>
  <p class="chat-examples">試試問：「失智長輩不肯吃飯怎麼辦？」｜「IDDSI 是什麼？」｜「如何申請長照補助？」</p>
</div>

<div class="chat-input-area">
  <textarea id="chat-input" rows="3" placeholder="請輸入您的問題，例如：長輩吞嚥困難要怎麼處理食物？（Enter 送出，Shift+Enter 換行）"></textarea>
  <button id="chat-submit" onclick="submitQuestion()">
    <span id="btn-text">送出問題</span>
    <span id="btn-loading" style="display:none">⏳ AI 思考中…</span>
  </button>
</div>

<div id="chat-answer-area" style="display:none">
  <div class="answer-header">
    <span class="answer-badge">🤖 AI 回答</span>
    <button class="clear-btn" onclick="clearAnswer()">清除</button>
  </div>
  <div id="expert-cards-area" style="display:none; margin-bottom:1rem;"></div>
  <div id="chat-answer-content" class="answer-content"></div>

  <div id="related-terms-area" style="display:none">
    <div class="related-header">📖 相關詞條</div>
    <div id="related-terms-links" class="chip-row"></div>
  </div>

  <div id="related-articles-area" style="display:none">
    <div class="related-header">📝 推薦閱讀文章</div>
    <div id="related-articles-links" class="chip-row"></div>
  </div>

  <div id="google-search-area" class="google-search-area" style="display:none">
    <div class="related-header">🔍 延伸 Google 搜尋</div>
    <div id="google-search-links"></div>
  </div>
</div>

<div id="chat-error" class="chat-error" style="display:none"></div>

</div>

<style>
#ltc-chat-container { max-width: 780px; margin: 1.5rem 0; font-family: inherit; }

.chat-intro {
  background: var(--md-code-bg-color);
  border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;
  border-left: 4px solid var(--md-primary-fg-color);
}
.chat-intro p { margin: 0.25rem 0; }
.chat-examples { font-size: 0.85rem; color: var(--md-default-fg-color--light); }

.chat-input-area { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }

#chat-input {
  width: 100%; padding: 0.85rem 1rem; font-size: 0.95rem; font-family: inherit;
  border: 2px solid var(--md-default-fg-color--lightest); border-radius: 8px;
  background: var(--md-default-bg-color); color: var(--md-typeset-color);
  resize: vertical; transition: border-color 0.2s; box-sizing: border-box;
}
#chat-input:focus { outline: none; border-color: var(--md-primary-fg-color); }

#chat-submit {
  align-self: flex-end; padding: 0.7rem 2rem;
  background: var(--md-primary-fg-color); color: white; border: none;
  border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer;
  transition: opacity 0.2s, transform 0.15s; font-family: inherit;
}
#chat-submit:hover { opacity: 0.88; transform: translateY(-1px); }
#chat-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.answer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.answer-badge {
  background: var(--md-primary-fg-color); color: white;
  padding: 0.2rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
}
.clear-btn {
  background: none; border: 1px solid var(--md-default-fg-color--lighter);
  border-radius: 6px; padding: 0.25rem 0.75rem; font-size: 0.82rem;
  cursor: pointer; color: var(--md-default-fg-color--light); font-family: inherit;
}
.clear-btn:hover { background: var(--md-code-bg-color); }

.answer-content {
  background: var(--md-code-bg-color); border-radius: 10px; padding: 1.25rem;
  line-height: 1.75; border: 1px solid var(--md-default-fg-color--lightest);
  margin-bottom: 1rem; word-break: break-word; overflow-wrap: break-word;
}
.answer-content p { margin: 0 0 .5em; }
.answer-content ul, .answer-content ol { margin: .3em 0 .5em 1.4em; padding: 0; }
.answer-content li { margin: .2em 0; }
.answer-content h4 { margin: .6em 0 .2em; font-size: 1rem; font-weight: 700; }
.answer-content h5 { margin: .4em 0 .15em; font-size: .9rem; font-weight: 600; }
.answer-content strong { font-weight: 700; }
.answer-content code { background: rgba(0,0,0,.06); padding: 1px 5px; border-radius: 3px; font-size: .88rem; }

.google-search-area { margin-top: 0.5rem; }
.google-chip {
  display: inline-block; background: #f1f3f4; color: #1a73e8 !important;
  padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.82rem;
  text-decoration: none !important; margin: 0.25rem 0.25rem 0 0;
  border: 1px solid #dadce0; transition: background 0.15s;
}
.google-chip:hover { background: #e8eaed; }

.related-header { font-weight: 600; margin: 0.75rem 0 0.5rem; color: var(--md-typeset-color); font-size: 0.9rem; }

.chip-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }

.term-chip {
  background: var(--md-primary-fg-color); color: white !important;
  padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.85rem;
  text-decoration: none !important; font-weight: 500; transition: opacity 0.15s;
}
.term-chip:hover { opacity: 0.8; }

.article-chip {
  background: #e65100; color: white !important;
  padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.85rem;
  text-decoration: none !important; font-weight: 500; transition: opacity 0.15s;
}
.article-chip:hover { opacity: 0.8; }

.chat-error {
  background: #fce4ec; color: #c62828; border-radius: 8px;
  padding: 0.85rem 1rem; margin-top: 0.75rem; font-size: 0.9rem;
}

.expert-card {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 14px; border-radius: 10px;
  background: var(--md-code-bg-color);
  border-left: 4px solid; margin-bottom: 8px;
}
.expert-card-emoji { font-size: 1.6rem; line-height: 1; margin-top: 2px; }
.expert-card-info { flex: 1; }
.expert-digital-title { font-weight: 700; font-size: 0.92rem; }
.expert-real-role { font-size: 0.78rem; color: var(--md-default-fg-color--light); margin-bottom: 4px; }
.expert-skill-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.expert-skill-chip {
  padding: 1px 8px; border-radius: 12px; font-size: 0.72rem;
  background: rgba(0,0,0,0.07); color: var(--md-typeset-color);
}

/* 多角色分段對話框 */
.expert-section { margin-bottom: 1.2rem; }
.expert-section-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 12px; border-radius: 8px; border-left: 3px solid;
  background: var(--md-code-bg-color); margin-bottom: 6px;
  font-size: 0.82rem;
}
.expert-section-emoji { font-size: 1.3rem; }
.expert-section-title { font-weight: 700; }
.expert-section-role { opacity: .65; font-size: .78rem; }
.expert-section-bubble {
  border-left: 3px solid; padding: .75rem 1rem;
  border-radius: 0 10px 10px 0;
  background: var(--md-code-bg-color);
  line-height: 1.7;
}
.expert-section-bubble p { margin: 0 0 .4em; }
.expert-section-bubble ul, .expert-section-bubble ol { margin: .3em 0 .3em 1.3em; }
.expert-section-bubble li { margin: .15em 0; }
.expert-section-bubble strong { font-weight: 700; }

@media (max-width: 600px) { #chat-submit { align-self: stretch; } }
</style>

<script>
// ====================================================
// ⚙️ 在下方填入您的 Gemini API Key
// 取得方式：https://aistudio.google.com/app/apikey
// ====================================================
// API 請求透過 Cloudflare Worker 代理（Key 安全存於 Worker 密鑰，不進入 GitHub）
const WORKER_URL = "https://ltc-ai-proxy.peiyuzhuang.workers.dev";


const WIKI_BASE = "https://peiyuzhuang315.github.io/LTC_Dietary_Wiki";

// ============================================================
// 🩺 長照專家角色定義
// ============================================================
const EXPERTS = [
  { id:"care_assessor", emoji:"📋", color:"#1565c0",
    realRole:"照服專員（照專）", digitalTitle:"長照需求評估師",
    skills:["NLP 語意分析","CMS 評估演算法"],
    persona:"你以失能評估引擎（照服專員）身份回答，專長分析照護需求、判定失能等級與補助資格。",
    keywords:["失能","失能評估","CMS","照顧服務","照服員","申請居家","照服","長照","長期照護","老人照護","居家照護","安養","護理之家","機構照護","日照"] },
  { id:"case_manager", emoji:"🗂️", color:"#6a1b9a",
    realRole:"個案管理員（個管師）", digitalTitle:"照護計畫規劃師",
    skills:["排程優化","資源分配邏輯"],
    persona:"你以照護方案架構師（個案管理員）身份回答，專長生成個人化照護計畫、媒合服務單位與預算管控。",
    keywords:["照護計畫","個管","服務媒合","方案","排程","個案管理","照護安排","照護團隊","多職種","整合照顧"] },
  { id:"home_nurse", emoji:"🩺", color:"#c62828",
    realRole:"居家護理師", digitalTitle:"居家護理照護師",
    skills:["生理數據分析","遠端傷口辨識"],
    persona:"你以臨床監測守護者（居家護理師）身份回答，專長監控生命徵象、傷口照護與慢性病管理。",
    keywords:["血壓","血糖","傷口","護理","生命徵象","體溫","心跳","居家護理","換藥","導尿","慢性病","高血壓","糖尿病","心臟病","腎臟病","感染","發燒","脫水","水腫"] },
  { id:"therapist", emoji:"🏃", color:"#2e7d32",
    realRole:"物理/職能治療師", digitalTitle:"復能復健指導師",
    skills:["電腦視覺","人體骨架偵測"],
    persona:"你以復能動態指導員（物理/職能治療師）身份回答，專長分析跌倒風險、指導復健動作與日常生活功能訓練。",
    keywords:["跌倒","復健","走路","行走","平衡","關節","職能治療","物理治療","復能","肌力","ADL","中風","帕金森","步態","輪椅使用","站立","臥床復健","體能","運動"] },
  { id:"nutritionist", emoji:"🥗", color:"#00897b",
    realRole:"營養師", digitalTitle:"精準營養規劃師",
    skills:["膳食圖像辨識","營養成分資料庫"],
    persona:"你以精準營養規劃師（營養師）身份回答，專長設計個人化膳食計畫、吞嚥質地調整與管灌配方建議。",
    keywords:["飲食","吞嚥","營養","食物","管灌","膳食","配方","熱量","蛋白質","吃","進食","不吃飯","限鉀","低鈉","老人","長者","老年","長輩","銀髮","補充品","保健食品","奶粉","保健","維他命","鈣","鐵","益生菌","腸道","骨質","肌少症","體重","減重","增重","食慾","口味","質地","IDDSI","增稠","糊狀","適合","產品"] },
  { id:"care_worker", emoji:"🙌", color:"#f57c00",
    realRole:"照顧服務員（照服員）", digitalTitle:"日常生活照顧師",
    skills:["IoT 裝置連動","SOP 指引系統"],
    persona:"你以虛擬日常助理（照顧服務員）身份回答，專長日常照護操作、翻身移位技巧與生活起居記錄。",
    keywords:["翻身","移位","餵藥","日常照顧","排泄","大便","排便","尿","洗澡","清潔","臥床","喂食","尿布","皮膚","壓瘡","照顧","看護","外傭","外籍看護","陪伴","生活協助"] },
  { id:"social_worker", emoji:"🏛️", color:"#0277bd",
    realRole:"社會工作師（社工）", digitalTitle:"社會福利諮詢師",
    skills:["政策大數據檢索","風險情緒偵測"],
    persona:"你以福利資源導航員（社工）身份回答，專長媒合最新政府補助資源、解讀長照政策與評估照顧者負荷。",
    keywords:["補助","申請","政策","長照2.0","福利","補貼","社工","法規","1966","長照服務","失能補助","補助資格","資源","救助","低收入","弱勢","喘息服務","家庭照護","社區資源","日照中心"] },
  { id:"psychologist", emoji:"💙", color:"#7b1fa2",
    realRole:"心理師", digitalTitle:"心理健康諮詢師",
    skills:["情感運算","CBT 對話引導"],
    persona:"你以情緒共感代理人（心理師）身份回答，專長傾聽照顧者壓力、提供情緒支持與認知行為療法(CBT)建議。",
    keywords:["壓力","情緒","失眠","憂鬱","焦慮","心理","崩潰","辛苦","照顧壓力","心情","傷心","撐不住","喘息","失智症","認知","記憶","行為問題","遊走","拒食","暴躁","情緒障礙"] },
  { id:"pharmacist", emoji:"💊", color:"#d84315",
    realRole:"藥師", digitalTitle:"藥物安全諮詢師",
    skills:["藥物交互作用比對","雲端藥歷串接"],
    persona:"你以智慧用藥安全員（藥師）身份回答，專長偵測藥物交互作用、重複用藥風險與正確用藥時間指導。",
    keywords:["藥物","用藥","藥","副作用","藥單","服藥","藥師","藥物交互","重複用藥","安眠藥","抗生素","保健品","補充劑","成分","效果","交互作用","禁忌","注意事項","飯前","飯後"] },
  { id:"assistive_tech", emoji:"🏠", color:"#558b2f",
    realRole:"輔具評估員", digitalTitle:"居家環境改善師",
    skills:["AR 擴增實境","3D 建模分析"],
    persona:"你以空間改造成型師（輔具評估員）身份回答，專長規劃居家無障礙環境、輔具選配與坡道扶手配置。",
    keywords:["輔具","扶手","坡道","無障礙","居家改造","輪椅","助行器","浴室安全","防跌","住宅修繕","改建","改裝","安全","環境","家具","床","馬桶","淋浴"] }
];

// 長照通用詞：若未命中特定角色但有這些詞，預設返回「精準營養規劃師」（本站以膳食為主）
const LTC_GENERAL_KW = ["照護","長照","老人","長者","老年","長輩","銀髮","失智","安養","護理","老化"];

function detectExperts(question) {
  const scores = {};
  EXPERTS.forEach(e => {
    let s = 0;
    e.keywords.forEach(kw => { if (question.includes(kw)) s++; });
    if (s > 0) scores[e.id] = s;
  });
  const matched = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => EXPERTS.find(e => e.id === id));
  // 後備：若未命中任何角色但屬長照議題，預設顯示營養師
  if (matched.length === 0 && LTC_GENERAL_KW.some(kw => question.includes(kw))) {
    return [EXPERTS.find(e => e.id === "nutritionist")];
  }
  return matched;
}


function buildSystemPrompt(experts) {
  const base = SYSTEM_PROMPT;
  if (!experts.length) return base;
  if (experts.length === 1) {
    const e = experts[0];
    return base + `\n\n【本題啟動的專家角色】\n${e.persona}\n核心數位技能：${e.skills.join('、')}。\n
回答內容後，請加上以下段落：
【長照督導院長】
（以機構督導的口居，用 2-3 句話綜合以上建議，給出最重要的一個行動方向，並提醒家屬可參考下方相關詞條和搜尋資源。語氣溫婉而簡潔）\n
最後輸出關聯詞條。語氣專業直接，展現該角色的專業深度。`;
  }
  // 多角色：要求分段輸出帶協調師結尾
  return base + `\n\n【本題啟動的專家角色】\n本題涉及多個專業領域，請分別以以下角色的觀點回答：\n` +
    experts.map(e => `・${e.digitalTitle}（${e.realRole}）：${e.persona.replace(/你以.+?身份回答，/,'')}`).join('\n') +
    `\n\n【重要格式要求】\n請將回答分成 ${experts.length} 個專家段落，加上 1 個協調師結尾，格式如下：\n` +
    experts.map(e => `【${e.digitalTitle}】\n（此角色的專業建議內容）`).join('\n\n') +
    `\n\n【長照督導院長】\n（以機構督導的口居，2-3 句話綜合以上專家建議，給出最重要的行動方向，提醒參考下方詞條。語氣溫婉簡潔）\n
最後輸出關聯詞條。語氣專業直接，每段展現各角色專業深度。`;
}

// 解析多角色分段回答
function parseExpertSections(answer, experts) {
  if (experts.length <= 1) {
    const clean = answer.replace(/📖\s*關聯詞條[：:][^\n]+/g,'').replace(/📝\s*推薦文章[：:][^\n]+/g,'').trim();
    return [{ expert: experts[0], text: clean }];
  }
  const sections = [];
  const markerRe = /【([^】]+)】/g;
  const markers = [];
  let m;
  while ((m = markerRe.exec(answer)) !== null) {
    const expert = experts.find(e => e.digitalTitle.includes(m[1]) || m[1].includes(e.digitalTitle));
    if (expert) markers.push({ expert, index: m.index, markerLen: m[0].length });
  }
  if (markers.length === 0) {
    const clean = answer.replace(/📖\s*關聯詞條[：:][^\n]+/g,'').replace(/📝\s*推薦文章[：:][^\n]+/g,'').trim();
    return experts.map((e, i) => ({ expert: e, text: i === 0 ? clean : '' })).filter(s => s.text);
  }
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index + markers[i].markerLen;
    const end = markers[i+1] ? markers[i+1].index : answer.length;
    const raw = answer.slice(start, end).replace(/📖\s*關聯詞條[：:][^\n]+/g,'').replace(/📝\s*推薦文章[：:][^\n]+/g,'').trim();
    if (raw) sections.push({ expert: markers[i].expert, text: raw });
  }
  return sections.length ? sections : [{ expert: experts[0], text: answer.replace(/📖\s*關聯詞條[：:][^\n]+/g,'').trim() }];
}

function renderExpertCards(experts) {
  const area = document.getElementById("expert-cards-area");
  if (!experts.length) { area.style.display = "none"; return; }
  area.innerHTML = experts.map((e, i) => `
    <div class="expert-card" style="border-color:${e.color}">
      <div class="expert-card-emoji">${e.emoji}</div>
      <div class="expert-card-info">
        <div class="expert-digital-title" style="color:${e.color}">${e.digitalTitle}${i===1?' <span style="font-weight:400;font-size:.78rem;color:#888">（協作）</span>':''}</div>
        <div class="expert-real-role">${e.realRole}</div>
        <div class="expert-skill-chips">${e.skills.map(s=>`<span class="expert-skill-chip">${s}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
  area.style.display = "block";
}

// Wiki 詞條清單（用於關聯詞條匹配）
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

// 應用文章清單（用於文章推薦匹配）
const APP_ARTICLES = [
  { key: "家屬", title: "家屬指南：出院後一個月飲食計畫", url: WIKI_BASE + "/articles/A01_%E5%AE%B6%E5%B1%AC%E6%8C%87%E5%8D%97_%E5%87%BA%E9%99%A2%E5%BE%8C%E4%B8%80%E5%80%8B%E6%9C%88%E9%A3%AE%E9%A3%9F%E8%A8%88%E7%95%AB/" },
  { key: "IDDSI|採購|業者", title: "業者攻略：用 IDDSI 贏得機構採購", url: WIKI_BASE + "/articles/A02_%E6%A5%AD%E8%80%85%E6%94%BB%E7%95%A5_IDDSI%E8%B4%8F%E5%BE%97%E6%A9%9F%E6%A7%8B%E6%8E%A1%E8%B3%BC/" },
  { key: "SLP|RD|OT|臨床|跨域|言語治療|職能|營養師", title: "臨床整合：SLP+RD+OT 跨域照護模型", url: WIKI_BASE + "/articles/A03_%E8%87%A8%E5%BA%8A%E6%95%B4%E5%90%88_SLP_RD_OT/" },
  { key: "市場|趨勢|商機|銀髮", title: "市場全景：台灣長照膳食 2025-2030 趨勢", url: WIKI_BASE + "/articles/A04_%E5%8F%B0%E7%81%A3%E9%95%B7%E7%85%A7%E8%86%B3%E9%A3%9F%E5%B8%82%E5%A0%B4%E8%B6%A8%E5%8B%A2%E5%9C%B0%E5%9C%96/" },
  { key: "外包|合規|GHP|HACCP|法規", title: "政策深解：長照膳食外包合規指南", url: WIKI_BASE + "/articles/A05_%E6%94%BF%E7%AD%96%E6%B7%B1%E8%A7%A3_2024%E5%A4%96%E5%8C%85%E6%96%B0%E8%A6%8F/" },
  { key: "失智症|失智|認知", title: "失智症長者的一天：完整飲食照護指南", url: WIKI_BASE + "/articles/A06_%E5%A4%B1%E6%99%BA%E7%97%87%E9%95%B7%E8%80%85%E4%B8%80%E5%A4%A9%E9%A3%AE%E9%A3%9F%E6%8C%87%E5%8D%97/" },
  { key: "廚師|烹調|備餐|IDDSI測試|質地", title: "廚師實戰：IDDSI Level 判斷與製備指南", url: WIKI_BASE + "/articles/A07_%E5%BB%9A%E5%B8%AB%E5%AF%A6%E6%88%B0_IDDSI%E8%A3%BD%E5%82%99%E6%8C%87%E5%8D%97/" },
  { key: "成本|財務|毛利|利潤|廚房", title: "長照廚房財務模型：從食材成本到毛利設計", url: WIKI_BASE + "/articles/A08_%E9%95%B7%E7%85%A7%E5%BB%9A%E6%88%BF%E8%B2%A1%E5%8B%99%E6%A8%A1%E5%9E%8B/" },
  { key: "日本|出口|出海|介護食", title: "台灣長照食品出海：日本市場攻略", url: WIKI_BASE + "/articles/A09_%E5%8F%B0%E7%81%A3%E9%95%B7%E7%85%A7%E9%A3%9F%E5%93%81%E5%87%BA%E6%B5%B7%E6%97%A5%E6%9C%AC%E5%B8%82%E5%A0%B4/" },
  { key: "AI|人工智慧|科技|3D列印", title: "AI × 長照膳食：現在能做什麼、5 年後趨勢", url: WIKI_BASE + "/articles/A10_AI%E9%95%B7%E7%85%A7%E8%86%B3%E9%A3%9F%E8%B6%A8%E5%8B%A2/" }
];

const SYSTEM_PROMPT = `你是「長照膳食百科 AI」，專屬於「長照膳食實戰百科」網站的智能助理。
你的知識庫包含 130+ 個長照膳食相關詞條，以及 10 篇深度應用文章。

【溝通原則】
1. 先識別問題背後的心理狀態：
   - 若問題含有情緒訊號（如「怎麼辦」「一直這樣」「我很擔心」「不知道該…」「越來越…」「撐不住」「好累」），
     用 1-2 句話先承認其困境的真實性與辛苦，再切入專業建議
   - 承認困境要真誠具體（例：「長期照顧家人，這種無力感確實很真實。」）
     絕對禁止空洞讚美（例：「您問得很好！」「感謝您的提問」「這是個重要的問題」）
   - 若問題純屬技術諮詢，直接進入重點，不需要情緒鋪墊
2. 語氣專業直接，不繞彎，不廢話，不說「首先」「一般而言」「當然」等空洞過渡語
3. 回答長度適中（200-400 字），條列清晰，善用分點
4. 如果問題超出長照膳食範疇，用一句話說明並引導回相關主題
5. 回答結尾必須分兩行輸出：
   「📖 關聯詞條：詞條A、詞條B、詞條C」
   「📝 推薦文章：文章關鍵字1、文章關鍵字2」
   （詞條選 2-4 個最相關的；文章關鍵字從下列選 0-2 個：家屬、IDDSI、SLP、市場、外包、失智症、廚師、成本、日本、AI）`;

// ── Markdown 渲染 ──────────────────────────────────────────────
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
      html += `<${tag}>${fmt(line.replace(/^#+\s/,""))}</${tag}>`; continue;
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

function extractSection(text, marker) {
  const re = new RegExp("(?:" + marker + ")[：:]\\s*([^\\n]+)");
  const m = text.match(re);
  return (m && m[1]) ? m[1].split(/[、,，]/).map(t => t.replace(/[\*🔗📖📝]+/g, "").trim()).filter(Boolean) : [];
}

function matchArticles(keywords) {
  const results = [];
  keywords.forEach(kw => {
    APP_ARTICLES.forEach(a => {
      const patterns = a.key.split("|");
      if (patterns.some(p => kw.includes(p) || p.includes(kw))) {
        if (!results.find(r => r.url === a.url)) results.push(a);
      }
    });
  });
  return results.slice(0, 3);
}

async function submitQuestion() {
  const input = document.getElementById("chat-input");
  const question = input.value.trim();
  if (!question) return;

  // 偵測相關專家角色
  const experts = detectExperts(question);

  const btn = document.getElementById("chat-submit");
  btn.disabled = true;
  document.getElementById("btn-text").style.display = "none";
  document.getElementById("btn-loading").style.display = "inline";
  document.getElementById("chat-error").style.display = "none";
  document.getElementById("chat-answer-area").style.display = "none";

  try {
    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemPrompt(experts) }] },
          contents: [{ role: "user", parts: [{ text: question }] }],
          generationConfig: {
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      }
    );

    if (!res.ok) throw new Error(`API 回應錯誤 ${res.status}`);
    const data = await res.json();
    let answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!answer) throw new Error("AI 未回傳內容");

    // 清除標記行，留下主要回答
    const cleanAnswer = answer
      .replace(/📖\s*關聯詞條[：:][^\n]+/g, "")
      .replace(/📝\s*推薦文章[：:][^\n]+/g, "")
      .replace(/🔗\s*關聯詞條[：:][^\n]+/g, "")
      .trim();

    // 解析多角色分段
    const sections = parseExpertSections(answer, experts);

    // 清空並重新渲染（多角色分段對話框）
    const contentEl = document.getElementById("chat-answer-content");
    const cardsEl = document.getElementById("expert-cards-area");
    cardsEl.style.display = "none";

    if (sections.length > 1) {
      // 多角色：每個角色各自的名片 + 對話框
      contentEl.innerHTML = sections.map(sec => {
        const e = sec.expert;
        return `
        <div class="expert-section">
          <div class="expert-section-badge" style="border-color:${e.color}">
            <span class="expert-section-emoji">${e.emoji}</span>
            <div>
              <span class="expert-section-title" style="color:${e.color}">${e.digitalTitle}</span>
              <span class="expert-section-role"> · ${e.realRole}</span>
            </div>
          </div>
          <div class="expert-section-bubble" style="border-left-color:${e.color}">${renderMd(sec.text)}</div>
        </div>`;
      }).join('');
    } else {
      // 單角色：原有名片 + 回答框
      renderExpertCards(experts);
      contentEl.innerHTML = renderMd(sections[0]?.text || '');
    }

    document.getElementById("chat-answer-area").style.display = "block";


    // 顯示關聯詞條（直接顯示 AI 建議的所有詞條，有 wiki 頁連 wiki）
    const termNames = extractSection(answer, "📖\\s*關聯詞條");
    const termsArea = document.getElementById("related-terms-area");
    const termsLinks = document.getElementById("related-terms-links");
    if (termNames.length > 0) {
      termsLinks.innerHTML = termNames.map(t => {
        const inWiki = WIKI_TERMS.includes(t);
        const url = inWiki
          ? `${WIKI_BASE}/${encodeURIComponent(t)}/`
          : `https://www.google.com/search?q=${encodeURIComponent("長照膳食 " + t)}`;
        return `<a href="${url}" class="term-chip" target="_blank">${t}</a>`;
      }).join("");
      termsArea.style.display = "block";
    } else {
      termsArea.style.display = "none";
    }

    // 顯示推薦文章
    const articleKeys = extractSection(answer, "📝\\s*推薦文章");
    const matchedArticles = matchArticles(articleKeys.concat([question]));
    const articlesArea = document.getElementById("related-articles-area");
    const articlesLinks = document.getElementById("related-articles-links");
    if (matchedArticles.length > 0) {
      articlesLinks.innerHTML = matchedArticles.map(a =>
        `<a href="${a.url}" class="article-chip" target="_blank">📝 ${a.title}</a>`
      ).join("");
      articlesArea.style.display = "block";
    } else {
      articlesArea.style.display = "none";
    }

    // 顯示 Google 搜尋連結
    const googleArea = document.getElementById("google-search-area");
    const googleLinks = document.getElementById("google-search-links");
    const searchTerms = termNames.slice(0, 3).concat([question.slice(0, 20)]).filter(Boolean);
    googleLinks.innerHTML = searchTerms.map(kw =>
      `<a href="https://www.google.com/search?q=${encodeURIComponent("長照膳食 " + kw)}" class="google-chip" target="_blank" rel="noopener">🔍 ${kw}</a>`
    ).join("");
    googleArea.style.display = "block";

  } catch (err) {
    document.getElementById("chat-error").textContent = `⚠️ 無法取得 AI 回答：${err.message}`;
    document.getElementById("chat-error").style.display = "block";
  } finally {
    btn.disabled = false;
    document.getElementById("btn-text").style.display = "inline";
    document.getElementById("btn-loading").style.display = "none";
  }
}

function clearAnswer() {
  document.getElementById("chat-answer-area").style.display = "none";
  document.getElementById("chat-error").style.display = "none";
  document.getElementById("chat-input").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("chat-input");
  if (input) {
    input.addEventListener("keydown", function (e) {
      // isComposing = true 代表 IME 選字中（注音/倉頡/拼音），此時 Enter 不送出
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        submitQuestion();
      }
    });
  }
});
</script>


> **注意**：AI 回答僅供參考，臨床決策請諮詢相關專業人員（營養師、語言治療師、醫師）。

[← 回知識庫首頁](index.md)
