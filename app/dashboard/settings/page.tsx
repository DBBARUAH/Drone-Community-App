"use client"

import { useState } from "react"
import { AlertTriangle, Trash2, Lock, User, Shield, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"

export default function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, isLoading } = useAuth()

  // Function to delete the user's account
  async function deleteAccount() {
    try {
      setIsDeleting(true)
      setError(null)

      if (!user || !user.sub) {
        throw new Error("User information not available")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, make an actual API call:
      // const response = await fetch(`/api/user/delete-account?userId=${encodeURIComponent(user.sub)}`, {
      //   method: "DELETE",
      //   headers: {
      //     "Content-Type": "application/json",
      //   }
      // })
      // const data = await response.json()
      // if (!response.ok) throw new Error(data.error || "Failed to delete account")

      // Account deleted successfully, redirect to logout
      window.location.href = "/api/auth/logout?returnTo=/?deleted=true"
    } catch (err) {
      console.error("Delete account error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  const isSocialLogin = user?.sub?.startsWith("google-oauth2|") || user?.sub?.startsWith("apple|")

  return (
    <div className="space-y-6 py-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Name</p>
              <p>{user?.name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <p>{user?.email || "Not provided"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-sm font-medium">Email verified:</p>
              {user?.email_verified ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                >
                  Not Verified
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            {isSocialLogin ? (
              <div>
                <p className="text-sm font-medium mb-1">Login Method</p>
                <div className="flex items-center gap-2">
                  {user?.sub?.startsWith("google-oauth2|") ? (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google Account
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      <svg width="16" height="16" viewBox="0 0 100 100">
                        <path
                          d="M65.87,50.3c-0.08-8.11,6.63-12.07,6.94-12.25c-3.8-5.56-9.68-6.31-11.77-6.38c-4.97-0.51-9.77,2.97-12.3,2.97 c-2.56,0-6.46-2.92-10.62-2.83c-5.44,0.08-10.51,3.22-13.31,8.13c-5.74,9.96-1.46,24.66,4.07,32.72c2.73,3.91,5.94,8.29,10.15,8.14 c4.09-0.17,5.63-2.62,10.57-2.62c4.89,0,6.31,2.62,10.59,2.53c4.39-0.08,7.16-3.94,9.81-7.88c3.13-4.48,4.41-8.9,4.47-9.13 C74.32,63.53,65.97,60.11,65.87,50.3z"
                          fill="currentColor"
                        />
                        <path
                          d="M59.02,30.35c2.22-2.73,3.73-6.48,3.32-10.26c-3.21,0.14-7.17,2.16-9.47,4.84c-2.04,2.39-3.86,6.27-3.38,9.95 C53.01,35.17,56.72,33.09,59.02,30.35z"
                          fill="currentColor"
                        />
                      </svg>
                      Apple ID
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  To manage your {user?.sub?.startsWith("google-oauth2|") ? "Google" : "Apple"} account security
                  settings, please visit your{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() =>
                      window.open(
                        user?.sub?.startsWith("google-oauth2|")
                          ? "https://myaccount.google.com/security"
                          : "https://appleid.apple.com/account/manage",
                        "_blank",
                      )
                    }
                  >
                    {user?.sub?.startsWith("google-oauth2|") ? "Google Account Settings" : "Apple ID Settings"}
                  </Button>
                  .
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium mb-1">Password</p>
                  <p>••••••••••</p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/api/auth/login?screen_hint=password_reset")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Delete Account</AlertTitle>
              <AlertDescription>
                This action is irreversible. Once deleted, all your data will be permanently removed.
              </AlertDescription>
              <Button variant="destructive" className="mt-4" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action <strong>cannot be undone</strong>. This will permanently delete your account and remove all
              your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="font-medium">
              Please type <span className="font-bold">delete my account</span> to confirm:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteAccount}
              disabled={confirmText !== "delete my account" || isDeleting}
              className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

