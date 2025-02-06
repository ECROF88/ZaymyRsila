// src/components/Repos/CodeEditor.tsx
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import useRepoData from './hooks/useRepoData';

const CodeEditor: React.FC = () => {
  const { selectedFile } = useRepoData();
  const editorRef = useRef<any>(null); // 使用 useRef 保存 editor 实例

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor; // 保存 editor 实例
  }
  console.log('CodeEditor render:', selectedFile); // 添加这行

  useEffect(() => {
    console.log('CodeEditor useEffect:', selectedFile); // 添加这行
    // 当 selectedFile 改变时，更新编辑器的内容
    if (editorRef.current && selectedFile) {
      editorRef.current.setValue(selectedFile.content || '');
      //根据文件类型设置语言
      const fileExtension = selectedFile.key.split('.').pop()?.toLowerCase();
      let language = 'plaintext'; // 默认语言
      if (
        fileExtension === 'js' ||
        fileExtension === 'jsx' ||
        fileExtension === 'ts' ||
        fileExtension === 'tsx'
      ) {
        language = 'javascript';
      } else if (fileExtension === 'html') {
        language = 'html';
      } else if (fileExtension === 'css') {
        language = 'css';
      } else if (fileExtension === 'json') {
        language = 'json';
      } else if (fileExtension === 'md') {
        language = 'markdown';
      } else if (fileExtension === 'c' || fileExtension === 'cpp') {
        language = 'cpp';
      }
      // 可以根据需要添加更多文件类型和语言的映射
      editorRef.current.getModel()?.setLanguage(language);
    }
  }, [selectedFile]);

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      options={{
        minimap: {
          enabled: false,
        },
        readOnly: false, // 允许编辑
        automaticLayout: true, //自动布局
      }}
      onMount={handleEditorDidMount}
      value={selectedFile?.content || ''}
    />
  );
};

export default CodeEditor;
