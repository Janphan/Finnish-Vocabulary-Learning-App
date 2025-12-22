export interface AIServiceConfig {
  service: 'openai' | 'claude' | 'azure' | 'mock';
  apiKey?: string;
  endpoint?: string;
}

export const callAIService = async (
  prompt: string,
  config: AIServiceConfig = { service: 'mock' }
): Promise<string> => {
  const { service } = config;

  switch (service) {
    case 'openai':
      return callOpenAI(prompt, config.apiKey!);
    case 'claude':
      return callClaude(prompt, config.apiKey!);
    case 'azure':
      return callAzureOpenAI(prompt, config);
    case 'mock':
    default:
      await new Promise(resolve => setTimeout(resolve, 1000));
      const lines = prompt.split('\n').filter(line => /^\d+\./.test(line.trim()));
      const count = lines.length;

      const mockExamples = [
        'Minä olen opiskelija.',
        'Hän menee kouluun.',
        'Me asumme Helsingissä.',
        'Tämä on hyvä kirja.',
        'He puhuvat suomea.',
        'Sää on kaunis tänään.',
        'Ruoka on valmis nyt.',
        'Kissa nukkuu sohvalla.',
        'Auto on pysäköity pihalle.',
        'Lapset leikkivät puistossa.'
      ];

      return mockExamples.slice(0, count).join('\n');
  }
};

const callOpenAI = async (prompt: string, apiKey: string): Promise<string> => {
  throw new Error('OpenAI service not implemented');
};

const callClaude = async (prompt: string, apiKey: string): Promise<string> => {
  throw new Error('Claude service not implemented');
};

const callAzureOpenAI = async (prompt: string, config: AIServiceConfig): Promise<string> => {
  throw new Error('Azure OpenAI service not implemented');
};