import { useState,useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { apiapp } from '@/lib/apiapp';
import EventCard from '@/components/EventCard';
import EventCardExplorer from '@/components/EventCardExplorer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const Explore = () => {

  const [eventos, setEventos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState('date');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const LIST_EVENTOS = `${API_BASE}/events/listExplorerEvents`;

  const loadCategories = async () => {
    try {
      const data = await apiapp.categories.getAll();
      setCategories(data || []);
    } catch (error) {
      toast.error("Error al cargar categorías");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {

        loadCategories();
        
        const res = await fetch(LIST_EVENTOS);
        if (!res.ok) throw new Error('Error al obtener eventos');

        const data = await res.json();
        setEventos(data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError('No se pudieron cargar los eventos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [LIST_EVENTOS]);

  const filteredEvents = eventos
    .filter((event: any) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || event.category === categoryFilter;
      const isApproved = event.status === 'publicado';
      return matchesSearch && matchesCategory && isApproved;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'popularity') {
        return b.attendees - a.attendees;
      }
      return 0;
    });


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explorar Eventos</h1>
          <p className="text-muted-foreground text-lg">
            Descubre los mejores eventos culturales en Cartagena
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>

                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="popularity">Popularidad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredEvents.length} eventos
            </p>
            {(searchQuery || categoryFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando eventos...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No se encontraron eventos</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}>
              Ver todos los eventos
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any) => (
              <EventCardExplorer key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
