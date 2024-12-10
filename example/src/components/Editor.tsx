"use client";
import React, {
  useState,
  ChangeEvent,
  TextareaHTMLAttributes,
  useRef,
} from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { Copy, LoaderCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Md2Poster,
  Md2PosterHeader,
  Md2PosterContent,
  Md2PosterFooter,
} from "./markdown2poster";
import "@/components/markdown2poster/index.css";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { clsx } from "clsx";

const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  onChange,
  ...rest
}) => {
  return (
    <textarea
      className="border-none bg-gray-100 p-8 w-full resize-none h-full min-h-screen
      focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0
      text-gray-900/70 hover:text-gray-900 focus:text-gray-900 font-light font-inter
      "
      {...rest}
      onChange={(e) => onChange?.(e)}
    />
  );
};

const defaultMd = `**The Odd Case at the Grave**

At the **grave**, a **policeman** noticed an **odd** patch of dirt. A **blast** of wind revealed a **packet** filled with **print** and a mysterious **ball**. A **veteran** archaeologist joined, sparking a **debate** about the **improper** burial of **domestic** artifacts.

“**Motion** here feels off,” the officer said with a **shiver**. The archaeologist, with **brisk** **recognition**, identified an **atomic** symbol. “This requires a **civilized** **variation** of thought,” he stated.

As they examined **oral dictation** exercises about **marriage** and **stress**, the officer muttered, “**Plenty** to **cherish**, but too many **adjectives**!” The team left **behind** the mystery, feeling **oddly** **sympathetic** to its forgotten story.`;
function extractTitleAndContent(text: string): {
  title: string;
  content: string;
} {
  // 读取文件内容
  const lines = text.split("\n").map((line) => line.trim());

  // 找到第一个非空行作为标题
  let title = "";
  let contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) {
      title = lines[i].replace(/\*\*(.*?)\*\*/g, "$1");
      contentLines = lines.slice(i + 1);
      break;
    }
  }

  // 将剩余的行合并为内容
  const content = contentLines.join("\n");

  return { title, content };
}
export default function Editor() {
  const [mdString, setMdString] = useState(defaultMd);
  const [title, setTitle] = useState("[标题自动提取]");
  const [editorWidth, setEditorWidth] = useState("60%");
  const [titleFontSize, setTitleFontSize] = useState("text-xl");
  const [contentFontSize, setContentFontSize] = useState("text-lg");
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { title, content } = extractTitleAndContent(e.target.value);
    setMdString(content);
    setTitle(title);
  };
  const markdownRef = useRef<any>(null);
  const [copyLoading, setCopyLoading] = useState(false);
  const handleCopyFromChild = () => {
    setCopyLoading(true);
    markdownRef?.current
      ?.handleCopy()
      .then((res) => {
        setCopyLoading(false);
        // notify();
        toast.success("Copy Success!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        setCopyLoading(false);
        console.log("err copying from child", err);
      });
  };
  const copySuccessCallback = () => {
    console.log("copySuccessCallback");
  };
  return (
    <div>
      <ToastContainer />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">Content Font Size</span>
            <RadioGroup
              defaultValue={contentFontSize}
              onValueChange={(v) => setContentFontSize(v)}
            >
              <RadioGroupItem value="text-xs">xs</RadioGroupItem>
              <RadioGroupItem value="text-sm">sm</RadioGroupItem>
              <RadioGroupItem value="text-base">base</RadioGroupItem>
              <RadioGroupItem value="text-lg">lg</RadioGroupItem>
              <RadioGroupItem value="text-xl">xl</RadioGroupItem>
              <RadioGroupItem value="text-2xl">2xl</RadioGroupItem>
              <RadioGroupItem value="text-3xl">3xl</RadioGroupItem>
            </RadioGroup>
          </div>
        </div>
        

        <input
          type="range"
          className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
          min="20"
          max="80"
          value={Number(editorWidth.replace("%", ""))}
          onChange={(e) => setEditorWidth(`${e.target.value}%`)}
        />
      </div>
      <ScrollArea className="h-[96vh] w-full border-2 border-gray-900 rounded-xl my-4 relative">
        <div className="flex flex-row h-full ">
          <div style={{ width: editorWidth }}>
            {/* Edit */}
            <Textarea
              placeholder="markdown"
              onChange={handleChange}
              defaultValue={mdString}
            />
          </div>
          <div
            className="mx-auto flex flex-col p-4 "
            style={{ width: `calc(100% - ${editorWidth})` }}
          >
            {/* Preview */}
            <div className="flex flex-col w-fit">
              <Md2Poster
                theme="green"
                copySuccessCallback={copySuccessCallback}
                ref={markdownRef}
              >
                <Md2PosterHeader
                  className={`flex justify-center items-center px-4 font-medium ${titleFontSize}`}
                >
                  <span>{title}</span>
                </Md2PosterHeader>
                <Md2PosterContent className={contentFontSize}>
                  {mdString}
                </Md2PosterContent>
                <Md2PosterFooter className="text-center"></Md2PosterFooter>
              </Md2Poster>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex flex-row gap-2 opacity-80 hover:opacity-100 transition-all">
            <Button
              className=" rounded-xl"
              onClick={handleCopyFromChild}
              {...(copyLoading ? { disabled: true } : {})}
            >
              {copyLoading ? (
                <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              Copy Image
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
