"use client";

import { Button } from "../base/button";

function Error404() {
  return (
    <div className="">
      <div className="">
        <h1>404</h1>
        <h6>Oops!</h6>
        <p>No hemos encontrado la página que buscas</p>
        <div className="">
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

export default Error404;
