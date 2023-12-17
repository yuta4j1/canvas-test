import React, { useEffect, useRef } from 'react'

const Preview: React.FC<{
  updated: boolean
  context: CanvasRenderingContext2D | null | undefined
}> = ({ updated, context }) => {
  const canvasEl = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasEl) {
      const ctx = canvasEl.current?.getContext('2d')
      const imageData = context?.getImageData(
        0,
        0,
        context.canvas.width,
        context.canvas.height
      )
      if (imageData) {
        if (context) ctx?.drawImage(context.canvas, 0, 0)
      }
    }
  }, [updated])
  return (
    <div>
      <canvas ref={canvasEl} height={600} width={1000}></canvas>
    </div>
  )
}

export default Preview
