import json,random,html,base64
import pymupdf as fitz
R=json.load(open('/tmp/p2_rows.json'))
P="/sessions/ecstatic-cool-rubin/mnt/HTMLConverter/attached_assets/표준화_대통합_(~25년_제3차)_251214_1767582521919.pdf"
random.seed(5);sel=[r for r in R if r['full']][:2]+random.sample([r for r in R if not r['full'] and r['figures']],3)+random.sample([r for r in R if not r['figures']],4)
d=fitz.open(P)
def e(s): return html.escape(s or '')
H='''<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>2차 업로드 검증 샘플</title><style>
body{font-family:'Malgun Gothic',sans-serif;background:#f1f3f6;margin:0;padding:16px;font-size:12px}h1{font-size:17px;color:#1e3a5f}
.c{background:#fff;border:1px solid #dde1e8;border-radius:10px;padding:10px;margin-bottom:14px}.g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
img{width:100%;border:1px solid #ccc;margin-top:6px}.t{font-weight:700;color:#1e3a5f}.m{color:#667;font-size:11px;margin:4px 0}.s{border-left:3px solid #fbbf24;padding-left:8px;white-space:pre-wrap;line-height:1.7}
</style></head><body><h1>2차(쪽 단위 원문) 검증 샘플 — 왼쪽 원본 PDF / 오른쪽 앱에 올라갈 내용</h1>'''
for r in sel:
    pix=d[r['pdf_page']-1].get_pixmap(dpi=62)
    H+=f'<div class="c"><div class="g"><div><img src="data:image/jpeg;base64,{base64.b64encode(pix.tobytes("jpeg",jpg_quality=60)).decode()}"></div><div><div class="t">{e(r["override_title"] or r["title"])}</div><div class="m">PDF {r["pdf_page"]}쪽 · {e(r["source"])} · {e(r["type_tag"])} · 분류 {e(r["category"])}</div><div class="s">{e(r["conclusion"]) or "(글자 없음 — 아래 이미지로 표시)"}</div>'
    for f in json.loads(r['figures'] or '[]'):
        H+=f'<img src="data:image/jpeg;base64,{base64.b64encode(open("/sessions/ecstatic-cool-rubin/mnt/HTMLConverter/client/public"+f["src"],"rb").read()).decode()}">'
    H+='</div></div></div>'
open('/sessions/ecstatic-cool-rubin/mnt/HTMLConverter/표준화_대통합_2차_검증_샘플.html','w',encoding='utf-8').write(H+'</body></html>');print(len(H)//1024,'KB',len(sel))
