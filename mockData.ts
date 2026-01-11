
import { ConsentPurpose, ConsentArtifact, ConsentStatus, Grievance, AuditLog, Fiduciary, PrivacyNotice } from './types';

export const FIDUCIARIES: Fiduciary[] = [
  { 
    id: 'fid-1', 
    name: 'BharatHealth Diagnostics', 
    category: 'Healthcare', 
    logo: 'BH', 
    description: 'National diagnostic network specializing in genomic data and blood reports.', 
    contactEmail: 'dpo@bharathealth.in',
    complianceScore: 92
  },
  { 
    id: 'fid-2', 
    name: 'RupeeSwift Payments', 
    category: 'Finance', 
    logo: 'RS', 
    description: 'Next-gen UPI and credit platform with real-time risk assessment.', 
    contactEmail: 'privacy@rupeeswift.com',
    complianceScore: 88
  },
  { 
    id: 'fid-3', 
    name: 'IndiCart Logistics', 
    category: 'E-commerce', 
    logo: 'IC', 
    description: 'Hyper-local delivery service for electronics and fresh produce.', 
    contactEmail: 'compliance@indicart.in',
    complianceScore: 74
  },
  { 
    id: 'fid-4', 
    name: 'GuruLearn Kids', 
    category: 'EdTech', 
    logo: 'GL', 
    description: 'K-12 learning platform strictly following Section 9 guidelines for minors.', 
    contactEmail: 'guardian@gurulearn.edu', 
    isChildApp: true,
    complianceScore: 98
  }
];

export const PURPOSES: ConsentPurpose[] = [
  { id: 'p1', name: 'Identity KYC', description: 'Mandatory verification per RBI/Govt guidelines using Aadhaar or PAN.', isMandatory: true },
  { id: 'p2', name: 'Personalized Offers', description: 'Using browsing history to show relevant product discounts.', isMandatory: false },
  { id: 'p3', name: 'Service Analytics', description: 'Internal monitoring to fix bugs and improve UI performance.', isMandatory: false },
  { id: 'p4', name: 'Partner Integration', description: 'Sharing address data with 3rd party couriers for delivery.', isMandatory: false },
  { id: 'p5', name: 'Academic Progress', description: 'Tracking student scores for educational reports. No behavioral monitoring.', isMandatory: true, isChildSensitive: true }
];

export const CASE_STUDIES = [
  {
    title: "Section 5: The Right to Notice",
    description: "Experience how a Data Fiduciary must present clear, granular processing purposes to a citizen.",
    actReference: "Sec 5: Notice",
    link: "create",
    prefill: "fid-2"
  },
  {
    title: "Section 9: Parental Protection",
    description: "Step into the flow of GuruLearn Kids, requiring verifiable parental consent before processing a minor's data.",
    actReference: "Sec 9: Child Data",
    link: "create",
    prefill: "fid-4"
  },
  {
    title: "Section 6: Consent Withdrawal",
    description: "See how citizens can exercise their right to 'stop' data processing as easily as they started it.",
    actReference: "Sec 6(4): Withdrawal",
    link: "view"
  },
  {
    title: "Section 13: Grievance Redressal",
    description: "A full audit of a dispute: From a user filing a complaint to a DPO resolving it with a formal response.",
    actReference: "Sec 13: Redressal",
    link: "grievances"
  }
];

export const INITIAL_CONSENTS: ConsentArtifact[] = [
  {
    id: 'ART-88219',
    userId: 'user-123',
    fiduciaryId: 'fid-1',
    purposes: ['p1', 'p3'],
    status: ConsentStatus.ACTIVE,
    timestamp: '2023-11-20T14:20:00Z',
    expiryDate: '2025-11-20T14:20:00Z',
    hash: '8F2E34B991C...'
  },
  {
    id: 'ART-00221',
    userId: 'user-123',
    fiduciaryId: 'fid-3',
    purposes: ['p1'],
    status: ConsentStatus.WITHDRAWN,
    timestamp: '2023-08-10T09:15:00Z',
    expiryDate: '2024-08-10T09:15:00Z',
    hash: 'SHA256-EF992...'
  },
  {
    id: 'ART-EX99',
    userId: 'user-123',
    fiduciaryId: 'fid-2',
    purposes: ['p1', 'p2'],
    status: ConsentStatus.EXPIRED,
    timestamp: '2022-01-01T00:00:00Z',
    expiryDate: '2023-01-01T00:00:00Z',
    hash: 'SHA256-EXPIRED-NODE'
  }
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-001',
    userId: 'user-123',
    category: 'ACCESS_REQUEST',
    description: 'Formal request for summary of data processing for BharatHealth. I wish to know where my blood group data is stored.',
    status: 'IN_PROGRESS',
    createdAt: '2024-01-10T09:00:00Z',
    referenceNumber: 'REF-2024-991'
  },
  {
    id: 'grv-002',
    userId: 'user-123',
    category: 'CONSENT_VIOLATION',
    description: 'My marketing consent was withdrawn on Aug 10, but I still received a promotional SMS on Aug 15.',
    status: 'RESOLVED',
    createdAt: '2023-08-15T11:20:00Z',
    referenceNumber: 'REF-2023-442'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-101',
    userId: 'user-123',
    action: 'GRANT',
    purposeId: 'p1',
    timestamp: '2023-11-20T14:20:00Z',
    status: 'SUCCESS',
    initiator: 'DATA_PRINCIPAL',
    sourceIp: '106.21.XX.XX',
    hash: 'SHA256-A1B2C3D4...'
  },
  {
    id: 'LOG-102',
    userId: 'user-123',
    action: 'WITHDRAW',
    purposeId: 'ART-00221',
    timestamp: '2023-08-10T09:15:00Z',
    status: 'COMPLETED',
    initiator: 'DATA_PRINCIPAL',
    sourceIp: '106.21.XX.XX',
    hash: 'SHA256-REVOKED'
  }
];
