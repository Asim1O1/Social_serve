import CampaignCard from "../components/CampaignCard";
import Loading from "../components/Loading";
import { useCampaign } from "../context/CampaignContext";

export default function Campaign() {
  const { campaigns, status } = useCampaign();

  if (status == "loading") {
    return <Loading />;
  }
  return (
    <div className="container">
      <h2 className="text-5xl font-bold text-primary mb-12">Campaigns</h2>
      <div className="grid-container">
        {campaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
