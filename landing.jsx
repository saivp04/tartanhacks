import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import SafetyBanner from "@/components/caretales/SafetyBanner";

export default function Landing() {
  const seedDemoData = () => {
    const demoPatients = [
      {
        id: "demo-1",
        nickname: "Luna",
        age_group: "6-8",
        procedure_type: "tonsillectomy",
        theme: "space",
        fear_triggers: ["mask", "needles"],
        coping_preferences: ["breathing", "story"],
        chapters_completed: ["preop", "anesthesia"],
        calm_tools_used: [
          { tool: "breathing", completed_at: new Date(Date.now() - 86400000).toISOString(), duration_seconds: 120 },
          { tool: "mask_practice", completed_at: new Date(Date.now() - 43200000).toISOString(), duration_seconds: 90 }
        ],
        badges: ["Breathing Hero", "Mask Master", "Story Explorer"],
        readiness_score: 58,
        is_demo: true,
        created_date: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: "demo-2",
        nickname: "Max",
        age_group: "9-12",
        procedure_type: "adenoidectomy",
        theme: "superhero",
        fear_triggers: ["pain", "being_away_from_parent"],
        coping_preferences: ["counting", "music"],
        chapters_completed: ["preop", "anesthesia", "operation", "recovery"],
        calm_tools_used: [
          { tool: "breathing", completed_at: new Date(Date.now() - 259200000).toISOString(), duration_seconds: 120 },
          { tool: "matching", completed_at: new Date(Date.now() - 172800000).toISOString(), duration_seconds: 180 },
          { tool: "breathing", completed_at: new Date(Date.now() - 86400000).toISOString(), duration_seconds: 120 }
        ],
        badges: ["Breathing Hero", "Match Genius", "Story Explorer", "Adventure Complete", "Brave Heart"],
        readiness_score: 92,
        is_demo: true,
        created_date: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: "demo-3",
        nickname: "Sophie",
        age_group: "3-5",
        procedure_type: "tonsillectomy",
        theme: "animals",
        fear_triggers: ["mask", "being_away_from_parent"],
        coping_preferences: ["breathing", "story"],
        chapters_completed: ["preop"],
        calm_tools_used: [],
        badges: ["Story Explorer"],
        readiness_score: 22,
        is_demo: true,
        created_date: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    const demoCheckIns = [
      { patient_id: "demo-1", mood_level: 2, timestamp: new Date(Date.now() - 172800000).toISOString(), chapter_context: "preop", ai_suggestion: "Try the breathing exercise" },
      { patient_id: "demo-1", mood_level: 3, timestamp: new Date(Date.now() - 86400000).toISOString(), chapter_context: "anesthesia", ai_suggestion: "Practice with the mask" },
      { patient_id: "demo-1", mood_level: 3, timestamp: new Date(Date.now() - 43200000).toISOString(), chapter_context: "anesthesia", ai_suggestion: "Continue to next chapter" },
      { patient_id: "demo-2", mood_level: 2, timestamp: new Date(Date.now() - 345600000).toISOString(), chapter_context: "preop", ai_suggestion: "Try calm tools" },
      { patient_id: "demo-2", mood_level: 3, timestamp: new Date(Date.now() - 259200000).toISOString(), chapter_context: "anesthesia", ai_suggestion: "Continue story" },
      { patient_id: "demo-2", mood_level: 3, timestamp: new Date(Date.now() - 172800000).toISOString(), chapter_context: "operation", ai_suggestion: "Doing great!" },
      { patient_id: "demo-2", mood_level: 4, timestamp: new Date(Date.now() - 86400000).toISOString(), chapter_context: "recovery", ai_suggestion: "Celebrate success" },
      { patient_id: "demo-3", mood_level: 1, timestamp: new Date(Date.now() - 86400000).toISOString(), chapter_context: "preop", ai_suggestion: "Try breathing exercise" },
      { patient_id: "demo-3", mood_level: 2, timestamp: new Date(Date.now() - 43200000).toISOString(), chapter_context: "preop", ai_suggestion: "Use calm tools" }
    ];

    localStorage.setItem("caretales_patients", JSON.stringify(demoPatients));
    localStorage.setItem("caretales_checkins", JSON.stringify(demoCheckIns));
    
    return true;
  };

  const handleStartDemo = () => {
    seedDemoData();
    window.location.href = createPageUrl("RoleSelect");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
              <Heart className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CareTales
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Preparing children for surgery through AI-powered stories and calming mini-games
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-sky-200/30 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Making surgery less scary, one story at a time
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                CareTales uses personalized adventure stories and interactive games to help children understand and prepare for their surgical experience, reducing anxiety for both kids and parents.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={handleStartDemo}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-200/50"
                >
                  <Sparkles size={18} className="mr-2" />
                  Start Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = createPageUrl("RoleSelect")}
                  className="rounded-xl border-2"
                >
                  <ArrowRight size={18} className="mr-2" />
                  Continue
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🚀", label: "4 Themes", color: "from-indigo-100 to-indigo-50" },
                { icon: "🎮", label: "3 Calm Games", color: "from-purple-100 to-purple-50" },
                { icon: "📖", label: "4 Chapters", color: "from-pink-100 to-pink-50" },
                { icon: "📊", label: "Real-time Insights", color: "from-amber-100 to-amber-50" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-center`}
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-100 hover:border-indigo-200 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl shrink-0">
                <Heart size={24} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">For Kids</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Interactive stories, breathing exercises, mask practice, and matching games — all personalized to your child's age, fears, and interests.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100 hover:border-purple-200 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-xl shrink-0">
                <Users size={24} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">For Parents & Clinicians</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Track readiness scores, anxiety trends, and get AI-powered talking points to address specific fears and prepare together.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Safety banner */}
        <SafetyBanner />

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-slate-400">
          <p>Demo version — All data stored locally • No real patient information</p>
        </div>
      </div>
    </div>
  );
}
