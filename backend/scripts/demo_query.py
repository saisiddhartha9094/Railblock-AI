"""demo_query.py

Step 3 of the pipeline: prove the pipeline works, load graph and query stations.
Usage:
    python demo_query.py
"""

import pickle
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent / "app" / "data"
GRAPH_PATH = BASE_DIR / "station_graph.gpickle"


def main():
    if not GRAPH_PATH.exists():
        print(f"Graph file not found at {GRAPH_PATH}. Please run build_graph.py first.")
        return

    with open(GRAPH_PATH, "rb") as f:
        G = pickle.load(f)

    print(f"Loaded graph: {G.number_of_nodes()} stations, {G.number_of_edges()} edges\n")

    print("Lookup by code:")
    for code in ["NDLS", "HWH", "MAS", "PUNE", "JP"]:
        if G.has_node(code):
            print(f"  {code:6s} -> {G.nodes[code]['name']}")

    print("\nSearch stations containing 'JUNCTION' equivalents (Jn.):")
    matches = [c for c in G.nodes if "Jn." in G.nodes[c]["name"] or "JN." in G.nodes[c]["name"].upper()]
    print(f"  Found {len(matches)} junction stations, e.g.: {matches[:8]}")

    print("\nSearch for 'DELHI' in station names:")
    matches = [(c, G.nodes[c]["name"]) for c in G.nodes if "DELHI" in G.nodes[c]["name"].upper()]
    for c, n in matches:
        print(f"  {c:6s} -> {n}")


if __name__ == "__main__":
    main()
