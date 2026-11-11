#!/bin/sh
# Unity WebGL 빌드(factra-twin)를 사이트 public/twin/Build 로 복사한다.
#   1) factra-twin 에서: Unity -batchmode -quit -projectPath . -buildTarget WebGL -executeMethod FactraTwin.EditorTools.TwinSetup.BuildAll
#   2) 여기서: sh scripts/sync-twin.sh [factra-twin 경로]
set -e
SRC="${1:-../factra-twin}/Build/twin/Build"
DST="public/twin/Build"
[ -f "$SRC/twin.loader.js" ] || { echo "빌드가 없습니다: $SRC"; exit 1; }
rm -rf "$DST" && mkdir -p "$DST"
cp "$SRC"/twin.loader.js "$SRC"/twin.data.unityweb "$SRC"/twin.framework.js.unityweb "$SRC"/twin.wasm.unityweb "$DST"/
du -ch "$DST"/* | tail -1
