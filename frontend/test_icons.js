const fs = require('fs');
const path = require('path');

// Test Lucide icons
const lucide = require('./node_modules/lucide-react/dist/cjs/lucide-react.js');
const icons = [
  'LayoutGrid', 'Map', 'FlaskConical', 'ClipboardCheck', 'BrainCircuit', 'Activity',
  'TrainTrack', 'Radio', 'PackageCheck', 'UserCheck', 'FileText', 'Globe2', 'Gauge',
  'Truck', 'TrendingUp', 'Split', 'Presentation', 'Sparkles', 'Train', 'ShieldAlert',
  'Cpu', 'RefreshCw', 'Clock', 'Mic', 'Download', 'ChevronLeft', 'ChevronRight',
  'Trophy', 'Layers', 'Search', 'MapPin', 'GitBranch', 'CheckCircle2', 'Fuel',
  'Navigation', 'Wrench', 'ArrowRight', 'ShieldCheck'
];

let missing = [];
icons.forEach(name => {
  if (!lucide[name]) missing.push(name);
});

if (missing.length > 0) {
  console.log('MISSING ICONS IN LUCIDE-REACT:', missing);
} else {
  console.log('All icons found in lucide-react successfully!');
}
