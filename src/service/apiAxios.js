import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'https://suasivesugar-us.backendless.app/api',
  // Configuración base
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
// handle timeout error
// if (error.code === 'ECONNABORTED') {
//   console.error('La solicitud excedió el tiempo límite.');
// } else {
//   console.error('Error general:', error.message);
// }

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
      //console.log(error.response.data);
    } else if (error.request) {
      // No hubo respuesta del servidor
      //console.log('No se recibió respuesta del servidor:', error.request);
    } else {
      // Otro error relacionado con la configuración
      //console.log('Error al configurar la solicitud:', error.message);
    }

    // Lanza el error si necesitas manejarlo en otros lugares
    return Promise.reject(error);
  }
);

export default apiAxios;
