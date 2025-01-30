interface TreeNode {
  name: string;
  children?: TreeNode[];
  type: 'file' | 'directory';
}

export function generateDiagram(tree: TreeNode, options: { fileColors: Record<string, string> }) {
  const defaultColors: Record<string, string> = {
    ts: '#3178c6',
    js: '#f1e05a',
    json: '#565656',
    md: '#2b7489',
    svg: '#ffb13b',
  };
  const colors = { ...defaultColors, ...options.fileColors };

  const renderNode = (node: TreeNode, depth: number): string => {
    const indent = ' '.repeat(depth * 2);
    const color = node.type === 'directory' ? '#6c8ebf' : colors[node.name.split('.').pop() || ''] || '#666';
    
    let output = `${indent}<g transform="translate(0, ${depth * 30})">\n`;
    output += `${indent}  <rect width="200" height="20" fill="${color}" rx="3" />\n`;
    output += `${indent}  <text x="5" y="15" fill="#fff" font-family="Arial" font-size="12">${node.name}</text>\n`;
    output += `${indent}</g>\n`;

    if (node.children) {
      node.children.forEach(child => {
        output += renderNode(child, depth + 1);
      });
    }
    return output;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100%" height="${countNodes(tree) * 30}" viewBox="0 0 250 ${countNodes(tree) * 30}" xmlns="http://www.w3.org/2000/svg">
${renderNode(tree, 0)}
</svg>`;
}

function countNodes(node: TreeNode): number {
  let count = 1;
  if (node.children) {
    node.children.forEach(child => {
      count += countNodes(child);
    });
  }
  return count;
} 