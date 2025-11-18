import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'organizer':
        return 'default';
      case 'participant':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'organizer':
        return 'Organizador';
      case 'participant':
        return 'Participante';
      default:
        return role;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Información Personal</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/50">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-base font-semibold">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/50">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/50">
                <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Rol</p>
                  <Badge 
                    variant={getRoleBadgeVariant(user.role)}
                    className="mt-1"
                  >
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Accesos Rápidos</h3>
              <div className="space-y-2">
                {user.role === 'admin' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    Panel de Administración
                  </Button>
                )}
                {(user.role === 'organizer' || user.role === 'admin') && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/organizer/dashboard')}
                  >
                    Panel de Organizador
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/explore')}
                >
                  Explorar Eventos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
