#!/bin/sh
# Unity WebGL 빌드(factra-twin)를 사이트 public/twin/Build 로, 데모 공장 배치(site.json)를 src/lib/demo-site.json 으로 복사한다.
# 배치는 3D·2D 배치도가 같은 파일을 쓴다 — 원본은 factra-twin/site-format/samples/demo-factory-a/site.json (여기서 고치지 않는다)
#   1) factra-twin 에서: sh scripts/build-unity.sh   (또는 --sync 로 이 스크립트까지 한 번에)
#   2) 여기서: sh scripts/sync-twin.sh [factra-twin 경로]
set -e
TWIN="${1:-../factra-twin}"
SRC="$TWIN/unity/Build/twin/Build"
DST="public/twin/Build"
[ -f "$SRC/twin.loader.js" ] || { echo "빌드가 없습니다: $SRC"; exit 1; }
rm -rf "$DST" && mkdir -p "$DST"
cp "$SRC"/twin.loader.js "$SRC"/twin.data.unityweb "$SRC"/twin.framework.js.unityweb "$SRC"/twin.wasm.unityweb "$DST"/
du -ch "$DST"/* | tail -1
cp "$TWIN/site-format/samples/demo-factory-a/site.json" src/lib/demo-site.json && echo "site.json → src/lib/demo-site.json"
# /twin 페이지 3D = 새벽정밀(가상) 공장: Unity 가 내려받는 public 사본 + 설비 목록을 읽는 src 사본
mkdir -p public/twin/sites
cp "$TWIN/site-format/samples/virtual-saebyeok/site.json" public/twin/sites/virtual-saebyeok.json
cp "$TWIN/site-format/samples/virtual-saebyeok/site.json" src/lib/saebyeok-site.json && echo "virtual-saebyeok → public/twin/sites, src/lib/saebyeok-site.json"
