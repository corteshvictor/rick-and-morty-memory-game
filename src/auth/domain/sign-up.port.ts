import { type AuthResult, type Credentials } from "./auth.model";

export interface SignUpPort {
	signUp(credentials: Credentials): Promise<AuthResult>;
}
