import { useEffect, useState } from 'react'
import Stage from './lecture/Stage'
import Presenter from './lecture/Presenter'
import { screens } from './screens'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const f = () => setHash(window.location.hash)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return hash.startsWith('#/presenter') ? <Presenter screens={screens} /> : <Stage screens={screens} />
}
