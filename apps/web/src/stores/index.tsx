import { useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { RootStore } from './root-store';

const storeContext = React.createContext<RootStore | null>(null);

export const StoreProvider: React.FC = ({ children }) => {
  const store = useLocalObservable(() => new RootStore());

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = React.useContext(storeContext);

  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }

  return store;
};
