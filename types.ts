
export enum UserRole {
  DATA_PRINCIPAL = 'DATA_PRINCIPAL',
  ADMIN = 'ADMIN',
  DPO = 'DPO',
  AUDITOR = 'AUDITOR',
  CONSENT_MANAGER = 'CONSENT_MANAGER'
}

export enum ConsentStatus {
  ACTIVE = 'ACTIVE',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  isPro?: boolean;
  age?: number;
  guardianEmail?: string;
  provider?: 'email' | 'google' | 'otp';
  avatar?: string;
}

export interface ConsentPurpose {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  isChildSensitive?: boolean;
}

export interface Fiduciary {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  contactEmail: string;
  complianceScore?: number;
  isChildApp?: boolean;
}

export interface ConsentArtifact {
  id: string;
  userId: string;
  fiduciaryId: string;
  purposes: string[];
  status: ConsentStatus;
  timestamp: string;
  expiryDate: string;
  hash: string;
  parentalConsentId?: string;
  isWithdrawalPending?: boolean;
}

export interface Grievance {
  id: string;
  userId: string;
  category: 'CONSENT_VIOLATION' | 'DATA_BREACH' | 'PROCESSING_ERROR' | 'RIGHTS_INQUIRY' | 'ACCESS_REQUEST';
  description: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  referenceNumber: string;
  fiduciaryId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'GRANT' | 'WITHDRAW' | 'UPDATE' | 'VALIDATE' | 'NOTIFICATION' | 'PARENTAL_VERIFY';
  purposeId?: string;
  timestamp: string;
  status: string;
  initiator: string;
  sourceIp: string;
  hash: string;
}

export interface PrivacyNotice {
  id: string;
  fiduciaryId: string;
  title: string;
  content: string;
  purposes: string[];
  languages: string[];
  version: string;
  isChildDirected?: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  targetUrl: string;
  issuedAt: string;
  score: number;
  hash: string;
}
