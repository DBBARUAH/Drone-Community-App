"use client";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setMessage("If your email is registered, you will receive a reset link.");
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Send Reset Link</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}