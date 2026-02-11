import { Link, Outlet, useParams } from "react-router";
import { useCampaign } from "../../context/CampaignContext";

const CampaignVolunteers = () => {
  const { id } = useParams();
  if (id) {
    return <Outlet />;
  }

  const { campaigns } = useCampaign();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
          Accepted Volunteers
        </h1>
        <p className="text-sm text-gray-500 max-w-xl">
          View volunteers who have been accepted into your campaigns and manage
          participation easily.
        </p>
      </div>

      {/* Campaign Cards */}
      <div className="flex flex-wrap gap-6">
        {campaigns.map((campaign) => {
          const acceptedVolunteers = campaign.volunteers?.filter(
            (v) => v.status === "accepted"
          );

          return (
            <div
              key={campaign.id}
              className="basis-64 grow max-w-72 rounded-xl border border-primary/20 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Campaign Title */}
              <div className="mb-2">
                <h4 className="text-lg font-semibold text-primary truncate">
                  {campaign.title}
                </h4>
                <div className="my-2 h-px w-full bg-primary/20" />
                <div className="flex text-gray-500 text-xs gap-4 justify-between">
                  <p>{campaign.category}</p>
                  <p>{campaign.location}</p>
                  <p>{campaign.date?.split("T")[0]}</p>
                </div>
                <div className="my-2 h-px w-full bg-primary/20" />
              </div>

              {/* Volunteers */}
              <div className="flex flex-col max-h-56 overflow-y-auto">
                {acceptedVolunteers?.length ? (
                  acceptedVolunteers.map((el) => (
                    <Link
                      to={`${el.volunteer._id}`}
                      key={el.volunteer._id}
                      className="group flex items-center justify-between px-3 py-2 text-sm rounded text-gray-700 transition hover:bg-primary/5 hover:text-primary"
                    >
                      <span>
                        {el.volunteer.firstName} {el.volunteer.lastName}
                      </span>
                      <span className="text-xs opacity-0 transition group-hover:opacity-100">
                        View →
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-accent/60 italic">
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
