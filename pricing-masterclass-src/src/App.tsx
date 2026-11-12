import { useEffect, useState } from 'react'
import Deck from './deck/Deck'
import { SketchDefs } from './design/ui'
import { MODULES } from './modules'
import ChallengeLanding from './pages/ChallengeLanding'

const parse = () => window.location.hash.replace(/^#\/?/, '')

export default function App() {
  const [route, setRoute] = useState(parse())
  useEffect(() => {
    const f = () => setRoute(parse())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  const mod = MODULES.find((m) => m.id === route) ?? MODULES[0]
  return (
    <>
      <SketchDefs />
      {route === 'challenge' ? <ChallengeLanding /> : <Deck key={mod.id} module={mod} />}
    </>
  )
}
