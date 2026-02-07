import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Filter, TrendingUp, LogOut, BarChart3 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { calculateReadiness } from "@/components/caretales/MockAIEngine";
import ReadinessMeter from "@/components/caretales/ReadinessMeter";
import BadgeDisplay from "@/components/caretales/BadgeDisplay";
import ThemeIcon from "@/components/caretales/ThemeIcon";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAge, setFilterAge] = useState("all");

  useEffect(() => {
    const auth = localStorage.getItem("caretales_dashboard_auth");
    if (!auth) {
      window.location.href = createPageUrl("DashboardLogin");
      return;
    }

    loadData();
  }, []);

  const loadData = () => {
    const pts = JSON.parse(localStorage.getItem("caretales_patients") || "[]");
    const cks = JSON.parse(localStorage.getItem("caretales_checkins") || "[]");
    
    const patientsWithScores = pts.map(p => ({
      ...p,
      readiness_score: calculateReadiness(p, cks.filter(c => c.patient_id === p.id))
    }));

    setPatients(patientsWithScores);
    setCheckIns(cks);
  };

  const handleLogout = () => {
    localStorage.removeItem("caretales_dashboard_auth");
    window.location.href = createPageUrl("DashboardLogin");
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = filterAge === "all" || p.age_group === filterAge;
    return matchesSearch && matchesAge;
  });

  const avgReadiness = patients.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + p.readiness_score, 0) / patients.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">CareTales Dashboard</h1>
              <p className="text-xs text-slate-500">Patient Preparation Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = createPageUrl("Analytics")}
              className="rounded-xl"
            >
              <BarChart3 size={16} className="mr-1.5" />
              Analytics
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl text-slate-500"
            >
              <LogOut size={16} className="mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-slate-800">{patients.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">Avg Readiness</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-slate-800">{avgReadiness}%</p>
                {avgReadiness >= 70 && <TrendingUp size={18} className="text-emerald-500" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">Check-ins Today</p>
              <p className="text-3xl font-bold text-slate-800">
                {checkIns.filter(c => new Date(c.timestamp).toDateString() === new Date().toDateString()).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">Fully Ready</p>
              <p className="text-3xl font-bold text-emerald-600">
                {patients.filter(p => p.readiness_score >= 80).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by nickname..."
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterAge === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterAge("all")}
                  className="rounded-xl"
                >
                  All Ages
                </Button>
                <Button
                  variant={filterAge === "3-5" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterAge("3-5")}
                  className="rounded-xl"
                >
                  3-5
                </Button>
                <Button
                  variant={filterAge === "6-8" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterAge("6-8")}
                  className="rounded-xl"
                >
                  6-8
                </Button>
                <Button
                  variant={filterAge === "9-12" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterAge("9-12")}
                  className="rounded-xl"
                >
                  9-12
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="grid gap-4">
          {filteredPatients.map((patient, i) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-indigo-200"
                onClick={() => window.location.href = `${createPageUrl("PatientDetail")}?id=${patient.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <ReadinessMeter score={patient.readiness_score} size="small" showLabel={false} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-800">{patient.nickname}</h3>
                        <ThemeIcon theme={patient.theme} size={16} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Age: {patient.age_group}</span>
                        <span>•</span>
                        <span>{patient.procedure_type}</span>
                        <span>•</span>
                        <span>Chapters: {patient.chapters_completed.length}/4</span>
                        {patient.is_demo && (
                          <>
                            <span>•</span>
                            <span className="text-amber-500 font-medium">DEMO</span>
                          </>
                        )}
                      </div>
                      {patient.badges && patient.badges.length > 0 && (
                        <div className="mt-2">
                          <BadgeDisplay badges={patient.badges.slice(0, 3)} compact />
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-slate-800">{patient.readiness_score}%</p>
                      <p className="text-xs text-slate-400">Readiness</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No patients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
