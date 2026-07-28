import { useMemo, useState } from "react";
import { Focus, RotateCcw } from "lucide-react";
import { buildPlan } from "../logic/recommendations";
import type { PathSegment, Protocol } from "../types";

interface PathwayCanvasProps {
  protocol: Protocol;
  selectedMuscleId: string | null;
  onSelectMuscle: (id: string) => void;
  onSelectNode: (nodeId: string) => void;
}

interface GraphNode extends PathSegment {
  layer: number;
  x: number;
  y: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

const layerFor = (segment: PathSegment, path: PathSegment[]) => {
  if (segment.kind === "root") return 0;
  if (segment.kind === "muscle") return 4;
  if (segment.kind === "nerve") return 3;
  const plexusSegments = path.filter((item) => item.kind === "plexus");
  const plexusIndex = plexusSegments.findIndex((item) => item.id === segment.id);
  return plexusSegments.length > 1 ? plexusIndex + 1 : 2;
};

const columnX = [74, 250, 434, 620, 815];
const graphHeight = 430;

export function PathwayCanvas({
  protocol,
  selectedMuscleId,
  onSelectMuscle,
  onSelectNode
}: PathwayCanvasProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const graph = useMemo(() => {
    const planned = buildPlan(protocol);
    const nodeMap = new Map<string, GraphNode>();
    const edgeMap = new Map<string, GraphEdge>();

    planned.forEach(({ muscle }) => {
      muscle.path.forEach((segment, index, path) => {
        const layer = layerFor(segment, path);
        const existing = nodeMap.get(segment.id);
        if (!existing) {
          nodeMap.set(segment.id, {
            ...segment,
            layer,
            x: columnX[layer],
            y: 0
          });
        }

        const next = path[index + 1];
        if (next) {
          const edgeId = `${segment.id}--${next.id}`;
          edgeMap.set(edgeId, {
            id: edgeId,
            source: segment.id,
            target: next.id
          });
        }
      });
    });

    const nodes = Array.from(nodeMap.values());
    for (let layer = 0; layer <= 4; layer += 1) {
      const layerNodes = nodes
        .filter((node) => node.layer === layer)
        .sort((a, b) => a.labelEn.localeCompare(b.labelEn));
      const gap = graphHeight / (layerNodes.length + 1);
      layerNodes.forEach((node, index) => {
        node.y = gap * (index + 1);
      });
    }

    return {
      nodes,
      edges: Array.from(edgeMap.values())
    };
  }, [protocol]);

  const selectedPath = useMemo(() => {
    const match = buildPlan(protocol).find(
      ({ muscle }) => muscle.id === selectedMuscleId
    );
    return new Set(match?.muscle.path.map((item) => item.id) ?? []);
  }, [protocol, selectedMuscleId]);

  const nodeById = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph.nodes]
  );

  const activeNeighborhood = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const active = new Set([hoveredNode]);
    graph.edges.forEach((edge) => {
      if (edge.source === hoveredNode || edge.target === hoveredNode) {
        active.add(edge.source);
        active.add(edge.target);
      }
    });
    return active;
  }, [graph.edges, hoveredNode]);

  return (
    <section className="pathway-panel" aria-labelledby="pathway-title">
      <div className="panel-heading">
        <div>
          <h2 id="pathway-title">神經路徑圖</h2>
          <p>點選節點可反向定位；點肌肉可查看進針與安全資訊。</p>
        </div>
        <div className="canvas-actions">
          <button className="icon-text-button" onClick={() => setHoveredNode(null)}>
            <RotateCcw size={15} />
            重設焦點
          </button>
          <span className="canvas-focus">
            <Focus size={15} />
            {protocol.shortCode}
          </span>
        </div>
      </div>

      <div className="pathway-columns" aria-hidden="true">
        <span>神經根</span>
        <span>幹／神經叢</span>
        <span>束／分部</span>
        <span>周邊神經</span>
        <span>肌肉</span>
      </div>

      <div className="pathway-scroll">
        <svg
          className="pathway-svg"
          viewBox={`0 0 900 ${graphHeight}`}
          role="img"
          aria-label={`${protocol.labelZh} 的神經根至肌肉路徑`}
        >
          <defs>
            <marker
              id="path-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>

          {columnX.slice(1).map((x) => (
            <line
              key={x}
              className="column-guide"
              x1={x - 88}
              y1={0}
              x2={x - 88}
              y2={graphHeight}
            />
          ))}

          <g className="graph-edges">
            {graph.edges.map((edge) => {
              const source = nodeById.get(edge.source);
              const target = nodeById.get(edge.target);
              if (!source || !target) return null;
              const highlighted =
                selectedPath.has(source.id) && selectedPath.has(target.id);
              const hovered =
                activeNeighborhood.has(source.id) &&
                activeNeighborhood.has(target.id);
              const controlOffset = Math.max(42, (target.x - source.x) * 0.42);
              const path = `M ${source.x + 61} ${source.y} C ${
                source.x + controlOffset
              } ${source.y}, ${target.x - controlOffset} ${target.y}, ${
                target.x - 61
              } ${target.y}`;
              return (
                <path
                  key={edge.id}
                  d={path}
                  className={[
                    "graph-edge",
                    highlighted ? "highlighted" : "",
                    hovered ? "hovered" : ""
                  ].join(" ")}
                  markerEnd="url(#path-arrow)"
                />
              );
            })}
          </g>

          <g className="graph-nodes">
            {graph.nodes.map((node) => {
              const selected = selectedPath.has(node.id);
              const hovered = activeNeighborhood.has(node.id);
              const isMuscle = node.kind === "muscle";
              return (
                <g
                  key={node.id}
                  className={[
                    "graph-node",
                    `kind-${node.kind}`,
                    selected ? "selected" : "",
                    hovered ? "hovered" : ""
                  ].join(" ")}
                  transform={`translate(${node.x}, ${node.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.labelZh}, ${node.labelEn}`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (isMuscle) {
                      onSelectMuscle(node.id.replace("muscle-", ""));
                    } else {
                      onSelectNode(node.id);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    if (isMuscle) {
                      onSelectMuscle(node.id.replace("muscle-", ""));
                    } else {
                      onSelectNode(node.id);
                    }
                  }}
                >
                  <rect x="-61" y="-25" width="122" height="50" rx="7" />
                  <text className="node-zh" textAnchor="middle" y="-3">
                    {node.labelZh.length > 10
                      ? `${node.labelZh.slice(0, 10)}…`
                      : node.labelZh}
                  </text>
                  <text className="node-en" textAnchor="middle" y="14">
                    {node.labelEn.length > 18
                      ? `${node.labelEn.slice(0, 18)}…`
                      : node.labelEn}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="route-ribbon" aria-label="目前選取路徑">
        {Array.from(selectedPath)
          .map((id) => nodeById.get(id))
          .filter((node): node is GraphNode => Boolean(node))
          .sort((a, b) => a.layer - b.layer)
          .map((node) => (
            <span key={node.id}>{node.labelZh}</span>
          ))}
      </div>
    </section>
  );
}
