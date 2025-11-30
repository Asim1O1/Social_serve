import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

function CreateCampain() {
  const { user } = useAuth();
  const [fileInputs, setFileInputs] = useState([0]); // first file field

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

  const addFileInput = () => {
    setFileInputs((prev) => [...prev, prev.length]); // add next file field
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== "attachments") {
        formData.append(key, data[key]);
      }
    });

    // Append file(s)
    if (data.attachments && data.attachments.length > 0) {
      Array.from(data.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    }

    // Debug
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await api.post("/campaign", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Campaign created successfully!");
      reset();
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          setError(e.field, { message: e.message });
        });
      }
      console.log("Error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-5xl text-primary font-bold">Create Campaign</h1>

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
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
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

          {/* Multiple Files */}
          <div>
            <label className="block font-medium mb-1">Files</label>

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
          {!isSubmitting && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-btn disabled:opacity-50"
            >
              Submit
            </button>
          )}

          {isSubmitting && (
            <div className="w-fit">
              <Loading />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateCampain;
