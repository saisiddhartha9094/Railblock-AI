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

  // Analytics & KPIs
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
  }
};
