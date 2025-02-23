function getLanguageByExtension(fileKey: string): string {
  const extension = fileKey.split('.').pop()?.toLowerCase()
  const mapping: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'javascript',
    tsx: 'javascript',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    c: 'cpp',
    cpp: 'cpp',
  }
  return mapping[extension || ''] || 'plaintext'
}

export { getLanguageByExtension }
