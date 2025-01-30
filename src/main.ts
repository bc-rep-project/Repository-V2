import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { generateDiagram } from './generate-diagram';
import { processDirectory } from './process-directory';
import { pushChanges } from './git-utils';
import { uploadArtifact } from '@actions/artifact';

async function run() {
  try {
    const outputFile = core.getInput('output_file');
    const excludedPaths = core.getInput('excluded_paths').split(',');
    const excludedGlobs = core.getInput('excluded_globs').split(';').filter(Boolean);
    const rootPath = core.getInput('root_path') || '.';
    const maxDepth = parseInt(core.getInput('max_depth'));
    const shouldPush = core.getBooleanInput('should_push');
    const commitMessage = core.getInput('commit_message');
    const branch = core.getInput('branch');
    const artifactName = core.getInput('artifact_name');
    const fileColors = JSON.parse(core.getInput('file_colors'));

    // Process directory structure
    const tree = processDirectory(rootPath, {
      excludedPaths,
      excludedGlobs,
      maxDepth,
      currentDepth: 0
    });

    // Generate SVG
    const svgContent = generateDiagram(tree, { fileColors });
    core.setOutput('svg', svgContent);
    
    // Write to file
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, svgContent);

    // Handle artifact
    if (artifactName) {
      await uploadArtifact(artifactName, [outputFile], path.dirname(outputFile));
    }

    // Handle push
    if (shouldPush) {
      await pushChanges(outputFile, commitMessage, branch);
    }

  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run(); 