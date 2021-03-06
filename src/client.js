/* eslint-disable global-require */
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';

const isDevelopment = process.env.NODE_ENV === 'development';

export default async function clientEntry(clutchConfig = {}) {
  const { element, hooks } = clutchConfig;

  try {
    let result = element || null;

    if (isDevelopment) {
      result = <AppContainer>{result}</AppContainer>;
    }

    // Run entry definitions middleware
    const options = {
      element: result,
    };

    // client pre render hooks
    for (let i = 0; i < hooks.length; i += 1) {
      const clientHooks = hooks[i] || {};

      if (clientHooks.preRender) {
        // eslint-disable-next-line
        options.element = await clientHooks.preRender(options);
      }
    }

    if (isDevelopment) {
      ReactDOM.render(options.element, document.getElementById('root'));
    } else {
      ReactDOM.hydrate(options.element, document.getElementById('root'));
    }

    // client post render hooks
    for (let i = 0; i < hooks.length; i += 1) {
      const clientHooks = hooks[i] || {};

      if (clientHooks.postRender) {
        // eslint-disable-next-line
        await clientHooks.postRender(options);
      }
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }

  return undefined;
}
