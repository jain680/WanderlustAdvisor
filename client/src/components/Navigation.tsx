import { Link, useLocation } from "wouter";
import { Compass, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <Compass className="text-2xl text-primary" />
              <span className="font-serif font-bold text-xl text-foreground">WanderAI</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/destinations" 
                className={`transition-colors ${location === '/destinations' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                data-testid="link-destinations"
              >
                Destinations
              </Link>
              <Link 
                href="/travel-groups" 
                className={`transition-colors ${location === '/travel-groups' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                data-testid="link-community"
              >
                Community
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {user?.firstName || user?.email || 'Traveler'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid="button-logout"
                  onClick={() => window.location.href = '/api/logout'}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Button 
                data-testid="button-signin"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
