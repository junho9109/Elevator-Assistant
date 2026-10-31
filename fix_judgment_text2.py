import json
import re

PATH = "client/src/data/판정지침_parsed.json"
OUT_PATH = "/tmp/판정지침_bonmun_v2.txt"

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

PAGE_MARK = re.compile(r"^-\s*\d+\s*-$")
# 진짜 조문 제목만 매칭: "제N조(제목)" — 여는 괄호가 "조" 바로 뒤에 와야 함.
# "제13조의2" 같은 본문 중 법령 참조는 괄호가 바로 붙지 않으므로 매칭되지 않음.
JOKMUN = re.compile(r"^제\d+조\(")
NUM_ITEM = re.compile(r"^\d+\.\s")
HANGUL_ITEM = re.compile(r"^[가나다라마바사아자차카타파하]\.\s")

# 원본(줄바꿈이 망가지기 전, 이번 세션 초반에 만든 문자단위 검증본)에서 본문 원문을 다시 불러와야
# 하므로, 현재 파일의 "\n\n"로 합쳐진 본문을 우선 전부 이어붙여 원시 텍스트로 되돌린 뒤 재처리한다.
raw_joined = data["본문"]["text"].replace("\n\n", "\n")
# 이 raw_joined는 이미 조각(paragraph) 단위이므로, 다시 조각별로 쪼개서 원시 줄 단위로 되돌릴 수 없다.
# 대신 /tmp에 남아있는 최초 정리본(문자단위 검증 완료)을 사용한다.
with open("/tmp/판정지침_parsed_fixed.json", encoding="utf-8") as f:
    prev = json.load(f)
bonmun_paragraphs_v1 = prev["본문"]["text"].split("\n\n")

# v1에서 만든 문단들을 다시 원래 줄 단위로 흩어놓지 않고, 문단 리스트 자체를 라인으로 취급해 재분류한다.
lines = bonmun_paragraphs_v1

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

result = "\n\n".join(paragraphs)
data["본문"]["text"] = result

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write(result)

print(result)
