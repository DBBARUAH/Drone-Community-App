"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader, Divider, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react"
import { AlertTriangle, Trash2, Lock, User, Mail, Shield } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Debug user information
  useEffect(() => {
    if (user) {
      console.log("Current user data:", user);
      console.log("User ID (sub):", user.sub);
    }
  }, [user]);

  // Function to delete the user's Auth0 account
  async function deleteAccount() {
    try {
      setIsDeleting(true)
      setError(null)
      
      if (!user || !user.sub) {
        throw new Error("User information not available")
      }
      
      // Request to delete account API endpoint with user ID
      const response = await fetch(`/api/user/delete-account?userId=${encodeURIComponent(user.sub)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error("Delete account failed:", data)
        // Show a more detailed error message
        throw new Error(
          data.error || 
          `Failed to delete account (${response.status}): This might be due to missing permissions. Check server logs.`
        )
      }

      console.log("Delete account succeeded:", data)
      
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
        <p>Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex gap-3">
            <User size={24} />
            <div>
              <p className="text-md font-semibold">Profile Information</p>
              <p className="text-small text-default-500">Manage your personal information</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Name</p>
              <p className="text-foreground">{user?.name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <p className="text-foreground">{user?.email || "Not provided"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-sm font-medium">Email verified:</p>
              <p className={`text-foreground ${user?.email_verified ? "text-success" : "text-warning"}`}>
                {user?.email_verified ? "Yes" : "No"}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <Shield size={24} />
            <div>
              <p className="text-md font-semibold">Account Security</p>
              <p className="text-small text-default-500">Manage your account security</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            {user?.sub?.startsWith('google-oauth2|') || user?.sub?.startsWith('apple|') ? (
              <div>
                <p className="text-sm font-medium mb-1">Login Method</p>
                <p className="text-foreground flex items-center gap-2">
                  {user.sub.startsWith('google-oauth2|') ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Signed in with Google
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 100 100">
                        <path d="M65.87,50.3c-0.08-8.11,6.63-12.07,6.94-12.25c-3.8-5.56-9.68-6.31-11.77-6.38c-4.97-0.51-9.77,2.97-12.3,2.97 c-2.56,0-6.46-2.92-10.62-2.83c-5.44,0.08-10.51,3.22-13.31,8.13c-5.74,9.96-1.46,24.66,4.07,32.72c2.73,3.91,5.94,8.29,10.15,8.14 c4.09-0.17,5.63-2.62,10.57-2.62c4.89,0,6.31,2.62,10.59,2.53c4.39-0.08,7.16-3.94,9.81-7.88c3.13-4.48,4.41-8.9,4.47-9.13 C74.32,63.53,65.97,60.11,65.87,50.3z" fill="black"/>
                        <path d="M59.02,30.35c2.22-2.73,3.73-6.48,3.32-10.26c-3.21,0.14-7.17,2.16-9.47,4.84c-2.04,2.39-3.86,6.27-3.38,9.95 C53.01,35.17,56.72,33.09,59.02,30.35z" fill="black"/>
                      </svg>
                      Signed in with Apple
                    </>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  To manage your {user.sub.startsWith('google-oauth2|') ? 'Google' : 'Apple'} account security settings, please visit your {user.sub.startsWith('google-oauth2|') ? (
                    <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Google Account Settings
                    </a>
                  ) : (
                    <a href="https://appleid.apple.com/account/manage" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Apple ID Settings
                    </a>
                  )}.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium mb-1">Password</p>
                  <p className="text-foreground">••••••••••</p>
                </div>
                <div>
                  <Button 
                    color="primary" 
                    variant="flat" 
                    startContent={<Lock size={16} />}
                    onClick={() => window.location.href = "/api/auth/login?screen_hint=password_reset"}
                  >
                    Reset Password
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex gap-3 text-danger">
            <AlertTriangle size={24} className="text-danger" />
            <div>
              <p className="text-md font-semibold">Danger Zone</p>
              <p className="text-small text-default-500">Irreversible account actions</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="p-4 border border-danger-200 rounded-lg bg-danger-50 dark:bg-danger-900/20">
              <h3 className="text-lg font-medium text-danger mb-2">Delete Account</h3>
              <p className="text-sm text-default-700 dark:text-default-500 mb-4">
                This action is irreversible. Once deleted, all your data will be permanently removed.
              </p>
              <Button 
                color="danger" 
                variant="flat"
                startContent={<Trash2 size={16} />}
                onClick={onOpen}
              >
                Delete Account
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-danger">Delete Account</ModalHeader>
              <ModalBody>
                <p>
                  This action <strong>cannot be undone</strong>. This will permanently delete your account
                  and remove all your data from our servers.
                </p>
                <p className="font-medium mt-2">
                  Please type <span className="font-bold">delete my account</span> to confirm:
                </p>
                <Input
                  autoFocus
                  placeholder="delete my account"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  color={error ? "danger" : "default"}
                  errorMessage={error}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={deleteAccount}
                  isDisabled={confirmText !== "delete my account" || isDeleting}
                  isLoading={isDeleting}
                >
                  Delete Forever
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
} 