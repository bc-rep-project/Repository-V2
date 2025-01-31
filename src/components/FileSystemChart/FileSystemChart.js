import React, { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import './FileSystemChart.css';
import { createHierarchy, createPackLayout } from '../../utils/layoutUtils';
import { getFileType } from '../../utils/fileTypeUtils';

const FileSystemChart = ({ data, onNodeSelect }) => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  
  const colorScale = d3.scaleOrdinal()
    .domain(['js', 'css', 'json', 'md', 'folder', 'other'])
    .range(['#4e79a7', '#59a14f', '#edc948', '#b07aa1', '#aec7e8', '#9c755f']);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const container = d3.select(chartRef.current);
    container.selectAll('*').remove();

    const width = 1200;
    const height = 800;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    tooltipRef.current = container.append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0);

    const root = createHierarchy(data);
    const packLayout = createPackLayout({
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
      padding: 3
    });

    packLayout(root);

    const nodes = svg.selectAll('g')
      .data(root.descendants().filter(d => d.depth > 0))
      .enter().append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    nodes.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => colorScale(getFileType(d.data.name)))
      .attr('class', 'chart-node')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 2);
        tooltipRef.current
          .html(`<div>${d.data.name}</div><div>Size: ${d.data.size} bytes</div>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`)
          .transition().style('opacity', 0.9);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 0.5);
        tooltipRef.current.transition().style('opacity', 0);
      })
      .on('click', (event, d) => {
        onNodeSelect?.(d.data);
      });

    nodes.filter(d => d.r > 20)
      .append('text')
      .attr('dy', '0.3em')
      .style('font-size', d => `${Math.max(10, d.r / 5)}px`)
      .style('pointer-events', 'none')
      .text(d => d.data.name);

  }, [data, colorScale, onNodeSelect]);

  return <div className="file-system-chart" ref={chartRef} />;
};

export default FileSystemChart; 