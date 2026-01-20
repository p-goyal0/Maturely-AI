import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { LogOut, LayoutDashboard, Users, Settings, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';

/**
 * Reusable Page Header Component
 * 
 * @param {Object} props
 * @param {Array} props.centerItems - Array of navigation items to display in center
 *   Example: [{ label: "Industry", path: "/industry" }, { label: "Assessment", path: "/assessments" }]
 * @param {string} props.activePath - Currently active path (for highlighting)
 * @param {boolean} props.showScrollBehavior - Whether to hide header on scroll down (default: true)
 * @param {string} props.zIndex - z-index value (default: "z-40")
 */
export function PageHeader({ 
  centerItems = [], 
  activePath = null,
  showScrollBehavior = true,
  zIndex = "z-40"
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll detection for header
  useEffect(() => {
    if (!showScrollBehavior) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, showScrollBehavior]);

  const handleSignOut = () => {
    signOut();
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  const handleLogoClick = () => {
    navigate("/offerings");
  };

  // Get user display name (full name or formatted username)
  const getUserDisplayName = () => {
    // Check API response field first
    if (currentUser?.full_name) return currentUser.full_name;
    if (currentUser?.name) return currentUser.name;
    if (currentUser?.fullName) return currentUser.fullName;
    // Format username: "sarah.johnson" -> "Sarah Johnson"
    if (currentUser?.username) {
      return currentUser.username
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    return 'User';
  };

  // Get user email
  const getUserEmail = () => {
    if (currentUser?.email) return currentUser.email;
    // Format email from username: "sarah.johnson" -> "sarah.johnson@company.com"
    if (currentUser?.username) {
      return `${currentUser.username}@company.com`;
    }
    return 'user@company.com';
  };

  // Get user role from API response or fallback
  const getUserRole = () => {
    // Check API response fields first
    if (currentUser?.is_super_admin === true) return 'Super Admin';
    if (currentUser?.is_billing_admin === true) return 'Billing Admin';
    // Fallback to role field
    if (currentUser?.role) return currentUser.role;
    return 'User';
  };

  // Format role for display (already formatted from getUserRole)
  const formatRole = (role) => {
    if (!role) return 'User';
    // If already formatted (from API), return as is
    if (role.includes(' ')) return role;
    // Convert "SUPER_ADMIN" to "Super Admin", "MODULE_OWNER" to "Module Owner", etc.
    return role.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Check if current path matches dashboard
  const isDashboardActive = location.pathname === '/offerings' || location.pathname === '/dashboard';

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 ${zIndex} transition-transform duration-300 ${
        showScrollBehavior && isScrolled ? "-translate-y-full" : "translate-y-0"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="pt-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg px-6 lg:px-8 py-3 border border-gray-200">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/logo/wings.png" 
                alt="Logo" 
                className="h-10 w-10 lg:h-8 lg:w-12 transition-all duration-300 group-hover:scale-110" 
              />
              <img 
                src="/logo/maturely_logo.png" 
                alt="MATURITY.AI" 
                className="h-4 lg:h-5 transition-all duration-300 group-hover:scale-110" 
              />
            </button>

            {/* Center - Navigation Items (optional) */}
            {centerItems.length > 0 && (
              <div className="flex items-center gap-6">
                {centerItems.map((item, index) => {
                  const isActive = activePath === item.path || (item.path && location.pathname === item.path);
                  const isLabel = item.labelOnly; // If it's just a label, not a button
                  
                  if (isLabel) {
                    return (
                      <span 
                        key={index}
                        className="text-sm text-cyan-600 font-semibold"
                      >
                        {item.label}
                      </span>
                    );
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => item.path && navigate(item.path)}
                      className={`group relative text-sm font-medium transition-colors duration-300 pb-1 ${
                        isActive
                          ? "text-cyan-600 font-semibold"
                          : "text-slate-700 hover:text-cyan-600"
                      }`}
                    >
                      {item.label}
                      {/* Animated underline - expands from center on hover */}
                      <span 
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-600 transition-all duration-300 ease-out ${
                          isActive 
                            ? "w-[120%]" 
                            : "w-0 group-hover:w-[120%]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Right - User Avatar with Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold text-sm">
                {getUserDisplayName()}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                    <Avatar className="h-10 w-10 bg-[#46cdc6]">
                      <AvatarFallback className="bg-[#46cdc6] text-white font-semibold">
                        {(() => {
                          const displayName = getUserDisplayName();
                          return displayName?.charAt(0).toUpperCase() || 'U';
                        })()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-0">
                  {/* User Information Section */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="font-semibold text-gray-900 text-sm">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {getUserEmail()}
                    </div>
                    <div className="text-xs text-cyan-600 font-medium mt-1 underline">
                      {formatRole(getUserRole())}
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <div className="py-1">
                    <DropdownMenuItem
                      onClick={() => navigate("/offerings")}
                      className={`cursor-pointer px-4 py-2.5 ${
                        isDashboardActive 
                          ? 'bg-cyan-50 text-cyan-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <LayoutDashboard className={`w-4 h-4 mr-2 ${isDashboardActive ? 'text-cyan-600' : 'text-gray-600'}`} />
                      Dashboard
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() => navigate("/role-management")}
                      className="cursor-pointer px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      <UserCog className="w-4 h-4 mr-2 text-gray-600" />
                      Role Management
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() => navigate("/team-management")}
                      className="cursor-pointer px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      <Users className="w-4 h-4 mr-2 text-gray-600" />
                      User Administration
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className={`cursor-pointer px-4 py-2.5 ${
                        location.pathname === '/settings'
                          ? 'bg-cyan-50 text-cyan-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Settings className={`w-4 h-4 mr-2 ${location.pathname === '/settings' ? 'text-cyan-600' : 'text-gray-600'}`} />
                      Settings
                    </DropdownMenuItem>
                  </div>

                  {/* Sign Out Separator */}
                  <DropdownMenuSeparator className="my-1" />

                  {/* Sign Out */}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer px-4 py-2.5 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-600" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



