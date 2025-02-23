import type { FileTreeNode } from '@/utils/store'
import type { DataNode } from 'antd/es/tree'
import { FileOutlined, FolderOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
// src/components/Repos/FileTree.tsx
import React, { useEffect } from 'react'
import useRepoData from './hooks/useRepoData'

const FileTree: React.FC = () => {
  const { fileTree, selectedFile, setSelectedFile } = useRepoData()
  const { selectedRepo } = useRepoData()
  // 将 FileTreeNode[] 转换为 Ant Design Tree 组件需要的 DataNode[]
  const convertToTreeData = (nodes: FileTreeNode[]): DataNode[] => {
    return nodes.map(node => ({
      key: node.key,
      title: node.title,
      icon: node.type === 'directory' ? <FolderOutlined /> : <FileOutlined />,
      children: node.children ? convertToTreeData(node.children) : undefined,
    }))
  }
  useEffect(() => {
    if (selectedRepo) {
      console.log('文件数发现仓库变更:', selectedRepo)
    }
  }, [selectedRepo])

  const treeData = convertToTreeData(fileTree)

  // 修改 onSelect 函数
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    // 递归查找节点
    const findNode = (
      nodes: FileTreeNode[],
      key: string,
    ): FileTreeNode | null => {
      for (const node of nodes) {
        if (node.key === key)
          return node
        if (node.children) {
          const found = findNode(node.children, key)
          if (found)
            return found
        }
      }
      return null
    }

    const selectedNode = findNode(fileTree, selectedKeys[0]?.toString() || '')
    if (selectedNode?.type === 'file') {
      setSelectedFile(selectedNode)
      console.log('选择了新文件', selectedNode)
    }
  }

  return (
    <Tree
      showLine={true}
      showIcon={true}
      defaultExpandedKeys={['0-0-0']}
      onSelect={onSelect}
      selectedKeys={selectedFile ? [selectedFile.key] : []}
      treeData={treeData}
    />
  )
}

export default FileTree
