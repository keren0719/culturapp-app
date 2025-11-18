import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Navigation, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CARTAGENA_CENTER = {
  lat: 10.3910,
  lng: -75.4794,
};

const MapView = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mapCenter, setMapCenter] = useState(CARTAGENA_CENTER);
  const [mapZoom, setMapZoom] = useState(13);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.events.getAll(),
  });

  const filteredEvents = events
    .filter((event: any) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const isApproved = event.status === 'approved';
      return matchesSearch && matchesCategory && isApproved;
    });

  const mapContainerStyle = {
    width: '100%',
    height: 'calc(100vh - 200px)',
  };

  const mapOptions = {
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  const handleMarkerClick = useCallback((event: any) => {
    setSelectedEvent(event);
    setMapCenter({ lat: event.lat, lng: event.lng });
    setMapZoom(15);
  }, []);

  const handleRecenter = () => {
    setMapCenter(CARTAGENA_CENTER);
    setMapZoom(13);
    setSelectedEvent(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      musica: '#ef4444',
      arte: '#8b5cf6',
      teatro: '#f59e0b',
      gastronomia: '#10b981',
      deporte: '#3b82f6',
      educacion: '#ec4899',
    };
    return colors[category] || '#8b5cf6';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            Mapa de Eventos
          </h1>
          <p className="text-muted-foreground text-lg">
            Descubre eventos cerca de ti en Cartagena
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="musica">Música</SelectItem>
              <SelectItem value="arte">Arte</SelectItem>
              <SelectItem value="teatro">Teatro</SelectItem>
              <SelectItem value="gastronomia">Gastronomía</SelectItem>
              <SelectItem value="deporte">Deporte</SelectItem>
              <SelectItem value="educacion">Educación</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRecenter}>
            <Navigation className="w-4 h-4 mr-2" />
            Recentrar
          </Button>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              options={mapOptions}
            >
              {filteredEvents.map((event: any) => (
                <Marker
                  key={event.id}
                  position={{ lat: event.lat, lng: event.lng }}
                  onClick={() => handleMarkerClick(event)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: getCategoryColor(event.category),
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                  }}
                />
              ))}

              {selectedEvent && (
                <InfoWindow
                  position={{ lat: selectedEvent.lat, lng: selectedEvent.lng }}
                  onCloseClick={() => setSelectedEvent(null)}
                >
                  <div className="max-w-xs">
                    <img
                      src={selectedEvent.image || '/placeholder.svg'}
                      alt={selectedEvent.title}
                      className="w-full h-32 object-cover rounded-t-lg mb-2"
                    />
                    <h3 className="font-bold text-lg mb-1">{selectedEvent.title}</h3>
                    <Badge className="mb-2">{selectedEvent.category}</Badge>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {selectedEvent.description}
                    </p>
                    <div className="space-y-1 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(selectedEvent.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedEvent.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {selectedEvent.price === 0 ? 'Gratis' : `$${selectedEvent.price.toLocaleString()}`}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/events/${selectedEvent.id}`)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Mostrando {filteredEvents.length} eventos en el mapa
        </div>
      </div>
    </div>
  );
};

export default MapView;
