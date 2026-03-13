import { useEffect } from "react";
import CampaignCard from "../features/campaign/CampaignCard";
import Loading from "../components/Loading";
import { useCampaign } from "../context/CampaignContext";
import { NoCampaignsFound } from "./Home";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Campaign() {
  const { campaigns, status, fetchCampaigns, handlePagination } = useCampaign();
  const pagination = campaigns && campaigns?.pagination?.totalPages

  useEffect(() => {
    fetchCampaigns()
  }, [])

  if (status == "loading") {
    return <Loading />;
  }
  return (
    <div className="container">
      <h2 className="text-5xl font-bold text-primary mb-12">Campaigns</h2>
      <div className="grid-container">
        {campaigns?.campaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} />
        ))}
      </div>
      {campaigns?.pagination?.totalPages > 0 && <div className="my-6 flex gap-2">
        <button
          onClick={() => handlePagination(Number(campaigns.pagination.page) - 1)}
          className="secondary-btn"
          disabled={!campaigns.pagination.hasPrevPage}>
          <ChevronLeft />
        </button>

        {Array.from({ length: pagination }, (_, i) => (
          <button
            onClick={() => { i + 1 !== campaigns.pagination.page && handlePagination(i + 1) }}
            className={campaigns.pagination.page == i + 1 ? "primary-btn" : "secondary-btn"}>
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePagination(Number(campaigns.pagination.page) + 1)}
          className="secondary-btn"
          disabled={!campaigns.pagination.hasNextPage}>
          <ChevronRight />
        </button>

      </div>}
      {!campaigns?.campaigns?.length && (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-white/60 shadow-sm overflow-hidden">
          <NoCampaignsFound isCategoryFilter={null} />
        </div>
      )}
    </div>
  );
}
