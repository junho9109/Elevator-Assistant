#!/bin/bash
# 표준화 대통합 업로드: 백업 → 칸 추가 → 항목 추가 → 사진·댓글 복사
set -e
URL=$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '"')
D=$(date +%Y%m%d)
psql "$URL" -c "\copy std_item_overrides TO 'backup_std_overrides_before_merge_$D.csv' CSV HEADER"
psql "$URL" -f std_merge_2_backup_20261028.sql
psql "$URL" -f std_merge_1_columns_20261028.sql
psql "$URL" -f std_merge_3_insert_20261028.sql
psql "$URL" -f std_merge_4_copy_photos_comments_20261028.sql
psql "$URL" -f std_merge_5_insert_phase2_20261028.sql
