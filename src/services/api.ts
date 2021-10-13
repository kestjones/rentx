import axios from 'axios';

const api = axios.create({

  baseURL: 'http://192.168.5.54:3333',

});

// mudou de export default api para {api} so para importar usando chaves e manter um padrao
export { api } ; 