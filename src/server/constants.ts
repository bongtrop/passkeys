import { encode } from '../utils';

export enum WebAuthnType {
    Create = 'webauthn.create',
    Get = 'webauthn.get',
}

export const Origin = 'https://sth.sh';

export const HostDigest = crypto.subtle.digest(
    'SHA-256',
    encode(Origin.slice(8))
);
