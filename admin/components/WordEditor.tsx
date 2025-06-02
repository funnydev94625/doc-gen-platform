'use client';

import { WebViewerInstance } from '@pdftron/webviewer';
import { Ref, useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import React from "react";

// Define the custom ref type
export type WordEditorRef = {
  getEditedDocx: () => Promise<Blob | null>;
};

type WordEditorProps = {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  fileRef: React.RefObject<HTMLInputElement>;
  fileUrl: string;
};
const regexStrict = /^\{\{.*\}\}$/;
const WordEditor = forwardRef<WordEditorRef, WordEditorProps>(({ setSelected, fileRef, fileUrl }, ref) => {
  const viewer: Ref<HTMLDivElement | any> = useRef(null);
  const initialized = useRef(false);
  const instanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import('@pdftron/webviewer').then((module) => {
      const WebViewer = module.default;
      WebViewer(
        {
          path: '/lib/webviewer',
          licenseKey: 'demo:1748863910275:61f2e71b03000000004491aacff136979b9fe9117f5b47c5e90c1ce10f',
          enableOfficeEditing: true
        },
        viewer.current,
      ).then((instance: WebViewerInstance) => {
        instanceRef.current = instance;
        setIsReady(true);

        if (instance?.Core?.documentViewer) {
          const { documentViewer, annotationManager, Annotations } = instance.Core;

          documentViewer.addEventListener('textSelected', (quads, selectedText, pageNumber) => {
            if (selectedText?.length > 0 && regexStrict.test(selectedText.trim())) {
              setSelected(selectedText.trim())
            }
          });

          documentViewer.addEventListener("mouseLeftDown", () => {
            setSelected("")
          });

          // Add error handling for document loading
          documentViewer.addEventListener('documentError', (error) => {
            console.error('Document loading error:', error);
          });
        }

        const fileinput = fileRef.current;
        if (fileinput && instance?.UI) {
          fileinput.addEventListener('change', (e: any) => {
            const file = e.target.files[0];
            if (file && instance.UI) {
              instance.UI.loadDocument(file, {
                filename: file.name,
                enableOfficeEditing: true
              })
            }
          });
        }
      })
    })
  }, []);

  useEffect(() => {
    if (!fileUrl || !instanceRef.current?.UI || !isReady) return;
    
    instanceRef.current.UI.loadDocument(process.env.NEXT_PUBLIC_API_URL + '/api/templates/policy/' + fileUrl, {
      filename: fileUrl.split('/').pop(),
      enableOfficeEditing: true
    })
  }, [fileUrl, isReady]);

  const handleOfficeEditor = useCallback(() => {
    if (!instanceRef.current?.Core?.documentViewer) return;
    
    const docType = instanceRef.current.Core.documentViewer.getDocument()?.getType?.();
    if (
      instanceRef.current?.UI?.openOfficeEditor &&
      (docType === 'docx' || docType === 'office')
    ) {
      instanceRef.current.UI.openOfficeEditor();
    }
    if (instanceRef.current?.Core?.documentViewer) {
      instanceRef.current.Core.documentViewer.removeEventListener('documentLoaded', handleOfficeEditor);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    async getEditedDocx() {
      if (!instanceRef.current?.Core?.documentViewer) return null;
      const { documentViewer } = instanceRef.current.Core;
      const doc = await documentViewer.getDocument().getFileData({ fileType: 'docx' });
      return new Blob([doc], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    }
  }));

  return (
    <div className="w-full h-full" ref={viewer}></div>
  );
});

export default WordEditor;

