/**
 * Gusto MCP Server - Main Entry Point
 *
 * This file sets up the MCP server using Cloudflare's Agents SDK.
 * It supports both stateless (McpServer) and stateful (McpAgent) modes.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant credentials (OAuth tokens) are parsed from request headers,
 * allowing a single server deployment to serve multiple customers.
 *
 * Required Headers:
 * - X-Gusto-Access-Token: OAuth 2.0 access token for Gusto API
 *
 * Optional Headers:
 * - X-Gusto-API-Version: Override the default API version
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { createGustoClient } from './client.js';
import { registerGustoTools } from './tools/index.js';
import {
  type Env,
  type TenantCredentials,
  parseTenantCredentials,
  validateCredentials,
} from './types/env.js';

// =============================================================================
// MCP Server Configuration
// =============================================================================

const SERVER_NAME = 'gusto-mcp-server';
const SERVER_VERSION = '1.0.0';

// =============================================================================
// MCP Agent (Stateful - uses Durable Objects)
// =============================================================================

/**
 * McpAgent provides stateful MCP sessions backed by Durable Objects.
 *
 * NOTE: For multi-tenant deployments, use the stateless mode instead.
 * The stateful McpAgent is better suited for single-tenant deployments where
 * credentials can be stored as wrangler secrets.
 */
export class GustoMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    throw new Error(
      'Stateful mode (McpAgent) is not supported for multi-tenant deployments. ' +
        'Use the stateless /mcp endpoint with X-Gusto-Access-Token header instead.'
    );
  }
}

// =============================================================================
// Stateless MCP Server (Recommended - no Durable Objects needed)
// =============================================================================

/**
 * Creates a stateless MCP server instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides credentials via headers, allowing
 * a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
function createStatelessServer(credentials: TenantCredentials): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Create client with tenant-specific credentials
  const client = createGustoClient(credentials);

  // Register all Gusto tools
  registerGustoTools(server, client);

  return server;
}

// =============================================================================
// Worker Export
// =============================================================================

export default {
  /**
   * Main fetch handler for the Worker
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', server: SERVER_NAME }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ==========================================================================
    // Stateless MCP with Streamable HTTP (Recommended for multi-tenant)
    // ==========================================================================
    if (url.pathname === '/mcp' && request.method === 'POST') {
      // Parse tenant credentials from request headers
      const credentials = parseTenantCredentials(request);

      // Validate credentials are present
      try {
        validateCredentials(credentials);
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Invalid credentials',
            required_headers: ['X-Gusto-Access-Token'],
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Create server with tenant-specific credentials
      const server = createStatelessServer(credentials);

      // Import and use createMcpHandler for streamable HTTP
      const { createMcpHandler } = await import('agents/mcp');
      const handler = createMcpHandler(server);
      return handler(request, env, ctx);
    }

    // SSE endpoint for legacy clients
    if (url.pathname === '/sse') {
      return new Response('SSE endpoint requires Durable Objects. Enable in wrangler.jsonc.', {
        status: 501,
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        description: 'Multi-tenant Gusto Embedded Payroll MCP Server',
        endpoints: {
          mcp: '/mcp (POST) - Streamable HTTP MCP endpoint',
          health: '/health - Health check',
        },
        authentication: {
          description: 'Pass tenant credentials via request headers',
          required_headers: {
            'X-Gusto-Access-Token': 'OAuth 2.0 access token for Gusto API',
          },
          optional_headers: {
            'X-Gusto-API-Version': 'Override the default API version',
          },
        },
        tools: [
          'gusto_test_connection',
          'gusto_get_token_info',
          'gusto_get_company',
          'gusto_list_locations',
          'gusto_create_location',
          'gusto_list_departments',
          'gusto_create_department',
          'gusto_list_admins',
          'gusto_list_signatories',
          'gusto_list_company_bank_accounts',
          'gusto_list_employees',
          'gusto_get_employee',
          'gusto_create_employee',
          'gusto_update_employee',
          'gusto_get_employee_onboarding_status',
          'gusto_list_jobs',
          'gusto_create_job',
          'gusto_list_compensations',
          'gusto_create_compensation',
          'gusto_list_home_addresses',
          'gusto_create_home_address',
          'gusto_get_federal_taxes',
          'gusto_get_state_taxes',
          'gusto_list_employee_bank_accounts',
          'gusto_get_employee_payment_method',
          'gusto_list_terminations',
          'gusto_create_termination',
          'gusto_list_garnishments',
          'gusto_create_garnishment',
          'gusto_list_employee_forms',
          'gusto_list_recurring_reimbursements',
          'gusto_create_recurring_reimbursement',
          'gusto_list_contractors',
          'gusto_get_contractor',
          'gusto_create_contractor',
          'gusto_update_contractor',
          'gusto_delete_contractor',
          'gusto_list_contractor_payments',
          'gusto_create_contractor_payment',
          'gusto_list_contractor_bank_accounts',
          'gusto_list_contractor_forms',
          'gusto_list_payrolls',
          'gusto_get_payroll',
          'gusto_calculate_payroll',
          'gusto_submit_payroll',
          'gusto_create_off_cycle_payroll',
          'gusto_list_pay_schedules',
          'gusto_create_pay_schedule',
          'gusto_list_pay_periods',
          'gusto_list_earning_types',
          'gusto_create_earning_type',
          'gusto_list_company_forms',
          'gusto_list_notifications',
          'gusto_list_supported_benefits',
          'gusto_list_company_benefits',
          'gusto_create_company_benefit',
          'gusto_list_employee_benefits',
          'gusto_create_employee_benefit',
          'gusto_list_time_off_policies',
          'gusto_get_time_off_policy',
          'gusto_create_time_off_policy',
          'gusto_add_employees_to_time_off_policy',
          'gusto_get_holiday_pay_policy',
          'gusto_list_webhook_subscriptions',
          'gusto_create_webhook_subscription',
          'gusto_delete_webhook_subscription',
          'gusto_list_events',
        ],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
