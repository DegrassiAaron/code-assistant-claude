import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface ConfigOptions {
  list?: boolean;
  set?: string;
  get?: string;
  global?: boolean;
  local?: boolean;
}

interface Config {
  [key: string]: unknown;
}

/**
 * Get configuration file path based on scope
 */
function getConfigPath(scope: 'local' | 'global'): string {
  if (scope === 'local') {
    return path.join(process.cwd(), '.claude', 'config.json');
  }
  return path.join(os.homedir(), '.claude', 'config.json');
}

/**
 * Load configuration from file
 */
async function loadConfig(scope: 'local' | 'global'): Promise<Config | null> {
  const configPath = getConfigPath(scope);
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content) as Config;
  } catch {
    return null;
  }
}

/**
 * Save configuration to file
 */
async function saveConfig(
  scope: 'local' | 'global',
  config: Config
): Promise<void> {
  const configPath = getConfigPath(scope);
  const configDir = path.dirname(configPath);

  // Ensure directory exists
  await fs.mkdir(configDir, { recursive: true });

  // Write config with pretty formatting
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Get nested property using dot notation (e.g., "skills.enabled")
 */
function getNestedProperty(obj: Config, keyPath: string): unknown {
  const keys = keyPath.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Set nested property using dot notation
 */
function setNestedProperty(obj: Config, keyPath: string, value: unknown): void {
  const keys = keyPath.split('.');
  const lastKey = keys.pop()!;
  let current: unknown = obj;

  // Navigate to parent object
  for (const key of keys) {
    if (!current || typeof current !== 'object') {
      throw new Error(`Invalid key path: ${keyPath}`);
    }

    const currentObj = current as Record<string, unknown>;

    if (!(key in currentObj)) {
      currentObj[key] = {};
    }

    current = currentObj[key];
  }

  // Set value
  if (current && typeof current === 'object') {
    (current as Record<string, unknown>)[lastKey] = value;
  } else {
    throw new Error(`Cannot set property on non-object at: ${keyPath}`);
  }
}

/**
 * Parse value from string (smart type detection)
 */
function parseValue(valueStr: string): unknown {
  // Try boolean
  if (valueStr === 'true') return true;
  if (valueStr === 'false') return false;

  // Try null
  if (valueStr === 'null') return null;

  // Try number
  const num = Number(valueStr);
  if (!isNaN(num) && valueStr.trim() !== '') {
    return num;
  }

  // Try JSON (array or object)
  if (
    (valueStr.startsWith('[') && valueStr.endsWith(']')) ||
    (valueStr.startsWith('{') && valueStr.endsWith('}'))
  ) {
    try {
      return JSON.parse(valueStr);
    } catch {
      // Not valid JSON, treat as string
    }
  }

  // Default: string
  return valueStr;
}

export async function configCommand(options: ConfigOptions): Promise<void> {
  console.log(chalk.blue('\n⚙️  Configuration Management\n'));

  // Determine scope
  const scope: 'local' | 'global' = options.global
    ? 'global'
    : options.local
      ? 'local'
      : 'local'; // Default to local

  const scopeLabel = scope === 'global' ? 'Global' : 'Local';

  // List configuration
  if (options.list) {
    const config = await loadConfig(scope);

    if (!config) {
      console.log(
        chalk.yellow(
          `No ${scope} configuration found at: ${getConfigPath(scope)}\n`
        )
      );
      console.log(chalk.gray('Run: code-assistant-claude init\n'));
      return;
    }

    console.log(chalk.cyan(`${scopeLabel} Configuration:\n`));
    console.log(chalk.gray(JSON.stringify(config, null, 2)));
    console.log('');
    return;
  }

  // Set configuration
  if (options.set) {
    const [key, ...valueParts] = options.set.split('=');
    const value = valueParts.join('='); // Handle values with '='

    if (!key || value === undefined) {
      console.log(chalk.red('Invalid format. Use: --set key=value\n'));
      console.log(chalk.gray('Examples:'));
      console.log(chalk.gray('  --set verbosity=high'));
      console.log(chalk.gray('  --set skills.enabled=true'));
      console.log(chalk.gray('  --set maxAgents=5\n'));
      return;
    }

    let config = await loadConfig(scope);

    if (!config) {
      console.log(
        chalk.yellow(`No ${scope} configuration found. Creating new...\n`)
      );
      config = {};
    }

    try {
      const parsedValue = parseValue(value);
      setNestedProperty(config, key, parsedValue);

      await saveConfig(scope, config);

      console.log(chalk.green(`✅ Configuration updated (${scope})\n`));
      console.log(chalk.gray(`  ${key} = ${JSON.stringify(parsedValue)}\n`));
    } catch (error) {
      console.log(
        chalk.red('Error:'),
        error instanceof Error ? error.message : 'Unknown error'
      );
      console.log('');
      process.exit(1);
    }

    return;
  }

  // Get configuration
  if (options.get) {
    const config = await loadConfig(scope);

    if (!config) {
      console.log(chalk.yellow(`No ${scope} configuration found\n`));
      return;
    }

    const value = getNestedProperty(config, options.get);

    if (value === undefined) {
      console.log(chalk.yellow(`Key not found: ${options.get}\n`));
      console.log(chalk.gray('Available keys:'));
      console.log(chalk.gray(Object.keys(config).join(', ')));
      console.log('');
      return;
    }

    console.log(chalk.cyan(`${scopeLabel} Config (${options.get}):\n`));
    console.log(
      typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
    );
    console.log('');
    return;
  }

  // No option specified
  console.log(
    chalk.yellow('Please specify an option: --list, --set, or --get\n')
  );
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  code-assistant-claude config --list'));
  console.log(chalk.gray('  code-assistant-claude config --get verbosity'));
  console.log(
    chalk.gray('  code-assistant-claude config --set verbosity=high')
  );
  console.log('');
}
