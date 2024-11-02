"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import { useError } from "@/core/components/hooks/use-error";
import { Subscription } from "../types/subscription.types";
import { createPortalSessionAction } from "../actions/create-portal-session.action";
import { createCheckoutSessionAction } from "../actions/create-checkout-session.action";

interface IContext {
  subscription: Subscription | null;
  manageSubscription: () => Promise<void>;
  activateSubscription: () => Promise<void>;
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

  const manageSubscription = async () => {
    const [error, result] = await createPortalSessionAction();
    if (error) showError(error);
    else window.location.href = result.url;
  };

  const activateSubscription = async () => {
    const [error, result] = await createCheckoutSessionAction();
    if (error) showError(error);
    else window.location.href = result.url;
  };

  const value: IContext = {
    subscription: initialSubscription,
    manageSubscription,
    activateSubscription,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
