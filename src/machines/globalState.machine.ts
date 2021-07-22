import { assign } from "xstate";
import { createModel } from "xstate/lib/model";
import { createXStateContext } from "../lib/createXStateContext";

/**
 * Create a typesafe model for your app's global state
 */
export const globalStateModel = createModel(
  {
    username: null as string | null,
  },
  {
    events: {
      LOG_IN: (username: string, password: string) => ({ username, password }),
      LOG_OUT: () => ({}),
    },
  },
);

/**
 * Create a machine based on the model above
 *
 * This also adds a check based on whether we're server side
 * or client side, because for this example we use localStorage
 * to store whether the client is logged in or not
 */
export const globalStateMachine = globalStateModel.createMachine({
  id: "globalState",
  initial: "checkingIfServerSide",
  states: {
    checkingIfServerSide: {
      always: [
        {
          cond: () => {
            return typeof window === "undefined";
          },
          target: "complete",
        },
        {
          target: "checkingIfLoggedIn",
        },
      ],
    },
    checkingIfLoggedIn: {
      always: [
        {
          cond: () => {
            return Boolean(localStorage.getItem(GLOBAL_STATE_KEY));
          },
          actions: assign((context, event) => {
            return {
              username: localStorage.getItem(GLOBAL_STATE_KEY),
            };
          }),
          target: "loggedIn",
        },
        {
          target: "loggedOut",
        },
      ],
    },
    loggedIn: {
      exit: [
        () => localStorage.removeItem(GLOBAL_STATE_KEY),
        assign((ctx) => {
          return {
            username: null,
          };
        }),
      ],
      on: {
        LOG_OUT: {
          target: "loggedOut",
        },
      },
    },
    loggedOut: {
      on: {
        LOG_IN: {
          target: "loggedIn",
          actions: [
            (ctx, event) => {
              localStorage.setItem(GLOBAL_STATE_KEY, event.username);
            },
            assign((context, event) => {
              return {
                username: event.username,
              };
            }),
          ],
        },
      },
    },
    complete: {
      type: "final",
    },
  },
});

export const [
  GlobalStateProvider,
  useGlobalStateService,
  useSelectedGlobalState,
  createGlobalStateSelector,
] = createXStateContext(globalStateMachine);

/** Selectors */
export const getUserUsername = createGlobalStateSelector(
  (state) => state.context.username,
);

export const getIsLoggedIn = createGlobalStateSelector((state) =>
  state.matches("loggedIn"),
);

export const getIsLoggedOut = createGlobalStateSelector((state) =>
  state.matches("loggedOut"),
);

const GLOBAL_STATE_KEY = "GLOBAL_STATE_KEY";
