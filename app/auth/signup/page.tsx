"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Mail, Lock, Loader } from "lucide-react";
import { useAuth } from '@/providers/AuthProvider';
import styles from '@/styles/auth.module.css';

export default function SignInPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form submission for email/password sign-in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signIn(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth sign-in (Google/Facebook)
  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      console.error("OAuth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.formContainer}>
        {/* Branding Section */}
        <div className={styles.brandingSection}>
          <div className={styles.logoContainer}>
            <Camera className={styles.logo} />
          </div>
          <h1 className={styles.brandTitle}>TravellerBeats</h1>
          <p className={styles.brandSubtitle}>Connect with the Drone Community</p>
        </div>

        {/* Sign In Form */}
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Sign In</h2>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.inputGroup}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className={styles.inputLabel}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={styles.input}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className={styles.inputLabel}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={styles.input}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={styles.forgotPasswordRow}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  id="remember-me"
                />
                <span>Remember me</span>
              </label>
              <Link 
                href="/auth/reset-password" 
                className={styles.forgotPasswordLink}
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading && (
                <Loader 
                  className={styles.buttonLoader}
                  aria-hidden="true"
                  size={20}
                />
              )}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* OAuth Sign In */}
          <div className={styles.dividerSection}>
            <span className={styles.dividerText}>Or continue with</span>
          </div>

          <div className={styles.socialAuth}>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className={styles.socialButton}
              disabled={loading}
            >
              <img 
                src="/google.svg" 
                alt="" 
                className={styles.socialIcon} 
                aria-hidden="true"
              />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("facebook")}
              className={styles.socialButton}
              disabled={loading}
            >
              <img 
                src="/facebook.svg" 
                alt="" 
                className={styles.socialIcon} 
                aria-hidden="true"
              />
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className={styles.footerText}>
          Don't have an account?{" "}
          <Link href="/auth/signup" className={styles.footerLink}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}