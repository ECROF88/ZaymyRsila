// src/components/Repos/CodeEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import useRepoData from './hooks/useRepoData';

const CodeEditor: React.FC = () => {
  const { selectedFile } = useRepoData();
  const editorRef = useRef<any>(null); // 使用 useRef 保存 editor 实例

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor; // 保存 editor 实例
  }
  console.log('CodeEditor render:', selectedFile); // 添加这行
  const [language, setLanguage] = useState('plaintext');
  useEffect(() => {
    console.log('CodeEditor useEffect:', selectedFile); // 添加这行
    // 当 selectedFile 改变时，更新编辑器的内容
    if (editorRef.current && selectedFile) {
      editorRef.current.setValue(selectedFile.content || '');
      //根据文件类型设置语言
      const fileExtension = selectedFile.key.split('.').pop()?.toLowerCase();
      // let language = 'plaintext'; // 默认语言
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
      // 可以根据需要添加更多文件类型和语言的映射
      // editorRef.current.getModel()?.setLanguage(language);
    }
  }, [selectedFile]);

  return (
    <Editor
      height="300px"
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
