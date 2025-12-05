import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { api } from '../axios/axios'
import Loading from '../components/Loading'
import { Bookmark, MapPin, Timer } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router'

function Campaign() {
    const { user } = useAuth()
    const { id } = useParams()
    // const [event, setEvent] = useState()
    const [campaign, setCampaign] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/campaign/${id}`)
                setCampaign(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return <Loading />

    return (
        <div className="px-6 py-10 max-w-5xl mx-auto">

            {/* ================= Event Header ================= */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between">

                {/* Left: Title & Info */}
                <div className="flex-1">
                    <h1 className="text-primary text-4xl font-bold mb-2">
                        {campaign.title}
                    </h1>

                    <div className="flex flex-col gap-2 text-gray-700">
                        <p className="font-semibold flex items-center gap-3"><Bookmark size={18} /><span>{campaign.category}</span></p>
                        <p className="font-semibold flex items-center gap-3"><Timer size={18} /><span>{campaign?.date?.split('T')[0]}</span></p>
                        <p className="font-semibold flex items-center gap-3"><MapPin size={18} /><span>{campaign.location}</span></p>
                    </div>
                </div>
            </div>

            <div className="my-5">
                <h2 className="text-2xl font-semibold text-primary mb-3">About the Event</h2>
                <p className="text-gray-700 leading-relaxed">
                    {campaign.description || "No description provided."}
                </p>
            </div>

            {campaign.attachments && <img className='h-120 aspect-square rounded' src={campaign.attachments[0]?.url} />}

            <div className="my-5">
                <h2 className="text-2xl font-semibold text-primary mb-4">Comments</h2>

                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
                    {(campaign?.comments?.length) ? (
                        campaign.comments.map((c, index) => (
                            <div
                                key={index}
                                className="min-w-[280px] bg-white border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={c.user?.avatar || "/placeholder.png"}
                                        className="w-10 h-10 rounded-full border"
                                        alt="avatar"
                                    />
                                    <div>
                                        <p className="font-semibold">{c.user?.name || "Unknown User"}</p>
                                        <p className="text-xs text-gray-500">
                                            {c.createdAt ? c.createdAt.slice(0, 10) : ""}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {c.text}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet.</p>
                    )}
                </div>

                {/* Add Comment Input */}
                <div className={`relative mt-6 p-4 bg-white border border-border rounded-2xl shadow-sm`}>
                    <div className={`${!user ? 'blur-sm' : ""}`}>
                        <textarea
                            placeholder="Write your comment..."
                            className="w-full border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
                            rows="3"
                        ></textarea>
                        <button disabled={!user} className="mt-3 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
                            Post Comment
                        </button>
                    </div>
                    {!user && <Link state={{ from: location.pathname }} to='/login' className='absolute -translate-1/2 top-1/2 left-1/2 primary-btn w-fit'>Login to comment.</Link>}
                </div>
            </div>

        </div>
    )
}

export default Campaign
