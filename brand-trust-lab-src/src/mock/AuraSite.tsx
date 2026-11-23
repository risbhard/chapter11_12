import { Headset, ShieldCheck, Star, Truck } from 'lucide-react'
import Headphones from '../art/Headphones'
import { BrowserFrame, Hot } from '../lecture/ui'

/** Website A: a credible store. Fictional brand. Every element maps to a trust signal in content/hook.ts */
export default function AuraSite({ height = 584 }: { height?: number }) {
  return (
    <BrowserFrame url="auraaudio.example/halo-one">
      <div className="bg-[#FBF8F2] text-[#26221D]" style={{ height, fontFamily: '"Hanken Grotesk Variable", system-ui, sans-serif' }}>
        <Hot id="brand" className="mx-7 flex h-[62px] items-center justify-between border-b border-[#E6DCCB]">
          <div className="flex items-baseline gap-1 text-[30px] font-semibold tracking-[0.18em]">AURA<span className="text-[#C27A3B]">.</span></div>
          <div className="flex gap-7 text-[19px] text-[#5B5249]"><span>Shop</span><span>Support</span><span>Returns</span><span>Reviews</span></div>
        </Hot>
        <div className="mx-7 mt-4 flex gap-7">
          <Hot id="photo" className="w-[300px] flex-none">
            <div className="flex h-[300px] items-center justify-center rounded-lg bg-[#EFE6D6]"><Headphones className="h-[270px] w-[270px]" /></div>
          </Hot>
          <div className="flex-1">
            <div className="type-display text-[44px] leading-none">Halo One</div>
            <div className="mt-1 text-[20px] text-[#5B5249]">Wireless over-ear headphones</div>
            <div className="mt-2 flex items-baseline gap-3"><span className="text-[44px] font-semibold">$99</span><span className="text-[18px] text-[#5B5249]">free shipping over $50</span></div>
            <Hot id="specs" className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1 text-[19px]">
              <span>40-hour battery</span><span>Active noise cancelling</span><span>Bluetooth 5.3</span><span>250 g, foldable</span>
            </Hot>
            <Hot id="reviews" className="mt-3 flex items-center gap-2 text-[19px]">
              <span className="flex text-[#C27A3B]">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={19} fill="currentColor" />)}</span>
              <span className="font-semibold">4.6</span><span className="text-[#5B5249]">from 1,284 verified buyers</span>
            </Hot>
            <div className="mt-3 inline-block rounded-full bg-[#26221D] px-8 py-2.5 text-[21px] font-semibold text-white">Add to cart</div>
          </div>
        </div>
        <div className="mx-7 mt-4 grid grid-cols-3 gap-4 text-[18px] leading-tight">
          <Hot id="policy" className="flex items-start gap-3 rounded-lg bg-[#F1EADB] p-3"><Truck size={26} className="flex-none text-[#8A4A1F]" /><span><b>Ships in 3 to 5 days.</b> Cost shown before you pay. 30-day free returns.</span></Hot>
          <Hot id="support" className="flex items-start gap-3 rounded-lg bg-[#F1EADB] p-3"><Headset size={26} className="flex-none text-[#8A4A1F]" /><span><b>Real support.</b> Chat or call, 8am to 8pm, seven days.</span></Hot>
          <Hot id="checkout" className="flex items-start gap-3 rounded-lg bg-[#F1EADB] p-3"><ShieldCheck size={26} className="flex-none text-[#8A4A1F]" /><span><b>Total $99.00.</b> Tax and shipping are itemized at checkout.</span></Hot>
        </div>
        <div className="mx-7 mt-3 text-[16px] text-[#5B5249]">Privacy policy   Terms   Contact   About us</div>
      </div>
    </BrowserFrame>
  )
}
