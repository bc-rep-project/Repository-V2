export function transformFileSystemData(rootNode, dependenciesMap = {}) {
  const nodes = [];
  const links = [];
  
  function processNode(node, parentId = null) {
    const id = nodes.length;
    const transformed = {
      id,
      name: node.name,
      path: node.path,
      type: node.type,
      size: node.size || 0,
      dependencies: dependenciesMap[node.path] || [],
      children: []
    };
    
    nodes.push(transformed);
    
    if (parentId !== null) {
      links.push({ source: parentId, target: id });
    }

    if (node.children) {
      transformed.children = node.children
        .filter(child => child !== null)
        .map(child => processNode(child, id).id);
    }
    
    return transformed;
  }

  processNode(rootNode);
  
  return { nodes, links };
} 