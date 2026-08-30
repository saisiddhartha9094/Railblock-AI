"""convert_graph.py

Converts station graph into portable/interoperable formats:
  - JSON (node-link format)         -> station_graph.json
  - GraphML (for Gephi/yEd/etc.)    -> station_graph.graphml
  - CSV (nodes table + edges table) -> station_nodes.csv, station_edges.csv

Usage:
    python convert_graph.py
"""

import sys
import pickle
import json
import csv
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.engine.station_network import national_network

DATA_DIR = Path(__file__).parent.parent / "app" / "data"
GRAPH_PATH = DATA_DIR / "station_graph.gpickle"


def to_json(graph, out_path):
    nodes_data = []
    links_data = []

    for code, data in graph.nodes.items():
        nodes_data.append({
            "id": code,
            "name": data.get("name", ""),
            "zone": data.get("zone", "IR"),
            "state": data.get("state", "India"),
            "is_junction": data.get("is_junction", False)
        })

    visited_edges = set()
    for u, neighbors in graph._adj.items():
        for v in neighbors:
            edge_key = tuple(sorted([u, v]))
            if edge_key not in visited_edges:
                visited_edges.add(edge_key)
                links_data.append({
                    "source": u,
                    "target": v,
                    "type": "TRUNK_HIGH_DENSITY"
                })

    payload = {
        "directed": False,
        "multigraph": False,
        "graph": {"name": "Indian Railways National Station Network Graph"},
        "nodes": nodes_data,
        "links": links_data
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"  JSON written: {out_path} ({len(nodes_data)} nodes, {len(links_data)} links)")


def to_graphml(graph, out_path):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<graphml xmlns="http://graphml.graphdrawing.org/xmlns"',
        '         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">',
        '  <key id="d0" for="node" attr.name="name" attr.type="string"/>',
        '  <key id="d1" for="node" attr.name="zone" attr.type="string"/>',
        '  <key id="d2" for="node" attr.name="is_junction" attr.type="boolean"/>',
        '  <graph id="G" edgedefault="undirected">'
    ]

    for code, data in sorted(graph.nodes.items()):
        name = data.get("name", "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        zone = data.get("zone", "IR")
        is_jn = "true" if data.get("is_junction") else "false"
        lines.append(f'    <node id="{code}">')
        lines.append(f'      <data key="d0">{name}</data>')
        lines.append(f'      <data key="d1">{zone}</data>')
        lines.append(f'      <data key="d2">{is_jn}</data>')
        lines.append('    </node>')

    visited_edges = set()
    edge_idx = 0
    for u, neighbors in graph._adj.items():
        for v in neighbors:
            edge_key = tuple(sorted([u, v]))
            if edge_key not in visited_edges:
                visited_edges.add(edge_key)
                lines.append(f'    <edge id="e{edge_idx}" source="{u}" target="{v}"/>')
                edge_idx += 1

    lines.append('  </graph>')
    lines.append('</graphml>')

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  GraphML written: {out_path} ({len(graph.nodes)} nodes, {edge_idx} edges)")


def to_csv(graph, nodes_path, edges_path):
    with open(nodes_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["station_code", "station_name", "zone", "state", "is_junction"])
        for node, data in sorted(graph.nodes.items()):
            writer.writerow([
                node,
                data.get("name", ""),
                data.get("zone", "IR"),
                data.get("state", "India"),
                data.get("is_junction", False)
            ])
    print(f"  Nodes CSV written: {nodes_path}")

    visited_edges = set()
    with open(edges_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["from_station", "to_station", "route_type"])
        for u, neighbors in graph._adj.items():
            for v in neighbors:
                edge_key = tuple(sorted([u, v]))
                if edge_key not in visited_edges:
                    visited_edges.add(edge_key)
                    writer.writerow([u, v, "TRUNK_HIGH_DENSITY"])
    print(f"  Edges CSV written: {edges_path}")


def main():
    graph = national_network.graph
    print(f"Loaded national network graph: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges\n")

    print("Converting into interoperable formats...")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    to_json(graph, DATA_DIR / "station_graph.json")
    to_graphml(graph, DATA_DIR / "station_graph.graphml")
    to_csv(graph, DATA_DIR / "station_nodes.csv", DATA_DIR / "station_edges.csv")

    print("\nAll conversions complete successfully!")


if __name__ == "__main__":
    main()
