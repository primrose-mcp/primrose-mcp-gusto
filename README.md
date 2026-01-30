# Gusto MCP Server

[![Primrose MCP](https://img.shields.io/badge/Primrose-MCP-blue)](https://primrose.dev/mcp/gusto)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for integrating with the Gusto HR and Payroll platform. This server enables AI assistants to manage companies, employees, contractors, payroll, benefits, time off, and more through Gusto's API.

## Features

- **Connection Management** - Test API connections and verify credentials
- **Company Operations** - Manage company details, locations, departments, admins, signatories, and bank accounts
- **Employee Management** - Full employee lifecycle including onboarding, jobs, compensations, addresses, taxes, terminations, and garnishments
- **Contractor Management** - Create and manage contractors, payments, and 1099 forms
- **Payroll Processing** - List, calculate, submit payrolls; manage pay schedules, periods, and earning types
- **Benefits Administration** - Configure company and employee benefits enrollment
- **Time Off Management** - Create and manage time off policies, holiday pay
- **Webhooks** - Subscribe to and manage webhook events

## Quick Start

The easiest way to get started is using the [Primrose SDK](https://github.com/primrose-ai/primrose-mcp):

```bash
npm install primrose-mcp
```

```typescript
import { PrimroseClient } from 'primrose-mcp';

const client = new PrimroseClient({
  service: 'gusto',
  headers: {
    'X-Gusto-Access-Token': 'your-access-token'
  }
});
```

## Manual Installation

```bash
# Clone and install
git clone https://github.com/primrose-ai/primrose-mcp-gusto.git
cd primrose-mcp-gusto
npm install

# Build
npm run build

# Run locally
npm run dev
```

## Configuration

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Gusto-Access-Token` | OAuth 2.0 access token |

### Optional Headers

| Header | Description |
|--------|-------------|
| `X-Gusto-API-Version` | API version (default: 2024-04-01) |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CHARACTER_LIMIT` | 50000 | Maximum response character limit |
| `DEFAULT_PAGE_SIZE` | 20 | Default pagination size |
| `MAX_PAGE_SIZE` | 100 | Maximum pagination size |

## Available Tools

### Connection Tools
- `gusto_test_connection` - Test the connection to the Gusto API
- `gusto_get_token_info` - Get information about the current OAuth access token

### Company Tools
- `gusto_get_company` - Get details of a company by ID
- `gusto_list_locations` - List all locations for a company
- `gusto_create_location` - Create a new location
- `gusto_list_departments` - List all departments
- `gusto_create_department` - Create a new department
- `gusto_list_admins` - List all admins
- `gusto_list_signatories` - List all signatories
- `gusto_list_company_bank_accounts` - List company bank accounts

### Employee Tools
- `gusto_list_employees` - List employees with pagination
- `gusto_get_employee` - Get details of a single employee
- `gusto_create_employee` - Create a new employee
- `gusto_update_employee` - Update an existing employee
- `gusto_get_employee_onboarding_status` - Get onboarding status
- `gusto_list_jobs` - List jobs for an employee
- `gusto_create_job` - Create a job for an employee
- `gusto_list_compensations` - List compensations for a job
- `gusto_create_compensation` - Create a compensation
- `gusto_list_home_addresses` - List home addresses
- `gusto_create_home_address` - Create a home address
- `gusto_get_federal_taxes` - Get federal tax information
- `gusto_get_state_taxes` - Get state tax information
- `gusto_list_employee_bank_accounts` - List employee bank accounts
- `gusto_get_employee_payment_method` - Get payment method
- `gusto_list_terminations` - List terminations
- `gusto_create_termination` - Create a termination
- `gusto_list_garnishments` - List garnishments
- `gusto_create_garnishment` - Create a garnishment
- `gusto_list_employee_forms` - List employee forms
- `gusto_list_recurring_reimbursements` - List recurring reimbursements
- `gusto_create_recurring_reimbursement` - Create a recurring reimbursement

### Contractor Tools
- `gusto_list_contractors` - List contractors for a company
- `gusto_get_contractor` - Get details of a contractor
- `gusto_create_contractor` - Create a new contractor
- `gusto_update_contractor` - Update an existing contractor
- `gusto_delete_contractor` - Delete a contractor
- `gusto_list_contractor_payments` - List contractor payments
- `gusto_create_contractor_payment` - Create a contractor payment
- `gusto_list_contractor_bank_accounts` - List contractor bank accounts
- `gusto_list_contractor_forms` - List contractor forms

### Payroll Tools
- `gusto_list_payrolls` - List payrolls for a company
- `gusto_get_payroll` - Get details of a specific payroll
- `gusto_calculate_payroll` - Calculate a payroll
- `gusto_submit_payroll` - Submit a payroll for processing
- `gusto_create_off_cycle_payroll` - Create an off-cycle payroll
- `gusto_list_pay_schedules` - List pay schedules
- `gusto_create_pay_schedule` - Create a pay schedule
- `gusto_list_pay_periods` - List pay periods
- `gusto_list_earning_types` - List earning types
- `gusto_create_earning_type` - Create a custom earning type
- `gusto_list_company_forms` - List company forms
- `gusto_list_notifications` - List notifications

### Benefit Tools
- `gusto_list_supported_benefits` - List all supported benefit types
- `gusto_list_company_benefits` - List benefits for a company
- `gusto_create_company_benefit` - Create a company benefit
- `gusto_list_employee_benefits` - List benefits for an employee
- `gusto_create_employee_benefit` - Create a benefit enrollment

### Time Off Tools
- `gusto_list_time_off_policies` - List time off policies
- `gusto_get_time_off_policy` - Get details of a time off policy
- `gusto_create_time_off_policy` - Create a time off policy
- `gusto_add_employees_to_time_off_policy` - Add employees to a policy
- `gusto_get_holiday_pay_policy` - Get the holiday pay policy

### Webhook Tools
- `gusto_list_webhook_subscriptions` - List all webhook subscriptions
- `gusto_create_webhook_subscription` - Create a webhook subscription
- `gusto_delete_webhook_subscription` - Delete a webhook subscription
- `gusto_list_events` - List events from the event stream

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run type checking
npm run typecheck
```

## Related Resources

- [Primrose SDK Documentation](https://primrose.dev/docs)
- [Gusto API Documentation](https://docs.gusto.com/embedded-payroll/reference/)
- [Gusto Developer Portal](https://dev.gusto.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## License

MIT
