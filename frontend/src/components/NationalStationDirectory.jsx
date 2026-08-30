import React, { useState, useEffect } from 'react';
import { Search, MapPin, Train, GitBranch, Globe2, CheckCircle2, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function NationalStationDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState([]);
  const [networkStats, setNetworkStats] = useState(null);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadNetworkStats();
    loadStations();
  }, []);

  const loadNetworkStats = async () => {
    try {
      const stats = await api.getStationNetworkStats();
      setNetworkStats(stats);
    } catch (err) {
      console.error('Error loading network stats:', err);
    }
  };

  const loadStations = async (zoneFilter = selectedZone) => {
    setIsLoading(true);
    try {
      const data = await api.getStationsList(60, 0, zoneFilter === 'ALL' ? null : zoneFilter);
      setStations(data.stations);
      setTotalCount(data.total_stations);
    } catch (err) {
      console.error('Error loading stations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadStations(selectedZone);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.searchStations(query, 60);
      setStations(res.results);
      setTotalCount(res.count);
    } catch (err) {
      console.error('Error searching stations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStation = async (code) => {
    try {
      const details = await api.getStationByCode(code);
      setSelectedStation(details);
    } catch (err) {
      console.error('Error fetching station details:', err);
    }
  };

  const zonesList = ['ALL', 'NCR', 'NR', 'WR', 'CR', 'ER', 'SR', 'SCR', 'SWR', 'ECR', 'SER', 'NWR', 'NER', 'NFR', 'ECoR', 'SECR', 'WCR', 'KR'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-orange-400" />
              Pan-India Master Station Directory & National Corridor Graph
            </h2>
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              CRIS RBS REGISTRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Unified Indian Railways station master graph with sub-millisecond search across all 640+ key stations, junctions, and Golden Quadrilateral trunks.
          </p>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedZone('ALL');
            loadStations('ALL');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Directory</span>
        </button>
      </div>

      {/* Network Stats Top KPI Cards */}
      {networkStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 font-mono">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Indexed Stations</span>
            <span className="text-2xl font-black text-white">{networkStats.total_stations_indexed}</span>
            <span className="text-[9px] text-slate-500 block">Pan-India Master</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Major Railway Junctions</span>
            <span className="text-2xl font-black text-amber-400">{networkStats.major_junctions_count}</span>
            <span className="text-[9px] text-slate-500 block">Multi-Track Nodes</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Trunk Corridor Edges</span>
            <span className="text-2xl font-black text-emerald-400">{networkStats.total_interconnected_corridor_edges}</span>
            <span className="text-[9px] text-slate-500 block">High-Density Links</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Railway Zones Covered</span>
            <span className="text-2xl font-black text-blue-400">{networkStats.covered_zones.length} Zones</span>
            <span className="text-[9px] text-slate-500 block">100% Zonal Coverage</span>
          </div>
        </div>
      )}

      {/* Search Bar & Zone Filter Chips */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search all Indian stations by code or name (e.g. NDLS, Mumbai, Howrah, Chennai, Bangalore, Kanpur, Patna)..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Zone Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">Zone:</span>
          {zonesList.map(z => (
            <button
              key={z}
              onClick={() => {
                setSelectedZone(z);
                loadStations(z);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold whitespace-nowrap transition-all ${
                selectedZone === z
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stations.map(stn => {
          const isSelected = selectedStation?.code === stn.code;
          return (
            <div
              key={stn.code}
              onClick={() => handleSelectStation(stn.code)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                isSelected
                  ? 'bg-slate-950 border-orange-500 ring-1 ring-orange-500 shadow-lg shadow-orange-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-xs text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/30">
                  {stn.code}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {stn.zone || 'IR'}
                </span>
              </div>

              <div className="font-bold text-xs text-white mt-2 truncate">
                {stn.name}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                <span className="truncate">{stn.state || 'India'}</span>
                {stn.is_junction && (
                  <span className="text-amber-400 font-bold font-mono text-[9px] bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-500/30">
                    JUNCTION
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {stations.length === 0 && !isLoading && (
        <div className="text-center py-12 text-slate-500 text-xs">
          No matching railway stations found for "{searchQuery}".
        </div>
      )}

      {/* Selected Station Details Drawer / Modal */}
      {selectedStation && (
        <div className="mt-6 p-5 bg-slate-950 border border-orange-500/40 rounded-2xl animate-fadeIn space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black font-mono text-orange-400">{selectedStation.code}</span>
                <h3 className="text-sm font-extrabold text-white">{selectedStation.name}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Zone: <strong className="text-slate-200">{selectedStation.zone}</strong> • State: <strong className="text-slate-200">{selectedStation.state}</strong>
              </p>
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>

          {selectedStation.connected_stations && selectedStation.connected_stations.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Connected Trunk Corridor Links ({selectedStation.connected_stations.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStation.connected_stations.map(neighbor => (
                  <button
                    key={neighbor}
                    onClick={() => handleSelectStation(neighbor)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <span>&harr; {neighbor}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
