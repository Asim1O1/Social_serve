import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";

function SubmitTaskForm() {
  const { taskId } = useParams();
  console.log("the task id is", taskId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const submitTask = async (data) => {
    try {
      const formData = new FormData();

      formData.append("summary", data.summary);

      if (data.proofFiles?.length) {
        for (let file of data.proofFiles) {
          formData.append("proof", file);
        }
      }

      const res = await api.post(
        `/task/tasks/${taskId}/submissions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Task submitted successfully");
      reset();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to submit task";

      toast.error(message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto m-8 p-4 bg-white rounded">
      <form onSubmit={handleSubmit(submitTask)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-xl">Title</label>
          <input
            {...register("title")}
            className="bg-white outline-0 focus:ring-primary ring ring-secondary p-2 rounded"
            placeholder="Enter Title"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-xl">Summary</label>
          <textarea
            {...register("summary", { required: true })}
            className="bg-white outline-0 focus:ring-primary ring ring-secondary p-2 rounded"
            placeholder="Explain what you did..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-xl">Proof Files</label>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("proofFiles")}
            className="bg-white outline-0 focus:ring-primary ring ring-secondary p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-4 py-2 rounded mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Task"}
        </button>
      </form>
    </div>
  );
}

export default SubmitTaskForm;
