/**
 * Business Symbol Definitions
 * Strategic, financial, and business-oriented symbols
 */

export interface BusinessSymbol {
  symbol: string;
  keywords: string[];
  category: 'strategic' | 'financial' | 'operational' | 'customer';
  description: string;
}

/**
 * Business and strategic symbols for token efficiency
 */
export const BUSINESS_SYMBOLS: BusinessSymbol[] = [
  // Strategic
  {
    symbol: '🎯',
    keywords: ['objective', 'goal', 'target', 'aim'],
    category: 'strategic',
    description: 'Objective or goal'
  },
  {
    symbol: '🏆',
    keywords: ['competitive_advantage', 'advantage', 'winner', 'excellence'],
    category: 'strategic',
    description: 'Competitive advantage'
  },
  {
    symbol: '📊',
    keywords: ['metrics', 'analytics', 'measurement', 'data'],
    category: 'strategic',
    description: 'Metrics and analytics'
  },
  {
    symbol: '🔮',
    keywords: ['vision', 'future', 'forecast', 'prediction'],
    category: 'strategic',
    description: 'Vision or forecast'
  },
  {
    symbol: '🎲',
    keywords: ['risk', 'uncertainty', 'gamble'],
    category: 'strategic',
    description: 'Risk or uncertainty'
  },
  {
    symbol: '🔄',
    keywords: ['iteration', 'pivot', 'adaptation'],
    category: 'strategic',
    description: 'Iteration or pivot'
  },
  {
    symbol: '🚀',
    keywords: ['launch', 'scale', 'growth_initiative'],
    category: 'strategic',
    description: 'Launch or scale'
  },

  // Financial
  {
    symbol: '💰',
    keywords: ['financial', 'revenue', 'profit', 'money'],
    category: 'financial',
    description: 'Financial or revenue'
  },
  {
    symbol: '📈',
    keywords: ['growth', 'increase', 'upward_trend'],
    category: 'financial',
    description: 'Growth or upward trend'
  },
  {
    symbol: '📉',
    keywords: ['decline', 'decrease', 'downward_trend'],
    category: 'financial',
    description: 'Decline or downward trend'
  },
  {
    symbol: '💸',
    keywords: ['cost', 'expense', 'burn_rate', 'spending'],
    category: 'financial',
    description: 'Cost or expense'
  },
  {
    symbol: '💵',
    keywords: ['cashflow', 'liquidity', 'cash'],
    category: 'financial',
    description: 'Cashflow or liquidity'
  },
  {
    symbol: '💎',
    keywords: ['value', 'valuation', 'worth'],
    category: 'financial',
    description: 'Value or valuation'
  },
  {
    symbol: '⚖️',
    keywords: ['balance', 'equilibrium', 'tradeoff'],
    category: 'financial',
    description: 'Balance or tradeoff'
  },

  // Operational
  {
    symbol: '⚙️',
    keywords: ['operations', 'process', 'workflow'],
    category: 'operational',
    description: 'Operations or process'
  },
  {
    symbol: '⚡',
    keywords: ['efficiency', 'optimization', 'speed'],
    category: 'operational',
    description: 'Efficiency or speed'
  },
  {
    symbol: '🔧',
    keywords: ['maintenance', 'improvement', 'fix'],
    category: 'operational',
    description: 'Maintenance or improvement'
  },
  {
    symbol: '📦',
    keywords: ['delivery', 'shipment', 'product'],
    category: 'operational',
    description: 'Delivery or product'
  },
  {
    symbol: '🏭',
    keywords: ['production', 'manufacturing', 'output'],
    category: 'operational',
    description: 'Production or manufacturing'
  },
  {
    symbol: '🔗',
    keywords: ['integration', 'connection', 'link'],
    category: 'operational',
    description: 'Integration or connection'
  },
  {
    symbol: '⏱️',
    keywords: ['timeline', 'deadline', 'schedule'],
    category: 'operational',
    description: 'Timeline or deadline'
  },

  // Customer & Market
  {
    symbol: '👥',
    keywords: ['customers', 'users', 'market', 'audience'],
    category: 'customer',
    description: 'Customers or users'
  },
  {
    symbol: '❤️',
    keywords: ['satisfaction', 'loyalty', 'engagement'],
    category: 'customer',
    description: 'Satisfaction or loyalty'
  },
  {
    symbol: '📢',
    keywords: ['marketing', 'promotion', 'advertising'],
    category: 'customer',
    description: 'Marketing or promotion'
  },
  {
    symbol: '🎁',
    keywords: ['value_proposition', 'offering', 'benefit'],
    category: 'customer',
    description: 'Value proposition'
  },
  {
    symbol: '🌍',
    keywords: ['market_expansion', 'global', 'international'],
    category: 'customer',
    description: 'Market expansion'
  },
  {
    symbol: '🎨',
    keywords: ['brand', 'identity', 'positioning'],
    category: 'customer',
    description: 'Brand or identity'
  },
  {
    symbol: '🔊',
    keywords: ['feedback', 'voice', 'opinion'],
    category: 'customer',
    description: 'Feedback or voice'
  }
];

/**
 * Get business symbol by keyword
 */
export function getBusinessSymbolByKeyword(keyword: string): string | null {
  const normalized = keyword.toLowerCase().trim();

  for (const def of BUSINESS_SYMBOLS) {
    if (def.keywords.some(k => k.toLowerCase() === normalized)) {
      return def.symbol;
    }
  }

  return null;
}

/**
 * Get all business symbols in a category
 */
export function getBusinessSymbolsByCategory(
  category: BusinessSymbol['category']
): BusinessSymbol[] {
  return BUSINESS_SYMBOLS.filter(s => s.category === category);
}
