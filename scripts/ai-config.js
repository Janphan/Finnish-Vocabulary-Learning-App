// ==============================================
// AI Service Configuration
// Configure your preferred AI service for example generation
// ==============================================

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Environment variables template
// Create a .env file in the root directory with your API keys:
/*
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AZURE_OPENAI_KEY=your_azure_openai_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
*/

const aiConfig = {
  // Choose your AI service: 'openai', 'gemini', 'claude', 'azure', or 'mock'
  service: 'gemini',
  
  // Google Gemini Configuration
  gemini: {
    model: 'gemini-2.5-flash',
    maxTokens: 8000, // Increased significantly for large batches
    temperature: 0.7,
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
  },
  
  // OpenAI Configuration
  openai: {
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7,
    apiUrl: 'https://api.openai.com/v1/chat/completions'
  },
  
  // Anthropic Claude Configuration
  claude: {
    model: 'claude-3-sonnet-20240229',
    maxTokens: 1000,
    apiUrl: 'https://api.anthropic.com/v1/messages'
  },
  
  // Azure OpenAI Configuration
  azure: {
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7,
    apiVersion: '2023-12-01-preview'
  },
  
  // Batch processing settings
  batch: {
    size: 25, // Reduced to avoid MAX_TOKENS error
    delayMs: 6000, // 6 seconds between batches
    maxRetries: 3, // Reduce retries to save quota
    testBatchCount: 20 // For testing: only process 20 batches (100 words)
  }
};

// AI Service implementations
const aiServices = {
  async gemini(prompt) {
    const response = await fetch(`${aiConfig.gemini.apiUrl}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: aiConfig.gemini.temperature,
          maxOutputTokens: aiConfig.gemini.maxTokens
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Better error handling for Gemini response
    if (!data.candidates || !data.candidates[0]) {
      console.error('No candidates in response:', JSON.stringify(data, null, 2));
      throw new Error('No candidates in Gemini API response');
    }
    
    const candidate = data.candidates[0];
    
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      console.error('Missing content or parts in response:', JSON.stringify(candidate, null, 2));
      throw new Error('Missing content in Gemini API response');
    }
    
    return candidate.content.parts[0].text;
  },
  
  async openai(prompt) {
    const response = await fetch(aiConfig.openai.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: aiConfig.openai.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: aiConfig.openai.maxTokens,
        temperature: aiConfig.openai.temperature
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  },
  
  async claude(prompt) {
    const response = await fetch(aiConfig.claude.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: aiConfig.claude.model,
        max_tokens: aiConfig.claude.maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
  },
  
  async azure(prompt) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${aiConfig.azure.apiVersion}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_KEY
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        max_tokens: aiConfig.azure.maxTokens,
        temperature: aiConfig.azure.temperature
      })
    });
    
    if (!response.ok) {
      throw new Error(`Azure OpenAI error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  },
  
  async mock(prompt) {
    // Mock service for testing - generates simple Finnish examples
    console.log('⚠️  Using mock AI service for testing');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Count how many examples needed from prompt
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
      'Lapset leikkivät puistossa.',
      'Kahvi on kuumaa.',
      'Lintu laulaa puussa.',
      'Kello on kolme.',
      'Koira haukkuu äänekkäästi.',
      'Kukka on kaunis.',
      'Vesi on kirkasta.',
      'Tuuli puhaltaa voimakkaasti.',
      'Kala ui vedessä.',
      'Talo on vanha.',
      'Musiikki soi kauniisti.'
    ];
    
    return mockExamples.slice(0, count).join('\n');
  }
};

// Get AI service function
function getAIService() {
  const service = aiConfig.service;
  if (!aiServices[service]) {
    throw new Error(`Unknown AI service: ${service}`);
  }
  return aiServices[service];
}

module.exports = { aiConfig, getAIService };