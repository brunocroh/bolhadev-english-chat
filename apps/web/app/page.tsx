import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    ArrowRight,
  ChevronRight,
  Dumbbell,
  Heart,
  MessageCircle,
  PiggyBank,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InfoCard } from './components/info-card'

const infoCardContent = [
  {
    icon: MessageCircle,
    content:
      'The most effective way to improve your English is through speaking.',
  },
  {
    icon: Dumbbell,
    content:
      'Enhance your English skills quickly by practicing a little every day.',
  },
  {
    icon: Heart,
    content: 'Show respect, patience, and kindness to everyone.',
  },
  {
    icon: PiggyBank,
    content: "And best of all, it's completely free.",
  },
]

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col">
      <section className="relative flex w-full flex-col items-center lg:container">
        <Image src="/background-noise.png" width="1820" height="1040" className='absolute -z-10 mix-blend-lighten' alt="a noise to add front of square pattern background" />
        <div className="absolute size-full bg-pattern bg-cover bg-center -z-30 "></div>
        <div className="absolute size-full top-96 md:top-40 bg-elipses bg-cover bg-center -z-20 "></div>
        <div className="flex flex-col py-12 items-center w-full gap-6"> 
          <Image src="/hero-section-logo.png" width="128" height="78" alt="a square pattern on background"   />
          <h2 className="text-slate-6 w-full text-center text-2xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-gray-200 to-[#A4A7FF] inline-block text-transparent bg-clip-text">
              Master English, Transform Your World. 
            </span>
            <br />
            <span>
              The new frontier in collaborative learning.
            </span>
          </h2>
          <h3 className="my-4 text-center text-[1rem] text-slate-400">
            The quickest path to learn English is speaking it regularly. Just find someone to chat with.
          </h3>
          <div className="flex w-full justify-center">
            <Link href={`room/queue`}>
              <Button className="p-6 min-w-max rounded-lg text-base text-zinc-800">
                <span className="mr-1">
                  Get Started
                </span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section
        style={{ boxShadow: '0px -20px 44px -60px rgb(255 255 255)' }}
        className="border-slate-6 h-full bg-background relative pt-10 flex flex-col items-center overflow-hidden rounded-3xl border-t px-6 py-12 lg:container sm:mx-5 sm:py-24 md:mx-10 lg:mx-auto"
      >
        <div
          aria-hidden="true"
          className="center pointer-events-none absolute -top-1 left-1/2 -z-20 h-[200px] w-full max-w-[200px] -translate-x-1/2 -translate-y-1/2 md:max-w-[400px]"
          style={{
            background:
              'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #000 50%),radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)',
          }}
        />
        <div className="mt-10 flex w-full flex-col flex-wrap items-center justify-center gap-10 md:flex-row">
          {infoCardContent.map((card, i) => (
            <InfoCard icon={card.icon} content={card.content} key={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
