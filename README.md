> This documentation is nowhere near finished - but here's the [article that inspired this repo](https://dev.to/mpocock1/how-to-manage-global-state-with-xstate-and-react-3if5).

# XState Next Boilerplate

The officially recommended way to get started with [XState](https://xstate.js.org/) and [Next.js](https://nextjs.org/).

## Features

### Predictable state management

XState is the industry-leading tool for managing state with statecharts. Visualise your app's logic before you even write a line of code.

### Best practices built in

Want to cut down on re-renders? Use the best of React and XState's `useSelector` to make your app performant and robust.

## Important Files

#### [`createXStateContext.ts`](./src/lib/createXStateContext.ts)

#### [`globalState.machine.ts`](./src/machines/globalState.machine.ts)

#### [`_app.tsx`](./src/pages/_app.tsx)

#### [`Layout.tsx`](./src/lib/Layout.tsx)

## Things I plan to add

### Generators

[React Boilerplate](https://github.com/react-boilerplate/react-boilerplate) uses [PlopJS](https://plopjs.com/) to write generators. It was one of the things that made me fall in love with DX, so I'd love to add it here.

### Tests

I'd love to write a simple structure for unit testing your machines (if required), and also showing off [`@xstate/test`](https://xstate.js.org/docs/packages/xstate-test/).
