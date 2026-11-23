import type { ReactNode } from 'react'
import Headphones from '../art/Headphones'
import { BrowserFrame } from '../lecture/ui'

/** Fictional store for Activity 1. Six deliberate trust problems; numbers only show when the instructor reveals them. */
export type AuditMarks = { revealed: number[]; active: number | null }

function Spot({ n, m, children, className = '' }: { n: number; m?: AuditMarks; children: ReactNode; className?: string }) {
  const shown = m?.revealed.includes(n)
  const active = m?.active === n
  return (
    <div className={`relative ${className}`} style={active ? { outline: '4px solid #A8452F', outlineOffset: 4, borderRadius: 6 } : undefined}>
      {children}
      {shown && <span className="absolute right-1.5 top-1.5 z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full border-[3px] border-white bg-brick text-[22px] font-bold text-white shadow-md">{n}</span>}
    </div>
  )
}

export default function AuditSite({ marks, height = 640 }: { marks?: AuditMarks; height?: number }) {
  return (
    <div className="relative">
      <BrowserFrame url="voltaandco-shop.example/kestrel" secure={false} warn="Not secure">
        <div className="bg-white text-[#16213A]" style={{ height }}>
          <Spot n={2} m={marks} className="bg-[#B3122B] py-2 text-center text-[24px] font-bold text-white">97% OFF TODAY ONLY! Just 2 left. Offer ends in 04:59</Spot>
          <div className="flex h-[60px] items-center justify-between border-b border-[#D8DCE6] px-7">
            <span className="text-[30px] font-semibold tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>VOLTA &amp; CO.</span>
            <span className="flex gap-8 text-[20px] text-[#4A5268]"><span>Watches</span><span>Offers</span><span>Cart (0)</span></span>
          </div>
          <div className="mx-7 mt-4 flex gap-7">
            <div className="flex h-[250px] w-[300px] flex-none items-center justify-center rounded bg-[#EEF1F7]">
              <Headphones variant="watch" className="h-[230px] w-[230px]" style={{ filter: 'blur(1.4px)' }} />
            </div>
            <div className="flex-1">
              <Spot n={6} m={marks}>
                <div className="text-[28px] font-bold leading-tight" style={{ fontFamily: '"Courier New", monospace' }}>Kestrel Smartwach &ndash; Premum Qualty</div>
                <div className="mt-1 text-[19px] text-[#4A5268]" style={{ fontFamily: 'Verdana, sans-serif' }}>Track steps, heart rate and sleep. Waterproof!!</div>
              </Spot>
              <Spot n={5} m={marks} className="mt-3">
                <div className="flex items-baseline gap-4"><span className="text-[46px] font-bold text-[#B3122B]">$39</span><span className="text-[24px] text-[#8A91A3] line-through">$1,299</span><span className="text-[20px] font-semibold text-[#16213A]">Free shipping*</span></div>
                <div className="mt-1 text-[15px] text-[#9AA1B3]">*see checkout for details. Returns subject to approval.</div>
              </Spot>
              <div className="mt-3 inline-block rounded bg-[#16213A] px-8 py-2.5 text-[22px] font-semibold text-white">Buy now</div>
            </div>
          </div>
          <Spot n={3} m={marks} className="mx-7 mt-4 space-y-1 text-[19px]">
            {[0, 1, 2].map((k) => <div key={k}><span className="text-[#F5A300]">★★★★★</span> Best watch ever, love it!! <span className="text-[#8A91A3]">Customer123</span></div>)}
          </Spot>
          <Spot n={4} m={marks} className="mx-7 mt-5 border-t border-[#D8DCE6] pt-3 text-[16px] text-[#8A91A3]">
            &copy; Volta &amp; Co. &nbsp;&nbsp; Contact form
          </Spot>
        </div>
      </BrowserFrame>
      {marks?.revealed.includes(1) && (
        <span className={`absolute right-5 top-[7px] z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full border-[3px] border-white bg-brick text-[22px] font-bold text-white shadow-md`} style={marks.active === 1 ? { boxShadow: '0 0 0 5px #A8452F' } : undefined}>1</span>
      )}
    </div>
  )
}
