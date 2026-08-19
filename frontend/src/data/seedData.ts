/**
 * SiliconTrack Seed Data & Initial State
 * Semiconductor QA & End-to-End Traceability Platform
 */

import {
  User,
  Product,
  Route,
  Equipment,
  Recipe,
  Lot,
  SubstrateWafer,
  WaferMap,
  DieData,
  SpecificationLimit,
  QualityResult,
  SPCPoint,
  SPCSignal,
  HoldRecord,
  NonconformanceRecord,
  CAPARecord,
  AuditLog,
  IntegrationMessage,
  QualityKPIs,
} from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'usr-1', name: 'Dr. Elena Vance', email: 'elena.vance@silicontrack.fab', role: 'QA Manager', site: 'Fab 1 - Dresden', department: 'Quality Assurance' },
  { id: 'usr-2', name: 'Marcus Brody', email: 'marcus.brody@silicontrack.fab', role: 'Process Engineer', site: 'Fab 1 - Dresden', department: 'Process Integration' },
  { id: 'usr-3', name: 'Kenji Sato', email: 'kenji.sato@silicontrack.fab', role: 'QA Engineer', site: 'Fab 1 - Dresden', department: 'Quality Control' },
  { id: 'usr-4', name: 'Ananya Roy', email: 'ananya.roy@silicontrack.fab', role: 'QA Inspector', site: 'Fab 1 - Dresden', department: 'Metrology & Inspection' },
  { id: 'usr-5', name: 'Stefan Lindqvist', email: 'stefan.l@silicontrack.fab', role: 'Operator', site: 'Fab 1 - Dresden', department: 'Fab Operations' },
  { id: 'usr-6', name: 'David Chen', email: 'david.chen@silicontrack.fab', role: 'Equipment Engineer', site: 'Fab 1 - Dresden', department: 'Equipment Maintenance' },
  { id: 'usr-7', name: 'Sarah Miller', email: 'sarah.m@silicontrack.fab', role: 'Production Manager', site: 'Fab 1 - Dresden', department: 'Manufacturing' },
  { id: 'usr-8', name: 'Alex Koster', email: 'alex.k@silicontrack.fab', role: 'System Administrator', site: 'Fab 1 - Dresden', department: 'IT Systems' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'ST-SOC-7NM',
    name: 'Helios-7nm Mobile AP',
    revision: 'Rev B2',
    technologyNode: '7nm FinFET',
    packageType: 'FCBGA 1152',
    targetYieldPercent: 92.5,
    lifecycleState: 'Production',
    routeId: 'route-7nm-main',
  },
  {
    id: 'prod-2',
    code: 'ST-NAND-3D-128L',
    name: 'V-NAND 128L 512Gb Flash',
    revision: 'Rev C1',
    technologyNode: '128-Layer 3D NAND',
    packageType: 'BGA 132',
    targetYieldPercent: 94.0,
    lifecycleState: 'Ramp',
    routeId: 'route-nand-128',
  },
  {
    id: 'prod-3',
    code: 'ST-POWER-GaN-650V',
    name: 'GaN Power FET 650V',
    revision: 'Rev A4',
    technologyNode: 'GaN-on-Si 0.35um',
    packageType: 'TO-263',
    targetYieldPercent: 96.2,
    lifecycleState: 'Production',
    routeId: 'route-gan-power',
  },
  {
    id: 'prod-4',
    code: 'ST-RF-5G-MMW',
    name: '5G mmWave Front-End Module',
    revision: 'Rev A1',
    technologyNode: 'GaAs 0.15um',
    packageType: 'QFN 24',
    targetYieldPercent: 88.0,
    lifecycleState: 'NPI',
    routeId: 'route-rf-5g',
  },
];

