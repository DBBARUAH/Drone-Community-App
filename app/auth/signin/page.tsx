// app/auth/signup/page.tsx

"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Mail, Lock, User, Loader } from "lucide-react";
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from "@/lib/supabase";
import styles from '@/styles/signup.module.css';
import authStyles from '@/styles/auth.module.css';

interface SignUpForm {
  email: string;
  password: string;
  full_name: string;
  role: "client" | "provider";
}



export default function SignUpPage() {
const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SignUpForm>({
    email: "",
    password: "",
    full_name: "",
    role: "client",
  });

  // Handle regular email/password signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Using the updated signUp function that returns a tuple
      const [data, error] = await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        role: formData.role,
      });
      
      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
        // Successful signup, redirect to appropriate dashboard based on role
        const dashboardPath = formData.role === 'provider' 
          ? '/artist/dashboard' 
          : '/client/dashboard';
        router.push(dashboardPath);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "facebook") => {
    setLoading(true);
    setError("");
  
    try {
      if (provider === "google") {
        const [data, error] = await signInWithGoogle();
        if (error) {
          setError(error.message);
          return;
        }
      } else {
        setError("Facebook sign-in is not implemented yet");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during OAuth sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupSpecific}>
      <div className={authStyles.formContainer}>
        {/* Branding Section */}
        <div className={authStyles.brandingSection}>
          <div className={authStyles.logoContainer}>
            <Camera className={authStyles.logo} />
          </div>
          <h1 className={authStyles.brandTitle}>TravellerBeats</h1>
          <p className={authStyles.brandSubtitle}>Join the Drone Community</p>
        </div>

        {/* Sign Up Form */}
        <div className={styles.formSection}>
          <h2 className={authStyles.formTitle}>Create Account</h2>

          {error && (
            <div className={authStyles.errorMessage}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className={authStyles.inputGroup}>
            {/* Full Name Input */}
            <div>
              <label className={authStyles.inputLabel}>Full Name</label>
              <div className={authStyles.inputWrapper}>
                <User className={authStyles.inputIcon} />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className={authStyles.input}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className={authStyles.inputLabel}>Email Address</label>
              <div className={authStyles.inputWrapper}>
                <Mail className={authStyles.inputIcon} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={authStyles.input}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className={authStyles.inputLabel}>Password</label>
              <div className={authStyles.inputWrapper}>
                <Lock className={authStyles.inputIcon} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={authStyles.input}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className={styles.roleSelection}>
              <label className={styles.roleLabel}>I am a:</label>
              <div className={styles.roleOptions}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "client" })}
                  className={`${authStyles.roleButton} ${
                    formData.role === "client" ? authStyles.roleButtonActive : authStyles.roleButtonInactive
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "provider" })}
                  className={`${authStyles.roleButton} ${
                    formData.role === "provider" ? authStyles.roleButtonActive : authStyles.roleButtonInactive
                  }`}
                >
                  Provider
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={authStyles.submitButton}
            >
              {loading ? (
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" />
              ) : null}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* OAuth Sign Up */}
          <div className={authStyles.divider}>
            <div className={authStyles.dividerLine}>
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className={authStyles.dividerText}>
              <span className={authStyles.dividerTextInner}>Or continue with</span>
            </div>
          </div>

          <div className={authStyles.oauthSection}>
            <button
              onClick={() => handleOAuthSignUp("google")}
              className={authStyles.oauthButton}
            >
              <img src="/google.svg" alt="Google" className={authStyles.oauthIcon} />
              Google
            </button>
            <button
              onClick={() => handleOAuthSignUp("facebook")}
              className={authStyles.oauthButton}
            >
              <img src="/facebook.svg" alt="Facebook" className={authStyles.oauthIcon} />
              Facebook
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <p className={authStyles.footerText}>
          Already have an account?{" "}
          <Link href="/auth/signin" className={authStyles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}