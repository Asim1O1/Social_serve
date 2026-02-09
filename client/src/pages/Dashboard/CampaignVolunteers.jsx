import { Link, Outlet, useParams } from "react-router";
import { useCampaign } from "../../context/CampaignContext";

const CampaignVolunteers = () => {
  const { id } = useParams();
  if (id) {
    return <Outlet />;
  }
  const { campaigns } = useCampaign();
  return (
    <div>
      <h1 className="text-5xl text-primary mb-2 font-bold">
        Accepted Volunteers
      </h1>
      <p className="text-sm text-gray-500 mb-12">
        View volunteers that are accepted in your campaign.
      </p>
      <div className="flex gap-4">
        {campaigns.map((campaign) => {
          const acceptedVolunteers = campaign.volunteers?.filter(
            (v) => v.status === "accepted"
          );

          return (
            <div
              key={campaign.id}
              className="border basis-60 grow border-primary rounded-lg p-4"
            >
              <h4 className="font-medium text-primary">{campaign.title}</h4>
              <hr className="border-primary" />
              <div className="flex flex-col">
                {acceptedVolunteers?.length ? (
                  acceptedVolunteers.map((el) => (
                    <Link
                      to={`${el.volunteer._id}`}
                      key={el.volunteer._id}
                      className="duration-150 hover:text-primary"
                    >
                      {el.volunteer.firstName} {el.volunteer.lastName}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-accent/60">
                    No accepted volunteers
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CampaignVolunteers;
