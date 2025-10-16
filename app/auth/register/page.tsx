'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useTranslation } from '@/lib/contexts/i18n-context';

export default function RegisterPage() {
  const router = useRouter();
  const { setLoading, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const t = useTranslation();

  const registerSchema = z.object({
    username: z.string().min(1, t('errors.required')).min(3, t('errors.usernameTooShort')).max(30, t('errors.usernameTooLong')).regex(/^[a-zA-Z0-9_]+$/, t('errors.usernameInvalid')),
    name: z.string().min(1, t('errors.required')).min(3, t('errors.nameTooShort')).max(100, t('errors.nameTooLong')),
    phoneNumber: z.string().min(1, t('errors.required')).regex(/^\+?[0-9]{7,15}$/, t('errors.invalidPhone')),
    email: z.string().min(1, t('errors.required')).email(t('errors.invalidEmail')),
    password: z.string().min(1, t('errors.required')).min(8, t('errors.passwordTooShort')).regex(/[A-Z]/, t('errors.passwordUppercase')).regex(/[a-z]/, t('errors.passwordLowercase')).regex(/[0-9]/, t('errors.passwordNumber')).regex(/[^\w\s]/, t('errors.passwordSpecial')),
    confirmPassword: z.string().min(1, t('errors.confirmPassword')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('errors.passwordsDoNotMatch'),
    path: ["confirmPassword"],
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('name', values.name);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('email', values.email);
      formData.append('password', values.password);
      
      // Add avatar file if selected
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await authApi.register(formData);
      
      if (response.data.success) {
        // Registration successful - redirect to login
        toast.success(t('auth.registerSuccess'));
        router.push('/auth/login');
      } else {
        toast.error(response.data.message || t('errors.generic'));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('errors.generic');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 items-center ">
      {/* Left Side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10 max-w-7xl mx-auto">
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{t('auth.createAccount')}</CardTitle>
                <p className="text-muted-foreground">
                  {t('auth.joinAndShop')}
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.firstName')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="text" 
                                  placeholder={t('auth.enterFullName')} 
                                  disabled={isSubmitting}
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Avatar Upload */}
                      <div className="space-y-2">
                        <Label>{t('auth.profilePicture')}</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {avatarPreview ? (
                              <div className="relative">
                                <img
                                  src={avatarPreview}
                                  alt="Avatar preview"
                                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                                />
                                <button
                                  type="button"
                                  onClick={removeAvatar}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                                <User className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              id="avatar"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                              disabled={isSubmitting}
                            />
                            <label
                              htmlFor="avatar"
                              className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              {avatarFile ? t('auth.changePicture') : t('auth.uploadPicture')}
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Max 5MB, JPG/PNG/GIF
                            </p>
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="text" 
                                  placeholder="Choose a username" 
                                  disabled={isSubmitting}
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="tel" 
                                  placeholder="Enter your phone number" 
                                  disabled={isSubmitting}
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="email" 
                                  placeholder="Enter your email" 
                                  disabled={isSubmitting}
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Create a password"
                                  disabled={isSubmitting}
                                  className="pl-10 pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={isSubmitting}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                            {form.watch("password") && (
                              <div className="text-xs space-y-1 mt-2">
                                <p className="font-medium">Password requirements:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                  <li className={form.watch("password").length >= 8 ? "text-green-600" : ""}>
                                    • At least 8 characters
                                  </li>
                                  <li className={/[A-Z]/.test(form.watch("password")) ? "text-green-600" : ""}>
                                    • One uppercase letter
                                  </li>
                                  <li className={/[a-z]/.test(form.watch("password")) ? "text-green-600" : ""}>
                                    • One lowercase letter
                                  </li>
                                  <li className={/\d/.test(form.watch("password")) ? "text-green-600" : ""}>
                                    • One number
                                  </li>
                                  <li className={/[^\w\s]/.test(form.watch("password")) ? "text-green-600" : ""}>
                                    • One special character
                                  </li>
                                </ul>
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="Confirm your password"
                                  disabled={isSubmitting}
                                  className="pl-10 pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  disabled={isSubmitting}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        id="agree-terms"
                        name="agree-terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="agree-terms" className="text-sm text-muted-foreground">
                        {t('auth.agreeToTerms')}{' '}
                        <Link href="/terms" className="font-medium text-primary hover:text-primary/80">
                          {t('common.terms')}
                        </Link>{' '}
                        {t('common.and')}{' '}
                        <Link href="/privacy" className="font-medium text-primary hover:text-primary/80">
                          {t('common.privacy')}
                        </Link>
                      </label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('auth.creatingAccount')}
                        </>
                      ) : (
                        t('auth.createAccount')
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
                      {t('auth.signIn')}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Left Side - Image */}
      <div className="bg-muted relative hidden lg:block flex items-end justify-start h-screen w-full">
        <Image
          src="/Somali-Kid.jpg"
          alt="Bulaale Baby Care"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

