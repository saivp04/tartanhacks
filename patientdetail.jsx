import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Copy, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { createPageUrl } from "@/utils";
import { generateClinicalInsights, calculateReadiness } from "@/components/caretales/MockAIEngine";
import ReadinessMeter from "@/components/caretales/ReadinessMeter";
import BadgeDisplay from "@/components/caretales/BadgeDisplay";
import ThemeIcon from "@/components/caretales/ThemeIcon";
import { toast } from "sonner";

export default function PatientDetail() {
  const [patient, setPatient] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      window.location.href = createPageUrl("Dashboard");
      return;
    }

    const patients = JSON.parse(localStorage.getItem("caretales_patients") || "[]");
    const p = patients.find(pt => pt.id === id);
    if (!p) {
      window.location.href = createPageUrl("Dashboard");
      return;
    }

    const allCheckIns = JSON.parse(localStorage.getItem("caretales_checkins") || "[]");
    const patientCheckIns = allCheckIns.filter(c => c.patient_id === id);

    setPatient(p);
    setCheckIns(patientCheckIns);
    setInsights(generateClinicalInsights(p, patientCheckIns));
  }, []);

  const handleExport = () => {
    if (!patient || !insights) return;

    const summary = `
CareTales Preparation Summary
==============================
Patient: ${patient.nickname}
Age Group: ${patient.age_group}
Procedure: ${patient.procedure_type}
Theme: ${patient.theme}

Readiness Score: ${patient.readiness_score}%
Chapters Completed: ${patient.chapters_completed.length}/4
Calm Tools Used: ${patient.calm_tools_used.length}
Check-ins: ${checkIns.length}

FEAR TRIGGERS:
${patient.fear_triggers.map(f => `- ${f.replace(/_/g, ' ')}`).join('\n')}

SUGGESTED TALKING POINTS:
${insights.talkingPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

WHAT HELPED:
${insights.whatHelped.map(h => `- ${h}`).join('\n')}

AREAS NEEDING ATTENTION:
${insights.areasNeedingWork.map(a => `- ${a}`).join('\n')}

Mood Trend: ${insights.moodTrend}
Average Anxiety Level: ${insights.avgAnxiety.toFixed(1)}/4

Generated: ${new Date().toLocaleString()}
    `.trim();

    navigator.clipboard.writeText(summary);
    toast.success("Summary copied to clipboard!");
  };

  if (!patient || !insights) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const chartData = checkIns.map((c, i) => ({
    index: i + 1,
    mood: c.mood_level,
    timestamp: new Date(c.timestamp).toLocaleDateString()
  }));

  const readinessBreakdown = [
    { label: "Chapters", value: (patient.chapters_completed.length / 4) * 50, max: 50 },
    { label: "Calm Tools", value: Math.min(patient.calm_tools_used.length / 3, 1) * 25, max: 25 },
    { label: "Anxiety Trend", value: patient.readiness_score - ((patient.chapters_completed.length / 4) * 50) - (Math.min(patient.calm_tools_used.length / 3, 1) * 25), max: 25 }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = createPageUrl("Dashboard")}
              className="rounded-xl"
            >
              <ArrowLeft size={16} />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">{patient.nickname}</h1>
                <ThemeIcon theme={patient.theme} size={20} />
              </div>
              <p className="text-xs text-slate-500">
                Age {patient.age_group} • {patient.procedure_type}
                {patient.is_demo && " • DEMO DATA"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="rounded-xl"
            >
              <Copy size={14} className="mr-1.5" />
              Copy Summary
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Readiness */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Readiness Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ReadinessMeter score={patient.readiness_score} size="large" />
                
                <div className="w-full mt-6 space-y-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Breakdown</p>
                  {readinessBreakdown.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-medium text-slate-800">{Math.round(item.value)}/{item.max}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / item.max) * 100}%` }}
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeDisplay badges={patient.badges} />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="insights" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="anxiety">Anxiety Trend</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      💬 Suggested Talking Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insights.talkingPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-indigo-500 font-bold shrink-0">{i + 1}.</span>
                          <span className="text-sm text-slate-600">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle size={20} className="text-amber-500" />
                      Areas Needing Extra Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insights.areasNeedingWork.map((area, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-amber-500">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      ✅ What Helped
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insights.whatHelped.map((help, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-emerald-500">•</span>
                          <span>{help}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Next Step</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      {insights.recommendedNextModule === "calm_tools" && "Encourage use of calm tools to manage anxiety"}
                      {insights.recommendedNextModule === "review_completed" && "Review completed chapters and celebrate progress"}
                      {!["calm_tools", "review_completed"].includes(insights.recommendedNextModule) && `Continue with "${insights.recommendedNextModule}" chapter`}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="anxiety">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mood Check-in Trend</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">
                      1 = Very anxious, 4 = Happy • Trend: {insights.moodTrend}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {checkIns.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="index" label={{ value: "Check-in #", position: "insideBottom", offset: -5 }} />
                            <YAxis domain={[1, 4]} ticks={[1, 2, 3, 4]} />
                            <Tooltip
                              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                              labelFormatter={(val) => `Check-in ${val}`}
                            />
                            <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                          </LineChart>
                        </ResponsiveContainer>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 mb-1">Latest Mood</p>
                            <p className="text-2xl font-bold text-slate-800">{checkIns[checkIns.length - 1]?.mood_level}/4</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 mb-1">Average</p>
                            <p className="text-2xl font-bold text-slate-800">{insights.avgAnxiety.toFixed(1)}/4</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        No check-in data yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Story Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["preop", "anesthesia", "operation", "recovery"].map((chapter, i) => {
                          const completed = patient.chapters_completed.includes(chapter);
                          return (
                            <div key={chapter} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                completed ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                              }`}>
                                {completed ? "✓" : i + 1}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${completed ? "text-slate-800" : "text-slate-400"}`}>
                                  {chapter.charAt(0).toUpperCase() + chapter.slice(1)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Calm Tools Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {patient.calm_tools_used.length > 0 ? (
                        <div className="space-y-2">
                          {patient.calm_tools_used.map((tool, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                              <span className="text-sm font-medium text-slate-700">{tool.tool.replace(/_/g, ' ')}</span>
                              <span className="text-xs text-slate-400">{new Date(tool.completed_at).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 text-center py-4">No calm tools used yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fear Triggers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {patient.fear_triggers.map(fear => (
                          <span key={fear} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-xl border border-amber-200">
                            {fear.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {patient.fear_triggers.length === 0 && (
                          <p className="text-sm text-slate-400">No specific fears identified</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
