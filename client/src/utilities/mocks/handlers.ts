// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';
import users from './db-data/users-db-data.json';

const baseUrl = process.env.REACT_APP_BASE_URL || '/api';

const handlers = [
  rest.get(`${baseUrl}/users/`, (req, res, ctx) => res(
    ctx.json(users),
  )),
];

export default handlers;
