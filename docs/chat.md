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
  white-space: pre-wrap; margin-bottom: 1rem;
  word-break: break-word; overflow-wrap: break-word;
}

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

@media (max-width: 600px) { #chat-submit { align-self: stretch; } }
</style>

<script>
// ====================================================
// ⚙️ 在下方填入您的 Gemini API Key
// 取得方式：https://aistudio.google.com/app/apikey
// ====================================================
const GEMINI_API_KEY = "AIzaSyAH_L28zQAW2txNfW_eE8J4wXv49lUx3HA";

const WIKI_BASE = "https://peiyuzhuang315.github.io/LTC_Dietary_Wiki";

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

回答規則：
1. 使用繁體中文，語氣親切但專業
2. 回答長度適中（200-400 字），重點清楚
3. 如果問題超出長照膳食範疇，請引導回相關主題
4. 回答結尾必須分兩行輸出：
   「📖 關聯詞條：詞條A、詞條B、詞條C」
   「📝 推薦文章：文章關鍵字1、文章關鍵字2」
   （詞條從知識庫選 2-4 個最相關的；文章關鍵字從下列選 0-2 個最相關的：家屬、IDDSI、SLP、市場、外包、失智症、廚師、成本、日本、AI）`;

function extractSection(text, marker) {
  const re = new RegExp(marker + "[：:]\\s*([^\\n]+)");
  const m = text.match(re);
  return m ? m[1].split(/[、,，]/).map(t => t.replace(/[\*🔗📖📝]+/g, "").trim()).filter(Boolean) : [];
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

  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    document.getElementById("chat-error").textContent = "⚠️ 請先在頁面程式碼中填入您的 Gemini API Key（參考頁面底部說明）";
    document.getElementById("chat-error").style.display = "block";
    return;
  }

  const btn = document.getElementById("chat-submit");
  btn.disabled = true;
  document.getElementById("btn-text").style.display = "none";
  document.getElementById("btn-loading").style.display = "inline";
  document.getElementById("chat-error").style.display = "none";
  document.getElementById("chat-answer-area").style.display = "none";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: question }] }],
          generationConfig: { temperature: 0.5 },
          thinkingConfig: { thinkingBudget: 0 }
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

    document.getElementById("chat-answer-content").textContent = cleanAnswer;
    document.getElementById("chat-answer-area").style.display = "block";

    // 顯示關聯詞條
    const termNames = extractSection(answer, "📖\\s*關聯詞條|🔗\\s*關聯詞條");
    const matchedTerms = termNames.filter(t => WIKI_TERMS.includes(t));
    const termsArea = document.getElementById("related-terms-area");
    const termsLinks = document.getElementById("related-terms-links");
    if (matchedTerms.length > 0) {
      termsLinks.innerHTML = matchedTerms.map(t =>
        `<a href="${WIKI_BASE}/${encodeURIComponent(t)}/" class="term-chip" target="_blank">${t}</a>`
      ).join("");
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
      `<a href="https://www.google.com/search?q=${encodeURIComponent('長照膳食 ' + kw)}" class="google-chip" target="_blank" rel="noopener">🔍 ${kw}</a>`
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
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitQuestion(); }
    });
  }
});
</script>


> **注意**：AI 回答僅供參考，臨床決策請諮詢相關專業人員（營養師、語言治療師、醫師）。

[← 回知識庫首頁](index.md)
