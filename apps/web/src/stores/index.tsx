import { Nullable } from '@lib/shared';
import { useLocalObservable } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { RootStore } from './root-store';

const storeContext = React.createContext<Nullable<RootStore>>(null);

export const StoreProvider: React.FC = ({ children }) => {
  const store = useLocalObservable(() => new RootStore());

  useEffect(() => {
    return () => store.dispose();
  }, [store]);

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = React.useContext(storeContext);

  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }

  return store;
};
