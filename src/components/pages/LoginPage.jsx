import { Navigation } from "../shared/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Eye, EyeOff, Shield, Lock, Building2, Users, Settings, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    navigate("/");
  };

  const roles = [
    { icon: Building2, title: "Organization Admin", description: "Manage users, assessments, and organization settings", permissions: ["Full access", "User management", "Billing", "Audit logs"], color: "from-blue-500 to-cyan-400" },
    { icon: Users, title: "Assessment Manager", description: "Create and manage AI maturity assessments", permissions: ["Create assessments", "View results", "Export reports"], color: "from-purple-500 to-pink-400" },
    { icon: BarChart3, title: "Analyst", description: "View assessment results and analytics", permissions: ["View dashboards", "Export data", "Generate reports"], color: "from-cyan-500 to-blue-500" },
    { icon: Settings, title: "Contributor", description: "Participate in assessments and surveys", permissions: ["Complete assessments", "View own results"], color: "from-green-500 to-emerald-400" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full md:w-96 mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="roles">Role Access</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Login Form */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card className="glass-light border-white/10">
                      <CardHeader>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 glow-primary"><Shield className="w-7 h-7 text-white" /></div>
                        <CardTitle className="text-3xl">Welcome Back</CardTitle>
                        <CardDescription className="text-base">Sign in to access your AI maturity platform</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl bg-white/5 border-white/10" required />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl bg-white/5 border-white/10 pr-12" required />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-white/20 bg-white/5" /><span className="text-sm text-muted-foreground">Remember me</span></label>
                            <button type="button" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</button>
                          </div>

                          <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 glow-primary">Sign In</Button>
                        </form>

                        <div className="relative my-8"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-card text-muted-foreground">Or continue with</span></div></div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button type="button" variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5">Google</Button>
                          <Button type="button" variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5">SSO</Button>
                        </div>

                        <div className="mt-6 text-center text-sm text-muted-foreground">Don't have an account? <button className="text-blue-400 hover:text-blue-300">Contact Sales</button></div>
                      </CardContent>
                    </Card>

                    <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Lock className="w-4 h-4" /><span>256-bit SSL</span></div>
                      <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span>SOC 2 Compliant</span></div>
                    </div>
                  </motion.div>

                  {/* Info Panel */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl mb-4">Enterprise-Grade Security</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">Your data is protected with industry-leading security measures, ensuring confidentiality and compliance at every level.</p>
                      </div>

                      <div className="space-y-4">
                        <Card className="glass-light border-white/10"><CardHeader><div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3"><Shield className="w-5 h-5 text-blue-400" /></div><CardTitle className="text-lg">Multi-Factor Authentication</CardTitle><CardDescription>Additional layer of security with MFA support</CardDescription></CardHeader></Card>
                        <Card className="glass-light border-white/10"><CardHeader><div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3"><Lock className="w-5 h-5 text-cyan-400" /></div><CardTitle className="text-lg">Role-Based Access Control</CardTitle><CardDescription>Granular permissions for different user roles</CardDescription></CardHeader></Card>
                        <Card className="glass-light border-white/10"><CardHeader><div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3"><Building2 className="w-5 h-5 text-purple-400" /></div><CardTitle className="text-lg">Enterprise SSO Integration</CardTitle><CardDescription>Seamless integration with your identity provider</CardDescription></CardHeader></Card>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Role-Based Access Tab */}
              <TabsContent value="roles">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-center mb-12"><h2 className="text-3xl mb-4">Role-Based Access Control</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Secure, granular permissions ensure users have appropriate access levels for their responsibilities</p></div>

                  <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {roles.map((role, index) => {
                      const Icon = role.icon;
                      return (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <Card className="glass-light border-white/10 hover:border-blue-500/50 card-hover h-full">
                            <CardHeader>
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}><Icon className="w-6 h-6 text-white" /></div>
                              <CardTitle className="text-xl">{role.title}</CardTitle>
                              <CardDescription className="text-base">{role.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2"><div className="text-sm mb-3">Permissions:</div><div className="space-y-2">{role.permissions.map((permission, pIndex) => (<div key={pIndex} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" />{permission}</div>))}</div></div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-12 text-center"><Card className="glass border-blue-500/20 max-w-3xl mx-auto"><CardHeader><CardTitle className="text-2xl">Need Custom Permissions?</CardTitle><CardDescription className="text-base">Enterprise plans support custom role creation and advanced access controls</CardDescription><div className="pt-4"><Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">Contact Enterprise Sales</Button></div></CardHeader></Card></div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
