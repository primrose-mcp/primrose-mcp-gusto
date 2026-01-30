/**
 * Gusto MCP Tools
 *
 * Registers all Gusto API tools with the MCP server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GustoClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all Gusto tools
 */
export function registerGustoTools(server: McpServer, client: GustoClient): void {
  registerConnectionTools(server, client);
  registerCompanyTools(server, client);
  registerEmployeeTools(server, client);
  registerContractorTools(server, client);
  registerPayrollTools(server, client);
  registerBenefitTools(server, client);
  registerTimeOffTools(server, client);
  registerWebhookTools(server, client);
}

// =============================================================================
// Connection Tools
// =============================================================================

function registerConnectionTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_test_connection',
    'Test the connection to the Gusto API and verify credentials.',
    {},
    async () => {
      try {
        const result = await client.testConnection();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_token_info',
    'Get information about the current OAuth access token.',
    {},
    async () => {
      try {
        const result = await client.getTokenInfo();
        return formatResponse(result, 'json', 'tokenInfo');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}

// =============================================================================
// Company Tools
// =============================================================================

function registerCompanyTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_get_company',
    'Get details of a company by ID.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.getCompany(companyId);
        return formatResponse(result, format, 'company');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_locations',
    'List all locations for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listLocations(companyId);
        return formatResponse(result, format, 'locations');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_location',
    'Create a new location for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      street1: z.string().describe('Street address'),
      city: z.string().describe('City'),
      state: z.string().describe('State (2-letter code)'),
      zip: z.string().describe('ZIP code'),
      street2: z.string().optional().describe('Street address line 2'),
      phoneNumber: z.string().optional().describe('Phone number'),
      mailingAddress: z.boolean().optional().describe('Is this the mailing address?'),
      filingAddress: z.boolean().optional().describe('Is this the filing address?'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createLocation(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, location: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_departments',
    'List all departments for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listDepartments(companyId);
        return formatResponse(result, format, 'departments');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_department',
    'Create a new department for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      title: z.string().describe('Department title'),
    },
    async ({ companyId, title }) => {
      try {
        const result = await client.createDepartment(companyId, title);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, department: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_admins',
    'List all admins for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listAdmins(companyId);
        return formatResponse(result, format, 'admins');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_signatories',
    'List all signatories for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listSignatories(companyId);
        return formatResponse(result, format, 'signatories');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_company_bank_accounts',
    'List all bank accounts for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listCompanyBankAccounts(companyId);
        return formatResponse(result, format, 'bankAccounts');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}

// =============================================================================
// Employee Tools
// =============================================================================

function registerEmployeeTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_list_employees',
    'List employees for a company with pagination.',
    {
      companyId: z.string().describe('Company UUID'),
      page: z.number().int().min(1).optional().describe('Page number'),
      per: z.number().int().min(1).max(100).optional().describe('Items per page'),
      terminated: z.boolean().optional().describe('Include terminated employees'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, page, per, terminated, format }) => {
      try {
        const result = await client.listEmployees(companyId, { page, per, terminated });
        return formatResponse(result, format, 'employees');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_employee',
    'Get details of a single employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.getEmployee(employeeId);
        return formatResponse(result, format, 'employee');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_employee',
    'Create a new employee.',
    {
      companyId: z.string().describe('Company UUID'),
      firstName: z.string().describe('First name'),
      lastName: z.string().describe('Last name'),
      middleName: z.string().optional().describe('Middle name'),
      email: z.string().email().optional().describe('Email address'),
      dateOfBirth: z.string().optional().describe('Date of birth (YYYY-MM-DD)'),
      ssn: z.string().optional().describe('Social Security Number'),
      selfOnboarding: z.boolean().optional().describe('Enable self-onboarding'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createEmployee(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, employee: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_update_employee',
    'Update an existing employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      middleName: z.string().optional(),
      email: z.string().email().optional(),
      dateOfBirth: z.string().optional(),
      twoPercentShareholder: z.boolean().optional(),
    },
    async ({ employeeId, ...data }) => {
      try {
        const result = await client.updateEmployee(employeeId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, employee: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_employee_onboarding_status',
    'Get onboarding status for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.getEmployeeOnboardingStatus(employeeId);
        return formatResponse(result, format, 'onboardingStatus');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_jobs',
    'List jobs for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listJobs(employeeId);
        return formatResponse(result, format, 'jobs');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_job',
    'Create a job for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      title: z.string().describe('Job title'),
      locationUuid: z.string().optional().describe('Location UUID'),
      hireDate: z.string().optional().describe('Hire date (YYYY-MM-DD)'),
    },
    async ({ employeeId, ...data }) => {
      try {
        const result = await client.createJob(employeeId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, job: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_compensations',
    'List compensations for a job.',
    {
      jobId: z.string().describe('Job UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ jobId, format }) => {
      try {
        const result = await client.listCompensations(jobId);
        return formatResponse(result, format, 'compensations');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_compensation',
    'Create a compensation for a job.',
    {
      jobId: z.string().describe('Job UUID'),
      rate: z.string().describe('Pay rate'),
      paymentUnit: z.enum(['Hour', 'Week', 'Month', 'Year', 'Paycheck']).describe('Payment unit'),
      flsaStatus: z.enum(['Exempt', 'Salaried Nonexempt', 'Nonexempt', 'Owner']).optional(),
      effectiveDate: z.string().optional().describe('Effective date (YYYY-MM-DD)'),
    },
    async ({ jobId, ...data }) => {
      try {
        const result = await client.createCompensation(jobId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, compensation: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_home_addresses',
    'List home addresses for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listHomeAddresses(employeeId);
        return formatResponse(result, format, 'homeAddresses');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_home_address',
    'Create a home address for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      street1: z.string().describe('Street address'),
      city: z.string().describe('City'),
      state: z.string().describe('State (2-letter code)'),
      zip: z.string().describe('ZIP code'),
      street2: z.string().optional(),
      effectiveDate: z.string().optional().describe('Effective date (YYYY-MM-DD)'),
    },
    async ({ employeeId, ...data }) => {
      try {
        const result = await client.createHomeAddress(employeeId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, address: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_federal_taxes',
    'Get federal tax information for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.getFederalTaxes(employeeId);
        return formatResponse(result, format, 'federalTaxes');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_state_taxes',
    'Get state tax information for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.getStateTaxes(employeeId);
        return formatResponse(result, format, 'stateTaxes');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_employee_bank_accounts',
    'List bank accounts for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listEmployeeBankAccounts(employeeId);
        return formatResponse(result, format, 'bankAccounts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_employee_payment_method',
    'Get payment method for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.getEmployeePaymentMethod(employeeId);
        return formatResponse(result, format, 'paymentMethod');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_terminations',
    'List terminations for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listTerminations(employeeId);
        return formatResponse(result, format, 'terminations');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_termination',
    'Create a termination for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      effectiveDate: z.string().describe('Termination date (YYYY-MM-DD)'),
      runTerminationPayroll: z.boolean().optional().describe('Run termination payroll'),
    },
    async ({ employeeId, ...data }) => {
      try {
        const result = await client.createTermination(employeeId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, termination: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_garnishments',
    'List garnishments for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listGarnishments(employeeId);
        return formatResponse(result, format, 'garnishments');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_garnishment',
    'Create a garnishment for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      description: z.string().describe('Description'),
      amount: z.string().describe('Amount'),
      courtOrdered: z.boolean().optional().describe('Is court ordered'),
      recurring: z.boolean().optional().describe('Is recurring'),
      deductAsPercentage: z.boolean().optional().describe('Deduct as percentage'),
    },
    async ({ employeeId, ...data }) => {
      try {
        const result = await client.createGarnishment(employeeId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, garnishment: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_employee_forms',
    'List forms for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listEmployeeForms(employeeId);
        return formatResponse(result, format, 'forms');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_recurring_reimbursements',
    'List recurring reimbursements for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listRecurringReimbursements(employeeId);
        return formatResponse(result, format, 'reimbursements');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_recurring_reimbursement',
    'Create a recurring reimbursement for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      description: z.string().describe('Description'),
      amount: z.string().describe('Amount'),
      effectiveDate: z.string().optional().describe('Effective date (YYYY-MM-DD)'),
      active: z.boolean().optional().describe('Is active'),
    },
    async ({ employeeId, ...data }) => {
      try {
        const result = await client.createRecurringReimbursement(employeeId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, reimbursement: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}

// =============================================================================
// Contractor Tools
// =============================================================================

function registerContractorTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_list_contractors',
    'List contractors for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listContractors(companyId);
        return formatResponse(result, format, 'contractors');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_contractor',
    'Get details of a contractor.',
    {
      contractorId: z.string().describe('Contractor UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ contractorId, format }) => {
      try {
        const result = await client.getContractor(contractorId);
        return formatResponse(result, format, 'contractor');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_contractor',
    'Create a new contractor.',
    {
      companyId: z.string().describe('Company UUID'),
      type: z.enum(['Individual', 'Business']).describe('Contractor type'),
      wageType: z.enum(['Fixed', 'Hourly']).describe('Wage type'),
      firstName: z.string().optional().describe('First name (for Individual)'),
      lastName: z.string().optional().describe('Last name (for Individual)'),
      businessName: z.string().optional().describe('Business name (for Business)'),
      email: z.string().email().optional().describe('Email address'),
      startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      selfOnboarding: z.boolean().optional().describe('Enable self-onboarding'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createContractor(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, contractor: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_update_contractor',
    'Update an existing contractor.',
    {
      contractorId: z.string().describe('Contractor UUID'),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      businessName: z.string().optional(),
      email: z.string().email().optional(),
    },
    async ({ contractorId, ...data }) => {
      try {
        const result = await client.updateContractor(contractorId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, contractor: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_delete_contractor',
    'Delete a contractor.',
    {
      contractorId: z.string().describe('Contractor UUID'),
    },
    async ({ contractorId }) => {
      try {
        await client.deleteContractor(contractorId);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, message: 'Contractor deleted' }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_contractor_payments',
    'List contractor payments for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().optional().describe('End date (YYYY-MM-DD)'),
      contractorUuid: z.string().optional().describe('Filter by contractor UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, startDate, endDate, contractorUuid, format }) => {
      try {
        const result = await client.listContractorPayments(companyId, { startDate, endDate, contractorUuid });
        return formatResponse(result, format, 'contractorPayments');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_contractor_payment',
    'Create a contractor payment.',
    {
      companyId: z.string().describe('Company UUID'),
      contractorUuid: z.string().describe('Contractor UUID'),
      date: z.string().describe('Payment date (YYYY-MM-DD)'),
      wage: z.string().optional().describe('Wage amount'),
      hours: z.string().optional().describe('Hours worked'),
      bonus: z.string().optional().describe('Bonus amount'),
      reimbursement: z.string().optional().describe('Reimbursement amount'),
      paymentMethod: z.enum(['Direct Deposit', 'Check', 'Historical Payment']).optional(),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createContractorPayment(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, payment: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_contractor_bank_accounts',
    'List bank accounts for a contractor.',
    {
      contractorId: z.string().describe('Contractor UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ contractorId, format }) => {
      try {
        const result = await client.listContractorBankAccounts(contractorId);
        return formatResponse(result, format, 'bankAccounts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_contractor_forms',
    'List forms for a contractor.',
    {
      contractorId: z.string().describe('Contractor UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ contractorId, format }) => {
      try {
        const result = await client.listContractorForms(contractorId);
        return formatResponse(result, format, 'forms');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}

// =============================================================================
// Payroll Tools
// =============================================================================

function registerPayrollTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_list_payrolls',
    'List payrolls for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().optional().describe('End date (YYYY-MM-DD)'),
      processed: z.boolean().optional().describe('Filter by processed status'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, startDate, endDate, processed, format }) => {
      try {
        const result = await client.listPayrolls(companyId, { startDate, endDate, processed });
        return formatResponse(result, format, 'payrolls');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_payroll',
    'Get details of a specific payroll.',
    {
      companyId: z.string().describe('Company UUID'),
      payrollId: z.string().describe('Payroll UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, payrollId, format }) => {
      try {
        const result = await client.getPayroll(companyId, payrollId);
        return formatResponse(result, format, 'payroll');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_calculate_payroll',
    'Calculate a payroll (required before submitting).',
    {
      companyId: z.string().describe('Company UUID'),
      payrollId: z.string().describe('Payroll UUID'),
    },
    async ({ companyId, payrollId }) => {
      try {
        const result = await client.calculatePayroll(companyId, payrollId);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, payroll: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_submit_payroll',
    'Submit a payroll for processing.',
    {
      companyId: z.string().describe('Company UUID'),
      payrollId: z.string().describe('Payroll UUID'),
    },
    async ({ companyId, payrollId }) => {
      try {
        const result = await client.submitPayroll(companyId, payrollId);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, payroll: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_off_cycle_payroll',
    'Create an off-cycle payroll.',
    {
      companyId: z.string().describe('Company UUID'),
      offCycleReason: z.enum(['Bonus', 'Correction', 'Dismissed Employee', 'Transition']).describe('Reason'),
      checkDate: z.string().describe('Check date (YYYY-MM-DD)'),
      startDate: z.string().optional().describe('Pay period start date'),
      endDate: z.string().optional().describe('Pay period end date'),
      employeeUuids: z.array(z.string()).optional().describe('Specific employee UUIDs'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createOffCyclePayroll(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, payroll: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_pay_schedules',
    'List pay schedules for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listPaySchedules(companyId);
        return formatResponse(result, format, 'paySchedules');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_pay_schedule',
    'Create a pay schedule.',
    {
      companyId: z.string().describe('Company UUID'),
      frequency: z.enum(['Every week', 'Every other week', 'Twice per month', 'Monthly']).describe('Pay frequency'),
      anchorPayDate: z.string().describe('Anchor pay date (YYYY-MM-DD)'),
      anchorEndOfPayPeriod: z.string().describe('Anchor end of pay period (YYYY-MM-DD)'),
      name: z.string().optional().describe('Schedule name'),
      autoPilot: z.boolean().optional().describe('Enable autopilot'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createPaySchedule(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, paySchedule: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_pay_periods',
    'List pay periods for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().optional().describe('End date (YYYY-MM-DD)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, startDate, endDate, format }) => {
      try {
        const result = await client.getPayPeriods(companyId, { startDate, endDate });
        return formatResponse(result, format, 'payPeriods');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_earning_types',
    'List earning types for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listEarningTypes(companyId);
        return formatResponse(result, format, 'earningTypes');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_earning_type',
    'Create a custom earning type.',
    {
      companyId: z.string().describe('Company UUID'),
      name: z.string().describe('Earning type name'),
      description: z.string().optional().describe('Description'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createEarningType(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, earningType: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_company_forms',
    'List forms for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listCompanyForms(companyId);
        return formatResponse(result, format, 'forms');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_notifications',
    'List notifications for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listNotifications(companyId);
        return formatResponse(result, format, 'notifications');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}

// =============================================================================
// Benefit Tools
// =============================================================================

function registerBenefitTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_list_supported_benefits',
    'List all supported benefit types.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.listSupportedBenefits();
        return formatResponse(result, format, 'supportedBenefits');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_company_benefits',
    'List benefits for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listCompanyBenefits(companyId);
        return formatResponse(result, format, 'companyBenefits');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_company_benefit',
    'Create a company benefit.',
    {
      companyId: z.string().describe('Company UUID'),
      benefitType: z.string().describe('Benefit type (from supported benefits)'),
      description: z.string().optional().describe('Description'),
      active: z.boolean().optional().describe('Is active'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createCompanyBenefit(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, benefit: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_employee_benefits',
    'List benefits for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ employeeId, format }) => {
      try {
        const result = await client.listEmployeeBenefits(employeeId);
        return formatResponse(result, format, 'employeeBenefits');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_employee_benefit',
    'Create a benefit enrollment for an employee.',
    {
      employeeId: z.string().describe('Employee UUID'),
      companyBenefitUuid: z.string().describe('Company benefit UUID'),
      employeeDeduction: z.string().optional().describe('Employee deduction amount'),
      companyContribution: z.string().optional().describe('Company contribution amount'),
      deductAsPercentage: z.boolean().optional().describe('Deduct as percentage'),
      contributeAsPercentage: z.boolean().optional().describe('Contribute as percentage'),
      active: z.boolean().optional().describe('Is active'),
    },
    async ({ employeeId, ...data }) => {
      try {
        const result = await client.createEmployeeBenefit(employeeId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, benefit: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}

// =============================================================================
// Time Off Tools
// =============================================================================

function registerTimeOffTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_list_time_off_policies',
    'List time off policies for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.listTimeOffPolicies(companyId);
        return formatResponse(result, format, 'timeOffPolicies');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_time_off_policy',
    'Get details of a time off policy.',
    {
      policyId: z.string().describe('Time off policy UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ policyId, format }) => {
      try {
        const result = await client.getTimeOffPolicy(policyId);
        return formatResponse(result, format, 'timeOffPolicy');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_time_off_policy',
    'Create a time off policy.',
    {
      companyId: z.string().describe('Company UUID'),
      name: z.string().describe('Policy name'),
      policyType: z.enum(['vacation', 'sick', 'holiday', 'bereavement', 'jury_duty', 'other']).describe('Policy type'),
      accrualMethod: z.enum(['unlimited', 'per_pay_period', 'per_calendar_year']).describe('Accrual method'),
      accrualRate: z.string().optional().describe('Accrual rate'),
      paidOutOnTermination: z.boolean().optional().describe('Paid out on termination'),
    },
    async ({ companyId, ...data }) => {
      try {
        const result = await client.createTimeOffPolicy(companyId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, policy: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_add_employees_to_time_off_policy',
    'Add employees to a time off policy.',
    {
      policyId: z.string().describe('Time off policy UUID'),
      employeeUuids: z.array(z.string()).describe('Employee UUIDs to add'),
    },
    async ({ policyId, employeeUuids }) => {
      try {
        await client.addEmployeesToTimeOffPolicy(policyId, employeeUuids);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, message: 'Employees added to policy' }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_get_holiday_pay_policy',
    'Get the holiday pay policy for a company.',
    {
      companyId: z.string().describe('Company UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ companyId, format }) => {
      try {
        const result = await client.getHolidayPayPolicy(companyId);
        if (!result) {
          return {
            content: [{ type: 'text', text: JSON.stringify({ message: 'No holiday pay policy found' }, null, 2) }],
          };
        }
        return formatResponse(result, format, 'holidayPayPolicy');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}

// =============================================================================
// Webhook Tools
// =============================================================================

function registerWebhookTools(server: McpServer, client: GustoClient): void {
  server.tool(
    'gusto_list_webhook_subscriptions',
    'List all webhook subscriptions.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.listWebhookSubscriptions();
        return formatResponse(result, format, 'webhookSubscriptions');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_create_webhook_subscription',
    'Create a webhook subscription.',
    {
      url: z.string().url().describe('Webhook URL'),
      subscriptionTypes: z.array(z.string()).describe('Event types to subscribe to'),
    },
    async ({ url, subscriptionTypes }) => {
      try {
        const result = await client.createWebhookSubscription({ url, subscriptionTypes });
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, subscription: result }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_delete_webhook_subscription',
    'Delete a webhook subscription.',
    {
      subscriptionId: z.string().describe('Subscription UUID'),
    },
    async ({ subscriptionId }) => {
      try {
        await client.deleteWebhookSubscription(subscriptionId);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, message: 'Subscription deleted' }, null, 2) }],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'gusto_list_events',
    'List events from the Gusto event stream.',
    {
      startingAfterUuid: z.string().optional().describe('Start after this event UUID'),
      resourceUuid: z.string().optional().describe('Filter by resource UUID'),
      resourceType: z.string().optional().describe('Filter by resource type'),
      limit: z.number().int().min(1).max(100).optional().describe('Number of events to return'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format, ...params }) => {
      try {
        const result = await client.listEvents(params);
        return formatResponse(result, format, 'events');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
