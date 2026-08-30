import json
import os
from pathlib import Path
from typing import Dict, Any, List, Optional, Set

DATA_FILE = Path(__file__).parent.parent / "data" / "stations_master.json"


class StationGraph:
    """High-performance in-memory Railway Network Graph modeling station nodes and corridor edges."""

    def __init__(self):
        self._nodes: Dict[str, Dict[str, Any]] = {}
        self._adj: Dict[str, Dict[str, Dict[str, Any]]] = {}

    def add_node(self, node: str, **attrs):
        if node not in self._nodes:
            self._nodes[node] = {}
            self._adj[node] = {}
        self._nodes[node].update(attrs)

    def add_edge(self, u: str, v: str, **attrs):
        if u not in self._nodes:
            self.add_node(u)
        if v not in self._nodes:
            self.add_node(v)
        self._adj[u][v] = attrs
        self._adj[v][u] = attrs

    def has_node(self, n: str) -> bool:
        return n in self._nodes

    def has_edge(self, u: str, v: str) -> bool:
        return u in self._adj and v in self._adj[u]

    def neighbors(self, n: str) -> List[str]:
        return list(self._adj.get(n, {}).keys())

    def number_of_nodes(self) -> int:
        return len(self._nodes)

    def number_of_edges(self) -> int:
        total = sum(len(neighbors) for neighbors in self._adj.values())
        return total // 2

    @property
    def nodes(self) -> Dict[str, Dict[str, Any]]:
        return self._nodes


