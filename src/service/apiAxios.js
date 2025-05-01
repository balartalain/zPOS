import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'https://suasivesugar-us.backendless.app/api',
  // Configuración base
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejar respuestas con errores
apiAxios.interceptors.response.use(
  (response) => {
    // Procesa respuestas exitosas (opcional)
    return response;
  },
  (error) => {
    if (error.response) {
      // Error en la respuesta del servidor
      // console.error('Código de estado:', error.response.status);
      console.error(error.response.data);
    } else if (error.request) {
      // No hubo respuesta del servidor
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Otro error relacionado con la configuración
      console.error('Error al configurar la solicitud:', error.message);
    }

    // Lanza el error si necesitas manejarlo en otros lugares
    return Promise.reject(error);
  }
);

export default apiAxios;
