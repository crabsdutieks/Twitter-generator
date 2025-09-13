import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { TweetHistory } from "./TweetHistory";

export function TweetGenerator() {
  const [activeTab, setActiveTab] = useState<"generate" | "improve">("generate");
  const [prompt, setPrompt] = useState("");
  const [originalTweet, setOriginalTweet] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [generatedTweet, setGeneratedTweet] = useState("");
  const [improvedTweet, setImprovedTweet] = useState("");

  const generateTweet = useAction(api.tweets.generateTweet);
  const improveTweet = useAction(api.tweets.improveTweet);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateTweet({ prompt: prompt.trim() });
      setGeneratedTweet(result);
      toast.success("Tweet generated successfully!");
    } catch (error) {
      toast.error("Failed to generate tweet. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalTweet.trim()) return;

    setIsImproving(true);
    try {
      const result = await improveTweet({ originalTweet: originalTweet.trim() });
      setImprovedTweet(result);
      toast.success("Tweet improved successfully!");
    } catch (error) {
      toast.error("Failed to improve tweet. Please try again.");
      console.error(error);
    } finally {
      setIsImproving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getCharacterCount = (text: string) => text.length;
  const getCharacterColor = (count: number) => {
    if (count > 280) return "text-red-400";
    if (count > 250) return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <div className="space-y-10">
      {/* Enhanced Tab Navigation */}
      <div className="flex space-x-3 bg-gray-800/30 p-3 rounded-2xl max-w-md mx-auto backdrop-blur-xl border border-gray-700/30">
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex-1 py-4 px-8 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === "generate" ? "tab-active" : "tab-inactive"
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>✨</span>
            <span>Generate</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab("improve")}
          className={`flex-1 py-4 px-8 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === "improve" ? "tab-active" : "tab-inactive"
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>🚀</span>
            <span>Improve</span>
          </span>
        </button>
      </div>

      {/* Generate Tweet Tab */}
      {activeTab === "generate" && (
        <div className="glass-card p-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-100 section-header">Generate Tweet</h2>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-8">
            <div>
              <label htmlFor="prompt" className="block text-sm font-bold text-gray-300 mb-4 tracking-wide">
                What would you like to tweet about?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., productivity tips, morning routine, latest tech trends..."
                className="input-field resize-none h-28 text-base leading-relaxed"
                disabled={isGenerating}
              />
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className={`btn-primary w-full text-base font-bold py-4 ${isGenerating ? 'pulse-glow' : ''}`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate Tweet"
              )}
            </button>
          </form>

          {generatedTweet && (
            <div className="mt-10 p-8 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/30 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-200 flex items-center space-x-3 text-lg">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Generated Tweet:</span>
                </h3>
                <span className={`character-counter ${getCharacterColor(getCharacterCount(generatedTweet))}`}>
                  {getCharacterCount(generatedTweet)}/280
                </span>
              </div>
              <p className="text-gray-100 mb-6 whitespace-pre-wrap leading-relaxed text-base">{generatedTweet}</p>
              <button
                onClick={() => copyToClipboard(generatedTweet)}
                className="btn-secondary flex items-center space-x-2 font-semibold"
              >
                <span>📋</span>
                <span>Copy to Clipboard</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Improve Tweet Tab */}
      {activeTab === "improve" && (
        <div className="glass-card p-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-100 section-header">Improve Tweet</h2>
          </div>
          
          <form onSubmit={handleImprove} className="space-y-8">
            <div>
              <label htmlFor="original" className="block text-sm font-bold text-gray-300 mb-4 tracking-wide">
                Paste your tweet to improve:
              </label>
              <div className="relative">
                <textarea
                  id="original"
                  value={originalTweet}
                  onChange={(e) => setOriginalTweet(e.target.value)}
                  placeholder="Paste your tweet here and I'll help make it more engaging..."
                  className="input-field resize-none h-36 pr-20 text-base leading-relaxed"
                  disabled={isImproving}
                />
                <div className={`absolute bottom-4 right-4 character-counter ${getCharacterColor(getCharacterCount(originalTweet))}`}>
                  {getCharacterCount(originalTweet)}/280
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!originalTweet.trim() || isImproving}
              className={`btn-primary w-full text-base font-bold py-4 ${isImproving ? 'pulse-glow' : ''}`}
            >
              {isImproving ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Improving...</span>
                </div>
              ) : (
                "Improve Tweet"
              )}
            </button>
          </form>

          {improvedTweet && (
            <div className="mt-10 space-y-6">
              <div className="p-8 bg-red-900/15 rounded-2xl border border-red-700/20 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-200 flex items-center space-x-3 text-lg">
                    <span className="text-red-400 text-xl">📝</span>
                    <span>Original:</span>
                  </h3>
                  <span className={`character-counter ${getCharacterColor(getCharacterCount(originalTweet))}`}>
                    {getCharacterCount(originalTweet)}/280
                  </span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">{originalTweet}</p>
              </div>
              
              <div className="p-8 bg-green-900/15 rounded-2xl border border-green-700/20 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-200 flex items-center space-x-3 text-lg">
                    <span className="text-green-400 text-xl">✨</span>
                    <span>Improved:</span>
                  </h3>
                  <span className={`character-counter ${getCharacterColor(getCharacterCount(improvedTweet))}`}>
                    {getCharacterCount(improvedTweet)}/280
                  </span>
                </div>
                <p className="text-gray-100 mb-6 whitespace-pre-wrap leading-relaxed text-base">{improvedTweet}</p>
                <button
                  onClick={() => copyToClipboard(improvedTweet)}
                  className="btn-secondary flex items-center space-x-2 font-semibold"
                >
                  <span>📋</span>
                  <span>Copy to Clipboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tweet History */}
      <TweetHistory />
    </div>
  );
}
