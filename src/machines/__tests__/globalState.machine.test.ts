import { interpret } from "xstate";
import {
  getIsLoggedIn,
  getIsLoggedOut,
  getUserUsername,
  globalStateMachine,
} from "../globalState.machine";

/**
 * This file is an example of unit testing a machine. This
 * is not always recommended - but if you like unit tests
 * this setup will serve you well.
 */
describe("globalStateMachine", () => {
  describe("When there is a username in localStorage", () => {
    it("Should log you in automatically", () => {
      /**
       * Monkey patch window and localStorage
       */
      global.window = {} as any;
      global.localStorage = { getItem: () => "username" } as any;

      const service = interpret(globalStateMachine).start();

      /**
       * We test our code using our selectors declared
       * alongside the machine
       */
      expect(getIsLoggedIn(service.state)).toEqual(true);
      expect(getUserUsername(service.state)).toEqual("username");
    });
  });

  describe("When there is no username in localStorage", () => {
    it("Should keep you logged out", () => {
      global.window = {} as any;
      global.localStorage = { getItem: () => null } as any;

      const service = interpret(globalStateMachine).start();

      expect(getIsLoggedOut(service.state)).toEqual(true);
    });
  });

  it("Should allow you to log in when logged out", () => {
    const setItemMock = jest.fn();
    global.window = {} as any;
    global.localStorage = { getItem: () => null, setItem: setItemMock } as any;

    const service = interpret(globalStateMachine).start();

    service.send({
      type: "LOG_IN",
      username: "new-username",
      password: "pw",
    });

    expect(getIsLoggedIn(service.state)).toEqual(true);
    /**
     * Expect the second parameter of the first call
     * of localStorage.setItem to equal 'new-username'
     */
    expect(setItemMock.mock.calls[0][1]).toEqual("new-username");
    /**
     * Expect the new username to be in context
     */
    expect(getUserUsername(service.state)).toEqual("new-username");
  });

  it("Should allow you to log out when logged in", () => {
    const removeItemMock = jest.fn();
    global.window = {} as any;
    global.localStorage = {
      getItem: () => "username",
      removeItem: removeItemMock,
    } as any;

    const service = interpret(globalStateMachine).start();

    service.send({
      type: "LOG_OUT",
    });

    expect(getIsLoggedOut(service.state)).toEqual(true);
    /**
     * Expect that the username has been removed from localStorage
     */
    expect(removeItemMock).toHaveBeenCalled();
    /**
     * Expect that the username has been removed from context
     */
    expect(getUserUsername(service.state)).toEqual(null);
  });
});
