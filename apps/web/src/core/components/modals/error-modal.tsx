"use client";

import { PropsWithChildren } from "react";
import { Dialog, DialogContent } from "../base/dialog";
import { useErrorsContext } from "@/core/contexts/ErrorsContext";

interface Props {}

const ErrorModal = ({}: PropsWithChildren<Props>) => {
  const { isShowing, error, hideError } = useErrorsContext();

  return (
    <Dialog
      open={isShowing}
      onOpenChange={(open) => {
        if (!open) hideError();
      }}
    >
      <DialogContent>
        <h1>ERROR</h1>
        <p>{error}</p>
        <div className="">
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Recargar
          </button>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Ir a Inicio
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorModal;
