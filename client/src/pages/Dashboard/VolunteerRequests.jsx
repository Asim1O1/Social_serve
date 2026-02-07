import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  User,
  UsersRound,
  XCircle,
} from "lucide-react";

function VolunteerRequests() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaignsWithRequests, setCampaignsWithRequests] = useState([]);
  const [respondingId, setRespondingId] = useState(null);

  const fetchMyCampaignsWithVolunteers = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get("/campaign", {
        params: { createdBy: user.id },
      });
      const campaigns = res?.data ?? res ?? [];
      const list = Array.isArray(campaigns) ? campaigns : [];

      const withRequests = await Promise.all(
        list.map(async (campaign) => {
          try {
            const volRes = await api.get(`/campaign/${campaign.id}/volunteers`);
            const volData = volRes?.data ?? volRes;
            return {
              ...campaign,
              volunteerRequests: volData?.volunteerRequests ?? [],
            };
          } catch {
            return { ...campaign, volunteerRequests: [] };
          }
        })
      );

      setCampaignsWithRequests(withRequests);
    } catch (err) {
      toast.error(err?.message ?? "Failed to load campaigns");
      setCampaignsWithRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
    if (user?.id) {
      fetchMyCampaignsWithVolunteers();
    }
  }, [authLoading, user?.id, navigate]);

  const handleRespond = async (campaignId, volunteerIdParam, status) => {
    setRespondingId(volunteerIdParam);
    try {
      await api.patch(
        `/campaign/${campaignId}/volunteer-requests/${volunteerIdParam}`,
        { status }
      );
      toast.success(`Request ${status}`);
      setCampaignsWithRequests((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? {
                ...c,
                volunteerRequests: c.volunteerRequests.filter(
                  (r) => volunteerId(r) !== volunteerIdParam
                ),
              }
            : c
        )
      );
    } catch (err) {
      toast.error(err?.message ?? "Failed to update request");
    } finally {
      setRespondingId(null);
    }
  };

  const volunteerName = (v) => {
    if (!v) return "Unknown";
    const u = v.volunteer ?? v;
    if (typeof u === "string") return u;
    const first = u.firstName ?? "";
    const last = u.lastName ?? "";
    return [first, last].filter(Boolean).join(" ") || u.email || "Volunteer";
  };

  const volunteerId = (v) => {
    const u = v.volunteer ?? v;
    return typeof u === "object" && u !== null ? u._id ?? u.id : u;
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  const hasAnyRequests = campaignsWithRequests.some(
    (c) => c.volunteerRequests?.length > 0
  );

  return (
    <>
      <div className="flex-1">
        <h1 className="font-bold text-primary mb-2 text-5xl">
          Volunteer Requests
        </h1>
        <p className="text-accent/80 mb-8">
          Review and accept or reject volunteer applications for your campaigns.
        </p>

        {!hasAnyRequests ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-primary/5 border border-primary/20">
            <UsersRound className="w-16 h-16 text-primary/40 mb-4" />
            <p className="text-lg font-medium text-accent">
              No pending volunteer requests
            </p>
            <p className="text-sm text-accent/70 mt-1 text-center max-w-sm">
              When volunteers apply to your campaigns, their requests will show
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {campaignsWithRequests.map(
              (campaign) =>
                campaign.volunteerRequests?.length > 0 && (
                  <section
                    key={campaign.id}
                    className="rounded-xl border border-primary/20 bg-white/50 shadow-sm overflow-hidden"
                  >
                    <div className="p-4 md:p-5 border-b border-primary/10 bg-primary/5">
                      <h2 className="font-bold text-xl text-accent">
                        {campaign.title}
                      </h2>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-accent/80">
                        {campaign.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {campaign.location}
                          </span>
                        )}
                        {campaign.date && (
                          <span className="flex items-center gap-1">
                            <CalendarDays size={14} />
                            {new Date(campaign.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ul className="divide-y divide-primary/10">
                      {campaign.volunteerRequests.map((request) => (
                        <li
                          key={request.id}
                          className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <User size={20} className="text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-accent truncate">
                                {volunteerName(request)}
                              </p>
                              {request.volunteer?.email && (
                                <p className="text-sm text-accent/70 truncate">
                                  {request.volunteer.email}
                                </p>
                              )}
                              <p className="text-xs text-accent/60 mt-0.5">
                                Applied {request.appliedAt.split("T")[0]}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() =>
                                handleRespond(
                                  campaign.id,
                                  volunteerId(request),
                                  "accepted"
                                )
                              }
                              disabled={respondingId === volunteerId(request)}
                              className="primary-btn"
                            >
                              <CheckCircle2 size={18} />
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleRespond(
                                  campaign.id,
                                  volunteerId(request),
                                  "rejected"
                                )
                              }
                              disabled={respondingId === volunteerId(request)}
                              className="secondary-btn"
                            >
                              <XCircle size={18} />
                              Reject
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default VolunteerRequests;
