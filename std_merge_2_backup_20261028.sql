-- 2) 작업 전 백업: 표준화 표 전체를 복사해 둠 (이미 있으면 건너뜀)
CREATE TABLE IF NOT EXISTS std_item_overrides_bak_20261028 AS TABLE std_item_overrides;
SELECT count(*) AS backup_rows FROM std_item_overrides_bak_20261028;
