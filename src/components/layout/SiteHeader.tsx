
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, MessageCircle, User, Bell, Settings, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  notificationCount?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  label,
  icon,
  isActive,
  notificationCount,
}) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
      isActive
        ? 'bg-datex-purple/30 text-white'
        : 'text-white/70 hover:bg-datex-purple/10 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
    {notificationCount ? (
      <Badge className="bg-datex-purple text-white ml-auto">
        {notificationCount}
      </Badge>
    ) : null}
  </Link>
);

interface SiteHeaderProps {
  activePage: 'matches' | 'messages' | 'profile';
  unreadMessageCount?: number;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({
  activePage,
  unreadMessageCount = 0,
}) => {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="w-full py-4 px-6 glass-morphism bg-datex-card border-b border-datex-purple/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-gradient-purple">
            Datex
          </Link>
          
          <div className="hidden md:flex items-center gap-4 ml-8">
            <NavItem 
              to="/" 
              label="Matches" 
              icon={<Heart className="h-4 w-4" />} 
              isActive={activePage === 'matches'}
            />
            <NavItem 
              to="/messages" 
              label="Messages" 
              icon={<MessageCircle className="h-4 w-4" />} 
              isActive={activePage === 'messages'}
              notificationCount={unreadMessageCount}
            />
            <NavItem 
              to="/profile" 
              label="Profile" 
              icon={<User className="h-4 w-4" />} 
              isActive={activePage === 'profile'}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white/70 hover:text-white hover:bg-datex-purple/10"
            asChild
          >
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-full h-10 w-10 border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="glass-morphism bg-datex-card border-datex-purple/30 text-white w-56"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-datex-purple/20" />
              <DropdownMenuItem className="focus:bg-datex-purple/20 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-datex-purple/20 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-datex-purple/20" />
              <DropdownMenuItem 
                className="focus:bg-datex-purple/20 cursor-pointer text-red-400"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
