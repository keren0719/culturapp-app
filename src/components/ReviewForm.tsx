import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './StarRating';
import { toast } from 'sonner';
import { apiapp } from "@/lib/apiapp";
import { useAuth } from '@/lib/auth';

interface ReviewFormProps {
  eventId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ eventId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Tu reseña debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiapp.reviews.createReview(eventId, rating,user.id, comment.trim());

      toast.success('¡Reseña enviada exitosamente!');
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (error) {
      console.log('Error:', error);
      toast.error('No se pudo enviar la reseña. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Escribe tu reseña</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Calificación
          </label>
          <StarRating
            rating={rating}
            interactive
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Comentario
          </label>
          <Textarea
            id="comment"
            placeholder="Comparte tu experiencia con otros asistentes..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full"
        >
          {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
        </Button>
      </form>
    </Card>
  );
};

export default ReviewForm;
