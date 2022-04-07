import handleError from '../helper/apiErrorHandling';
import { User } from '../types/User';

const baseUrl = process.env.REACT_APP_BASE_URL || '/api';

const userApi = {

  getAllUsers: () => fetch(`${baseUrl}/users/`)
    .then((response) => {
      if (response.status < 300) {
        const result = response.json();
        return result;
      }
      throw Error('Server error');
    })
    .catch(handleError),

  getUserById: (id: number) => fetch(`${baseUrl}/users/${id}`)
    .then((response) => {
      if (response.status < 300) {
        const result = response.json();
        return result;
      }
      throw Error('Server error');
    })
    .catch(handleError),

  editUserData: (userid: number, user: User) => fetch(`${baseUrl}/users/${userid}`, {
    method: 'PUT',
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

  editUserPassword: (userid: number, passwordData: {password_old:string, password_new:string}) => fetch(`${baseUrl}/users/${userid}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
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

  getUserCreatedEvents: (id: number) => fetch(`${baseUrl}/users/${id}/events/created`)
    .then((response) => {
      if (response.status < 300) {
        return response.json();
      }
      throw Error('Server error');
    })
    .catch(handleError),

  getUserParticipatingEvents: (id: number) => fetch(`${baseUrl}/users/${id}/events/participating`)
    .then((response) => {
      if (response.status < 300) {
        return response.json();
      }
      throw Error('Server error');
    })
    .catch(handleError),
};

export default userApi;
