import { Star, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface ListingCardProps {
  id: string;
  href: string;
  title: string;
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  tags?: string[];
  priceLevel?: number;
  emoji?: string;
}

export default function ListingCard({
  href,
  title,
  subtitle,
  rating,
  reviewCount,
  address,
  tags,
  priceLevel,
  emoji = "🍜",
}: ListingCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 flex items-center justify-center">
          <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform">{emoji}</span>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-1">
              {title}
            </h3>
            {priceLevel && (
              <span className="text-sm text-green-700 dark:text-green-400 font-medium shrink-0">
                {"$".repeat(priceLevel)}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{subtitle}</p>
          )}

          {rating !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
              {reviewCount !== undefined && (
                <span className="text-xs text-gray-400">({reviewCount})</span>
              )}
            </div>
          )}

          {address && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <MapPin size={12} />
              <span className="line-clamp-1">{address}</span>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
