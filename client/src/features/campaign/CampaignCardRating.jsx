import { Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";
import { useCampaign } from "../../context/CampaignContext";

import { useRef } from "react";

function CampaignCardRating({
  campaignId,
  user,
  myRating: initialMyRating,
  volunteers = [],
}) {
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);
  const [myRating, setMyRating] = useState(initialMyRating?.rating ?? 0);
  const ratingId = initialMyRating?._id;
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  // mention state
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownUsers, setDropdownUsers] = useState([]);
  const [mentionStart, setMentionStart] = useState(null);
  const textareaRef = useRef(null);

  const { addComment } = useCampaign();

  // build users list from volunteers prop
  const campaignUsers = volunteers.map((v) => ({
    id: v.volunteer._id,
    firstName: v.volunteer.firstName,
    lastName: v.volunteer.lastName,
  }));

  // parse @mentions for highlight preview
  const parseCommentParts = (text) => {
    const parts = [];
    const regex = /@([a-zA-Z0-9._]+)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex)
        parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
      parts.push({ type: "mention", value: match[0] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length)
      parts.push({ type: "text", value: text.slice(lastIndex) });
    return parts;
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);

    const cursorPos = e.target.selectionStart;
    const textUpToCursor = value.slice(0, cursorPos);
    const mentionMatch = textUpToCursor.match(/@([a-zA-Z0-9._]*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      setMentionStart(cursorPos - mentionMatch[0].length);
      const filtered = campaignUsers.filter(
        (u) =>
          u.firstName.toLowerCase().startsWith(query) ||
          u.lastName.toLowerCase().startsWith(query),
      );
      setDropdownUsers(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
      setMentionStart(null);
    }
  };

  const handleMentionSelect = (selectedUser) => {
    const before = comment.slice(0, mentionStart);
    const after = comment.slice(textareaRef.current.selectionStart);
    setComment(`${before}@${selectedUser.firstName} ${after}`);
    setShowDropdown(false);
    textareaRef.current.focus();
  };

  const handleRate = async (e) => {
    e.preventDefault();
    if (!user?.id) navigate("/login");
    if (!user?.id || loading) return;

    setLoading(true);
    try {
      await api.post(`/campaign/${campaignId}/rating`, {
        volunteer: user.id,
        rating: myRating,
      });
      await addComment(campaignId, ratingId, comment);
      toast.success("Thanks for your rating!");
      setComment("");
    } catch (err) {
      if (err.message) {
        await addComment(campaignId, ratingId, comment);
        setComment("");
      }
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || myRating;
  const commentParts = parseCommentParts(comment);
  const hasMentions = commentParts.some((p) => p.type === "mention");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <form
        onSubmit={handleRate}
        className={`w-full ${!user ? "blur-sm" : ""}`}
      >
        {/* Star Rating */}
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
                className={`shrink-0 transition-colors ${
                  value <= displayRating
                    ? "fill-primary text-primary"
                    : "fill-transparent text-primary/30"
                }`}
              />
            </button>
          ))}
          {myRating > 0 && (
            <span className="text-xs text-accent/60 ml-1">({myRating}/5)</span>
          )}
        </div>

        {/* Textarea with mention dropdown */}
        <div className="relative mt-3">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your comment... use @ to mention someone"
            className="w-full border border-border rounded-xl p-3 outline-none focus:border-primary transition-all resize-none"
            rows="3"
          />

          {/* Mention dropdown */}
          {showDropdown && (
            <div className="absolute z-10 left-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-lg overflow-hidden">
              {dropdownUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onMouseDown={() => handleMentionSelect(u)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <span className="text-primary font-semibold">@</span>
                  <span>
                    {u.firstName} {u.lastName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mention highlight preview */}
        {comment && hasMentions && (
          <div className="mt-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl text-sm leading-relaxed">
            {commentParts.map((part, i) =>
              part.type === "mention" ? (
                <span
                  key={i}
                  className="text-primary font-semibold bg-primary/10 rounded px-1"
                >
                  {part.value}
                </span>
              ) : (
                <span key={i}>{part.value}</span>
              ),
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!user || loading}
          className="mt-3 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}

export default CampaignCardRating;
