import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import { useAuth } from "./AuthContext";

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState(null);
  const [activeCampaign, choseCampaign] = useState(null);
  const [status, setStatus] = useState(); // error || loading || success
  const { user } = useAuth();

  const fetchCampaigns = async (user) => {
    setStatus("loading");
    try {
      const res = await api.get("/campaign", { params: { createdBy: user } });
      setCampaigns(res?.data.campaigns);
      setStatus("success");
    } catch (error) {
      toast.error(error.message);
      setStatus("error");
    } finally {
      setStatus(null);
    }
  };

  const handleRegister = async (campaignId) => {
    try {
      const res = await api.post(`/campaign/${campaignId}/apply`, { user });
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        activeCampaign,
        choseCampaign,
        status,
        handleRegister,
        fetchCampaigns,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = (props = {}) => {
  const { user = null } = props;
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error("useCampaign must be used within CampaignProvider");
  }

  const { campaigns, activeCampaign, fetchCampaigns, ...rest } = context;

  useEffect(() => {
    if (user) {
      fetchCampaigns(user);
    } else {
      fetchCampaigns();
    }
  }, [user]);

  return {
    ...rest,
    campaigns,
    activeCampaign,
    fetchCampaigns,
  };
};
