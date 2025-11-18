import { Link } from 'react-router-dom';
import { useState,useEffect  } from "react";
import { Button } from '@/components/ui/button';
import { Calendar, Map, Sparkles, Users } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { apiapp } from '@/lib/apiapp';

const Home = () => {

  //const [eventos, setEventos] = useState([]);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //     const fetchEvents = async () => {
  //       try {
  //         const res = await fetch(LIST_EVENTOS);
  //         if (!res.ok) throw new Error("Error al obtener eventos");
  //         const data = await res.json();
  //         setEventos(data);

  //       } catch (err) 
  //       {
  //         alert(err.message)
  //         setError("No se pudieron cargar los eventos");
  //       }
  //     };
  //     fetchEvents();
  //   }, [API_BASE]);

  const { data: eventos = [] } = useQuery({
      queryKey: ['events'],
      queryFn: () => apiapp.events.getAllHome(),
    });

  // const { data: events = [] } = useQuery({
  //   queryKey: ['featured-events'],
  //   queryFn: () => api.events.getAll(),
  // });

  //const featuredEvents = events.filter((e: any) => e.status === 'approved').slice(0, 3);
  const featuredEvents = eventos;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Descubre la cultura de Cartagena</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Vive los Mejores
              <br />
              <span className="text-accent">Eventos Culturales</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Conecta con la vibrante escena cultural de Cartagena. Descubre conciertos, exposiciones, 
              teatro y más eventos que enriquecen nuestra ciudad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-medium">
                <Link to="/explore">Explorar Eventos</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 backdrop-blur-sm">
                <Link to="/register">Crear Cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-soft">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Calendario Completo</h3>
              <p className="text-muted-foreground">
                Organiza tu agenda cultural con nuestro calendario interactivo
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-secondary flex items-center justify-center shadow-soft">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Mapa Interactivo</h3>
              <p className="text-muted-foreground">
                Encuentra eventos cerca de ti con nuestro mapa en tiempo real
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent flex items-center justify-center shadow-soft">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Comunidad Activa</h3>
              <p className="text-muted-foreground">
                Conecta con otros amantes de la cultura y comparte experiencias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Eventos Destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No te pierdas estos increíbles eventos que están por venir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/explore">Ver Todos los Eventos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
        
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Organizas Eventos Culturales?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y llega a miles de personas interesadas en la cultura
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-medium">
            <Link to="/register">Comenzar Gratis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
