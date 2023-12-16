import React from 'react'
import Canvas from './Canvas'

const App: React.FC<{}> = ({}) => {
  return (
    <main>
      <h1 className="font-bold text-xl">Draw Canvas</h1>
      <section className="p-8">
        <Canvas />
      </section>
    </main>
  )
}

export default App
