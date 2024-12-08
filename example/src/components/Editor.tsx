'use client';
import React, { useState, ChangeEvent, TextareaHTMLAttributes, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from './ui/button'
import { Md2PosterContent, Md2Poster, Md2PosterHeader, Md2PosterFooter } from 'markdown-to-poster'
import { Copy, LoaderCircle } from 'lucide-react';


const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ onChange, ...rest }) => {
  return (
    <textarea
      className="border-none bg-gray-100 p-8 w-full resize-none h-full min-h-screen
      focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0
      text-gray-900/70 hover:text-gray-900 focus:text-gray-900 font-light font-inter
      "
      {...rest}
      onChange={(e) => onChange?.(e)}
    />
  )
}

const defaultMd = `**The Odd Case at the Grave**

At the **grave**, a **policeman** noticed an **odd** patch of dirt. A **blast** of wind revealed a **packet** filled with **print** and a mysterious **ball**. A **veteran** archaeologist joined, sparking a **debate** about the **improper** burial of **domestic** artifacts.

“**Motion** here feels off,” the officer said with a **shiver**. The archaeologist, with **brisk** **recognition**, identified an **atomic** symbol. “This requires a **civilized** **variation** of thought,” he stated.

As they examined **oral dictation** exercises about **marriage** and **stress**, the officer muttered, “**Plenty** to **cherish**, but too many **adjectives**!” The team left **behind** the mystery, feeling **oddly** **sympathetic** to its forgotten story.`
  function extractTitleAndContent(text: string): { title: string; content: string } {
        // 读取文件内容
        const lines = text.split('\n').map(line => line.trim());

        // 找到第一个非空行作为标题
        let title = '';
        let contentLines: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            if (lines[i]) {
                title = lines[i].replace(/\*\*(.*?)\*\*/g, '$1');
                contentLines = lines.slice(i + 1);
                break;
            }
        }

        // 将剩余的行合并为内容
        const content = contentLines.join('\n');

        return { title, content };
}
export default function Editor() {
  const [mdString, setMdString] = useState(defaultMd)
  const [title, setTitle] = useState('[标题自动提取]')
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { title, content } = extractTitleAndContent(e.target.value)
    setMdString(content)
    setTitle(title)
  }
  const markdownRef = useRef<any>(null)
  const [copyLoading, setCopyLoading] = useState(false)
  const handleCopyFromChild = () => {
    setCopyLoading(true)
    markdownRef?.current?.handleCopy().then(res => {
      setCopyLoading(false)
      alert('Copy Success!')
    }).catch(err => {
      setCopyLoading(false)
      console.log('err copying from child', err)
    })
  }
  const copySuccessCallback = () => {
    console.log('copySuccessCallback')
  }
  return (
    <ScrollArea className="h-[96vh] w-full border-2 border-gray-900 rounded-xl my-4 relative">
      <div className="flex flex-row h-full ">
        <div className="w-3/5">
          {/* Edit */}
          <Textarea placeholder="markdown" onChange={handleChange} defaultValue={mdString} />
        </div>
        <div className="w-2/5 mx-auto flex justify-center p-4 ">
          {/* Preview */}
          <div className="flex flex-col w-fit">
            <Md2Poster theme="SpringGradientWave" copySuccessCallback={copySuccessCallback} ref={markdownRef}>
              <Md2PosterHeader className="flex justify-center items-center px-4 font-medium text-lg">
                <span>{title}</span>
              </Md2PosterHeader>
              <Md2PosterContent>{mdString}</Md2PosterContent>
              <Md2PosterFooter className='text-center'>
              </Md2PosterFooter>
            </Md2Poster>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-row gap-2 opacity-80 hover:opacity-100 transition-all">
        <Button className=" rounded-xl" onClick={handleCopyFromChild} {...copyLoading ? { disabled: true } : {}}>
          {copyLoading ?
            <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />
            : <Copy className="w-4 h-4 mr-1" />}
          Copy Image
        </Button>
      </div>
    </ScrollArea>
  )
}
