'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Package, Edit, Save, X, AlertCircle, Upload, Lock, Eye, EyeOff, Key, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authApi, orderApi, Order, getImageUrl } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/contexts/i18n-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authApi.me();
      if (response.data.success) {
        const userData = response.data.user;
        console.log('User data received:', userData);
        
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || userData.phonenumber || '',
          address: userData.address || '',
        });
        
        console.log('Form data initialized:', {
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || userData.phonenumber || '',
          address: userData.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getMyOrders();
      if (response.data.success) {
        setOrders(response.data.data.slice(0, 5)); // Show only recent 5 orders
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrderId(orderId);
      const response = await orderApi.cancelMyOrder(orderId, cancelReason);
      
      if (response.data.success) {
        toast({
          title: t('profile.orderCancelled'),
          description: t('profile.orderCancelledSuccess'),
        });
        
        // Refresh orders list
        await fetchOrders();
        setCancelReason('');
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel order';
      toast({
        title: t('profile.cancellationFailed'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.status === 'PENDING';
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Get current user phone (handle both 'phone' and 'phonenumber' fields)
      const currentPhone = user?.phone || user?.phonenumber || '';
      
      // Prepare the data to send (only include changed fields)
      const updateData: { name?: string; email?: string; phone?: string; address?: string } = {};
      
      if (formData.name !== user?.name) updateData.name = formData.name;
      if (formData.email !== user?.email) updateData.email = formData.email;
      if (formData.phone !== currentPhone) updateData.phone = formData.phone;
      if (formData.address !== user?.address) updateData.address = formData.address;
      
      // Check if there are changes or avatar file
      const hasChanges = Object.keys(updateData).length > 0 || avatarFile;
      
      if (!hasChanges) {
        setIsEditing(false);
        toast({
          title: t('profile.noChanges'),
          description: t('profile.alreadyUpToDate'),
        });
        return;
      }
      
      console.log('Profile update data:', {
        updateData,
        hasAvatar: !!avatarFile,
        avatarName: avatarFile?.name,
        avatarSize: avatarFile?.size,
        currentFormData: formData,
        currentUserData: {
          name: user?.name,
          email: user?.email,
          phone: user?.phone || user?.phonenumber,
          address: user?.address
        }
      });
      
      let response;
      
      // If there's an avatar file, use FormData
      if (avatarFile) {
        const formDataToSend = new FormData();
        
        // Add form fields (only if they have values)
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            formDataToSend.append(key, value);
          }
        });
        
        // Add avatar file
        formDataToSend.append('avatar', avatarFile);
        
        console.log('Sending FormData with avatar');
        response = await authApi.updateProfile(formDataToSend);
      } else {
        // No avatar, use regular JSON
        console.log('Sending JSON data:', updateData);
        response = await authApi.updateProfile(updateData);
      }
      
      console.log('API Response:', response);
      
      // Handle successful response
      if (response.data && response.data.success) {
        console.log('Profile update successful:', response.data.data);
        
        // Update local user state with the response data
        const updatedUser = response.data.data;
        setUser(updatedUser);
        
        // Update form data to match the updated user data
        setFormData({
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || updatedUser.phonenumber || '',
          address: updatedUser.address || '',
        });
        
        setIsEditing(false);
        setAvatarFile(null);
        
        toast({
          title: t('profile.profileUpdated'),
          description: t('profile.profileSaved'),
        });
      } else {
        console.error('Profile update failed:', response.data);
        const errorMessage = response.data?.message || response.data?.error || 'Failed to update profile';
        toast({
          title: t('profile.updateFailed'),
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      // Extract error message from different possible response structures
      let errorMessage = 'Failed to update profile';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('profile.updateFailed'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || user?.phonenumber || '',
      address: user?.address || '',
    });
    setIsEditing(false);
    setAvatarFile(null);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Form input changed: ${field} = "${value}"`);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        minLength: password.length < minLength,
        noUpperCase: !hasUpperCase,
        noLowerCase: !hasLowerCase,
        noNumbers: !hasNumbers,
        noSpecialChar: !hasSpecialChar,
      }
    };
  };

  const handlePasswordSave = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast({
        title: t('profile.passwordRequired'),
        description: t('profile.enterCurrentPassword'),
        variant: "destructive",
      });
      return;
    }

    if (!passwordData.newPassword) {
      toast({
        title: t('profile.passwordRequired'),
        description: t('profile.enterNewPassword'),
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t('profile.passwordMismatch'),
        description: t('profile.passwordsDoNotMatch'),
        variant: "destructive",
      });
      return;
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      toast({
        title: t('profile.passwordInvalid'),
        description: t('profile.passwordRequirements'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPasswordSaving(true);

      const response = await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        toast({
          title: t('profile.passwordChanged'),
          description: t('profile.passwordChangedSuccess'),
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
      } else {
        toast({
          title: t('profile.passwordChangeFailed'),
          description: response.data.message || t('profile.passwordChangeError'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      const message = error.response?.data?.error || error.message || t('profile.passwordChangeError');
      toast({
        title: t('profile.passwordChangeFailed'),
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('profile.pleaseLogin')}</h1>
        <p className="text-gray-600 mb-8">{t('profile.loginRequired')}</p>
        <Button asChild>
          <a href="/auth/login">{t('common.login')}</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile.myProfile')}</h1>
          <p className="text-gray-600">{t('profile.manageAccount')}</p>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {t('profile.editProfile')}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? t('common.saving') : t('profile.saveChanges')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t('profile.basicInformation')}</span>
              </CardTitle>
              <CardDescription>
                {t('profile.personalInfoDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.firstName')}</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('profile.enterFullName')}
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded-md">
                      {user.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={t('profile.enterEmail')}
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded-md">
                      {user.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('auth.phone')}</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={t('profile.enterPhone')}
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded-md">
                      {user.phone || t('profile.notProvided')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t('checkout.address')}</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={t('profile.enterAddress')}
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded-md">
                      {user.address || t('profile.notProvided')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>{t('profile.profilePicture')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20" key={`${user.avatar || user.id}-${avatarFile ? 'uploading' : 'current'}`}>
                  <AvatarImage
                    src={(() => {
                      if (avatarFile) {
                        return URL.createObjectURL(avatarFile);
                      }
                      if (user.avatar) {
                        return getImageUrl(user.avatar);
                      }
                      return "";
                    })()}
                    alt={user.name}
                    onError={(e) => {
                      console.log('Avatar image failed to load:', e);
                    }}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  {isEditing && (
                    <div className="mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="text-sm"
                      />
                      {avatarFile && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {avatarFile.name} {t('profile.selected')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>{t('profile.changePassword')}</span>
              </CardTitle>
              <CardDescription>
                {t('profile.passwordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('profile.password')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('profile.lastChanged')}: {user.updatedAt ? formatDate(user.updatedAt) : t('profile.unknown')}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {t('profile.changePassword')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        placeholder={t('profile.enterCurrentPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        placeholder={t('profile.enterNewPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordData.newPassword && (
                      <div className="text-xs space-y-1">
                        <p className="font-medium">{t('profile.passwordRequirements')}:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li className={passwordData.newPassword.length >= 8 ? "text-green-600" : ""}>
                            • {t('profile.atLeast8Characters')}
                          </li>
                          <li className={/[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                            • {t('profile.oneUppercaseLetter')}
                          </li>
                          <li className={/[a-z]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                            • {t('profile.oneLowercaseLetter')}
                          </li>
                          <li className={/\d/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                            • {t('profile.oneNumber')}
                          </li>
                          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                            • {t('profile.oneSpecialCharacter')}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('profile.confirmNewPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        placeholder={t('profile.confirmNewPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordData.confirmPassword && (
                      <p className={`text-xs ${
                        passwordData.newPassword === passwordData.confirmPassword 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {passwordData.newPassword === passwordData.confirmPassword 
                          ? `✓ ${t('profile.passwordsMatch')}` 
                          : `✗ ${t('profile.passwordsDoNotMatch')}`
                        }
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={handlePasswordCancel}
                      disabled={isPasswordSaving}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      onClick={handlePasswordSave}
                      disabled={isPasswordSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isPasswordSaving ? t('profile.changing') : t('profile.changePassword')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('profile.recentOrders')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Order #{order.orderCode}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} • ${order.grandTotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/order/${order.orderCode}`}>{t('profile.view')}</a>
                        </Button>
                        {canCancelOrder(order) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <X className="h-4 w-4 mr-1" />
{t('profile.cancel')}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Order #{order.orderCode}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this order? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="cancel-reason-profile">Reason for cancellation (optional)</Label>
                                  <Input
                                    id="cancel-reason-profile"
                                    placeholder="Enter reason for cancellation..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                  />
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={cancellingOrderId === order.id}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <a href="/orders">View All Orders</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                  <Button asChild>
                    <a href="/products">Start Shopping</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{t('profile.accountStatus')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('profile.role')}</span>
                <Badge variant="secondary">
                  {t('profile.customer')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('profile.status')}</span>
                <Badge variant="default">{t('profile.active')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('profile.userId')}</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {user.id}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Account Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{t('profile.accountDates')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('profile.memberSince')}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              {user.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('profile.lastUpdated')}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(user.updatedAt)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.contactInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('auth.email')}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('auth.phone')}</p>
                  <p className="text-sm text-gray-600">{user.phone || t('profile.notProvided')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('checkout.address')}</p>
                  <p className="text-sm text-gray-600">{user.address || t('profile.notProvided')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/orders">
                  <Package className="h-4 w-4 mr-2" />
                  {t('profile.viewAllOrders')}
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/products">
                  <Package className="h-4 w-4 mr-2" />
                  {t('profile.continueShopping')}
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('profile.contactSupport')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
