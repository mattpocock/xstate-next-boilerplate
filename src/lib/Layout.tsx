import React from "react";
import {
  getIsLoggedIn,
  getIsLoggedOut,
  getUserUsername,
  useGlobalStateService,
  useSelectedGlobalState,
} from "../machines/globalState.machine";

export const Layout: React.FC = ({ children }) => {
  /**
   * Grab the global state service
   */
  const globalStateService = useGlobalStateService();

  /**
   * Grab the selected information. Instead of re-rendering
   * on every state change, this component will only re-render
   * whenever the value of these items change
   */
  const username = useSelectedGlobalState(getUserUsername);
  const isLoggedIn = useSelectedGlobalState(getIsLoggedIn);
  const isLoggedOut = useSelectedGlobalState(getIsLoggedOut);

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <div>{username}</div>
        {isLoggedIn && (
          <button
            onClick={() =>
              globalStateService.send({
                type: "LOG_OUT",
              })
            }
          >
            Log Out
          </button>
        )}
        {isLoggedOut && (
          <button
            onClick={() => {
              globalStateService.send({
                type: "LOG_IN",
                password: "password",
                username: "username",
              });
            }}
          >
            Log In
          </button>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
};
