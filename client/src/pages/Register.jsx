import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate()
    const { register } = useAuth();

    const [role, setRole] = useState("VOLUNTEER"); // default
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        organizationName: "",
        organizationDescription: "",
        organizationType: "",
        organizationPhone: "",
        organizationEmail: "",
        organizationLocation: "",
        organizationLogo: null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        const { name, value, files } = e.target;
        if (files) {
            setForm((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const formData = new FormData();

        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        formData.append("email", form.email);
        formData.append("phoneNumber", form.phoneNumber);
        formData.append("password", form.password);

        if (role === "ADMIN") {
            formData.append("organizationName", form.organizationName);
            formData.append("organizationDescription", form.organizationDescription);
            formData.append("organizationType", form.organizationType);
            formData.append("organizationPhone", form.organizationPhone);
            formData.append("organizationEmail", form.organizationEmail);
            formData.append("organizationLocation", form.organizationLocation);

            if (form.organizationLogo) {
                formData.append("organizationLogo", form.organizationLogo);
            }
        }

        try {

            for (let pair of formData.entries()) {
                console.log(pair[0], ":", pair[1]);
            }

            await register(form);

            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => {
                navigate('/login');
            }, 1200);
        } catch (err) {
            setError("Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4">
            <div className="w-full max-w-2xl bg-white p-8 mx-auto rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create an Account
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Role */}
                    <div>
                        <div className="flex bg-gray-200 rounded-full p-1 w-64 mx-auto">
                            {/* Organizer */}
                            <button
                                type="button"
                                onClick={() => setRole("ADMIN")}
                                className={`cursor-pointer flex-1 py-2 text-center rounded-full transition-all font-medium
          ${role === "ADMIN" ? "bg-blue-600 text-white" : "text-gray-700"}
        `}
                            >
                                Organizer
                            </button>

                            {/* Volunteer */}
                            <button
                                type="button"
                                onClick={() => setRole("VOLUNTEER")}
                                className={`cursor-pointer flex-1 py-2 text-center rounded-full transition-all font-medium
          ${role === "VOLUNTEER" ? "bg-blue-600 text-white" : "text-gray-700"}
        `}
                            >
                                Volunteer
                            </button>
                        </div>
                    </div>

                    {/* Common fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    {/* Organizer fields */}
                    {role === "organizer" && (
                        <div className="space-y-4 border-t pt-4">
                            <input
                                type="text"
                                name="organizationName"
                                placeholder="Organization Name"
                                value={form.organizationName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <textarea
                                name="organizationDescription"
                                placeholder="Organization Description"
                                value={form.organizationDescription}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="organizationType"
                                placeholder="Organization Type"
                                value={form.organizationType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="organizationPhone"
                                placeholder="Organization Phone"
                                value={form.organizationPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="email"
                                name="organizationEmail"
                                placeholder="Organization Email"
                                value={form.organizationEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="organizationLocation"
                                placeholder="Organization Location"
                                value={form.organizationLocation}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="file"
                                name="organizationLogo"
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
