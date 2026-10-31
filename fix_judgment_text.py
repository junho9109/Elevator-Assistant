import json
import re

PATH = "client/src/data/판정지침_parsed.json"
OUT_PATH = "/tmp/판정지침_parsed_fixed.json"

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

PAGE_MARK = re.compile(r"^-\s*\d+\s*-$")
JOKMUN = re.compile(r"^제\d+조")
NUM_ITEM = re.compile(r"^\d+\.\s")
HANGUL_ITEM = re.compile(r"^[가-힣]\.\s")

def fix_bonmun(text: str) -> str:
    raw_lines = [l for l in text.split("\n")]
    # drop page-marker-only lines
    lines = [l for l in raw_lines if not PAGE_MARK.match(l.strip())]
    # merge "부" + "칙" split across two lines back into "부칙"
    merged = []
    i = 0
    while i < len(lines):
        cur = lines[i].strip()
        nxt = lines[i + 1].strip() if i + 1 < len(lines) else None
        if cur == "부" and nxt == "칙":
            merged.append("부칙")
            i += 2
        else:
            merged.append(lines[i])
            i += 1
    lines = merged

    paragraphs = []
    current = None
    for idx, raw in enumerate(lines):
        line = raw.strip()
        if not line:
            continue
        is_new = (
            idx == 0
            or JOKMUN.match(line)
            or NUM_ITEM.match(line)
            or HANGUL_ITEM.match(line)
            or line == "부칙"
            or line == "제정2016. 12. 23."
        )
        if is_new or current is None:
            paragraphs.append(line)
            current = len(paragraphs) - 1
        else:
            paragraphs[current] = paragraphs[current] + line
    return "\n\n".join(paragraphs)

def fix_bulleted_block(text: str) -> str:
    if "\n" not in text:
        return text
    lines = [l for l in text.split("\n") if l.strip()]
    bullets = []
    current = None
    for idx, raw in enumerate(lines):
        line = raw.strip()
        if idx == 0 or line.startswith("•"):
            bullets.append(line)
            current = len(bullets) - 1
        else:
            bullets[current] = bullets[current] + line
    return "\n".join(bullets)

# 1) 본문
data["본문"]["text"] = fix_bonmun(data["본문"]["text"])

# 2) 별표1 — 항목이 6개뿐이라 직접 확인 후 수동으로 정리
#    (표 헤더가 잘못 항목으로 끼어든 것 제거, 문장 중간에 끊긴 줄바꿈만 이어붙임 —
#     나머지 항목의 줄바꿈은 이미 각각 완결된 개별 사유였으므로 그대로 둠)
b1 = data["별표1"]
b1["items"] = [item for item in b1["items"] if item["num"] != ""]
for item in b1["items"]:
    if item["num"] == "5":
        item["content"] = "특수구조승강기가검사특례인정을받은승강기와구조, 성능, 사양이상이하거나특수구조승강기검사특례를받지않음"
    elif item["num"] == "6":
        item["content"] = (
            "검사사전준비미비로인한검사불가\n"
            "검사준비미비로검사중기준부적합사항을보완하는데상당한시간이지체되는등검사가원활히진행되기어렵다고판단될때"
        )

# 3) 별표2_*, 별표3_* 테이블 — 각 셀의 content를 불릿(•) 기준으로 재조립
for key, sec in data.items():
    if sec.get("type") != "table":
        continue
    for row in sec["rows"]:
        row["content"] = fix_bulleted_block(row.get("content", ""))

with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("done")
print(data["본문"]["text"][:1500])
