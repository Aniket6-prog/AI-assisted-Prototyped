import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Loader2, Target, Layout, CheckCircle2, AlertCircle } from 'lucide-react';
import { PrototypeConcept } from './types';

export default function App() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [concept, setConcept] = useState<PrototypeConcept | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError("");
    setConcept(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate concept');
      
      setConcept(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans tracking-tight">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        
        {/* Header */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-neutral-900 rounded-2xl shadow-xl shadow-neutral-900/10">
              <Sparkles className="w-8 h-8 text-neutral-100" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-neutral-900">AI Prototyper</h1>
              <p className="text-neutral-500 max-w-md">
                Describe your app idea in plain English, and our system will generate a structured product prototype.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleGenerate}
          className="bg-white rounded-3xl p-2 shadow-sm border border-neutral-200/60 flex items-center mb-16"
        >
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="E.g., A marketplace for renting camera gear locally..."
            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg text-neutral-900 placeholder:text-neutral-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={!idea.trim() || loading}
            className="flex items-center justify-center bg-neutral-900 text-white rounded-2xl px-6 py-4 font-medium transition-all hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Generate</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </motion.form>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center p-4 mb-16 rounded-2xl bg-red-50 text-red-700 border border-red-100">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {concept && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 to-neutral-500 mb-3">
                  {concept.title}
                </h2>
                <p className="text-xl text-neutral-600 font-medium">{concept.tagline}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-sm">
                  <div className="flex items-center text-neutral-900 mb-4">
                    <Target className="w-5 h-5 mr-3" />
                    <h3 className="font-semibold text-lg">Target Audience</h3>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">{concept.targetAudience}</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-sm">
                  <div className="flex items-center text-neutral-900 mb-4">
                    <Layout className="w-5 h-5 mr-3" />
                    <h3 className="font-semibold text-lg">Problem Solved</h3>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">{concept.problemSolved}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-sm">
                <h3 className="font-semibold text-lg mb-6 flex items-center text-neutral-900">
                  <Sparkles className="w-5 h-5 mr-3" /> Core Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {concept.coreFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-neutral-400 mr-3 shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-sm">
                <h3 className="font-semibold text-lg mb-6 flex items-center text-neutral-900">
                  <Layout className="w-5 h-5 mr-3" /> Suggested Architecture
                </h3>
                <div className="space-y-4">
                  {concept.suggestedScreens.map((screen, i) => (
                    <div key={i} className="py-4 border-b border-neutral-100 last:border-0 last:pb-0">
                      <h4 className="font-medium text-neutral-900 mb-1">{screen.name}</h4>
                      <p className="text-neutral-500 text-sm">{screen.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
