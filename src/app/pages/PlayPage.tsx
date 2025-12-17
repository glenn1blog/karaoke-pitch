import { useEffect, useMemo, useRef, useState } from 'react'
import type { PlaybackState, UploadFileType, UploadedMedia } from '../../shared/types/ui.ts'

const getUploadFileType = (file: File): UploadFileType => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'mp3') return 'mp3'
  if (extension === 'mp4') return 'mp4'
  return 'unknown'
}

const formatTimeMs = (ms: number) => {
  if (!Number.isFinite(ms) || ms < 0) return '00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const paddedMinutes = minutes.toString().padStart(2, '0')
  const paddedSeconds = seconds.toString().padStart(2, '0')
  return `${paddedMinutes}:${paddedSeconds}`
}

const PlayPage = () => {
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle')
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const [durationMs, setDurationMs] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mediaRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#0f172a'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#e2e8f0'
    context.font = '20px "Noto Sans TC", system-ui, -apple-system, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('Pitch Graph Placeholder', canvas.width / 2, canvas.height / 2)
  }, [])

  useEffect(() => {
    return () => {
      if (uploadedMedia?.objectUrl) {
        URL.revokeObjectURL(uploadedMedia.objectUrl)
      }
    }
  }, [uploadedMedia?.objectUrl])

  const resetPlaybackState = () => {
    setPlaybackState('idle')
    setCurrentTimeMs(0)
    setDurationMs(0)
    setErrorMessage(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setUploadedMedia(null)
      resetPlaybackState()
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const fileType = getUploadFileType(file)

    if (mediaRef.current) {
      mediaRef.current.pause()
      mediaRef.current.currentTime = 0
    }

    setUploadedMedia({
      file,
      objectUrl,
      fileType,
      fileName: file.name,
    })
    resetPlaybackState()
  }

  const handlePlay = async () => {
    const media = mediaRef.current
    if (!media) return

    try {
      await media.play()
      setErrorMessage(null)
    } catch (error) {
      setPlaybackState('error')
      setErrorMessage('播放時發生問題，請確認瀏覽器權限或檔案格式。')
      console.error('播放失敗', error)
    }
  }

  const handlePause = () => {
    const media = mediaRef.current
    if (!media) return
    media.pause()
  }

  const handleStop = () => {
    const media = mediaRef.current
    if (!media) return
    media.pause()
    media.currentTime = 0
    setPlaybackState('paused')
    setCurrentTimeMs(0)
  }

  const handleReplay = async () => {
    const media = mediaRef.current
    if (!media) return
    media.currentTime = 0
    try {
      await media.play()
      setErrorMessage(null)
    } catch (error) {
      setPlaybackState('error')
      setErrorMessage('重播時發生問題，請確認瀏覽器權限或檔案格式。')
      console.error('重播失敗', error)
    }
  }

  const onLoadedMetadata = () => {
    const media = mediaRef.current
    if (!media) return
    const duration = media.duration
    if (Number.isFinite(duration) && duration > 0) {
      setDurationMs(duration * 1000)
      setPlaybackState('ready')
    }
  }

  const onTimeUpdate = () => {
    const media = mediaRef.current
    if (!media) return
    setCurrentTimeMs(media.currentTime * 1000)
  }

  const onPlay = () => {
    setPlaybackState('playing')
  }

  const onPause = () => {
    setPlaybackState((prev) => (prev === 'ended' ? 'ended' : 'paused'))
  }

  const onEnded = () => {
    setPlaybackState('ended')
  }

  const onError = () => {
    setPlaybackState('error')
    setErrorMessage('此檔案無法播放，請嘗試其他 MP3 / MP4 檔案。')
  }

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const media = mediaRef.current
    if (!media || durationMs <= 0) return

    const valueMs = Number(event.target.value)
    if (!Number.isFinite(valueMs) || valueMs < 0) return

    media.currentTime = valueMs / 1000
    setCurrentTimeMs(valueMs)
  }

  const fileInfo = useMemo(() => {
    if (!uploadedMedia) {
      return {
        selected: '尚未選擇檔案',
        detail: '無',
      }
    }

    const readableType =
      uploadedMedia.fileType === 'unknown' ? '未知類型' : uploadedMedia.fileType.toUpperCase()

    return {
      selected: `已選擇：${uploadedMedia.fileName}`,
      detail: `檔案類型：${readableType}`,
    }
  }, [uploadedMedia])

  const canControl = uploadedMedia !== null && playbackState !== 'error'
  const playDisabled = !canControl || playbackState === 'playing'
  const pauseDisabled = !canControl || playbackState !== 'playing'
  const stopDisabled =
    !canControl || (playbackState !== 'playing' && playbackState !== 'paused' && playbackState !== 'ended')
  const replayDisabled = !canControl

  return (
    <main className="page">
      <header className="page__header">
        <p className="phase-tag">Phase 1 ｜播放控制</p>
        <h1>卡拉 OK 音準圖 Demo</h1>
        <p className="page__subtitle">上傳檔案後即可播放，並可透過按鈕進行控制。</p>
      </header>

      <section className="panel">
        <div className="panel__title">
          <h2>上傳媒體檔案</h2>
          <span className="hint">支援 MP3 / MP4</span>
        </div>
        <label className="upload-box" htmlFor="media-file">
          <input
            id="media-file"
            type="file"
            accept=".mp3,.mp4,audio/mpeg,video/mp4"
            onChange={handleFileChange}
          />
          <div className="upload-box__content">
            <p>點此選擇檔案</p>
            <p className="upload-box__tip">或拖曳檔案至此區域</p>
          </div>
        </label>
        <div className="file-info">
          <p>{fileInfo.selected}</p>
          <p>{fileInfo.detail}</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel__title">
          <h2>播放控制</h2>
          <span className="hint">Phase 1</span>
        </div>
        <div className="controls">
          <button type="button" onClick={() => void handlePlay()} disabled={playDisabled}>
            ▶ 播放
          </button>
          <button type="button" onClick={handlePause} disabled={pauseDisabled}>
            ⏸ 暫停
          </button>
          <button type="button" onClick={handleStop} disabled={stopDisabled}>
            ⏹ 停止
          </button>
          <button type="button" onClick={() => void handleReplay()} disabled={replayDisabled}>
            🔄 重播
          </button>
        </div>
        <div className="timeline">
          <div className="timeline__info">
            <span>{formatTimeMs(currentTimeMs)}</span>
            <span>{durationMs > 0 ? formatTimeMs(durationMs) : '00:00'}</span>
          </div>
          <input
            type="range"
            min={0}
            max={durationMs}
            step={100}
            value={currentTimeMs}
            onChange={handleSeekChange}
            disabled={!canControl || durationMs === 0}
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel__title">
          <h2>麥克風</h2>
          <span className="hint">Phase 2</span>
        </div>
        <div className="controls">
          <button type="button" disabled>
            🎤 開始麥克風
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel__title">
          <h2>音準圖 Canvas</h2>
          <span className="hint">視覺佈局預覽</span>
        </div>
        <div className="canvas-shell">
          <canvas ref={canvasRef} width={1200} height={240} />
        </div>
      </section>

      <section className="panel">
        <div className="panel__title">
          <h2>狀態資訊</h2>
          <span className="hint">Phase 1 狀態</span>
        </div>
        <ul className="status-list">
          <li>
            <strong>已選檔案：</strong>
            <span>{uploadedMedia ? '是' : '否'}</span>
          </li>
          <li>
            <strong>可播放：</strong>
            <span>{playbackState === 'ready' || playbackState === 'playing' ? '是' : '否'}</span>
          </li>
          <li>
            <strong>播放狀態：</strong>
            <span>{playbackState}</span>
          </li>
          <li>
            <strong>目前時間：</strong>
            <span>{formatTimeMs(currentTimeMs)}</span>
          </li>
          <li>
            <strong>總時長：</strong>
            <span>{durationMs > 0 ? formatTimeMs(durationMs) : '未知'}</span>
          </li>
          <li>
            <strong>目前階段：</strong>
            <span>Phase 1 - 播放控制</span>
          </li>
          {errorMessage ? (
            <li>
              <strong>錯誤：</strong>
              <span className="error-text">{errorMessage}</span>
            </li>
          ) : null}
        </ul>
      </section>

      <audio
        ref={mediaRef}
        src={uploadedMedia?.objectUrl ?? ''}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={onError}
      />
    </main>
  )
}

export default PlayPage
