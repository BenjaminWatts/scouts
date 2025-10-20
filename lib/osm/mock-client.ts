/**
 * Mock OSM API Client
 * Returns static data instead of making API calls
 * Used when USE_MOCK_DATA environment variable is set to true
 */

import type {
  OSMConfig,
  StartupData,
  MemberListResponse,
  GetMemberListParams,
  IndividualMemberInfo,
  GetIndividualMemberParams,
  PatrolsResponse,
  GetPatrolsParams,
  CensusResponse,
  GetCensusParams,
  FlexiRecordsResponse,
  GetFlexiRecordsParams,
  MemberTransfersResponse,
  GetMemberTransfersParams,
  DeletableMembersResponse,
  ProgrammeSummaryResponse,
  GetProgrammeSummaryParams,
  BadgeTagCloud,
  GetBadgeTagCloudParams,
  RiskAssessmentResponse,
  ProgrammeDetailResponse,
  GetProgrammeDetailParams,
  RateLimitHeaders,
} from './types';

import {
  mockStartupData,
  mockMemberList,
  mockIndividualMember,
  mockPatrols,
  mockCensus,
  mockFlexiRecords,
  mockMemberTransfers,
  mockDeletableMembers,
  mockProgrammeSummary,
  mockBadgeTagCloud,
  mockRiskAssessment,
  mockProgrammeDetail,
} from './mock-data';

export class MockOSMClient {
  private config: Required<OSMConfig>;

  constructor(config: OSMConfig) {
    this.config = {
      apiId: config.apiId || 'mock-api-id',
      apiToken: config.apiToken || 'mock-api-token',
      baseUrl: config.baseUrl || 'https://www.onlinescoutmanager.co.uk',
    };
  }

  /**
   * Get mock rate limiting information
   */
  getRateLimitInfo(): RateLimitHeaders {
    return {
      'X-RateLimit-Limit': '1000',
      'X-RateLimit-Remaining': '999',
      'X-RateLimit-Reset': String(Date.now() + 3600000),
    };
  }

  /**
   * Simulate API delay
   */
  private async delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  // ============================================
  // GENERAL REQUESTS
  // ============================================

  async getStartupData(): Promise<StartupData> {
    await this.delay();
    return mockStartupData;
  }

  // ============================================
  // MEMBERS
  // ============================================

  async getMemberList(params: GetMemberListParams): Promise<MemberListResponse> {
    await this.delay();
    return mockMemberList;
  }

  async getIndividualMember(params: GetIndividualMemberParams): Promise<IndividualMemberInfo> {
    await this.delay();
    return mockIndividualMember;
  }

  async getPatrols(params: GetPatrolsParams): Promise<PatrolsResponse> {
    await this.delay();
    return mockPatrols;
  }

  async getCensusDetails(params: GetCensusParams): Promise<CensusResponse> {
    await this.delay();
    return mockCensus;
  }

  async getFlexiRecords(params: GetFlexiRecordsParams): Promise<FlexiRecordsResponse> {
    await this.delay();
    return mockFlexiRecords;
  }

  async getMemberTransfers(params: GetMemberTransfersParams): Promise<MemberTransfersResponse> {
    await this.delay();
    return mockMemberTransfers;
  }

  async getDeletableMembers(sectionId: string): Promise<DeletableMembersResponse> {
    await this.delay();
    return mockDeletableMembers;
  }

  // ============================================
  // PROGRAMME
  // ============================================

  async getProgrammeSummary(params: GetProgrammeSummaryParams): Promise<ProgrammeSummaryResponse> {
    await this.delay();
    return mockProgrammeSummary;
  }

  async getBadgeTagCloud(params: GetBadgeTagCloudParams): Promise<BadgeTagCloud> {
    await this.delay();
    return mockBadgeTagCloud;
  }

  async getRiskAssessmentCategories(sectionId: string): Promise<RiskAssessmentResponse> {
    await this.delay();
    return mockRiskAssessment;
  }

  async getProgrammeDetail(params: GetProgrammeDetailParams): Promise<ProgrammeDetailResponse> {
    await this.delay();
    return mockProgrammeDetail;
  }

  async getProgrammeAttachments(params: {
    section_id: string;
    id: string;
    evening_id: string;
    path?: string;
    temp?: boolean;
  }): Promise<unknown> {
    await this.delay();
    return {};
  }
}
