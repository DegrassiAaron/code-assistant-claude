/**
 * Phase 4: MCP Code Execution - Core Type Definitions
 *
 * These types define the data structures for the revolutionary
 * code execution engine that achieves 98.7% token reduction.
 */

/**
 * MCP tool schema parsed from JSON
 * Supports both internal format (parameters/returns) and MCP protocol format (inputSchema/outputSchema)
 */
export interface MCPToolSchema {
  name: string;
  description: string;
  parameters?: MCPParameter[];
  returns?: MCPReturnType;
  examples?: MCPExample[];
  category?: string;
  // MCP protocol format (JSON Schema)
  inputSchema?: {
    type: string;
    properties?: Record<string, unknown>;
    items?: unknown;
    required?: string[];
  };
  outputSchema?: {
    type: string;
    properties?: Record<string, unknown>;
  };
}

export interface MCPParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
}

export interface MCPReturnType {
  type: string;
  description: string;
}

export interface MCPExample {
  input: Record<string, unknown>;
  output: unknown;
  description: string;
}

/**
 * Generated code wrapper
 */
export interface CodeWrapper {
  language: 'typescript' | 'python';
  code: string;
  dependencies: string[];
  estimatedTokens: number;
}

/**
 * Sandbox configuration
 */
export interface SandboxConfig {
  type: 'docker' | 'vm' | 'process';
  image?: string; // Docker image
  vmId?: string; // VM identifier
  resourceLimits: {
    cpu: number | string; // CPU cores
    memory: string; // e.g., "512M"
    disk?: string; // e.g., "1G"
    timeout: number; // milliseconds
  };
  networkPolicy?: {
    mode: 'none' | 'whitelist' | 'blacklist';
    allowed?: string[];
    blocked?: string[];
  };
  /**
   * Additional safe environment variables to pass to sandbox
   * These variables will be validated to ensure they don't contain secrets
   * Variables matching dangerous patterns (KEY, SECRET, TOKEN, PASSWORD, etc.) will be rejected
   */
  allowedEnvVars?: string[];
}

/**
 * Execution result
 */
export interface ExecutionResult {
  success: boolean;
  output?: unknown;
  summary: string; // Always <500 tokens
  error?: string;
  metrics: {
    executionTime: number;
    memoryUsed: string;
    tokensInSummary: number;
  };
  piiTokenized: boolean;
}

/**
 * Security validation result
 */
export interface SecurityValidation {
  isSecure: boolean;
  riskScore: number; // 0-100
  issues: SecurityIssue[];
  requiresApproval: boolean;
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  line?: number;
  suggestion?: string;
}

/**
 * PII token mapping
 */
export interface PIIToken {
  token: string; // e.g., "[EMAIL_1]"
  type: 'email' | 'phone' | 'name' | 'ssn' | 'credit_card';
  hashedValue: string; // For lookup
}

/**
 * Tool discovery result
 */
export interface DiscoveredTool {
  name: string;
  description: string;
  relevanceScore: number; // 0-1
  schema: MCPToolSchema;
}

/**
 * Workspace state for execution sessions
 */
export interface WorkspaceState {
  id: string;
  createdAt: Date;
  lastAccessedAt: Date;
  code: string;
  language: 'typescript' | 'python';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: ExecutionResult;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  timestamp: Date;
  type: 'execution' | 'security' | 'discovery' | 'error';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Compliance report
 */
export interface ComplianceReport {
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalExecutions: number;
    securityIncidents: number;
    piiDataProcessed: number;
    sandboxEscapes: number;
  };
  compliance: {
    gdpr: boolean;
    soc2: boolean;
    hipaa: boolean;
  };
}

/**
 * Anomaly detection result
 */
export interface AnomalyDetection {
  detected: boolean;
  anomalies: Anomaly[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface Anomaly {
  type:
    | 'resource_spike'
    | 'suspicious_pattern'
    | 'repeated_failure'
    | 'unusual_timing';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

/**
 * Cache entry for execution results
 */
export interface CacheEntry {
  key: string;
  value: ExecutionResult;
  createdAt: Date;
  expiresAt: Date;
  hits: number;
}

/**
 * Tool index entry
 */
export interface ToolIndexEntry {
  name: string;
  description: string;
  keywords: string[];
  category: string;
  filePath: string;
  schema: MCPToolSchema;
}

/**
 * Semantic search result
 */
export interface SemanticSearchResult {
  tool: ToolIndexEntry;
  score: number;
  matches: {
    field: string;
    value: string;
    relevance: number;
  }[];
}
