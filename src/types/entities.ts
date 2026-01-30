/**
 * Gusto Entity Types
 *
 * Type definitions for Gusto Embedded Payroll API entities.
 */

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  per?: number;
}

export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Number of items in this response */
  count: number;
  /** Total count (if available) */
  total?: number;
  /** Whether more items are available */
  hasMore: boolean;
  /** Page number for next page */
  nextPage?: number;
}

// =============================================================================
// Response Format
// =============================================================================

export type ResponseFormat = 'json' | 'markdown';

// =============================================================================
// Address Types
// =============================================================================

export interface Address {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

// =============================================================================
// Company Types
// =============================================================================

export interface Company {
  uuid: string;
  name: string;
  tradeName?: string;
  ein?: string;
  entityType?: string;
  companyStatus?: string;
  tier?: string;
  isPartnerManaged?: boolean;
  primarySignatory?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  primaryPayrollAdmin?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  locations?: CompanyLocation[];
}

export interface CompanyLocation {
  uuid: string;
  companyUuid?: string;
  phoneNumber?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  active?: boolean;
  mailingAddress?: boolean;
  filingAddress?: boolean;
}

export interface CompanyLocationCreateInput {
  phoneNumber?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  mailingAddress?: boolean;
  filingAddress?: boolean;
}

export interface CompanyBankAccount {
  uuid: string;
  companyUuid?: string;
  name?: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: 'Checking' | 'Savings';
  verificationStatus?: string;
}

export interface Department {
  uuid: string;
  title: string;
  companyUuid?: string;
  contractors?: Array<{ uuid: string }>;
  employees?: Array<{ uuid: string }>;
}

export interface Admin {
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Signatory {
  uuid: string;
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  title?: string;
  birthday?: string;
  ssn?: string;
  homeAddress?: Address;
}

// =============================================================================
// Employee Types
// =============================================================================

export interface Employee {
  uuid: string;
  companyUuid?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  ssn?: string;
  phone?: string;
  preferredFirstName?: string;
  twoPercentShareholder?: boolean;
  onboarded?: boolean;
  department?: string;
  terminated?: boolean;
  terminationDate?: string;
  currentEmploymentStatus?: string;
  workEmail?: string;
  homeAddress?: Address;
  jobs?: Job[];
  garnishments?: Garnishment[];
  customFields?: Record<string, unknown>;
  paymentMethod?: string;
  hasDirectDeposit?: boolean;
}

export interface EmployeeCreateInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  email?: string;
  ssn?: string;
  selfOnboarding?: boolean;
}

export interface EmployeeUpdateInput {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredFirstName?: string;
  email?: string;
  dateOfBirth?: string;
  ssn?: string;
  twoPercentShareholder?: boolean;
}

export interface EmployeeOnboardingStatus {
  uuid: string;
  onboardingStatus?: string;
  onboardingSteps?: Array<{
    title: string;
    id: string;
    required: boolean;
    completed: boolean;
    requirements?: Array<{
      name: string;
      completed: boolean;
    }>;
  }>;
}

// =============================================================================
// Job & Compensation Types
// =============================================================================

export interface Job {
  uuid: string;
  employeeUuid?: string;
  locationUuid?: string;
  title?: string;
  primary?: boolean;
  rate?: string;
  paymentUnit?: 'Hour' | 'Week' | 'Month' | 'Year' | 'Paycheck';
  currentCompensationUuid?: string;
  hireDate?: string;
  compensations?: Compensation[];
}

export interface JobCreateInput {
  title: string;
  locationUuid?: string;
  hireDate?: string;
}

export interface JobUpdateInput {
  title?: string;
  locationUuid?: string;
}

export interface Compensation {
  uuid: string;
  jobUuid?: string;
  rate?: string;
  paymentUnit?: 'Hour' | 'Week' | 'Month' | 'Year' | 'Paycheck';
  flsaStatus?: 'Exempt' | 'Salaried Nonexempt' | 'Nonexempt' | 'Owner';
  effectiveDate?: string;
  adjustForMinimumWage?: boolean;
  minimumWages?: Array<{
    uuid: string;
    effectiveDate: string;
    wage: string;
  }>;
}

export interface CompensationCreateInput {
  rate: string;
  paymentUnit: 'Hour' | 'Week' | 'Month' | 'Year' | 'Paycheck';
  flsaStatus?: 'Exempt' | 'Salaried Nonexempt' | 'Nonexempt' | 'Owner';
  effectiveDate?: string;
  adjustForMinimumWage?: boolean;
}

// =============================================================================
// Employee Address Types
// =============================================================================

export interface HomeAddress {
  uuid: string;
  employeeUuid?: string;
  version?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  active?: boolean;
  effectiveDate?: string;
}

export interface HomeAddressCreateInput {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  effectiveDate?: string;
}

export interface WorkAddress {
  uuid: string;
  employeeUuid?: string;
  locationUuid?: string;
  effectiveDate?: string;
}

// =============================================================================
// Termination & Rehire Types
// =============================================================================

export interface Termination {
  uuid: string;
  employeeUuid?: string;
  active?: boolean;
  effectiveDate?: string;
  runTerminationPayroll?: boolean;
}

export interface TerminationCreateInput {
  effectiveDate: string;
  runTerminationPayroll?: boolean;
}

export interface Rehire {
  uuid: string;
  employeeUuid?: string;
  effectiveDate?: string;
  fileNewHireReport?: boolean;
  workLocationUuid?: string;
  employmentStatus?: string;
  twoPercentShareholder?: boolean;
}

// =============================================================================
// Tax Types
// =============================================================================

export interface FederalTaxDetails {
  uuid?: string;
  version?: string;
  filingStatus?: string;
  extraWithholding?: string;
  twoJobs?: boolean;
  dependentsAmount?: string;
  otherIncome?: string;
  deductions?: string;
  w4DataType?: string;
}

export interface StateTaxDetails {
  uuid?: string;
  state?: string;
  filingStatus?: string;
  extraWithholding?: string;
  exemptions?: number;
  allowances?: number;
}

export interface CompanyFederalTaxDetails {
  uuid?: string;
  ein?: string;
  einVerified?: boolean;
  legalName?: string;
  taxPayerType?: string;
  filingForm?: string;
  version?: string;
}

// =============================================================================
// Contractor Types
// =============================================================================

export interface Contractor {
  uuid: string;
  companyUuid?: string;
  type?: 'Individual' | 'Business';
  wageType?: 'Fixed' | 'Hourly';
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  email?: string;
  businessName?: string;
  ein?: string;
  ssn?: string;
  isActive?: boolean;
  startDate?: string;
  address?: Address;
  hourlyRate?: string;
  onboarded?: boolean;
  selfOnboarding?: boolean;
}

export interface ContractorCreateInput {
  type: 'Individual' | 'Business';
  wageType: 'Fixed' | 'Hourly';
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  email?: string;
  businessName?: string;
  ein?: string;
  ssn?: string;
  startDate?: string;
  selfOnboarding?: boolean;
}

export interface ContractorUpdateInput {
  type?: 'Individual' | 'Business';
  wageType?: 'Fixed' | 'Hourly';
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  email?: string;
  businessName?: string;
  ein?: string;
  startDate?: string;
}

export interface ContractorPayment {
  uuid: string;
  contractorUuid?: string;
  companyUuid?: string;
  bonus?: string;
  date?: string;
  hours?: string;
  paymentMethod?: string;
  reimbursement?: string;
  wage?: string;
  wageTotal?: string;
  status?: string;
}

export interface ContractorPaymentCreateInput {
  contractorUuid: string;
  date: string;
  wage?: string;
  hours?: string;
  bonus?: string;
  reimbursement?: string;
  paymentMethod?: 'Direct Deposit' | 'Check' | 'Historical Payment';
}

export interface ContractorPaymentGroup {
  uuid: string;
  companyUuid?: string;
  checkDate?: string;
  status?: string;
  contractorPayments?: ContractorPayment[];
}

// =============================================================================
// Payroll Types
// =============================================================================

export interface Payroll {
  payrollUuid?: string;
  uuid?: string;
  companyUuid?: string;
  processed?: boolean;
  processedDate?: string;
  payPeriodStartDate?: string;
  payPeriodEndDate?: string;
  checkDate?: string;
  payrollDeadline?: string;
  payScheduleUuid?: string;
  payScheduleType?: string;
  version?: string;
  totals?: PayrollTotals;
  employeeCompensations?: EmployeeCompensation[];
}

export interface PayrollTotals {
  companyDebit?: string;
  reimbursements?: string;
  netPay?: string;
  grossPay?: string;
  employerTaxes?: string;
  employeeTaxes?: string;
  benefits?: string;
  employerBenefits?: string;
  employeeBenefits?: string;
  deferredPayroll?: string;
  childSupportDebit?: string;
}

export interface EmployeeCompensation {
  employeeUuid?: string;
  excluded?: boolean;
  grossPay?: string;
  netPay?: string;
  paymentMethod?: string;
  fixedCompensations?: Array<{
    name?: string;
    amount?: string;
    jobUuid?: string;
  }>;
  hourlyCompensations?: Array<{
    name?: string;
    hours?: string;
    jobUuid?: string;
    compensationMultiplier?: number;
  }>;
  paidTimeOff?: Array<{
    name?: string;
    hours?: string;
  }>;
  taxes?: Array<{
    name?: string;
    amount?: string;
    employer?: boolean;
  }>;
  benefits?: Array<{
    name?: string;
    employeeDeduction?: string;
    companyContribution?: string;
    imputed?: boolean;
  }>;
  deductions?: Array<{
    name?: string;
    amount?: string;
  }>;
}

export interface PayrollUpdateInput {
  employeeCompensations: Array<{
    employeeUuid: string;
    excluded?: boolean;
    fixedCompensations?: Array<{
      name: string;
      amount: string;
      jobUuid?: string;
    }>;
    hourlyCompensations?: Array<{
      name: string;
      hours: string;
      jobUuid?: string;
    }>;
    paidTimeOff?: Array<{
      name: string;
      hours: string;
    }>;
  }>;
  version?: string;
}

export interface OffCyclePayrollCreateInput {
  offCycleReason:
    | 'Bonus'
    | 'Correction'
    | 'Dismissed Employee'
    | 'Transition';
  checkDate: string;
  startDate?: string;
  endDate?: string;
  employeeUuids?: string[];
  withholdsOnlyTaxes?: boolean;
  skipRegularDeductions?: boolean;
}

// =============================================================================
// Pay Schedule Types
// =============================================================================

export interface PaySchedule {
  uuid: string;
  companyUuid?: string;
  frequency?:
    | 'Every week'
    | 'Every other week'
    | 'Twice per month'
    | 'Monthly';
  anchorPayDate?: string;
  anchorEndOfPayPeriod?: string;
  day1?: number;
  day2?: number;
  name?: string;
  autoPilot?: boolean;
  employees?: Array<{ uuid: string }>;
}

export interface PayScheduleCreateInput {
  frequency: 'Every week' | 'Every other week' | 'Twice per month' | 'Monthly';
  anchorPayDate: string;
  anchorEndOfPayPeriod: string;
  day1?: number;
  day2?: number;
  name?: string;
  autoPilot?: boolean;
}

export interface PayPeriod {
  startDate?: string;
  endDate?: string;
  payScheduleUuid?: string;
  checkDate?: string;
  payrollUuid?: string;
  processed?: boolean;
  eligibleEmployees?: Array<{ uuid: string }>;
}

// =============================================================================
// Earning Type
// =============================================================================

export interface EarningType {
  uuid: string;
  companyUuid?: string;
  name?: string;
  description?: string;
  active?: boolean;
}

export interface EarningTypeCreateInput {
  name: string;
  description?: string;
}

// =============================================================================
// Benefits Types
// =============================================================================

export interface CompanyBenefit {
  uuid: string;
  companyUuid?: string;
  benefitType?: string;
  description?: string;
  active?: boolean;
  responsibleForEmployerTaxes?: boolean;
  responsibleForEmployeeW2?: boolean;
}

export interface CompanyBenefitCreateInput {
  benefitType: string;
  description?: string;
  active?: boolean;
  responsibleForEmployerTaxes?: boolean;
  responsibleForEmployeeW2?: boolean;
}

export interface EmployeeBenefit {
  uuid: string;
  employeeUuid?: string;
  companyBenefitUuid?: string;
  active?: boolean;
  employeeDeduction?: string;
  employeeDeductionAnnual?: string;
  companyContribution?: string;
  companyContributionAnnual?: string;
  deductionReducesTaxableIncome?: string;
  contributionType?: string;
  deductAsPercentage?: boolean;
  contributeAsPercentage?: boolean;
  catchUp?: boolean;
  coverageAmount?: string;
  coverageSalaryMultiplier?: string;
  hraExclusion?: string;
}

export interface EmployeeBenefitCreateInput {
  companyBenefitUuid: string;
  active?: boolean;
  employeeDeduction?: string;
  companyContribution?: string;
  deductAsPercentage?: boolean;
  contributeAsPercentage?: boolean;
  catchUp?: boolean;
}

export interface SupportedBenefit {
  benefitType?: string;
  name?: string;
  description?: string;
  pretax?: boolean;
  posttax?: boolean;
  imputed?: boolean;
  healthcareBenefit?: boolean;
  retirementBenefit?: boolean;
}

// =============================================================================
// Time Off Types
// =============================================================================

export interface TimeOffPolicy {
  uuid: string;
  companyUuid?: string;
  name?: string;
  policyType?:
    | 'vacation'
    | 'sick'
    | 'holiday'
    | 'bereavement'
    | 'jury_duty'
    | 'other';
  accrualMethod?: 'unlimited' | 'per_pay_period' | 'per_calendar_year';
  accrualRate?: string;
  accrualRateUnit?: string;
  paidOutOnTermination?: boolean;
  accrualWaitingPeriodDays?: number;
  carryoverLimitHours?: string;
  maxAccrualHoursPerYear?: string;
  maxHours?: string;
  employees?: Array<{ uuid: string }>;
}

export interface TimeOffPolicyCreateInput {
  name: string;
  policyType:
    | 'vacation'
    | 'sick'
    | 'holiday'
    | 'bereavement'
    | 'jury_duty'
    | 'other';
  accrualMethod: 'unlimited' | 'per_pay_period' | 'per_calendar_year';
  accrualRate?: string;
  accrualRateUnit?: string;
  paidOutOnTermination?: boolean;
  accrualWaitingPeriodDays?: number;
  carryoverLimitHours?: string;
  maxAccrualHoursPerYear?: string;
  maxHours?: string;
}

export interface TimeOffRequest {
  uuid: string;
  employeeUuid?: string;
  employeeNote?: string;
  approverNote?: string;
  timeOffPolicyUuid?: string;
  status?: 'pending' | 'approved' | 'denied';
  requestType?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  hours?: string;
  initiatorId?: string;
  approver?: {
    uuid?: string;
    name?: string;
  };
}

export interface TimeOffActivity {
  uuid: string;
  policyName?: string;
  policyUuid?: string;
  eventType?: string;
  eventDescription?: string;
  balance?: string;
  balanceChange?: string;
  effectiveTime?: string;
}

// =============================================================================
// Garnishment Types
// =============================================================================

export interface Garnishment {
  uuid: string;
  employeeUuid?: string;
  active?: boolean;
  amount?: string;
  description?: string;
  courtOrdered?: boolean;
  times?: number;
  recurring?: boolean;
  annualMaximum?: string;
  payPeriodMaximum?: string;
  deductAsPercentage?: boolean;
}

export interface GarnishmentCreateInput {
  description: string;
  active?: boolean;
  amount: string;
  courtOrdered?: boolean;
  times?: number;
  recurring?: boolean;
  annualMaximum?: string;
  payPeriodMaximum?: string;
  deductAsPercentage?: boolean;
}

// =============================================================================
// Bank Account Types
// =============================================================================

export interface EmployeeBankAccount {
  uuid: string;
  employeeUuid?: string;
  name?: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: 'Checking' | 'Savings';
  hidden_account_number?: string;
}

export interface EmployeeBankAccountCreateInput {
  name: string;
  routingNumber: string;
  accountNumber: string;
  accountType: 'Checking' | 'Savings';
}

export interface EmployeePaymentMethod {
  type?: 'Direct Deposit' | 'Check';
  splitBy?: 'Amount' | 'Percentage';
  splits?: Array<{
    uuid?: string;
    bankAccountUuid?: string;
    name?: string;
    priority?: number;
    splitAmount?: string;
  }>;
}

export interface ContractorBankAccount {
  uuid: string;
  contractorUuid?: string;
  name?: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: 'Checking' | 'Savings';
}

// =============================================================================
// Forms Types
// =============================================================================

export interface EmployeeForm {
  uuid: string;
  employeeUuid?: string;
  name?: string;
  title?: string;
  description?: string;
  signed?: boolean;
  requiresSigning?: boolean;
}

export interface CompanyForm {
  uuid: string;
  companyUuid?: string;
  name?: string;
  title?: string;
  description?: string;
  signed?: boolean;
  requiresSigning?: boolean;
}

export interface ContractorForm {
  uuid: string;
  contractorUuid?: string;
  name?: string;
  title?: string;
  description?: string;
  signed?: boolean;
  requiresSigning?: boolean;
}

// =============================================================================
// Webhook Types
// =============================================================================

export interface WebhookSubscription {
  uuid: string;
  url?: string;
  subscriptionTypes?: string[];
  status?: 'pending' | 'verified' | 'failed';
}

export interface WebhookSubscriptionCreateInput {
  url: string;
  subscriptionTypes: string[];
}

// =============================================================================
// Report Types
// =============================================================================

export interface Report {
  requestUuid: string;
  status?: 'pending' | 'completed' | 'failed';
  columns?: string[];
  rows?: Array<Record<string, unknown>>;
  downloadUrl?: string;
}

// =============================================================================
// Holiday Pay Policy Types
// =============================================================================

export interface HolidayPayPolicy {
  uuid?: string;
  companyUuid?: string;
  name?: string;
  federalHolidays?: string[];
  customHolidays?: Array<{
    name: string;
    date: string;
  }>;
  employees?: Array<{ uuid: string }>;
}

// =============================================================================
// External Payroll Types
// =============================================================================

export interface ExternalPayroll {
  uuid: string;
  companyUuid?: string;
  checkDate?: string;
  paymentPeriodStartDate?: string;
  paymentPeriodEndDate?: string;
  status?: string;
  externalPayrollItems?: Array<{
    employeeUuid?: string;
    earnings?: Array<{
      earningType?: string;
      amount?: string;
    }>;
    taxes?: Array<{
      name?: string;
      amount?: string;
      employer?: boolean;
    }>;
    benefits?: Array<{
      benefitType?: string;
      employeeDeduction?: string;
      companyContribution?: string;
    }>;
  }>;
}

// =============================================================================
// Event Types
// =============================================================================

export interface GustoEvent {
  uuid: string;
  resourceUuid?: string;
  resourceType?: string;
  eventType?: string;
  timestamp?: string;
  companyUuid?: string;
}

// =============================================================================
// I-9 Authorization Types
// =============================================================================

export interface I9Authorization {
  uuid?: string;
  employeeUuid?: string;
  documentTitle?: string;
  citizenshipStatus?: string;
  expirationDate?: string;
  alienNumber?: string;
  i94Number?: string;
  foreignPassportNumber?: string;
  countryOfIssuance?: string;
}

// =============================================================================
// Reimbursement Types
// =============================================================================

export interface RecurringReimbursement {
  uuid: string;
  employeeUuid?: string;
  description?: string;
  amount?: string;
  effectiveDate?: string;
  active?: boolean;
}

export interface RecurringReimbursementCreateInput {
  description: string;
  amount: string;
  effectiveDate?: string;
  active?: boolean;
}

// =============================================================================
// Notification Types
// =============================================================================

export interface Notification {
  uuid: string;
  companyUuid?: string;
  type?: string;
  message?: string;
  status?: string;
  createdAt?: string;
}

// =============================================================================
// Token Info Types
// =============================================================================

export interface TokenInfo {
  resourceOwner?: {
    uuid?: string;
    type?: string;
    email?: string;
  };
  scope?: string[];
  applicationId?: string;
  createdAt?: string;
  expiresIn?: number;
}
