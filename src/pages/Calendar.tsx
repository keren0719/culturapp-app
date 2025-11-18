import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { apiapp } from '@/lib/apiapp';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, MapPin, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/calendar.css';

const Calendar = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiapp.events.getAll(),
  });

  // const { data: events = [], isLoading } = useQuery({
  //   queryKey: ['events'],
  //   queryFn: () => api.events.getAll(),
  // });

  const approvedEvents = events.filter((event: any) => event.status === 'publicado');

  const calendarEvents = approvedEvents.map((event: any) => ({
    id: event.id,
    title: event.title,
    start: event.date,
    end: new Date(new Date(event.date).getTime() + (event.duration || 2) * 60 * 60 * 1000),
    backgroundColor: getCategoryColor(event.category),
    borderColor: getCategoryColor(event.category),
    extendedProps: event,

  }));

  function getCategoryColor(category: string) {
      const colors = [
      'hsl(var(--accent))',
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      '#f59e0b',
      '#10b981',
      '#6366f1'
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando calendario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <CalendarIcon className="w-8 h-8" />
            Calendario de Eventos
          </h1>
          <p className="text-muted-foreground text-lg">
            Explora todos los eventos culturales en formato calendario
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            locale="es"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
            }}
          />
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={selectedEvent.images[0] || '/placeholder.svg'}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedEvent.category}</Badge>
                    <Badge variant="outline">{selectedEvent.status}</Badge>
                  </div>

                  <p className="text-muted-foreground">{selectedEvent.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(selectedEvent.date).toLocaleDateString('es-ES', {
                          dateStyle: 'full',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Aforo: {selectedEvent.capacity || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedEvent.price === 0 ? 'Gratis' : `$${selectedEvent.price.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => navigate(`/event/${selectedEvent.id}`)} className="flex-1">
                      Ver Detalles
                    </Button>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Calendar;
