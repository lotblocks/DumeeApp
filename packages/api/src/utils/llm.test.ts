﻿import { extractDumeeParams } from './llm';

describe('extractDumeeParams', () => {
  it('should return defaults when options is undefined', () => {
    const result = extractDumeeParams(undefined);

    expect(result.resendFiles).toBe(true);
    expect(result.promptPrefix).toBeUndefined();
    expect(result.maxContextTokens).toBeUndefined();
    expect(result.modelLabel).toBeUndefined();
    expect(result.modelOptions).toEqual({});
  });

  it('should return defaults when options is null', () => {
    const result = extractDumeeParams();

    expect(result.resendFiles).toBe(true);
    expect(result.promptPrefix).toBeUndefined();
    expect(result.maxContextTokens).toBeUndefined();
    expect(result.modelLabel).toBeUndefined();
    expect(result.modelOptions).toEqual({});
  });

  it('should extract all Dumee params and leave model options', () => {
    const options = {
      resendFiles: false,
      promptPrefix: 'You are a helpful assistant',
      maxContextTokens: 4096,
      modelLabel: 'GPT-4',
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000,
    };

    const result = extractDumeeParams(options);

    expect(result.resendFiles).toBe(false);
    expect(result.promptPrefix).toBe('You are a helpful assistant');
    expect(result.maxContextTokens).toBe(4096);
    expect(result.modelLabel).toBe('GPT-4');
    expect(result.modelOptions).toEqual({
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000,
    });
  });

  it('should handle null values for Dumee params', () => {
    const options = {
      resendFiles: true,
      promptPrefix: null,
      maxContextTokens: 2048,
      modelLabel: null,
      model: 'claude-3',
    };

    const result = extractDumeeParams(options);

    expect(result.resendFiles).toBe(true);
    expect(result.promptPrefix).toBeNull();
    expect(result.maxContextTokens).toBe(2048);
    expect(result.modelLabel).toBeNull();
    expect(result.modelOptions).toEqual({
      model: 'claude-3',
    });
  });

  it('should use default for resendFiles when not provided', () => {
    const options = {
      promptPrefix: 'Test prefix',
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    };

    const result = extractDumeeParams(options);

    expect(result.resendFiles).toBe(true); // Should use default
    expect(result.promptPrefix).toBe('Test prefix');
    expect(result.maxContextTokens).toBeUndefined();
    expect(result.modelLabel).toBeUndefined();
    expect(result.modelOptions).toEqual({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    });
  });

  it('should handle empty options object', () => {
    const result = extractDumeeParams({});

    expect(result.resendFiles).toBe(true); // Should use default
    expect(result.promptPrefix).toBeUndefined();
    expect(result.maxContextTokens).toBeUndefined();
    expect(result.modelLabel).toBeUndefined();
    expect(result.modelOptions).toEqual({});
  });

  it('should only extract known Dumee params', () => {
    const options = {
      resendFiles: false,
      promptPrefix: 'Custom prompt',
      maxContextTokens: 8192,
      modelLabel: 'Custom Model',
      // Model options
      model: 'gpt-4',
      temperature: 0.9,
      top_p: 0.95,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      // Unknown params should stay in modelOptions
      unknownParam: 'should remain',
      customSetting: 123,
    };

    const result = extractDumeeParams(options);

    // Dumee params extracted
    expect(result.resendFiles).toBe(false);
    expect(result.promptPrefix).toBe('Custom prompt');
    expect(result.maxContextTokens).toBe(8192);
    expect(result.modelLabel).toBe('Custom Model');

    // Model options should include everything else
    expect(result.modelOptions).toEqual({
      model: 'gpt-4',
      temperature: 0.9,
      top_p: 0.95,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      unknownParam: 'should remain',
      customSetting: 123,
    });
  });

  it('should not mutate the original options object', () => {
    const options = {
      resendFiles: false,
      promptPrefix: 'Test',
      model: 'gpt-4',
      temperature: 0.7,
    };
    const originalOptions = { ...options };

    extractDumeeParams(options);

    // Original object should remain unchanged
    expect(options).toEqual(originalOptions);
  });

  it('should handle undefined values for optional Dumee params', () => {
    const options = {
      resendFiles: false,
      promptPrefix: undefined,
      maxContextTokens: undefined,
      modelLabel: undefined,
      model: 'claude-2',
    };

    const result = extractDumeeParams(options);

    expect(result.resendFiles).toBe(false);
    expect(result.promptPrefix).toBeUndefined();
    expect(result.maxContextTokens).toBeUndefined();
    expect(result.modelLabel).toBeUndefined();
    expect(result.modelOptions).toEqual({
      model: 'claude-2',
    });
  });

  it('should handle mixed null and undefined values', () => {
    const options = {
      promptPrefix: null,
      maxContextTokens: undefined,
      modelLabel: null,
      model: 'gpt-3.5-turbo',
      stop: ['\\n', '\\n\\n'],
    };

    const result = extractDumeeParams(options);

    expect(result.resendFiles).toBe(true); // default
    expect(result.promptPrefix).toBeNull();
    expect(result.maxContextTokens).toBeUndefined();
    expect(result.modelLabel).toBeNull();
    expect(result.modelOptions).toEqual({
      model: 'gpt-3.5-turbo',
      stop: ['\\n', '\\n\\n'],
    });
  });
});

