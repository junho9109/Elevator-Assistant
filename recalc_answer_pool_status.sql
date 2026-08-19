-- 기존 ai_answer_pool 행들의 status를 새 순점수(좋아요-아쉬워요) 기준으로 재계산
-- (2026-08-20 net-score 방식 전환 이전에 3표 고정 문턱으로 계산되어 있던 값을 갱신)
UPDATE ai_answer_pool
SET status = CASE
  WHEN thumbs_up > thumbs_down THEN 'approved'
  WHEN thumbs_down > thumbs_up THEN 'excluded'
  ELSE 'pending'
END;

-- 확인용
SELECT id, question, thumbs_up, thumbs_down, status FROM ai_answer_pool ORDER BY id;
