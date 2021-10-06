import { AuthRoutes, GuestRoutes } from '@lib/shared';
import { observer } from 'mobx-react-lite';
import { syncHistoryWithStore } from 'mobx-react-router';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { App } from './pages';
import { LoginPage } from './pages/Login';
import { useStore } from './stores';

export const Routes = observer(() => {
  const rootStore = useStore();
  const history = useHistory();

  useEffect(() => {
    syncHistoryWithStore(history, rootStore.routingStore);
  }, [history, rootStore.routingStore]);

  if (rootStore.auth.authStorage.token) return <AuthRouter />;

  return <GuestRouter />;
});

export const GuestRouter: React.FC = observer(() => {
  return (
    <Switch>
      <Route exact path={GuestRoutes.Login}>
        <LoginPage />
      </Route>

      <Redirect to={GuestRoutes.Login} />
    </Switch>
  );
});

export const AuthRouter: React.FC = observer(() => {
  return (
    <Switch>
      <Route exact path={AuthRoutes.Root}>
        <App />
      </Route>

      <Redirect to={AuthRoutes.Root} />
    </Switch>
  );
});
