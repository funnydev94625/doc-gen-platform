declare module 'react-draft-wysiwyg' {
  import { Component, ReactNode } from 'react';
  import { EditorState, ContentState, ContentBlock } from 'draft-js';

  export interface EditorProps {
    editorState?: EditorState;
    onEditorStateChange?: (editorState: EditorState) => void;
    onContentStateChange?: (contentState: ContentState) => void;
    defaultEditorState?: EditorState;
    defaultContentState?: ContentState;
    toolbarClassName?: string;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbar?: {
      options?: string[];
      inline?: {
        inDropdown?: boolean;
        options?: string[];
        bold?: { icon?: ReactNode; className?: string };
        italic?: { icon?: ReactNode; className?: string };
        underline?: { icon?: ReactNode; className?: string };
        strikethrough?: { icon?: ReactNode; className?: string };
        monospace?: { icon?: ReactNode; className?: string };
        superscript?: { icon?: ReactNode; className?: string };
        subscript?: { icon?: ReactNode; className?: string };
      };
      blockType?: {
        inDropdown?: boolean;
        options?: string[];
        className?: string;
        dropdownClassName?: string;
      };
      fontSize?: {
        options?: string[];
        className?: string;
        dropdownClassName?: string;
      };
      fontFamily?: {
        options?: string[];
        className?: string;
        dropdownClassName?: string;
      };
      list?: {
        inDropdown?: boolean;
        className?: string;
        options?: string[];
        unordered?: { icon?: ReactNode; className?: string };
        ordered?: { icon?: ReactNode; className?: string };
        indent?: { icon?: ReactNode; className?: string };
        outdent?: { icon?: ReactNode; className?: string };
      };
      textAlign?: {
        inDropdown?: boolean;
        className?: string;
        options?: string[];
        left?: { icon?: ReactNode; className?: string };
        center?: { icon?: ReactNode; className?: string };
        right?: { icon?: ReactNode; className?: string };
        justify?: { icon?: ReactNode; className?: string };
      };
      colorPicker?: {
        className?: string;
        popupClassName?: string;
        colors?: string[];
      };
      link?: {
        inDropdown?: boolean;
        className?: string;
        popupClassName?: string;
        showOpenOptionOnHover?: boolean;
        defaultTargetOption?: string;
        options?: string[];
        link?: { icon?: ReactNode; className?: string };
        unlink?: { icon?: ReactNode; className?: string };
      };
      emoji?: {
        className?: string;
        popupClassName?: string;
        emojis?: string[];
      };
      embedded?: {
        className?: string;
        popupClassName?: string;
        defaultSize?: {
          height: string;
          width: string;
        };
        inDropdown?: boolean;
      };
      image?: {
        className?: string;
        popupClassName?: string;
        urlEnabled?: boolean;
        uploadEnabled?: boolean;
        alignmentEnabled?: boolean;
        uploadCallback?: (file: File) => Promise<{ data: { link: string } }>;
        previewImage?: boolean;
        inputAccept?: string;
        alt?: { present?: boolean; mandatory?: boolean };
        defaultSize?: {
          height: string;
          width: string;
        };
        inDropdown?: boolean;
      };
      remove?: { className?: string; inDropdown?: boolean };
      history?: {
        inDropdown?: boolean;
        className?: string;
        options?: string[];
        undo?: { icon?: ReactNode; className?: string };
        redo?: { icon?: ReactNode; className?: string };
      };
    };
    placeholder?: string;
    hashtag?: {
      separator?: string;
      trigger?: string;
    };
    mention?: {
      separator?: string;
      trigger?: string;
      suggestions?: any[];
      suggestionsPortalHost?: Element;
    };
    textAlignment?: 'left' | 'right' | 'center';
    readOnly?: boolean;
    tabIndex?: number;
    spellCheck?: boolean;
    stripPastedStyles?: boolean;
    ariaLabel?: string;
    ariaOwneeID?: string;
    ariaActiveDescendantID?: string;
    ariaAutoComplete?: string;
    ariaExpanded?: boolean;
    ariaHasPopup?: boolean;
    customBlockRenderFunc?: (block: ContentBlock) => any;
    wrapperId?: number;
    customDecorators?: any[];
    editorRef?: (ref: any) => void;
    handlePastedText?: (text: string, html: string, editorState: EditorState) => boolean;
    handleReturn?: (event: React.KeyboardEvent, editorState: EditorState) => boolean;
    handleKeyCommand?: (command: string, editorState: EditorState) => boolean;
    customStyleMap?: object;
    localization?: {
      locale?: string;
      translations?: object;
    };
  }

  export class Editor extends Component<EditorProps> {}
}