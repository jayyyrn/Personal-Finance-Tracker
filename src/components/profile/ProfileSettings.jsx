import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Download, 
  Trash2,
  Save,
  LogOut,
  X,
  Shield,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "sonner";

export const ProfileSettings = ({ onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorSMS: false,
    loginAlerts: true
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    budget_warnings: true,
    monthly_reports: false,
    marketing_emails: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passwordData.password !== passwordData.password_confirmation) {
      setError('New passwords do not match');
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      toast.error('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Add password update API call here
      toast.success('Password updated successfully!');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to update password');
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySettingUpdate = async (key, value) => {
    const updated = { ...securitySettings, [key]: value };
    setSecuritySettings(updated);
    
    try {
      // Add security settings update API call here
      toast.success('Security settings updated');
    } catch (err) {
      toast.error('Failed to update security settings');
    }
  };

  const handleNotificationUpdate = async (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    
    try {
      // Add notification settings update API call here
      toast.success('Notification settings updated');
    } catch (err) {
      toast.error('Failed to update notification settings');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      // Add account deletion API call here
      await logout();
      toast.success('Account deleted successfully');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Profile Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'security' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'notifications' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('account')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'account' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    <span>Account</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          placeholder="Demo User"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          placeholder="demo@example.com"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Account Status</Label>
                        <div className="pt-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <Mail className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm min-h-[80px] resize-none"
                        rows="3"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Finance enthusiast and budgeting expert"
                      />
                      <p className="text-xs text-muted-foreground">
                        Provide a brief and engaging profile summary
                      </p>
                    </div>

                    <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Update Section */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Update Password</CardTitle>
                    <CardDescription>
                      Change your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input
                          id="current_password"
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                          placeholder="Enter current password"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={passwordData.password}
                          onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                          placeholder="Enter new password"
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use 8+ characters with a mix of letters, numbers & symbols
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                        <Input
                          id="password_confirmation"
                          type="password"
                          value={passwordData.password_confirmation}
                          onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                          placeholder="Confirm new password"
                          className="w-full"
                        />
                      </div>

                      <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800 text-white">
                        <Lock className="mr-2 h-4 w-4" />
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication Section */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Receive verification codes via SMS
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={securitySettings.twoFactorSMS}
                          onChange={(e) => handleSecuritySettingUpdate('twoFactorSMS', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Login Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified of new sign-ins to your account
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => handleSecuritySettingUpdate('loginAlerts', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about account activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    email_alerts: {
                      title: 'Email Alerts',
                      description: 'Receive important account notifications via email'
                    },
                    budget_warnings: {
                      title: 'Budget Warnings',
                      description: 'Get notified when you approach or exceed budget limits'
                    },
                    monthly_reports: {
                      title: 'Monthly Reports',
                      description: 'Receive monthly financial summary reports'
                    },
                    marketing_emails: {
                      title: 'Marketing Emails',
                      description: 'Receive updates about new features and tips'
                    }
                  }).map(([key, config]) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{config.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notifications[key]}
                          onChange={(e) => handleNotificationUpdate(key, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Data Export</CardTitle>
                    <CardDescription>
                      Download your financial data and reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download All Transaction Data (CSV)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Monthly Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Budget Analysis (PDF)
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-destructive rounded-lg">
                      <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete My Account
                      </Button>
                    </div>

                    <Button 
                      variant="outline"
                      onClick={logout}
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};