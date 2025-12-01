import { Link } from "react-router";
import { MessageSquareText } from "lucide-react";

function EventCardFooter({ event, selectEvent, handleRegister, user, location }) {
    return (
        <div className="flex gap-2 items-center justify-between pt-2">

            <button
                onClick={() => selectEvent(event)}
                className="flex gap-1 items-center text-gray-600 hover:text-primary text-sm"
            >
                <MessageSquareText size={16} />
                <span>{event?.comments?.length || 0}</span>
            </button>

            <Link to={`/event/${event.id}`} className="ml-auto primary-btn">
                View
            </Link>

            {(user?.role === "VOLUNTEER" && !location.pathname.includes("profile")) && (
                <button onClick={handleRegister} className="secondary-btn">
                    Register
                </button>
            )}
        </div>
    );
}

export default EventCardFooter;
