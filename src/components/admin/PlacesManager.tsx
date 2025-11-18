import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiapp } from "@/lib/apiapp";


interface Lugar {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  capacidad: number;
  created_at: string;
}

export const LugaresManager = () => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLugar, setEditingLugar] = useState<Lugar | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    capacidad: 0
  });

  useEffect(() => {
    loadLugares();
  }, []);

  const loadLugares = async () => {
    setLoading(true);
    try {
      const data = await apiapp.places.getAll(); // Aquí usas tu API wrapper
      setLugares(data || []);
    } catch (error) {
      toast.error("Error al cargar lugares");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLugar) {
        await apiapp.places.update(editingLugar.id, formData);
        toast.success('Lugar actualizado');
      } else {
        await apiapp.places.create(formData);
        toast.success('Lugar creado');
      }

      setIsDialogOpen(false);
      setFormData({ nombre: '', direccion: '', ciudad: '', capacidad: 0 });
      setEditingLugar(null);
      loadLugares();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar lugar');
    }
  };

  const handleEdit = (lugar: Lugar) => {
    setEditingLugar(lugar);
    setFormData({
      nombre: lugar.nombre,
      direccion: lugar.direccion,
      ciudad: lugar.ciudad,
      capacidad: lugar.capacidad
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este lugar?')) return;

    try {
      await apiapp.places.delete(id);
      toast.success('Lugar eliminado');
      loadLugares();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar lugar');
    }
  };

  
  const handleNewLugar = () => {
    setEditingLugar(null);
    setFormData({ nombre: '', direccion: '', ciudad: '', capacidad: 0 });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lugares</CardTitle>
          <Button onClick={handleNewLugar} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Lugar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lugares.map((lugar) => (
                <TableRow key={lugar.id}>
                  <TableCell>{lugar.nombre}</TableCell>
                  <TableCell>{lugar.direccion}</TableCell>
                  <TableCell>{lugar.ciudad}</TableCell>
                  <TableCell>{lugar.capacidad}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(lugar)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(lugar.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
            <DialogTitle>
              {editingLugar ? 'Editar Lugar' : 'Nuevo Lugar'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacidad">Capacidad</Label>
                <Input
                  id="capacidad"
                  type="number"
                  min="1"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingLugar ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
