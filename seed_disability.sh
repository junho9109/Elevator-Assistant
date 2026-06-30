#!/bin/bash
curl -s -X POST https://elevator-assistant-production.up.railway.app/api/inspection-revisions/bulk-seed \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "seed-2009-67",
    "revisions": [
      {"itemId":"1.10.1-나","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(4)] 승강장 출입구 바닥 앞부분과 카 바닥 앞부분과의 틈의 너비는 3cm 이하로 하여야 한다."},
      {"itemId":"1.10.2-가","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(1)] 모든 스위치 높이 바닥면 0.8m~1.2m 이하로 설치. 곤란 시 1.4m까지 완화"},
      {"itemId":"1.10.2-가","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(2)] 휠체어 조작반 우측벽 0.8m~1.2m 가로형. 1.4mx1.4m 이상 시 좌측 가능"},
      {"itemId":"1.10.2-나","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(11)] 조작반 통화장치 호출버튼에 점자표시판 부착"},
      {"itemId":"1.10.3-가","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(8)] 수평손잡이 측면 후면 각각 설치. 높이 바닥면 0.8m~0.9m"},
      {"itemId":"1.10.3-나","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(7)] 후면에 견고한 재질의 거울 부착. 1.4mx1.4m 이상 시 제외 가능"},
      {"itemId":"1.10.3-다","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(9)] 각 층 승강장 점멸등 음향신호장치. 카 내부 점멸등 음성신호장치 설치"},
      {"itemId":"1.10.3-라","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(12)] 장애인용 호출버튼 또는 휠체어 행선버튼으로 정지 시 10초 이상 대기"},
      {"itemId":"1.10.3-마","effectiveDate":null,"expiryDate":"2009-11-24","introductionType":"revision","description":"[3.1.10(10)] 호출버튼 0.3m 전면에 점형블록 설치 또는 바닥재 질감 달리"}
    ]
  }'
