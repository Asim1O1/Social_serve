import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../../axios/axios";
import { toast } from "react-toastify";

function TaskReviewPage() {
  const { campaignId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/task/campaigns/${campaignId}/tasks`);
      if (res.status === "success") {
        setTasks(res.data);
      } else {
        toast.error(res.message || "Failed to fetch tasks");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [campaignId]);

  // Update review status
  const updateReview = async (taskId, status) => {
    setUpdatingId(taskId);
    try {
      const res = await api.patch(`/tasks/submissions/${taskId}/review`, {
        status,
      });
      if (res.status === "success") {
        toast.success("Review updated");
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status } : t))
        );
      } else {
        toast.error(res.message || "Failed to update review");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-primary mb-2">Task Review</h2>
        <p className="text-gray-500 text-sm max-w-xl">
          Review tasks submitted for this campaign. Update attendance or approve/reject submissions.
        </p>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-sm border border-primary/20 p-5 flex flex-col gap-3 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-primary truncate">
                  {task.title}
                </h3>
                <span className="text-xs px-2 py-1 bg-primary/10 text-accent rounded-full">
                  {task.points} pts
                </span>
              </div>

              <p className="text-gray-700 text-sm">{task.description}</p>

              {task.attachments?.length > 0 && (
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  <span className="font-semibold text-sm">Attachments:</span>
                  {task.attachments.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm truncate"
                    >
                      {file.type ? file.type + " " : ""}Attachment {idx + 1}
                    </a>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {["Accepted", "Rejected", "Present", "Absent"].map((status) => (
                  <button
                    key={status}
                    disabled={updatingId === task._id}
                    onClick={() => updateReview(task._id, status)}
                    className={`px-3 py-1 text-sm rounded text-white font-semibold ${
                      status === "Accepted"
                        ? "bg-green-500"
                        : status === "Rejected"
                        ? "bg-red-500"
                        : status === "Present"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    } disabled:opacity-50`}
                  >
                    {updatingId === task._id ? "Updating..." : status}
                  </button>
                ))}
              </div>

              {task.status && (
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Current Status:</span>{" "}
                  {task.status}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskReviewPage;