import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { toast } from "sonner";

export const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
    return checks;
  };

  const passwordChecks = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.password_confirmation;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success('Account created successfully!');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {text}
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up to start managing your finances</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="text"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            {formData.password && (
              <div className="mt-2 p-3 bg-muted rounded-md space-y-1">
                <div className="text-sm font-medium mb-2">Password Requirements:</div>
                <PasswordRequirement met={passwordChecks.length} text="At least 8 characters" />
                <PasswordRequirement met={passwordChecks.uppercase} text="One uppercase letter" />
                <PasswordRequirement met={passwordChecks.lowercase} text="One lowercase letter" />
                <PasswordRequirement met={passwordChecks.number} text="One number" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="text"
              placeholder="Confirm your password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
            
            {formData.password_confirmation && (
              <div className={`flex items-center gap-2 text-sm mt-1 ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
                {passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignInButton onSuccess={() => toast.success('Account created with Google!')} />
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" onClick={onSwitchToLogin} className="p-0">
              Sign in
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};