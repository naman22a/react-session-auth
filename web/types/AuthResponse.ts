import Errors from './Errors';

export default interface AuthResponse {
    ok: boolean;
    errors: Errors;
}
