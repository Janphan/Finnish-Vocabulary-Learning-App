import React, { useState, useEffect } from 'react';
import WebSpeechTTS from './WebSpeechTTS';

interface VocabularyWord {
  id: string;
  finnish: string;
  english: string;
  category?: string;
  difficulty?: string;
}

const WebSpeechTestPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [testWords] = useState([
    { id: '1', finnish: 'kissa', english: 'cat' },
    { id: '2', finnish: 'koira', english: 'dog' },
    { id: '3', finnish: 'talo', english: 'house' },
    { id: '4', finnish: 'auto', english: 'car' },
    { id: '5', finnish: 'kirja', english: 'book' },
    { id: '6', finnish: 'sieni', english: 'mushroom' },
    { id: '7', finnish: 'kiitos', english: 'thank you' },
    { id: '8', finnish: 'hyvää huomenta', english: 'good morning' },
    { id: '9', finnish: 'näkemiin', english: 'goodbye' },
    { id: '10', finnish: 'ystävä', english: 'friend' }
  ]);

  useEffect(() => {
    // Check Web Speech API support
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const finnishVoices = voices.filter(voice => 
    voice.lang.includes('fi') || voice.lang.includes('FI')
  );

  const speakAll = () => {
    testWords.forEach((word, index) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(word.finnish);
        utterance.lang = 'fi-FI';
        utterance.rate = 0.8;
        if (finnishVoices.length > 0) {
          utterance.voice = finnishVoices[0];
        }
        speechSynthesis.speak(utterance);
      }, index * 2000); // 2 second delay between words
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🗣️ Web Speech API Test</h1>
            <button 
              onClick={() => onBack && onBack()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              ← Back to App
            </button>
          </div>

          {/* Browser Support Status */}
          <div className={`p-4 rounded-lg mb-6 ${
            isSupported ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h2 className="text-lg font-semibold mb-2">
              {isSupported ? '✅ Web Speech API Supported' : '❌ Web Speech API Not Supported'}
            </h2>
            <p className="text-gray-600">
              {isSupported 
                ? 'Your browser supports Web Speech API. Test the Finnish pronunciation below!' 
                : 'Your browser does not support Web Speech API. Try Chrome, Edge, or Safari.'
              }
            </p>
          </div>

          {/* Voice Information */}
          {isSupported && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">🎙️ Available Finnish Voices</h2>
              {finnishVoices.length > 0 ? (
                <div>
                  <p className="text-green-600 mb-2">Found {finnishVoices.length} Finnish voice(s):</p>
                  <ul className="list-disc list-inside space-y-1">
                    {finnishVoices.map((voice, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        <strong>{voice.name}</strong> ({voice.lang}) - {voice.localService ? 'Local' : 'Remote'}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="text-yellow-600 mb-2">No dedicated Finnish voices found.</p>
                  <p className="text-sm text-gray-600">Using default voice with fi-FI language setting.</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total voices available: {voices.length}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Test Controls */}
          {isSupported && (
            <div className="mb-6">
              <div className="flex gap-4">
                <button
                  onClick={speakAll}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔊 Test All Words
                </button>
                <button
                  onClick={() => speechSynthesis.cancel()}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  ⏹️ Stop
                </button>
              </div>
            </div>
          )}

          {/* Test Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testWords.map((word) => (
              <div key={word.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{word.finnish}</h3>
                  <WebSpeechTTS 
                    text={word.finnish}
                    language="fi-FI"
                    className="text-xl p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  />
                </div>
                <p className="text-gray-600 italic">{word.english}</p>
              </div>
            ))}
          </div>

          {/* Quality Assessment Guide */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">🎯 Quality Assessment</h2>
            <p className="text-gray-700 mb-2">Test the pronunciation quality:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>Good Finnish:</strong> Should sound natural, with proper Finnish vowel sounds</li>
              <li><strong>Poor Quality:</strong> English pronunciation rules applied to Finnish text</li>
              <li><strong>Compare:</strong> How does "kiitos" sound? Should be "KEE-tos" not "KAI-tos"</li>
              <li><strong>Note:</strong> Quality varies significantly between browsers and operating systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSpeechTestPage;