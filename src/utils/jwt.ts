
import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '../types';

/**
 * Decodifica un token JWT y devuelve su payload.
 * @param token El token JWT a decodificar.
 * @returns El payload del token con la información del usuario.
 */
export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token); // metodo que desglosa el token
};

