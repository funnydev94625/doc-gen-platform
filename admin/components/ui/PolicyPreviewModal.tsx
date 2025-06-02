'use client'

import { useEffect, useRef } from 'react'
import WebViewer from '@pdftron/webviewer'
import { X } from 'lucide-react'

interface PolicyPreviewModalProps {
  fileName: string
  onClose: () => void
}

const PolicyPreviewModal = ({ fileName, onClose }: PolicyPreviewModalProps) => {
  const viewer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (viewer.current) {
      WebViewer(
        {
          path: '/webviewer/lib',
          initialDoc: process.env.NEXT_PUBLIC_API_URL + '/api/templates/policy/' + fileName,
        },
        viewer.current
      ).then((instance) => {
        // You can customize the viewer here if needed
        
      })
    }
  }, [fileName])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90vw] h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="w-full h-full" ref={viewer}></div>
      </div>
    </div>
  )
}

export default PolicyPreviewModal 