import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { createPageUrl } from "@/utils";
import ThemeIcon from "@/components/caretales/ThemeIcon";
import SafetyBanner from "@/components/caretales/SafetyBanner";

const STEPS = ["welcome", "profile", "fears", "theme"];

const AGE_GROUPS = [
  { value: "3-5", label: "3-5 years", emoji: "🐣" },
  { value: "6-8", label: "6-8 years", emoji: "🦋" },
  { value: "9-12", label: "9-12 years", emoji: "🦅" }
];

const PROCEDURES = [
  { value: "tonsillectomy", label: "Tonsillectomy (tonsils)" },
  { value: "adenoidectomy", label: "Adenoidectomy (adenoids)" },
  { value: "other", label: "Other procedure" }
];

const THEMES = [
  { value: "space", label: "Space Adventure", description: "Explore the cosmos!" },
  { value: "animals", label: "Animal Friends", description: "Meet forest creatures" },
  { value: "superhero", label: "Superhero Mission", description: "Save the day!" },
  { value: "fantasy", label: "Fantasy Quest", description: "Magical journey" }
];

const FEARS = [
  { id: "mask", label: "The breathing mask", emoji: "😷" },
  { id: "needles", label: "Needles or IV", emoji: "💉" },
  { id: "being_away_from_parent", label: "Being away from my parent", emoji: "👨‍👩‍👧" },
  { id: "pain", label: "Pain or feeling uncomfortable", emoji: "😣" }
];

const COPING = [
  { id: "breathing", label: "Deep breathing", emoji: "🌬️" },
  { id: "counting", label: "Counting or distraction", emoji: "🔢" },
  { id: "story", label: "Stories and imagination", emoji: "📖" },
  { id: "music", label: "Music and sounds", emoji: "🎵" }
];

export default function KidOnboarding() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    nickname: "",
    age_group: "",
    procedure_type: "tonsillectomy",
    theme: "",
    fear_triggers: [],
    coping_preferences: []
  });

  const currentStep = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = () => {
    const newPatient = {
      id: `patient-${Date.now()}`,
      ...profile,
      chapters_completed: [],
      calm_tools_used: [],
      badges: [],
      readiness_score: 0,
      is_demo: false,
      created_date: new Date().toISOString()
    };

    const patients = JSON.parse(localStorage.getItem("caretales_patients") || "[]");
    patients.push(newPatient);
    localStorage.setItem("caretales_patients", JSON.stringify(patients));
    localStorage.setItem("caretales_current_patient", newPatient.id);

    window.location.href = createPageUrl("KidStory");
  };

  const toggleFear = (fearId) => {
    setProfile(p => ({
      ...p,
      fear_triggers: p.fear_triggers.includes(fearId)
        ? p.fear_triggers.filter(f => f !== fearId)
        : [...p.fear_triggers, fearId]
    }));
  };

  const toggleCoping = (copingId) => {
    setProfile(p => ({
      ...p,
      coping_preferences: p.coping_preferences.includes(copingId)
        ? p.coping_preferences.filter(c => c !== copingId)
        : [...p.coping_preferences, copingId]
    }));
  };

  const canProceed = () => {
    if (currentStep === "profile") return profile.nickname && profile.age_group;
    if (currentStep === "theme") return profile.theme;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Let's Get Ready Together!</h1>
          <div className="flex justify-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  i <= step ? "bg-indigo-500 w-12" : "bg-slate-200 w-8"
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                {currentStep === "welcome" && (
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">👋</div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome!</h2>
                    <p className="text-slate-600 leading-relaxed">
                      We're going to create a special adventure story just for you! It will help you learn about your visit to the hospital in a fun way.
                    </p>
                    <p className="text-sm text-slate-500">
                      This will take just a few minutes, and you can ask a grown-up for help anytime.
                    </p>
                  </div>
                )}

                {currentStep === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 mb-4">Tell us about you</h2>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">What should we call you?</Label>
                          <Input
                            value={profile.nickname}
                            onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                            placeholder="Your nickname..."
                            className="mt-2 rounded-xl"
                          />
                          <p className="text-xs text-slate-400 mt-1">Just a nickname — not your real name!</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-3 block">How old are you?</Label>
                          <div className="grid grid-cols-3 gap-3">
                            {AGE_GROUPS.map(age => (
                              <button
                                key={age.value}
                                onClick={() => setProfile({ ...profile, age_group: age.value })}
                                className={`p-4 rounded-xl border-2 transition-all text-center ${
                                  profile.age_group === age.value
                                    ? "border-indigo-400 bg-indigo-50 shadow-md"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div className="text-2xl mb-1">{age.emoji}</div>
                                <div className="text-xs font-medium text-slate-700">{age.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-3 block">What are you having done?</Label>
                          <div className="space-y-2">
                            {PROCEDURES.map(proc => (
                              <button
                                key={proc.value}
                                onClick={() => setProfile({ ...profile, procedure_type: proc.value })}
                                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                                  profile.procedure_type === proc.value
                                    ? "border-indigo-400 bg-indigo-50"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <span className="text-sm font-medium text-slate-700">{proc.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "fears" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">What makes you worried?</h2>
                      <p className="text-sm text-slate-500 mb-4">
                        It's okay to feel worried! Tap anything that makes you a little nervous.
                      </p>
                      <div className="space-y-3">
                        {FEARS.map(fear => (
                          <button
                            key={fear.id}
                            onClick={() => toggleFear(fear.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                              profile.fear_triggers.includes(fear.id)
                                ? "border-amber-300 bg-amber-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Checkbox
                              checked={profile.fear_triggers.includes(fear.id)}
                              className="pointer-events-none"
                            />
                            <span className="text-2xl">{fear.emoji}</span>
                            <span className="text-sm font-medium text-slate-700">{fear.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-2">What helps you feel calm?</h2>
                      <div className="space-y-3">
                        {COPING.map(cope => (
                          <button
                            key={cope.id}
                            onClick={() => toggleCoping(cope.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                              profile.coping_preferences.includes(cope.id)
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Checkbox
                              checked={profile.coping_preferences.includes(cope.id)}
                              className="pointer-events-none"
                            />
                            <span className="text-2xl">{cope.emoji}</span>
                            <span className="text-sm font-medium text-slate-700">{cope.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "theme" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">Pick your adventure!</h2>
                      <p className="text-sm text-slate-500 mb-4">
                        Choose a theme for your story — it will make learning more fun!
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {THEMES.map(theme => (
                          <button
                            key={theme.value}
                            onClick={() => setProfile({ ...profile, theme: theme.value })}
                            className={`p-6 rounded-2xl border-2 transition-all text-center ${
                              profile.theme === theme.value
                                ? "border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <ThemeIcon theme={theme.value} size={32} className="mx-auto mb-2" />
                            <p className="font-semibold text-slate-800 text-sm mb-1">{theme.label}</p>
                            <p className="text-xs text-slate-500">{theme.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="rounded-xl"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded-xl bg-indigo-500 hover:bg-indigo-600"
          >
            {step === STEPS.length - 1 ? (
              <>
                <Sparkles size={16} className="mr-2" />
                Start Adventure!
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-8">
          <SafetyBanner compact />
        </div>
      </div>
    </div>
  );
}
