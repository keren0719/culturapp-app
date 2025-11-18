// import { useState, useEffect } from "react";
// import { useAuth } from "@/lib/auth";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Calendar, MapPin, Users, TrendingUp, Edit, Trash2, Plus } from "lucide-react";
// import { api } from "@/lib/api";
// import { apiapp } from "@/lib/apiapp";
// import { useToast } from "@/hooks/use-toast";

// const OrganizerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [events, setEvents] = useState<any[]>([]);

//   // useEffect(() => {
//   //   const loadEvents = async () => {
//   //     const allEvents = await api.events.getAll();
//   //     setEvents(allEvents.filter(e => e.organizer.id === user?.id));
//   //   };
//   //   loadEvents();
//   // }, [user?.id]);

//     useEffect(() => {
//     const loadEvents = async () => {
//       const allEvents = await apiapp.events.getByUser(user?.id);
//       setEvents(allEvents);
//     };
//     loadEvents();
//     }, [user?.id]);


//   const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

//   const stats = {
//     total: events.length,
//     pending: events.filter(e => e.status === 'pending').length,
//     approved: events.filter(e => e.status === 'approved').length,
//     rejected: events.filter(e => e.status === 'rejected').length,
//   };

//   const handleDelete = async (eventId: string) => {
//     try {
//       await api.events.delete(eventId);
//       setEvents(events.filter(e => e.id !== eventId));
//       toast({
//         title: "Evento eliminado",
//         description: "El evento ha sido eliminado exitosamente",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "No se pudo eliminar el evento",
//         variant: "destructive",
//       });
//     }
//     setDeleteEventId(null);
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, any> = {
//       pending: "outline",
//       approved: "default",
//       rejected: "destructive",
//       draft: "secondary",
//     };

//     const labels: Record<string, string> = {
//       pending: "Pendiente",
//       approved: "Aprobado",
//       rejected: "Rechazado",
//       draft: "Borrador",
//     };

//     return (
//       <Badge variant={variants[status] || "secondary"}>
//         {labels[status] || status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-foreground mb-2">
//             Dashboard del Organizador
//           </h1>
//           <p className="text-muted-foreground">
//             Gestiona tus eventos culturales en Cartagena
//           </p>
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Total de Eventos
//               </CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">{stats.total}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Pendientes
//               </CardTitle>
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Aprobados
//               </CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">{stats.approved}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Rechazados
//               </CardTitle>
//               <MapPin className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">{stats.rejected}</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Events Table */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Mis Eventos</CardTitle>
//                 <CardDescription>
//                   Gestiona y administra todos tus eventos
//                 </CardDescription>
//               </div>
//               <Button onClick={() => navigate('/create-event')}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Crear Evento
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Título</TableHead>
//                   <TableHead>Fecha</TableHead>
//                   <TableHead>Categoría</TableHead>
//                   <TableHead>Estado</TableHead>
//                   <TableHead className="text-right">Acciones</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {events.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                       No tienes eventos creados aún.{" "}
//                       <Button
//                         variant="link"
//                         className="p-0 h-auto"
//                         onClick={() => navigate('/create-event')}
//                       >
//                         Crea tu primer evento
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   events.map((event) => (
//                     <TableRow key={event.id}>
//                       <TableCell className="font-medium">{event.title}</TableCell>
//                       <TableCell>
//                         {new Date(event.date).toLocaleDateString('es-CO')}
//                       </TableCell>
//                       <TableCell>{event.category}</TableCell>
//                       <TableCell>{getStatusBadge(event.status)}</TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => navigate(`/events/${event.id}/edit`)}
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => setDeleteEventId(event.id)}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
//             <AlertDialogDescription>
//               Esta acción no se puede deshacer. El evento será eliminado permanentemente.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancelar</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => deleteEventId && handleDelete(deleteEventId)}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               Eliminar
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default OrganizerDashboard;

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, MapPin, Users, TrendingUp, Edit, Trash2, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { apiapp } from "@/lib/apiapp";
import { useToast } from "@/hooks/use-toast";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // FILTROS
  const [search, setSearch] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      const allEvents = await apiapp.events.getByUser(user?.id);
      setEvents(allEvents);
    };
    loadEvents();
  }, [user?.id]);


  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    rejected: events.filter(e => e.status === 'rejected').length,
  };

  const handleDelete = async (eventId: string) => {
    try {
      await api.events.delete(eventId);
      setEvents(events.filter(e => e.id !== eventId));
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive",
      });
    }
    setDeleteEventId(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
      draft: "secondary",
    };

    const labels: Record<string, string> = {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
      draft: "Borrador",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  // FILTROS APLICADOS
  const filteredEvents = events.filter(e => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      e.title.toLowerCase().includes(searchText) ||
      e.category.toLowerCase().includes(searchText) ||
      e.status.toLowerCase().includes(searchText) ||
      new Date(e.date).toLocaleDateString("es-CO").includes(searchText);

    const matchTitle = filterTitle ? e.title.toLowerCase().includes(filterTitle.toLowerCase()) : true;
    const matchCategory = filterCategory ? e.category.toLowerCase().includes(filterCategory.toLowerCase()) : true;
    const matchStatus = filterStatus ? e.status === filterStatus : true;

    return matchesSearch && matchTitle && matchCategory && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Dashboard del Organizador
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus eventos culturales en Cartagena
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Eventos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprobados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rechazados
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mis Eventos</CardTitle>
                <CardDescription>Gestiona y administra todos tus eventos</CardDescription>
              </div>
              <Button onClick={() => navigate('/create-event')}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Evento
              </Button>
            </div>
          </CardHeader>

          <CardContent>

            {/* FILTROS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="border rounded p-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <input
                type="text"
                placeholder="Filtrar por título"
                className="border rounded p-2"
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Filtrar por categoría"
                className="border rounded p-2"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              />

              <select
                className="border rounded p-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Estado</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
                <option value="draft">Borrador</option>
              </select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay resultados para los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString("es-CO")}</TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/events/${event.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteEventId(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEventId && handleDelete(deleteEventId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizerDashboard;
