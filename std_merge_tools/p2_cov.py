import re,json,collections,html
SQL='/sessions/ecstatic-cool-rubin/mnt/HTMLConverter/std_merge_3_insert_20261028.sql'
s=open(SQL,encoding='utf-8').read()
body=s[s.index('VALUES')+6:s.index('\n)\nINSERT')]
tok=re.compile(r"\$q\$(.*?)\$q\$|(NULL)|'대통합'|(\d+)",re.S)
vals=[];
for m in tok.finditer(body):
    if m.group(0)=="'대통합'": vals.append('대통합')
    elif m.group(2): vals.append(None)
    elif m.group(3) is not None and m.group(1) is None: vals.append(int(m.group(3)))
    else: vals.append(m.group(1))
assert len(vals)%14==0,len(vals)
cols="title override_title basis conclusion source ref type_tag category figures rev_note rev_text pdf_page seq origin".split()
rows=[dict(zip(cols,vals[i:i+14])) for i in range(0,len(vals),14)]
print(len(rows))
json.dump(rows,open('/tmp/p1_rows.json','w'),ensure_ascii=False)
txt={int(k):v for k,v in json.load(open('/tmp/pagetext2.json')).items()}
def nrm(x): return re.sub(r'[\s\W_]+','',html.unescape(x or ''))
def g(x,k=4): return {x[i:i+k] for i in range(len(x)-k+1)}
bp=collections.defaultdict(str)
for r in rows: bp[r['pdf_page']]+=nrm((r['override_title'] or r['title'])+(r['basis'] or '')+(r['conclusion'] or '')+(r['rev_text'] or ''))
cov={}
for p,d in txt.items():
    G=g(nrm(d['text']));cov[p]=len(G&g(bp.get(p,'')))/len(G) if G else 1.0
low=[p for p,v in cov.items() if v<.7]
idx=[]
for p in low:
    L=[l for l in txt[p]['text'].split('\n')[1:] if l.strip()]
    if sum(1 for l in L if re.match(r'\s*[❏□]',l))/max(len(L),1)>=.25: idx.append(p)
json.dump(dict(cov=cov,low=low,idx=idx),open('/tmp/p2_cov.json','w'))
print('낮은 쪽',len(low),'목록형',len(idx),'처리대상',len(low)-len(idx))
