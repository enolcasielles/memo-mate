export const apiSuccess = (data: any) => {
  return new Response(JSON.stringify(data), { status: 200 });
};