export const INITIAL_ROUTES: Route[] = [
  {
    id: 'route-7nm-main',
    code: 'RT-7NM-MAIN-V4',
    version: '4.2',
    name: '7nm FinFET Standard Frontend & Backend Route',
    effectiveDate: '2026-05-10',
    operations: [
      {
        id: 'op-100',
        stepNumber: 100,
        operationCode: 'MAT-INSP-10',
        name: 'Incoming Wafer Substrate QC',
        workCenter: 'WC-INCOMING',
        description: 'Verify raw silicon/EPI wafer resistivity, oxygen concentration, and warp.',
        requiredChecksCount: 3,
        qualifiedEquipmentIds: ['eq-mat-01'],
      },
      {
        id: 'op-200',
        stepNumber: 200,
        operationCode: 'LITHO-DUV-20',
        name: 'EUV/DUV Photo-Lithography Masking',
        workCenter: 'WC-LITHO',
        description: 'Coat photoresist, alignment, scanner exposure, and post-exposure bake.',
        requiredChecksCount: 4,
        qualifiedEquipmentIds: ['eq-litho-01', 'eq-litho-02'],
      },
      {
        id: 'op-300',
        stepNumber: 300,
        operationCode: 'ETCH-RIE-30',
        name: 'Reactive Ion Plasma Etch',
        workCenter: 'WC-ETCH',
        description: 'Anisotropic trench etch for oxide/metal layers and photoresist strip.',
        requiredChecksCount: 3,
        qualifiedEquipmentIds: ['eq-etch-01', 'eq-etch-02'],
      },
      {
        id: 'op-400',
        stepNumber: 400,
        operationCode: 'CMP-POLISH-40',
        name: 'Chemical Mechanical Planarization',
        workCenter: 'WC-CMP',
        description: 'Slurry polishing to flatten dielectric layers with inline thickness sensor.',
        requiredChecksCount: 2,
        qualifiedEquipmentIds: ['eq-cmp-01'],
      },
      {
        id: 'op-500',
        stepNumber: 500,
        operationCode: 'METRO-CD-50',
        name: 'Critical Dimension & Overlay Inspection',
        workCenter: 'WC-METROLOGY',
        description: 'CD-SEM linewidth measurement and overlay error registration check.',
        requiredChecksCount: 5,
        qualifiedEquipmentIds: ['eq-kla-01'],
      },
      {
        id: 'op-600',
        stepNumber: 600,
        operationCode: 'SORT-CP1-60',
        name: 'Wafer Probe Sort (CP1 Electrical Test)',
        workCenter: 'WC-SORT',
        description: 'Full die electrical parametric test, binning, and wafer map generation.',
        requiredChecksCount: 6,
        qualifiedEquipmentIds: ['eq-sort-01', 'eq-sort-02'],
      },
    ],
  },
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-litho-01',
    code: 'LITHO-ASML-01',
    name: 'ASML Twinscan NXT:1980Di Scanner',
    type: 'Photo Lithography',
    vendor: 'ASML',
    model: 'NXT:1980Di',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area A - Lithography Bay',
    status: 'Processing',
    chambers: [
      { id: 'ch-l1-a', name: 'Exposure Main Lens Chamber', status: 'Active' },
      { id: 'ch-l1-b', name: 'Wafer Track Coater B', status: 'Active' },
    ],
    lastMaintenanceDate: '2026-07-28',
    nextCalibrationDueDate: '2026-08-28',
    heartbeatAgeSeconds: 3,
  },
  {
    id: 'eq-etch-01',
    code: 'ETCH-LAM-01',
    name: 'Lam Research Kiyo FX Plasma Etcher',
    type: 'Plasma Etch',
    vendor: 'Lam Research',
    model: 'Kiyo FX',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area B - Etch Bay',
    status: 'Hold',
    chambers: [
      { id: 'ch-e1-a', name: 'Chamber A (Conductor Etch)', status: 'Active' },
      { id: 'ch-e1-b', name: 'Chamber B (Oxide Etch)', status: 'Under Excursion Hold' },
    ],
    lastMaintenanceDate: '2026-08-01',
    nextCalibrationDueDate: '2026-08-15',
    heartbeatAgeSeconds: 5,
  },
  {
    id: 'eq-cmp-01',
    code: 'CMP-AMAT-01',
    name: 'Applied Materials Reflexion LK CMP',
    type: 'CMP',
    vendor: 'Applied Materials',
    model: 'Reflexion LK',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area C - CMP Bay',
    status: 'Processing',
    chambers: [
      { id: 'ch-c1-a', name: 'Platen 1 (Oxide)', status: 'Active' },
      { id: 'ch-c1-b', name: 'Platen 2 (Copper)', status: 'Active' },
    ],
    lastMaintenanceDate: '2026-07-15',
    nextCalibrationDueDate: '2026-08-12',
    heartbeatAgeSeconds: 2,
  },
  {
    id: 'eq-kla-01',
    code: 'METRO-KLA-01',
    name: 'KLA 2935 Defect & CD Inspector',
    type: 'Metrology',
    vendor: 'KLA',
    model: '2935 Broadband',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area D - Metrology Bay',
    status: 'Processing',
    chambers: [{ id: 'ch-k1-a', name: 'Main Optical Chamber', status: 'Active' }],
    lastMaintenanceDate: '2026-07-20',
    nextCalibrationDueDate: '2026-08-20',
    heartbeatAgeSeconds: 4,
  },
  {
    id: 'eq-sort-01',
    code: 'SORT-TEL-01',
    name: 'Tokyo Electron Premio Wafer Prober',
    type: 'Wafer Sort',
    vendor: 'TEL',
    model: 'Premio FX',
    site: 'Fab 1 - Dresden',
    area: 'Sort Bay 01',
    status: 'Processing',
    chambers: [{ id: 'ch-s1-a', name: 'Probe Card Station 1', status: 'Active' }],
    lastMaintenanceDate: '2026-08-02',
    nextCalibrationDueDate: '2026-09-02',
    heartbeatAgeSeconds: 1,
  },
];

