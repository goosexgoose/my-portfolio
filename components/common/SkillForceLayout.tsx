'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

type Skill = d3.SimulationNodeDatum & {
  id: number;
  name: string;
  category: 'Dev' | 'Design' | 'Translation' | 'Soft' | 'Other';
  radius: number;
};

const colorMap: Record<Skill['category'], string> = {
  Dev: '#444',
  Design: '#6c91c2',
  Translation: '#945cc4',
  Soft: '#888',
  Other: '#aaa',
};

const skills: Skill[] = [
  { id: 1, name: 'Web Development', category: 'Dev', radius: 70 },
  { id: 2, name: 'Next.js', category: 'Dev', radius: 55 },
  { id: 3, name: 'iOS Development', category: 'Dev', radius: 65 },
  { id: 4, name: 'UI/UX Design', category: 'Design', radius: 80 },
  { id: 5, name: 'User Research', category: 'Design', radius: 60 },
  { id: 6, name: 'Game Localization', category: 'Translation', radius: 70 },
  { id: 7, name: 'Technical Translation', category: 'Translation', radius: 60 },
  { id: 8, name: 'Problem Solving', category: 'Soft', radius: 65 },
  { id: 9, name: 'Teamwork', category: 'Soft', radius: 60 },
  { id: 10, name: 'Presentation', category: 'Soft', radius: 60 },
  { id: 11, name: 'Photography', category: 'Other', radius: 60 },
  { id: 12, name: 'Software Product Management', category: 'Other', radius: 70 },
];

export default function SkillForceLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width = containerRef.current?.clientWidth || 800;
    const height = 600;

    const nodes = skills.map(d => ({
      ...d,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const simulation = d3.forceSimulation(nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(-5)) // 小斥力
      .force('collision', d3.forceCollide<Skill>().radius(d => d.radius + 12)) // 增加气泡之间的间距
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03))
      .alpha(0.8)
      .alphaDecay(0.01);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const node = svg.selectAll('g')
      .data(nodes)
      .enter()
      .append('g');

    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => colorMap[d.category])
      .attr('class', 'shadow-md');

    node.append('text')
      .selectAll('tspan')
      .data(d => d.name.split(' '))
      .enter()
      .append('tspan')
      .attr('x', 0)
      .attr('dy', (_, i, arr) => `${i === 0 ? '-0.3em' : '1.2em'}`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '11px')
      .attr('fill', 'white')
      .attr('font-weight', 600)
      .text(d => d);

    simulation.on('tick', () => {
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600px] overflow-visible">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
}
