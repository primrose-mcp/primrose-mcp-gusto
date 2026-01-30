/**
 * Gusto API Client
 *
 * Handles all HTTP communication with the Gusto Embedded Payroll API.
 * Reference: https://docs.gusto.com/embedded-payroll/reference
 */

import type {
  Admin,
  Company,
  CompanyBankAccount,
  CompanyBenefit,
  CompanyBenefitCreateInput,
  CompanyForm,
  CompanyLocation,
  CompanyLocationCreateInput,
  Compensation,
  CompensationCreateInput,
  Contractor,
  ContractorBankAccount,
  ContractorCreateInput,
  ContractorForm,
  ContractorPayment,
  ContractorPaymentCreateInput,
  ContractorPaymentGroup,
  ContractorUpdateInput,
  Department,
  EarningType,
  EarningTypeCreateInput,
  Employee,
  EmployeeBankAccount,
  EmployeeBankAccountCreateInput,
  EmployeeBenefit,
  EmployeeBenefitCreateInput,
  EmployeeCreateInput,
  EmployeeForm,
  EmployeeOnboardingStatus,
  EmployeePaymentMethod,
  EmployeeUpdateInput,
  FederalTaxDetails,
  Garnishment,
  GarnishmentCreateInput,
  GustoEvent,
  HolidayPayPolicy,
  HomeAddress,
  HomeAddressCreateInput,
  Job,
  JobCreateInput,
  JobUpdateInput,
  Notification,
  OffCyclePayrollCreateInput,
  PaginatedResponse,
  PaginationParams,
  PayPeriod,
  Payroll,
  PayrollUpdateInput,
  PaySchedule,
  PayScheduleCreateInput,
  RecurringReimbursement,
  RecurringReimbursementCreateInput,
  Rehire,
  Signatory,
  StateTaxDetails,
  SupportedBenefit,
  Termination,
  TerminationCreateInput,
  TimeOffPolicy,
  TimeOffPolicyCreateInput,
  TokenInfo,
  WebhookSubscription,
  WebhookSubscriptionCreateInput,
  WorkAddress,
} from './types/entities.js';
import type { TenantCredentials } from './types/env.js';
import { AuthenticationError, CrmApiError, RateLimitError } from './utils/errors.js';

const API_BASE_URL = 'https://api.gusto.com/v1';

// =============================================================================
// Gusto Client Interface
// =============================================================================

export interface GustoClient {
  // Connection
  testConnection(): Promise<{ connected: boolean; message: string }>;
  getTokenInfo(): Promise<TokenInfo>;

  // Companies
  getCompany(companyId: string): Promise<Company>;
  updateCompany(companyId: string, data: Partial<Company>): Promise<Company>;

  // Locations
  listLocations(companyId: string): Promise<CompanyLocation[]>;
  getLocation(locationId: string): Promise<CompanyLocation>;
  createLocation(companyId: string, data: CompanyLocationCreateInput): Promise<CompanyLocation>;
  updateLocation(locationId: string, data: Partial<CompanyLocationCreateInput>): Promise<CompanyLocation>;

  // Company Bank Accounts
  listCompanyBankAccounts(companyId: string): Promise<CompanyBankAccount[]>;
  createCompanyBankAccount(companyId: string, data: { name: string; routingNumber: string; accountNumber: string; accountType: 'Checking' | 'Savings' }): Promise<CompanyBankAccount>;

  // Departments
  listDepartments(companyId: string): Promise<Department[]>;
  getDepartment(departmentId: string): Promise<Department>;
  createDepartment(companyId: string, title: string): Promise<Department>;
  updateDepartment(departmentId: string, title: string): Promise<Department>;
  deleteDepartment(departmentId: string): Promise<void>;

  // Admins
  listAdmins(companyId: string): Promise<Admin[]>;
  createAdmin(companyId: string, email: string, firstName?: string, lastName?: string): Promise<Admin>;

  // Signatories
  listSignatories(companyId: string): Promise<Signatory[]>;
  createSignatory(companyId: string, data: Partial<Signatory>): Promise<Signatory>;

  // Employees
  listEmployees(companyId: string, params?: PaginationParams & { terminated?: boolean }): Promise<PaginatedResponse<Employee>>;
  getEmployee(employeeId: string): Promise<Employee>;
  createEmployee(companyId: string, data: EmployeeCreateInput): Promise<Employee>;
  updateEmployee(employeeId: string, data: EmployeeUpdateInput): Promise<Employee>;
  deleteOnboardingEmployee(employeeId: string): Promise<void>;
  getEmployeeOnboardingStatus(employeeId: string): Promise<EmployeeOnboardingStatus>;

  // Jobs
  listJobs(employeeId: string): Promise<Job[]>;
  getJob(jobId: string): Promise<Job>;
  createJob(employeeId: string, data: JobCreateInput): Promise<Job>;
  updateJob(jobId: string, data: JobUpdateInput): Promise<Job>;
  deleteJob(jobId: string): Promise<void>;

  // Compensations
  listCompensations(jobId: string): Promise<Compensation[]>;
  getCompensation(compensationId: string): Promise<Compensation>;
  createCompensation(jobId: string, data: CompensationCreateInput): Promise<Compensation>;
  updateCompensation(compensationId: string, data: Partial<CompensationCreateInput>): Promise<Compensation>;

  // Employee Addresses
  listHomeAddresses(employeeId: string): Promise<HomeAddress[]>;
  createHomeAddress(employeeId: string, data: HomeAddressCreateInput): Promise<HomeAddress>;
  updateHomeAddress(addressId: string, data: Partial<HomeAddressCreateInput>): Promise<HomeAddress>;
  listWorkAddresses(employeeId: string): Promise<WorkAddress[]>;
  createWorkAddress(employeeId: string, locationUuid: string, effectiveDate?: string): Promise<WorkAddress>;

  // Terminations & Rehires
  listTerminations(employeeId: string): Promise<Termination[]>;
  createTermination(employeeId: string, data: TerminationCreateInput): Promise<Termination>;
  deleteTermination(employeeId: string): Promise<void>;
  getRehire(employeeId: string): Promise<Rehire>;
  createRehire(employeeId: string, effectiveDate: string): Promise<Rehire>;

  // Employee Taxes
  getFederalTaxes(employeeId: string): Promise<FederalTaxDetails>;
  updateFederalTaxes(employeeId: string, data: Partial<FederalTaxDetails>): Promise<FederalTaxDetails>;
  getStateTaxes(employeeId: string): Promise<StateTaxDetails[]>;
  updateStateTaxes(employeeId: string, state: string, data: Partial<StateTaxDetails>): Promise<StateTaxDetails>;

  // Employee Bank Accounts & Payment Method
  listEmployeeBankAccounts(employeeId: string): Promise<EmployeeBankAccount[]>;
  createEmployeeBankAccount(employeeId: string, data: EmployeeBankAccountCreateInput): Promise<EmployeeBankAccount>;
  getEmployeePaymentMethod(employeeId: string): Promise<EmployeePaymentMethod>;
  updateEmployeePaymentMethod(employeeId: string, data: EmployeePaymentMethod): Promise<EmployeePaymentMethod>;

  // Garnishments
  listGarnishments(employeeId: string): Promise<Garnishment[]>;
  getGarnishment(garnishmentId: string): Promise<Garnishment>;
  createGarnishment(employeeId: string, data: GarnishmentCreateInput): Promise<Garnishment>;
  updateGarnishment(garnishmentId: string, data: Partial<GarnishmentCreateInput>): Promise<Garnishment>;

  // Contractors
  listContractors(companyId: string): Promise<Contractor[]>;
  getContractor(contractorId: string): Promise<Contractor>;
  createContractor(companyId: string, data: ContractorCreateInput): Promise<Contractor>;
  updateContractor(contractorId: string, data: ContractorUpdateInput): Promise<Contractor>;
  deleteContractor(contractorId: string): Promise<void>;
  getContractorOnboardingStatus(contractorId: string): Promise<{ onboardingStatus: string }>;

  // Contractor Bank Accounts
  listContractorBankAccounts(contractorId: string): Promise<ContractorBankAccount[]>;
  createContractorBankAccount(contractorId: string, data: EmployeeBankAccountCreateInput): Promise<ContractorBankAccount>;

  // Contractor Payments
  listContractorPayments(companyId: string, params?: { startDate?: string; endDate?: string; contractorUuid?: string }): Promise<ContractorPayment[]>;
  createContractorPayment(companyId: string, data: ContractorPaymentCreateInput): Promise<ContractorPayment>;
  getContractorPaymentGroups(companyId: string): Promise<ContractorPaymentGroup[]>;

  // Payrolls
  listPayrolls(companyId: string, params?: { startDate?: string; endDate?: string; processed?: boolean }): Promise<Payroll[]>;
  getPayroll(companyId: string, payrollId: string): Promise<Payroll>;
  updatePayroll(companyId: string, payrollId: string, data: PayrollUpdateInput): Promise<Payroll>;
  calculatePayroll(companyId: string, payrollId: string): Promise<Payroll>;
  submitPayroll(companyId: string, payrollId: string): Promise<Payroll>;
  createOffCyclePayroll(companyId: string, data: OffCyclePayrollCreateInput): Promise<Payroll>;

  // Pay Schedules
  listPaySchedules(companyId: string): Promise<PaySchedule[]>;
  getPaySchedule(companyId: string, payScheduleId: string): Promise<PaySchedule>;
  createPaySchedule(companyId: string, data: PayScheduleCreateInput): Promise<PaySchedule>;
  getPayPeriods(companyId: string, params?: { startDate?: string; endDate?: string }): Promise<PayPeriod[]>;

  // Earning Types
  listEarningTypes(companyId: string): Promise<EarningType[]>;
  createEarningType(companyId: string, data: EarningTypeCreateInput): Promise<EarningType>;
  updateEarningType(companyId: string, earningTypeId: string, data: Partial<EarningTypeCreateInput>): Promise<EarningType>;
  deactivateEarningType(companyId: string, earningTypeId: string): Promise<void>;