export const INITIAL_SPECIFICATIONS: SpecificationLimit[] = [
  {
    id: 'spec-1',
    parameterName: 'Critical Dimension (CD)',
    operationCode: 'LITHO-DUV-20',
    productCode: 'ST-SOC-7NM',
    unit: 'nm',
    target: 14.0,
    lsl: 13.0,
    usl: 15.0,
    lcl: 13.3,
    ucl: 14.7,
    effectiveDate: '2026-01-01',
    version: '2.1',
  },
  {
    id: 'spec-2',
    parameterName: 'Oxide Thickness',
    operationCode: 'CMP-POLISH-40',
    productCode: 'ST-SOC-7NM',
    unit: 'Å (Angstrom)',
    target: 450,
    lsl: 420,
    usl: 480,
    lcl: 430,
    ucl: 470,
    effectiveDate: '2026-01-01',
    version: '1.4',
  },
  {
    id: 'spec-3',
    parameterName: 'Etch Depth Uniformity',
    operationCode: 'ETCH-RIE-30',
    productCode: 'ST-SOC-7NM',
    unit: 'nm',
    target: 85.0,
    lsl: 80.0,
    usl: 90.0,
    lcl: 81.5,
    ucl: 88.5,
    effectiveDate: '2026-02-15',
    version: '3.0',
  },
  {
    id: 'spec-4',
    parameterName: 'Overlay Registration Error',
    operationCode: 'METRO-CD-50',
    productCode: 'ST-SOC-7NM',
    unit: 'nm',
    target: 0.0,
    lsl: -3.0,
    usl: 3.0,
    lcl: -2.0,
    ucl: 2.0,
    effectiveDate: '2026-03-01',
    version: '1.2',
  },
];

export const INITIAL_HOLDS: HoldRecord[] = [
  {
    id: 'hold-8804',
    holdCode: 'HLD-2026-0941',
    lotCode: 'LOT-2026-8804',
    waferSerials: ['WAF-8804-01', 'WAF-8804-02', 'WAF-8804-03', 'WAF-8804-04', 'WAF-8804-05'],
    severity: 'S1 - Critical',
    reason: 'Etch Chamber B pressure instability caused severe edge ring die failures during ETCH-RIE-30.',
    originatingSignalId: 'sig-101',
    initiatedBy: 'Automated Rule Engine (SP-006)',
    initiatedAt: '2026-08-03 14:22:10',
    status: 'Active',
    affectedPopulationCount: 25,
    synchronizationStatus: 'Synchronized with MES',
  },
  {
    id: 'hold-8802',
    holdCode: 'HLD-2026-0938',
    lotCode: 'LOT-2026-8802',
    waferSerials: ['WAF-8802-12', 'WAF-8802-13', 'WAF-8802-14'],
    severity: 'S2 - High',
    reason: 'Parametric test CP1 threshold shift detected during wafer probe sort.',
    originatingSignalId: 'sig-102',
    initiatedBy: 'Kenji Sato (QA Engineer)',
    initiatedAt: '2026-08-03 11:05:40',
    status: 'Under Investigation',
    affectedPopulationCount: 12,
    synchronizationStatus: 'Synchronized with MES',
  },
];

