"""build_graph.py

Step 2 of the pipeline: load stations_master.csv into a NetworkX graph
and serialize as a pickle file and JSON graph export.

Usage:
    python build_graph.py
"""

import csv
import pickle
from pathlib import Path
import networkx as nx

BASE_DIR = Path(__file__).parent.parent / "app" / "data"
MASTER_CSV = BASE_DIR / "stations_master.csv"
GRAPH_OUT = BASE_DIR / "station_graph.gpickle"


def build_station_graph(csv_path: Path) -> nx.Graph:
    G = nx.Graph()
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            code = row["station_code"]
            name = row["station_name"]
            is_jn = "JN" in name.upper()
            G.add_node(code, name=name, is_junction=is_jn)
    return G


def main():
    print(f"Loading station master from {MASTER_CSV} ...")
    G = build_station_graph(MASTER_CSV)
    print(f"  Graph built: {G.number_of_nodes()} station nodes, {G.number_of_edges()} edges")

    with open(GRAPH_OUT, "wb") as f:
        pickle.dump(G, f)
    print(f"\nGraph saved to {GRAPH_OUT}")

    # Quick sanity check
    print("\nSample stations in graph:")
    for code in ["NDLS", "HWH", "MAS", "CSTM", "SBC"]:
        if G.has_node(code):
            print(f"  {code:6s} -> {G.nodes[code]['name']}")
        else:
            print(f"  {code:6s} -> not found in current dataset")


if __name__ == "__main__":
    main()
