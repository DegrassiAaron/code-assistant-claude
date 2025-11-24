/**
 * Core Symbol Definitions
 * Logic, status, and flow symbols for token efficiency
 */

export interface SymbolDefinition {
  symbol: string;
  keywords: string[];
  category: "logic" | "status" | "flow" | "math";
  description: string;
}

/**
 * Core symbols for logic, status, and flow control
 */
export const CORE_SYMBOLS: SymbolDefinition[] = [
  // Logic & Reasoning
  {
    symbol: "→",
    keywords: ["leads_to", "leads to", "results in", "implies"],
    category: "logic",
    description: "Indicates causation or implication",
  },
  {
    symbol: "⇒",
    keywords: ["transforms", "transforms into", "becomes", "converts to"],
    category: "logic",
    description: "Indicates transformation",
  },
  {
    symbol: "∴",
    keywords: ["therefore", "thus", "hence", "consequently"],
    category: "logic",
    description: "Logical conclusion",
  },
  {
    symbol: "∵",
    keywords: ["because", "since", "as", "given that"],
    category: "logic",
    description: "Logical premise",
  },
  {
    symbol: "∧",
    keywords: ["and", "also", "plus"],
    category: "logic",
    description: "Logical AND",
  },
  {
    symbol: "∨",
    keywords: ["or", "alternatively"],
    category: "logic",
    description: "Logical OR",
  },
  {
    symbol: "¬",
    keywords: ["not", "negation"],
    category: "logic",
    description: "Logical NOT",
  },

  // Status Indicators
  {
    symbol: "✅",
    keywords: ["completed", "done", "success", "passed"],
    category: "status",
    description: "Success or completion",
  },
  {
    symbol: "❌",
    keywords: ["failed", "error", "rejected", "denied"],
    category: "status",
    description: "Failure or error",
  },
  {
    symbol: "⚠️",
    keywords: ["warning", "caution", "alert"],
    category: "status",
    description: "Warning or caution",
  },
  {
    symbol: "🔄",
    keywords: ["in_progress", "in progress", "processing", "pending"],
    category: "status",
    description: "In progress or pending",
  },
  {
    symbol: "⏸️",
    keywords: ["paused", "suspended", "on_hold"],
    category: "status",
    description: "Paused or suspended",
  },
  {
    symbol: "🔴",
    keywords: ["blocked", "stopped", "critical"],
    category: "status",
    description: "Blocked or critical",
  },
  {
    symbol: "🟢",
    keywords: ["healthy", "good", "operational"],
    category: "status",
    description: "Healthy or operational",
  },
  {
    symbol: "🟡",
    keywords: ["degraded", "warning_status"],
    category: "status",
    description: "Degraded or warning status",
  },

  // Flow Control
  {
    symbol: "↑",
    keywords: ["increase", "up", "increment"],
    category: "flow",
    description: "Increase or upward",
  },
  {
    symbol: "↓",
    keywords: ["decrease", "down", "decrement"],
    category: "flow",
    description: "Decrease or downward",
  },
  {
    symbol: "↔️",
    keywords: ["bidirectional", "two_way", "mutual"],
    category: "flow",
    description: "Bidirectional or mutual",
  },
  {
    symbol: "🔁",
    keywords: ["repeat", "loop", "iterate"],
    category: "flow",
    description: "Repeat or loop",
  },
  {
    symbol: "⤴️",
    keywords: ["return", "back", "revert"],
    category: "flow",
    description: "Return or revert",
  },

  // Math & Comparison
  {
    symbol: "≈",
    keywords: ["approximately", "roughly", "about"],
    category: "math",
    description: "Approximately equal",
  },
  {
    symbol: "≠",
    keywords: ["not_equal", "different_from"],
    category: "math",
    description: "Not equal",
  },
  {
    symbol: "≥",
    keywords: ["greater_than_or_equal", "at_least"],
    category: "math",
    description: "Greater than or equal",
  },
  {
    symbol: "≤",
    keywords: ["less_than_or_equal", "at_most"],
    category: "math",
    description: "Less than or equal",
  },
  {
    symbol: "∞",
    keywords: ["infinity", "infinite", "unlimited"],
    category: "math",
    description: "Infinity",
  },
];

/**
 * Get symbol by keyword
 */
export function getSymbolByKeyword(keyword: string): string | null {
  const normalized = keyword.toLowerCase().trim();

  for (const def of CORE_SYMBOLS) {
    if (def.keywords.some((k) => k.toLowerCase() === normalized)) {
      return def.symbol;
    }
  }

  return null;
}

/**
 * Get all symbols in a category
 */
export function getSymbolsByCategory(
  category: SymbolDefinition["category"],
): SymbolDefinition[] {
  return CORE_SYMBOLS.filter((s) => s.category === category);
}
