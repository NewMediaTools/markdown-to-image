'use client'
import MdHome from '@/markdown/home.mdx'
import Section from '@/components/Section'
import dynamic from 'next/dynamic'
import Docs from './docs/page'

const Editor = dynamic(() => import('@/components/Editor'), {
 ssr: false,
})
export default function Home() {
  return (
    <div>
      {/* <Docs/> */}
      <Section className='relative'><Editor /></Section>
    </div>
  )
}
