import React, { useEffect, useRef } from 'react'

const Preview: React.FC<{ updated: boolean }> = ({ updated }) => {
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    if (canvasEl) {
      const ctx = canvasEl.current?.getContext('2d')
      const cl = document.getElementById('writable') as HTMLCanvasElement
      ctx?.drawImage(cl, 0, 0)
    }
  }, [updated])
  return (
    <div>
      <canvas ref={canvasEl}></canvas>
    </div>
  )
}

export default Preview