export const INITIAL_NCRS: NonconformanceRecord[] = [
  {
    id: 'ncr-101',
    ncrCode: 'NCR-2026-0412',
    holdId: 'hold-8804',
    lotCode: 'LOT-2026-8804',
    productCode: 'ST-SOC-7NM',
    operationCode: 'ETCH-RIE-30',
    equipmentCode: 'ETCH-LAM-01 (Chamber B)',
    severity: 'S1 - Critical',
    problemStatement:
      'Wafer sort map for LOT-2026-8804 showed an extreme Edge Ring defect pattern with 34% yield loss across all 25 wafers processed on ETCH-LAM-01 Chamber B.',
    containmentAction: 'Automated hold placed on LOT-2026-8804 and 3 downstream buffer lots. Chamber B removed from qualification matrix.',
    rootCauseMethod: '5 Whys',
    whys: [
      '1. Why did yield drop by 34%? -> Wafers exhibited heavy die breakdown at the outer 15mm perimeter.',
      '2. Why did die breakdown occur at the outer perimeter? -> Plasma etch rate was 28% higher at the wafer edge.',
      '3. Why was etch rate higher at wafer edge? -> Focus ring seal thermal regulation degraded during plasma run.',
      '4. Why did the focus ring seal degrade? -> Silicone O-ring degraded due to precursor gas corrosion beyond service lifetime.',
      '5. Root Cause: Preventative maintenance schedule for focus ring O-ring seal failed to adjust for corrosive fluorine gas chemistry.',
    ],
    fishbone: {
      machine: ['Focus ring seal degradation on Chamber B', 'RF impedance mismatch at high power'],
      method: ['PM interval set to calendar days instead of RF power hours'],
      material: ['Batch raw wafer supplier silicon resistivity within spec'],
      manpower: ['Operator followed standard recipe correctly'],
      measurement: ['KLA Metrology tool calibrated accurately'],
      environment: ['Cleanroom temperature 21.0C, humidity 44% OK'],
    },
    candidateCause: 'Focus ring seal degradation causing RF edge field distortion.',
    verifiedRootCause: 'O-ring seal chemical degradation leading to edge plasma density runaway.',
    disposition: 'Rework',
    reworkInstructions: 'Rework step RW-302: Strip upper passivation layer, re-cleave edge bevel, and re-run Litho-20 mask layer with edge compensation recipe.',
    mrbApprovals: [
      { role: 'QA Manager', approverName: 'Dr. Elena Vance', decision: 'Approved', timestamp: '2026-08-04 02:15', rationale: 'Rework plan verified by Process Engineering with zero substrate damage risk.', signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { role: 'Process Engineering Owner', approverName: 'Marcus Brody', decision: 'Approved', timestamp: '2026-08-04 02:20', rationale: 'RW-302 recipe qualification test passed on dummy wafer.', signatureHash: 'f48202597950c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991' },
      { role: 'Manufacturing Director', approverName: 'Sarah Miller', decision: 'Approved', timestamp: '2026-08-04 03:00', rationale: 'Rework approved for execution during Shift 1.', signatureHash: '1a950e97298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b' },
    ],
    status: 'MRB Review',
    createdAt: '2026-08-03 14:45:00',
  },
];

export const INITIAL_CAPAS: CAPARecord[] = [
  {
    id: 'capa-201',
    capaCode: 'CAPA-2026-0088',
    ncrCode: 'NCR-2026-0412',
    title: 'Dynamic RF-Hour PM Scheduling for Plasma Etch Chamber Seals',
    ownerName: 'David Chen (Equipment Engineer)',
    problemSummary: 'Etch chamber focus ring degradation caused high-severity edge ring defect excursions under high-power recipe usage.',
    correctiveActions: [
      {
        id: 'ca-1',
        description: 'Replace focus ring assembly and fluorocarbon O-rings on ETCH-LAM-01 Chamber B.',
        assignee: 'David Chen',
        dueDate: '2026-08-05',
        status: 'Completed',
      },
      {
        id: 'ca-2',
        description: 'Update CMMS maintenance rule to trigger focus ring inspection every 150 RF power hours instead of 30 calendar days.',
        assignee: 'David Chen',
        dueDate: '2026-08-10',
        status: 'In Progress',
      },
    ],
    preventiveActions: [
      {
        id: 'pa-1',
        description: 'Implement real-time SPC alarm on Chamber B edge-to-center etch rate ratio in SiliconTrack.',
        assignee: 'Marcus Brody',
        dueDate: '2026-08-12',
        status: 'In Progress',
      },
    ],
    targetEffectivenessDate: '2026-09-01',
    effectivenessVerified: false,
    effectivenessNotes: 'Will monitor zero edge ring defect excursions over 50 consecutive production lots post-PM rule update.',
    status: 'Implementation',
    createdAt: '2026-08-04 03:30:00',
  },
];

// Helper to generate realistic 20x20 die grid wafer maps
export function generateWaferMap(
  waferSerial: string,
  lotCode: string,
  spatialSignature: 'edge_ring' | 'center_cluster' | 'scratch' | 'repeating_pattern' | 'none'
): WaferMap {
  const size = 20;
  const dieGrid: DieData[] = [];
  let pass = 0;
  let fail = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - size / 2 + 0.5;
      const dy = y - size / 2 + 0.5;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      // Silicon circular wafer boundary check (radius ~ 9.2 units)
      if (distFromCenter > 9.5) {
        continue; // Excluded outer die
      }

      let isFail = false;
      let binCode = 1;
      let binName = 'Pass (Bin 1)';
      let binColor = '#10B981'; // Green
      let defectClass = 'None';
      let measVal = 14.0 + (Math.random() * 0.4 - 0.2);

      // Apply Spatial Signatures
      if (spatialSignature === 'edge_ring' && distFromCenter > 7.5) {
        if (Math.random() < 0.82) {
          isFail = true;
          binCode = 3;
          binName = 'Die Edge Defect (Bin 3)';
          binColor = '#EF4444'; // Red
          defectClass = 'Plasma Edge Burn';
          measVal = 15.6 + Math.random() * 0.5; // Out of spec
        }
      } else if (spatialSignature === 'center_cluster' && distFromCenter < 3.2) {
        if (Math.random() < 0.75) {
          isFail = true;
          binCode = 2;
          binName = 'Parametric Fail (Bin 2)';
          binColor = '#F59E0B'; // Amber
          defectClass = 'CMP Slurry Pool';
          measVal = 12.6 - Math.random() * 0.4;
        }
      } else if (spatialSignature === 'scratch' && Math.abs(x - y) <= 1 && distFromCenter < 7.0) {
        if (Math.random() < 0.88) {
          isFail = true;
          binCode = 4;
          binName = 'Particle Scratch (Bin 4)';
          binColor = '#8B5CF6'; // Purple
          defectClass = 'Handling Scratch';
        }
      } else if (spatialSignature === 'repeating_pattern' && x % 4 === 0 && y % 4 === 0) {
        isFail = true;
        binCode = 5;
        binName = 'Gross Short (Bin 5)';
        binColor = '#EC4899'; // Pink
        defectClass = 'Reticle Repeating Failure';
      } else {
        // Random background defect rate ~ 2%
        if (Math.random() < 0.02) {
          isFail = true;
          binCode = 2;
          binName = 'Parametric Fail (Bin 2)';
          binColor = '#F59E0B';
          defectClass = 'Random Defect';
        }
      }

      if (isFail) {
        fail++;
      } else {
        pass++;
      }

      dieGrid.push({
        x,
        y,
        binCode,
        binName,
        binColor,
        measurementValue: Number(measVal.toFixed(2)),
        defectClass,
      });
    }
  }

  const total = pass + fail;
  const yieldPct = Number(((pass / total) * 100).toFixed(1));

  return {
    id: `map-${waferSerial}`,
    waferSerial,
    lotCode,
    operationCode: 'SORT-CP1-60',
    equipmentCode: 'SORT-TEL-01',
    recipeCode: 'REC-SORT-7NM-V2',
    gridWidth: size,
    gridHeight: size,
    notchPosition: 'Bottom',
    dieGrid,
    passCount: pass,
    failCount: fail,
    yieldPercent: yieldPct,
    spatialSignature,
    createdAt: '2026-08-03 14:00:00',
  };
}