class NationalStationNetwork:
    """Graph & Search Engine for Pan-India Railway Stations.

    Models station nodes, major railway trunk corridor edges, and provides sub-millisecond search & routing.
    """

    def __init__(self):
        self.graph = StationGraph()
        self.stations_list: List[Dict[str, Any]] = []
        self._load_and_build_graph()

    def _load_and_build_graph(self):
        if not os.path.exists(DATA_FILE):
            return

        with open(DATA_FILE, "r", encoding="utf-8") as f:
            self.stations_list = json.load(f)

        # 1. Add all Station Nodes
        for stn in self.stations_list:
            code = stn["code"]
            self.graph.add_node(
                code,
                name=stn["name"],
                zone=stn.get("zone", "IR"),
                state=stn.get("state", "India"),
                is_junction=stn.get("is_junction", False)
            )

        # 2. Build Major High-Density Trunk Corridor Edges
        # High Density Golden Quadrilateral Trunk 1: NDLS -> CNB -> ALD/PRYJ -> MZP -> DDU -> GAYA -> DHN -> ASN -> BWN -> HWH
        self._add_corridor_edges(["NDLS", "GZB", "ALJN", "TDL", "ETW", "CNB", "FTP", "ALD", "MZP", "CAR", "DDU", "DOS", "GAYA", "GMO", "DHN", "ASN", "DGR", "BWN", "HWH"])

        # Trunk 2: NDLS -> MTJ -> KOTA -> RTM -> BRC -> ST -> BL -> BVI -> BDTS / BCT / CSMT
        self._add_corridor_edges(["NDLS", "FDB", "MTJ", "BTE", "BXN", "GGC", "SWM", "KOTA", "RTM", "DHD", "GDA", "BRC", "BH", "ST", "BL", "BVI", "BDTS", "BCT", "CSMT"])

        # Trunk 3: NDLS -> AGC -> GWL -> JHS -> BINA -> BPL -> ET -> NGP -> BPQ -> KZJ -> BZA -> GDR -> MAS / MS
        self._add_corridor_edges(["NDLS", "MTJ", "AGC", "DHO", "GWL", "JHS", "LAR", "BINA", "BPL", "ET", "BZU", "AMLA", "NGP", "SEGM", "CD", "BPQ", "SKZR", "RDM", "KZJ", "WL", "KMT", "BZA", "TEL", "CLX", "OGL", "NLR", "GDR", "AJJ", "MAS"])

        # Trunk 4: CSMT -> KYN -> LNL -> PUNE -> DD -> KWV -> SUR -> WADI -> RC -> GTL -> GY -> ATP -> DMM -> HUP -> YPR -> SBC
        self._add_corridor_edges(["CSMT", "DR", "KYN", "LNL", "PUNE", "DD", "KWV", "SUR", "WADI", "RC", "GTL", "GY", "ATP", "DMM", "HUP", "YPR", "SBC"])

        # Trunk 5: HWH -> KGP -> BLS -> BHC -> JJKR -> CTC -> BBS -> KUR -> PSA -> CHE -> VZM -> VSKP -> SLO -> RJY -> TDD -> EE -> BZA
        self._add_corridor_edges(["HWH", "KGP", "BLS", "BHC", "JJKR", "CTC", "BBS", "KUR", "PSA", "CHE", "VZM", "VSKP", "SLO", "RJY", "TDD", "EE", "BZA"])

        # Trunk 6: MAS -> AJJ -> KPD -> JTJ -> SA -> ED -> CBE -> PGT -> TCR -> AWY -> ERN -> ERS -> QLN -> TVC -> CAPE
        self._add_corridor_edges(["MAS", "AJJ", "KPD", "JTJ", "SA", "ED", "CBE", "PGT", "TCR", "AWY", "ERN", "ERS", "KTYM", "CNGR", "QLN", "VAK", "TVC", "NCJ", "CAPE"])

    def _add_corridor_edges(self, stn_sequence: List[str]):
        valid_nodes = [c for c in stn_sequence if self.graph.has_node(c)]
        for a, b in zip(valid_nodes, valid_nodes[1:]):
            self.graph.add_edge(a, b, route_type="TRUNK_HIGH_DENSITY")

    def get_station(self, code: str) -> Optional[Dict[str, Any]]:
        code = code.strip().upper()
        if not self.graph.has_node(code):
            return None
        data = self.graph.nodes[code]
        neighbors = self.graph.neighbors(code)
        return {
            "code": code,
            "name": data.get("name"),
            "zone": data.get("zone"),
            "state": data.get("state"),
            "is_junction": data.get("is_junction"),
            "connected_stations": neighbors,
            "connected_junctions_count": len(neighbors)
        }

    def list_stations(self, limit: int = 50, offset: int = 0, zone: Optional[str] = None) -> Dict[str, Any]:
        all_stns = self.stations_list
        if zone:
            all_stns = [s for s in all_stns if s.get("zone", "").upper() == zone.upper()]

        total = len(all_stns)
        page = all_stns[offset: offset + limit]
        return {
            "total_stations": total,
            "limit": limit,
            "offset": offset,
            "stations": page
        }

    def search_stations(self, query: str, limit: int = 50) -> Dict[str, Any]:
        q = query.strip().lower()
        if not q:
            return {"query": query, "count": 0, "results": []}

        # Normalize common railway synonyms
        tokens = [q]
        if "junction" in q:
            tokens.append(q.replace("junction", "jn"))
            tokens.append("jn.")
        if "cantt" in q or "cantonment" in q:
            tokens.append("cantt")
            tokens.append("cantt.")
        if "terminus" in q or "terminal" in q:
            tokens.append("(t)")
            tokens.append("terminus")

        exact_code = []
        name_matches = []
        seen_codes = set()

        for stn in self.stations_list:
            code = stn["code"].lower()
            name = stn["name"].lower()
            state = stn.get("state", "").lower()
            zone = stn.get("zone", "").lower()

            if code == q and code not in seen_codes:
                exact_code.append(stn)
                seen_codes.add(code)
            elif any(t in code or t in name or t in state or t in zone for t in tokens) and code not in seen_codes:
                name_matches.append(stn)
                seen_codes.add(code)

        combined = exact_code + name_matches
        return {
            "query": query,
            "count": len(combined),
            "results": combined[:limit]
        }

    def get_network_stats(self) -> Dict[str, Any]:
        zones = list(set(d.get("zone") for d in self.graph.nodes.values() if d.get("zone")))
        junctions = len([c for c, d in self.graph.nodes.items() if d.get("is_junction", False)])

        return {
            "total_stations_indexed": self.graph.number_of_nodes(),
            "total_interconnected_corridor_edges": self.graph.number_of_edges(),
            "major_junctions_count": junctions,
            "covered_zones": sorted(zones),
            "national_trunk_lines": [
                "Delhi - Howrah (High Density Eastern Trunk)",
                "Delhi - Mumbai (Western Trunk)",
                "Delhi - Chennai (Grand Trunk)",
                "Mumbai - Bangalore / Chennai (Southern Trunk)",
                "Howrah - Chennai (East Coast Trunk)",
                "Chennai - Kanyakumari (South Coast Trunk)"
            ]
        }


national_network = NationalStationNetwork()
