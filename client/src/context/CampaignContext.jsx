import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import { handleRegister } from "../utils/campaign";

const CampainContext = createContext(null)

export const CampaignProvider = ({ children }) => {
    const [campaigns, setCampaigns] = useState(null)
    const [activeCampaign, choseCampaign] = useState(null)
    const [status, setStatus] = useState() // error || loading || success


    useEffect(() => {
        setStatus('loading')
        const load = async () => {
            try {
                const res = await api.get('/campaign')
                setCampaigns(res?.data)
                setStatus('success')

            } catch (error) {
                toast.error(error);
                setStatus('error')

            } finally {
                setStatus(null)
            }
        }
        load()
    }, [])

    const handleRegister = () => {
        toast.success('handlign register');

    }

    return (
        <CampainContext.Provider value={{ campaigns, activeCampaign, choseCampaign, status, handleRegister }}>
            {children}
        </CampainContext.Provider>
    )
}

export const useCampaign = () => useContext(CampainContext)