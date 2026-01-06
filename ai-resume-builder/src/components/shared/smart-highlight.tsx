"use client";

import React from "react";
import flourite from "flourite";
import Prism from "prismjs";

// Import CSS và Languages
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";

interface SmartHighlightProps {
  text: string;
  className?: string;
}

const SmartHighlight: React.FC<SmartHighlightProps> = ({ text, className = "" }) => {
  
  // Hàm xử lý highlight từng đoạn code
  const renderCodeBlock = (code: string, detectedLang?: string) => {
    // Nếu không có lang truyền vào, dùng Flourite để đoán
    const lang = detectedLang || flourite(code, { shiki: false }).language.toLowerCase();
    const grammar = Prism.languages[lang] || Prism.languages.javascript;
    const highlighted = Prism.highlight(code, grammar, lang);

    return (
      <div className="relative group/code my-3">
        <div className="absolute right-3 top-2 text-[9px] uppercase font-bold text-slate-500 opacity-50 z-10">
          {lang}
        </div>
        <pre className={`language-${lang} rounded-xl !bg-slate-950 !p-4 !m-0 overflow-x-auto border border-slate-800 shadow-xl`}>
          <code 
            className={`language-${lang} text-[13px] leading-relaxed`} 
            dangerouslySetInnerHTML={{ __html: highlighted }} 
          />
        </pre>
      </div>
    );
  };

  // 1. Tách văn bản dựa trên ký hiệu Markdown ``` (Triple backticks)
  const regexCodeBlock = /```(\w+)?\n([\s\S]+?)\n```/g;
  const parts: any[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regexCodeBlock.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', lang: match[1], content: match[2] });
    lastIndex = regexCodeBlock.lastIndex;
  }

  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    
    // Kiểm tra thủ công nếu nội dung có vẻ là code (như trường hợp bạn dán trực tiếp)
    const isLikelyCode = (txt: string) => {
        const d = flourite(txt, { shiki: false });
        const detected = d.language.toLowerCase();
        return detected !== 'unknown' && (txt.includes('def ') || txt.includes('function') || txt.includes('{') || txt.includes('import '));
    };

    if (parts.length === 0 && isLikelyCode(remainingText)) {
        const questionEnd = remainingText.indexOf('?') + 1;
        if (questionEnd > 0 && questionEnd < remainingText.length) {
            parts.push({ type: 'text', content: remainingText.slice(0, questionEnd) });
            parts.push({ type: 'code', content: remainingText.slice(questionEnd).trim() });
        } else {
            parts.push({ type: 'code', content: remainingText });
        }
    } else {
        parts.push({ type: 'text', content: remainingText });
    }
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {parts.map((part, i) => {
        if (part.type === 'code') {
          return <div key={i}>{renderCodeBlock(part.content, part.lang)}</div>;
        }

        const inlineParts = part.content.split(/(`[^`]+`)/g);
        return (
          <p key={i} className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {inlineParts.map((inline: string, j: number) => {
              if (inline.startsWith("`") && inline.endsWith("`")) {
                return (
                  <code key={j} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-mono text-[12px] border border-blue-100">
                    {inline.slice(1, -1)}
                  </code>
                );
              }
              return inline;
            })}
          </p>
        );
      })}
    </div>
  );
};

export default SmartHighlight;