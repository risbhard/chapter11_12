import { useEffect, useState } from 'react'
import Deck from './deck/Deck'
import { LiveProvider } from './lib/LiveProvider'
import { MODULES } from './modules'
import Join from './pages/Join'
import Presenter from './pages/Presenter'

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
  if (path === 'join') return <Join room={(new URLSearchParams(qs).get('room') ?? '').toUpperCase().slice(0, 8)} />
  if (path === 'presenter') return <Presenter />
  return <LiveProvider><Deck key={mod.id} module={mod} /></LiveProvider>
}
