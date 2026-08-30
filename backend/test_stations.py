import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.engine.station_network import national_network


def test_station_network():
    print("==================================================================")
    print("   TESTING PAN-INDIA STATION GRAPH & SEARCH ENGINE              ")
    print("==================================================================")

    stats = national_network.get_network_stats()
    print(f" -> Total Stations Indexed: {stats['total_stations_indexed']}")
    print(f" -> Interconnected Trunk Edges: {stats['total_interconnected_corridor_edges']}")
    print(f" -> Major Junctions Count: {stats['major_junctions_count']}")
    print(f" -> Covered Zones ({len(stats['covered_zones'])}): {', '.join(stats['covered_zones'][:8])}...")
    assert stats["total_stations_indexed"] > 400, "Station count insufficient"

    # Test 1: Code Lookups
    print("\n[1] Testing Specific Station Code Lookups...")
    for code in ["NDLS", "HWH", "MAS", "CSMT", "SBC", "CNB", "DDU", "MZP"]:
        stn = national_network.get_station(code)
        assert stn is not None, f"Failed lookup for {code}"
        print(f"  {stn['code']:6s} -> {stn['name']:<35s} | Zone: {stn['zone']} | State: {stn['state']} | Connected: {stn['connected_junctions_count']}")

    # Test 2: Search Queries
    print("\n[2] Testing Search Queries across India...")
    queries = ["Delhi", "Mumbai", "Howrah", "Chennai", "Bangalore", "Prayagraj", "Varanasi", "Ahmedabad", "Junction"]
    for q in queries:
        res = national_network.search_stations(q, limit=5)
        print(f"  Query '{q}': Found {res['count']} matches. Top: {[r['name'] for r in res['results'][:3]]}")
        assert res["count"] > 0, f"No matches found for {q}"

    # Test 3: Pagination
    print("\n[3] Testing Paginated Listing...")
    page1 = national_network.list_stations(limit=10, offset=0)
    page2 = national_network.list_stations(limit=10, offset=10)
    assert len(page1["stations"]) == 10
    assert len(page2["stations"]) == 10
    assert page1["stations"][0]["code"] != page2["stations"][0]["code"]
    print(f"  Page 1: {[s['code'] for s in page1['stations']]}")
    print(f"  Page 2: {[s['code'] for s in page2['stations']]}")

    print("\n==================================================================")
    print("   PAN-INDIA STATION NETWORK VERIFIED WITH 100% SUCCESS!        ")
    print("==================================================================")


if __name__ == "__main__":
    test_station_network()
