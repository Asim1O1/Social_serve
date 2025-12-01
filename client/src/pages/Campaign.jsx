import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { api } from '../axios/axios'
import Loading from '../components/Loading'

function Campaign() {
    const { id } = useParams()
    const [event, setEvent] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/campaign/${id}`)
                setEvent(res.data)
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
                        {event.title}
                    </h1>

                    <div className="flex flex-col gap-2 text-gray-700">
                        <p><span className="font-semibold">Category:</span> {event.category}</p>
                        <p><span className="font-semibold">Date:</span> {event.date}</p>
                        <p><span className="font-semibold">Location:</span> {event.location}</p>
                        <p><span className="font-semibold">Organized By:</span> {event.organizedBy}</p>
                    </div>
                </div>

                {/* Right: Event Banner */}
                <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden shadow-md">
                    <img
                        src={event.banner || "/placeholder.jpg"}
                        alt="Event Banner"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* ================= Event Description Section ================= */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-primary mb-3">About the Event</h2>
                <p className="text-gray-700 leading-relaxed">
                    {event.description || "No description provided."}
                </p>
            </div>

            {/* ================= Comment Section ================= */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-primary mb-4">Comments</h2>

                {/* Horizontal Scroll Comments */}
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
                    {event?.comments?.length ? (
                        event.comments.map((c, index) => (
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
                <div className="mt-6 p-4 bg-white border border-border rounded-2xl shadow-sm">
                    <textarea
                        placeholder="Write your comment..."
                        className="w-full border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
                        rows="3"
                    ></textarea>

                    <button className="mt-3 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
                        Post Comment
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Campaign