export const INITIAL_LOTS: Lot[] = [
  {
    id: 'lot-8801',
    lotCode: 'LOT-2026-8801',
    productId: 'prod-1',
    productCode: 'ST-SOC-7NM',
    productName: 'Helios-7nm Mobile AP',
    quantityWafers: 25,
    routeId: 'route-7nm-main',
    currentOperationCode: 'SORT-CP1-60',
    currentOperationName: 'Wafer Probe Sort (CP1 Electrical Test)',
    currentEquipmentCode: 'SORT-TEL-01',
    carrierId: 'FOUP-A102',
    status: 'completed',
    priority: 'Normal',
    site: 'Fab 1 - Dresden',
    area: 'Sort Bay 01',
    supplierLotCode: 'SUP-SILICON-2026-089',
    supplierName: 'GlobalWafers Co.',
    createdAt: '2026-08-01 08:00:00',
    updatedAt: '2026-08-03 16:30:00',
    activeHoldIds: [],
    yieldPercent: 94.2,
  },
  {
    id: 'lot-8802',
    lotCode: 'LOT-2026-8802',
    productId: 'prod-1',
    productCode: 'ST-SOC-7NM',
    productName: 'Helios-7nm Mobile AP',
    parentLotId: 'lot-8801',
    splitReason: 'Split Lot A for Engineering Parameter Evaluation',
    quantityWafers: 12,
    routeId: 'route-7nm-main',
    currentOperationCode: 'SORT-CP1-60',
    currentOperationName: 'Wafer Probe Sort (CP1 Electrical Test)',
    currentEquipmentCode: 'SORT-TEL-01',
    carrierId: 'FOUP-A109',
    status: 'awaiting_disposition',
    priority: 'High',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area D',
    supplierLotCode: 'SUP-SILICON-2026-089',
    supplierName: 'GlobalWafers Co.',
    createdAt: '2026-08-02 10:15:00',
    updatedAt: '2026-08-03 11:05:00',
    activeHoldIds: ['hold-8802'],
    yieldPercent: 86.4,
  },
  {
    id: 'lot-8803',
    lotCode: 'LOT-2026-8803',
    productId: 'prod-1',
    productCode: 'ST-SOC-7NM',
    productName: 'Helios-7nm Mobile AP',
    parentLotId: 'lot-8801',
    splitReason: 'Rework Pass for CMP Oxide Re-planarization',
    quantityWafers: 13,
    routeId: 'route-7nm-main',
    currentOperationCode: 'CMP-POLISH-40',
    currentOperationName: 'Chemical Mechanical Planarization',
    currentEquipmentCode: 'CMP-AMAT-01',
    carrierId: 'FOUP-B204',
    status: 'rework',
    priority: 'Hot Rush',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area C',
    supplierLotCode: 'SUP-SILICON-2026-089',
    supplierName: 'GlobalWafers Co.',
    createdAt: '2026-08-02 11:30:00',
    updatedAt: '2026-08-04 01:20:00',
    activeHoldIds: [],
    yieldPercent: 91.0,
  },
  {
    id: 'lot-8804',
    lotCode: 'LOT-2026-8804',
    productId: 'prod-1',
    productCode: 'ST-SOC-7NM',
    productName: 'Helios-7nm Mobile AP',
    quantityWafers: 25,
    routeId: 'route-7nm-main',
    currentOperationCode: 'ETCH-RIE-30',
    currentOperationName: 'Reactive Ion Plasma Etch',
    currentEquipmentCode: 'ETCH-LAM-01',
    carrierId: 'FOUP-C301',
    status: 'hold',
    priority: 'High',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area B',
    supplierLotCode: 'SUP-SILICON-2026-092',
    supplierName: 'Siltronic AG',
    createdAt: '2026-08-03 06:00:00',
    updatedAt: '2026-08-03 14:22:00',
    activeHoldIds: ['hold-8804'],
    yieldPercent: 66.0,
  },
  {
    id: 'lot-8805',
    lotCode: 'LOT-2026-8805',
    productId: 'prod-2',
    productCode: 'ST-NAND-3D-128L',
    productName: 'V-NAND 128L 512Gb Flash',
    quantityWafers: 25,
    routeId: 'route-nand-128',
    currentOperationCode: 'LITHO-DUV-20',
    currentOperationName: 'EUV/DUV Photo-Lithography Masking',
    currentEquipmentCode: 'LITHO-ASML-01',
    carrierId: 'FOUP-D402',
    status: 'processing',
    priority: 'Normal',
    site: 'Fab 1 - Dresden',
    area: 'Cleanroom Area A',
    supplierLotCode: 'SUP-SILICON-2026-101',
    supplierName: 'SUMCO Corporation',
    createdAt: '2026-08-03 18:00:00',
    updatedAt: '2026-08-04 03:00:00',
    activeHoldIds: [],
    yieldPercent: 95.8,
  },
];

