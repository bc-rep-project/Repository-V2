import fs from 'fs/promises';
import path from 'path';

const DEFAULT_FILE_TYPES = {
  js: ['js', 'jsx'],
  css: ['css', 'scss'],
  json: ['json'],
  md: ['md'],
  folder: ['folder']
};

export async function crawlFileSystem(dirPath, config = {}) {
  const { fileTypes = DEFAULT_FILE_TYPES } = config;
  
  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) return null;

    const node = {
      name: path.basename(dirPath),
      path: dirPath,
      type: 'folder',
      size: 0,
      children: []
    };

    const entries = await fs.readdir(dirPath);
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      try {
        const entryStats = await fs.stat(entryPath);
        
        if (entryStats.isDirectory()) {
          const child = await crawlFileSystem(entryPath, config);
          if (child) node.children.push(child);
        } else {
          const ext = path.extname(entry).slice(1).toLowerCase();
          const type = Object.entries(fileTypes).find(([_, exts]) => 
            exts.includes(ext))?.[0] || 'other';
          
          node.children.push({
            name: entry,
            path: entryPath,
            type,
            size: entryStats.size,
            children: null
          });
        }
      } catch (error) {
        console.warn(`Skipping ${entryPath}: ${error.message}`);
      }
    }

    node.size = node.children.reduce((sum, child) => sum + (child.size || 0), 0);
    return node;

  } catch (error) {
    console.error(`Crawling failed for ${dirPath}: ${error.message}`);
    return null;
  }
} 