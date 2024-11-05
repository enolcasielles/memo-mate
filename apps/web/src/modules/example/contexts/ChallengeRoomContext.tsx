"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useError } from "@/core/components/hooks/use-error";
import { ICustomError } from "@/core/errors/custom-error";
import { exampleAction, ExampleResponse } from "../actions/example.action";

interface IContext {
  result: ExampleResponse;
  action: (param: string) => void;
}

const Context = createContext<IContext>(null);

export const useExample = () => useContext(Context);

interface Props {
  result: ExampleResponse;
}

export default function ExampleProvider({
  result: initialResult,
  children,
}: PropsWithChildren<Props>) {
  const { showError } = useError();

  const [result, setResult] = useState<ExampleResponse>(initialResult);

  const action = async (param: string) => {
    const [error, result] = await exampleAction({ param });
    if (error) showError(error as ICustomError);
    else setResult(result);
  };

  const value: IContext = {
    result,
    action,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
