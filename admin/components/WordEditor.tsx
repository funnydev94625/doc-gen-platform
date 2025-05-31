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
  const initialized = useRef(false); // <-- Add this flag
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import('@pdftron/webviewer').then((module) => {
      const WebViewer = module.default;
      WebViewer(
        {
          path: '/lib/webviewer',
          licenseKey: 'demo:1748336846193:61fad2730300000000825649634c3e0ab95bf311b9b73e3eafbfaa95c3',
          enableOfficeEditing: true
        },
        viewer.current,
      ).then((instance: WebViewerInstance) => {
        instanceRef.current = instance;

        if (instance?.Core?.documentViewer) {
          const { documentViewer, annotationManager, Annotations } = instance.Core;

          documentViewer.addEventListener('textSelected', (quads, selectedText, pageNumber) => {
            if (selectedText.length > 0 && regexStrict.test(selectedText.trim())) {
              setSelected(selectedText.trim())
            }
          });

          documentViewer.addEventListener("mouseLeftDown", () => {
            setSelected("")
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
              });
            }
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    console.log(fileUrl)
    if (!fileUrl || !instanceRef.current?.UI) return;
    instanceRef.current.UI.loadDocument(process.env.NEXT_PUBLIC_API_URL + '/api/templates/policy/' + fileUrl, {
      filename: fileUrl.split('/').pop(),
      enableOfficeEditing: true
    });
  }, [fileUrl]);

  // Store the latest file name (if you want to use the real name)

  // If you use a file dialog, setFileName(file.name) when you setFileUrl(url)
  // Example in parent: setFileUrl(url); setFileName(file.name);

  // Stable handler
  const handleOfficeEditor = useCallback(() => {
    const docType = instanceRef.current?.Core?.documentViewer?.getDocument()?.getType?.();
    // Only open Office Editor if the document is Office type
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

  // useEffect(() => {
  //   instance
  // }, [file, fileName, handleOfficeEditor]);

  // Expose getEditedDocx method to parent
  useImperativeHandle(ref, () => ({
    async getEditedDocx() {
      if (!instanceRef.current) return null;
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

