/**
 * Tests for Budget Manager
 */

import { BudgetManager } from '../../../../src/core/optimizers/budget/budget-manager';

describe('BudgetManager', () => {
  let budgetManager: BudgetManager;

  beforeEach(() => {
    budgetManager = new BudgetManager();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const status = budgetManager.getStatus();

      expect(status.total).toBe(200000);
      expect(status.used).toBe(0);
      expect(status.remaining).toBe(200000);
      expect(status.status).toBe('healthy');
    });

    it('should initialize with custom config', () => {
      const customManager = new BudgetManager({
        total: 100000,
        allocation: {
          reserved: 0.1,
          system: 0.1,
          dynamic: 0.2,
          working: 0.6
        }
      });

      const status = customManager.getStatus();
      expect(status.total).toBe(100000);
    });
  });

  describe('getStatus', () => {
    it('should return current budget status', () => {
      const status = budgetManager.getStatus();

      expect(status).toHaveProperty('total');
      expect(status).toHaveProperty('used');
      expect(status).toHaveProperty('remaining');
      expect(status).toHaveProperty('allocation');
      expect(status).toHaveProperty('percentage');
      expect(status).toHaveProperty('status');
    });

    it('should calculate percentage correctly', () => {
      budgetManager.trackUsage(100000, 'working');
      const status = budgetManager.getStatus();

      expect(status.percentage).toBe(50);
    });

    it('should update status based on usage', () => {
      // Healthy
      budgetManager.trackUsage(50000, 'working');
      expect(budgetManager.getStatus().status).toBe('healthy');

      // Warning
      budgetManager.reset();
      budgetManager.trackUsage(130000, 'working');
      expect(budgetManager.getStatus().status).toBe('warning');

      // Critical
      budgetManager.reset();
      budgetManager.trackUsage(170000, 'working');
      expect(budgetManager.getStatus().status).toBe('critical');
    });
  });

  describe('trackUsage', () => {
    it('should track token usage', () => {
      budgetManager.trackUsage(1000, 'working');
      const status = budgetManager.getStatus();

      expect(status.used).toBe(1000);
      expect(status.remaining).toBe(199000);
    });

    it('should accumulate usage', () => {
      budgetManager.trackUsage(500, 'working');
      budgetManager.trackUsage(300, 'system');
      budgetManager.trackUsage(200, 'dynamic');

      const status = budgetManager.getStatus();
      expect(status.used).toBe(1000);
    });
  });

  describe('hasBudgetAvailable', () => {
    it('should check if budget is available', () => {
      // Working category has 75% of 200k = 150k tokens
      expect(budgetManager.hasBudgetAvailable('working', 100000)).toBe(true);
      expect(budgetManager.hasBudgetAvailable('working', 200000)).toBe(false);
    });

    it('should account for current usage', () => {
      budgetManager.trackUsage(140000, 'working');

      expect(budgetManager.hasBudgetAvailable('working', 5000)).toBe(true);
      expect(budgetManager.hasBudgetAvailable('working', 15000)).toBe(false);
    });
  });

  describe('getRemainingBudget', () => {
    it('should return remaining budget for category', () => {
      const remaining = budgetManager.getRemainingBudget('working');

      // 75% of 200k = 150k
      expect(remaining).toBe(150000);
    });

    it('should decrease as usage is tracked', () => {
      budgetManager.trackUsage(50000, 'working');
      const remaining = budgetManager.getRemainingBudget('working');

      expect(remaining).toBe(100000);
    });

    it('should not go below zero', () => {
      budgetManager.trackUsage(200000, 'working');
      const remaining = budgetManager.getRemainingBudget('working');

      expect(remaining).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset all usage tracking', () => {
      budgetManager.trackUsage(50000, 'working');
      budgetManager.trackUsage(10000, 'system');

      budgetManager.reset();

      const status = budgetManager.getStatus();
      expect(status.used).toBe(0);
      expect(status.remaining).toBe(200000);
    });
  });

  describe('getCategoryBreakdown', () => {
    it('should return usage breakdown by category', () => {
      budgetManager.trackUsage(50000, 'working');
      budgetManager.trackUsage(5000, 'system');

      const breakdown = budgetManager.getCategoryBreakdown();

      expect(breakdown.working.used).toBe(50000);
      expect(breakdown.system.used).toBe(5000);
      expect(breakdown.working.percentage).toBeCloseTo(33.33, 1);
    });
  });

  describe('reallocate', () => {
    it('should reallocate budget based on priorities', () => {
      budgetManager.reallocate({
        reserved: 1,
        system: 1,
        dynamic: 2,
        working: 6
      });

      const status = budgetManager.getStatus();
      const allocation = status.allocation;

      expect(allocation.reserved).toBe(20000); // 10%
      expect(allocation.system).toBe(20000); // 10%
      expect(allocation.dynamic).toBe(40000); // 20%
      expect(allocation.working).toBe(120000); // 60%
    });
  });

  describe('getRecommendations', () => {
    it('should provide recommendations when usage is high', () => {
      budgetManager.trackUsage(170000, 'working');

      const recommendations = budgetManager.getRecommendations();

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(r => r.includes('Critical'))).toBe(true);
    });

    it('should suggest reallocation when needed', () => {
      budgetManager.trackUsage(140000, 'working');

      const recommendations = budgetManager.getRecommendations();

      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('export', () => {
    it('should export budget configuration', () => {
      const config = budgetManager.export();

      expect(config).toHaveProperty('total');
      expect(config).toHaveProperty('allocation');
      expect(config.total).toBe(200000);
    });
  });

  describe('allocation calculations', () => {
    it('should allocate budget correctly', () => {
      const status = budgetManager.getStatus();
      const allocation = status.allocation;

      expect(allocation.reserved).toBe(10000); // 5%
      expect(allocation.system).toBe(10000); // 5%
      expect(allocation.dynamic).toBe(30000); // 15%
      expect(allocation.working).toBe(150000); // 75%

      // Total should equal budget
      const total = allocation.reserved + allocation.system + allocation.dynamic + allocation.working;
      expect(total).toBe(200000);
    });
  });
});
