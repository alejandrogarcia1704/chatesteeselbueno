import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';

import Login from './pages/Login';
import Chat from './pages/Chat';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

        <Route path="/" exact component={Login} />
        <Route path="/chat" exact component={Chat} />

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;