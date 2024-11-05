export interface BasicResponse {
  success: boolean;
}

export const successResponse = (): BasicResponse => ({
  success: true,
});
