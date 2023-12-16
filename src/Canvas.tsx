import React, { useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'
import Preview from './Preview'

type Pointer = {
  x: number
  y: number
}

let drawState = false
let pointers: Pointer[] = []

const Canvas = () => {
  const [updated, setUpdated] = useState(false)
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  const drawOn = throttle((e: MouseEvent) => {
    // console.log('draw on')
    drawState = true
    const clientRect = canvasEl.current?.getBoundingClientRect()
    if (clientRect) {
      pointers.push({
        x: e.clientX - clientRect.left,
        y: e.clientY - clientRect.top,
      })
    }
  }, 800)
  const drawOff = throttle(() => {
    // console.log('draw off')
    drawState = false
    if (pointers.length > 0) {
      pointers.pop()
    }
    setUpdated(false)
  }, 800)
  function mouseMove(this: HTMLCanvasElement, e: MouseEvent) {
    const ctx = canvasEl.current?.getContext('2d')
    if (drawState) {
      if (pointers.length > 0) {
        if (!ctx) return
        const prevPointer = pointers[pointers.length - 1]
        ctx.beginPath()
        ctx.moveTo(prevPointer.x, prevPointer.y)
        const clientRect = canvasEl.current?.getBoundingClientRect()
        if (clientRect) {
          const nextPointer: Pointer = {
            x: e.clientX - clientRect.left,
            y: e.clientY - clientRect.top,
          }
          ctx.lineTo(nextPointer.x, nextPointer.y)
          ctx.lineWidth = 4
          ctx.strokeStyle = 'black'
          ctx.stroke()
          pointers.splice(pointers.length - 1, 1, nextPointer)
          setUpdated(true)
        }
      }
    }
  }
  const drawClear = () => {
    const ctx = canvasEl.current?.getContext('2d')
    const canvas = canvasEl.current
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  useEffect(() => {
    if (canvasEl) {
      const ctx = canvasEl.current?.getContext('2d')
      const canvas = canvasEl.current
      if (!ctx) return
      canvas?.addEventListener('mousedown', drawOn, false)
      canvas?.addEventListener('mouseup', drawOff, false)
      canvas?.addEventListener('mouseout', drawOff, false)
      canvas?.addEventListener('mousemove', mouseMove, false)
    }

    return () => {
      if (canvasEl) {
        const canvas = canvasEl.current
        canvas?.removeEventListener('mousedown', drawOn, false)
        canvas?.removeEventListener('mouseup', drawOff, false)
        canvas?.removeEventListener('mouseout', drawOff, false)
        canvas?.removeEventListener('mousemove', mouseMove, false)
      }
    }
  }, [])
  return (
    <div className="flex">
      <div>
        <button onClick={drawClear}>Clear</button>
        <div className="border-solid border-black border-2">
          <canvas
            id="writable"
            ref={canvasEl}
            height="600"
            width="1000"
          ></canvas>
        </div>
      </div>
      <Preview updated={updated} />
    </div>
  )
}

export default Canvas
