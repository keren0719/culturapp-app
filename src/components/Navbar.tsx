import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Map, User, LogOut, LayoutDashboard, Plus } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    if (user?.role === 'ORGA') return '/organizer/dashboard';
    return '/profile';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
              C
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              CulturApp
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-sm font-medium transition-colors hover:text-primary">
              Explorar
            </Link>
            {/* <Link to="/map" className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
              <Map className="w-4 h-4" />
              Mapa
            </Link> */}
            <Link to="/calendar" className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
              <Calendar className="w-4 h-4" />
              Calendario
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {(user.role === 'ORGA' || user.role === 'ADMIN') && (
                <Button asChild variant="default" size="sm" className="hidden md:flex">
                  <Link to="/create-event" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Crear Evento
                  </Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-primary font-medium capitalize">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Ingresar</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
