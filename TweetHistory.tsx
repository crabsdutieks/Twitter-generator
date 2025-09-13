import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Doc } from "../convex/_generated/dataModel";

export function TweetHistory() {
  const tweets = useQuery(api.tweets.getUserTweets) || [];
  const toggleFavorite = useMutation(api.tweets.toggleFavorite);
  const deleteTweet = useMutation(api.tweets.deleteTweet);

  const handleToggleFavorite = async (tweetId: string) => {
    try {
      await toggleFavorite({ tweetId: tweetId as any });
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  const handleDelete = async (tweetId: string) => {
    if (!confirm("Are you sure you want to delete this tweet?")) return;
    
    try {
      await deleteTweet({ tweetId: tweetId as any });
      toast.success("Tweet deleted successfully");
    } catch (error) {
      toast.error("Failed to delete tweet");
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

  if (tweets.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <div className="feature-icon w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📝</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-200 mb-4 section-header">Your Tweet History</h2>
        <p className="text-gray-400 text-lg">
          No tweets generated yet. Create your first tweet above!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-10">
      <div className="flex items-center space-x-4 mb-10">
        <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-200 section-header">Your Tweet History</h2>
        <div className="flex-1"></div>
        <span className="text-sm text-gray-400 bg-gray-700/30 px-4 py-2 rounded-full font-semibold backdrop-blur-sm border border-gray-600/30">
          {tweets.length} tweet{tweets.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid gap-8">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet._id}
            tweet={tweet}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onCopy={copyToClipboard}
            getCharacterCount={getCharacterCount}
            getCharacterColor={getCharacterColor}
          />
        ))}
      </div>
    </div>
  );
}

interface TweetCardProps {
  tweet: Doc<"tweets">;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (text: string) => void;
  getCharacterCount: (text: string) => number;
  getCharacterColor: (count: number) => string;
}

function TweetCard({ 
  tweet, 
  onToggleFavorite, 
  onDelete, 
  onCopy, 
  getCharacterCount, 
  getCharacterColor 
}: TweetCardProps) {
  return (
    <div className="tweet-card">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <span className={tweet.type === "generated" ? "status-badge-generated" : "status-badge-improved"}>
            {tweet.type === "generated" ? "✨ Generated" : "🚀 Improved"}
          </span>
          <span className="text-xs text-gray-400 bg-gray-700/30 px-3 py-1.5 rounded-lg font-medium backdrop-blur-sm border border-gray-600/20">
            {new Date(tweet._creationTime).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleFavorite(tweet._id)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              tweet.isFavorite 
                ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 shadow-lg shadow-yellow-400/20" 
                : "text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50"
            }`}
            title={tweet.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {tweet.isFavorite ? "⭐" : "☆"}
          </button>
          <button
            onClick={() => onDelete(tweet._id)}
            className="p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
            title="Delete tweet"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Prompt */}
      {tweet.prompt && (
        <div className="mb-6 p-6 bg-gray-700/20 rounded-xl border border-gray-600/20 backdrop-blur-sm">
          <span className="text-sm font-bold text-gray-300 flex items-center space-x-2">
            <span>💡</span>
            <span>Prompt:</span>
          </span>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">{tweet.prompt}</p>
        </div>
      )}

      {/* Original Tweet */}
      {tweet.originalTweet && (
        <div className="mb-6 p-6 bg-red-900/10 rounded-xl border border-red-700/15 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-bold text-gray-300 flex items-center space-x-2">
              <span className="text-red-400">📝</span>
              <span>Original:</span>
            </span>
            <span className={`character-counter ${getCharacterColor(getCharacterCount(tweet.originalTweet))}`}>
              {getCharacterCount(tweet.originalTweet)}/280
            </span>
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{tweet.originalTweet}</p>
        </div>
      )}

      {/* Generated/Improved Tweet */}
      <div className="p-6 bg-gradient-to-r from-gray-800/20 to-gray-700/20 rounded-xl border border-gray-600/20 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-200 flex items-center space-x-2">
            <span className={tweet.type === "generated" ? "text-blue-400" : "text-green-400"}>
              {tweet.type === "generated" ? "✨" : "🚀"}
            </span>
            <span>{tweet.type === "generated" ? "Generated:" : "Improved:"}</span>
          </span>
          <span className={`character-counter ${getCharacterColor(getCharacterCount(tweet.generatedTweet))}`}>
            {getCharacterCount(tweet.generatedTweet)}/280
          </span>
        </div>
        <p className="text-gray-100 mb-6 whitespace-pre-wrap leading-relaxed text-base">{tweet.generatedTweet}</p>
        <button
          onClick={() => onCopy(tweet.generatedTweet)}
          className="btn-secondary flex items-center space-x-2 text-sm font-semibold"
        >
          <span>📋</span>
          <span>Copy to Clipboard</span>
        </button>
      </div>
    </div>
  );
}
