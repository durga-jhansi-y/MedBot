import { Link, useLocation } from "react-router";
import { Home, Plus, LayoutDashboard, Zap, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "../context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NavigationBar() {
  const location = useLocation();
  const { user, isSignedIn, signOut } = useUser();

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/add-medication", icon: Plus, label: "Add Med" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 text-white">
            <div className="relative">
              <Zap className="size-8 fill-yellow-400 text-yellow-400" />
              <div className="absolute inset-0 blur-sm">
                <Zap className="size-8 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight">MedBot</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${
                      isActive
                        ? "bg-white text-orange-600 hover:bg-white/90"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* User Menu / Sign In */}
            {isSignedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 bg-white text-orange-600 hover:bg-white/90"
                  >
                    <User className="size-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="text-xs text-gray-500">
                    {user.name}
                  </DropdownMenuItem>
                  {user.age && (
                    <DropdownMenuItem disabled className="text-xs text-gray-500">
                      Age: {user.age}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="size-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/create-account">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2 bg-white text-orange-600 hover:bg-white/90"
                >
                  <User className="size-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Racing stripe */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400"></div>
    </nav>
  );
}