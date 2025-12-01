import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../axios/axios";
import { toast } from "react-toastify";

import CardHeader from "./CampaignCardHeader";
import CardInfo from "./CampaignCardInfo";
import CardFooter from "./CampaignCardFooter";
import ActionsMenu from "./CampaignActionMenu";
import ConfirmModal from "./ConfirmModal";

function CampaignList({ event, selectEvent, handleRegister }) {
    const { user } = useAuth();
    const location = useLocation();

    const [popup, setPopup] = useState(null);
    const popupRef = useRef(null);

    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const closePopup = (e) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target) &&
                !e.target.closest(".ellipsis-btn")
            ) {
                setPopup(null);
            }
        };

        document.addEventListener("mousedown", closePopup);
        return () => document.removeEventListener("mousedown", closePopup);
    }, []);


    const deleteEvent = async () => {
        try {
            setLoading(true);
            await api.delete(`/campaign/${event.id}`);
            toast.success("Event deleted!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete!");
        } finally {
            setLoading(false);
            setOpenModal(false);
        }
    };

    return (
        <div
            className="group p-5 bg-primary/10 space-y-4 relative rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300">
            <CardHeader
                title={event?.title}
                event={event}
                isAdmin={user?.role === "ADMIN"}
                inProfile={location.pathname.includes("profile")}
                popup={popup}
                setPopup={setPopup}
                popupRef={popupRef}
            />
             <ActionsMenu
                popup={popup}
                event={event}
                setOpenModal={setOpenModal}
                popupRef={popupRef}
            />

            <CardInfo event={event} />
            <div className="rounded-full w-full h-0.25 bg-accent"></div>
            <CardFooter
                event={event}
                selectEvent={selectEvent}
                handleRegister={handleRegister}
                user={user}
                location={location}
            />
           
            <ConfirmModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={deleteEvent}
                loading={loading}
                message="This action cannot be undone."
            />
        </div>
    );
}

export default CampaignList;
