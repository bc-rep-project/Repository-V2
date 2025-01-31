export const isImportNode = (node) => 
  node.type === 'ImportDeclaration' && node.source?.type === 'StringLiteral';

export const isRequireCall = (node) =>
  node.type === 'CallExpression' &&
  node.callee.name === 'require' &&
  node.arguments[0]?.type === 'StringLiteral'; 