import React, { useEffect, useRef } from 'react'
import { throttle } from 'lodash'

type Pointer = {
  x: number
  y: number
}

let drawState = false
let pointers: Pointer[] = []

const Canvas = () => {
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  const drawOn = throttle((e: MouseEvent) => {
    console.log('draw on')
    drawState = true
    pointers.push({ x: e.clientX, y: e.clientY })
  }, 1000)
  const drawOff = throttle(() => {
    console.log('draw off')
    drawState = false
    if (pointers.length > 0) {
      pointers.pop()
    }
  }, 1000)
  function mouseMove(this: HTMLCanvasElement, e: MouseEvent) {
    const ctx = canvasEl.current?.getContext('2d')
    if (drawState) {
      if (pointers.length > 0) {
        if (!ctx) return
        const prevPointer = pointers[pointers.length - 1]
        ctx.beginPath()
        ctx.moveTo(prevPointer.x, prevPointer.y)
        const nextPointer: Pointer = { x: e.clientX, y: e.clientY }
        ctx.lineTo(nextPointer.x, nextPointer.y)
        ctx.lineWidth = 4
        ctx.strokeStyle = 'black'
        ctx.stroke()
        pointers.splice(pointers.length - 1, 1, nextPointer)
      }
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
    <div className="mt-4 border-solid border-black border-2">
      <canvas ref={canvasEl} width="400" height="500"></canvas>
    </div>
  )
}

export default Canvas
