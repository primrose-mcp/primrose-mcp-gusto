/**
 * Response Formatting Utilities
 *
 * Helpers for formatting tool responses in JSON or Markdown.
 */

import type {
  Company,
  Contractor,
  Employee,
  PaginatedResponse,
  Payroll,
  PaySchedule,
  ResponseFormat,
} from '../types/entities.js';
import { CrmApiError, formatErrorForLogging } from './errors.js';

/**
 * MCP tool response type
 * Note: Index signature required for MCP SDK 1.25+ compatibility
 */
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * Format a successful response
 */
export function formatResponse(
  data: unknown,
  format: ResponseFormat,
  entityType: string
): ToolResponse {
  if (format === 'markdown') {
    return {
      content: [{ type: 'text', text: formatAsMarkdown(data, entityType) }],
    };
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Format an error response
 */
export function formatError(error: unknown): ToolResponse {
  const errorInfo = formatErrorForLogging(error);

  let message: string;
  if (error instanceof CrmApiError) {
    message = `Error: ${error.message}`;
    if (error.retryable) {
      message += ' (retryable)';
    }
  } else if (error instanceof Error) {
    message = `Error: ${error.message}`;
  } else {
    message = `Error: ${String(error)}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: message, details: errorInfo }, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Format data as Markdown
 */
function formatAsMarkdown(data: unknown, entityType: string): string {
  if (isPaginatedResponse(data)) {
    return formatPaginatedAsMarkdown(data, entityType);
  }

  if (Array.isArray(data)) {
    return formatArrayAsMarkdown(data, entityType);
  }

  if (typeof data === 'object' && data !== null) {
    return formatObjectAsMarkdown(data as Record<string, unknown>, entityType);
  }

  return String(data);
}

/**
 * Type guard for paginated response
 */
function isPaginatedResponse(data: unknown): data is PaginatedResponse<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    Array.isArray((data as PaginatedResponse<unknown>).items)
  );
}

/**
 * Format paginated response as Markdown
 */
function formatPaginatedAsMarkdown(data: PaginatedResponse<unknown>, entityType: string): string {
  const lines: string[] = [];

  lines.push(`## ${capitalize(entityType)}`);
  lines.push('');

  if (data.total !== undefined) {
    lines.push(`**Total:** ${data.total} | **Showing:** ${data.count}`);
  } else {
    lines.push(`**Showing:** ${data.count}`);
  }

  if (data.hasMore) {
    lines.push(`**More available:** Yes (page: ${data.nextPage})`);
  }
  lines.push('');

  if (data.items.length === 0) {
    lines.push('_No items found._');
    return lines.join('\n');
  }

  // Format items based on entity type
  switch (entityType) {
    case 'employees':
      lines.push(formatEmployeesTable(data.items as Employee[]));
      break;
    case 'contractors':
      lines.push(formatContractorsTable(data.items as Contractor[]));
      break;
    case 'payrolls':
      lines.push(formatPayrollsTable(data.items as Payroll[]));
      break;
    default:
      lines.push(formatGenericTable(data.items));
  }

  return lines.join('\n');
}

/**
 * Format employees as Markdown table
 */
function formatEmployeesTable(employees: Employee[]): string {
  const lines: string[] = [];
  lines.push('| UUID | Name | Email | Status | Onboarded |');
  lines.push('|---|---|---|---|---|');

  for (const emp of employees) {
    const name = `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || '-';
    const status = emp.terminated ? 'Terminated' : (emp.currentEmploymentStatus || 'Active');
    lines.push(
      `| ${emp.uuid} | ${name} | ${emp.email || '-'} | ${status} | ${emp.onboarded ? 'Yes' : 'No'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format contractors as Markdown table
 */
function formatContractorsTable(contractors: Contractor[]): string {
  const lines: string[] = [];
  lines.push('| UUID | Name/Business | Type | Email | Active |');
  lines.push('|---|---|---|---|---|');

  for (const c of contractors) {
    const name = c.type === 'Business'
      ? (c.businessName || '-')
      : `${c.firstName || ''} ${c.lastName || ''}`.trim() || '-';
    lines.push(
      `| ${c.uuid} | ${name} | ${c.type || '-'} | ${c.email || '-'} | ${c.isActive ? 'Yes' : 'No'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format payrolls as Markdown table
 */
function formatPayrollsTable(payrolls: Payroll[]): string {
  const lines: string[] = [];
  lines.push('| UUID | Pay Period | Check Date | Processed | Gross Pay |');
  lines.push('|---|---|---|---|---|');

  for (const p of payrolls) {
    const payPeriod = p.payPeriodStartDate && p.payPeriodEndDate
      ? `${p.payPeriodStartDate} - ${p.payPeriodEndDate}`
      : '-';
    const grossPay = p.totals?.grossPay ? `$${p.totals.grossPay}` : '-';
    lines.push(
      `| ${p.uuid || p.payrollUuid || '-'} | ${payPeriod} | ${p.checkDate || '-'} | ${p.processed ? 'Yes' : 'No'} | ${grossPay} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format a generic array as Markdown table
 */
function formatGenericTable(items: unknown[]): string {
  if (items.length === 0) return '_No items_';

  const first = items[0] as Record<string, unknown>;
  const keys = Object.keys(first).slice(0, 5); // Limit columns

  const lines: string[] = [];
  lines.push(`| ${keys.join(' | ')} |`);
  lines.push(`|${keys.map(() => '---').join('|')}|`);

  for (const item of items) {
    const record = item as Record<string, unknown>;
    const values = keys.map((k) => String(record[k] ?? '-'));
    lines.push(`| ${values.join(' | ')} |`);
  }

  return lines.join('\n');
}

/**
 * Format an array as Markdown
 */
function formatArrayAsMarkdown(data: unknown[], entityType: string): string {
  if (entityType === 'paySchedules') {
    return formatPaySchedulesAsMarkdown(data as PaySchedule[]);
  }
  if (entityType === 'companies') {
    return formatCompaniesAsMarkdown(data as Company[]);
  }
  return formatGenericTable(data);
}

/**
 * Format pay schedules as Markdown
 */
function formatPaySchedulesAsMarkdown(schedules: PaySchedule[]): string {
  const lines: string[] = [];

  for (const schedule of schedules) {
    lines.push(`### ${schedule.name || 'Pay Schedule'}`);
    lines.push(`**UUID:** \`${schedule.uuid}\``);
    lines.push(`**Frequency:** ${schedule.frequency || '-'}`);
    lines.push(`**AutoPilot:** ${schedule.autoPilot ? 'Yes' : 'No'}`);
    if (schedule.anchorPayDate) lines.push(`**Anchor Pay Date:** ${schedule.anchorPayDate}`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format companies as Markdown
 */
function formatCompaniesAsMarkdown(companies: Company[]): string {
  const lines: string[] = [];
  lines.push('| UUID | Name | EIN | Status |');
  lines.push('|---|---|---|---|');

  for (const c of companies) {
    lines.push(
      `| ${c.uuid} | ${c.name} | ${c.ein || '-'} | ${c.companyStatus || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format a single object as Markdown
 */
function formatObjectAsMarkdown(data: Record<string, unknown>, entityType: string): string {
  const lines: string[] = [];
  lines.push(`## ${capitalize(entityType.replace(/s$/, ''))}`);
  lines.push('');

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'object') {
      lines.push(`**${formatKey(key)}:**`);
      lines.push('```json');
      lines.push(JSON.stringify(value, null, 2));
      lines.push('```');
    } else {
      lines.push(`**${formatKey(key)}:** ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a key for display (camelCase to Title Case)
 */
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
