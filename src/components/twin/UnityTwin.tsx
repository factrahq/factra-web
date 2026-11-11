import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Box, Loader2, RotateCw } from 'lucide-react'
import { TWIN_BUILD, TWIN_FILES, TWIN_SIZE_MB, type TwinEvent } from '@/lib/twin'

type UnityInstance = { SendMessage: (obj: string, method: string, arg?: string | number) => void; Quit: () => Promise<void> }
declare global {
  interface Window {
    createUnityInstance?: (canvas: HTMLCanvasElement, config: Record<string, unknown>, onProgress?: (p: number) => void) => Promise<UnityInstance>
    factraTwin?: { onEvent: (e: TwinEvent) => void; siteUrl?: string }
  }
}

export type TwinHandle = { select: (id: string) => void; view: (name: 'iso' | 'top' | 'floor') => void; tags: (json: string) => void }

let loaderPromise: Promise<void> | null = null
function loadLoader() {
  if (window.createUnityInstance) return Promise.resolve()
  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = `${TWIN_BUILD}.loader.js`
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => { loaderPromise = null; reject(new Error('loader')) }
      document.body.appendChild(s)
    })
  }
  return loaderPromise
}

function webglOk() {
  try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false }
}

/**
 * Unity WebGL 3D 트윈. live(JSON 문자열)가 바뀔 때마다 설비 값을 보낸다.
 * PC(폭 860px 이상)는 바로 불러오고, 휴대폰은 버튼을 눌러야 불러온다 (데이터 절약).
 */
/** siteUrl: 기본 공장(가상 공장 A) 대신 열 site.json 주소 — Unity 가 시작할 때 한 번 읽는다 */
const UnityTwin = forwardRef<TwinHandle, { live?: string; onEvent?: (e: TwinEvent) => void; className?: string; siteUrl?: string }>(function UnityTwin({ live, onEvent, className = '', siteUrl }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inst = useRef<UnityInstance | null>(null)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error' | 'nogl'>('idle')
  const [progress, setProgress] = useState(0)
  const alive = useRef(true)
  const started = useRef(false)

  useImperativeHandle(ref, () => ({
    select: id => inst.current?.SendMessage('TwinApp', 'Select', id),
    view: name => inst.current?.SendMessage('TwinApp', 'SetView', name),
    tags: json => inst.current?.SendMessage('TwinApp', 'OnTags', json),
  }), [])

  const start = async () => {
    if (started.current) return
    if (!webglOk()) { setStatus('nogl'); return }
    started.current = true
    setStatus('loading'); setProgress(0)
    window.factraTwin = {
      siteUrl,
      onEvent: e => {
        if (e.type === 'ready' && alive.current) setStatus('ready')
        onEventRef.current?.(e)
      },
    }
    try {
      await loadLoader()
      if (!alive.current || !canvasRef.current || !window.createUnityInstance) return
      inst.current = await window.createUnityInstance(canvasRef.current, {
        dataUrl: `${TWIN_BUILD}${TWIN_FILES.data}`,
        frameworkUrl: `${TWIN_BUILD}${TWIN_FILES.framework}`,
        codeUrl: `${TWIN_BUILD}${TWIN_FILES.code}`,
        streamingAssetsUrl: 'StreamingAssets',
        companyName: 'FACTRA',
        productName: 'Factra Twin',
        productVersion: '0.1',
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        showBanner: () => {},
      }, p => alive.current && setProgress(p))
      if (!alive.current) { inst.current.Quit(); inst.current = null }
    } catch (err) {
      console.warn('[factra-twin]', err)
      started.current = false
      if (alive.current) setStatus('error')
    }
  }

  useEffect(() => {
    alive.current = true
    if (window.innerWidth >= 860) start()
    return () => {
      alive.current = false
      const i = inst.current; inst.current = null; started.current = false
      if (i) i.Quit().catch(() => {})
      if (window.factraTwin) window.factraTwin = undefined
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'ready' && live) inst.current?.SendMessage('TwinApp', 'OnLive', live)
  }, [live, status])

  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      <canvas ref={canvasRef} id="unity-canvas" tabIndex={-1} className={`block h-full w-full touch-none outline-none ${status === 'ready' ? '' : 'invisible'}`} aria-label="3D 디지털 트윈 — 드래그로 회전, 휠로 확대, 설비나 태그를 누르면 선택" />
      {status !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center grid-ink">
          <div className="max-w-[320px] px-6 text-center">
            {status === 'loading' ? (
              <>
                <Loader2 size={28} className="mx-auto animate-spin text-signal" />
                <p className="mt-4 text-[14px] text-on-ink">3D 공장을 불러오는 중… {Math.round(progress * 100)}%</p>
                <div className="mx-auto mt-3 h-1 w-48 bg-white/10"><div className="h-full bg-signal transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
              </>
            ) : status === 'nogl' ? (
              <p className="text-[14px] text-on-ink-2">이 브라우저는 WebGL 2를 지원하지 않아 3D 화면을 열 수 없습니다. 최신 Chrome·Edge·Safari에서 열어 주세요.</p>
            ) : (
              <>
                <Box size={30} strokeWidth={1.5} className="mx-auto text-signal" />
                <p className="mt-4 text-[15px] font-semibold text-on-ink">{status === 'error' ? '3D 화면을 불러오지 못했습니다' : '3D 디지털 트윈'}</p>
                <p className="mt-1.5 text-[13px] text-on-ink-2">{status === 'error' ? '네트워크를 확인하고 다시 시도해 주세요.' : `내려받기 약 ${TWIN_SIZE_MB} MB · PC 화면을 권장합니다.`}</p>
                <button type="button" onClick={start} className="mt-5 inline-flex h-10 items-center gap-2 bg-signal px-4 text-[14px] font-semibold text-white hover:bg-signal-2">
                  {status === 'error' ? <><RotateCw size={15} />다시 시도</> : '3D 불러오기'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

export default UnityTwin
