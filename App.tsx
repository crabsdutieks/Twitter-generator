import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { TweetGenerator } from "./TweetGenerator";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 parallax-bg">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 h-16 flex justify-between items-center px-6">
        <div className="flex items-center space-x-4">
          <div className="logo-3d w-10 h-10 rounded-xl flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white"
            >
              <path 
                d="M8 12L12 8L16 12M12 8V20" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M4 4H20" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold gradient-text tracking-tight">TweetCraft</h2>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 perspective-container">
        <Content />
      </main>

      {/* Toast notifications with enhanced dark theme */}
      <Toaster 
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(31, 41, 55, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            color: '#f3f4f6',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
          <div className="absolute inset-2 w-12 h-12 border-2 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Authenticated>
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16 floating-animation">
          <div className="relative inline-block">
            <h1 className="text-6xl font-black gradient-text mb-6 tracking-tight">
              TweetCraft
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50"></div>
          </div>
          <p className="text-2xl text-gray-300 mb-4 font-medium">
            Generate and improve your tweets with AI
          </p>
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/30"></div>
            <span className="font-medium">Welcome back, {loggedInUser?.email ?? "friend"}!</span>
          </div>
        </div>

        {/* Main Generator */}
        <TweetGenerator />
      </Authenticated>

      <Unauthenticated>
        {/* Enhanced Landing Page */}
        <div className="max-w-lg mx-auto text-center">
          <div className="glass-card p-10 floating-animation">
            <div className="logo-3d w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-white"
              >
                <path 
                  d="M8 12L12 8L16 12M12 8V20" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M4 4H20" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-black gradient-text mb-6 tracking-tight">
              TweetCraft
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-medium leading-relaxed">
              Generate and improve your tweets with AI
            </p>
            <div className="space-y-6 text-gray-400 text-sm mb-10">
              <div className="flex items-center space-x-4">
                <div className="feature-icon w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-400">✨</span>
                </div>
                <span className="font-medium">AI-powered tweet generation</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="feature-icon w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400">🚀</span>
                </div>
                <span className="font-medium">Improve existing tweets</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="feature-icon w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-pink-400">📚</span>
                </div>
                <span className="font-medium">Save and organize your tweets</span>
              </div>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
