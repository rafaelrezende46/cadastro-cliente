import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ClienteListar from './pages/ClienteListar';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import ClienteDetalhe from './pages/ClienteDetalhe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Menu from './components/Menu';
import Relatorio from './pages/Relatorio';

const queryClient = new QueryClient()

setupIonicReact({
  mode: 'md'
});
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/clientes" />
            </Route>
            <Route path="/home" exact={true}>
              <Redirect to="/clientes" />
            </Route>
            <Route path="/clientes" exact={true}>
              <ClienteListar />
            </Route>
            <Route path="/clientes-inserir" exact={true}>
              <ClienteDetalhe />
            </Route>
            <Route path="/clientes/:id">
              <ClienteDetalhe />
            </Route>
            <Route path="/relatorios">
              <Relatorio />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default App;