export const INITIAL_SPC_POINTS: SPCPoint[] = [
  { id: 'spc-1', timestamp: '08-03 08:00', sampleId: 'S-101', lotCode: 'LOT-2026-8801', value: 13.98, mean: 14.0, ucl: 14.7, lcl: 13.3, usl: 15.0, lsl: 13.0, violatedRules: [] },
  { id: 'spc-2', timestamp: '08-03 09:30', sampleId: 'S-102', lotCode: 'LOT-2026-8801', value: 14.05, mean: 14.0, ucl: 14.7, lcl: 13.3, usl: 15.0, lsl: 13.0, violatedRules: [] },
  { id: 'spc-3', timestamp: '08-03 11:00', sampleId: 'S-103', lotCode: 'LOT-2026-8802', value: 14.22, mean: 14.0, ucl: 14.7, lcl: 13.3, usl: 15.0, lsl: 13.0, violatedRules: [] },
  { id: 'spc-4', timestamp: '08-03 12:30', sampleId: 'S-104', lotCode: 'LOT-2026-8802', value: 14.48, mean: 14.0, ucl: 14.7, lcl: 13.3, usl: 15.0, lsl: 13.0, violatedRules: ['Rule 3: 6 consecutive points increasing'] },
  { id: 'spc-5', timestamp: '08-03 14:00', sampleId: 'S-105', lotCode: 'LOT-2026-8804', value: 14.92, mean: 14.0, ucl: 14.7, lcl: 13.3, usl: 15.0, lsl: 13.0, violatedRules: ['Rule 1: 1 point > 3 sigma (UCL Exceeded)'] },
  { id: 'spc-6', timestamp: '08-03 15:30', sampleId: 'S-106', lotCode: 'LOT-2026-8804', value: 15.21, mean: 14.0, ucl: 14.7, lcl: 13.3, usl: 15.0, lsl: 13.0, violatedRules: ['Rule 1: 1 point > USL Spec Limit Exceeded'] },
];

