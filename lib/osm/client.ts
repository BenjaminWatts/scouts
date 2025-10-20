/**
 * Online Scout Manager (OSM) API Client
 * Based on documentation from https://opensource.newcastlescouts.org.uk/
 */

import type {
  OSMConfig,
  OSMApiError,
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

export class OSMClient {
  private config: Required<OSMConfig>;
  private rateLimitInfo?: RateLimitHeaders;

  constructor(config: OSMConfig) {
    this.config = {
      apiId: config.apiId,
      apiToken: config.apiToken,
      baseUrl: config.baseUrl || 'https://www.onlinescoutmanager.co.uk',
    };
  }

  /**
   * Get rate limiting information from the last request
   */
  getRateLimitInfo(): RateLimitHeaders | undefined {
    return this.rateLimitInfo;
  }

  /**
   * Make a request to the OSM API
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {}
  ): Promise<T> {
    const url = new URL(endpoint, this.config.baseUrl);

    // Add authentication parameters
    url.searchParams.append('apiid', this.config.apiId);
    url.searchParams.append('token', this.config.apiToken);

    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    try {
      const response = await fetch(url.toString());

      // Extract rate limit headers
      this.rateLimitInfo = {
        'X-RateLimit-Limit': response.headers.get('X-RateLimit-Limit') || '',
        'X-RateLimit-Remaining': response.headers.get('X-RateLimit-Remaining') || '',
        'X-RateLimit-Reset': response.headers.get('X-RateLimit-Reset') || '',
      };

      if (!response.ok) {
        if (response.status === 429) {
          const error: OSMApiError = {
            message: 'Rate limit exceeded',
            status: 429,
            rateLimitInfo: this.rateLimitInfo,
          };
          throw error;
        }

        const error: OSMApiError = {
          message: `API request failed: ${response.statusText}`,
          status: response.status,
        };
        throw error;
      }

      const data = await response.text();

      // Special handling for startup data which returns JavaScript
      // Need to strip first 18 characters
      if (endpoint.includes('/generic/startup/')) {
        const jsonData = data.substring(18);
        return JSON.parse(jsonData) as T;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      if ((error as OSMApiError).status) {
        throw error;
      }

      const apiError: OSMApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      throw apiError;
    }
  }

  // ============================================
  // GENERAL REQUESTS
  // ============================================

  /**
   * Get startup data including user profile, section access, and terms
   */
  async getStartupData(): Promise<StartupData> {
    return this.request<StartupData>('/ext/generic/startup/?action=getData');
  }

  // ============================================
  // MEMBERS
  // ============================================

  /**
   * Get a list of all members in a given section
   */
  async getMemberList(params: GetMemberListParams): Promise<MemberListResponse> {
    return this.request<MemberListResponse>(
      '/ext/members/contact/?action=getListOfMembers',
      {
        sectionid: params.sectionid,
        termid: params.termid,
        ...(params.sort && { sort: params.sort }),
        ...(params.section && { section: params.section }),
      }
    );
  }

  /**
   * Get individual member information
   */
  async getIndividualMember(params: GetIndividualMemberParams): Promise<IndividualMemberInfo> {
    return this.request<IndividualMemberInfo>(
      '/ext/members/contact/?action=getIndividual',
      {
        sectionid: params.sectionid,
        scoutid: params.scoutid,
        termid: params.termid,
        ...(params.context && { context: params.context }),
      }
    );
  }

  /**
   * Get patrols/sixes/lodges with member lists
   */
  async getPatrols(params: GetPatrolsParams): Promise<PatrolsResponse> {
    return this.request<PatrolsResponse>(
      '/ext/members/patrols/?action=getPatrolsWithPeople',
      {
        sectionid: params.sectionid,
        termid: params.termid,
        ...(params.include_no_patrol && { include_no_patrol: params.include_no_patrol }),
      }
    );
  }

  /**
   * Get census details - lists members lacking census data
   */
  async getCensusDetails(params: GetCensusParams): Promise<CensusResponse> {
    return this.request<CensusResponse>(
      '/ext/members/census/?action=getDetails',
      {
        sectionid: params.sectionid,
        termid: params.termid,
      }
    );
  }

  /**
   * Get flexi-records
   */
  async getFlexiRecords(params: GetFlexiRecordsParams): Promise<FlexiRecordsResponse> {
    return this.request<FlexiRecordsResponse>(
      '/ext/members/flexirecords/?action=getPatrolsWithPeople',
      {
        sectionid: params.sectionid,
        ...(params.archived && { archived: params.archived }),
      }
    );
  }

  /**
   * Get members pending transfer
   */
  async getMemberTransfers(params: GetMemberTransfersParams): Promise<MemberTransfersResponse> {
    return this.request<MemberTransfersResponse>(
      '/ext/members/contact/?action=getMemberTransfers',
      {
        mode: params.mode,
        section_id: params.section_id,
      }
    );
  }

  /**
   * Get deletable members (former members eligible for removal)
   */
  async getDeletableMembers(sectionId: string): Promise<DeletableMembersResponse> {
    return this.request<DeletableMembersResponse>(
      `/v3/members/review/deletion/${sectionId}`
    );
  }

  // ============================================
  // PROGRAMME
  // ============================================

  /**
   * Get programme overview - all meetings in a term
   */
  async getProgrammeSummary(params: GetProgrammeSummaryParams): Promise<ProgrammeSummaryResponse> {
    const response = await this.request<ProgrammeSummaryResponse>(
      '/ext/programme/?action=getProgrammeSummary',
      {
        sectionid: params.sectionid,
        termid: params.termid,
      }
    );

    // Debug logging to understand the API response structure
    console.log('OSM API getProgrammeSummary response:', JSON.stringify(response, null, 2));

    return response;
  }

  /**
   * Get badge tag cloud showing coverage weight per badge
   */
  async getBadgeTagCloud(params: GetBadgeTagCloudParams): Promise<BadgeTagCloud> {
    return this.request<BadgeTagCloud>(
      '/ext/programme/clouds/?action=getBadgeTagCloud',
      {
        sectionid: params.sectionid,
        termid: params.termid,
        section: params.section,
      }
    );
  }

  /**
   * Get programme risk assessment categories
   */
  async getRiskAssessmentCategories(sectionId: string): Promise<RiskAssessmentResponse> {
    return this.request<RiskAssessmentResponse>(
      `/v3/risk_assessments/${sectionId}/categories`
    );
  }

  /**
   * Get detailed meeting information
   */
  async getProgrammeDetail(params: GetProgrammeDetailParams): Promise<ProgrammeDetailResponse> {
    return this.request<ProgrammeDetailResponse>(
      '/ext/programme/?action=getProgramme',
      {
        sectionid: params.sectionid,
        termid: params.termid,
        eveningid: params.eveningid,
      }
    );
  }

  /**
   * Get meeting attachments manifest
   * Note: Returns server file configuration acceptance settings
   */
  async getProgrammeAttachments(params: {
    section_id: string;
    id: string;
    evening_id: string;
    path?: string;
    temp?: boolean;
  }): Promise<unknown> {
    return this.request(
      '/ext/programme/?action=programmeAttachmentsManifest',
      {
        section_id: params.section_id,
        id: params.id,
        evening_id: params.evening_id,
        path: params.path || '/',
        temp: params.temp || false,
        upload_mode: 'programme',
      }
    );
  }
}

/**
 * Create an OSM API client instance
 */
export function createOSMClient(config: OSMConfig): OSMClient {
  return new OSMClient(config);
}

/**
 * Create an OSM API client from environment variables
 */
export function createOSMClientFromEnv(): OSMClient {
  const apiId = process.env.OSM_API_ID;
  const apiToken = process.env.OSM_API_TOKEN;

  if (!apiId || !apiToken) {
    throw new Error(
      'Missing OSM API credentials. Please set OSM_API_ID and OSM_API_TOKEN environment variables.'
    );
  }

  return createOSMClient({
    apiId,
    apiToken,
  });
}