  // Company Benefits
  listCompanyBenefits(companyId: string): Promise<CompanyBenefit[]>;
  getCompanyBenefit(benefitId: string): Promise<CompanyBenefit>;
  createCompanyBenefit(companyId: string, data: CompanyBenefitCreateInput): Promise<CompanyBenefit>;
  updateCompanyBenefit(benefitId: string, data: Partial<CompanyBenefitCreateInput>): Promise<CompanyBenefit>;
  deleteCompanyBenefit(benefitId: string): Promise<void>;
  listSupportedBenefits(): Promise<SupportedBenefit[]>;

  // Employee Benefits
  listEmployeeBenefits(employeeId: string): Promise<EmployeeBenefit[]>;
  getEmployeeBenefit(benefitId: string): Promise<EmployeeBenefit>;
  createEmployeeBenefit(employeeId: string, data: EmployeeBenefitCreateInput): Promise<EmployeeBenefit>;
  updateEmployeeBenefit(benefitId: string, data: Partial<EmployeeBenefitCreateInput>): Promise<EmployeeBenefit>;
  deleteEmployeeBenefit(benefitId: string): Promise<void>;

  // Time Off Policies
  listTimeOffPolicies(companyId: string): Promise<TimeOffPolicy[]>;
  getTimeOffPolicy(policyId: string): Promise<TimeOffPolicy>;
  createTimeOffPolicy(companyId: string, data: TimeOffPolicyCreateInput): Promise<TimeOffPolicy>;
  updateTimeOffPolicy(policyId: string, data: Partial<TimeOffPolicyCreateInput>): Promise<TimeOffPolicy>;
  addEmployeesToTimeOffPolicy(policyId: string, employeeUuids: string[]): Promise<void>;
  removeEmployeesFromTimeOffPolicy(policyId: string, employeeUuids: string[]): Promise<void>;

  // Holiday Pay Policy
  getHolidayPayPolicy(companyId: string): Promise<HolidayPayPolicy | null>;
  createHolidayPayPolicy(companyId: string, data: Partial<HolidayPayPolicy>): Promise<HolidayPayPolicy>;
  updateHolidayPayPolicy(companyId: string, data: Partial<HolidayPayPolicy>): Promise<HolidayPayPolicy>;

  // Forms
  listEmployeeForms(employeeId: string): Promise<EmployeeForm[]>;
  listCompanyForms(companyId: string): Promise<CompanyForm[]>;
  listContractorForms(contractorId: string): Promise<ContractorForm[]>;

  // Webhooks
  listWebhookSubscriptions(): Promise<WebhookSubscription[]>;
  getWebhookSubscription(subscriptionId: string): Promise<WebhookSubscription>;
  createWebhookSubscription(data: WebhookSubscriptionCreateInput): Promise<WebhookSubscription>;
  updateWebhookSubscription(subscriptionId: string, data: Partial<WebhookSubscriptionCreateInput>): Promise<WebhookSubscription>;
  deleteWebhookSubscription(subscriptionId: string): Promise<void>;

  // Events
  listEvents(params?: { startingAfterUuid?: string; resourceUuid?: string; resourceType?: string; limit?: number }): Promise<GustoEvent[]>;

  // Notifications
  listNotifications(companyId: string): Promise<Notification[]>;

  // Reimbursements
  listRecurringReimbursements(employeeId: string): Promise<RecurringReimbursement[]>;
  createRecurringReimbursement(employeeId: string, data: RecurringReimbursementCreateInput): Promise<RecurringReimbursement>;
  updateRecurringReimbursement(reimbursementId: string, data: Partial<RecurringReimbursementCreateInput>): Promise<RecurringReimbursement>;
  deleteRecurringReimbursement(reimbursementId: string): Promise<void>;
}

// =============================================================================
// Gusto Client Implementation
// =============================================================================

class GustoClientImpl implements GustoClient {
  private credentials: TenantCredentials;
  private baseUrl: string;

  constructor(credentials: TenantCredentials) {
    this.credentials = credentials;
    this.baseUrl = API_BASE_URL;
  }

