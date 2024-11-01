interface ApiErrorProps {
  status?: number;
}

export const apiError = ({ status = 500, ...error }: any & ApiErrorProps) => {
  return new Response(JSON.stringify(error), {
    status,
  });
};
