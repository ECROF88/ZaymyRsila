// src/components/Repos/CodeEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import useRepoData from './hooks/useRepoData';
import * as monaco from 'monaco-editor';
import { DiffLine } from './Git/types';
import { getLanguageByExtension } from '../../utils/tool';
// const getLanguageByExtension = (fileKey: string): string => {
//   const extension = fileKey.split('.').pop()?.toLowerCase();
//   const mapping: Record<string, string> = {
//     js: 'javascript',
//     jsx: 'javascript',
//     ts: 'javascript',
//     tsx: 'javascript',
//     html: 'html',
//     css: 'css',
//     json: 'json',
//     md: 'markdown',
//     c: 'cpp',
//     cpp: 'cpp',
//   };
//   return mapping[extension || ''] || 'plaintext';
// };

const CodeEditor: React.FC = () => {
  const { selectedFile } = useRepoData();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;

    // 如果有差异信息，立即应用高亮
    if (selectedFile?.diffLines) {
      applyDiffDecorations(selectedFile.diffLines);
    }
  }

  // 应用差异高亮
  const applyDiffDecorations = (diffLines: DiffLine[]) => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    if (decorationsRef.current.length) {
      /// oldDecorations: string[], newDecorations: IModelDeltaDecoration[]
      model.deltaDecorations(decorationsRef.current, []);
    }
    // 创建新的装饰器
    const decorations = diffLines.map((line) => ({
      range: new monaco.Range(line.lineNumber, 1, line.lineNumber, 1),
      options: {
        isWholeLine: true,
        className:
          line.type === 'add'
            ? 'bg-green-100'
            : line.type === 'delete'
              ? 'bg-red-100'
              : '',
      },
    }));

    decorationsRef.current = model.deltaDecorations([], decorations);
  };
  // console.log('CodeEditor render:', selectedFile); // 添加这行
  const [language, setLanguage] = useState('plaintext');
  useEffect(() => {
    // 当 selectedFile 改变时，更新编辑器的内容和高亮
    if (editorRef.current && selectedFile) {
      editorRef.current.setValue(selectedFile.content || '');
      if (selectedFile.diffLines) {
        applyDiffDecorations(selectedFile.diffLines);
      }
      setLanguage(getLanguageByExtension(selectedFile.key));
    }
  }, [selectedFile]);
  const editorOptions = React.useMemo(
    () => ({
      minimap: { enabled: false },
      readOnly: false,
      automaticLayout: true,
      fontSize: 14,
      lineHeight: 1.5,
      folding: true,
      foldingHighlight: true,
      showFoldingControls: 'always' as const,
      smoothScrolling: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on' as const,
      lineNumbers: 'on' as const,
      renderWhitespace: 'selection' as const,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      renderValidationDecorations: 'off' as const,
    }),
    [],
  );
  return (
    <Editor
      className="w-fit h-[50svh]"
      theme="vs-light"
      language={language}
      options={editorOptions}
      onMount={handleEditorDidMount}
      value={selectedFile?.content || ''}
      onChange={(value) => {
        // 可以添加保存功能
        console.log('content changed:', value);
      }}
    />
  );
};

export default CodeEditor;
