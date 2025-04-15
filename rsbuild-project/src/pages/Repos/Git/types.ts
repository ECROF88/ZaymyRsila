export interface GitCommit {
  id: string;
  author: string;
  message: string;
  time: number;
}

export interface CommitInfo {
  author: string;
  id: string;
  message: string;
  time: number;
}

export interface CommitFileChange {
  diff: string;
  path: string;
  status: string;
}

export interface CommitDetail {
  commit_info: CommitInfo;
  file_changes: CommitFileChange[];
}

export interface DiffContent {
  diff?: string;
  files?: string[];
  commit_info?: CommitInfo;
  file_changes?: CommitFileChange[];
}

export interface ParsedDiff {
  content: string;
  lines: DiffLine[];
}

export interface DiffLine {
  content: string;
  type: 'add' | 'delete' | 'context';
  lineNumber: number;
}
