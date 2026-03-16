import { Loader2, Upload, X, ClipboardList, Star, Paperclip, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";

function CreateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", description: "", points: "" });
  const [attachments, setAttachments] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments(files);
    const imagePreviews = files
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setPreviews(imagePreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.points === "" || Number(formData.points) < 0)
      newErrors.points = "Enter a valid number of points (≥ 0)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("points", Number(formData.points));
      for (const file of attachments) data.append("attachments", file);
      const res = await api.post(`/task/campaigns/${id}/tasks`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.status === "success") {
        toast.success(res.data.message || "Task created successfully");
        navigate(-1);
      } else {
        toast.error(res.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const nonImageFiles = attachments.filter((f) => !f.type.startsWith("image/"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to campaign
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-primary/6 border border-primary/10 overflow-hidden">

          {/* ── Header ── */}
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border-b border-primary/10">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-accent/8 blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                  Create New Task
                </h2>
                <p className="mt-1 text-gray-500 text-sm leading-relaxed">
                  Add a task to this campaign — volunteers will see it and can submit proof of completion.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6">

            {/* ── Title ── */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Clean the local park trails"
                className={`w-full px-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white outline-none transition-all duration-200
                  ${errors.title
                    ? "border-red-300 focus:border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-primary/60 hover:border-gray-300"
                  }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* ── Description ── */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe what volunteers need to do, any requirements, location, deadline..."
                className={`w-full px-4 py-3 rounded-xl border-2 resize-y min-h-[130px] text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white outline-none transition-all duration-200
                  ${errors.description
                    ? "border-red-300 focus:border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-primary/60 hover:border-gray-300"
                  }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* ── Points ── */}
            <div className="space-y-1.5">
              <label htmlFor="points" className="block text-sm font-semibold text-gray-700">
                Points Awarded <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full sm:w-48">
                <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  id="points"
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="e.g. 50"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white outline-none transition-all duration-200
                    ${errors.points
                      ? "border-red-300 focus:border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-primary/60 hover:border-gray-300"
                    }`}
                />
              </div>
              {errors.points && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.points}
                </p>
              )}
              <p className="text-xs text-gray-400">Volunteers earn these points upon task approval.</p>
            </div>

            {/* ── Attachments ── */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Attachments
                <span className="ml-2 text-xs font-normal text-gray-400">Optional</span>
              </label>

              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  onDragEnter={() => setDragOver(true)}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={() => setDragOver(false)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all duration-200
                  ${dragOver
                    ? "border-primary bg-primary/8 scale-[1.01]"
                    : attachments.length
                      ? "border-primary/40 bg-primary/4"
                      : "border-gray-200 hover:border-primary/40 hover:bg-gray-50 bg-gray-50/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-5 h-5 text-primary/70" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-primary">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Images, PDFs, documents · Max 10MB per file</p>
                </div>
              </div>

              {/* Image previews */}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/15 shadow-sm group"
                    >
                      <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Non-image file list */}
              {nonImageFiles.length > 0 && (
                <div className="space-y-2">
                  {nonImageFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <Paperclip size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-600 truncate">{file.name}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-3"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ClipboardList className="w-4 h-4" />
                    Create Task
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] disabled:opacity-60 transition-all"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;