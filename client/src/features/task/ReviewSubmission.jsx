import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../../axios/axios";
import { toast } from "react-toastify";

function ReviewSubmission() {
    const { taskId } = useParams();

    const [taskSubmission, setTaskSubmission] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [pointsAwarded, setPointsAwarded] = useState({});

    const fetchTaskSubmission = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/task/tasks/${taskId}/submissions`);

            if (res.status !== "success")
                throw new Error("Error fetching submissions");

            setTaskSubmission(res.data);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskSubmission();
    }, [taskId]);

    const reviewTask = async (id, status) => {
        try {
            setUpdatingId(id);

            const res = await api.patch(`/task/tasks/submissions/${id}/review`, {
                status,
                pointsAwarded: pointsAwarded[id] || 0,
            });

            if (res.status === "success") {
                toast.success("Review updated");

                setTaskSubmission((prev) =>
                    prev.map((el) =>
                        el._id === id
                            ? { ...el, reviewStatus: status, pointsAwarded: pointsAwarded[id] }
                            : el
                    )
                );
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading submissions...</p>;

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-primary mb-2">
                    Task Submissions
                </h1>
                <p className="text-sm text-gray-500">
                    Review volunteer submissions and award points.
                </p>
            </div>

            {taskSubmission.length === 0 ? (
                <p className="text-gray-500 italic">No submissions yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {taskSubmission.map((data) => (
                        <div
                            key={data._id}
                            className="bg-white rounded-xl border border-primary/20 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition"
                        >
                            {/* Volunteer Info */}
                            <div>
                                <h3 className="font-semibold text-primary">
                                    {data.volunteer?.fullName}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {data.volunteer?.email}
                                </p>
                            </div>

                            {/* Summary */}
                            <p className="text-sm text-gray-700">{data.summary}</p>

                            {/* Proof Images */}
                            {data.proof?.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {data.proof.map((el, i) => (
                                        <img
                                            key={i}
                                            src={el.url}
                                            alt="proof"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Points Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">
                                    Points Awarded
                                </label>
                                <input
                                    type="number"
                                    value={pointsAwarded[data._id] || ""}
                                    onChange={(e) =>
                                        setPointsAwarded((prev) => ({
                                            ...prev,
                                            [data._id]: e.target.value,
                                        }))
                                    }
                                    className="border rounded p-1 text-sm"
                                    placeholder="Enter points"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    disabled={updatingId === data._id}
                                    onClick={() => reviewTask(data._id, "accepted")}
                                    className="primary-btn"
                                >
                                    {updatingId === data._id ? "Updating..." : "Accept"}
                                </button>

                                <button
                                    disabled={updatingId === data._id}
                                    onClick={() => reviewTask(data._id, "rejected")}
                                    className="secondary-btn"
                                >
                                    Reject
                                </button>
                            </div>

                            {/* Status */}
                            {data.reviewStatus && (
                                <p className="text-xs mt-2">
                                    <span className="font-semibold">Status:</span>{" "}
                                    {data.reviewStatus}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewSubmission;