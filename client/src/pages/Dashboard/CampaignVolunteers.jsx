import { Link, Outlet, useParams } from "react-router";
import { useCampaign } from "../../context/CampaignContext";
import { Check, X } from "lucide-react";

const CampaignVolunteers = () => {
  const { id } = useParams();
  if (id) {
    return <Outlet />;
  }

  const { campaigns, handleVolunteerAttendance } = useCampaign();

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
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-primary truncate">
                    {campaign.title}
                  </h4>
                  <p className="text-gray-400">{campaign?.phase}</p>
                </div>
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
                    <div
                      key={el.volunteer._id}
                      className="group flex items-center justify-between px-3 py-2 text-sm rounded text-gray-700 transition hover:bg-primary/5 hover:text-primary"
                    >
                      <Link to='/'>
                        {el.volunteer.firstName} {el.volunteer.lastName}
                      </Link>
                      {el.attendanceStatus == 'present' && <span>Present</span>}
                      {el.attendanceStatus == 'absent' && <span>Absent</span>}
                      {!el?.attendanceStatus && <div className="flex gap-1 text-white">
                        <button onClick={() =>
                          handleVolunteerAttendance(
                            campaign.id,
                            "present",
                            el.volunteer._id
                          )
                        } title="Present" className="bg-green-400 rounded-full p-1" ><Check size={12} /></button>
                        <button onClick={() =>
                          handleVolunteerAttendance(
                            campaign.id,
                            "absent",
                            el.volunteer._id
                          )
                        } title="absent" className="bg-red-400 rounded-full p-1"><X size={12} /></button>
                      </div>}
                    </div>
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
