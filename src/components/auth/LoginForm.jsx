import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { toast } from "sonner";

export const LoginForm = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      toast.success('Login successful!');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-base">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
  <div className="relative">
    <Input
      id="password"
      name="password"
      type="password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      required
    />
  </div>
</div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleSignInButton 
            onSuccess={() => toast.success('Signed in with Google!')} 
          />
        </div>

        <div className="text-center space-y-3">
          <Button 
            variant="link" 
            onClick={onSwitchToForgotPassword}
            className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
          >
            Forgot your password?
          </Button>
          <div className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              onClick={onSwitchToRegister} 
              className="p-0 h-auto text-primary"
            >
              Sign up
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};