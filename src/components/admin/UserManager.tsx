import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, UserCog } from 'lucide-react';
import { apiapp } from '@/lib/apiapp'; // Asegúrate de tener el wrapper apiapp

interface Role {
  id: string;
  Nombre: string;
  role_code: string;
}

interface UserProfile {
  id: string;
  Nombre: string;
  Correo?: string;
  Rol: string;
}

export const UsersManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const rolesData = await apiapp.roles.getAll();
      setRoles(rolesData || []);

      const usersData = await apiapp.users.getAll(); // Debe devolver usuarios con sus roles
      setUsers(usersData || []);
    } catch (error: any) {
      toast.error('Error al cargar usuarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedRoleId('');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRoleId) return;

    try {
      await apiapp.user_roles.create({ user_id: selectedUser.id, role_id: selectedRoleId });
      toast.success('Rol asignado exitosamente');
      setIsDialogOpen(false);
      setSelectedUser(null);
      setSelectedRoleId('');
      loadData();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('El usuario ya tiene este rol asignado');
      } else {
        toast.error(error.message || 'Error al asignar rol');
      }
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!confirm('¿Estás seguro de remover este rol?')) return;

    try {
      await apiapp.user_roles.delete(userId, roleId);
      toast.success('Rol removido');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Error al remover rol');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Usuarios y Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.Nombre}</TableCell>
                  <TableCell>{user.Correo}</TableCell>
                  <TableCell>
                    {user.Rol ? (
                        <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        >
                        {user.Rol} ×
                        </Badge>
                    ) : (
                        <span>Ninguno</span>
                    )}
                </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAssignRole(user)}
                    >
                      <UserCog className="h-4 w-4 mr-2" />
                      Asignar Rol
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Rol a {selectedUser?.Nombre}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Seleccionar Rol</Label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.Nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Roles actual: {selectedUser?.Rol || 'Ninguno'}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Asignar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
