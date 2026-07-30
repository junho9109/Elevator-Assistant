-- 연혁 데이터 정제

-- A. 연혁집 헤더 오염 정제
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 1983;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2103;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2782;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2794;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2614;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2389;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2400;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2254;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2279;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2367;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n?\s*(승강기 안전기준 연혁집|\[승강기안전부품|\[승강기 안전기준\]).*$', '', 'gn') WHERE id = 2690;

-- B. 다른 조문 내용 섞임 정제
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n8\.6\.1.*$', '', 'gs') WHERE id = 2333;
UPDATE inspection_item_revisions SET description = REGEXP_REPLACE(description, '\n(7\.1\.1|7\.1\.2).*$', '', 'gs') WHERE id IN (2304, 2308);

-- C. 공백/빈 종전 항목 삭제 (72개)
DELETE FROM inspection_item_revisions WHERE id IN (1931, 1939, 1948, 1977, 1981, 2010, 1994, 2007, 2128, 2134, 2144, 2148, 2240, 2154, 2157, 2160, 2166, 2171, 2177, 2180, 2185, 2189, 2193, 2196, 2199, 2202, 2206, 2209, 2212, 2216, 2219, 2222, 2225, 2228, 2231, 2245, 2249, 2252, 2255, 2260, 2268, 2271, 2296, 2299, 2291, 2336, 2334, 2332, 2341, 2351, 2357, 2361, 2366, 2370, 2378, 2394, 2398, 2404, 2781, 2769, 2772, 2775, 2778, 2786, 2796, 2807, 2805, 2629, 2627, 2625, 2763, 2767);