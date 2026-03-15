import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, LogOut, Nut } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { NutsHistory } from '@/components/nuts/NutsHistory'
import { getInitials } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile'
import { useNutsBalance, useNutsTransactions } from '@/hooks/useNuts'
import type { NotificationPrefs } from '@/types'

export function ProfilePage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { data: profile, isLoading, error } = useProfile()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const { data: nutsBalance } = useNutsBalance()
  const { data: transactions } = useNutsTransactions()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [nameInit, setNameInit] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Initialize form state once profile loads
  useEffect(() => {
    if (profile && !nameInit) {
      setDisplayName(profile.display_name)
      setPhone(profile.phone ?? '')
      setNameInit(true)
    }
  }, [profile, nameInit])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previousPreview = avatarPreview ?? profile?.avatar_url ?? null

    // Show local preview immediately
    setAvatarPreview(URL.createObjectURL(file))

    try {
      const url = await uploadAvatar.mutateAsync(file)
      setAvatarPreview(url)
      await updateProfile.mutateAsync({ avatar_url: url })
      toast.success('Avatar updated!')
    } catch (err) {
      setAvatarPreview(previousPreview) // revert preview
      toast.error(err instanceof Error ? err.message : 'Failed to upload avatar.')
    }

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSaveProfile = () => {
    if (!displayName.trim()) {
      toast.error('Display name is required.')
      return
    }

    updateProfile.mutate(
      {
        display_name: displayName.trim(),
        phone: phone.trim() || null,
      },
      {
        onSuccess: () => toast.success('Profile updated!'),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  const handleTogglePref = (key: keyof NotificationPrefs) => {
    if (!profile) return
    const newPrefs = { ...profile.notification_prefs, [key]: !profile.notification_prefs[key] }
    updateProfile.mutate(
      { notification_prefs: newPrefs },
      {
        onSuccess: () => toast.success('Preferences updated!'),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
        {/* Card skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg border bg-muted" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Failed to load profile: {error.message}
      </p>
    )
  }

  const displayedAvatar = avatarPreview ?? profile?.avatar_url ?? null
  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    : null

  return (
    <div className="space-y-6">
      {/* Header with avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20 text-2xl">
            {displayedAvatar && <AvatarImage src={displayedAvatar} alt={profile?.display_name} />}
            <AvatarFallback className="text-lg">
              {profile ? getInitials(profile.display_name) : '?'}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile?.display_name}</h1>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          {memberSince && (
            <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
          )}
          {uploadAvatar.isPending && (
            <p className="text-xs text-muted-foreground">Uploading...</p>
          )}
        </div>
      </div>

      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (for SMS notifications)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 555-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Nuts balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Nut className="h-4 w-4" />
            Nuts Balance: {nutsBalance ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <NutsHistory transactions={transactions} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No transactions yet. Earn nuts by lending tools!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile && (
            <>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={profile.notification_prefs.email}
                  onCheckedChange={() => handleTogglePref('email')}
                />
                Email notifications
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={profile.notification_prefs.sms}
                  onCheckedChange={() => handleTogglePref('sms')}
                />
                SMS notifications
              </label>

              <Separator />

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={profile.notification_prefs.borrow_requests}
                  onCheckedChange={() => handleTogglePref('borrow_requests')}
                />
                Borrow requests
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={profile.notification_prefs.request_responses}
                  onCheckedChange={() => handleTogglePref('request_responses')}
                />
                Request responses (approved/declined)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={profile.notification_prefs.return_reminders}
                  onCheckedChange={() => handleTogglePref('return_reminders')}
                />
                Return reminders
              </label>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sign out */}
      <Button variant="outline" className="text-destructive" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  )
}
