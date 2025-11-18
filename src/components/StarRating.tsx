// import { Star } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface StarRatingProps {
//   rating: number;
//   maxRating?: number;
//   size?: 'sm' | 'md' | 'lg';
//   interactive?: boolean;
//   onRatingChange?: (rating: number) => void;
// }

// const StarRating = ({ 
//   rating, 
//   maxRating = 5, 
//   size = 'md',
//   interactive = false,
//   onRatingChange 
// }: StarRatingProps) => {
//   const sizeClasses = {
//     sm: 'w-4 h-4',
//     md: 'w-5 h-5',
//     lg: 'w-6 h-6',
//   };

//   return (
//     <div className="flex items-center gap-1">
//       {Array.from({ length: maxRating }).map((_, index) => {
//         const starValue = index + 1;
//         const isFilled = starValue <= rating;
//         const isHalfFilled = starValue - 0.5 === rating;

//         return (
//           <button
//             key={index}
//             type="button"
//             disabled={!interactive}
//             onClick={() => interactive && onRatingChange?.(starValue)}
//             className={cn(
//               "relative transition-transform",
//               interactive && "hover:scale-110 cursor-pointer",
//               !interactive && "cursor-default"
//             )}
//           >
//             <Star
//               className={cn(
//                 sizeClasses[size],
//                 "transition-colors",
//                 isFilled || isHalfFilled
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "fill-none text-muted-foreground"
//               )}
//             />
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default StarRating;

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumber?: boolean; // opcional, por si luego quieres ocultarlo
}

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  interactive = false,
  onRatingChange,
  showNumber = true
}: StarRatingProps) => {

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Estrellas */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isHalfFilled = starValue - 0.5 === rating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              className={cn(
                "relative transition-transform",
                interactive && "hover:scale-110 cursor-pointer",
                !interactive && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled || isHalfFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-muted-foreground"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Número grande */}
      {showNumber && (
        <span className="text-2xl font-bold text-foreground leading-none">
          {rating}
        </span>
      )}
    </div>
  );
};

export default StarRating;
