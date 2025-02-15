"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ Initialize router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("Registration successful! Redirecting...");

      router.push("/dashboard"); // ✅ Redirect to dashboard or login page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center">Register</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mt-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mt-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mt-2"
        />
        
        <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
