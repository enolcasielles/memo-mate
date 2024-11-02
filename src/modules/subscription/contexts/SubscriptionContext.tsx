"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import { useError } from "@/core/components/hooks/use-error";
import { Subscription } from "../types/subscription.types";
import {
  createCheckoutSessionAction,
  createPortalSessionAction,
} from "../actions/subscription.actions";

interface IContext {
  subscription: Subscription | null;
  handleManageSubscription: () => Promise<void>;
  handleSubscribe: () => Promise<void>;
}

const Context = createContext<IContext>(null);

export const useSubscription = () => useContext(Context);

interface Props {
  subscription: Subscription | null;
}

export default function SubscriptionProvider({
  subscription: initialSubscription,
  children,
}: PropsWithChildren<Props>) {
  const { showError } = useError();

  const handleManageSubscription = async () => {
    const [error, result] = await createPortalSessionAction();
    if (error) showError(error);
    else window.location.href = result.url;
  };

  const handleSubscribe = async () => {
    const [error, result] = await createCheckoutSessionAction();
    if (error) showError(error);
    else window.location.href = result.url;
  };

  const value: IContext = {
    subscription: initialSubscription,
    handleManageSubscription,
    handleSubscribe,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
