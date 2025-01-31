import * as d3 from 'd3';

const BASE_NODE_SIZE = 1;

export function createHierarchy(data) {
  return d3.hierarchy(data)
    .sum(d => d.size || BASE_NODE_SIZE)
    .sort((a, b) => (b.value || 0) - (a.value || 0));
}

export function createPackLayout({ width, height, padding = 2 }) {
  return d3.pack()
    .size([width, height])
    .padding(padding);
}

export function calculateDynamicPadding(nodeCount) {
  if (nodeCount > 200) return 0.5;
  if (nodeCount > 50) return 1;
  if (nodeCount > 20) return 2;
  return 3;
} 