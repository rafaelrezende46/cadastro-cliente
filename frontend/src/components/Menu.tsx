import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from "@ionic/react";
import { documentText, person } from "ionicons/icons";

import "./Menu.css";

export default function Menu(){
    return (
        <IonMenu contentId="main" type="overlay" className="side-menu">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Cadastro de Clientes</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonList>
              <IonMenuToggle autoHide={false}>
                <IonItem routerLink="/clientes" routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={person} md={person} />
                  <IonLabel>Clientes</IonLabel>
                </IonItem>
                <IonItem routerLink="/relatorios" routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={documentText} md={documentText} />
                  <IonLabel>Relatórios</IonLabel>
                </IonItem>
              </IonMenuToggle>
              </IonList>
            </IonContent>
          </IonMenu>
    )
}