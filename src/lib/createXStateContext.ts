import { useSelector } from "@xstate/react";
import { createContext, useContext as useReactContext } from "react";
import { ActorRefFrom, StateFrom, StateMachine } from "xstate";

/**
 * Creates a global state wrapper you can use
 * to pass XState through your app
 */
export function createXStateContext<
  TMachine extends StateMachine<any, any, any>,
>(machine: TMachine) {
  /**
   * Creates a React context containing an ActorRef
   */
  const context = createContext<ActorRefFrom<TMachine> | null>(null);
  /**
   * By default, the display name for this context
   * is the machine's id.
   */
  context.displayName = machine.id;

  /**
   * Grabs the running service directly from the context,
   * useful for when you want to send events to the service.
   */
  const useContext = () => {
    const ctx = useReactContext(context);
    if (!ctx) {
      throw new Error(
        `use${machine.id}Context must be used inside ${machine.id}Provider`,
      );
    }
    return ctx;
  };

  /**
   * Grab a selected portion of the running service using
   * xstate/react's useSelector
   *
   * https://xstate.js.org/docs/packages/xstate-react/#useselector-actor-selector-compare-getsnapshot
   */
  const useSelectedContext = <T>(
    selector: (state: StateFrom<TMachine>) => T,
  ): T => {
    const service = useContext();
    return useSelector(service, selector);
  };

  /**
   * Create a selector which you can later pass in to
   * useSelectedContext above. This function does nothing
   * except provide a useful wrapper for type definitions
   */
  const createSelector = <T>(selector: (state: StateFrom<TMachine>) => T) => {
    return selector;
  };

  /**
   * Returns a tuple of the items above so you can freely
   * name them based on context
   */
  return [
    context.Provider,
    useContext,
    useSelectedContext,
    createSelector,
  ] as const;
}
