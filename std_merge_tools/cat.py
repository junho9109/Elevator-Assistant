import re,json,difflib
RULES=[('피트',r'피트|완충기'),('카 상부',r'카\s*(지붕|상부|위)|난간대|보호난간'),
 ('기계실',r'기계실|구동기\s*공간|풀리실|주\s*개폐기|권상기|기계류\s*공간|제어반|제어패널|캐비닛|수동\s*비상운전'),
 ('카 내',r'카\s*내|카\s*바닥|카\s*조명|비상통화|조작반|카\s*문|카문|인승|정원|환기|거울|손잡이|카\s*벽|장애인|점자|LCD|모니터|인터폰|표시장치'),
 ('승강로',r'승강로|승강장|칸막이|가이드|레일|균형추|평형추|문턱|JAMB|삼방틀|도어|출입문|비상문')]
def strip(x): return re.sub(r'<[^>]+>',' ',x or '')
def classify(t):
    for c,p in RULES:
        if re.search(p,t): return c
    return '기타'
DB=[d for d in json.load(open('/sessions/ecstatic-cool-rubin/mnt/uploads/rough-sound-73829245_production_neondb_2026-10-27_18-18-15.json')) if d['category']]
def n(x): return re.sub(r'\s+','',strip(x))
def knn(text,th=.7):
    best=(0,None);T=n(text)
    for d in DB:
        for t in (d['override_title'],d['title']):
            x=n(t)
            if len(x)<3: continue
            s=max(difflib.SequenceMatcher(None,T,x).ratio(),(len(x)/max(len(T),1) if x in T else 0))
            if s>best[0]: best=(s,d['category'])
    return best[1] if best[0]>=th else None
