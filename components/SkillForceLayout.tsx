'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

type Skill = {
  id: number;
  name: string;
  category: 'Dev' | 'Design' | 'Translation' | 'Soft' | 'Other';
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

const colorMap: Record<Skill['category'], string> = {
  Dev: '#444444',
  Design: '#6c91c2',
  Translation: '#945cc4',
  Soft: '#888888',
  Other: '#aaaaaa',
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
  { id: 12, name: 'Software Product Management', category: 'Other', radius: 75 },
];

export default function SkillForceLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width = containerRef.current?.clientWidth || 800;
    const height = 600;

    const simulation = d3.forceSimulation<Skill>(skills)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(2))
      .force('collision', d3.forceCollide<Skill>().radius(d => d.radius + 6))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03))
      .alphaDecay(0.015);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const node = svg
      .selectAll<SVGGElement, Skill>('g')
      .data(skills)
      .join('g')
      .attr('class', 'transition-all duration-700')
      .call(d3.drag<SVGGElement, Skill>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.2).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => colorMap[d.category])
      .attr('class', 'shadow-md transition-transform duration-1000 ease-in-out')
      .style('animation', () => `float ${4 + Math.random() * 3}s ease-in-out infinite`);

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .selectAll('tspan')
      .data(d => d.name.split(' '))
      .join('tspan')
      .attr('x', 0)
      .attr('dy', (_d, i) => `${i === 0 ? 0 : 1.2}em`)
      .text(d => d);

    simulation.on('tick', () => {
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[650px] overflow-visible">
      <svg ref={svgRef} width="100%" height="100%">
        <style>
          {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          `}
        </style>
      </svg>
    </div>
  );
}
