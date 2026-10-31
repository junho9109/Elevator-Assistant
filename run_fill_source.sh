#!/bin/bash
set -e
URL=$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '"')
psql "$URL" -c "\copy inspection_item_revisions TO 'backup_revisions_before_fill_$(date +%Y%m%d).csv' CSV HEADER"
psql "$URL" -f fill_source_98_75_20261027.sql
