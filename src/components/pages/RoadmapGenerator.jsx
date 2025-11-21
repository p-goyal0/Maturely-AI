import { Navigation } from "../shared/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Download, Calendar, Users, DollarSign, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function RoadmapGenerator() {
  const navigate = useNavigate();
  const timelinePhases = [
    { phase: "Foundation", period: "0-3 Months", color: "from-blue-500 to-cyan-400", initiatives: [ { title: "Establish AI Governance Framework", description: "Define policies, roles, and decision-making processes", resources: "Governance team, legal", budget: "$50K", priority: "Critical" }, { title: "Launch AI Literacy Program", description: "Foundational training for all stakeholders", resources: "L&D team, external trainers", budget: "$75K", priority: "High" }, { title: "Data Quality Assessment", description: "Audit current data infrastructure and identify gaps", resources: "Data team, consultants", budget: "$40K", priority: "High" } ] },
    { phase: "Acceleration", period: "3-12 Months", color: "from-purple-500 to-pink-400", initiatives: [ { title: "Deploy AI Platform Infrastructure", description: "Implement MLOps tools and scalable AI infrastructure", resources: "Engineering, DevOps", budget: "$200K", priority: "Critical" }, { title: "Pilot Use Case Implementation", description: "Launch 2-3 high-impact AI pilots in key business areas", resources: "Cross-functional teams", budget: "$150K", priority: "High" }, { title: "Advanced Skills Development", description: "Specialized training for data scientists and engineers", resources: "Technical teams", budget: "$100K", priority: "Medium" }, { title: "Establish ROI Metrics Framework", description: "Define KPIs and measurement systems for AI initiatives", resources: "Analytics team", budget: "$30K", priority: "High" } ] },
    { phase: "Scale & Optimize", period: "1-3 Years", color: "from-cyan-500 to-blue-500", initiatives: [ { title: "Enterprise-wide AI Deployment", description: "Scale successful pilots across the organization", resources: "All business units", budget: "$500K+", priority: "Critical" }, { title: "AI Center of Excellence", description: "Establish centralized AI competency center", resources: "Dedicated AI team", budget: "$300K", priority: "High" }, { title: "Advanced Analytics Capabilities", description: "Implement predictive and prescriptive analytics", resources: "Data science team", budget: "$250K", priority: "Medium" }, { title: "Continuous Improvement Program", description: "Ongoing optimization and model retraining", resources: "MLOps team", budget: "$150K/year", priority: "Medium" } ] },
  ];

  const milestones = [ { quarter: "Q1", achievement: "Governance established" }, { quarter: "Q2", achievement: "First pilot launched" }, { quarter: "Q3", achievement: "Platform deployed" }, { quarter: "Q4", achievement: "3 use cases in production" }, { quarter: "Q5", achievement: "CoE operational" }, { quarter: "Q6", achievement: "Enterprise-wide adoption" } ];

  const keyMetrics = [ { label: "Total Budget", value: "$1.4M", icon: DollarSign }, { label: "Timeline", value: "18 months", icon: Calendar }, { label: "Resources Required", value: "50+ FTEs", icon: Users }, { label: "Expected ROI", value: "250%", icon: Target } ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl mb-4 font-bold text-slate-100">AI Transformation Roadmap</h1>
                <p className="text-lg text-slate-300">Strategic plan with prioritized initiatives and clear milestones</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"><Download className="mr-2" />Export Roadmap</Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-4 gap-6 mb-12">
            {keyMetrics.map((metric, index) => { const Icon = metric.icon; return (<Card key={index} className="glass-light border-slate-700/50"><CardHeader><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><Icon className="w-5 h-5 text-white" /></div><CardDescription className="text-slate-400">{metric.label}</CardDescription></div><CardTitle className="text-3xl text-slate-100">{metric.value}</CardTitle></CardHeader></Card>); })}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <Card className="glass-light border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-100">Key Milestones</CardTitle>
                <CardDescription className="text-slate-300">Critical checkpoints throughout your transformation journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hidden md:block" />
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="relative"><div className="flex flex-col items-center text-center"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-3 relative z-10 glow-primary"><CheckCircle2 className="w-6 h-6 text-white" /></div><Badge className="mb-2 bg-blue-500/10 text-blue-400 border-blue-500/20">{milestone.quarter}</Badge><p className="text-sm text-slate-400">{milestone.achievement}</p></div></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-12">
            {timelinePhases.map((phase, phaseIndex) => (
              <motion.div key={phaseIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + phaseIndex * 0.1 }}>
                <div className="mb-6"><div className="flex items-center gap-4 mb-2"><div className={`w-2 h-2 rounded-full bg-gradient-to-r ${phase.color}`} /><h2 className="text-3xl font-bold text-slate-100">{phase.phase}</h2><Badge className="bg-white/5 text-slate-300 border-slate-700/50">{phase.period}</Badge></div></div>

                <div className="grid lg:grid-cols-2 gap-6">{phase.initiatives.map((initiative, initIndex) => (<Card key={initIndex} className="glass-light border-slate-700/50 hover:border-blue-500/50 card-hover"><CardHeader><div className="flex items-start justify-between mb-3"><div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center`}><span className="text-white text-lg">{initIndex + 1}</span></div><Badge className={getPriorityColor(initiative.priority)}>{initiative.priority}</Badge></div><CardTitle className="text-xl mb-2 text-slate-100">{initiative.title}</CardTitle><CardDescription className="text-base text-slate-300">{initiative.description}</CardDescription></CardHeader><CardContent><div className="space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-slate-400">Resources:</span><span className="text-slate-200">{initiative.resources}</span></div><div className="flex items-center justify-between text-sm"><span className="text-slate-400">Budget:</span><span className="text-cyan-400">{initiative.budget}</span></div></div></CardContent></Card>))}</div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12">
            <Card className="glass border-blue-500/20 overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" /><CardHeader className="relative"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"><div><CardTitle className="text-2xl mb-2 text-slate-100">Ready to Start Your Transformation?</CardTitle><CardDescription className="text-base text-slate-300">Get detailed implementation guidance and connect with our experts</CardDescription></div><div className="flex flex-col sm:flex-row gap-3"><Button variant="outline" className="border-slate-700 hover:bg-slate-800/50 text-slate-100 hover:text-slate-50">Schedule Consultation</Button><Button onClick={() => navigate("/usecases")} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">Explore Use Cases<ArrowRight className="ml-2" /></Button></div></div></CardHeader></Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
