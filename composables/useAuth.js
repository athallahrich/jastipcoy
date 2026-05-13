export const useAuth = () => {
  const user = useState('auth_user', () => null);

  const syncUser = () => {
    if (process.client) {
      const stored = localStorage.getItem('jastiper_user');
      user.value = stored ? JSON.parse(stored) : null;
    }
  };

  const login = (userData) => {
    localStorage.setItem('jastiper_user', JSON.stringify(userData));
    user.value = userData;
  };

  const logout = () => {
    localStorage.removeItem('jastiper_user');
    user.value = null;
  };

  return {
    user,
    syncUser,
    login,
    logout
  };
};
