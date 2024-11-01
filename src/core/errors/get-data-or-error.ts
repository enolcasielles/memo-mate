export const getDataOrError = async <T>(
  fetcher: Promise<any>,
): Promise<[Error, T]> => {
  try {
    const data = await fetcher;
    return [, data as T];
  } catch (error) {
    if (error instanceof Error) return [error, null];
    return [new Error("Se ha producido un error inesperado"), null];
  }
};
