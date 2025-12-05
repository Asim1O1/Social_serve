import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import Loading from '../components/Loading';
import { Plus, User } from 'lucide-react';
import Comment from '../components/Comment';
import { useCampaign } from '../context/CampaignContext';
import CampaignList from '../components/CampaignList';
import { handleRegister } from '../utils/campaign';

function Profile() {
    const navigate = useNavigate()
    const { user, loading, logout } = useAuth()
    const { campaigns, status, choseCampaign, activeCampaign, handleRegister } = useCampaign()


    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user]);

    if (loading || status == 'loading') {
        return (
            <Loading />
        )
    }


    return (
        <div>
            <div className='flex items-center gap-2'>
                <div className='bg-accent/50 w-fit p-3 text-white rounded'><User /></div>
                <div>
                    <span className='block'>{user?.email?.split("@")[0]}</span>
                    <span className='text-gray-400'>{user?.role == "ADMIN" ? user?.role.toLowerCase() : 'volunteer'}</span>
                </div>
                <button className='ml-auto secondary-btn' onClick={logout}>Logout</button>
            </div>
            <div className='mt-8'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-bold text-2xl'>My Events</h1>
                    {user?.role == "ADMIN" && <Link to="/create-campaign" className='primary-btn rounded-full'>
                        <Plus className='inline-block md:hidden' size={16} />
                        <span className='md:inline hidden'>Create event</span>
                    </Link>}
                </div>
                <div className='grid-container mt-4'>
                    {campaigns && campaigns.map(campaign => (
                        <CampaignList key={campaign?.id} campaign={campaign} handleRegister={handleRegister} choseCampaign={choseCampaign} />
                    ))}

                    {/* Comment Box */}
                    <Comment campaign={activeCampaign} choseCampaign={choseCampaign} />
                </div>
            </div>
        </div>
    )
}

export default Profile;
