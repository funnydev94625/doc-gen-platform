import React, { useRef } from 'react';
import dynamic from "next/dynamic";
import SunEditorCore from 'suneditor/src/lib/core';
import 'suneditor/dist/css/suneditor.min.css';
import { buttonList } from 'suneditor-react';

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const getWordAtCaret = () => {
  let sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return '';
  let range = sel.getRangeAt(0);
  let node = range.startContainer;
  let offset = range.startOffset;

  if (node.nodeType !== Node.TEXT_NODE) return '';

  const text = node.textContent || '';
  let start = offset, end = offset;

  // Split by space
  while (start > 0 && text[start - 1] !== ' ') start--;
  while (end < text.length && text[end] !== ' ') end++;

  return text.slice(start, end).trim();
};

const RichTextEditor = (props: any) => {
  const { setSelected } = props;

  const handleClick = () => {
    const word = getWordAtCaret();
    if (word) {
      setSelected(word);
      console.log("Focused word:", word);
    }
  };

  return (
    <div>
      <SunEditor
        setOptions={{
          height: 900,
          buttonList: buttonList.complex
        }}
        onClick={handleClick}
      />
    </div>
  );
};
export default RichTextEditor;