export const INITIAL_SPC_SIGNALS: SPCSignal[] = [
  {
    id: 'sig-101',
    chartName: 'CD Linewidth Control Chart - Etch Chamber B',
    parameterName: 'Critical Dimension (CD)',
    operationCode: 'ETCH-RIE-30',
    equipmentCode: 'ETCH-LAM-01',
    recipeCode: 'REC-ETCH-OXIDE-V2',
    severity: 'S1 - Critical',
    ruleViolated: 'Rule 1: 1 point > 3 Sigma (Value 14.92nm > UCL 14.70nm)',
    lotCode: 'LOT-2026-8804',
    status: 'Active',
    timestamp: '2026-08-03 14:22:10',
    cpk: 0.62, // Poor process capability during drift
  },
  {
    id: 'sig-102',
    chartName: 'CP1 Parametric Threshold Shift Chart',
    parameterName: 'Sheet Resistance Rs',
    operationCode: 'SORT-CP1-60',
    equipmentCode: 'SORT-TEL-01',
    recipeCode: 'REC-SORT-7NM-V2',
    severity: 'S2 - High',
    ruleViolated: 'Rule 2: 8 consecutive points on one side of center line',
    lotCode: 'LOT-2026-8802',
    status: 'Acknowledged',
    timestamp: '2026-08-03 11:05:00',
    acknowledgedBy: 'Kenji Sato',
    acknowledgedAt: '2026-08-03 11:20:00',
    cpk: 1.15,
  },
];

