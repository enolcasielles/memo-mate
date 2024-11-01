"use client";

import { Button } from "../base/button";

interface Props {
  message: string;
  buttonLabel?: string;
  buttonLink?: string;
  digest?: string;
}

function Error500({
  message,
  buttonLabel = "Recargar",
  buttonLink,
  digest,
}: Props) {
  return (
    <div className="">
      <div className="">
        <h1>ERROR</h1>
        <p>{message}</p>
        {digest && (
          <p>
            {" "}
            Código del error: <b>{digest}</b>{" "}
          </p>
        )}
        <div className="">
          <Button
            onClick={() => {
              if (buttonLink) window.location.href = buttonLink;
              else window.location.reload();
            }}
          >
            {buttonLabel}
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Ir a Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Error500;
