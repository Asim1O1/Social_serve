import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

function CreateCampaign() {
  const navigate = useNavigate()
  const { user } = useAuth();
  const { id } = useParams();
  const [existingFiles, setExistingFiles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      date: "",
      attachments: [],
      createdBy: user?.id || sessionStorage.getItem("id"),
    },
  });

  const categories = ["Health", "Education", "Environment", "Social Work"];

  useEffect(() => {
    if (id) {
      const fetchCampaign = async () => {
        try {
          const { data } = await api.get(`/campaign/${id}`);
          reset({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            location: data.location || "",
            date: data.date?.split("T")[0] || "",
            attachments: [],
            createdBy: data.createdBy || user?.id || sessionStorage.getItem("id"),
          });
          setExistingFiles(data.attachments || []);
        } catch (err) {
          console.error("Failed to fetch campaign:", err);
          toast.error("Failed to load campaign data");
        }
      };
      fetchCampaign();
    }
  }, [id, reset, user]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "attachments") {
          formData.append(key, data[key]);
        }
      });

      if (data.attachments && data.attachments.length > 0) {
        Array.from(data.attachments).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const endpoint = id ? `/campaign/${id}` : "/campaign";
      const method = id ? "put" : "post";

      const res = await api[method](endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.message);
      navigate('/profile')
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) =>
          setError(e.field, { message: e.message })
        );
      } else {
        toast.error("Something went wrong!");
      }
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-5xl text-primary font-bold">
        {id ? "Edit Campaign" : "Create Campaign"}
      </h1>

      <div className="mt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 bg-white rounded-lg shadow"
        >
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className={
                "w-full border p-2 rounded " +
                (errors.title ? "border-red-500" : "border-border")
              }
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className={
                "w-full border p-2 rounded " +
                (errors.description ? "border-red-500" : "border-border")
              }
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className={
                "w-full border p-2 rounded " +
                (errors.category ? "border-red-500" : "border-border")
              }
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              {...register("location", { required: "Location is required" })}
              className={
                "w-full border p-2 rounded " +
                (errors.location ? "border-red-500" : "border-border")
              }
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className={
                "w-full border p-2 rounded " +
                (errors.date ? "border-red-500" : "border-border")
              }
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block font-medium mb-1">Attachments</label>

            {/* Show existing attachments */}
            {existingFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {existingFiles.map((file, index) => (
                  <div key={index} className="border p-2 rounded">
                    {file.type?.startsWith("image") ? (
                      <img
                        src={file.url}
                        alt={`attachment-${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.url.split("/").pop()}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              {...register("attachments")}
              className={
                "w-full border p-2 rounded " +
                (errors.attachments ? "border-red-500" : "border-border")
              }
            />
          </div>

          {/* Submit */}
          <div>
            {!isSubmitting ? (
              <button
                type="submit"
                className="primary-btn disabled:opacity-50"
                disabled={isSubmitting}
              >
                {id ? "Update" : "Create"} Campaign
              </button>
            ) : (
              <Loading />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCampaign;
