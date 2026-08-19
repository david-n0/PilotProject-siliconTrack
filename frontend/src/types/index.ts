/**
 * SiliconTrack - Semiconductor Quality, Production Intelligence & Traceability System
 * Domain Types Definition
 */

export type UserRole =
  | 'Operator'
  | 'QA Inspector'
  | 'QA Engineer'
  | 'QA Manager'
  | 'Process Engineer'
  | 'Equipment Engineer'
  | 'Production Manager'
  | 'System Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  site: string;
  department: string;
  avatar?: string;
}

export type LotStatus =
  | 'created'
  | 'released'
  | 'processing'
  | 'awaiting_disposition'
  | 'hold'
  | 'rework'
  | 'completed'
  | 'shipped'
  | 'rejected';

export type HoldSeverity = 'S1 - Critical' | 'S2 - High' | 'S3 - Medium' | 'S4 - Low';

export interface Product {
  id: string;
  code: string;
  name: string;
  revision: string;
  technologyNode: string; // e.g. "7nm FinFET", "128L 3D NAND"
  packageType: string;
  targetYieldPercent: number;
  lifecycleState: 'NPI' | 'Ramp' | 'Production' | 'EOL';
  routeId: string;
}

export interface RouteOperation {
  id: string;
  stepNumber: number;
  operationCode: string;
  name: string;
  workCenter: string;
  description: string;
  requiredChecksCount: number;
  qualifiedEquipmentIds: string[];
}

export interface Route {
  id: string;
  code: string;
  version: string;
  name: string;
  operations: RouteOperation[];
  effectiveDate: string;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  type: string; // "Photo Lithography", "Plasma Etch", "CVD", "CMP", "Wafer Sort"
  vendor: string;
  model: string;
  site: string;
  area: string;
  status: 'Processing' | 'Idle' | 'Maintenance' | 'Hold' | 'Calibrating';
  chambers: { id: string; name: string; status: string }[];
  lastMaintenanceDate: string;
  nextCalibrationDueDate: string;
  heartbeatAgeSeconds: number;
}

export interface Recipe {
  id: string;
  code: string;
  version: string;
  equipmentTypeId: string;
  productCode: string;
  parameters: { name: string; value: string | number; unit: string }[];
}

export interface SubstrateWafer {
  id: string;
  waferSerial: string;
  lotId: string;
  slotNumber: number;
  diameterMm: number;
  currentCarrierId?: string;
  status: 'Good' | 'Defective' | 'Held' | 'Scrapped';
  passDieCount: number;
  failDieCount: number;
  totalDieCount: number;
  yieldPercent: number;
  spatialSignature?: 'edge_ring' | 'center_cluster' | 'scratch' | 'repeating_pattern' | 'none';
}

export interface Lot {
  id: string;
  lotCode: string;
  productId: string;
  productCode: string;
  productName: string;
  parentLotId?: string;
  splitReason?: string;
  quantityWafers: number;
  routeId: string;
  currentOperationCode: string;
  currentOperationName: string;
  currentEquipmentCode?: string;
  carrierId?: string;
  status: LotStatus;
  priority: 'Normal' | 'High' | 'Hot Rush';
  site: string;
  area: string;
  supplierLotCode?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
  activeHoldIds: string[];
  yieldPercent: number;
}

export interface DieData {
  x: number;
  y: number;
  binCode: number; // 1: Pass, 2: Parametric Fail, 3: Die Edge Defect, 4: Scratch/Particle, 5: Gross Short
  binName: string;
  binColor: string;
  measurementValue?: number;
  defectClass?: string;
}

export interface WaferMap {
  id: string;
  waferSerial: string;
  lotCode: string;
  operationCode: string;
  equipmentCode: string;
  recipeCode: string;
  gridWidth: number;
  gridHeight: number;
  notchPosition: 'Bottom' | 'Top' | 'Left' | 'Right';
  dieGrid: DieData[];
  passCount: number;
  failCount: number;
  yieldPercent: number;
  spatialSignature: 'edge_ring' | 'center_cluster' | 'scratch' | 'repeating_pattern' | 'none';
  createdAt: string;
}

export interface SpecificationLimit {
  id: string;
  parameterName: string;
  operationCode: string;
  productCode: string;
  unit: string;
  target: number;
  lsl: number; // Lower Spec Limit
  usl: number; // Upper Spec Limit
  lcl: number; // Lower Control Limit
  ucl: number; // Upper Control Limit
  effectiveDate: string;
  version: string;
}

export interface QualityResult {
  id: string;
  lotCode: string;
  waferSerial?: string;
  operationCode: string;
  equipmentCode: string;
  recipeCode: string;
  parameterName: string;
  value: number;
  unit: string;
  target: number;
  lsl: number;
  usl: number;
  lcl: number;
  ucl: number;
  status: 'Pass' | 'Warning' | 'Fail';
  recordedBy: string;
  recordedAt: string;
  notes?: string;
  sampleSize: number;
}

export interface SPCPoint {
  id: string;
  timestamp: string;
  sampleId: string;
  lotCode: string;
  waferSerial?: string;
  value: number;
  mean: number;
  ucl: number;
  lcl: number;
  usl: number;
  lsl: number;
  violatedRules: string[];
}

export interface SPCSignal {
  id: string;
  chartName: string;
  parameterName: string;
  operationCode: string;
  equipmentCode: string;
  recipeCode: string;
  severity: HoldSeverity;
  ruleViolated: string; // e.g. "Rule 1: 1 point > 3 sigma", "Rule 2: 8 consecutive points above center line"
  lotCode: string;
  waferSerial?: string;
  status: 'Active' | 'Acknowledged' | 'Contained' | 'Resolved';
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  cpk: number;
}

export interface HoldRecord {
  id: string;
  holdCode: string;
  lotCode: string;
  waferSerials: string[];
  severity: HoldSeverity;
  reason: string;
  originatingSignalId?: string;
  initiatedBy: string;
  initiatedAt: string;
  status: 'Active' | 'Under Investigation' | 'Released' | 'Scrapped';
  affectedPopulationCount: number;
  synchronizationStatus: 'Synchronized with MES' | 'Pending Sync' | 'Failed Sync';
  releasedBy?: string;
  releasedAt?: string;
  releaseRationale?: string;
}

export interface NonconformanceRecord {
  id: string;
  ncrCode: string;
  holdId: string;
  lotCode: string;
  productCode: string;
  operationCode: string;
  equipmentCode: string;
  severity: HoldSeverity;
  problemStatement: string;
  containmentAction: string;
  rootCauseMethod?: '5 Whys' | 'Fishbone' | 'Data Correlation';
  whys?: string[];
  fishbone?: {
    machine: string[];
    method: string[];
    material: string[];
    manpower: string[];
    measurement: string[];
    environment: string[];
  };
  candidateCause?: string;
  verifiedRootCause?: string;
  disposition: 'Pending MRB' | 'Release' | 'Rework' | 'Use-As-Is' | 'Downgrade' | 'Scrap' | 'Return to Vendor';
  reworkInstructions?: string;
  mrbApprovals: {
    role: string;
    approverName: string;
    decision: 'Approved' | 'Rejected' | 'Pending';
    timestamp?: string;
    rationale?: string;
    signatureHash?: string;
  }[];
  status: 'Open' | 'MRB Review' | 'Dispositioned' | 'Closed';
  createdAt: string;
  closedAt?: string;
}

export interface CAPARecord {
  id: string;
  capaCode: string;
  ncrCode: string;
  title: string;
  ownerName: string;
  problemSummary: string;
  correctiveActions: {
    id: string;
    description: string;
    assignee: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }[];
  preventiveActions: {
    id: string;
    description: string;
    assignee: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }[];
  targetEffectivenessDate: string;
  effectivenessVerified: boolean;
  effectivenessNotes?: string;
  status: 'Open' | 'Implementation' | 'Verification' | 'Closed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  ipAddress: string;
  site: string;
}

export interface IntegrationMessage {
  id: string;
  eventId: string;
  eventType: string;
  sourceSystem: 'MES' | 'SECS/GEM' | 'OPC-UA' | 'LIMS' | 'ERP' | 'CMMS';
  equipmentId?: string;
  lotCode?: string;
  status: 'Processed' | 'Buffered' | 'Quarantined' | 'Replayed';
  receivedAt: string;
  processedAt?: string;
  errorMessage?: string;
  payloadSnippet: string;
}

export interface QualityKPIs {
  firstPassYield: number;
  finalYield: number;
  rolledThroughputYield: number;
  defectDensity: number;
  scrapRate: number;
  reworkRate: number;
  holdRate: number;
  meanTimeToDetectMinutes: number;
  meanTimeToContainMinutes: number;
  dispositionCycleTimeHours: number;
  activeHoldsCount: number;
  openNCRsCount: number;
  openCAPAsCount: number;
  dataCompletenessScore: number;
}
