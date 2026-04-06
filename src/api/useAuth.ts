import { useState, useEffect, useCallback } from 'react';
import { getToken, setToken } from './client';
import { login as apiLogin, logout as apiLogout, getAuthUser, verify2FA, type AuthUser } from './endpoints';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorPending, setTwoFactorPending] = useState<string | null>(null); // email pending 2FA

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      getAuthUser()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    setTwoFactorPending(null);
    try {
      const result = await apiLogin(email, password);
      if ('two_factor_required' in result && result.two_factor_required) {
        setTwoFactorPending(email);
        return null;
      }
      setUser(result as AuthUser);
      return result as AuthUser;
    } catch (err: any) {
      const msg = err?.message || 'Erreur de connexion';
      try {
        const parsed = JSON.parse(msg);
        setError(parsed?.message || parsed?.errors?.email?.[0] || msg);
      } catch {
        setError(msg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyTwoFactor = useCallback(async (code: string) => {
    if (!twoFactorPending) throw new Error('No 2FA pending');
    setError(null);
    setLoading(true);
    try {
      const res = await verify2FA(twoFactorPending, code);
      setToken(res.token);
      setUser(res.user);
      setTwoFactorPending(null);
      return res.user;
    } catch (err: any) {
      setError('Code invalide');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [twoFactorPending]);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setTwoFactorPending(null);
  }, []);

  const isAuthenticated = !!user;
  const hasRole = useCallback((role: string) => user?.roles?.includes(role) ?? false, [user]);
  const hasPermission = useCallback((perm: string) => user?.permissions?.includes(perm) ?? false, [user]);
  const isAdmin = user?.roles?.some(r => ['super_admin', 'admin', 'admin_rh'].includes(r)) ?? false;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    twoFactorPending,
    login,
    verifyTwoFactor,
    logout,
    hasRole,
    hasPermission,
  };
}
