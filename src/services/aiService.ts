// ==============================================
// AI Service Module
// Handles AI API calls for vocabulary generation
// ==============================================


export interface AIServiceConfig {
  service: 'openai' | 'claude' | 'azure' | 'mock';
  apiKey?: string;
  endpoint?: string;
}

// Mock AI service call - replace with actual implementation
export const callAIService = async (
  prompt: string,
  config: AIServiceConfig = { service: 'mock' }
): Promise<string> => {
  const { service } = config;

  switch (service) {
    case 'openai':
      // Implement OpenAI API call
      return callOpenAI(prompt, config.apiKey!);
    case 'claude':
      // Implement Claude API call
      return callClaude(prompt, config.apiKey!);
    case 'azure':
      // Implement Azure OpenAI call
      return callAzureOpenAI(prompt, config);
    case 'mock':
    default:
      // Mock implementation
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

// Placeholder for OpenAI implementation
const callOpenAI = async (prompt: string, apiKey: string): Promise<string> => {
  // TODO: Implement OpenAI API call
  throw new Error('OpenAI service not implemented');
};

// Placeholder for Claude implementation
const callClaude = async (prompt: string, apiKey: string): Promise<string> => {
  // TODO: Implement Claude API call
  throw new Error('Claude service not implemented');
};

// Placeholder for Azure OpenAI implementation
const callAzureOpenAI = async (prompt: string, config: AIServiceConfig): Promise<string> => {
  // TODO: Implement Azure OpenAI API call
  throw new Error('Azure OpenAI service not implemented');
};