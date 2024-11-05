import { ICustomError } from "@/core/errors/custom-error";
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
