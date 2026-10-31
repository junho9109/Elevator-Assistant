import json,re,os,html,collections,sys
import pymupdf as fitz
sys.path.insert(0,os.path.dirname(__file__))
from cat import classify,strip,knn
P="/sessions/ecstatic-cool-rubin/mnt/HTMLConverter/attached_assets/표준화_대통합_(~25년_제3차)_251214_1767582521919.pdf"
OUT="/sessions/ecstatic-cool-rubin/mnt/HTMLConverter/client/public/std-figures"
txt={int(k):v for k,v in json.load(open('/tmp/pagetext2.json')).items()};c=json.load(open('/tmp/p2_cov.json'))
p1=json.load(open('/tmp/p1_rows.json'))
targets=[p for p in c['low'] if p not in c['idx']]
def nl(s): return re.sub(r'\s+','',s or '')
def src_of(h):
    m=re.search(r'(\d{2,4})년\s*\[?\s*(?:제\s*)?(\d+)\s*차',h)
    return f"({int(m[1])%100}년 제{m[2]}차)" if m else ''
def kind_of(h):
    hs=nl(h)
    if '협의' in hs: return '협의체 결과'
    if '간담회' in hs: return '기술자문 간담회'
    if '전산' in hs: return '전산입력'
    if '변경사항' in hs: return '변경사항'
    if '검사기준' in hs or '표준화' in hs: return '검사기준'
    return '기타'
MARK=re.compile(r'^\s*([‣▸▪•◦○●■□❍ㅇ※★\*\-–·→➩⇒◆▶▷]|\d{1,2}[\.\)]|[①-⑩]|[가-하][\.\)]|\[|<|【|「|『|\(\d+\)|\([가-하]\)|[a-zA-Z][\.\)]|\d{4}\.|❏)')
def reflow(s):
    out=[]
    for ln in s.split('\n'):
        if out and len(out[-1])>=28 and not MARK.match(ln) and ln.strip() and not re.search(r'[\.\?!:;。]\s*$',out[-1]) and not out[-1].startswith('['):
            out[-1]=out[-1].rstrip()+' '+ln.strip()
        else: out.append(ln)
    return '\n'.join(out)
def garble(t):
    toks=t.split()
    return sum(1 for x in toks if len(x)==1)/len(toks) if toks else 1
PAT=re.compile(r'변동\s*됨|차에\s*변동|변동\s*\(')
d=fitz.open(P);import pdfplumber
pl=pdfplumber.open(P)
rows=[];figs_n=0
oldkeys={r['title'] for r in p1}
seen=collections.Counter()
for pn in targets:
    t=txt[pn]['text'];lines=[l for l in t.split('\n')]
    hdr=lines[0].strip() if lines else ''
    body='\n'.join(lines[1:]).strip()
    body=re.sub(r'\n\s*\d{1,3}\s*$','',body)
    gb=garble(t) if len(t)>0 else 1
    full=gb>=.6 or txt[pn]['imgarea']>=.9 and len(re.findall(r'[가-힣]',t))<150 or len(re.findall(r'[가-힣]',t))<6
    pg=d[pn-1]
    lines_={}
    for w in pg.get_text('words'): lines_.setdefault((w[5],w[6]),[]).append(w)
    for v in lines_.values():
        tx=' '.join(x[4] for x in v)
        if PAT.search(tx) and len(tx)<40:
            rr=fitz.Rect(min(x[0] for x in v),min(x[1] for x in v),max(x[2] for x in v),max(x[3] for x in v))+(-6,-3,6,3)
            pg.add_redact_annot(rr,fill=False)
    pg.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE,graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,text=fitz.PDF_REDACT_TEXT_REMOVE)
    figs=[]
    if full:
        dpi=int(min(110,1000/(pg.rect.width/72)))
        pix=pg.get_pixmap(dpi=dpi);name=f"q{pn:03d}-full.jpg";pix.save(os.path.join(OUT,name),jpg_quality=80)
        figs.append(dict(src='/std-figures/'+name,w=pix.width,h=pix.height,caption=f"대통합 PDF {pn}쪽 (원문 쪽 이미지)"))
        bodytxt='' if gb>=.6 else reflow(body)
    else:
        bodytxt=reflow(body)
        pp=pl.pages[pn-1]
        for k,im in enumerate([i for i in pp.images if i['x1']-i['x0']>25 and i['bottom']-i['top']>25]):
            clip=fitz.Rect(im['x0']-2,im['top']-2,im['x1']+2,im['bottom']+2)&pg.rect
            dpi=int(min(130,900/(clip.width/72)))
            pix=pg.get_pixmap(dpi=dpi,clip=clip);name=f"q{pn:03d}-{k}.jpg";pix.save(os.path.join(OUT,name),jpg_quality=82)
            figs.append(dict(src='/std-figures/'+name,w=pix.width,h=pix.height,caption=f"대통합 PDF {pn}쪽"))
    first=next((l.strip() for l in bodytxt.split('\n') if len(l.strip())>=4),'')
    first=re.sub(r'^[❏□‣▸▪•❍ㅇ\-\s\]\)0-9\.]+','',first)[:60].strip()
    if first.count(']')>first.count('['): first=first.replace(']','',1)
    doc=re.sub(r'_?\s*\d{2,4}\.\s*\d+\.\s*\d+.*$','',hdr).strip()
    title=(first+f" ({doc} {pn}쪽)") if first else (f"{doc} {pn}쪽" if doc not in('기타','') else f"기타 자료 {pn}쪽")
    source=src_of(hdr);kind=kind_of(hdr)
    cat=knn(first or doc) or classify(strip(first+' '+bodytxt[:300]))
    key=title[:150]
    if key in oldkeys or seen[key]: key=f"{key[:140]} p{pn}"
    seen[key]+=1
    rows.append(dict(title=key,override_title=title if title!=key else None,basis='',conclusion=bodytxt,source=source,ref='',type_tag=kind,category=cat,
        figures=json.dumps(figs,ensure_ascii=False) if figs else None,rev_note='',rev_text='',pdf_page=pn,seq=2000+pn,origin='대통합',full=bool(full)))
    figs_n+=len(figs)
json.dump(rows,open('/tmp/p2_rows.json','w'),ensure_ascii=False)
print(len(rows),'쪽 항목',figs_n,'그림',sum(1 for r in rows if r['full']),'전체쪽이미지',collections.Counter(r['type_tag'] for r in rows))
