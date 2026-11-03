import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// A project's cover: the Cover Video when there is one, looping silently,
// otherwise the Cover image. With both, the image is the video's poster, shown
// while the video loads. It should be the clip's first frame (the demo posters
// in scripts/demo-media/ are), so the switch from poster to video is invisible.
// With no image, the frame keeps its muted background until the first frame is
// ready, then fades the video in. If the video can't play, the image is shown
// instead. Browsers only autoplay video that's muted and inline, hence those
// attributes. Visitors who ask for reduced motion get the first frame, paused.
export function CoverMedia({
  image,
  video,
  eager = false,
  className,
}: {
  image?: string
  video?: string
  eager?: boolean
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setReady(false)
    setFailed(false)
    const el = videoRef.current
    if (!el) return
    // The first frame, or an error, may have arrived before hydration attached
    // onLoadedData and onError.
    if (el.error) return setFailed(true)
    if (el.readyState >= 2) setReady(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.autoplay = false
      // Without autoplay, 'metadata' may never load a frame to show.
      el.preload = 'auto'
      el.pause()
      return
    }
    // React may leave `muted` out of the server HTML, and browsers refuse to
    // autoplay unmuted video, so set it on the element and start it here.
    el.muted = true
    el.play().catch(() => {})
  }, [video])

  if (video && !failed) {
    return (
      <video
        ref={videoRef}
        src={video}
        poster={image}
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        aria-hidden
        onLoadedData={() => setReady(true)}
        onError={() => setFailed(true)}
        className={cn(
          // A poster covers the wait, so only fade in when there isn't one.
          !image && 'transition-opacity duration-300 motion-reduce:transition-none',
          !image && !ready && 'opacity-0',
          className,
        )}
      />
    )
  }

  if (image) {
    return <img src={image} alt="" loading={eager ? 'eager' : 'lazy'} className={className} />
  }

  return null
}
