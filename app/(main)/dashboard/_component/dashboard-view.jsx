"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const DashboardView = ({ insights }) => {
  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-40 -z-10" />
        <div className="relative group">
          <div className="h-32 w-32 rounded-full border-t-4 border-primary border-r-4 border-r-transparent animate-spin" />
          <Brain className="h-16 w-16 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all" />
        </div>
        <div className="space-y-4 max-w-lg">
          <h2 className="text-4xl font-bold gradient-title tracking-tight">AI is Architecting Your Future...</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We're harvesting real-time market intelligence and tailoring insights for your unique trajectory.
          </p>
        </div>
        <div className="w-full max-w-md glass h-3 rounded-full overflow-hidden mt-4 ring-1 ring-white/10">
          <div className="bg-gradient-to-r from-primary via-purple-500 to-primary h-full animate-progress" style={{ width: "65%" }} />
        </div>
      </div>
    );
  }

  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high": return "from-green-500/80 to-green-600";
      case "medium": return "from-yellow-400 to-yellow-600";
      case "low": return "from-red-400 to-red-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive": return { icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" };
      case "neutral": return { icon: LineChart, color: "text-yellow-400", bg: "bg-yellow-500/10" };
      case "negative": return { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" };
      default: return { icon: LineChart, color: "text-gray-400", bg: "bg-gray-500/10" };
    }
  };

  const outlook = getMarketOutlookInfo(insights.marketOutlook);
  const OutlookIcon = outlook.icon;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-bold gradient-title">Industry Insights</h1>
          <p className="text-muted-foreground">Strategic market intelligence for your career path</p>
        </div>
        <Badge variant="outline" className="glass px-4 py-1 text-xs font-mono tracking-wider">
          SYNCED: {format(new Date(insights.lastUpdated), "HH:mm, dd MMM")}
        </Badge>
      </div>

      {/* Market Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Market Outlook
              </CardTitle>
              <div className={`p-2 rounded-lg ${outlook.bg}`}>
                 <OutlookIcon className={`h-4 w-4 ${outlook.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">{insights.marketOutlook}</div>
              <p className="text-xs text-muted-foreground">Next pulse {formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Growth Rate
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-3">{insights.growthRate.toFixed(1)}%</div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   className="h-full bg-primary" 
                   initial={{ width: 0 }}
                   animate={{ width: `${insights.growthRate}%` }}
                   transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Demand Level
              </CardTitle>
              <div className="p-2 rounded-lg bg-muted">
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-3">{insights.demandLevel}</div>
              <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${getDemandLevelColor(insights.demandLevel)} shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Core Skills
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/5 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {insights.topSkills.slice(0, 3).map((skill) => (
                  <Badge key={skill} className="bg-white/5 hover:bg-white/10 text-[10px] border-none">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Salary Ranges Chart */}
      <Card className="glass-card border-none shadow-3xl bg-card/20 overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <CardTitle className="text-2xl font-black tracking-tight">Salary Benchmarks</CardTitle>
          </div>
          <CardDescription className="text-base">Target role compensation benchmarks (Annual, in thousands)</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: "#94a3b8", fontSize: 12 }} 
                   dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: "#94a3b8", fontSize: 12 }} 
                   tickFormatter={(val) => `$${val}k`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass p-4 rounded-xl shadow-2xl space-y-2 min-w-[200px]">
                          <p className="font-black text-lg border-b border-white/10 pb-2 mb-2">{label}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Median:</span>
                              <span className="font-bold text-primary">${payload[1].value}k</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Range:</span>
                              <span className="font-medium">${payload[0].value}k - ${payload[2].value}k</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                   dataKey="min" 
                   fill="rgba(148, 163, 184, 0.2)" 
                   radius={[4, 4, 0, 0]} 
                   barSize={30}
                />
                <Bar 
                   dataKey="median" 
                   fill="hsl(var(--primary))" 
                   radius={[4, 4, 0, 0]} 
                   barSize={30}
                />
                <Bar 
                   dataKey="max" 
                   fill="rgba(148, 163, 184, 0.4)" 
                   radius={[4, 4, 0, 0]} 
                   barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Strategic Trends</CardTitle>
            </div>
            <CardDescription>Evolving market dynamics shaping your future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5"
                  whileHover={{ x: 5 }}
                >
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">{trend}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none bg-gradient-to-br from-card/40 to-primary/5">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Recommended Skills</CardTitle>
            </div>
            <CardDescription>Competitive edge skills for your industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {insights.recommendedSkills.map((skill) => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.1, rotate: 1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Badge 
                    variant="outline" 
                    className="glass py-2 px-4 text-sm font-medium hover:bg-primary hover:text-white transition-all cursor-pointer border-primary/20"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default DashboardView;
