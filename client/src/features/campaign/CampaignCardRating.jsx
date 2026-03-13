import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { api } from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useCampaign } from "../../context/CampaignContext";

function CampaignCardRating({ campaignId, user, myRating: initialMyRating }) {
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);
  const [myRating, setMyRating] = useState(initialMyRating?.rating ?? 0);
  const ratingId = initialMyRating?._id
  const [loading, setLoading] = useState(false);

  const { addComment } = useCampaign()

  const handleRate = async (e) => {
    e.preventDefault()
    if (!user?.id) navigate("/login");
    if (!user?.id || loading) return;

    const comment = e.target.comment.value;

    setLoading(true);
    try {
      const res = await api.post(`/campaign/${campaignId}/rating`, {
        volunteer: user.id,
        rating: myRating,
      });
      await addComment(campaignId, ratingId, comment)

      toast.success("Thanks for your rating!");
    } catch (err) {
      if (err.message) {
        const res = await addComment(campaignId, ratingId, comment)
        return
      }
    } finally {
      setLoading(false);
    }
  };

  // if (!user) return null;

  const displayRating = hoverRating || myRating;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <form onSubmit={(e) => handleRate(e)} className={!user ? "blur-sm" : ""}>

          <div
            className="flex items-center gap-0.5"
            role="group"
            aria-label="Rate this campaign"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                disabled={loading}
                onClick={() => setMyRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none"
                aria-label={`${value} star${value !== 1 ? "s" : ""}`}
              >
                <Star
                  size={20}
                  className={`shrink-0 transition-colors ${value <= displayRating
                    ? "fill-primary text-primary"
                    : "fill-transparent text-primary/30"
                    }`}
                />
              </button>
            ))}
          </div>
          {myRating > 0 && (
            <span className="text-xs text-accent/60">({myRating}/5)</span>
          )}

          <textarea
            name='comment'
            placeholder="Write your comment..."
            className="w-full border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
            rows="3"
          />
          <button
            type="submit"
            disabled={!user}
            className="mt-3 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-all"
          >
            Post Comment
          </button>
        </form >
      </div >

    </>
  );
}

export default CampaignCardRating;
