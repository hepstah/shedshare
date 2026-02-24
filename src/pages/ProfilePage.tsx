import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Nut } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { NutsHistory } from '@/components/nuts/NutsHistory'
import { useAuth } from '@/hooks/useAuth'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useNutsBalance, useNutsTransactions } from '@/hooks/useNuts'
import type { NotificationPrefs } from '@/types'

export function ProfilePage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const { data: nutsBalance } = useNutsBalance()
  const { data: transactions } = useNutsTransactions()

  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [nameInit, setNameInit] = useState(false)

  // Initialize form state once profile loads
  if (profile && !nameInit) {
    setDisplayName(profile.display_name)
    setPhone(profile.phone ?? '')
    setNameInit(true)
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
    return <p className="text-muted-foreground">Loading profile...</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile & Settings</h1>

      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="display-name" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone (for SMS notifications)
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 555-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
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
