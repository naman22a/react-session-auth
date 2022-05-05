import User from './User';
import Errors from './Errors';

export default interface UserResponse {
    user: User;
    errors: Errors;
}
