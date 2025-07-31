// Dumee Agents - Core exports

// Stubs for missing types/interfaces
export interface StreamEventData {}
export interface ToolEndCallback {}
export interface EventHandler {}
export interface ToolEndData {}
export interface LLMConfig {}
export interface StandardGraphConfig {}
export interface IState {}

// Update Providers
export const Providers = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  BEDROCK: 'bedrock',
  AZURE: 'azure',
  VERTEXAI: 'vertexai', 
  XAI: 'xai',
  OLLAMA: 'ollama', 
  DEEPSEEK: 'deepseek',
  OPENROUTER: 'openrouter',
} as const;

// Update GraphEvents
export const GraphEvents = {
  START: 'start',
  END: 'end',
  ERROR: 'error',
  PROGRESS: 'progress',
  TOOL_END: 'tool_end',
  ON_RUN_STEP: 'on_run_step',
  ON_MESSAGE_DELTA: 'on_message_delta',
  ON_REASONING_DELTA: 'on_reasoning_delta'
} as const;

// Update Run to be a class
export class Run {
  id: string;
  status: string;
  model: string;
  instructions: string;

  constructor() {
    this.id = '';
    this.status = '';
    this.model = '';
    this.instructions = '';
  }

  static async create(params: any): Promise<Run> {
    console.log('Run.create called with:', params);
    return new Run();
  }
}

// Keep existing exports
export const Constants = {
  DUMEE_VERSION: '0.7.9',
  MAX_TOKENS: 4096,
  DEFAULT_TEMPERATURE: 0.7
} as const;

export const EnvVar = {
  OPENAI_API_KEY: 'OPENAI_API_KEY',
  ANTHROPIC_API_KEY: 'ANTHROPIC_API_KEY',
  GOOGLE_API_KEY: 'GOOGLE_API_KEY'
} as const;

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
export const getCodeBaseURL = (endpoint: string): string => `https://api.${endpoint}.com/v1`;
export const createContentAggregator = () => ({ aggregate: (content: any[]) => content.join('\n') });
export interface GenericTool { name: string; description: string; parameters: Record<string, any>; }
export interface ClientOptions { apiKey?: string; baseURL?: string; timeout?: number; }
export interface OpenAIClientOptions extends ClientOptions { organization?: string; project?: string; configuration?: any; useResponsesApi?: boolean; }
export interface GoogleClientOptions extends ClientOptions { projectId?: string; location?: string; thinkingConfig?: any; baseUrl?: string; customHeaders?: any; }
export interface VertexAIClientOptions extends GoogleClientOptions { credentials?: any; authOptions?: any; thinkingBudget?: any; includeThoughts?: any; }

export type ProvidersType = typeof Providers[keyof typeof Providers];
export type GraphEventsType = typeof GraphEvents[keyof typeof GraphEvents];
