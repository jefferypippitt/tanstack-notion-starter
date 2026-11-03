import { useEffect, useRef } from 'react'

// A project's cover: the Cover Video when there is one, looping silently with
// the Cover image as its poster (shown while it loads, or if it can't play),
// otherwise the Cover image. Browsers only autoplay video that's muted and
// inline, hence those attributes. Visitors who ask for reduced motion get the
// first frame, paused.
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

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.autoplay = false
      el.pause()
      return
    }
    // React may leave `muted` out of the server HTML, and browsers refuse to
    // autoplay unmuted video, so set it on the element and start it here.
    el.muted = true
    el.play().catch(() => {})
  }, [video])

  if (video) {
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
        className={className}
      />
    )
  }

  if (image) {
    return <img src={image} alt="" loading={eager ? 'eager' : 'lazy'} className={className} />
  }

  return null
}
