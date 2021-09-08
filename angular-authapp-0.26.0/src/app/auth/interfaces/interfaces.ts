

export interface AuthResponse {
    ok: boolean;
    uid?: string;
    name?: string;
    email?: string;
    token?: string;
    msg?: string;
} // ? opcionale . en todo caso la peticion devuele dos diferentes objectos , persona autenticado o err , la dif en props por eso usamos opcional

export interface Usuario {
    uid: string;
    name: string;
    email: string;
}
