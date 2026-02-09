import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import { useAuth } from "./AuthContext";

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState(null);
  const [activeCampaign, choseCampaign] = useState(null);
  const [status, setStatus] = useState(); // error || loading || success
  const { user } = useAuth();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
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

export const useCampaign = (initialProps = {}) => {
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error("useCampaign must be used within CampaignProvider");
  }

  const { campaigns, activeCampaign, choseCampaign, ...rest } = context;

  const hasInitialized = useRef(false);

  const { user: initialUser } = initialProps;

  useEffect(() => {
    if (hasInitialized.current) return;
    if (!initialUser) return;

    if (campaigns) {
      const found = campaigns.find((c) => c.createdBy === initialUser);

      if (found) {
        choseCampaign(found);
        hasInitialized.current = true;
      }
    }
  }, [campaigns, initialUser, choseCampaign]);

  return {
    ...rest,
    campaigns,
    activeCampaign,
    choseCampaign,
  };
};
