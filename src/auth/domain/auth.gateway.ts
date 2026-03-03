import { type SessionPort } from "./session.port";
import { type SignInPort } from "./sign-in.port";
import { type SignOutPort } from "./sign-out.port";
import { type SignUpPort } from "./sign-up.port";

export type AuthGateway = SignUpPort & SignInPort & SignOutPort & SessionPort;
