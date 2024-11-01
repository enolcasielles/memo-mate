import { CustomError } from "../errors/custom-error";

export const apiError = (error: CustomError) => {
  const errorJson = error.toJSON();
  return new Response(JSON.stringify(errorJson), {
    status: error.statusCode,
  });
};
