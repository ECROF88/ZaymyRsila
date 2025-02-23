export interface GitCommit {
  hash: string
  author: string
  date: string
  message: string
  changes: Array<{
    file: string
    insertions: number
    deletions: number
  }>
}

export interface DiffLine {
  content: string
  type: 'add' | 'delete' | 'context'
  lineNumber: number
}

export interface ParsedDiff {
  content: string
  lines: DiffLine[]
}

export interface DiffContent {
  diff: string
  files: string[]
}
