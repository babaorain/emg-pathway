import { useEffect, useMemo, useState } from "react";
import {
  Focus,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import {
  topologyByRegion,
  topologyNerveAlias,
  type CompressionPoint,
  type TopologyEdge,
  type TopologyNode
} from "../data/pathwayTopology";
import { muscleById } from "../data/muscles";
import { sourceById } from "../data/sources";
import { buildPlan } from "../logic/recommendations";
import type { Muscle, Protocol } from "../types";

interface PathwayCanvasProps {
  protocol: Protocol;
  selectedMuscleId: string | null;
  onSelectMuscle: (id: string) => void;
  onSelectNode: (nodeId: string) => void;
}

interface MuscleGraphNode {
  id: string;
  muscle: Muscle;
  sourceNodeId: string;
  x: number;
  y: number;
}

const nodeHalfWidth = (node: TopologyNode) => (node.width ?? 132) / 2;
const muscleNodeHalfWidth = 104;

const edgeId = (edge: TopologyEdge) => `${edge.source}--${edge.target}`;

const findDirectedPath = (
  edges: TopologyEdge[],
  start: string,
  target: string
) => {
  const queue: string[][] = [[start]];
  const visited = new Set([start]);

  while (queue.length) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === target) return path;

    edges
      .filter((edge) => edge.source === current)
      .forEach((edge) => {
        if (visited.has(edge.target)) return;
        visited.add(edge.target);
        queue.push([...path, edge.target]);
      });
  }

  return [];
};

const branchClass = (source: string, target: string) => {
  const key = `${source} ${target}`;
  if (/radial|pin/.test(key)) return "branch-radial";
  if (/median|ain/.test(key)) return "branch-median";
  if (/ulnar/.test(key)) return "branch-ulnar";
  if (/musculocutaneous/.test(key)) return "branch-musculocutaneous";
  if (/axillary|suprascapular/.test(key)) return "branch-shoulder";
  if (/femoral/.test(key)) return "branch-femoral";
  if (/obturator/.test(key)) return "branch-obturator";
  if (/fibular/.test(key)) return "branch-fibular";
  if (/tibial|plantar/.test(key)) return "branch-tibial";
  if (/sciatic/.test(key)) return "branch-sciatic";
  return "";
};

const routePath = (
  source: TopologyNode | MuscleGraphNode,
  target: TopologyNode | MuscleGraphNode
) => {
  const sourceHalf =
    "muscle" in source ? muscleNodeHalfWidth : nodeHalfWidth(source);
  const targetHalf =
    "muscle" in target ? muscleNodeHalfWidth : nodeHalfWidth(target);
  const startX = source.x + sourceHalf;
  const endX = target.x - targetHalf;
  const bendX =
    "muscle" in target
      ? endX - 28
      : startX + Math.max(22, (endX - startX) * 0.48);
  return `M ${startX} ${source.y} H ${bendX} V ${target.y} H ${endX}`;
};

