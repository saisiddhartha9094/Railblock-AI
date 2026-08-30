import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
  // Corridor & Timetable
  getCorridor: async () => {
    const res = await axios.get(`${API_BASE}/corridor`);
    return res.data;
  },
  getTimetable: async () => {
    const res = await axios.get(`${API_BASE}/corridor/timetable`);
    return res.data;
  },
  getLiveStatus: async () => {
    const res = await axios.get(`${API_BASE}/corridor/live-status`);
    return res.data;
  },

  // Blocks & Optimization
  getBlockDemands: async () => {
    const res = await axios.get(`${API_BASE}/blocks/demands`);
    return res.data;
  },
  submitBlockDemand: async (demandData) => {
    const res = await axios.post(`${API_BASE}/blocks/demands`, demandData);
    return res.data;
  },
  runOptimization: async () => {
    const res = await axios.post(`${API_BASE}/blocks/optimize`);
    return res.data;
  },
  getScheduledBlocks: async () => {
    const res = await axios.get(`${API_BASE}/blocks/scheduled`);
    return res.data;
  },
  signOffBlock: async (demandId, signer, role) => {
    const res = await axios.post(`${API_BASE}/blocks/sign-off/${demandId}?department_signer=${encodeURIComponent(signer)}&role=${encodeURIComponent(role)}`);
    return res.data;
  },

  // What-If Simulation
  simulateWhatIf: async (scenarioData) => {
    const res = await axios.post(`${API_BASE}/simulation/what-if`, scenarioData);
    return res.data;
  },

  // Emergency Override
  triggerEmergencyOverride: async (emergencyData) => {
    const res = await axios.post(`${API_BASE}/emergency/override`, emergencyData);
    return res.data;
  },

  // Analytics & Shift Handover
  getAssetAvailabilityIndex: async () => {
    const res = await axios.get(`${API_BASE}/analytics/asset-availability-index`);
    return res.data;
  },
  getShiftHandover: async () => {
    const res = await axios.get(`${API_BASE}/analytics/shift-handover`);
    return res.data;
  },
  getAuditTrail: async () => {
    const res = await axios.get(`${API_BASE}/analytics/audit-trail`);
    return res.data;
  },

  // ================= 8 ADVANCED ENTERPRISE MODULES =================
  // 1. Point Machine Current Signature Diagnostics
  getPointMachinesList: async () => {
    const res = await axios.get(`${API_BASE}/advanced/point-machine/diagnostics`);
    return res.data;
  },
  getPointSignature: async (pointId) => {
    const res = await axios.get(`${API_BASE}/advanced/point-machine/signature/${pointId}`);
    return res.data;
  },
  autoGeneratePointMicroBlock: async (pointId) => {
    const res = await axios.post(`${API_BASE}/advanced/point-machine/auto-demand/${pointId}`);
    return res.data;
  },

  // 2. TRC & USFD Track Flaw Pipeline
  getTrcUsfdOverview: async () => {
    const res = await axios.get(`${API_BASE}/advanced/trc-usfd/overview`);
    return res.data;
  },
  autoGenerateCivilBlock: async (segmentId) => {
    const res = await axios.post(`${API_BASE}/advanced/trc-usfd/auto-demand/${segmentId}`);
    return res.data;
  },

  // 3. Kavach Telemetry Stream
  getKavachTelemetry: async () => {
    const res = await axios.get(`${API_BASE}/advanced/kavach/telemetry`);
    return res.data;
  },

  // 4. FOIS Freight SLA Engine
  getFoisFreightSla: async () => {
    const res = await axios.get(`${API_BASE}/advanced/fois/freight-sla`);
    return res.data;
  },

  // 5. CMS Crew Duty & HOER Tracker
  getCmsCrewDuty: async () => {
    const res = await axios.get(`${API_BASE}/advanced/cms/crew-duty`);
    return res.data;
  },

  // 6. Indic Multilingual NLP Assistant
  parseVoiceCommand: async (queryText, userRole = "Section Controller / PRYJ") => {
    const res = await axios.post(`${API_BASE}/advanced/voice/parse-command`, {
      query_text: queryText,
      user_role: userRole
    });
    return res.data;
  },

  // 7 & 8. Official Railway Board Reports (CBUI & PLA)
  getCbuiReport: async () => {
    const res = await axios.get(`${API_BASE}/advanced/reports/cbui`);
    return res.data;
  },
  getPlaReport: async () => {
    const res = await axios.get(`${API_BASE}/advanced/reports/pla`);
    return res.data;
  },

  // ================= PAN-INDIA STATIONS & NETWORK =================
  getStationsList: async (limit = 50, offset = 0, zone = null) => {
    const params = { limit, offset };
    if (zone) params.zone = zone;
    const res = await axios.get(`${API_BASE}/stations`, { params });
    return res.data;
  },
  searchStations: async (query, limit = 50) => {
    const res = await axios.get(`${API_BASE}/stations/search`, { params: { q: query, limit } });
    return res.data;
  },
  getStationNetworkStats: async () => {
    const res = await axios.get(`${API_BASE}/stations/stats`);
    return res.data;
  },
  getStationByCode: async (code) => {
    const res = await axios.get(`${API_BASE}/stations/${code}`);
    return res.data;
  }
};
