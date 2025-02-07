import { DiffLine, ParsedDiff } from './types';

export function parseDiff(diffContent: string): ParsedDiff {
    // 按行分割
    const lines = diffContent.split('\n');

    // 提取实际的代码变更部分
    const diffLines: DiffLine[] = [];
    let isCode = false;
    let lineNumber = 1;

    for (const line of lines) {
        // 跳过diff头部信息
        if (line.startsWith('diff --git') ||
            line.startsWith('index') ||
            line.startsWith('---') ||
            line.startsWith('+++')) {
            continue;
        }

        // 处理变更的代码行
        if (line.startsWith('+')) {
            isCode = true;
            // 添加的行
            diffLines.push({
                content: line.substring(1),
                type: 'add',
                lineNumber: lineNumber++
            });
        } else if (line.startsWith('-')) {
            isCode = true;
            // 删除的行
            diffLines.push({
                content: line.substring(1),
                type: 'delete',
                lineNumber: lineNumber++
            });
        } else if (line.startsWith('@@ ')) {
            // @@ 行格式：@@ -start,length +start,length @@ code
            const codeStartIndex = line.indexOf('@@', 3);
            if (codeStartIndex !== -1) {
                const code = line.substring(codeStartIndex + 3).trim();
                if (code) {
                    diffLines.push({
                        content: code,
                        type: 'context',
                        lineNumber: lineNumber++
                    });
                }
            }
            isCode = true;
        } else if (isCode && line.startsWith(' ')) {
            // 上下文代码行
            diffLines.push({
                content: line.substring(1),
                type: 'context',
                lineNumber: lineNumber++
            });
        }
    }

    // 返回解析结果
    return {
        content: diffLines.map(line => line.content).join('\n'),
        lines: diffLines
    };
}
