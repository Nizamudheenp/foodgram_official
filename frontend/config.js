
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const BASE_URL = isLocalhost
  ? 'http://localhost:5000'
  : 'https://foodgram-official.onrender.com';

