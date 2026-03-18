/**
 * LTC Wiki – 文章內文關鍵字自動連結
 * 掃描頁面主要內容區，將與 Wiki 詞條相符的文字
 * 自動包裝成連結（跳過標題、已有連結的文字）
 */
(function () {
  const WIKI_BASE = "https://peiyuzhuang315.github.io/LTC_Dietary_Wiki";

  // 詞條列表（由長到短排序，確保長詞條優先匹配）
  const WIKI_TERMS = [
    "GHP食品良好衛生規範","Eatender銀髮友善食品標章","藥物與飲食交互作用","台灣原住民飲食文化",
    "HACCP認證","ISO22000認證","AI智慧營養管理","數位通路App訂餐","MNA篩檢工具","3D列印食物",
    "安寧照護和飲食","口腔衰弱評估","老年憂鬱症與進食","老年跌倒預防","食品安全衛生管理法",
    "失智預防飲食","帕金森氏症飲食","壓瘡預防和飲食","吸入性肺炎","質地調整飲食",
    "銀髮友善食品","高齡照護食品","IDDSI測試方法","口腔癌術後飲食","失智症飲食",
    "腎臟病飲食","心臟病飲食","糖尿病飲食","中風後飲食","精準營養","個人化客製",
    "老年厭食症","水分管理","體重管理","睡眠與飲食","骨骼保健","腸道調理","運動介入",
    "蛋白質補充","熱量補充","多職種協力","跨域整合","照護人員訓練","供應鏈管理",
    "成本控制","市場規模","機構評價","機構選擇指南","社區整合照顧","銀髮經濟","超高齡社會",
    "B2B團膳市場","中央廚房","膳食外包","冷鏈技術","物流宅配","ESG永續策略","永續包裝",
    "標籤規範","食品添加劑","居家補助申請","低收入戶補助","膳費補助","長照聯盟",
    "吞嚥障礙","增稠劑","糊狀餐","口腔衰弱","口腔乾燥症","口腔健康","口腔運動",
    "進食安全","尊嚴進食","共餐","送餐","口感及味道","咀嚼困難","衰弱階段",
    "言語治療師","職能治療師","營養師","外籍照服員","癌症飲食","管灌飲食",
    "失智症","質地分級","IDDSI","肌少症","介護食","銀髮膳食","長照2.0","長照",
    "HACCP","TQF","CAS標章","ROI分析","TAM-SAM-SOM","ESG","GHP","CAS",
    "節慶飲食","素食長照","尊嚴進食","漢典食品","佳樂美","聯夏食品","銀色大門",
    "格林全食物","護力養Basicare","出口策略","機構KPI","消費者分群","新商模","通路布局"
  ];

  // 只在文章頁面執行（避免首頁和 chat 頁面）
  function isArticlePage() {
    const path = window.location.pathname;
    // 排除首頁、chat 頁、chat widget 本身
    if (path === "/" || path.endsWith("/index.html") || path === "/LTC_Dietary_Wiki/" || path === "/LTC_Dietary_Wiki/index.html") return false;
    if (path.includes("/chat")) return false;
    return true;
  }

  if (!isArticlePage()) return;

  function linkTermsInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      if (!parent) return;
      // 跳過標題、連結、code、script、style
      const tagName = parent.tagName ? parent.tagName.toUpperCase() : "";
      if (["A", "H1", "H2", "H3", "H4", "H5", "H6", "CODE", "PRE", "SCRIPT", "STYLE", "BUTTON"].includes(tagName)) return;

      let text = node.textContent;
      let matched = false;

      for (const term of WIKI_TERMS) {
        if (!text.includes(term)) continue;
        // 不在已有連結內
        matched = true;
        const parts = text.split(term);
        if (parts.length < 2) continue;

        const frag = document.createDocumentFragment();
        for (let i = 0; i < parts.length; i++) {
          frag.appendChild(document.createTextNode(parts[i]));
          if (i < parts.length - 1) {
            const a = document.createElement("a");
            a.href = `${WIKI_BASE}/${encodeURIComponent(term)}/`;
            a.textContent = term;
            a.style.color = "var(--md-primary-fg-color)";
            a.style.textDecoration = "none";
            a.style.borderBottom = "1px dotted var(--md-primary-fg-color)";
            frag.appendChild(a);
          }
        }
        parent.replaceChild(frag, node);
        break; // 每個 text node 只替換第一個匹配以避免無限遞迴
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 跳過連結、code、標題、nav、header
      const tag = node.tagName.toUpperCase();
      if (["A", "CODE", "PRE", "SCRIPT", "STYLE", "NAV", "HEADER", "FOOTER"].includes(tag)) return;
      // 避免二次處理已加連結的子節點
      const children = Array.from(node.childNodes);
      children.forEach(child => linkTermsInNode(child));
    }
  }

  function run() {
    // 等 MkDocs 渲染完成後執行
    const article = document.querySelector("article") || document.querySelector(".md-content__inner") || document.querySelector("main");
    if (!article) return;
    linkTermsInNode(article);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    // 稍作延遲確保 MkDocs Material 渲染完成
    setTimeout(run, 500);
  }
})();
