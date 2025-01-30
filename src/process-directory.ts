import * as fs from 'fs';
import * as path from 'path';
import micromatch from 'micromatch';

interface ProcessOptions {
  excludedPaths: string[];
  excludedGlobs: string[];
  maxDepth: number;
  currentDepth: number;
}

export interface TreeNode {
  name: string;
  children?: TreeNode[];
  type: 'file' | 'directory';
}

export function processDirectory(currentPath: string, options: ProcessOptions): TreeNode {
  const name = path.basename(currentPath);
  const stats = fs.statSync(currentPath);

  if (stats.isDirectory()) {
    if (options.currentDepth >= options.maxDepth) {
      return { name, type: 'directory' };
    }

    const children = fs.readdirSync(currentPath)
      .filter(child => {
        const childPath = path.join(currentPath, child);
        const relativePath = path.relative(process.cwd(), childPath);
        
        return !options.excludedPaths.includes(child) &&
               !micromatch.isMatch(relativePath, options.excludedGlobs);
      })
      .map(child => {
        const childPath = path.join(currentPath, child);
        return processDirectory(childPath, {
          ...options,
          currentDepth: options.currentDepth + 1
        });
      });

    return {
      name,
      type: 'directory',
      children: children.length > 0 ? children : undefined
    };
  }

  return { name, type: 'file' };
} 