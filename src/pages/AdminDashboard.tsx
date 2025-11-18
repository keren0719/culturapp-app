import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { apiapp } from '@/lib/apiapp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Users, Calendar, TrendingUp, Mail, MapPin, Clock, DollarSign, UserCheck, Eye } from 'lucide-react';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { LugaresManager } from '@/components/admin/PlacesManager';
import { UsersManager } from '@/components/admin/UserManager';

// interface Event {
//   id: string;
//   title: string;
//   description?: string;
//   category: string;
//   date: string;
//   time?: string;
//   status: string;
//   capacity?: number;
//   price?: number;
//   location?: string;
//   images?: string[];
//   attendees?: number;
//   organizer: {
//     name: string;
//     avatar?: string;
//   };
// }

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  time: string;
  duration: number;
  capacity: number;
  price: number;

  location: string;

  organizer: {
    id: string;
    name: string;
    avatar: string;
    contact: string;
  };

  images: string[];
  purchaseLink: string;
  status: string;
  attendees: number;

  rating: number;    // corresponde a "rating" de tu API
  reviews: any[];     // array de reviews que viene en la API
  totalReviews : number;
}

interface Stats {
  totalEvents: number;
  pendingEvents: number;
  activeOrganizers: number;
  totalParticipants: number;
  monthlyGrowth: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [currentTab, setCurrentTab] = useState('pending');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [events, statsData] = await Promise.all([
        apiapp.events.getAllAdmin(),
        apiapp.events.getDashboardStats(),
      ]);
      setAllEvents(events);
      setStats(statsData);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    switch (currentTab) {
      case 'pending':
        return allEvents.filter(e => e.status === 'pendiente');
      case 'approved':
        return allEvents.filter(e => e.status === 'publicado');
      case 'rejected':
        return allEvents.filter(e => e.status === 'rechazado');
      default:
        return allEvents;
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedEvent) return;
    try {
      await apiapp.events.approveEvent(selectedEvent.id);
      toast.success('Evento aprobado exitosamente');
      setIsDetailModalOpen(false);
      setSelectedEvent(null);
      loadData();
    } catch (error) {
      toast.error('Error al aprobar evento');
    }
  };

  const handleRejectClick = () => {
    setIsDetailModalOpen(false);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedEvent) return;
    if (!rejectReason.trim()) {
      toast.error('Debes proporcionar una razón para rechazar');
      return;
    }
    try {
      await apiapp.events.rejectEvent(selectedEvent.id, rejectReason);
      toast.success('Evento rechazado');
      setIsRejectModalOpen(false);
      setSelectedEvent(null);
      setRejectReason('');
      loadData();
    } catch (error) {
      toast.error('Error al rechazar evento');
    }
  };

  const handleCreateInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Ingresa un email válido');
      return;
    }
    setIsCreatingInvite(true);
    try {
      const result = await api.admin.createInvite({ email: inviteEmail, role: 'admin' });
      toast.success(`Invitación creada: ${result.inviteCode}`);
      setInviteEmail('');
    } catch (error) {
      toast.error('Error al crear invitación');
    } finally {
      setIsCreatingInvite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Pendientes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizadores Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeOrganizers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalParticipants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crecimiento Mensual</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats?.monthlyGrowth}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Crear invitación de admin */}
        {/* <Card className="mb-8">
          <CardHeader>
            <CardTitle>Crear Invitación de Administrador</CardTitle>
            <CardDescription>Genera un código de invitación para nuevos admins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="invite-email">Email del nuevo admin</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="admin@ejemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleCreateInvite} disabled={isCreatingInvite}>
                  <Mail className="h-4 w-4 mr-2" />
                  Crear Invitación
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Tabla de Eventos con Tabs */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="lugares">Lugares</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Eventos</CardTitle>
                <CardDescription>Revisa y administra todos los eventos de la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="pending">Pendientes</TabsTrigger>
                    <TabsTrigger value="approved">Aprobados</TabsTrigger>
                    <TabsTrigger value="rejected">Rechazados</TabsTrigger>
                  </TabsList>

                  <TabsContent value={currentTab}>
                {getFilteredEvents().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay eventos {currentTab === 'all' ? '' : currentTab === 'pending' ? 'pendientes' : currentTab === 'approved' ? 'aprobados' : 'rechazados'}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Organizador</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredEvents().map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.category}</Badge>
                          </TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell>{event.organizer.name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                event.status === 'publicado' ? 'default' : 
                                event.status === 'pendiente' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {event.status === 'publicado' ? 'Aprobado' : 
                               event.status === 'pendiente' ? 'Pendiente' : 
                               'Rechazado'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewEvent(event)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesManager />
      </TabsContent>

      <TabsContent value="lugares">
        <LugaresManager />
      </TabsContent>

      <TabsContent value="users">
        <UsersManager />
      </TabsContent>
        </Tabs>

        {/* Tabla de Eventos con Tabs */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Gestión de Eventos</CardTitle>
            <CardDescription>Revisa y administra todos los eventos de la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="approved">Aprobados/Publicados</TabsTrigger>
                <TabsTrigger value="rejected">Rechazados</TabsTrigger>
              </TabsList>

              <TabsContent value={currentTab}>
                {getFilteredEvents().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay eventos {currentTab === 'all' ? '' : currentTab === 'pending' ? 'pendientes' : currentTab === 'approved' ? 'aprobados' : 'rechazados'}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Organizador</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredEvents().map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.category}</Badge>
                          </TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell>{event.organizer.name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                event.status === 'publicado' ? 'default' : 
                                event.status === 'pendiente' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {event.status === 'publicado' ? 'Publicado' : 
                               event.status === 'pendiente' ? 'Pendiente' : 
                               'Rechazado'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewEvent(event)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card> */}

        {/* Modal de Detalles del Evento */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedEvent?.title}</DialogTitle>
              <DialogDescription>
                Revisa los detalles del evento antes de aprobar o rechazar
              </DialogDescription>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-6">
                {/* Imágenes */}
                {selectedEvent.images && selectedEvent.images.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Imágenes del Evento</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedEvent.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${selectedEvent.title} - ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Información General */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha</p>
                        <p className="font-medium text-foreground">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedEvent.time && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Hora</p>
                          <p className="font-medium text-foreground">{selectedEvent.time}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedEvent.capacity && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <UserCheck className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Capacidad</p>
                          <p className="font-medium text-foreground">{selectedEvent.capacity} personas</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Precio</p>
                        <p className="font-medium text-foreground">
                          {selectedEvent.price === 0 ? 'Gratis' : `$${selectedEvent.price?.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                {selectedEvent.location && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ubicación</p>
                        <p className="font-medium text-foreground">{selectedEvent.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Descripción */}
                {selectedEvent.description && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Descripción</h3>
                    <p className="text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Organizador */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <h3 className="font-semibold text-foreground">Organizador</h3>
                  <div className="flex items-center gap-3">
                    {selectedEvent.organizer.avatar && (
                      <img
                        src={selectedEvent.organizer.avatar}
                        alt={selectedEvent.organizer.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <p className="font-medium text-foreground">{selectedEvent.organizer.name}</p>
                  </div>
                </div>

                {/* Estado Actual */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Estado del Evento</h3>
                  <Badge 
                    variant={
                      selectedEvent.status === 'publicado' ? 'default' : 
                      selectedEvent.status === 'pendiente' ? 'secondary' : 
                      'destructive'
                    }
                    className="text-base px-3 py-1"
                  >
                    {selectedEvent.status === 'publicado' ? 'Aprobado' : 
                     selectedEvent.status === 'pendiente' ? 'Pendiente de Aprobación' : 
                     'Rechazado'}
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Cerrar
              </Button>
              {selectedEvent?.status === 'pendiente' && (
                <>
                  <Button variant="destructive" onClick={handleRejectClick}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button variant="default" onClick={handleApprove}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Rechazo */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rechazar Evento</DialogTitle>
              <DialogDescription>
                Por favor, proporciona una razón para rechazar "{selectedEvent?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Razón del rechazo</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe por qué este evento no cumple con los requisitos..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleRejectConfirm}>
                Confirmar Rechazo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
