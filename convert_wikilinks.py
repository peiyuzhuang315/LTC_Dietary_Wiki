#!/usr/bin/env python3
"""
WikiLinks 轉換腳本
將 [[詞條名稱]] 格式轉換為標準 Markdown [詞條名稱](詞條名稱.md) 格式
"""
import re
import os
import glob

docs_dir = os.path.join(os.path.dirname(__file__), "docs")
md_files = glob.glob(os.path.join(docs_dir, "*.md"))

pattern = re.compile(r'\[\[([^\]|#]+?)(?:\|([^\]]+))?\]\]')

converted = 0
for filepath in md_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    def replacer(m):
        target = m.group(1).strip()
        label  = (m.group(2) or target).strip()
        # 對應 .md 檔案名稱
        filename = target + ".md"
        return f"[{label}]({filename})"

    new_content = pattern.sub(replacer, content)
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        converted += 1
        print(f"  ✅ 轉換：{os.path.basename(filepath)}")

print(f"\n🎉 完成！共轉換 {converted} 個文件的 WikiLinks。")
