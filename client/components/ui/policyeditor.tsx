"use client"

import React, { useState, useEffect } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

interface PolicyEditorProps {
  initialContent?: string
  onChange: (content: string) => void
  placeholder?: string
  readOnly?: boolean
}

const PolicyEditor: React.FC<PolicyEditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'Enter policy content here...',
  readOnly = false
}) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      const contentBlock = htmlToDraft(initialContent)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        return EditorState.createWithContent(contentState)
      }
    }
    return EditorState.createEmpty()
  })

  useEffect(() => {
    if (initialContent && !editorState.getCurrentContent().hasText()) {
      const contentBlock = htmlToDraft(initialContent)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        setEditorState(EditorState.createWithContent(contentState))
      }
    }
  }, [initialContent, editorState])

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState)

    const contentState = newEditorState.getCurrentContent()
    const rawContentState = convertToRaw(contentState)
    const htmlContent = draftToHtml(rawContentState)

    onChange(htmlContent)
  }

  return (
    <div className="border rounded-md">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="w-full"
        editorClassName="px-4 py-2 min-h-[300px]"
        placeholder={placeholder}
        readOnly={readOnly}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'embedded', 'image', 'history'],
          inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace']
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']
          },
          fontSize: {
            options: ['8', '9', '10', '11', '12', '14', '16', '18', '24', '30', '36', '48', '60', '72', '96']
          },
          list: {
            inDropdown: false,
            options: ['unordered', 'ordered', 'indent', 'outdent']
          },
          textAlign: {
            inDropdown: false,
            options: ['left', 'center', 'right', 'justify']
          },
          link: {
            inDropdown: false,
            options: ['link', 'unlink']
          },
          image: {
            urlEnabled: true,
            uploadEnabled: false,
            alignmentEnabled: true,
            previewImage: true,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: { present: true, mandatory: false }
          },
          embedded: {
            defaultSize: {
              height: '315',
              width: '560'
            }
          }
        }}
      />
    </div>
  )
}

export default PolicyEditor