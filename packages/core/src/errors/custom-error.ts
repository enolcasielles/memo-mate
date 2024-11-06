export interface ICustomError {
  type?: string;
  message?: string;
  statusCode?: number;
}

export class CustomError {
  type: string;
  statusCode: number;
  message: string;

  constructor({
    type = "UnexpectedError",
    message = "Ha ocurrido un error inesperado",
    statusCode = 500,
  }: ICustomError) {
    this.type = type;
    this.message = message;
    this.statusCode = statusCode;
  }

  static fromJSON(json: ICustomError): CustomError {
    return new CustomError(json);
  }

  toJSON(): ICustomError {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export const buildCustomError = (error: CustomError): ICustomError => {
  return error.toJSON();
};
