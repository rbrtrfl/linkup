import { User } from '../types/User';

const baseUrl = process.env.REACT_APP_BASE_URL || '/api';

const authApi = {

  login: (user: User) => fetch(`${baseUrl}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status < 300) {
        const result = response.json();
        return result;
      }
      return response;
    })
    .catch((e) => {
      e.ok = false;
      e.status = 503;
      return (e);
    }),

  register: (user: User) => fetch(`${baseUrl}/auth/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status < 300) {
        return response.json();
      }
      return response;
    })
    .catch((e) => {
      e.ok = false;
      e.status = 503;
      return (e);
    }),

  // TODO: logout
};

export default authApi;
