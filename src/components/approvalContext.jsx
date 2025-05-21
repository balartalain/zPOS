import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useRouter } from 'expo-router';

const ApprovalContext = createContext(undefined);

export const ApprovalProvider = ({ children }) => {
  const [isGrantedApproval, setIsGrantedApproval] = useState(false);
  const router = useRouter();

  const setGrantedApproval = (value) => {
    setIsGrantedApproval(value);
  };

  useEffect(() => {
    //console.log('isGrantedApproval: ' + isGrantedApproval);
    if (isGrantedApproval) {
      window.setTimeout(() => {
        setIsGrantedApproval(false);
      }, 30000);
    }
  }, [isGrantedApproval]);
  const requestApproval = (targetRoute) => {
    if (!isGrantedApproval) {
      router.replace({ pathname: '/pinPad', params: { from: targetRoute } });
    } else {
      router.replace(targetRoute);
    }
  };

  return (
    <ApprovalContext.Provider
      value={{ isGrantedApproval, setGrantedApproval, requestApproval }}
    >
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = () => {
  const context = useContext(ApprovalContext);
  if (!context) {
    throw new Error('useApproval debe ser usado dentro de un ApprovalProvider');
  }
  return context;
};
