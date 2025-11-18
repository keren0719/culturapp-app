import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import StarRating from '@/components/StarRating';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiapp } from "@/lib/apiapp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth';

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

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth state
  const { isAuthenticated, user, logout } = useAuth();
  
  const loadReviews = async () => {
    try {
      const allReviews = await apiapp.reviews.getReviewsByEvent(id!);
      setReviews(allReviews);
    } catch (error) {
      console.log("Error cargando reseñas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reseñas del evento",
        variant: "destructive",
      });
    }
  };

   const loadEvents = async () => {
    try {
      const allEvents = await apiapp.events.getById(id);
      setEvent(allEvents);
    } catch (error) {
      console.log('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del evento",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!id) return;
  
    const loadData = async () => {
      setIsLoading(true);
      await loadEvents();
      await loadReviews();
      setIsLoading(false);
    };
  
    loadData();
  }, [id]);


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
            title: "Success",
            description: "Enlace copiado al portapapeles",
            variant: "destructive",
        });
    }
  };

  const handleReviewSubmitted = () => {
    loadReviews();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Evento no encontrado</h2>
          <Button onClick={() => navigate('/explore')}>Volver a explorar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={event.images[selectedImage]}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {event.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {event.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${event.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Event info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge className="mb-2">{event.category}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                  <div className="flex items-center gap-2">
                    <StarRating rating={event.rating} size="md" />
                    <span className="text-sm text-muted-foreground">
                      ({event.totalReviews} reseñas)
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-lg text-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            <Separator />

            {/* Event details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Fecha</p>
                  <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Hora</p>
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Ubicación</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Asistentes</p>
                  <p className="text-muted-foreground">
                    {event.attendees} personas interesadas
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Organizer info */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Organizador</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {event.organizer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{event.organizer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.organizer.contact}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reviews section */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Reseñas ({reviews.length})
              </h3>

              {isAuthenticated && (
                <div className="mb-8">
                  <ReviewForm
                    eventId={event.id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}

              {!isAuthenticated && (
                <div className="mb-8 p-6 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground mb-4">
                    Inicia sesión para dejar tu reseña
                  </p>
                  <Button onClick={() => navigate('/login')}>
                    Iniciar Sesión
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aún no hay reseñas para este evento
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold">
                    {event.price === 0 ? 'Gratis' : `$${event.price.toLocaleString()}`}
                  </span>
                </div>

                <Button className="w-full" size="lg">
                  Obtener Entradas
                </Button>

                <Button variant="outline" className="w-full">
                  Guardar Evento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;


