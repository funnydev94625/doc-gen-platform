'use client';

import { WebViewerInstance } from '@pdftron/webviewer';
import { Ref, useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import React from "react";
import api from '@/lib/api';

// Define the custom ref type
export type PDFViewerRef = {
  getEditedDocx: () => Promise<Blob | null>;
};

type Element = {
  _id: string;
  template_id: string;
  type: number; // 0 for input, 1 for select
  question: string;
  placeholder: string;
  isDel: boolean;
  section_id?: string;
  answer_result?: Record<string, string> | string[]; // For select options
  answer_value?: string | string[]; // To store the user's answer
};

type PDFViewerProps = {
  fileUrl: string;
  policyId: string;
};

interface TextAnnotation {
  getType: () => string;
  getContents: () => string;
  setContents: (content: string) => void;
}

const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>(({ fileUrl, policyId }, ref) => {
  const viewer: Ref<HTMLDivElement | any> = useRef(null);
  const initialized = useRef(false);
  const instanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  const replacePlaceholders = useCallback(async (answers: Record<string, string | string[]>) => {
    if (!instanceRef.current?.Core?.documentViewer) {
      console.log('Document viewer not ready');
      return;
    }

    const { documentViewer, annotationManager } = instanceRef.current.Core;
    const doc = documentViewer.getDocument();
    
    if (!doc) {
      console.log('Document not loaded');
      return;
    }

    try {
      // Get all annotations using the annotationManager
      const annotations = annotationManager.getAnnotationsList();
      console.log('Found annotations:', annotations);

      annotations.forEach((annotation: TextAnnotation) => {
        if (annotation.getType() === 'text') {
          const text = annotation.getContents();
          console.log('Checking annotation text:', text);
          Object.entries(answers).forEach(([elementId, answer]) => {
            if (text === `{{${elementId}}}`) {
              console.log('Replacing placeholder:', text, 'with answer:', answer);
              annotation.setContents(typeof answer === 'string' ? answer : answer.join(', '));
            }
          });
        }
      });
    } catch (error) {
      console.error('Error replacing placeholders:', error);
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import('@pdftron/webviewer').then(async (module) => {
      const WebViewer = module.default;
      const answers = await api.get(`/api/answers/policy/${policyId}`);

      WebViewer(
        {
          path: '/lib/webviewer',
          licenseKey: 'demo:1748863910275:61f2e71b03000000004491aacff136979b9fe9117f5b47c5e90c1ce10f',
        },
        viewer.current,
      ).then((instance: WebViewerInstance) => {
        instanceRef.current = instance;
        setIsReady(true);

        if (instance?.Core?.documentViewer) {
          const { documentViewer } = instance.Core;

          // Add error handling for document loading
          documentViewer.addEventListener('documentError', (error) => {
            console.error('Document loading error:', error);
          });

          // Listen for document loaded event
          documentViewer.addEventListener('documentLoaded', () => {
            console.log('Document loaded, replacing placeholders');
            replacePlaceholders(answers.data);
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!fileUrl || !instanceRef.current?.UI || !isReady) return;
    
    instanceRef.current.UI.loadDocument(process.env.NEXT_PUBLIC_API_URL + '/api/templates/policy/' + fileUrl, {
      filename: fileUrl.split('/').pop(),
      enableOfficeEditing: true
    });
  }, [fileUrl, isReady]);

  useEffect(() => {
    if (!policyId || policyId.length < 1) return;
    
    api.get(`/api/answers/policy/${policyId}`)
      .then(res => {
        const newAnswers = res.data as Record<string, string | string[]>;
        console.log('New answers received:', newAnswers);
        replacePlaceholders(newAnswers);
      })
      .catch(err => {
        console.error('Error fetching answers:', err);
      });
  }, [policyId, replacePlaceholders]);

  return (
    <div className="w-full h-full" ref={viewer}></div>
  );
});

export default PDFViewer;

