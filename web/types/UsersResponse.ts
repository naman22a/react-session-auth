import Users from './Users';
import Errors from './Errors';

export default interface UsersResponse {
    users: Users;
    errors: Errors;
}
