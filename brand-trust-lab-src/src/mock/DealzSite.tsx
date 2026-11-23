import Headphones from '../art/Headphones'
import { BrowserFrame, Hot } from '../lecture/ui'

/** Website B: a doubtful store. Mismatched fonts, typos and loud pricing are deliberate. Fictional brand. */
export default function DealzSite({ height = 584 }: { height?: number }) {
  return (
    <BrowserFrame url="sound-dealz-shop.example/headfones-99" secure={false}>
      <div className="bg-white text-[#111]" style={{ height }}>
        <Hot id="discount" tone="bad" className="bg-[#E4002B] py-1.5 text-center text-[24px] text-[#FFE600]" >
          <span style={{ fontFamily: 'Impact, "Arial Black", sans-serif', letterSpacing: 1 }}>MEGA SALE!!! 90% OFF - ENDS IN 09:41 !!!</span>
        </Hot>
        <Hot id="brand" tone="bad" className="flex h-[58px] items-center justify-between border-b-4 border-[#1E90FF] px-6">
          <span className="text-[32px] text-[#E4002B]" style={{ fontFamily: '"Comic Sans MS", "Comic Relief", cursive' }}>SoUnD DeAlZ</span>
          <span className="text-[18px]" style={{ fontFamily: '"Times New Roman", serif' }}>HOME &nbsp; BEST DEALS!! &nbsp; contact</span>
        </Hot>
        <div className="mx-6 mt-3 flex gap-5">
          <Hot id="photo" tone="bad" className="w-[280px] flex-none">
            <div className="flex h-[280px] items-center justify-center overflow-hidden bg-[#FFF3B0]">
              <Headphones variant="dealz" className="h-[260px] w-[260px]" style={{ filter: 'blur(1.6px) contrast(1.35) saturate(1.8)' }} />
            </div>
          </Hot>
          <div className="flex-1">
            <Hot id="copy" tone="bad">
              <div className="text-[24px] font-bold leading-tight" style={{ fontFamily: '"Courier New", monospace' }}>Wirelss HEADFONES - Best Qualty!!!</div>
              <div className="mt-1 text-[17px] leading-snug text-[#333]" style={{ fontFamily: 'Georgia, serif' }}>Amazng sound you will LOVE. Super bass, long batery, very comfortble. Order now dont miss!!</div>
            </Hot>
            <div className="mt-2 flex items-baseline gap-3"><span className="text-[48px] font-black text-[#E4002B]" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>$99</span><span className="text-[24px] text-[#777] line-through">$499</span><span className="rounded bg-[#FFE600] px-2 text-[17px] font-bold">Only 3 left!</span></div>
            <Hot id="reviews" tone="bad" className="mt-1 text-[16px]">
              <div style={{ fontFamily: 'Arial, sans-serif' }}><span className="text-[#F5A300]">★★★★★</span> Great product!!!! - Customer</div>
              <div style={{ fontFamily: 'Arial, sans-serif' }}><span className="text-[#F5A300]">★★★★★</span> Great product!!!! - Customer</div>
            </Hot>
            <div className="mt-2 inline-block rounded bg-[#FFE600] px-7 py-2 text-[26px] font-black" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>BUY NOW!!</div>
          </div>
        </div>
        <div className="mx-6 mt-3 space-y-1 text-[14px] text-[#9A9A9A]">
          <Hot id="shipping" tone="bad"><span>+ shipping &amp; handling calculated at checkout</span></Hot>
          <Hot id="refund" tone="bad"><span>Refunds: see terms. Restocking fees may apply.</span></Hot>
        </div>
        <div className="mx-6 mt-4 rounded bg-[#E6F7FF] px-3 py-2 text-[17px] text-[#0057B8]" style={{ fontFamily: 'Verdana, sans-serif' }}>FREE GIFT with every order! *conditions apply</div>
        <div className="mx-6 mt-3 text-[13px] text-[#B5B5B5]" style={{ fontFamily: 'Georgia, serif' }}>copyright 2019 SoundDealz all right reserved</div>
      </div>
    </BrowserFrame>
  )
}