  private getAuthHeaders(): Record<string, string> {
    if (!this.credentials.accessToken) {
      throw new AuthenticationError('No credentials provided. Include X-Gusto-Access-Token header.');
    }
    return {
      Authorization: `Bearer ${this.credentials.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.getAuthHeaders(), ...(options.headers || {}) },
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limit exceeded', retryAfter ? parseInt(retryAfter, 10) : 60);
    }

    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError('Authentication failed. Check your API credentials.');
    }

    if (!response.ok) {
      const errorBody = await response.text();
      let message = `API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        message = errorJson.message || errorJson.error || errorJson.errors?.[0]?.message || message;
      } catch {
        // Use default message
      }
      throw new CrmApiError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // ===========================================================================
  // Connection
  // ===========================================================================

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const info = await this.getTokenInfo();
      return { connected: true, message: `Connected as ${info.resourceOwner?.email || 'authenticated user'}` };
    } catch (error) {
      return { connected: false, message: error instanceof Error ? error.message : 'Connection failed' };
    }
  }

  async getTokenInfo(): Promise<TokenInfo> {
    const data = await this.request<{
      resource_owner?: { uuid?: string; type?: string; email?: string };
      scope?: string[];
      application_id?: string;
      created_at?: string;
      expires_in?: number;
    }>('/token_info');
    return {
      resourceOwner: data.resource_owner ? {
        uuid: data.resource_owner.uuid,
        type: data.resource_owner.type,
        email: data.resource_owner.email,
      } : undefined,
      scope: data.scope,
      applicationId: data.application_id,
      createdAt: data.created_at,
      expiresIn: data.expires_in,
    };
  }

  // ===========================================================================
  // Companies
  // ===========================================================================

  async getCompany(companyId: string): Promise<Company> {
    const c = await this.request<Record<string, unknown>>(`/companies/${companyId}`);
    return this.mapCompany(c);
  }

  async updateCompany(companyId: string, data: Partial<Company>): Promise<Company> {
    const c = await this.request<Record<string, unknown>>(`/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify({ name: data.name, trade_name: data.tradeName }),
    });
    return this.mapCompany(c);
  }

  private mapCompany(c: Record<string, unknown>): Company {
    const primarySignatory = c.primary_signatory as Record<string, unknown> | undefined;
    const primaryPayrollAdmin = c.primary_payroll_admin as Record<string, unknown> | undefined;
    const locations = c.locations as Array<Record<string, unknown>> | undefined;
    return {
      uuid: c.uuid as string,
      name: c.name as string,
      tradeName: c.trade_name as string | undefined,
      ein: c.ein as string | undefined,
      entityType: c.entity_type as string | undefined,
      companyStatus: c.company_status as string | undefined,
      tier: c.tier as string | undefined,
      isPartnerManaged: c.is_partner_managed as boolean | undefined,
      primarySignatory: primarySignatory ? {
        firstName: primarySignatory.first_name as string | undefined,
        lastName: primarySignatory.last_name as string | undefined,
        email: primarySignatory.email as string | undefined,
      } : undefined,
      primaryPayrollAdmin: primaryPayrollAdmin ? {
        firstName: primaryPayrollAdmin.first_name as string | undefined,
        lastName: primaryPayrollAdmin.last_name as string | undefined,
        email: primaryPayrollAdmin.email as string | undefined,
      } : undefined,
      locations: locations?.map((l) => this.mapLocation(l)),
    };
  }

  // ===========================================================================
  // Locations
  // ===========================================================================

  async listLocations(companyId: string): Promise<CompanyLocation[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/locations`);
    return data.map((l) => this.mapLocation(l));
  }

  async getLocation(locationId: string): Promise<CompanyLocation> {
    const data = await this.request<Record<string, unknown>>(`/locations/${locationId}`);
    return this.mapLocation(data);
  }

  async createLocation(companyId: string, data: CompanyLocationCreateInput): Promise<CompanyLocation> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/locations`, {
      method: 'POST',
      body: JSON.stringify({
        phone_number: data.phoneNumber,
        street_1: data.street1,
        street_2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        mailing_address: data.mailingAddress,
        filing_address: data.filingAddress,
      }),
    });
    return this.mapLocation(result);
  }

  async updateLocation(locationId: string, data: Partial<CompanyLocationCreateInput>): Promise<CompanyLocation> {
    const result = await this.request<Record<string, unknown>>(`/locations/${locationId}`, {
      method: 'PUT',
      body: JSON.stringify({
        phone_number: data.phoneNumber,
        street_1: data.street1,
        street_2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        mailing_address: data.mailingAddress,
        filing_address: data.filingAddress,
      }),
    });
    return this.mapLocation(result);
  }

  private mapLocation(l: Record<string, unknown>): CompanyLocation {
    return {
      uuid: l.uuid as string,
      companyUuid: l.company_uuid as string | undefined,
      phoneNumber: l.phone_number as string | undefined,
      street1: l.street_1 as string | undefined,
      street2: l.street_2 as string | undefined,
      city: l.city as string | undefined,
      state: l.state as string | undefined,
      zip: l.zip as string | undefined,
      country: l.country as string | undefined,
      active: l.active as boolean | undefined,
      mailingAddress: l.mailing_address as boolean | undefined,
      filingAddress: l.filing_address as boolean | undefined,
    };
  }

  // ===========================================================================
  // Company Bank Accounts
  // ===========================================================================

  async listCompanyBankAccounts(companyId: string): Promise<CompanyBankAccount[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/bank_accounts`);
    return data.map((b) => ({
      uuid: b.uuid as string,
      companyUuid: b.company_uuid as string | undefined,
      name: b.name as string | undefined,
      routingNumber: b.routing_number as string | undefined,
      accountNumber: b.hidden_account_number as string | undefined,
      accountType: b.account_type as 'Checking' | 'Savings' | undefined,
      verificationStatus: b.verification_status as string | undefined,
    }));
  }

  async createCompanyBankAccount(companyId: string, data: { name: string; routingNumber: string; accountNumber: string; accountType: 'Checking' | 'Savings' }): Promise<CompanyBankAccount> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/bank_accounts`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        routing_number: data.routingNumber,
        account_number: data.accountNumber,
        account_type: data.accountType,
      }),
    });
    return {
      uuid: result.uuid as string,
      companyUuid: result.company_uuid as string | undefined,
      name: result.name as string | undefined,
      routingNumber: result.routing_number as string | undefined,
      accountNumber: result.hidden_account_number as string | undefined,
      accountType: result.account_type as 'Checking' | 'Savings' | undefined,
      verificationStatus: result.verification_status as string | undefined,
    };
  }

  // ===========================================================================
  // Departments
  // ===========================================================================

  async listDepartments(companyId: string): Promise<Department[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/departments`);
    return data.map((d) => this.mapDepartment(d));
  }

  async getDepartment(departmentId: string): Promise<Department> {
    const data = await this.request<Record<string, unknown>>(`/departments/${departmentId}`);
    return this.mapDepartment(data);
  }

  async createDepartment(companyId: string, title: string): Promise<Department> {
    const data = await this.request<Record<string, unknown>>(`/companies/${companyId}/departments`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return this.mapDepartment(data);
  }

  async updateDepartment(departmentId: string, title: string): Promise<Department> {
    const data = await this.request<Record<string, unknown>>(`/departments/${departmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
    return this.mapDepartment(data);
  }

  async deleteDepartment(departmentId: string): Promise<void> {
    await this.request(`/departments/${departmentId}`, { method: 'DELETE' });
  }

  private mapDepartment(d: Record<string, unknown>): Department {
    return {
      uuid: d.uuid as string,
      title: d.title as string,
      companyUuid: d.company_uuid as string | undefined,
      contractors: d.contractors as Array<{ uuid: string }> | undefined,
      employees: d.employees as Array<{ uuid: string }> | undefined,
    };
  }

  // ===========================================================================
  // Admins
  // ===========================================================================

  async listAdmins(companyId: string): Promise<Admin[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/admins`);
    return data.map((a) => ({
      uuid: a.uuid as string,
      email: a.email as string,
      firstName: a.first_name as string | undefined,
      lastName: a.last_name as string | undefined,
    }));
  }

  async createAdmin(companyId: string, email: string, firstName?: string, lastName?: string): Promise<Admin> {
    const data = await this.request<Record<string, unknown>>(`/companies/${companyId}/admins`, {
      method: 'POST',
      body: JSON.stringify({ email, first_name: firstName, last_name: lastName }),
    });
    return {
      uuid: data.uuid as string,
      email: data.email as string,
      firstName: data.first_name as string | undefined,
      lastName: data.last_name as string | undefined,
    };
  }

  // ===========================================================================
  // Signatories
  // ===========================================================================

  async listSignatories(companyId: string): Promise<Signatory[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/signatories`);
    return data.map((s) => this.mapSignatory(s));
  }

  async createSignatory(companyId: string, data: Partial<Signatory>): Promise<Signatory> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/signatories`, {
      method: 'POST',
      body: JSON.stringify({
        first_name: data.firstName,
        middle_initial: data.middleInitial,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        title: data.title,
        birthday: data.birthday,
      }),
    });
    return this.mapSignatory(result);
  }

  private mapSignatory(s: Record<string, unknown>): Signatory {
    const homeAddress = s.home_address as Record<string, unknown> | undefined;
    return {
      uuid: s.uuid as string,
      firstName: s.first_name as string | undefined,
      middleInitial: s.middle_initial as string | undefined,
      lastName: s.last_name as string | undefined,
      email: s.email as string | undefined,
      phone: s.phone as string | undefined,
      title: s.title as string | undefined,
      birthday: s.birthday as string | undefined,
      homeAddress: homeAddress ? {
        street1: homeAddress.street_1 as string | undefined,
        street2: homeAddress.street_2 as string | undefined,
        city: homeAddress.city as string | undefined,
        state: homeAddress.state as string | undefined,
        zip: homeAddress.zip as string | undefined,
        country: homeAddress.country as string | undefined,
      } : undefined,
    };
  }

  // ===========================================================================
  // Employees
  // ===========================================================================

  async listEmployees(companyId: string, params?: PaginationParams & { terminated?: boolean }): Promise<PaginatedResponse<Employee>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', String(params.page));
    if (params?.per) queryParams.set('per', String(params.per));
    if (params?.terminated !== undefined) queryParams.set('terminated', String(params.terminated));

    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/employees?${queryParams}`);
    const items = data.map((e) => this.mapEmployee(e));
    return {
      items,
      count: items.length,
      hasMore: items.length === (params?.per || 25),
      nextPage: items.length === (params?.per || 25) ? (params?.page || 1) + 1 : undefined,
    };
  }

  async getEmployee(employeeId: string): Promise<Employee> {
    const data = await this.request<Record<string, unknown>>(`/employees/${employeeId}`);
    return this.mapEmployee(data);
  }

  async createEmployee(companyId: string, data: EmployeeCreateInput): Promise<Employee> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/employees`, {
      method: 'POST',
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        date_of_birth: data.dateOfBirth,
        email: data.email,
        ssn: data.ssn,
        self_onboarding: data.selfOnboarding,
      }),
    });
    return this.mapEmployee(result);
  }

  async updateEmployee(employeeId: string, data: EmployeeUpdateInput): Promise<Employee> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        preferred_first_name: data.preferredFirstName,
        email: data.email,
        date_of_birth: data.dateOfBirth,
        ssn: data.ssn,
        two_percent_shareholder: data.twoPercentShareholder,
      }),
    });
    return this.mapEmployee(result);
  }

  async deleteOnboardingEmployee(employeeId: string): Promise<void> {
    await this.request(`/employees/${employeeId}`, { method: 'DELETE' });
  }

  async getEmployeeOnboardingStatus(employeeId: string): Promise<EmployeeOnboardingStatus> {
    const data = await this.request<Record<string, unknown>>(`/employees/${employeeId}/onboarding_status`);
    return {
      uuid: data.uuid as string,
      onboardingStatus: data.onboarding_status as string | undefined,
      onboardingSteps: data.onboarding_steps as EmployeeOnboardingStatus['onboardingSteps'],
    };
  }

  private mapEmployee(e: Record<string, unknown>): Employee {
    const homeAddress = e.home_address as Record<string, unknown> | undefined;
    const jobs = e.jobs as Array<Record<string, unknown>> | undefined;
    const garnishments = e.garnishments as Array<Record<string, unknown>> | undefined;
    return {
      uuid: e.uuid as string,
      companyUuid: e.company_uuid as string | undefined,
      firstName: e.first_name as string | undefined,
      middleName: e.middle_name as string | undefined,
      lastName: e.last_name as string | undefined,
      email: e.email as string | undefined,
      dateOfBirth: e.date_of_birth as string | undefined,
      ssn: e.ssn as string | undefined,
      phone: e.phone as string | undefined,
      preferredFirstName: e.preferred_first_name as string | undefined,
      twoPercentShareholder: e.two_percent_shareholder as boolean | undefined,
      onboarded: e.onboarded as boolean | undefined,
      department: e.department as string | undefined,
      terminated: e.terminated as boolean | undefined,
      terminationDate: e.termination_date as string | undefined,
      currentEmploymentStatus: e.current_employment_status as string | undefined,
      workEmail: e.work_email as string | undefined,
      homeAddress: homeAddress ? {
        street1: homeAddress.street_1 as string | undefined,
        street2: homeAddress.street_2 as string | undefined,
        city: homeAddress.city as string | undefined,
        state: homeAddress.state as string | undefined,
        zip: homeAddress.zip as string | undefined,
        country: homeAddress.country as string | undefined,
      } : undefined,
      jobs: jobs?.map((j) => this.mapJob(j)),
      garnishments: garnishments?.map((g) => this.mapGarnishment(g)),
      customFields: e.custom_fields as Record<string, unknown> | undefined,
      paymentMethod: e.payment_method as string | undefined,
      hasDirectDeposit: e.has_direct_deposit as boolean | undefined,
    };
  }

  // ===========================================================================
  // Jobs
  // ===========================================================================

  async listJobs(employeeId: string): Promise<Job[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/jobs`);
    return data.map((j) => this.mapJob(j));
  }

  async getJob(jobId: string): Promise<Job> {
    const data = await this.request<Record<string, unknown>>(`/jobs/${jobId}`);
    return this.mapJob(data);
  }

  async createJob(employeeId: string, data: JobCreateInput): Promise<Job> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/jobs`, {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        location_uuid: data.locationUuid,
        hire_date: data.hireDate,
      }),
    });
    return this.mapJob(result);
  }

  async updateJob(jobId: string, data: JobUpdateInput): Promise<Job> {
    const result = await this.request<Record<string, unknown>>(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: data.title,
        location_uuid: data.locationUuid,
      }),
    });
    return this.mapJob(result);
  }

  async deleteJob(jobId: string): Promise<void> {
    await this.request(`/jobs/${jobId}`, { method: 'DELETE' });
  }

  private mapJob(j: Record<string, unknown>): Job {
    const compensations = j.compensations as Array<Record<string, unknown>> | undefined;
    return {
      uuid: j.uuid as string,
      employeeUuid: j.employee_uuid as string | undefined,
      locationUuid: j.location_uuid as string | undefined,
      title: j.title as string | undefined,
      primary: j.primary as boolean | undefined,
      rate: j.rate as string | undefined,
      paymentUnit: j.payment_unit as Job['paymentUnit'],
      currentCompensationUuid: j.current_compensation_uuid as string | undefined,
      hireDate: j.hire_date as string | undefined,
      compensations: compensations?.map((c) => this.mapCompensation(c)),
    };
  }

  // ===========================================================================
  // Compensations
  // ===========================================================================

  async listCompensations(jobId: string): Promise<Compensation[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/jobs/${jobId}/compensations`);
    return data.map((c) => this.mapCompensation(c));
  }

  async getCompensation(compensationId: string): Promise<Compensation> {
    const data = await this.request<Record<string, unknown>>(`/compensations/${compensationId}`);
    return this.mapCompensation(data);
  }

  async createCompensation(jobId: string, data: CompensationCreateInput): Promise<Compensation> {
    const result = await this.request<Record<string, unknown>>(`/jobs/${jobId}/compensations`, {
      method: 'POST',
      body: JSON.stringify({
        rate: data.rate,
        payment_unit: data.paymentUnit,
        flsa_status: data.flsaStatus,
        effective_date: data.effectiveDate,
        adjust_for_minimum_wage: data.adjustForMinimumWage,
      }),
    });
    return this.mapCompensation(result);
  }

  async updateCompensation(compensationId: string, data: Partial<CompensationCreateInput>): Promise<Compensation> {
    const result = await this.request<Record<string, unknown>>(`/compensations/${compensationId}`, {
      method: 'PUT',
      body: JSON.stringify({
        rate: data.rate,
        payment_unit: data.paymentUnit,
        flsa_status: data.flsaStatus,
        effective_date: data.effectiveDate,
        adjust_for_minimum_wage: data.adjustForMinimumWage,
      }),
    });
    return this.mapCompensation(result);
  }

  private mapCompensation(c: Record<string, unknown>): Compensation {
    return {
      uuid: c.uuid as string,
      jobUuid: c.job_uuid as string | undefined,
      rate: c.rate as string | undefined,
      paymentUnit: c.payment_unit as Compensation['paymentUnit'],
      flsaStatus: c.flsa_status as Compensation['flsaStatus'],
      effectiveDate: c.effective_date as string | undefined,
      adjustForMinimumWage: c.adjust_for_minimum_wage as boolean | undefined,
      minimumWages: c.minimum_wages as Compensation['minimumWages'],
    };
  }

  // ===========================================================================
  // Employee Addresses
  // ===========================================================================

  async listHomeAddresses(employeeId: string): Promise<HomeAddress[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/home_addresses`);
    return data.map((a) => this.mapHomeAddress(a));
  }

  async createHomeAddress(employeeId: string, data: HomeAddressCreateInput): Promise<HomeAddress> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/home_addresses`, {
      method: 'POST',
      body: JSON.stringify({
        street_1: data.street1,
        street_2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        effective_date: data.effectiveDate,
      }),
    });
    return this.mapHomeAddress(result);
  }

  async updateHomeAddress(addressId: string, data: Partial<HomeAddressCreateInput>): Promise<HomeAddress> {
    const result = await this.request<Record<string, unknown>>(`/home_addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify({
        street_1: data.street1,
        street_2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        effective_date: data.effectiveDate,
      }),
    });
    return this.mapHomeAddress(result);
  }

  private mapHomeAddress(a: Record<string, unknown>): HomeAddress {
    return {
      uuid: a.uuid as string,
      employeeUuid: a.employee_uuid as string | undefined,
      version: a.version as string | undefined,
      street1: a.street_1 as string | undefined,
      street2: a.street_2 as string | undefined,
      city: a.city as string | undefined,
      state: a.state as string | undefined,
      zip: a.zip as string | undefined,
      country: a.country as string | undefined,
      active: a.active as boolean | undefined,
      effectiveDate: a.effective_date as string | undefined,
    };
  }

  async listWorkAddresses(employeeId: string): Promise<WorkAddress[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/work_addresses`);
    return data.map((a) => ({
      uuid: a.uuid as string,
      employeeUuid: a.employee_uuid as string | undefined,
      locationUuid: a.location_uuid as string | undefined,
      effectiveDate: a.effective_date as string | undefined,
    }));
  }

  async createWorkAddress(employeeId: string, locationUuid: string, effectiveDate?: string): Promise<WorkAddress> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/work_addresses`, {
      method: 'POST',
      body: JSON.stringify({ location_uuid: locationUuid, effective_date: effectiveDate }),
    });
    return {
      uuid: result.uuid as string,
      employeeUuid: result.employee_uuid as string | undefined,
      locationUuid: result.location_uuid as string | undefined,
      effectiveDate: result.effective_date as string | undefined,
    };
  }

  // ===========================================================================
  // Terminations & Rehires
  // ===========================================================================

  async listTerminations(employeeId: string): Promise<Termination[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/terminations`);
    return data.map((t) => ({
      uuid: t.uuid as string,
      employeeUuid: t.employee_uuid as string | undefined,
      active: t.active as boolean | undefined,
      effectiveDate: t.effective_date as string | undefined,
      runTerminationPayroll: t.run_termination_payroll as boolean | undefined,
    }));
  }

  async createTermination(employeeId: string, data: TerminationCreateInput): Promise<Termination> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/terminations`, {
      method: 'POST',
      body: JSON.stringify({
        effective_date: data.effectiveDate,
        run_termination_payroll: data.runTerminationPayroll,
      }),
    });
    return {
      uuid: result.uuid as string,
      employeeUuid: result.employee_uuid as string | undefined,
      active: result.active as boolean | undefined,
      effectiveDate: result.effective_date as string | undefined,
      runTerminationPayroll: result.run_termination_payroll as boolean | undefined,
    };
  }

  async deleteTermination(employeeId: string): Promise<void> {
    await this.request(`/employees/${employeeId}/terminations`, { method: 'DELETE' });
  }

  async getRehire(employeeId: string): Promise<Rehire> {
    const data = await this.request<Record<string, unknown>>(`/employees/${employeeId}/rehire`);
    return {
      uuid: data.uuid as string,
      employeeUuid: data.employee_uuid as string | undefined,
      effectiveDate: data.effective_date as string | undefined,
      fileNewHireReport: data.file_new_hire_report as boolean | undefined,
      workLocationUuid: data.work_location_uuid as string | undefined,
      employmentStatus: data.employment_status as string | undefined,
      twoPercentShareholder: data.two_percent_shareholder as boolean | undefined,
    };
  }

  async createRehire(employeeId: string, effectiveDate: string): Promise<Rehire> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/rehire`, {
      method: 'POST',
      body: JSON.stringify({ effective_date: effectiveDate }),
    });
    return {
      uuid: result.uuid as string,
      employeeUuid: result.employee_uuid as string | undefined,
      effectiveDate: result.effective_date as string | undefined,
      fileNewHireReport: result.file_new_hire_report as boolean | undefined,
      workLocationUuid: result.work_location_uuid as string | undefined,
      employmentStatus: result.employment_status as string | undefined,
      twoPercentShareholder: result.two_percent_shareholder as boolean | undefined,
    };
  }

  // ===========================================================================
  // Employee Taxes
  // ===========================================================================

  async getFederalTaxes(employeeId: string): Promise<FederalTaxDetails> {
    const data = await this.request<Record<string, unknown>>(`/employees/${employeeId}/federal_taxes`);
    return {
      uuid: data.uuid as string | undefined,
      version: data.version as string | undefined,
      filingStatus: data.filing_status as string | undefined,
      extraWithholding: data.extra_withholding as string | undefined,
      twoJobs: data.two_jobs as boolean | undefined,
      dependentsAmount: data.dependents_amount as string | undefined,
      otherIncome: data.other_income as string | undefined,
      deductions: data.deductions as string | undefined,
      w4DataType: data.w4_data_type as string | undefined,
    };
  }

  async updateFederalTaxes(employeeId: string, data: Partial<FederalTaxDetails>): Promise<FederalTaxDetails> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/federal_taxes`, {
      method: 'PUT',
      body: JSON.stringify({
        version: data.version,
        filing_status: data.filingStatus,
        extra_withholding: data.extraWithholding,
        two_jobs: data.twoJobs,
        dependents_amount: data.dependentsAmount,
        other_income: data.otherIncome,
        deductions: data.deductions,
      }),
    });
    return {
      uuid: result.uuid as string | undefined,
      version: result.version as string | undefined,
      filingStatus: result.filing_status as string | undefined,
      extraWithholding: result.extra_withholding as string | undefined,
      twoJobs: result.two_jobs as boolean | undefined,
      dependentsAmount: result.dependents_amount as string | undefined,
      otherIncome: result.other_income as string | undefined,
      deductions: result.deductions as string | undefined,
      w4DataType: result.w4_data_type as string | undefined,
    };
  }

  async getStateTaxes(employeeId: string): Promise<StateTaxDetails[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/state_taxes`);
    return data.map((t) => ({
      uuid: t.uuid as string | undefined,
      state: t.state as string | undefined,
      filingStatus: t.filing_status as string | undefined,
      extraWithholding: t.extra_withholding as string | undefined,
      exemptions: t.exemptions as number | undefined,
      allowances: t.allowances as number | undefined,
    }));
  }

  async updateStateTaxes(employeeId: string, state: string, data: Partial<StateTaxDetails>): Promise<StateTaxDetails> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/state_taxes/${state}`, {
      method: 'PUT',
      body: JSON.stringify({
        filing_status: data.filingStatus,
        extra_withholding: data.extraWithholding,
        exemptions: data.exemptions,
        allowances: data.allowances,
      }),
    });
    return {
      uuid: result.uuid as string | undefined,
      state: result.state as string | undefined,
      filingStatus: result.filing_status as string | undefined,
      extraWithholding: result.extra_withholding as string | undefined,
      exemptions: result.exemptions as number | undefined,
      allowances: result.allowances as number | undefined,
    };
  }

  // ===========================================================================
  // Employee Bank Accounts & Payment Method
  // ===========================================================================

  async listEmployeeBankAccounts(employeeId: string): Promise<EmployeeBankAccount[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/bank_accounts`);
    return data.map((b) => ({
      uuid: b.uuid as string,
      employeeUuid: b.employee_uuid as string | undefined,
      name: b.name as string | undefined,
      routingNumber: b.routing_number as string | undefined,
      accountNumber: b.account_number as string | undefined,
      accountType: b.account_type as 'Checking' | 'Savings' | undefined,
      hidden_account_number: b.hidden_account_number as string | undefined,
    }));
  }

  async createEmployeeBankAccount(employeeId: string, data: EmployeeBankAccountCreateInput): Promise<EmployeeBankAccount> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/bank_accounts`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        routing_number: data.routingNumber,
        account_number: data.accountNumber,
        account_type: data.accountType,
      }),
    });
    return {
      uuid: result.uuid as string,
      employeeUuid: result.employee_uuid as string | undefined,
      name: result.name as string | undefined,
      routingNumber: result.routing_number as string | undefined,
      accountNumber: result.account_number as string | undefined,
      accountType: result.account_type as 'Checking' | 'Savings' | undefined,
      hidden_account_number: result.hidden_account_number as string | undefined,
    };
  }

  async getEmployeePaymentMethod(employeeId: string): Promise<EmployeePaymentMethod> {
    const data = await this.request<Record<string, unknown>>(`/employees/${employeeId}/payment_method`);
    return {
      type: data.type as 'Direct Deposit' | 'Check' | undefined,
      splitBy: data.split_by as 'Amount' | 'Percentage' | undefined,
      splits: data.splits as EmployeePaymentMethod['splits'],
    };
  }

  async updateEmployeePaymentMethod(employeeId: string, data: EmployeePaymentMethod): Promise<EmployeePaymentMethod> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/payment_method`, {
      method: 'PUT',
      body: JSON.stringify({
        type: data.type,
        split_by: data.splitBy,
        splits: data.splits?.map((s) => ({
          bank_account_uuid: s.bankAccountUuid,
          priority: s.priority,
          split_amount: s.splitAmount,
        })),
      }),
    });
    return {
      type: result.type as 'Direct Deposit' | 'Check' | undefined,
      splitBy: result.split_by as 'Amount' | 'Percentage' | undefined,
      splits: result.splits as EmployeePaymentMethod['splits'],
    };
  }

  // ===========================================================================
  // Garnishments
  // ===========================================================================

  async listGarnishments(employeeId: string): Promise<Garnishment[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/garnishments`);
    return data.map((g) => this.mapGarnishment(g));
  }

  async getGarnishment(garnishmentId: string): Promise<Garnishment> {
    const data = await this.request<Record<string, unknown>>(`/garnishments/${garnishmentId}`);
    return this.mapGarnishment(data);
  }

  async createGarnishment(employeeId: string, data: GarnishmentCreateInput): Promise<Garnishment> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/garnishments`, {
      method: 'POST',
      body: JSON.stringify({
        description: data.description,
        active: data.active,
        amount: data.amount,
        court_ordered: data.courtOrdered,
        times: data.times,
        recurring: data.recurring,
        annual_maximum: data.annualMaximum,
        pay_period_maximum: data.payPeriodMaximum,
        deduct_as_percentage: data.deductAsPercentage,
      }),
    });
    return this.mapGarnishment(result);
  }

  async updateGarnishment(garnishmentId: string, data: Partial<GarnishmentCreateInput>): Promise<Garnishment> {
    const result = await this.request<Record<string, unknown>>(`/garnishments/${garnishmentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        description: data.description,
        active: data.active,
        amount: data.amount,
        court_ordered: data.courtOrdered,
        times: data.times,
        recurring: data.recurring,
        annual_maximum: data.annualMaximum,
        pay_period_maximum: data.payPeriodMaximum,
        deduct_as_percentage: data.deductAsPercentage,
      }),
    });
    return this.mapGarnishment(result);
  }

  private mapGarnishment(g: Record<string, unknown>): Garnishment {
    return {
      uuid: g.uuid as string,
      employeeUuid: g.employee_uuid as string | undefined,
      active: g.active as boolean | undefined,
      amount: g.amount as string | undefined,
      description: g.description as string | undefined,
      courtOrdered: g.court_ordered as boolean | undefined,
      times: g.times as number | undefined,
      recurring: g.recurring as boolean | undefined,
      annualMaximum: g.annual_maximum as string | undefined,
      payPeriodMaximum: g.pay_period_maximum as string | undefined,
      deductAsPercentage: g.deduct_as_percentage as boolean | undefined,
    };
  }

  // ===========================================================================
  // Contractors (continued in next part)
  // ===========================================================================

  async listContractors(companyId: string): Promise<Contractor[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/contractors`);
    return data.map((c) => this.mapContractor(c));
  }

  async getContractor(contractorId: string): Promise<Contractor> {
    const data = await this.request<Record<string, unknown>>(`/contractors/${contractorId}`);
    return this.mapContractor(data);
  }

  async createContractor(companyId: string, data: ContractorCreateInput): Promise<Contractor> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/contractors`, {
      method: 'POST',
      body: JSON.stringify({
        type: data.type,
        wage_type: data.wageType,
        first_name: data.firstName,
        last_name: data.lastName,
        middle_initial: data.middleInitial,
        email: data.email,
        business_name: data.businessName,
        ein: data.ein,
        ssn: data.ssn,
        start_date: data.startDate,
        self_onboarding: data.selfOnboarding,
      }),
    });
    return this.mapContractor(result);
  }

  async updateContractor(contractorId: string, data: ContractorUpdateInput): Promise<Contractor> {
    const result = await this.request<Record<string, unknown>>(`/contractors/${contractorId}`, {
      method: 'PUT',
      body: JSON.stringify({
        type: data.type,
        wage_type: data.wageType,
        first_name: data.firstName,
        last_name: data.lastName,
        middle_initial: data.middleInitial,
        email: data.email,
        business_name: data.businessName,
        ein: data.ein,
        start_date: data.startDate,
      }),
    });
    return this.mapContractor(result);
  }

  async deleteContractor(contractorId: string): Promise<void> {
    await this.request(`/contractors/${contractorId}`, { method: 'DELETE' });
  }

  async getContractorOnboardingStatus(contractorId: string): Promise<{ onboardingStatus: string }> {
    const data = await this.request<Record<string, unknown>>(`/contractors/${contractorId}/onboarding_status`);
    return { onboardingStatus: data.onboarding_status as string };
  }

  private mapContractor(c: Record<string, unknown>): Contractor {
    const address = c.address as Record<string, unknown> | undefined;
    return {
      uuid: c.uuid as string,
      companyUuid: c.company_uuid as string | undefined,
      type: c.type as 'Individual' | 'Business' | undefined,
      wageType: c.wage_type as 'Fixed' | 'Hourly' | undefined,
      firstName: c.first_name as string | undefined,
      lastName: c.last_name as string | undefined,
      middleInitial: c.middle_initial as string | undefined,
      email: c.email as string | undefined,
      businessName: c.business_name as string | undefined,
      ein: c.ein as string | undefined,
      isActive: c.is_active as boolean | undefined,
      startDate: c.start_date as string | undefined,
      address: address ? {
        street1: address.street_1 as string | undefined,
        street2: address.street_2 as string | undefined,
        city: address.city as string | undefined,
        state: address.state as string | undefined,
        zip: address.zip as string | undefined,
        country: address.country as string | undefined,
      } : undefined,
      hourlyRate: c.hourly_rate as string | undefined,
      onboarded: c.onboarded as boolean | undefined,
      selfOnboarding: c.self_onboarding as boolean | undefined,
    };
  }

  // ===========================================================================
  // Contractor Bank Accounts
  // ===========================================================================

  async listContractorBankAccounts(contractorId: string): Promise<ContractorBankAccount[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/contractors/${contractorId}/bank_accounts`);
    return data.map((b) => ({
      uuid: b.uuid as string,
      contractorUuid: b.contractor_uuid as string | undefined,
      name: b.name as string | undefined,
      routingNumber: b.routing_number as string | undefined,
      accountNumber: b.hidden_account_number as string | undefined,
      accountType: b.account_type as 'Checking' | 'Savings' | undefined,
    }));
  }

  async createContractorBankAccount(contractorId: string, data: EmployeeBankAccountCreateInput): Promise<ContractorBankAccount> {
    const result = await this.request<Record<string, unknown>>(`/contractors/${contractorId}/bank_accounts`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        routing_number: data.routingNumber,
        account_number: data.accountNumber,
        account_type: data.accountType,
      }),
    });
    return {
      uuid: result.uuid as string,
      contractorUuid: result.contractor_uuid as string | undefined,
      name: result.name as string | undefined,
      routingNumber: result.routing_number as string | undefined,
      accountNumber: result.hidden_account_number as string | undefined,
      accountType: result.account_type as 'Checking' | 'Savings' | undefined,
    };
  }

  // ===========================================================================
  // Contractor Payments
  // ===========================================================================

  async listContractorPayments(companyId: string, params?: { startDate?: string; endDate?: string; contractorUuid?: string }): Promise<ContractorPayment[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.set('start_date', params.startDate);
    if (params?.endDate) queryParams.set('end_date', params.endDate);
    if (params?.contractorUuid) queryParams.set('contractor_uuid', params.contractorUuid);
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/contractor_payments?${queryParams}`);
    return data.map((p) => this.mapContractorPayment(p));
  }

  async createContractorPayment(companyId: string, data: ContractorPaymentCreateInput): Promise<ContractorPayment> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/contractor_payments`, {
      method: 'POST',
      body: JSON.stringify({
        contractor_uuid: data.contractorUuid,
        date: data.date,
        wage: data.wage,
        hours: data.hours,
        bonus: data.bonus,
        reimbursement: data.reimbursement,
        payment_method: data.paymentMethod,
      }),
    });
    return this.mapContractorPayment(result);
  }

  async getContractorPaymentGroups(companyId: string): Promise<ContractorPaymentGroup[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/contractor_payment_groups`);
    return data.map((g) => ({
      uuid: g.uuid as string,
      companyUuid: g.company_uuid as string | undefined,
      checkDate: g.check_date as string | undefined,
      status: g.status as string | undefined,
      contractorPayments: (g.contractor_payments as Array<Record<string, unknown>> | undefined)?.map((p) => this.mapContractorPayment(p)),
    }));
  }

  private mapContractorPayment(p: Record<string, unknown>): ContractorPayment {
    return {
      uuid: p.uuid as string,
      contractorUuid: p.contractor_uuid as string | undefined,
      companyUuid: p.company_uuid as string | undefined,
      bonus: p.bonus as string | undefined,
      date: p.date as string | undefined,
      hours: p.hours as string | undefined,
      paymentMethod: p.payment_method as string | undefined,
      reimbursement: p.reimbursement as string | undefined,
      wage: p.wage as string | undefined,
      wageTotal: p.wage_total as string | undefined,
      status: p.status as string | undefined,
    };
  }

  // ===========================================================================
  // Payrolls
  // ===========================================================================

  async listPayrolls(companyId: string, params?: { startDate?: string; endDate?: string; processed?: boolean }): Promise<Payroll[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.set('start_date', params.startDate);
    if (params?.endDate) queryParams.set('end_date', params.endDate);
    if (params?.processed !== undefined) queryParams.set('processed', String(params.processed));
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/payrolls?${queryParams}`);
    return data.map((p) => this.mapPayroll(p));
  }

  async getPayroll(companyId: string, payrollId: string): Promise<Payroll> {
    const data = await this.request<Record<string, unknown>>(`/companies/${companyId}/payrolls/${payrollId}`);
    return this.mapPayroll(data);
  }

  async updatePayroll(companyId: string, payrollId: string, data: PayrollUpdateInput): Promise<Payroll> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/payrolls/${payrollId}`, {
      method: 'PUT',
      body: JSON.stringify({
        version: data.version,
        employee_compensations: data.employeeCompensations.map((ec) => ({
          employee_uuid: ec.employeeUuid,
          excluded: ec.excluded,
          fixed_compensations: ec.fixedCompensations?.map((fc) => ({
            name: fc.name,
            amount: fc.amount,
            job_uuid: fc.jobUuid,
          })),
          hourly_compensations: ec.hourlyCompensations?.map((hc) => ({
            name: hc.name,
            hours: hc.hours,
            job_uuid: hc.jobUuid,
          })),
          paid_time_off: ec.paidTimeOff?.map((pto) => ({
            name: pto.name,
            hours: pto.hours,
          })),
        })),
      }),
    });
    return this.mapPayroll(result);
  }

  async calculatePayroll(companyId: string, payrollId: string): Promise<Payroll> {
    const data = await this.request<Record<string, unknown>>(`/companies/${companyId}/payrolls/${payrollId}/calculate`, { method: 'PUT' });
    return this.mapPayroll(data);
  }

  async submitPayroll(companyId: string, payrollId: string): Promise<Payroll> {
    const data = await this.request<Record<string, unknown>>(`/companies/${companyId}/payrolls/${payrollId}/submit`, { method: 'PUT' });
    return this.mapPayroll(data);
  }

  async createOffCyclePayroll(companyId: string, data: OffCyclePayrollCreateInput): Promise<Payroll> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/payrolls`, {
      method: 'POST',
      body: JSON.stringify({
        off_cycle_reason: data.offCycleReason,
        check_date: data.checkDate,
        start_date: data.startDate,
        end_date: data.endDate,
        employee_uuids: data.employeeUuids,
        withholds_only_taxes: data.withholdsOnlyTaxes,
        skip_regular_deductions: data.skipRegularDeductions,
      }),
    });
    return this.mapPayroll(result);
  }

  private mapPayroll(p: Record<string, unknown>): Payroll {
    const totals = p.totals as Record<string, unknown> | undefined;
    const employeeCompensations = p.employee_compensations as Array<Record<string, unknown>> | undefined;
    return {
      payrollUuid: p.payroll_uuid as string | undefined,
      uuid: p.uuid as string | undefined,
      companyUuid: p.company_uuid as string | undefined,
      processed: p.processed as boolean | undefined,
      processedDate: p.processed_date as string | undefined,
      payPeriodStartDate: p.pay_period_start_date as string | undefined,
      payPeriodEndDate: p.pay_period_end_date as string | undefined,
      checkDate: p.check_date as string | undefined,
      payrollDeadline: p.payroll_deadline as string | undefined,
      payScheduleUuid: p.pay_schedule_uuid as string | undefined,
      payScheduleType: p.pay_schedule_type as string | undefined,
      version: p.version as string | undefined,
      totals: totals ? {
        companyDebit: totals.company_debit as string | undefined,
        reimbursements: totals.reimbursements as string | undefined,
        netPay: totals.net_pay as string | undefined,
        grossPay: totals.gross_pay as string | undefined,
        employerTaxes: totals.employer_taxes as string | undefined,
        employeeTaxes: totals.employee_taxes as string | undefined,
        benefits: totals.benefits as string | undefined,
        employerBenefits: totals.employer_benefits as string | undefined,
        employeeBenefits: totals.employee_benefits as string | undefined,
        deferredPayroll: totals.deferred_payroll as string | undefined,
        childSupportDebit: totals.child_support_debit as string | undefined,
      } : undefined,
      employeeCompensations: employeeCompensations?.map((ec) => ({
        employeeUuid: ec.employee_uuid as string | undefined,
        excluded: ec.excluded as boolean | undefined,
        grossPay: ec.gross_pay as string | undefined,
        netPay: ec.net_pay as string | undefined,
        paymentMethod: ec.payment_method as string | undefined,
        fixedCompensations: ec.fixed_compensations as EmployeeCompensation['fixedCompensations'],
        hourlyCompensations: ec.hourly_compensations as EmployeeCompensation['hourlyCompensations'],
        paidTimeOff: ec.paid_time_off as EmployeeCompensation['paidTimeOff'],
        taxes: ec.taxes as EmployeeCompensation['taxes'],
        benefits: ec.benefits as EmployeeCompensation['benefits'],
        deductions: ec.deductions as EmployeeCompensation['deductions'],
      })),
    };
  }

  // ===========================================================================
  // Pay Schedules
  // ===========================================================================

  async listPaySchedules(companyId: string): Promise<PaySchedule[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/pay_schedules`);
    return data.map((ps) => this.mapPaySchedule(ps));
  }

  async getPaySchedule(companyId: string, payScheduleId: string): Promise<PaySchedule> {
    const data = await this.request<Record<string, unknown>>(`/companies/${companyId}/pay_schedules/${payScheduleId}`);
    return this.mapPaySchedule(data);
  }

  async createPaySchedule(companyId: string, data: PayScheduleCreateInput): Promise<PaySchedule> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/pay_schedules`, {
      method: 'POST',
      body: JSON.stringify({
        frequency: data.frequency,
        anchor_pay_date: data.anchorPayDate,
        anchor_end_of_pay_period: data.anchorEndOfPayPeriod,
        day_1: data.day1,
        day_2: data.day2,
        name: data.name,
        auto_pilot: data.autoPilot,
      }),
    });
    return this.mapPaySchedule(result);
  }

  async getPayPeriods(companyId: string, params?: { startDate?: string; endDate?: string }): Promise<PayPeriod[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.set('start_date', params.startDate);
    if (params?.endDate) queryParams.set('end_date', params.endDate);
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/pay_periods?${queryParams}`);
    return data.map((pp) => ({
      startDate: pp.start_date as string | undefined,
      endDate: pp.end_date as string | undefined,
      payScheduleUuid: pp.pay_schedule_uuid as string | undefined,
      checkDate: pp.check_date as string | undefined,
      payrollUuid: pp.payroll_uuid as string | undefined,
      processed: pp.processed as boolean | undefined,
      eligibleEmployees: pp.eligible_employees as Array<{ uuid: string }> | undefined,
    }));
  }

  private mapPaySchedule(ps: Record<string, unknown>): PaySchedule {
    return {
      uuid: ps.uuid as string,
      companyUuid: ps.company_uuid as string | undefined,
      frequency: ps.frequency as PaySchedule['frequency'],
      anchorPayDate: ps.anchor_pay_date as string | undefined,
      anchorEndOfPayPeriod: ps.anchor_end_of_pay_period as string | undefined,
      day1: ps.day_1 as number | undefined,
      day2: ps.day_2 as number | undefined,
      name: ps.name as string | undefined,
      autoPilot: ps.auto_pilot as boolean | undefined,
      employees: ps.employees as Array<{ uuid: string }> | undefined,
    };
  }

  // ===========================================================================
  // Earning Types
  // ===========================================================================

  async listEarningTypes(companyId: string): Promise<EarningType[]> {
    const data = await this.request<{ default: Array<Record<string, unknown>>; custom: Array<Record<string, unknown>> }>(`/companies/${companyId}/earning_types`);
    const allTypes = [...(data.default || []), ...(data.custom || [])];
    return allTypes.map((et) => ({
      uuid: et.uuid as string,
      companyUuid: et.company_uuid as string | undefined,
      name: et.name as string | undefined,
      description: et.description as string | undefined,
      active: et.active as boolean | undefined,
    }));
  }

  async createEarningType(companyId: string, data: EarningTypeCreateInput): Promise<EarningType> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/earning_types`, {
      method: 'POST',
      body: JSON.stringify({ name: data.name, description: data.description }),
    });
    return {
      uuid: result.uuid as string,
      companyUuid: result.company_uuid as string | undefined,
      name: result.name as string | undefined,
      description: result.description as string | undefined,
      active: result.active as boolean | undefined,
    };
  }

  async updateEarningType(companyId: string, earningTypeId: string, data: Partial<EarningTypeCreateInput>): Promise<EarningType> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/earning_types/${earningTypeId}`, {
      method: 'PUT',
      body: JSON.stringify({ name: data.name, description: data.description }),
    });
    return {
      uuid: result.uuid as string,
      companyUuid: result.company_uuid as string | undefined,
      name: result.name as string | undefined,
      description: result.description as string | undefined,
      active: result.active as boolean | undefined,
    };
  }

  async deactivateEarningType(companyId: string, earningTypeId: string): Promise<void> {
    await this.request(`/companies/${companyId}/earning_types/${earningTypeId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Company Benefits
  // ===========================================================================

  async listCompanyBenefits(companyId: string): Promise<CompanyBenefit[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/company_benefits`);
    return data.map((b) => this.mapCompanyBenefit(b));
  }

  async getCompanyBenefit(benefitId: string): Promise<CompanyBenefit> {
    const data = await this.request<Record<string, unknown>>(`/company_benefits/${benefitId}`);
    return this.mapCompanyBenefit(data);
  }

  async createCompanyBenefit(companyId: string, data: CompanyBenefitCreateInput): Promise<CompanyBenefit> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/company_benefits`, {
      method: 'POST',
      body: JSON.stringify({
        benefit_type: data.benefitType,
        description: data.description,
        active: data.active,
        responsible_for_employer_taxes: data.responsibleForEmployerTaxes,
        responsible_for_employee_w2: data.responsibleForEmployeeW2,
      }),
    });
    return this.mapCompanyBenefit(result);
  }

  async updateCompanyBenefit(benefitId: string, data: Partial<CompanyBenefitCreateInput>): Promise<CompanyBenefit> {
    const result = await this.request<Record<string, unknown>>(`/company_benefits/${benefitId}`, {
      method: 'PUT',
      body: JSON.stringify({
        description: data.description,
        active: data.active,
        responsible_for_employer_taxes: data.responsibleForEmployerTaxes,
        responsible_for_employee_w2: data.responsibleForEmployeeW2,
      }),
    });
    return this.mapCompanyBenefit(result);
  }

  async deleteCompanyBenefit(benefitId: string): Promise<void> {
    await this.request(`/company_benefits/${benefitId}`, { method: 'DELETE' });
  }

  async listSupportedBenefits(): Promise<SupportedBenefit[]> {
    const data = await this.request<Array<Record<string, unknown>>>('/benefits');
    return data.map((b) => ({
      benefitType: b.benefit_type as string | undefined,
      name: b.name as string | undefined,
      description: b.description as string | undefined,
      pretax: b.pretax as boolean | undefined,
      posttax: b.posttax as boolean | undefined,
      imputed: b.imputed as boolean | undefined,
      healthcareBenefit: b.healthcare_benefit as boolean | undefined,
      retirementBenefit: b.retirement_benefit as boolean | undefined,
    }));
  }

  private mapCompanyBenefit(b: Record<string, unknown>): CompanyBenefit {
    return {
      uuid: b.uuid as string,
      companyUuid: b.company_uuid as string | undefined,
      benefitType: b.benefit_type as string | undefined,
      description: b.description as string | undefined,
      active: b.active as boolean | undefined,
      responsibleForEmployerTaxes: b.responsible_for_employer_taxes as boolean | undefined,
      responsibleForEmployeeW2: b.responsible_for_employee_w2 as boolean | undefined,
    };
  }

  // ===========================================================================
  // Employee Benefits
  // ===========================================================================

  async listEmployeeBenefits(employeeId: string): Promise<EmployeeBenefit[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/employee_benefits`);
    return data.map((b) => this.mapEmployeeBenefit(b));
  }

  async getEmployeeBenefit(benefitId: string): Promise<EmployeeBenefit> {
    const data = await this.request<Record<string, unknown>>(`/employee_benefits/${benefitId}`);
    return this.mapEmployeeBenefit(data);
  }

  async createEmployeeBenefit(employeeId: string, data: EmployeeBenefitCreateInput): Promise<EmployeeBenefit> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/employee_benefits`, {
      method: 'POST',
      body: JSON.stringify({
        company_benefit_uuid: data.companyBenefitUuid,
        active: data.active,
        employee_deduction: data.employeeDeduction,
        company_contribution: data.companyContribution,
        deduct_as_percentage: data.deductAsPercentage,
        contribute_as_percentage: data.contributeAsPercentage,
        catch_up: data.catchUp,
      }),
    });
    return this.mapEmployeeBenefit(result);
  }

  async updateEmployeeBenefit(benefitId: string, data: Partial<EmployeeBenefitCreateInput>): Promise<EmployeeBenefit> {
    const result = await this.request<Record<string, unknown>>(`/employee_benefits/${benefitId}`, {
      method: 'PUT',
      body: JSON.stringify({
        active: data.active,
        employee_deduction: data.employeeDeduction,
        company_contribution: data.companyContribution,
        deduct_as_percentage: data.deductAsPercentage,
        contribute_as_percentage: data.contributeAsPercentage,
        catch_up: data.catchUp,
      }),
    });
    return this.mapEmployeeBenefit(result);
  }

  async deleteEmployeeBenefit(benefitId: string): Promise<void> {
    await this.request(`/employee_benefits/${benefitId}`, { method: 'DELETE' });
  }

  private mapEmployeeBenefit(b: Record<string, unknown>): EmployeeBenefit {
    return {
      uuid: b.uuid as string,
      employeeUuid: b.employee_uuid as string | undefined,
      companyBenefitUuid: b.company_benefit_uuid as string | undefined,
      active: b.active as boolean | undefined,
      employeeDeduction: b.employee_deduction as string | undefined,
      employeeDeductionAnnual: b.employee_deduction_annual as string | undefined,
      companyContribution: b.company_contribution as string | undefined,
      companyContributionAnnual: b.company_contribution_annual as string | undefined,
      deductionReducesTaxableIncome: b.deduction_reduces_taxable_income as string | undefined,
      contributionType: b.contribution_type as string | undefined,
      deductAsPercentage: b.deduct_as_percentage as boolean | undefined,
      contributeAsPercentage: b.contribute_as_percentage as boolean | undefined,
      catchUp: b.catch_up as boolean | undefined,
      coverageAmount: b.coverage_amount as string | undefined,
      coverageSalaryMultiplier: b.coverage_salary_multiplier as string | undefined,
      hraExclusion: b.hra_exclusion as string | undefined,
    };
  }

  // ===========================================================================
  // Time Off Policies
  // ===========================================================================

  async listTimeOffPolicies(companyId: string): Promise<TimeOffPolicy[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/time_off_policies`);
    return data.map((p) => this.mapTimeOffPolicy(p));
  }

  async getTimeOffPolicy(policyId: string): Promise<TimeOffPolicy> {
    const data = await this.request<Record<string, unknown>>(`/time_off_policies/${policyId}`);
    return this.mapTimeOffPolicy(data);
  }

  async createTimeOffPolicy(companyId: string, data: TimeOffPolicyCreateInput): Promise<TimeOffPolicy> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/time_off_policies`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        policy_type: data.policyType,
        accrual_method: data.accrualMethod,
        accrual_rate: data.accrualRate,
        accrual_rate_unit: data.accrualRateUnit,
        paid_out_on_termination: data.paidOutOnTermination,
        accrual_waiting_period_days: data.accrualWaitingPeriodDays,
        carryover_limit_hours: data.carryoverLimitHours,
        max_accrual_hours_per_year: data.maxAccrualHoursPerYear,
        max_hours: data.maxHours,
      }),
    });
    return this.mapTimeOffPolicy(result);
  }

  async updateTimeOffPolicy(policyId: string, data: Partial<TimeOffPolicyCreateInput>): Promise<TimeOffPolicy> {
    const result = await this.request<Record<string, unknown>>(`/time_off_policies/${policyId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        accrual_method: data.accrualMethod,
        accrual_rate: data.accrualRate,
        accrual_rate_unit: data.accrualRateUnit,
        paid_out_on_termination: data.paidOutOnTermination,
        accrual_waiting_period_days: data.accrualWaitingPeriodDays,
        carryover_limit_hours: data.carryoverLimitHours,
        max_accrual_hours_per_year: data.maxAccrualHoursPerYear,
        max_hours: data.maxHours,
      }),
    });
    return this.mapTimeOffPolicy(result);
  }

  async addEmployeesToTimeOffPolicy(policyId: string, employeeUuids: string[]): Promise<void> {
    await this.request(`/time_off_policies/${policyId}/add_employees`, {
      method: 'PUT',
      body: JSON.stringify({ employees: employeeUuids.map((uuid) => ({ uuid })) }),
    });
  }

  async removeEmployeesFromTimeOffPolicy(policyId: string, employeeUuids: string[]): Promise<void> {
    await this.request(`/time_off_policies/${policyId}/remove_employees`, {
      method: 'PUT',
      body: JSON.stringify({ employees: employeeUuids.map((uuid) => ({ uuid })) }),
    });
  }

  private mapTimeOffPolicy(p: Record<string, unknown>): TimeOffPolicy {
    return {
      uuid: p.uuid as string,
      companyUuid: p.company_uuid as string | undefined,
      name: p.name as string | undefined,
      policyType: p.policy_type as TimeOffPolicy['policyType'],
      accrualMethod: p.accrual_method as TimeOffPolicy['accrualMethod'],
      accrualRate: p.accrual_rate as string | undefined,
      accrualRateUnit: p.accrual_rate_unit as string | undefined,
      paidOutOnTermination: p.paid_out_on_termination as boolean | undefined,
      accrualWaitingPeriodDays: p.accrual_waiting_period_days as number | undefined,
      carryoverLimitHours: p.carryover_limit_hours as string | undefined,
      maxAccrualHoursPerYear: p.max_accrual_hours_per_year as string | undefined,
      maxHours: p.max_hours as string | undefined,
      employees: p.employees as Array<{ uuid: string }> | undefined,
    };
  }

  // ===========================================================================
  // Holiday Pay Policy
  // ===========================================================================

  async getHolidayPayPolicy(companyId: string): Promise<HolidayPayPolicy | null> {
    try {
      const data = await this.request<Record<string, unknown>>(`/companies/${companyId}/holiday_pay_policy`);
      return {
        uuid: data.uuid as string | undefined,
        companyUuid: data.company_uuid as string | undefined,
        name: data.name as string | undefined,
        federalHolidays: data.federal_holidays as string[] | undefined,
        customHolidays: data.custom_holidays as HolidayPayPolicy['customHolidays'],
        employees: data.employees as Array<{ uuid: string }> | undefined,
      };
    } catch (error) {
      if (error instanceof CrmApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createHolidayPayPolicy(companyId: string, data: Partial<HolidayPayPolicy>): Promise<HolidayPayPolicy> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/holiday_pay_policy`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        federal_holidays: data.federalHolidays,
        custom_holidays: data.customHolidays,
      }),
    });
    return {
      uuid: result.uuid as string | undefined,
      companyUuid: result.company_uuid as string | undefined,
      name: result.name as string | undefined,
      federalHolidays: result.federal_holidays as string[] | undefined,
      customHolidays: result.custom_holidays as HolidayPayPolicy['customHolidays'],
      employees: result.employees as Array<{ uuid: string }> | undefined,
    };
  }

  async updateHolidayPayPolicy(companyId: string, data: Partial<HolidayPayPolicy>): Promise<HolidayPayPolicy> {
    const result = await this.request<Record<string, unknown>>(`/companies/${companyId}/holiday_pay_policy`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        federal_holidays: data.federalHolidays,
        custom_holidays: data.customHolidays,
      }),
    });
    return {
      uuid: result.uuid as string | undefined,
      companyUuid: result.company_uuid as string | undefined,
      name: result.name as string | undefined,
      federalHolidays: result.federal_holidays as string[] | undefined,
      customHolidays: result.custom_holidays as HolidayPayPolicy['customHolidays'],
      employees: result.employees as Array<{ uuid: string }> | undefined,
    };
  }

  // ===========================================================================
  // Forms
  // ===========================================================================

  async listEmployeeForms(employeeId: string): Promise<EmployeeForm[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/forms`);
    return data.map((f) => ({
      uuid: f.uuid as string,
      employeeUuid: f.employee_uuid as string | undefined,
      name: f.name as string | undefined,
      title: f.title as string | undefined,
      description: f.description as string | undefined,
      signed: f.signed as boolean | undefined,
      requiresSigning: f.requires_signing as boolean | undefined,
    }));
  }

  async listCompanyForms(companyId: string): Promise<CompanyForm[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/forms`);
    return data.map((f) => ({
      uuid: f.uuid as string,
      companyUuid: f.company_uuid as string | undefined,
      name: f.name as string | undefined,
      title: f.title as string | undefined,
      description: f.description as string | undefined,
      signed: f.signed as boolean | undefined,
      requiresSigning: f.requires_signing as boolean | undefined,
    }));
  }

  async listContractorForms(contractorId: string): Promise<ContractorForm[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/contractors/${contractorId}/forms`);
    return data.map((f) => ({
      uuid: f.uuid as string,
      contractorUuid: f.contractor_uuid as string | undefined,
      name: f.name as string | undefined,
      title: f.title as string | undefined,
      description: f.description as string | undefined,
      signed: f.signed as boolean | undefined,
      requiresSigning: f.requires_signing as boolean | undefined,
    }));
  }

  // ===========================================================================
  // Webhooks
  // ===========================================================================

  async listWebhookSubscriptions(): Promise<WebhookSubscription[]> {
    const data = await this.request<Array<Record<string, unknown>>>('/webhook_subscriptions');
    return data.map((w) => ({
      uuid: w.uuid as string,
      url: w.url as string | undefined,
      subscriptionTypes: w.subscription_types as string[] | undefined,
      status: w.status as 'pending' | 'verified' | 'failed' | undefined,
    }));
  }

  async getWebhookSubscription(subscriptionId: string): Promise<WebhookSubscription> {
    const data = await this.request<Record<string, unknown>>(`/webhook_subscriptions/${subscriptionId}`);
    return {
      uuid: data.uuid as string,
      url: data.url as string | undefined,
      subscriptionTypes: data.subscription_types as string[] | undefined,
      status: data.status as 'pending' | 'verified' | 'failed' | undefined,
    };
  }

  async createWebhookSubscription(data: WebhookSubscriptionCreateInput): Promise<WebhookSubscription> {
    const result = await this.request<Record<string, unknown>>('/webhook_subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        url: data.url,
        subscription_types: data.subscriptionTypes,
      }),
    });
    return {
      uuid: result.uuid as string,
      url: result.url as string | undefined,
      subscriptionTypes: result.subscription_types as string[] | undefined,
      status: result.status as 'pending' | 'verified' | 'failed' | undefined,
    };
  }

  async updateWebhookSubscription(subscriptionId: string, data: Partial<WebhookSubscriptionCreateInput>): Promise<WebhookSubscription> {
    const result = await this.request<Record<string, unknown>>(`/webhook_subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        url: data.url,
        subscription_types: data.subscriptionTypes,
      }),
    });
    return {
      uuid: result.uuid as string,
      url: result.url as string | undefined,
      subscriptionTypes: result.subscription_types as string[] | undefined,
      status: result.status as 'pending' | 'verified' | 'failed' | undefined,
    };
  }

  async deleteWebhookSubscription(subscriptionId: string): Promise<void> {
    await this.request(`/webhook_subscriptions/${subscriptionId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Events
  // ===========================================================================

  async listEvents(params?: { startingAfterUuid?: string; resourceUuid?: string; resourceType?: string; limit?: number }): Promise<GustoEvent[]> {
    const queryParams = new URLSearchParams();
    if (params?.startingAfterUuid) queryParams.set('starting_after_uuid', params.startingAfterUuid);
    if (params?.resourceUuid) queryParams.set('resource_uuid', params.resourceUuid);
    if (params?.resourceType) queryParams.set('resource_type', params.resourceType);
    if (params?.limit) queryParams.set('limit', String(params.limit));
    const data = await this.request<Array<Record<string, unknown>>>(`/events?${queryParams}`);
    return data.map((e) => ({
      uuid: e.uuid as string,
      resourceUuid: e.resource_uuid as string | undefined,
      resourceType: e.resource_type as string | undefined,
      eventType: e.event_type as string | undefined,
      timestamp: e.timestamp as string | undefined,
      companyUuid: e.company_uuid as string | undefined,
    }));
  }

  // ===========================================================================
  // Notifications
  // ===========================================================================

  async listNotifications(companyId: string): Promise<Notification[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/companies/${companyId}/notifications`);
    return data.map((n) => ({
      uuid: n.uuid as string,
      companyUuid: n.company_uuid as string | undefined,
      type: n.type as string | undefined,
      message: n.message as string | undefined,
      status: n.status as string | undefined,
      createdAt: n.created_at as string | undefined,
    }));
  }

  // ===========================================================================
  // Reimbursements
  // ===========================================================================

  async listRecurringReimbursements(employeeId: string): Promise<RecurringReimbursement[]> {
    const data = await this.request<Array<Record<string, unknown>>>(`/employees/${employeeId}/recurring_reimbursements`);
    return data.map((r) => ({
      uuid: r.uuid as string,
      employeeUuid: r.employee_uuid as string | undefined,
      description: r.description as string | undefined,
      amount: r.amount as string | undefined,
      effectiveDate: r.effective_date as string | undefined,
      active: r.active as boolean | undefined,
    }));
  }

  async createRecurringReimbursement(employeeId: string, data: RecurringReimbursementCreateInput): Promise<RecurringReimbursement> {
    const result = await this.request<Record<string, unknown>>(`/employees/${employeeId}/recurring_reimbursements`, {
      method: 'POST',
      body: JSON.stringify({
        description: data.description,
        amount: data.amount,
        effective_date: data.effectiveDate,
        active: data.active,
      }),
    });
    return {
      uuid: result.uuid as string,
      employeeUuid: result.employee_uuid as string | undefined,
      description: result.description as string | undefined,
      amount: result.amount as string | undefined,
      effectiveDate: result.effective_date as string | undefined,
      active: result.active as boolean | undefined,
    };
  }

  async updateRecurringReimbursement(reimbursementId: string, data: Partial<RecurringReimbursementCreateInput>): Promise<RecurringReimbursement> {
    const result = await this.request<Record<string, unknown>>(`/recurring_reimbursements/${reimbursementId}`, {
      method: 'PUT',
      body: JSON.stringify({
        description: data.description,
        amount: data.amount,
        effective_date: data.effectiveDate,
        active: data.active,
      }),
    });
    return {
      uuid: result.uuid as string,
      employeeUuid: result.employee_uuid as string | undefined,
      description: result.description as string | undefined,
      amount: result.amount as string | undefined,
      effectiveDate: result.effective_date as string | undefined,
      active: result.active as boolean | undefined,
    };
  }

  async deleteRecurringReimbursement(reimbursementId: string): Promise<void> {
    await this.request(`/recurring_reimbursements/${reimbursementId}`, { method: 'DELETE' });
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createGustoClient(credentials: TenantCredentials): GustoClient {
  return new GustoClientImpl(credentials);
}

// Re-export for backwards compatibility
export { createGustoClient as createCrmClient };
export type { GustoClient as CrmClient };

// Import EmployeeCompensation type for internal use
import type { EmployeeCompensation } from './types/entities.js';
