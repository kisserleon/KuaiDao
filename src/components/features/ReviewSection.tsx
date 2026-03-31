"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

interface ReviewSectionProps {
  targetType: string;
  targetId: string;
}

export default function ReviewSection({ targetType, targetId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetch(`/api/reviews?targetType=${targetType}&targetId=${targetId}`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => {});
  }, [targetType, targetId]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, rating, comment }),
    });

    if (res.ok) {
      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(5);
    }
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        评价 Reviews ({reviews.length})
      </h2>

      {/* Review Form */}
      {session ? (
        <form onSubmit={submitReview} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                <Star size={20} className={`${(hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"} transition-colors`} />
              </button>
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{rating}/5</span>
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} required
            placeholder="写下你的评价..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700 resize-none" />
          <button type="submit" disabled={loading}
            className="mt-3 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-xl transition-colors">
            {loading ? "提交中..." : "提交评价 Submit"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/login" className="text-red-600 dark:text-red-400 hover:underline">登录</Link> 后可以发表评价
          </p>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">{review.user.name}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className={review.rating >= star ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
            <p className="mt-2 text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">暂无评价 No reviews yet</p>
        )}
      </div>
    </div>
  );
}
