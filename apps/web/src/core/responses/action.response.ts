import { ICustomError } from "../errors/custom-error";

export type ActionResponse<T> = Promise<[ICustomError, T]>;
