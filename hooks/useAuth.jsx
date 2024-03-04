import { createContext, useContext, useState, useEffect } from 'react';

import { useRouter } from 'next/router';


const AuthContext = createContext({});



const AuthProvider = ({ children }) => {


  const [data, setData] = useState({});
  const [temporaryToken, setTemporaryToken] = useState({});

  const signIn = ({ token, user }) => {
    if (token) {
      localStorage.setItem(
        'openlogin_store',
        JSON.stringify({
          sessionId: token.sessionId,
        })
      );
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    setData((prev) => ({
      ...prev,
      ...(token && { token }),
      ...(user && { user }),
    }));
  };

  const signOut = () => {
    localStorage.clear();
      window.location = '/'
  };

  const updateProfile = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setData((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('openlogin_store'));
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token?.sessionId || !user) {
      // router.push('/auth/join');
      return;
    }

    if (token && user) {
      setData({ user, token });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        signIn,
        signOut,
        updateProfile,
        temporaryToken,
        setTemporaryToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { AuthProvider, useAuth };
