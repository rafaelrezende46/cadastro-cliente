import { useCallback, useMemo, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonProgressBar,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonAlert,
  useIonRouter,
  useIonViewWillEnter
} from '@ionic/react';
import './ClienteListar.css';
import { add, trash } from 'ionicons/icons';
import clienteService from '../data/cliente-service';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ErrorMessage } from '../components/ErrorMessage';
import { ResponsiveContainer } from '../components/ResponsiveContainer';

const currencyFormat = Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });

const paginaTamanho = 20;

function obterClasse(renda: number) {
  if (renda <= 980) {
    return 'classe-a';
  }

  if (renda >= 980.01 && renda <= 2500) {
    return 'classe-b';
  }

  return 'classe-c';
}

const Home: React.FC = () => {
  const [pesquisa, setPesquisa] = useState('');

  const router = useIonRouter();

  const [presentAlert] = useIonAlert();

  const clientesQuery = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['Cliente.Listar', pesquisa],
    refetchOnWindowFocus: false,
    queryFn: ({ pageParam }) => clienteService.listar({ pesquisa, pagina: pageParam, paginaTamanho }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.clientes.length < paginaTamanho)
        return null;

      return pages.length + 1
    },
  });

  const removerCliente = useMutation({
    mutationFn: (id: number | string) => clienteService.remover(id),
    onSuccess: () => clientesQuery.refetch()
  });

  useIonViewWillEnter(() => {
    clientesQuery.refetch();
  });

  const onInfinite = useCallback(async (e: any) => {
    await clientesQuery.fetchNextPage();
    e.target.complete();
  }, []);

  const onPesquisar = useCallback((e: Event) => {
    setPesquisa((e.target as HTMLInputElement).value);
  }, []);

  const onClienteClick = useCallback((e: any) => {
    e.stopPropagation();

    const id = e.currentTarget.dataset.id;
    router.push(`/clientes/${id}`);
  }, []);

  const onRemoverClick = useCallback(async (e: any) => {
    e.stopPropagation();

    const id = e.currentTarget.dataset.id;

    await presentAlert(
      'Deseja realmente remover?', [
      { id: 'sim', text: 'Sim', handler: () => removerCliente.mutate(id) },
      { id: 'nao', text: 'Não' }]);
  }, []);

  const isMobile = useMemo(() => isPlatform('mobile'), []);

  const isClientesEmptyList = clientesQuery.data?.pages[0].clientes?.length === 0;

  return (
    <IonPage>
      <IonLoading isOpen={removerCliente.isPending} />
      <IonHeader>
        <ResponsiveContainer>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>
              Clientes
            </IonTitle>
          </IonToolbar>
        </ResponsiveContainer>
        {clientesQuery.isFetching && <IonProgressBar type="indeterminate" />}
      </IonHeader>
      <IonContent fullscreen>
        <ResponsiveContainer>
          <IonToolbar>
            <IonSearchbar placeholder="Pesquisar" debounce={300} value={pesquisa} onIonChange={onPesquisar} disabled={isClientesEmptyList} />
          </IonToolbar>

          <ErrorMessage retry={clientesQuery.refetch} isOpen={clientesQuery.isError} />

          <IonList>
            {clientesQuery.data?.pages?.length === 0 && clientesQuery.isLoading && <p className="ion-padding ion-text-center">Carregando...</p>}

            {clientesQuery.data?.pages && clientesQuery.data?.pages[0].clientes?.length === 0 && !clientesQuery.isLoading && <p className="ion-padding ion-text-center">Nenhum cliente encontrado.</p>}

            {clientesQuery.data?.pages?.map((page, i) =>
              <div key={i}>
                {page.clientes.map(cliente =>
                  <IonItemSliding key={cliente.id} disabled={!isMobile}>
                    <IonItem button data-id={cliente.id} onClick={onClienteClick}>
                      <IonLabel>{cliente.nome}</IonLabel>
                      <IonLabel slot="end"><div className={`classe ${obterClasse(cliente.renda)}`}>{currencyFormat.format(cliente.renda)}</div></IonLabel>

                      {!isMobile &&
                        <IonButton slot="end" fill="clear" data-id={cliente.id} onClick={onRemoverClick}>
                          <IonIcon icon={trash} />
                        </IonButton>}
                    </IonItem>

                    <IonItemOptions>
                      <IonItemOption color="danger" data-id={cliente.id} onClick={onRemoverClick}>Remover</IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>)}
              </div>)}
          </IonList>

          <IonInfiniteScroll onIonInfinite={onInfinite} disabled={!clientesQuery.hasNextPage}>
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>

          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton routerLink="/clientes-inserir">
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </ResponsiveContainer>
      </IonContent>
    </IonPage>
  );
};

export default Home;
