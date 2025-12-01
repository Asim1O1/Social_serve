import { Ellipsis } from "lucide-react";

function CampaignCardHeader({
    title,
    event,
    isAdmin,
    inProfile,
    popup,
    setPopup,
}) {
    return (
        <div>
            <h3 className="font-bold text-xl">{title}</h3>

            {isAdmin && inProfile && (
                <button
                    onClick={() =>
                        popup === event.id ? setPopup(null) : setPopup(event.id)
                    }
                    className="absolute top-5 right-5 cursor-pointer ellipsis-btn" // add this class!
                >
                    <Ellipsis />
                </button>
            )}
        </div>
    );
}

export default CampaignCardHeader;
