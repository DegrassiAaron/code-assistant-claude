// Core analyzers
export { ProjectAnalyzer } from './analyzers/project-analyzer';
export { DocumentationAnalyzer } from './analyzers/documentation-analyzer';
export { GitWorkflowAnalyzer } from './analyzers/git-workflow-analyzer';
export { TechStackDetector } from './analyzers/tech-stack-detector';

// Core configurators
export { ConfigurationGenerator } from './configurators/config-generator';

// Skills system
export * from './skills';

// Execution Engine - Main Orchestrator
export { ExecutionOrchestrator } from './execution-engine/orchestrator';

// Execution Engine - MCP Code API
export { MCPOrchestrator } from './execution-engine/mcp-code-api/orchestrator';
export { SchemaParser } from './execution-engine/mcp-code-api/schema-parser';
export { CodeAPIGenerator } from './execution-engine/mcp-code-api/generator';
export { MCPCodeRuntime } from './execution-engine/mcp-code-api/runtime';
export {
  RealMCPClient,
  MCPClientPool,
} from './execution-engine/mcp-code-api/mcp-client';

// Execution Engine - Discovery
export { ToolIndexer } from './execution-engine/discovery/tool-indexer';
export { RelevanceScorer } from './execution-engine/discovery/relevance-scorer';

// Types
export type { ProjectContext } from './analyzers/project-analyzer';
export type { DocumentationContext } from './analyzers/documentation-analyzer';
export type {
  GitConventions,
  GitWorkflow,
} from './analyzers/git-workflow-analyzer';
export type { TechStack } from './analyzers/tech-stack-detector';
export type {
  MCPToolSchema,
  MCPParameter,
  MCPReturnType,
  MCPExample,
  CodeWrapper,
  ExecutionResult,
  DiscoveredTool,
} from './execution-engine/types';
