#!/bin/bash
# 사용: cd /mnt/c/Projects/HTMLConverter && bash run_add_source.sh
set -e
URL=$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '"')
[ -z "$URL" ] && { echo "DATABASE_URL을 .env에서 못 찾음"; exit 1; }
psql "$URL" -c "\copy inspection_item_revisions TO 'backup_revisions_before_source_$(date +%Y%m%d).csv' CSV HEADER"
psql "$URL" -c "ALTER TABLE inspection_item_revisions ADD COLUMN IF NOT EXISTS source varchar(100);"
psql "$URL" -c "SELECT count(*) AS rows, count(source) AS with_source FROM inspection_item_revisions;"
