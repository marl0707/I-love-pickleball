import os
import re
import json

pb_dir = r"C:\Users\sejim\.gemini\antigravity\conversations"
out_dir = r"C:\Users\sejim\OneDrive\デスクトップ\Ronshoal_Tech_Base\02_Development\I-love-pickleball\data"
if not os.path.exists(out_dir):
    os.makedirs(out_dir)

print("🔍 会話履歴（.pbファイル）全体からのサルベージを開始します...")

found_files = 0
# "TargetFile": "絶対パス" と "CodeContent": "内容" のような
# ツールコールの痕跡をバイナリ文字列の中から正規表現で強引に抽出する
# （.pbファイル内のエンコーディングやヌル文字を考慮したざっくりマッチ）

for file in os.listdir(pb_dir):
    if not file.endswith(".pb"): continue
    path = os.path.join(pb_dir, file)
    with open(path, "rb") as f:
        content = f.read().decode("utf-8", errors="ignore")
    
    # data/ 配下に作られた .json ファイル名の痕跡を探す
    # パス例: data/pro_players/men_top.json
    
    # 簡易的に "data/.../*.json" という文字列が含まれているブロックを探す
    # アンチグラビティのツールコール構造 (write_to_file)
    pattern = r'({(?:[^{}]*)*"TargetFile"\s*:\s*".*?data\\([a-zA-Z0-9_]+)\\[a-zA-Z0-9_]+\.json".*?"CodeContent"\s*:\s*"(.*?)".*?})'
    
    # 単純に「```json ... ```」ブロックで保存されている可能性もある
    # ここでは、少しでも復元率を高めるために、"name", "product_name" 等のキーを持つ配列抽出も試みる
    
    # ツールコールの痕跡を探す (TargetFile に合致するもの)
    # 複雑なので、パスとJSONらしい中身を分けて探すアプローチ
    path_pattern = r'(data[\\/](pro_players|gears|drills|events|coaches|paddles|shoes|balls|apparel|bags|accessories)[\\/][a-zA-Z0-9_]+\.json)'
    
    matches = re.finditer(path_pattern, content)
    for m in matches:
        relative_path = m.group(1).replace('/', '\\')
        # matchの位置周辺の文字列を取得して、JSONらしい部分を抜き出す
        start_idx = m.start()
        # 後方10万文字程度の窓を開ける
        window = content[start_idx : start_idx + 100000]
        
        # ```json から ``` までを抜く
        json_matches = re.finditer(r'```json\s*(\[\s*\{.*?\}\s*\])\s*```', window, re.DOTALL)
        for jm in json_matches:
            json_str = jm.group(1).encode('utf-8').decode('unicode_escape', errors='ignore')
            target_file = os.path.join(r"C:\Users\sejim\OneDrive\デスクトップ\Ronshoal_Tech_Base\02_Development\I-love-pickleball", relative_path)
            
            # ディレクトリ作成
            os.makedirs(os.path.dirname(target_file), exist_ok=True)
            
            # 手動でパースしてみる
            try:
                parsed = json.loads(json_str)
                with open(target_file, "w", encoding="utf-8") as out_f:
                    json.dump(parsed, out_f, ensure_ascii=False, indent=4)
                print(f"✅ 復元成功: {relative_path}")
                found_files += 1
            except Exception as e:
                pass

        # CodeContent に直接書かれたパターン
        code_content_match = re.search(r'"CodeContent"\s*:\s*"(\[\s*\{.*?(?:\}\s*\]))"', window, re.DOTALL)
        if code_content_match:
            try:
                # ダブルクォートのエスケープなどを戻す
                json_str = code_content_match.group(1).replace('\\"', '"').replace('\\n', '\n')
                parsed = json.loads(json_str)
                target_file = os.path.join(r"C:\Users\sejim\OneDrive\デスクトップ\Ronshoal_Tech_Base\02_Development\I-love-pickleball", relative_path)
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                with open(target_file, "w", encoding="utf-8") as out_f:
                    json.dump(parsed, out_f, ensure_ascii=False, indent=4)
                print(f"✅ 復元成功: {relative_path}")
                found_files += 1
            except Exception as e:
                pass

print(f"🚀 サルベージ完了: {found_files} 個のファイルデータを会話履歴から復元しました。")
