import { useEffect } from 'react';
import Router from 'next/router';

export const useWarnIfUnsavedChanges = (unsavedChanges) => {
  const message = 'Please stop streaming before leaving the page';


    const routeChangeStart = url => {
      if (Router.asPath !== url && unsavedChanges && !confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);
        throw 'Abort route change. Please ignore this error.';
      }
    };

    const beforeunload = e => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', beforeunload);
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      Router.events.off('routeChangeStart', routeChangeStart);
    };

};