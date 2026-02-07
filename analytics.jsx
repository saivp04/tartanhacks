import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, Heart, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { createPageUrl } from "@/utils";
import { calculateReadiness } from "@/components/caretales/MockAIEngine";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

export default function Analytics() {
  const [patients, setPatients] = useState([]);
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    const pts = JSON.parse(localStorage.getItem("caretales_patients") || "[]");
    const cks = JSON.parse(localStorage.getItem("caretales_checkins") || "[]");
    
    const ptsWithScores = pts.map(p => ({
      ...p,
      readiness_score: calculateReadiness(p, cks.filter(c => c.patient_id === p.id))
    }));

    setPatients(ptsWithScores);
    setCheckIns(cks);
  }, []);

  const readinessByAge = ["3-5", "6-8", "9-12"].map(age => {
    const agePatients = patients.filter(p => p.age_group === age);
    const avg = agePatients.length > 0
      ? agePatients.reduce((sum, p) => sum + p.readiness_score, 0) / agePatients.length
      : 0;
    return { age, readiness: Math.round(avg), count: agePatients.length };
  });

  const toolUsage = patients.reduce((acc, p) => {
    p.calm_tools_used.forEach(t => {
      const tool = t.tool;
      acc[tool] = (acc[tool] || 0) + 1;
    });
    return acc;
  }, {});

  const toolData = Object.entries(toolUsage).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  }));

  const themeDistribution = patients.reduce((acc, p) => {
    acc[p.theme] = (acc[p.theme] || 0) + 1;
    return acc;
  }, {});

  const themeData = Object.entries(themeDistribution).map(([name, value]) => ({ name, value }));

  const avgAnxietyImprovement = patients.map(p => {
    const pCheckIns = checkIns.filter(c => c.patient_id === p.id);
    if (pCheckIns.length < 2) return 0;
    const first = pCheckIns[0].mood_level;
    const last = pCheckIns[pCheckIns.length - 1].mood_level;
    return last - first;
  }).filter(v => v !== 0);

  const avgImprovement = avgAnxietyImprovement.length > 0
    ? avgAnxietyImprovement.reduce((a, b) => a + b, 0) / avgAnxietyImprovement.length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = createPageUrl("Dashboard")}
            className="rounded-xl"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Analytics Dashboard</h1>
            <p className="text-xs text-slate-500">Aggregate insights across all patients</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Users size={24} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Total Patients</p>
                <p className="text-2xl font-bold text-slate-800">{patients.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <TrendingUp size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Avg Improvement</p>
                <p className="text-2xl font-bold text-emerald-600">+{avgImprovement.toFixed(1)}</p>
                <p className="text-[10px] text-slate-400">mood points</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Heart size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Tool Sessions</p>
                <p className="text-2xl font-bold text-slate-800">
                  {patients.reduce((sum, p) => sum + p.calm_tools_used.length, 0)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Check-ins</p>
                <p className="text-2xl font-bold text-slate-800">{checkIns.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Readiness by Age Group</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={readinessByAge}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="age" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="readiness" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Used Calm Tools</CardTitle>
            </CardHeader>
            <CardContent>
              {toolData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={toolData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  No tool usage data yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {themeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={themeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {themeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  No theme data yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl">
                  <p className="text-sm font-medium text-indigo-900 mb-1">Most Common Fear</p>
                  <p className="text-xs text-indigo-600">
                    {(() => {
                      const fearCounts = patients.reduce((acc, p) => {
                        p.fear_triggers.forEach(f => {
                          acc[f] = (acc[f] || 0) + 1;
                        });
                        return acc;
                      }, {});
                      const mostCommon = Object.entries(fearCounts).sort((a, b) => b[1] - a[1])[0];
                      return mostCommon ? `${mostCommon[0].replace(/_/g, ' ')} (${mostCommon[1]} patients)` : "No data";
                    })()}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm font-medium text-emerald-900 mb-1">Completion Rate</p>
                  <p className="text-xs text-emerald-600">
                    {patients.filter(p => p.chapters_completed.length === 4).length} / {patients.length} patients completed all chapters
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm font-medium text-purple-900 mb-1">Engagement</p>
                  <p className="text-xs text-purple-600">
                    {patients.length > 0 ? (checkIns.length / patients.length).toFixed(1) : 0} avg check-ins per patient
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-xl text-center">
          <p className="text-xs text-slate-500">
            📊 All data is demo data stored locally for illustration purposes
          </p>
        </div>
      </div>
    </div>
  );
}
