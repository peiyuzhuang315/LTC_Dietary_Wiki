#!/usr/bin/env python3
"""
WikiLinks 批次轉換腳本（升級版）
將所有 .md 文件中的 [[詞條名稱]] 格式轉換為標準 Markdown [詞條名稱](../詞條名稱.md)
支援遞迴掃描子目錄
"""
import re
import os
import glob

# 掃描目錄清單（原始 Wiki 來源 + MkDocs docs/）
TARGET_DIRS = [
    os.path.expanduser("~/Antigravity/Dayu's Zone/Mandala知識庫/LTC_Dietary_Wiki"),
    os.path.expanduser("~/Antigravity/Dayu's Zone/Mandala知識庫/ltc-wiki-site/docs"),
]

# [[詞條名稱]] 或 [[詞條名稱|顯示文字]] 格式
pattern = re.compile(r'\[\[([^\]\|#]+?)(?:\|([^\]]+))?\]\]')

def convert_file(filepath, base_docs_dir):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    def replacer(m):
        target = m.group(1).strip()
        label  = (m.group(2) or target).strip()
        # 計算相對路徑：如果文件在子目錄，需要加 ../
        file_dir = os.path.dirname(filepath)
        rel_depth = os.path.relpath(file_dir, base_docs_dir)
        if rel_depth == ".":
            prefix = ""
        else:
            depth = len(rel_depth.split(os.sep))
            prefix = "../" * depth
        filename = f"{prefix}{target}.md"
        return f"[{label}]({filename})"

    new_content = pattern.sub(replacer, content)
    return new_content, new_content != content

total_converted = 0

for target_dir in TARGET_DIRS:
    if not os.path.exists(target_dir):
        print(f"⚠️  目錄不存在，跳過：{target_dir}")
        continue

    # 遞迴搜尋所有 .md 文件（排除隱藏目錄）
    md_files = []
    for root, dirs, files in os.walk(target_dir):
        # 排除隱藏目錄（.git 等）
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for f in files:
            if f.endswith('.md'):
                md_files.append(os.path.join(root, f))

    print(f"\n📁 掃描目錄：{target_dir}")
    print(f"   找到 {len(md_files)} 個 .md 文件")

    dir_converted = 0
    for filepath in md_files:
        new_content, changed = convert_file(filepath, target_dir)
        if changed:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            dir_converted += 1
            total_converted += 1
            print(f"  ✅ {os.path.relpath(filepath, target_dir)}")

    print(f"   本目錄轉換：{dir_converted} 個文件")

print(f"\n🎉 全部完成！共轉換 {total_converted} 個文件的 WikiLinks。")
