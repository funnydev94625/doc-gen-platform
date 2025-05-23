"use client"

import React, { useState, useEffect, useCallback, memo } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export interface PolicyEditorProps {
  /** Initial HTML content for the editor */
  initialContent?: string
  /** Callback function triggered when content changes */
  onChange: (content: string) => void
  /** Placeholder text when editor is empty */
  placeholder?: string
  /** Whether the editor is in read-only mode */
  readOnly?: boolean
  /** Additional CSS class names */
  className?: string
  /** Minimum height of the editor in pixels */
  minHeight?: number
  /** Whether to show the toolbar */
  showToolbar?: boolean
}

/**
 * Rich text editor component for policy content
 * Uses Draft.js and react-draft-wysiwyg for WYSIWYG editing
 */
const PolicyEditor: React.FC<PolicyEditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'Enter policy content here...',
  readOnly = false,
  className = '',
  minHeight = 300,
  showToolbar = true
}) => {
  // Initialize editor state from HTML content if provided
  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (initialContent) {
      try {
        const contentBlock = htmlToDraft(initialContent)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          return EditorState.createWithContent(contentState)
        }
      } catch (error) {
        console.error('Error converting HTML to Draft.js content:', error)
      }
    }
    return EditorState.createEmpty()
  })

  // Update editor state when initialContent changes and editor is empty
  useEffect(() => {
    if (initialContent && !editorState.getCurrentContent().hasText()) {
      try {
        const contentBlock = htmlToDraft(initialContent)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          setEditorState(EditorState.createWithContent(contentState))
        }
      } catch (error) {
        console.error('Error updating editor with new HTML content:', error)
      }
    }
  }, [initialContent, editorState])

  // Handle editor state changes
  const onEditorStateChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState)

    try {
      const contentState = newEditorState.getCurrentContent()
      const rawContentState = convertToRaw(contentState)
      const htmlContent = draftToHtml(rawContentState)

      onChange(htmlContent)
    } catch (error) {
      console.error('Error converting editor content to HTML:', error)
    }
  }, [onChange])

  // Toolbar configuration
  const toolbar = {
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
      options: ['8', '9', '10', '11', '12', '14', '16', '18', '24', '30', '36', '48']
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
  }

  return (
    <div
      className={`border rounded-md ${className}`}
      data-testid="policy-editor"
      aria-label="Policy content editor"
    >
      {showToolbar ? (
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          wrapperClassName="w-full"
          editorClassName={`px-4 py-2 min-h-[${minHeight}px]`}
          placeholder={placeholder}
          readOnly={readOnly}
          toolbar={toolbar}
          stripPastedStyles={false}
          toolbarClassName="border-b sticky top-0 z-10 bg-white"
        />
      ) : (
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          wrapperClassName="w-full"
          editorClassName={`px-4 py-2 min-h-[${minHeight}px]`}
          placeholder={placeholder}
          readOnly={readOnly}
          toolbar={{}}
          stripPastedStyles={false}
        />
      )}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(PolicyEditor)
0