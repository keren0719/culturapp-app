import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReviewCardProps {
  review: {
    id: string;
    user: {
      name: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const initials = review.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={review.user.avatar} alt={review.user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-foreground">{review.user.name}</h4>
              <p className="text-sm text-muted-foreground">{timeAgo}</p>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>

          <p className="text-foreground leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;
