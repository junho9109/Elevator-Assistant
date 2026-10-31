-- 별표22 16.3.3 항목 신규 추가 (16.3.1~16.3.2와 16.3.4 사이 누락분)
INSERT INTO public.inspection_base_items
  (item_id, section_id, section_title, parent_section_id, text, sort_order, permit_effective_date, created_at, updated_at)
SELECT
  '16.3.3',
  '16.3.3',
  '16.3 피난용 엘리베이터의 추가요건',
  '16.3',
  '16.3.3 카 내에 갇힌 이용자 등이 외부와 통화할 수 있는 비상통화장치가 엘리베이터가 있는 건축물이나 고정된 시설물의 관리 인력이 상주하는 장소(경비실, 전기실, 중앙관리실 등) 2곳 이상에 설치되어야 한다. 다만, 관리 인력이 상주하는 장소가 2곳 미만인 경우에는 1곳에만 설치될 수 있다. 또한, 건축물이나 고정된 시설물 내의 장소와 통화 연결이 되지 않을 때를 대비하여 유지 관리업체 또는 자체점검을 담당하는 사람 등 해당 건축물이나 고정된 시설물 외부로 자동으로 통화 연결되어 신속한 구조 요청이 이뤄질 수 있어야 한다. 비상통화장치는 다음과 같이 작동·설치되어야 한다.
가) 비상통화 버튼을 한 번만 눌러도 작동되어야 한다.
나) 비상통화 버튼을 작동시키면 전송을 알리는 음향 또는 통화신호가 작동되고 노란색 표시의 등이 점등되어야 한다.
다) 비상통화가 연결되면 녹색 표시의 등이 점등되어야 한다.
라) 카 내부 비상통화 버튼은 바닥면으로부터 0.8 m 이상 1.2 m 이하의 위치에 설치되어야 한다(화물용 엘리베이터의 경우에는 제외한다). 다만, 휠체어사용자용 조작반에 비상통화장치가 설치된 경우에는 그렇지 않다. <2023년 3월 2일 이후 건축허가분부터 적용>',
  (SELECT sort_order FROM public.inspection_base_items WHERE item_id = '16.3.2')
    + ((SELECT sort_order FROM public.inspection_base_items WHERE item_id = '16.3.4')
       - (SELECT sort_order FROM public.inspection_base_items WHERE item_id = '16.3.2')) / 2,
  '2023-03-02',
  now(), now()
ON CONFLICT (item_id) DO UPDATE SET
  text = EXCLUDED.text,
  section_title = EXCLUDED.section_title,
  parent_section_id = EXCLUDED.parent_section_id,
  permit_effective_date = EXCLUDED.permit_effective_date,
  updated_at = now();