export function PathwayCanvas({
  protocol,
  selectedMuscleId,
  onSelectMuscle,
  onSelectNode
}: PathwayCanvasProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedCompressionId, setSelectedCompressionId] = useState<
    string | null
  >(null);

  const selectedMuscle = selectedMuscleId
    ? muscleById.get(selectedMuscleId) ?? null
    : null;
  const displayRegion =
    selectedMuscle?.region ?? (protocol.region === "lower" ? "lower" : "upper");
  const topology = topologyByRegion[displayRegion];

  useEffect(() => {
    if (!expanded) return;
    document.body.classList.add("pathway-fullscreen-open");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("pathway-fullscreen-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  useEffect(() => {
    setSelectedCompressionId(null);
  }, [displayRegion]);

  const topologyNodeById = useMemo(
    () => new Map(topology.nodes.map((node) => [node.id, node])),
    [topology.nodes]
  );

  const plannedMuscles = useMemo(
    () =>
      buildPlan(protocol)
        .map(({ muscle }) => muscle)
        .filter((muscle) => muscle.region === displayRegion)
        .sort((a, b) => {
          const aId = topologyNerveAlias[a.nerveId] ?? a.nerveId;
          const bId = topologyNerveAlias[b.nerveId] ?? b.nerveId;
          const aY = topologyNodeById.get(aId)?.y ?? 999;
          const bY = topologyNodeById.get(bId)?.y ?? 999;
          return aY - bY || a.nameEn.localeCompare(b.nameEn);
        }),
    [displayRegion, protocol, topologyNodeById]
  );

  const muscleNodes = useMemo<MuscleGraphNode[]>(() => {
    const top = 68;
    const bottom = topology.height - 50;
    const gap =
      plannedMuscles.length > 1
        ? (bottom - top) / (plannedMuscles.length - 1)
        : 0;

    return plannedMuscles.map((muscle, index) => {
      const aliased = topologyNerveAlias[muscle.nerveId] ?? muscle.nerveId;
      const sourceNodeId = topologyNodeById.has(aliased)
        ? aliased
        : [...muscle.path]
            .reverse()
            .map((segment) => topologyNerveAlias[segment.id] ?? segment.id)
            .find((id) => topologyNodeById.has(id)) ?? topology.nodes[0].id;

      return {
        id: `muscle-${muscle.id}`,
        muscle,
        sourceNodeId,
        x: 1085,
        y: plannedMuscles.length === 1 ? (top + bottom) / 2 : top + gap * index
      };
    });
  }, [
    plannedMuscles,
    topology.height,
    topology.nodes,
    topologyNodeById
  ]);

  const selectedRoute = useMemo(() => {
    if (!selectedMuscle || selectedMuscle.region !== displayRegion) {
      return { nodeIds: new Set<string>(), edgeIds: new Set<string>() };
    }

    const muscleNode = muscleNodes.find(
      (node) => node.muscle.id === selectedMuscle.id
    );
    if (!muscleNode) {
      return { nodeIds: new Set<string>(), edgeIds: new Set<string>() };
    }

    const pathRoot =
      selectedMuscle.path
        .map((segment) => segment.id)
        .find((id) => topologyNodeById.has(id) && id.startsWith("root-")) ??
      topology.nodes.find((node) => node.kind === "root")?.id;
    const path = pathRoot
      ? findDirectedPath(topology.edges, pathRoot, muscleNode.sourceNodeId)
      : [];
    const nodeIds = new Set([...path, muscleNode.id]);
    const edgeIds = new Set<string>();
    for (let index = 0; index < path.length - 1; index += 1) {
      edgeIds.add(`${path[index]}--${path[index + 1]}`);
    }
    edgeIds.add(`${muscleNode.sourceNodeId}--${muscleNode.id}`);
    return { nodeIds, edgeIds };
  }, [
    displayRegion,
    muscleNodes,
    selectedMuscle,
    topology.edges,
    topology.nodes,
    topologyNodeById
  ]);

  const activeNeighborhood = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const active = new Set([hoveredNode]);
    topology.edges.forEach((edge) => {
      if (edge.source === hoveredNode || edge.target === hoveredNode) {
        active.add(edge.source);
        active.add(edge.target);
      }
    });
    muscleNodes.forEach((node) => {
      if (node.id === hoveredNode || node.sourceNodeId === hoveredNode) {
        active.add(node.id);
        active.add(node.sourceNodeId);
      }
    });
    return active;
  }, [hoveredNode, muscleNodes, topology.edges]);

  const selectedCompression =
    topology.compressionPoints.find(
      (point) => point.id === selectedCompressionId
    ) ?? null;

  const selectCompression = (point: CompressionPoint) => {
    setSelectedCompressionId((current) =>
      current === point.id ? null : point.id
    );
    setHoveredNode(point.nerveId);
  };

  return (
    <section
      className={`pathway-panel ${expanded ? "pathway-expanded" : ""}`}
      aria-labelledby="pathway-title"
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded || undefined}
    >
      <div className="panel-heading">
        <div>
          <h2 id="pathway-title">神經路徑圖</h2>
          <p>
            依 PDF 固定層級排列；紅色編號為常見卡壓位置，不代表目前病灶。
          </p>
        </div>
        <div className="canvas-actions">
          <button
            className="icon-text-button"
            onClick={() => {
              setHoveredNode(null);
              setSelectedCompressionId(null);
            }}
          >
            <RotateCcw size={15} />
            重設焦點
          </button>
          <button
            className="icon-button canvas-zoom"
            onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))}
            aria-label="縮小路徑圖"
            title="縮小"
            disabled={zoom <= 0.8}
          >
            <ZoomOut size={16} />
          </button>
          <button
            className="icon-button canvas-zoom"
            onClick={() => setZoom((value) => Math.min(1.3, value + 0.1))}
            aria-label="放大神經路徑圖"
            title="放大"
            disabled={zoom >= 1.3}
          >
            <ZoomIn size={16} />
          </button>
          <span className="canvas-focus">
            <Focus size={15} />
            {protocol.shortCode}
          </span>
          <button
            className="fullscreen-button"
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? "離開全螢幕路徑圖" : "全螢幕顯示路徑圖"}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {expanded ? "離開全螢幕" : "全螢幕"}
          </button>
        </div>
      </div>

      <div className="pathway-scroll">
        <svg
          className="pathway-svg"
          style={{ width: topology.width * zoom }}
          viewBox={`0 0 ${topology.width} ${topology.height}`}
          role="img"
          aria-label={`${protocol.labelZh} 的固定解剖層級神經路徑與常見卡壓點`}
        >
          <defs>
            <marker
              id={`path-arrow-${displayRegion}`}
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

          <g className="anatomy-columns" aria-hidden="true">
            {topology.columns.map((column, index) => (
              <g key={column.labelEn}>
                <rect
                  className={`column-band column-band-${index + 1}`}
                  x={column.start}
                  y={0}
                  width={column.end - column.start}
                  height={topology.height}
                />
                <line
                  className="column-divider"
                  x1={column.end}
                  y1={0}
                  x2={column.end}
                  y2={topology.height}
                />
                <text
                  className="column-title"
                  x={(column.start + column.end) / 2}
                  y={20}
                  textAnchor="middle"
                >
                  {column.labelZh}
                </text>
                <text
                  className="column-subtitle"
                  x={(column.start + column.end) / 2}
                  y={34}
                  textAnchor="middle"
                >
                  {column.labelEn}
                </text>
              </g>
            ))}
          </g>

          <g className="graph-edges">
            {topology.edges.map((edge) => {
              const source = topologyNodeById.get(edge.source);
              const target = topologyNodeById.get(edge.target);
              if (!source || !target) return null;
              const id = edgeId(edge);
              const highlighted = selectedRoute.edgeIds.has(id);
              const hovered =
                activeNeighborhood.has(source.id) &&
                activeNeighborhood.has(target.id);
              return (
                <path
                  key={id}
                  d={routePath(source, target)}
                  className={[
                    "graph-edge",
                    branchClass(source.id, target.id),
                    highlighted ? "highlighted" : "",
                    hovered ? "hovered" : ""
                  ].join(" ")}
                  markerEnd={`url(#path-arrow-${displayRegion})`}
                />
              );
            })}

            {muscleNodes.map((muscleNode) => {
              const source = topologyNodeById.get(muscleNode.sourceNodeId);
              if (!source) return null;
              const id = `${source.id}--${muscleNode.id}`;
              return (
                <path
                  key={id}
                  d={routePath(source, muscleNode)}
                  className={[
                    "graph-edge",
                    "muscle-edge",
                    branchClass(source.id, muscleNode.muscle.nerveId),
                    selectedRoute.edgeIds.has(id) ? "highlighted" : "",
                    activeNeighborhood.has(source.id) &&
                    activeNeighborhood.has(muscleNode.id)
                      ? "hovered"
                      : ""
                  ].join(" ")}
                  markerEnd={`url(#path-arrow-${displayRegion})`}
                />
              );
            })}
          </g>

          <g className="graph-nodes">
            {topology.nodes.map((node) => {
              const selected = selectedRoute.nodeIds.has(node.id);
              const hovered = activeNeighborhood.has(node.id);
              const width = node.width ?? 132;
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
                  onClick={() => onSelectNode(node.id)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    onSelectNode(node.id);
                  }}
                >
                  <rect x={-width / 2} y="-19" width={width} height="38" rx="5" />
                  <text className="node-zh" textAnchor="middle" y="-2">
                    {node.labelZh}
                  </text>
                  <text className="node-en" textAnchor="middle" y="11">
                    {node.labelEn}
                  </text>
                </g>
              );
            })}

            {muscleNodes.map((node) => {
              const selected = selectedMuscleId === node.muscle.id;
              const hovered = activeNeighborhood.has(node.id);
              return (
                <g
                  key={node.id}
                  className={[
                    "graph-node",
                    "kind-muscle",
                    selected ? "selected" : "",
                    hovered ? "hovered" : ""
                  ].join(" ")}
                  transform={`translate(${node.x}, ${node.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.muscle.nameZh}, ${node.muscle.nameEn}`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => onSelectMuscle(node.muscle.id)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    onSelectMuscle(node.muscle.id);
                  }}
                >
                  <rect
                    x={-muscleNodeHalfWidth}
                    y="-22"
                    width={muscleNodeHalfWidth * 2}
                    height="44"
                    rx="5"
                  />
                  <text className="node-zh" textAnchor="middle" y="-4">
                    {node.muscle.nameZh}
                  </text>
                  <text className="node-en" textAnchor="middle" y="10">
                    {node.muscle.nameEn}
                  </text>
                  <text className="node-root-note" textAnchor="middle" y="19">
                    {node.muscle.roots.map((root) => root.root).join("–")}
                  </text>
                </g>
              );
            })}
          </g>

          <g className="compression-markers">
            {topology.compressionPoints.map((point) => {
              const active = selectedCompressionId === point.id;
              return (
                <g
                  key={point.id}
                  className={`compression-marker ${active ? "active" : ""}`}
                  transform={`translate(${point.x}, ${point.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${point.number}. ${point.siteZh}, ${point.siteEn}`}
                  onClick={() => selectCompression(point)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    selectCompression(point);
                  }}
                >
                  <circle r="11" />
                  <text textAnchor="middle" y="3.5">
                    {point.number}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="compression-section">
        <div className="compression-heading">
          <div>
            <strong>常見卡壓點</strong>
            <span>Common entrapment sites</span>
          </div>
          <small>點選編號查看解剖位置與預期肌肉型態</small>
        </div>

        <div className="compression-list">
          {topology.compressionPoints.map((point) => (
            <button
              key={point.id}
              className={
                selectedCompressionId === point.id ? "selected" : undefined
              }
              onClick={() => selectCompression(point)}
            >
              <span>{point.number}</span>
              <strong>{point.siteZh}</strong>
              <small>{point.nerveZh}</small>
            </button>
          ))}
        </div>

        {selectedCompression && (
          <div className="compression-detail" role="status">
            <span className="compression-detail-number">
              {selectedCompression.number}
            </span>
            <div>
              <strong>
                {selectedCompression.siteZh}
                <small>{selectedCompression.siteEn}</small>
              </strong>
              <p>{selectedCompression.location}</p>
            </div>
            <div>
              <span>EMG 定位提示</span>
              <p>{selectedCompression.pattern}</p>
            </div>
            <small className="compression-sources">
              依據：
              {selectedCompression.sourceIds
                .map((id) => sourceById.get(id)?.organization)
                .filter(Boolean)
                .join("、")}
            </small>
          </div>
        )}
      </div>

      <div className="route-ribbon" aria-label="目前選取路徑">
        {selectedMuscle?.path.map((segment) => (
          <span key={`${selectedMuscle.id}-${segment.id}`}>
            {segment.labelZh}
          </span>
        ))}
      </div>
    </section>
  );
}
