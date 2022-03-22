import { MultipleUsersAction, UsersState } from '../../types/User.actionTypes';

const initialState: UsersState = {
  users: [],
};

// eslint-disable-next-line default-param-last
const userReducer = (state = initialState, action: MultipleUsersAction) => {
  switch (action.type) {
    case 'GET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'GET_USER_BY_ID':
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;