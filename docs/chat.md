# 長照膳食 AI 問答

<div id="ltc-chat-container">

<div class="chat-intro">
  <p>💡 <strong>輸入您的問題</strong>，AI 將根據本知識庫的 130+ 個詞條為您解答。</p>
  <p class="chat-examples">試試問：「失智長輩不肯吃飯怎麼辦？」｜「IDDSI 是什麼？」｜「如何申請長照補助？」</p>
</div>

<div class="chat-input-area">
  <textarea id="chat-input" rows="3" placeholder="請輸入您的問題，例如：長輩吞嚥困難要怎麼處理食物？"></textarea>
  <button id="chat-submit" onclick="submitQuestion()">
    <span id="btn-text">送出問題</span>
    <span id="btn-loading" style="display:none">AI 思考中…</span>
  </button>
</div>

<div id="chat-answer-area" style="display:none">
  <div class="answer-header">
    <span class="answer-badge">🤖 AI 回答</span>
    <button class="clear-btn" onclick="clearAnswer()">清除</button>
  </div>
  <div id="chat-answer-content" class="answer-content"></div>
  <div id="related-terms-area" style="display:none">
    <div class="related-header">🔗 延伸閱讀詞條</div>
    <div id="related-terms-links"></div>
  </div>
</div>

<div id="chat-error" class="chat-error" style="display:none"></div>

</div>

<style>
#ltc-chat-container {
  max-width: 780px;
  margin: 1.5rem 0;
  font-family: inherit;
}

.chat-intro {
  background: var(--md-code-bg-color);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  border-left: 4px solid var(--md-primary-fg-color);
}

.chat-intro p { margin: 0.25rem 0; }

.chat-examples {
  font-size: 0.85rem;
  color: var(--md-default-fg-color--light);
}

.chat-input-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

#chat-input {
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  border: 2px solid var(--md-default-fg-color--lightest);
  border-radius: 8px;
  background: var(--md-default-bg-color);
  color: var(--md-typeset-color);
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

#chat-input:focus {
  outline: none;
  border-color: var(--md-primary-fg-color);
}

#chat-submit {
  align-self: flex-end;
  padding: 0.7rem 2rem;
  background: var(--md-primary-fg-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  font-family: inherit;
}

#chat-submit:hover { opacity: 0.88; transform: translateY(-1px); }
#chat-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.answer-badge {
  background: var(--md-primary-fg-color);
  color: white;
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.clear-btn {
  background: none;
  border: 1px solid var(--md-default-fg-color--lighter);
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-size: 0.82rem;
  cursor: pointer;
  color: var(--md-default-fg-color--light);
  font-family: inherit;
}

.clear-btn:hover { background: var(--md-code-bg-color); }

.answer-content {
  background: var(--md-code-bg-color);
  border-radius: 10px;
  padding: 1.25rem;
  line-height: 1.75;
  border: 1px solid var(--md-default-fg-color--lightest);
  white-space: pre-wrap;
}

.related-header {
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: var(--md-typeset-color);
  font-size: 0.9rem;
}

#related-terms-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.term-chip {
  background: var(--md-primary-fg-color);
  color: white !important;
  padding: 0.3rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  text-decoration: none !important;
  font-weight: 500;
  transition: opacity 0.15s;
}

.term-chip:hover { opacity: 0.8; }

.chat-error {
  background: #fce4ec;
  color: #c62828;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  #chat-submit { align-self: stretch; }
}
</style>

<script>
// ====================================================
// Cloudflare Worker 端點（部署後替換此 URL）
// ====================================================
const WORKER_URL = "https://ltc-wiki-worker.YOUR_SUBDOMAIN.workers.dev/ask";

async function submitQuestion() {
  const input = document.getElementById("chat-input");
  const question = input.value.trim();
  if (!question) return;

  // UI 狀態：送出中
  const btn = document.getElementById("chat-submit");
  const btnText = document.getElementById("btn-text");
  const btnLoading = document.getElementById("btn-loading");
  btn.disabled = true;
  btnText.style.display = "none";
  btnLoading.style.display = "inline";

  document.getElementById("chat-error").style.display = "none";
  document.getElementById("chat-answer-area").style.display = "none";

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    // 顯示回答（移除最後一行的關聯詞條標記，改為卡片顯示）
    let answer = data.answer || "";
    answer = answer.replace(/[\*\*]*🔗\s*關聯詞條[：:][^\n]+/g, "").trim();

    const answerEl = document.getElementById("chat-answer-content");
    answerEl.textContent = answer;
    document.getElementById("chat-answer-area").style.display = "block";

    // 顯示關聯詞條連結
    const relatedArea = document.getElementById("related-terms-area");
    const relatedLinks = document.getElementById("related-terms-links");

    if (data.related_terms && data.related_terms.length > 0) {
      relatedLinks.innerHTML = data.related_terms.map(term =>
        `<a href="${term.url}" class="term-chip" target="_blank">${term.name}</a>`
      ).join("");
      relatedArea.style.display = "block";
    } else {
      relatedArea.style.display = "none";
    }

  } catch (err) {
    const errEl = document.getElementById("chat-error");
    errEl.textContent = `⚠️ 無法取得 AI 回答：${err.message}`;
    errEl.style.display = "block";
  } finally {
    btn.disabled = false;
    btnText.style.display = "inline";
    btnLoading.style.display = "none";
  }
}

function clearAnswer() {
  document.getElementById("chat-answer-area").style.display = "none";
  document.getElementById("chat-error").style.display = "none";
  document.getElementById("chat-input").value = "";
}

// Enter 鍵送出（Shift+Enter 換行）
document.addEventListener("DOMContentLoaded", function() {
  const input = document.getElementById("chat-input");
  if (input) {
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitQuestion();
      }
    });
  }
});
</script>

---

> **注意**：AI 回答僅供參考，臨床決策請諮詢相關專業人員（營養師、語言治療師、醫師）。

[← 回知識庫首頁](index.md)
