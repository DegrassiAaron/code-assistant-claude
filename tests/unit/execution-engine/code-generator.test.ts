/// <reference types="vitest" />
import { CodeAPIGenerator } from '../../../src/core/execution-engine/mcp-code-api/generator';
import { MCPToolSchema } from '../../../src/core/execution-engine/types';

describe('CodeAPIGenerator', () => {
  const generator = new CodeAPIGenerator();

  const sampleSchema: MCPToolSchema = {
    name: 'test_function',
    description: 'A test function',
    parameters: [
      {
        name: 'param1',
        type: 'string',
        description: 'First parameter',
        required: true
      },
      {
        name: 'param2',
        type: 'number',
        description: 'Second parameter',
        required: false
      }
    ],
    returns: {
      type: 'object',
      description: 'Result object'
    }
  };

  it('should generate TypeScript wrapper code', async () => {
    const wrapper = await generator.generateTypeScript([sampleSchema]);

    expect(wrapper.language).toBe('typescript');
    expect(wrapper.code).toContain('testFunction');
    expect(wrapper.code).toContain('param1: string');
    expect(wrapper.code).toContain('param2?: number');
    expect(wrapper.code).toContain('Promise<Record<string, unknown>>');
  });

  it('should generate Python wrapper code', async () => {
    const wrapper = await generator.generatePython([sampleSchema]);

    expect(wrapper.language).toBe('python');
    expect(wrapper.code).toContain('test_function');
    expect(wrapper.code).toContain('param1: str');
    expect(wrapper.code).toContain('param2: Optional[float]');
  });

  it('should estimate token count', async () => {
    const wrapper = await generator.generateTypeScript([sampleSchema]);

    expect(wrapper.estimatedTokens).toBeGreaterThan(0);
    expect(wrapper.estimatedTokens).toBeLessThan(1000); // Should be small
  });

  it('should extract dependencies', async () => {
    const schema: MCPToolSchema = {
      ...sampleSchema,
      name: 'axios_request'
    };

    const wrapper = await generator.generateTypeScript([schema]);

    // Dependencies would be extracted from imports in template
    expect(wrapper.dependencies).toBeDefined();
  });

  it('should handle multiple tools', async () => {
    const schemas: MCPToolSchema[] = [
      sampleSchema,
      {
        ...sampleSchema,
        name: 'another_function'
      }
    ];

    const wrapper = await generator.generateTypeScript(schemas);

    expect(wrapper.code).toContain('testFunction');
    expect(wrapper.code).toContain('anotherFunction');
  });
});
