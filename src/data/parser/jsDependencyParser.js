import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs/promises';

const DEFAULT_PARSER_OPTIONS = {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
  allowImportExportEverywhere: true
};

export async function parseJsDependencies(filePath, options = {}) {
  const parserOptions = { ...DEFAULT_PARSER_OPTIONS, ...options };
  
  try {
    const code = await fs.readFile(filePath, 'utf-8');
    const ast = parse(code, parserOptions);
    const dependencies = new Set();

    traverse(ast, {
      ImportDeclaration({ node }) {
        if (node.source?.value) dependencies.add(node.source.value);
      },
      CallExpression({ node }) {
        if (node.callee.name === 'require' && 
            node.arguments[0]?.type === 'StringLiteral') {
          dependencies.add(node.arguments[0].value);
        }
      }
    });

    return Array.from(dependencies);
  } catch (error) {
    console.error(`Dependency parsing failed for ${filePath}: ${error.message}`);
    return [];
  }
} 