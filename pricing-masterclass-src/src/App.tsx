import { useEffect, useState } from 'react'
import Deck from './deck/Deck'
import { SketchDefs } from './design/ui'
import { MODULES } from './modules'
import ChallengeLanding from './pages/ChallengeLanding'
import Presenter from './pages/Presenter'
import Student from './pages/Student'

const parse = () => window.location.hash.replace(/^#\/?/, '')

export default function App() {
  const [route, setRoute] = useState(parse())
  useEffect(() => {
    const f = () => setRoute(parse())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  const [path, qs = ''] = route.split('?')
  const mod = MODULES.find((m) => m.id === path) ?? MODULES[0]
  return (
    <>
      <SketchDefs />
      {path === 'challenge' ? <ChallengeLanding />
        : path === 'student' ? <Student room={(new URLSearchParams(qs).get('room') ?? '').toUpperCase().slice(0, 8)} />
        : path === 'presenter' ? <Presenter />
        : <Deck key={mod.id} module={mod} />}
    </>
  )
}
