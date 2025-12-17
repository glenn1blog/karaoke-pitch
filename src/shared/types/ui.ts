export type UploadFileType = 'mp3' | 'mp4' | 'unknown'

export type UploadedMedia = {
  file: File
  objectUrl: string
  fileType: UploadFileType
  fileName: string
}

export type PlaybackState = 'idle' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'
