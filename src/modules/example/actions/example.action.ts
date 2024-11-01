import { buildCustomError, CustomError } from "@/core/errors/custom-error";
import { ActionResponse } from "@/core/responses/action.response";

export interface ExampleRequest {
  param: string;
}

export interface ExampleResponse {
  result: string;
}

export async function exampleAction({
  param,
}: ExampleRequest): Promise<ActionResponse<ExampleResponse>> {
  try {
    const result = await f(param);
    return [null, result];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [
      {
        message: "Se ha producido un error al ejecutar el ejemplo",
      },
      null,
    ];
  }
}

const f = async (param: string): Promise<ExampleResponse> => {
  return {
    result: param,
  };
};
