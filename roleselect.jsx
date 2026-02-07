import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function RoleSelect() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
              <Heart className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CareTales
            </h1>
          </div>
          <p className="text-sm text-slate-500">Who's using CareTales today?</p>
        </motion.div>

        {/* Role cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Kid Mode */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer"
            onClick={() => window.location.href = createPageUrl("KidOnboarding")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white rounded-3xl shadow-xl p-8 border-2 border-transparent group-hover:border-indigo-200 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl">
                  <Sparkles size={48} className="text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Kid Mode</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Start your adventure! Play games, read stories, and learn about your special day at the hospital.
                  </p>
                </div>
                <Button size="lg" className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                  Let's Go! 🚀
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer"
            onClick={() => window.location.href = createPageUrl("DashboardLogin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white rounded-3xl shadow-xl p-8 border-2 border-transparent group-hover:border-purple-200 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl">
                  <Users size={48} className="text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Parent/Doctor Dashboard</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View patient readiness, track anxiety trends, and get personalized talking points.
                  </p>
                </div>
                <Button size="lg" variant="outline" className="w-full rounded-xl border-2 border-purple-200 hover:bg-purple-50">
                  View Dashboard 📊
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = createPageUrl("Landing")}
            className="text-slate-400 hover:text-slate-600"
          >
            ← Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
