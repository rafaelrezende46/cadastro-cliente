import { useState } from 'react';
import {
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonLoading,
    IonMenuButton,
    IonPage,
    IonProgressBar,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import relatorioService, { Periodo } from '../data/relatorio-service';

const currencyFormat = Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });

const Relatorio: React.FC = () => {
    const [periodo, setPeriodo] = useState<Periodo>('hoje');

    const maiorIdadeQuery = useQuery({
        queryKey: ['Relatorio.MaiorIdade', periodo],
        queryFn: () => relatorioService.maiorIdade({ periodo }),
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    const classeQuery = useQuery({
        queryKey: ['Relatorio.Classe', periodo],
        queryFn: () => relatorioService.classes({ periodo }),
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    return (
        <IonPage>
            <IonHeader translucent>
                <ResponsiveContainer>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Relatórios</IonTitle>
                    </IonToolbar>
                </ResponsiveContainer>
                {(maiorIdadeQuery.isFetching || classeQuery.isFetching) && <IonProgressBar type="indeterminate" />}
            </IonHeader>
            <IonContent fullscreen>
                <ResponsiveContainer>
                    <IonSegment value={periodo} onIonChange={(e: any) => setPeriodo(e.target.value)}>
                        <IonSegmentButton value="hoje">Hoje</IonSegmentButton>
                        <IonSegmentButton value="esta_semana">Esta Semana</IonSegmentButton>
                        <IonSegmentButton value="este_mes">Este Mês</IonSegmentButton>
                    </IonSegment>

                    <IonGrid>
                        <IonRow>
                            <IonCol sizeXs="12" sizeMd="6">
                                <IonCard className="ion-no-margin">
                                    <IonCardHeader>
                                        <IonCardTitle>Clientes Maiores de Idade</IonCardTitle>
                                        <IonCardSubtitle>Com renda acima da média: {maiorIdadeQuery.data?.rendaMedia !== undefined ? currencyFormat.format(maiorIdadeQuery.data?.rendaMedia) : '-'}</IonCardSubtitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <h1>Qtde: {maiorIdadeQuery.data?.qtdeMaiorIdade}</h1>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol sizeXs="12" sizeMd="6">
                                <IonCard className="ion-no-margin">
                                    <IonCardHeader>
                                        <IonCardTitle>Clientes por Classe</IonCardTitle>
                                        <IonCardSubtitle>Quantidade</IonCardSubtitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonGrid className="ion-no-padding">
                                            <IonRow>
                                                <IonCol><IonText color="danger"><h1>A: {classeQuery.data?.qtdeClasseA}</h1></IonText></IonCol>
                                                <IonCol><IonText color="warning"><h1>B: {classeQuery.data?.qtdeClasseB}</h1></IonText></IonCol>
                                                <IonCol><IonText color="success"><h1>C: {classeQuery.data?.qtdeClasseC}</h1></IonText></IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </ResponsiveContainer>
            </IonContent>
        </IonPage>
    );
};

export default Relatorio;
