import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/componentss/ui/card';
import { Separator } from '@/componentss/ui/separator';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/componentss/ui/button';
import Logo from '@/assets/logo/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/componentss/ui/form';
import { Input } from '@/componentss/ui/input';
import { Checkbox } from '@/componentss/ui/checkbox';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../redux/slices/authSlice';
import { notify } from '@/hooks/toastUtils';
import { handleGoogleLogin } from '../../services/auth';

// Zod schema for validation
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  persistent: z.boolean()
});

type LoginFormValues = z.infer<typeof loginSchema>;

function AuthLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      persistent: localStorage.getItem('persistent') === 'true'
    }
  });

  useEffect(() => {
    const persistent = localStorage.getItem('persistent');
    if (persistent) {
      const data = JSON.parse(atob(persistent));
      form.reset(data);
    }
  }, [form]);

  useEffect(() => {
    const initializeGoogleLogin = () => {
      if (window['google']?.accounts.id) {
        window['google'].accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_SECRET_KEY,
          callback: async (response) => {
            try {
              const token = response.credential;
              const apiResponse = await handleGoogleLogin(token);
              const { data } = apiResponse;

              if (data.status) {
                localStorage.setItem(
                  'auth-token',
                  JSON.stringify(data.result.tokenDetail)
                );
                navigate('/');
                window.location.reload();
              } else {
                notify.error(data?.message || 'Oops! Something went wrong');
              }
            } catch (error) {
              console.error('Error during Google login:', error);
            }
          }
        });

        window['google'].accounts.id.renderButton(
          document.getElementById('google-login-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 300 // Set the desired width in pixels
          }
        );
      }
    };

    if (typeof window['google'] === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    } else {
      initializeGoogleLogin();
    }
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      console.log('Form Data:', data);
      await dispatch(userLogin(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#13122a] p-4 lg:w-1/2">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="flex flex-col items-start justify-start gap-y-0">
          <div className="text-xl font-bold text-secondary">DIGITAL</div>
          <div className="text-xl font-bold text-secondary">GLIDE</div>
        </div>
      </div>

      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login Button */}
          <div id="google-login-button" className="w-full"></div>

          <div className="flex items-center space-x-2">
            <Separator className="w-32" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="w-32" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <div
                          className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me */}
              <FormField
                control={form.control}
                name="persistent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="persistent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-primary data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="persistent"
                        className="text-sm font-normal"
                      >
                        Remember me
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex w-full justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-primary hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AuthLogin;