export const INITIAL_INTEGRATION_MESSAGES: IntegrationMessage[] = [
  {
    id: 'msg-1',
    eventId: 'evt-20260804-00192',
    eventType: 'quality.measurement.recorded.v1',
    sourceSystem: 'SECS/GEM',
    equipmentId: 'LITHO-ASML-01',
    lotCode: 'LOT-2026-8805',
    status: 'Processed',
    receivedAt: '2026-08-04 03:58:12',
    processedAt: '2026-08-04 03:58:13',
    payloadSnippet: '{"step": "LITHO-20", "cd_value": 14.02, "dose_mJ": 24.5, "focus_offset_nm": -1.2}',
  },
  {
    id: 'msg-2',
    eventId: 'evt-20260804-00191',
    eventType: 'equipment.alarm.triggered.v1',
    sourceSystem: 'OPC-UA',
    equipmentId: 'ETCH-LAM-01',
    lotCode: 'LOT-2026-8804',
    status: 'Processed',
    receivedAt: '2026-08-03 14:21:55',
    processedAt: '2026-08-03 14:22:00',
    payloadSnippet: '{"alarm_code": "ALM-ETCH-882", "description": "Chamber B Pressure Differential Warning", "severity": "HIGH"}',
  },
  {
    id: 'msg-3',
    eventId: 'evt-20260804-00188',
    eventType: 'quality.result.ingest.error.v1',
    sourceSystem: 'LIMS',
    equipmentId: 'METRO-KLA-01',
    lotCode: 'LOT-2026-8899-UNKNOWN',
    status: 'Quarantined',
    receivedAt: '2026-08-04 01:10:00',
    errorMessage: 'Unresolved Lot Identity Mapping: Lot Code LOT-2026-8899-UNKNOWN not found in Active WIP Registry.',
    payloadSnippet: '{"raw_file": "KLA_EXPORT_20260804_0110.csv", "sample_count": 50, "unmapped_key": "8899-UNKNOWN"}',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-101',
    timestamp: '2026-08-04 03:00:00',
    userId: 'usr-7',
    userName: 'Sarah Miller',
    userRole: 'Production Manager',
    action: 'MRB Disposition Signoff',
    entityType: 'NonconformanceRecord',
    entityId: 'NCR-2026-0412',
    previousState: 'Open',
    newState: 'Dispositioned - Rework RW-302',
    reason: 'Approved for Rework Execution during Shift 1 following successful test dummy run.',
    ipAddress: '10.20.4.112',
    site: 'Fab 1 - Dresden',
  },
  {
    id: 'aud-100',
    timestamp: '2026-08-03 14:22:10',
    userId: 'sys-rule-engine',
    userName: 'Automated Rule Engine',
    userRole: 'System Administrator',
    action: 'Automated Hold Placement',
    entityType: 'HoldRecord',
    entityId: 'HLD-2026-0941',
    previousState: 'Active WIP',
    newState: 'Hold (S1 - Critical)',
    reason: 'Rule SP-006 Excursion on Etch Chamber B CD linewidth (Value 14.92nm > UCL 14.70nm).',
    ipAddress: '127.0.0.1',
    site: 'Fab 1 - Dresden',
  },
];

export const INITIAL_KPIS: QualityKPIs = {
  firstPassYield: 91.8,
  finalYield: 94.6,
  rolledThroughputYield: 88.4,
  defectDensity: 0.042, // defects / cm^2
  scrapRate: 0.82, // %
  reworkRate: 2.15, // %
  holdRate: 1.4, // %
  meanTimeToDetectMinutes: 14.2,
  meanTimeToContainMinutes: 4.8,
  dispositionCycleTimeHours: 6.2,
  activeHoldsCount: 2,
  openNCRsCount: 1,
  openCAPAsCount: 1,
  dataCompletenessScore: 99.4,
};
