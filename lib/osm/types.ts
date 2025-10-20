/**
 * Online Scout Manager (OSM) API Types
 * Based on documentation from https://opensource.newcastlescouts.org.uk/
 */

// Common types
export type SectionType = 'squirrels' | 'beavers' | 'cubs' | 'scouts' | 'explorers';
export type SortOption = 'dob' | 'firstname' | 'lastname' | 'patrol';

// Rate limiting headers
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
}

// ============================================
// GENERAL REQUESTS
// ============================================

export interface StartupData {
  globals: {
    email: string;
    firstname: string;
    lastname: string;
    member_access: unknown;
    notepads: unknown;
    sectionConfig: unknown;
    terms: Term[];
  };
}

export interface Term {
  termid: string;
  sectionid: string;
  name: string;
  startdate: string;
  enddate: string;
  past: boolean;
}

// ============================================
// MEMBERS
// ============================================

export interface Member {
  firstname: string;
  lastname: string;
  photo_guid: string;
  patrolid: string;
  patrol: string;
  sectionid: string;
  enddate: string;
  age: number;
  active: boolean;
  scoutid: string;
  full_name: string;
}

export interface MemberListResponse {
  identifier: string;
  photos: unknown;
  items: Member[];
}

export interface IndividualMemberInfo {
  ok: boolean;
  read_only: string[];
  data: {
    scoutid: string;
    firstname: string;
    lastname: string;
    dob: string;
    started: string;
    patrolid: string;
    sectionid: string;
    active: boolean;
    age: number;
    meetings: number;
  };
  meta: unknown;
}

export interface PatrolMember {
  firstname: string;
  lastname: string;
  scout_id: string;
  patrolid: string;
  active: boolean;
  scoutid: string;
}

export interface Patrol {
  patrolid: string;
  sectionid: string;
  name: string;
  active: boolean;
  points: number;
  census_costs: unknown;
  members: PatrolMember[];
}

export interface PatrolsResponse {
  patrols: Patrol[];
}

export interface CensusMember {
  scoutid: string;
  firstname: string;
  lastname: string;
  joined: string;
  sex: string;
  ethnicity: string;
  disabilities: string;
  myscout: boolean;
  raw_disabilities: unknown;
}

export interface CensusResponse {
  identifier: string;
  items: CensusMember[];
}

export interface FlexiRecord {
  extraid: string;
  name: string;
}

export interface FlexiRecordsResponse {
  identifier: string;
  label: string;
  items: FlexiRecord[];
}

export interface MemberTransfer {
  direction: string;
  member_id: string;
  firstname: string;
  lastname: string;
  type: string;
  date: string;
  section_id: string;
  section_name: string;
  mode: string;
  id: string;
}

export interface MemberTransfersResponse {
  status: boolean;
  error: string | null;
  data: MemberTransfer[];
  meta: unknown;
}

export interface DeletableMember {
  firstname: string;
  lastname: string;
  date_deleted: string;
  id: string;
}

export interface DeletableMembersResponse {
  status: boolean;
  error: string | null;
  data: DeletableMember[];
  meta: unknown;
}

// ============================================
// PROGRAMME
// ============================================

export interface ProgrammeSummaryItem {
  eveningid: string;
  sectionid: string;
  title: string;
  notesforparents: string;
  parentsrequired: boolean;
  meetingdate: string;
  starttime: string;
  endtime: string;
  parentsattendingcount: number;
}

export interface ProgrammeSummaryResponse {
  items: ProgrammeSummaryItem[];
}

export interface BadgeTagCloud {
  tags: unknown;
  tag_count: unknown;
  badges: unknown;
}

export interface RiskAssessmentCategory {
  name: string;
}

export interface RiskAssessmentResponse {
  status: boolean;
  error: string | null;
  data: RiskAssessmentCategory[];
  meta: unknown;
}

export interface ProgrammeDetailItem {
  eveningid: string;
  sectionid: string;
  title: string;
  meetingdate: string;
  starttime: string;
  endtime: string;
  help: unknown[];
  unavailableleaders: unknown[];
}

export interface ProgrammeDetailResponse {
  items: ProgrammeDetailItem[];
  badgelinks: unknown;
}

// ============================================
// API REQUEST PARAMETERS
// ============================================

export interface GetMemberListParams {
  sectionid: string;
  termid: string;
  sort?: SortOption;
  section?: SectionType;
}

export interface GetIndividualMemberParams {
  sectionid: string;
  scoutid: string;
  termid: string;
  context?: string;
}

export interface GetPatrolsParams {
  sectionid: string;
  termid: string;
  include_no_patrol?: 'y' | 'n';
}

export interface GetCensusParams {
  sectionid: string;
  termid: string;
}

export interface GetFlexiRecordsParams {
  sectionid: string;
  archived?: 'y' | 'n';
}

export interface GetMemberTransfersParams {
  mode: string;
  section_id: string;
}

export interface GetProgrammeSummaryParams {
  sectionid: string;
  termid: string;
}

export interface GetBadgeTagCloudParams {
  sectionid: string;
  termid: string;
  section: SectionType;
}

export interface GetProgrammeDetailParams {
  sectionid: string;
  termid: string;
  eveningid: string;
}

// ============================================
// API CLIENT CONFIG
// ============================================

export interface OSMConfig {
  apiId: string;
  apiToken: string;
  baseUrl?: string;
}

export interface OSMApiError {
  message: string;
  status?: number;
  rateLimitInfo?: RateLimitHeaders;
}
