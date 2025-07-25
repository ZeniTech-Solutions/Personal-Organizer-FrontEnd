import { jwtDecode } from "jwt-decode"

export function decodeJWT(token: string) {
    const decoded = jwtDecode(token);
    return decoded
}