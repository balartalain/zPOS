import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { useApproval } from './approvalContext'; // Asegúrate de la ruta correcta

const withApproval = (WrappedComponent) => {
  const WithApproval = (props) => {
    const router = useRouter();
    const { isGrantedApproval, setGrantedApproval, requestApproval } = useApproval();
    const [hasRequestedApproval, setHasRequestedApproval] = useState(false);
    const params = useLocalSearchParams();    
    const currentRoute = usePathname();
    useEffect(() => {
      if (!isGrantedApproval && !hasRequestedApproval) {
        setHasRequestedApproval(true);
        const queryString = new URLSearchParams(params).toString();
        requestApproval(`${currentRoute}?${queryString}`); // Pasa el nombre de la ruta actual
      }
    }, [isGrantedApproval, hasRequestedApproval, router, setGrantedApproval, requestApproval]);

    if (!isGrantedApproval) {
      // No renderizar el componente protegido hasta que esté autenticado
      return null; // O puedes mostrar un indicador de carga o un mensaje
    }

    return <WrappedComponent {...props} />;
  };

  return WithApproval;
};

export default withApproval;