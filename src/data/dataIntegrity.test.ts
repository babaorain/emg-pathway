import { describe, expect, it } from "vitest";
import { muscles, muscleById } from "./muscles";
import { topologyByRegion } from "./pathwayTopology";
import { protocols } from "./protocols";
import { sourceById } from "./sources";

describe("clinical data integrity", () => {
  it("uses unique muscle and protocol identifiers", () => {
    expect(new Set(muscles.map((muscle) => muscle.id)).size).toBe(
      muscles.length
    );
    expect(new Set(protocols.map((protocol) => protocol.id)).size).toBe(
      protocols.length
    );
  });

  it("resolves every muscle, alternative and source reference", () => {
    muscles.forEach((muscle) => {
      muscle.alternativeIds.forEach((id) =>
        expect(muscleById.has(id), `${muscle.id} -> ${id}`).toBe(true)
      );
      muscle.sourceIds.forEach((id) =>
        expect(sourceById.has(id), `${muscle.id} -> ${id}`).toBe(true)
      );
    });

    protocols.forEach((protocol) => {
      const allEntries = [
        ...protocol.required,
        ...protocol.discriminators,
        ...protocol.conditional
      ];
      allEntries.forEach(({ muscleId }) =>
        expect(
          muscleById.has(muscleId),
          `${protocol.id} -> ${muscleId}`
        ).toBe(true)
      );
      protocol.sourceIds.forEach((id) =>
        expect(sourceById.has(id), `${protocol.id} -> ${id}`).toBe(true)
      );
    });
  });

  it("does not duplicate a muscle inside one protocol", () => {
    protocols.forEach((protocol) => {
      const ids = [
        ...protocol.required,
        ...protocol.discriminators,
        ...protocol.conditional
      ].map((item) => item.muscleId);
      expect(new Set(ids).size, protocol.id).toBe(ids.length);
    });
  });

  it("resolves every pathway edge and compression-point source", () => {
    Object.entries(topologyByRegion).forEach(([region, topology]) => {
      const nodeIds = new Set(topology.nodes.map((node) => node.id));
      expect(nodeIds.size, `${region} topology node ids`).toBe(
        topology.nodes.length
      );

      topology.edges.forEach((edge) => {
        expect(nodeIds.has(edge.source), `${region} edge ${edge.source}`).toBe(
          true
        );
        expect(nodeIds.has(edge.target), `${region} edge ${edge.target}`).toBe(
          true
        );
      });

      topology.compressionPoints.forEach((point) => {
        expect(
          nodeIds.has(point.nerveId),
          `${region} compression ${point.id} -> ${point.nerveId}`
        ).toBe(true);
        point.sourceIds.forEach((id) =>
          expect(
            sourceById.has(id),
            `${region} compression ${point.id} -> ${id}`
          ).toBe(true)
        );
      });
    });
  });
});
