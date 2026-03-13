import { useEffect } from "react";
import { useCampaign } from "../../context/CampaignContext";
import Loading from "../../components/Loading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NoCampaignsFound } from "../../pages/Home";
import { Link } from "react-router";

export default function TaskList() {
    const { campaigns, status, fetchCampaigns, handlePagination } = useCampaign()
    const pagination = campaigns?.pagination?.totalPages


    useEffect(() => {
        fetchCampaigns()
    }, [])
    if (status == 'loading') {
        return <Loading />
    }

    return (
        <div className="flex flex-wrap gap-6">
            {campaigns?.campaigns?.length > 0 && campaigns?.campaigns?.map((campaign) => (
                <Link to={`${campaign.id}`}
                    key={campaign.id}
                    className="basis-64 grow max-w-72 rounded-xl border border-primary/20 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                    {/* Campaign Title */}
                    <div className="mb-2">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-primary truncate">
                                {campaign.title}
                            </h4>
                            <p className="text-xs bg-primary/10 text-accent px-2 py-1 rounded-full">{campaign?.phase}</p>
                        </div>
                        <div className="flex text-gray-500 text-xs gap-4 justify-start">
                            <p>{campaign.category}</p>
                            <p>{campaign.location}</p>
                            <p>{campaign.startDate?.split("T")[0]}</p>
                        </div>
                    </div>
                </Link>
            )
            )}

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
    )
}