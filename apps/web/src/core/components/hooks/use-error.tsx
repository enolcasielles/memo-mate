import { ICustomError } from "@memomate/core";
import { useToast } from "./use-toast";

export const useError = () => {
  const { toast } = useToast();

  return {
    showError: (error: ICustomError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  };
};
