"use client"

import React, { useState } from "react"
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3, Link as LinkIcon, Image, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (value: string) => void
  preview?: boolean
}

export function RichTextEditor({ 
  className, 
  value, 
  onChange, 
  preview = true,
  ...props 
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("edit")
  
  const insertFormat = (format: string) => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    let replacement = ""
    
    switch (format) {
      case "bold":
        replacement = `**${selectedText}**`
        break
      case "italic":
        replacement = `*${selectedText}*`
        break
      case "h1":
        replacement = `# ${selectedText}`
        break
      case "h2":
        replacement = `## ${selectedText}`
        break
      case "h3":
        replacement = `### ${selectedText}`
        break
      case "ul":
        replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n')
        break
      case "ol":
        replacement = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
        break
      case "link":
        replacement = `[${selectedText}](url)`
        break
      case "image":
        replacement = `![${selectedText}](url)`
        break
      case "code":
        replacement = `\`\`\`\n${selectedText}\n\`\`\``
        break
      default:
        replacement = selectedText
    }
    
    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + replacement.length,
        start + replacement.length
      )
    }, 0)
  }
  
  const renderMarkdown = (text: string) => {
    // Very simple markdown rendering for preview
    // In a real app, you'd use a proper markdown library
    let html = text
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<li>(.+)<\/li>/g, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul>/g, '')
      // Links and images
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Line breaks
      .replace(/\n/g, '<br />')
    
    return html
  }
  
  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex items-center gap-1 p-1 border-b bg-muted/50">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("bold")}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("italic")}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <span className="w-px h-6 bg-border mx-1" />
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("h1")}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
          <span className="sr-only">Heading 1</span>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("h2")}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
          <span className="sr-only">Heading 2</span>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("h3")}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
          <span className="sr-only">Heading 3</span>
        </Button>
        <span className="w-px h-6 bg-border mx-1" />
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("ul")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("ol")}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <span className="w-px h-6 bg-border mx-1" />
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("link")}
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
          <span className="sr-only">Link</span>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("image")}
          className="h-8 w-8 p-0"
        >
          <Image className="h-4 w-4" />
          <span className="sr-only">Image</span>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => insertFormat("code")}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
          <span className="sr-only">Code Block</span>
        </Button>
      </div>
      
      {preview ? (
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <TabsList className="grid w-40 grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="edit" className="p-0 border-0">
            <Textarea
              id="editor"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
              {...props}
            />
          </TabsContent>
          <TabsContent value="preview" className="p-4 border-0">
            <div 
              className="prose prose-sm max-w-none min-h-[300px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Textarea
          id="editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[300px] font-mono text-sm border-0 rounded-t-none focus-visible:ring-0"
          {...props}
        />
      )}
    </div>
  )
}