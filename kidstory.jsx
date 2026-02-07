import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Wind, Heart, Smile, Menu } from "lucide-react";
import { createPageUrl } from "@/utils";
import { generateChapters, suggestNextStep, calculateReadiness, THEME_SETTINGS } from "@/components/caretales/MockAIEngine";
import StoryChapter from "@/components/caretales/StoryChapter";
import MoodSelector from "@/components/caretales/MoodSelector";
import BreathingGame from "@/components/caretales/BreathingGame";
import MaskPractice from "@/components/caretales/MaskPractice";
import MatchingGame from "@/components/caretales/MatchingGame";
import ReadinessMeter from "@/components/caretales/ReadinessMeter";
import BadgeDisplay from "@/components/caretales/BadgeDisplay";
import ThemeIcon from "@/components/caretales/ThemeIcon";
import ConfettiEffect from "@/components/caretales/ConfettiEffect";
import SafetyBanner from "@/components/caretales/SafetyBanner";

export default function KidStory() {
  const [patient, setPatient] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [showCalmTools, setShowCalmTools] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [confetti, setConfetti] = useState(0);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = () => {
    const patientId = localStorage.getItem("caretales_current_patient");
    if (!patientId) {
      window.location.href = createPageUrl("KidOnboarding");
      return;
    }

    const patients = JSON.parse(localStorage.getItem("caretales_patients") || "[]");
    const p = patients.find(pt => pt.id === patientId);
    if (!p) {
      window.location.href = createPageUrl("KidOnboarding");
      return;
    }

    setPatient(p);
    const generatedChapters = generateChapters(p);
    setChapters(generatedChapters);

    const nextChapter = generatedChapters.find(ch => !p.chapters_completed.includes(ch.id));
    setCurrentChapter(nextChapter || generatedChapters[0]);

    const allCheckIns = JSON.parse(localStorage.getItem("caretales_checkins") || "[]");
    setCheckIns(allCheckIns.filter(c => c.patient_id === patientId));
  };

  const savePatient = (updatedPatient) => {
    const patients = JSON.parse(localStorage.getItem("caretales_patients") || "[]");
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index >= 0) {
      patients[index] = updatedPatient;
      localStorage.setItem("caretales_patients", JSON.stringify(patients));
      setPatient(updatedPatient);
    }
  };

  const handleChapterChoice = (choice) => {
    if (!patient || !currentChapter) return;

    // Mark chapter complete
    const updated = {
      ...patient,
      chapters_completed: [...new Set([...patient.chapters_completed, currentChapter.id])]
    };

    // Award badges from choice
    let newBadges = [...(patient.badges || [])];
    if (choice.badge && !newBadges.includes(choice.badge)) {
      newBadges.push(choice.badge);
      setConfetti(prev => prev + 1);
    }

    // Story progression badges
    if (!newBadges.includes("Story Explorer") && updated.chapters_completed.length >= 1) {
      newBadges.push("Story Explorer");
      setConfetti(prev => prev + 1);
    }

    if (updated.chapters_completed.length >= 13 && !newBadges.includes("Adventure Complete")) {
      newBadges.push("Adventure Complete");
      setConfetti(prev => prev + 1);
    }

    updated.badges = newBadges;
    updated.readiness_score = calculateReadiness(updated, checkIns);

    if (updated.readiness_score >= 80 && !newBadges.includes("Brave Heart")) {
      updated.badges.push("Brave Heart");
      setConfetti(prev => prev + 1);
    }

    savePatient(updated);

    // Handle minigame or next chapter
    if (choice.minigame) {
      setActiveTool(choice.minigame);
      setShowCalmTools(true);
    } else if (choice.nextChapter) {
      const nextChap = chapters.find(ch => ch.id === choice.nextChapter);
      if (nextChap) {
        setTimeout(() => setCurrentChapter(nextChap), 500);
      }
    } else if (currentChapter.isCheckIn) {
      const nextChap = chapters.find(ch => ch.id === choice.nextChapter);
      if (nextChap) {
        setTimeout(() => setCurrentChapter(nextChap), 500);
      }
    }
  };

  const handleMoodSubmit = (moodData) => {
    if (!patient) return;

    const newCheckIn = {
      patient_id: patient.id,
      mood_level: moodData.mood_level,
      note: moodData.note,
      timestamp: new Date().toISOString(),
      chapter_context: currentChapter?.id || "unknown",
      ai_suggestion: suggestNextStep([...checkIns, { mood_level: moodData.mood_level }], patient).message
    };

    const allCheckIns = JSON.parse(localStorage.getItem("caretales_checkins") || "[]");
    allCheckIns.push(newCheckIn);
    localStorage.setItem("caretales_checkins", JSON.stringify(allCheckIns));
    setCheckIns([...checkIns, newCheckIn]);

    const updated = { ...patient, readiness_score: calculateReadiness(patient, [...checkIns, newCheckIn]) };
    savePatient(updated);

    setShowMoodCheck(false);
  };

  const handleToolComplete = (tool) => {
    if (!patient) return;

    const session = {
      tool,
      completed_at: new Date().toISOString(),
      duration_seconds: 120
    };

    const updated = {
      ...patient,
      calm_tools_used: [...patient.calm_tools_used, session]
    };

    let newBadges = [...(patient.badges || [])];
    if (tool === "breathing" && !newBadges.includes("Breathing Hero")) {
      newBadges.push("Breathing Hero");
      setConfetti(prev => prev + 1);
    }
    if (tool === "mask_practice" && !newBadges.includes("Mask Master")) {
      newBadges.push("Mask Master");
      setConfetti(prev => prev + 1);
    }
    if (tool === "matching" && !newBadges.includes("Match Genius")) {
      newBadges.push("Match Genius");
      setConfetti(prev => prev + 1);
    }

    if (updated.calm_tools_used.length >= 3 && !newBadges.includes("Calm Champion")) {
      newBadges.push("Calm Champion");
      setConfetti(prev => prev + 1);
    }

    updated.badges = newBadges;
    updated.readiness_score = calculateReadiness(updated, checkIns);

    savePatient(updated);
    setActiveTool(null);
    setShowCalmTools(false);
  };

  if (!patient || !currentChapter) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const theme = THEME_SETTINGS[patient.theme] || THEME_SETTINGS.space;
  const isChapterCompleted = patient.chapters_completed.includes(currentChapter.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <ConfettiEffect trigger={confetti} />

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = createPageUrl("RoleSelect")}
              className="rounded-xl"
            >
              <ArrowLeft size={16} />
            </Button>
            <div className="flex items-center gap-2">
              <ThemeIcon theme={patient.theme} size={20} />
              <span className="font-semibold text-slate-800">Hi, {patient.nickname}!</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ReadinessMeter score={patient.readiness_score} size="small" showLabel={false} />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Progress</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-3">Readiness</p>
                    <ReadinessMeter score={patient.readiness_score} size="large" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-3">Your Badges</p>
                    <BadgeDisplay badges={patient.badges} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-3">Chapters</p>
                    <div className="space-y-2">
                      {chapters.map(ch => (
                        <div
                          key={ch.id}
                          className={`flex items-center gap-2 text-sm ${
                            patient.chapters_completed.includes(ch.id) ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          <span>{patient.chapters_completed.includes(ch.id) ? "✅" : "⭕"}</span>
                          <span>{ch.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Fun header with theme character */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-3xl shadow-lg">
            <span className="text-3xl">{theme.emoji}</span>
            <div className="text-left">
              <p className="text-xs text-slate-500">Your guide:</p>
              <p className="font-bold text-slate-800">{theme.helper}</p>
            </div>
            <span className="text-2xl">👋</span>
          </div>
        </motion.div>

        <StoryChapter
          chapter={currentChapter}
          onChoice={handleChapterChoice}
          isCompleted={isChapterCompleted}
        />

        {/* Action buttons */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <Button
            onClick={() => setShowMoodCheck(true)}
            variant="outline"
            className="rounded-xl py-6 flex-col h-auto border-2"
          >
            <Smile size={24} className="mb-2 text-amber-500" />
            <span className="text-xs font-medium">How I Feel</span>
          </Button>
          <Button
            onClick={() => setShowCalmTools(true)}
            variant="outline"
            className="rounded-xl py-6 flex-col h-auto border-2"
          >
            <Heart size={24} className="mb-2 text-rose-500" />
            <span className="text-xs font-medium">Calm Tools</span>
          </Button>
          <Button
            onClick={() => {
              const nextChap = chapters.find(ch => !patient.chapters_completed.includes(ch.id));
              if (nextChap) setCurrentChapter(nextChap);
            }}
            variant="outline"
            className="rounded-xl py-6 flex-col h-auto border-2"
            disabled={patient.chapters_completed.length === 0}
          >
            <Wind size={24} className="mb-2 text-indigo-500" />
            <span className="text-xs font-medium">Next Chapter</span>
          </Button>
        </div>

        <div className="mt-6">
          <SafetyBanner compact />
        </div>
      </div>

      {/* Mood check dialog */}
      <Dialog open={showMoodCheck} onOpenChange={setShowMoodCheck}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Check In: How Are You Feeling?</DialogTitle>
          </DialogHeader>
          <MoodSelector onSubmit={handleMoodSubmit} />
        </DialogContent>
      </Dialog>

      {/* Calm tools sheet */}
      <Sheet open={showCalmTools} onOpenChange={setShowCalmTools}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Calm Tools</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {!activeTool ? (
              <div className="grid gap-3">
                <Button
                  onClick={() => setActiveTool("breathing")}
                  variant="outline"
                  className="justify-start py-6 rounded-xl border-2"
                >
                  <span className="text-2xl mr-3">🌬️</span>
                  <div className="text-left">
                    <p className="font-semibold">Breathing Exercise</p>
                    <p className="text-xs text-slate-500">Follow the orb and breathe</p>
                  </div>
                </Button>
                <Button
                  onClick={() => setActiveTool("mask")}
                  variant="outline"
                  className="justify-start py-6 rounded-xl border-2"
                >
                  <span className="text-2xl mr-3">😷</span>
                  <div className="text-left">
                    <p className="font-semibold">Mask Practice</p>
                    <p className="text-xs text-slate-500">Practice with the friendly mask</p>
                  </div>
                </Button>
                <Button
                  onClick={() => setActiveTool("matching")}
                  variant="outline"
                  className="justify-start py-6 rounded-xl border-2"
                >
                  <span className="text-2xl mr-3">🧩</span>
                  <div className="text-left">
                    <p className="font-semibold">IV Mystery Match</p>
                    <p className="text-xs text-slate-500">Learn what each tool does</p>
                  </div>
                </Button>
              </div>
            ) : (
              <>
                {activeTool === "breathing" && (
                  <BreathingGame onComplete={() => handleToolComplete("breathing")} />
                )}
                {activeTool === "mask" && (
                  <MaskPractice theme={patient.theme} onComplete={() => handleToolComplete("mask_practice")} />
                )}
                {activeTool === "matching" && (
                  <MatchingGame onComplete={() => handleToolComplete("matching")} />
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
