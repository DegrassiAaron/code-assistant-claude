/**
 * Technical Symbol Definitions
 * Performance, security, architecture, and DevOps symbols
 */

export interface TechnicalSymbol {
  symbol: string;
  keywords: string[];
  category: 'performance' | 'security' | 'architecture' | 'devops' | 'quality';
  description: string;
}

/**
 * Technical symbols for engineering and DevOps contexts
 */
export const TECHNICAL_SYMBOLS: TechnicalSymbol[] = [
  // Performance
  {
    symbol: '⚡',
    keywords: ['performance', 'fast', 'optimized', 'speed'],
    category: 'performance',
    description: 'Performance or speed',
  },
  {
    symbol: '🐌',
    keywords: ['slow', 'bottleneck', 'latency'],
    category: 'performance',
    description: 'Slow or bottleneck',
  },
  {
    symbol: '💾',
    keywords: ['memory', 'ram', 'storage'],
    category: 'performance',
    description: 'Memory or storage',
  },
  {
    symbol: '🔥',
    keywords: ['hot_path', 'critical_path', 'high_load'],
    category: 'performance',
    description: 'Hot path or critical',
  },
  {
    symbol: '❄️',
    keywords: ['cold_start', 'initialization', 'boot'],
    category: 'performance',
    description: 'Cold start or initialization',
  },
  {
    symbol: '⏲️',
    keywords: ['timeout', 'duration', 'latency'],
    category: 'performance',
    description: 'Timeout or duration',
  },
  {
    symbol: '📊',
    keywords: ['benchmark', 'profiling', 'metrics'],
    category: 'performance',
    description: 'Benchmark or profiling',
  },

  // Security
  {
    symbol: '🛡️',
    keywords: ['security', 'protection', 'defense'],
    category: 'security',
    description: 'Security or protection',
  },
  {
    symbol: '🔒',
    keywords: ['encrypted', 'secure', 'locked'],
    category: 'security',
    description: 'Encrypted or secure',
  },
  {
    symbol: '🔓',
    keywords: ['unencrypted', 'insecure', 'unlocked'],
    category: 'security',
    description: 'Unencrypted or insecure',
  },
  {
    symbol: '🔑',
    keywords: ['authentication', 'credential', 'key'],
    category: 'security',
    description: 'Authentication or key',
  },
  {
    symbol: '👤',
    keywords: ['authorization', 'permission', 'access_control'],
    category: 'security',
    description: 'Authorization or access',
  },
  {
    symbol: '🚨',
    keywords: ['vulnerability', 'threat', 'attack'],
    category: 'security',
    description: 'Vulnerability or threat',
  },
  {
    symbol: '🔍',
    keywords: ['audit', 'inspection', 'analysis'],
    category: 'security',
    description: 'Audit or inspection',
  },
  {
    symbol: '🎭',
    keywords: ['masking', 'anonymization', 'privacy'],
    category: 'security',
    description: 'Masking or privacy',
  },

  // Architecture
  {
    symbol: '🏗️',
    keywords: ['architecture', 'design', 'structure'],
    category: 'architecture',
    description: 'Architecture or design',
  },
  {
    symbol: '📦',
    keywords: ['module', 'package', 'component'],
    category: 'architecture',
    description: 'Module or component',
  },
  {
    symbol: '🔌',
    keywords: ['plugin', 'extension', 'integration'],
    category: 'architecture',
    description: 'Plugin or integration',
  },
  {
    symbol: '🌐',
    keywords: ['api', 'interface', 'endpoint'],
    category: 'architecture',
    description: 'API or interface',
  },
  {
    symbol: '🗄️',
    keywords: ['database', 'storage', 'persistence'],
    category: 'architecture',
    description: 'Database or storage',
  },
  {
    symbol: '🔀',
    keywords: ['branching', 'conditional', 'routing'],
    category: 'architecture',
    description: 'Branching or routing',
  },
  {
    symbol: '📡',
    keywords: ['communication', 'messaging', 'event'],
    category: 'architecture',
    description: 'Communication or messaging',
  },
  {
    symbol: '🎯',
    keywords: ['dependency', 'coupling', 'reference'],
    category: 'architecture',
    description: 'Dependency or coupling',
  },

  // DevOps & Infrastructure
  {
    symbol: '🚀',
    keywords: ['deployment', 'release', 'ship'],
    category: 'devops',
    description: 'Deployment or release',
  },
  {
    symbol: '🔧',
    keywords: ['configuration', 'setup', 'settings'],
    category: 'devops',
    description: 'Configuration or setup',
  },
  {
    symbol: '🐳',
    keywords: ['container', 'docker', 'containerized'],
    category: 'devops',
    description: 'Container or Docker',
  },
  {
    symbol: '☁️',
    keywords: ['cloud', 'hosted', 'remote'],
    category: 'devops',
    description: 'Cloud or hosted',
  },
  {
    symbol: '🖥️',
    keywords: ['server', 'instance', 'node'],
    category: 'devops',
    description: 'Server or instance',
  },
  {
    symbol: '📝',
    keywords: ['logging', 'logs', 'audit_trail'],
    category: 'devops',
    description: 'Logging or logs',
  },
  {
    symbol: '👁️',
    keywords: ['monitoring', 'observability', 'tracking'],
    category: 'devops',
    description: 'Monitoring or observability',
  },
  {
    symbol: '🔄',
    keywords: ['ci_cd', 'pipeline', 'automation'],
    category: 'devops',
    description: 'CI/CD or pipeline',
  },
  {
    symbol: '📈',
    keywords: ['scaling', 'autoscaling', 'growth'],
    category: 'devops',
    description: 'Scaling or growth',
  },

  // Quality & Testing
  {
    symbol: '✅',
    keywords: ['test_passed', 'validated', 'verified'],
    category: 'quality',
    description: 'Test passed or verified',
  },
  {
    symbol: '❌',
    keywords: ['test_failed', 'broken', 'failing'],
    category: 'quality',
    description: 'Test failed or broken',
  },
  {
    symbol: '🧪',
    keywords: ['testing', 'test', 'quality_assurance'],
    category: 'quality',
    description: 'Testing or QA',
  },
  {
    symbol: '🔬',
    keywords: ['debugging', 'investigation', 'troubleshooting'],
    category: 'quality',
    description: 'Debugging or investigation',
  },
  {
    symbol: '📏',
    keywords: ['linting', 'standards', 'code_quality'],
    category: 'quality',
    description: 'Linting or standards',
  },
  {
    symbol: '🎨',
    keywords: ['formatting', 'style', 'prettier'],
    category: 'quality',
    description: 'Formatting or style',
  },
  {
    symbol: '📊',
    keywords: ['coverage', 'test_coverage', 'metrics'],
    category: 'quality',
    description: 'Coverage or metrics',
  },
];

/**
 * Get technical symbol by keyword
 */
export function getTechnicalSymbolByKeyword(keyword: string): string | null {
  const normalized = keyword.toLowerCase().trim();

  for (const def of TECHNICAL_SYMBOLS) {
    if (def.keywords.some((k) => k.toLowerCase() === normalized)) {
      return def.symbol;
    }
  }

  return null;
}

/**
 * Get all technical symbols in a category
 */
export function getTechnicalSymbolsByCategory(
  category: TechnicalSymbol['category']
): TechnicalSymbol[] {
  return TECHNICAL_SYMBOLS.filter((s) => s.category === category);
}
