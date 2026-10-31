import pdfplumber,json,sys
from concurrent.futures import ProcessPoolExecutor
P="/sessions/ecstatic-cool-rubin/mnt/HTMLConverter/attached_assets/표준화_대통합_(~25년_제3차)_251214_1767582521919.pdf"
def work(r):
    a,b=r;o={}
    with pdfplumber.open(P) as pdf:
        for pn in range(a,b+1):
            pg=pdf.pages[pn-1]
            o[pn]=dict(text=pg.extract_text() or '',nimg=len([i for i in pg.images if i['x1']-i['x0']>25 and i['bottom']-i['top']>25]),
                       imgarea=sum(max(0,min(i['x1'],pg.width)-max(i['x0'],0))*max(0,min(i['bottom'],pg.height)-max(i['top'],0)) for i in pg.images)/(pg.width*pg.height))
    return o
if __name__=='__main__':
    rs=[(7,130),(131,260),(261,390),(391,520),(521,650),(651,719)];out={}
    with ProcessPoolExecutor(6) as ex:
        for o in ex.map(work,rs): out.update(o)
    json.dump(out,open('/tmp/pagetext2.json','w'),ensure_ascii=False);print(len(out))
