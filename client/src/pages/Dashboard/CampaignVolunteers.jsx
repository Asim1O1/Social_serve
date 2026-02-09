import { api } from "../../axios/axios";
import { useCampaign } from "../../context/CampaignContext";

const CampaignVolunteers = () => {
  const { campaigns } = useCampaign();

  const campaignVolunteers = campaigns?.map((campaign) =>
    campaign.volunteers.map((el) => api.get(`/user/${el.volunteer}`))
  );

  console.log(campaignVolunteers);

  return (
    <div>
      <h1 className="font-bold text-primary mb-10 text-5xl">
        Campaign Volunteers
      </h1>
      {campaignVolunteers.map((volunteer) => (
        <div key={volunteer.id}>
          <p>{volunteer.fullName}</p>
        </div>
      ))}
    </div>
  );
};
export default CampaignVolunteers;
