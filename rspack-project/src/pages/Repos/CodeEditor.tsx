// src/components/Repos/CodeEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import useRepoData from './hooks/useRepoData';
import * as monaco from 'monaco-editor';
import { DiffLine } from './Git/types';

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

    // 清除现有的装饰器
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      [],
    );

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

    // 应用新的装饰器
    decorationsRef.current = editorRef.current.deltaDecorations(
      [],
      decorations,
    );
  };
  console.log('CodeEditor render:', selectedFile); // 添加这行
  const [language, setLanguage] = useState('plaintext');
  useEffect(() => {
    // 当 selectedFile 改变时，更新编辑器的内容和高亮
    if (editorRef.current && selectedFile) {
      editorRef.current.setValue(selectedFile.content || '');
      if (selectedFile.diffLines) {
        applyDiffDecorations(selectedFile.diffLines);
      }
      //根据文件类型设置语言
      const fileExtension = selectedFile.key.split('.').pop()?.toLowerCase();
      if (
        fileExtension === 'js' ||
        fileExtension === 'jsx' ||
        fileExtension === 'ts' ||
        fileExtension === 'tsx'
      ) {
        // language = 'javascript';
        setLanguage('javascript');
      } else if (fileExtension === 'html') {
        setLanguage('html');
      } else if (fileExtension === 'css') {
        setLanguage('css');
      } else if (fileExtension === 'json') {
        setLanguage('json');
      } else if (fileExtension === 'md') {
        setLanguage('markdown');
      } else if (fileExtension === 'c' || fileExtension === 'cpp') {
        setLanguage('cpp');
      }
    }
  }, [selectedFile]);

  return (
    <Editor
      // height=""
      className="w-svh"
      theme="vs-light"
      language={language} // 根据文件类型设置语言
      options={{
        // 基础设置
        minimap: { enabled: false },
        readOnly: false,
        automaticLayout: true,

        // 编辑器外观
        fontSize: 14,
        lineHeight: 1.5,
        fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",

        // 编辑器功能
        folding: true,
        foldingHighlight: true,
        showFoldingControls: 'always',

        // 智能提示和自动完成
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,

        // 滚动设置
        smoothScrolling: true,
        scrollBeyondLastLine: false,

        // 其他功能
        wordWrap: 'on',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
      }}
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
