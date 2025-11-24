/**
 * Integration Tests for Token Efficiency Layer
 * Tests the complete token optimization workflow
 */

import { SymbolSystem } from '../../../src/core/optimizers/symbols/symbol-system';
import { AbbreviationEngine } from '../../../src/core/optimizers/compression/abbreviation-engine';
import { BudgetManager } from '../../../src/core/optimizers/budget/budget-manager';
import { UsageMonitor } from '../../../src/core/optimizers/budget/usage-monitor';
import { RecommendationEngine } from '../../../src/core/optimizers/budget/recommendation-engine';
import { Visualization } from '../../../src/core/optimizers/budget/visualization';

describe('Token Efficiency Layer Integration', () => {
  describe('Complete Optimization Workflow', () => {
    it('should achieve 30-50% compression using symbols and abbreviations', () => {
      const symbolSystem = new SymbolSystem();
      const abbreviationEngine = new AbbreviationEngine();

      const text = `
        The objective is to optimize performance and ensure security.
        This leads to success because the application configuration
        is properly managed. The database environment is stable and
        the operations team maintains high standards.
      `;

      // Step 1: Apply symbols
      const symbolResult = symbolSystem.compress(text);
      const symbolReduction = symbolResult.compressionRatio;

      // Step 2: Apply abbreviations
      const abbrevResult = abbreviationEngine.abbreviate(symbolResult.compressed);
      const finalReduction =
        (text.length - abbrevResult.abbreviated.length) / text.length;

      // Should achieve 30-50% reduction
      expect(finalReduction).toBeGreaterThanOrEqual(0.3);
      expect(finalReduction).toBeLessThanOrEqual(0.6);
    });
  });

  describe('Budget Management Integration', () => {
    it('should track usage and provide recommendations', () => {
      const budgetManager = new BudgetManager();
      const usageMonitor = new UsageMonitor();
      const recommendationEngine = new RecommendationEngine(
        budgetManager,
        usageMonitor
      );

      // Simulate usage
      budgetManager.trackUsage(50000, 'working');
      usageMonitor.record(50000, 'working', 'feature_implementation');

      budgetManager.trackUsage(10000, 'system');
      usageMonitor.record(10000, 'system', 'system_prompt');

      // Get status
      const status = budgetManager.getStatus();
      expect(status.used).toBe(60000);
      expect(status.percentage).toBe(30);
      expect(status.status).toBe('healthy');

      // Get recommendations
      const recommendations = recommendationEngine.getRecommendations();
      expect(recommendations).toBeDefined();
    });

    it('should visualize budget allocation', () => {
      const budgetManager = new BudgetManager();
      const usageMonitor = new UsageMonitor();
      const visualization = new Visualization(budgetManager, usageMonitor);

      budgetManager.trackUsage(100000, 'working');

      const dashboard = visualization.renderDashboard();

      expect(dashboard).toContain('TOKEN BUDGET DASHBOARD');
      expect(dashboard).toContain('Budget Allocation');
      expect(dashboard).toContain('Current Usage');
    });
  });

  describe('Real-world Scenario: Feature Implementation', () => {
    it('should optimize a typical feature implementation workflow', () => {
      const symbolSystem = new SymbolSystem();
      const abbreviationEngine = new AbbreviationEngine();
      const budgetManager = new BudgetManager();
      const usageMonitor = new UsageMonitor();

      // Simulate feature implementation prompts
      const prompts = [
        'Implement user authentication with security measures',
        'Create database configuration for production environment',
        'Optimize performance and ensure high availability',
        'The objective is to maintain system integrity',
        'This leads to improved customer satisfaction'
      ];

      let totalOriginal = 0;
      let totalOptimized = 0;

      for (const prompt of prompts) {
        totalOriginal += prompt.length;

        // Optimize
        const symbolResult = symbolSystem.compress(prompt);
        const abbrevResult = abbreviationEngine.abbreviate(symbolResult.compressed);

        totalOptimized += abbrevResult.abbreviated.length;

        // Track usage
        const tokens = Math.floor(abbrevResult.abbreviated.length / 4);
        budgetManager.trackUsage(tokens, 'working');
        usageMonitor.record(tokens, 'working', 'feature_prompt');
      }

      const reduction = (totalOriginal - totalOptimized) / totalOriginal;

      // Should achieve significant reduction
      expect(reduction).toBeGreaterThan(0.3);

      // Budget should be healthy
      const status = budgetManager.getStatus();
      expect(status.status).toBe('healthy');
      expect(status.percentage).toBeLessThan(10);
    });
  });

  describe('Monitoring and Recommendations', () => {
    it('should provide actionable recommendations based on usage patterns', () => {
      const budgetManager = new BudgetManager();
      const usageMonitor = new UsageMonitor();
      const recommendationEngine = new RecommendationEngine(
        budgetManager,
        usageMonitor
      );

      // Simulate high usage
      budgetManager.trackUsage(130000, 'working');
      usageMonitor.record(130000, 'working', 'large_operation');

      const recommendations = recommendationEngine.getRecommendations();

      // Should have warning recommendations
      expect(recommendations.length).toBeGreaterThan(0);
      const highPriority = recommendations.filter(
        r => r.priority === 'high' || r.priority === 'critical'
      );
      expect(highPriority.length).toBeGreaterThan(0);

      // Generate report
      const report = recommendationEngine.generateReport();
      expect(report).toContain('Token Optimization Report');
      expect(report).toContain('Recommendations');
    });
  });

  describe('Performance Benchmarks', () => {
    it('should meet token reduction targets', () => {
      const symbolSystem = new SymbolSystem();
      const abbreviationEngine = new AbbreviationEngine();

      // Test with symbol-rich text
      const symbolRichText =
        'The objective leads to success therefore performance is optimized and security is maintained because the system configuration is properly managed';

      const symbolResult = symbolSystem.compress(symbolRichText);
      const symbolReduction = symbolResult.compressionRatio;

      // Should achieve at least 30% reduction
      expect(symbolReduction).toBeGreaterThanOrEqual(0.3);

      // Test with abbreviation-rich text
      const abbrevRichText =
        'The application uses the database for configuration in the production environment with proper authentication and authorization';

      const abbrevResult = abbreviationEngine.abbreviate(abbrevRichText);
      const abbrevReduction =
        (abbrevRichText.length - abbrevResult.abbreviated.length) /
        abbrevRichText.length;

      // Should achieve noticeable reduction
      expect(abbrevReduction).toBeGreaterThan(0.15);
    });

    it('should process optimizations efficiently', () => {
      const symbolSystem = new SymbolSystem();
      const text = 'test text '.repeat(1000);

      const start = Date.now();
      symbolSystem.compress(text);
      const duration = Date.now() - start;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Budget Reallocation', () => {
    it('should dynamically reallocate budget based on usage', () => {
      const budgetManager = new BudgetManager();

      // Initial allocation
      const initialStatus = budgetManager.getStatus();
      expect(initialStatus.allocation.working).toBe(150000); // 75%

      // Reallocate for different priorities
      budgetManager.reallocate({
        reserved: 1,
        system: 1,
        dynamic: 3,
        working: 5
      });

      const newStatus = budgetManager.getStatus();
      expect(newStatus.allocation.working).toBe(100000); // 50%
      expect(newStatus.allocation.dynamic).toBe(60000); // 30%
    });
  });

  describe('Usage Trends', () => {
    it('should track usage trends over time', () => {
      const usageMonitor = new UsageMonitor();

      // Record multiple events
      for (let i = 0; i < 10; i++) {
        usageMonitor.record(1000, 'working', 'operation_' + i);
      }

      const stats = usageMonitor.getStats();
      expect(stats.total).toBe(10000);
      expect(stats.averagePerOperation).toBe(1000);

      const topConsumers = usageMonitor.getTopConsumers(5);
      expect(topConsumers.length).toBeGreaterThan(0);
    });
  });

  describe('Token Savings Calculation', () => {
    it('should calculate savings compared to baseline', () => {
      const usageMonitor = new UsageMonitor();

      // Simulate optimized usage
      usageMonitor.record(5000, 'optimized', 'feature_with_symbols');
      usageMonitor.record(3000, 'optimized', 'feature_with_abbreviations');

      // Baseline would have been 80,000 tokens
      const baseline = 80000;
      const savings = usageMonitor.calculateSavings(baseline);

      expect(savings.saved).toBe(72000);
      expect(savings.percentSaved).toBe(90);
    });
  });
});
