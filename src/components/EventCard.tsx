import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    time: string;
    price: number;
    location: string;
    images: string;
    attendees: number;
    capacity: number;
    rating: number;
    status: string;
  };
}

const categoryColors: Record<string, string> = {
  musica: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  arte: 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  teatro: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  gastronomia: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  deporte: 'bg-green-500/10 text-green-700 dark:text-green-300',
  educacion: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
};

const EventCard = ({ event }: EventCardProps) => {

  const rating = Number(event.rating);
  const safeRating = isNaN(rating) ? 0 : rating;

  const price = Number(event.price);
  const safePrice = isNaN(price) ? 0 : price;

  return (
    <Card className="group overflow-hidden hover:shadow-medium transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.images}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={categoryColors[event.category] || 'bg-primary/10'}>
              {event.category}
            </Badge>
            {event.status === 'pending' && (
              <Badge variant="secondary">Pendiente</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {event.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(event.date).toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })} • {event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{event.attendees}/{event.capacity}</span>
            </div>
            {event.rating > 0 && (
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-accent" />
                <span className="font-medium">{safeRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          {event.price === 0 ? (
            <span className="text-lg font-bold text-secondary">Gratis</span>
          ) : (
            <span className="text-lg font-bold text-emerald-400">
              {event.price == 0 ? "GRATIS": "$" + event.price.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <Button asChild size="sm">
          <Link to={`/event/${event.id}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
