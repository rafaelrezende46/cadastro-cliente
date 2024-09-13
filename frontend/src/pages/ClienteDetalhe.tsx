import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonLoading,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
    useIonRouter
} from '@ionic/react';
import clienteService, { ClienteRequest } from '../data/cliente-service';
import { useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import ValidationMessage from '../components/ValidationMessage';
import { ErrorMessage } from '../components/ErrorMessage';
import { ResponsiveContainer } from '../components/ResponsiveContainer';

const formatDateInputValue = (data: string) => data.split('T')[0];

const ClienteDetalhe: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [renda, setRenda] = useState<number>();

    const clienteQuery = useQuery({
        queryKey: ['Cliente.Obter', id],
        queryFn: () => clienteService.obter(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    useEffect(() => {
        if (!clienteQuery.data || clienteQuery.isFetching) return;

        const cliente = clienteQuery.data;
        setNome(cliente.nome);
        setCpf(cliente.cpf);
        setDataNascimento(formatDateInputValue(cliente.data_nascimento));
        setRenda(cliente.renda);
    }, [clienteQuery.data, clienteQuery.isFetching]);

    const form = useRef<HTMLFormElement>();

    const router = useIonRouter()

    const salvar = useMutation({
        mutationFn: async (request: ClienteRequest) => {
            const valido = form.current?.reportValidity();

            if (!valido) {
                return;
            }

            const resultado = id
                ? await clienteService.atualizar(id, request)
                : await clienteService.criar(request);

            if (resultado.success) {
                router.goBack();
                return;
            }

            return resultado;
        },
    });

    const onSubmit = useCallback(async (e?: FormEvent) => {
        e?.preventDefault();

        const request = { nome, cpf, data_nascimento: dataNascimento, renda: renda! };

        salvar.mutate(request);
    }, [nome, cpf, dataNascimento, renda]);

    const onNomeChange = useCallback((ev: Event) => {
        const input = ev.target as HTMLInputElement;
        setNome(input.value);
    }, [])

    const onCpfInput = useCallback((ev: Event) => {
        const input = ev.target as HTMLInputElement;
        const value = input.value as string;

        const filteredValue = value.replace(/[^0-9]+/g, '');

        input.value = filteredValue;
        setCpf(filteredValue);
    }, []);

    const onDataNascimentoChange = useCallback((ev: Event) => {
        const input = ev.target as HTMLInputElement;
        setDataNascimento(input.value);
    }, []);

    const onRendaChange = useCallback((ev: Event) => {
        const input = ev.target as HTMLInputElement;
        setRenda(parseFloat(input.value));
    }, []);

    const titulo = id
        ? 'Atualizar Cliente'
        : 'Inserir Cliente';

    const maxDataNascimento = useMemo(() => {
        const ontem = new Date(new Date().setDate(new Date().getDate() - 1));
        return formatDateInputValue(ontem.toISOString());
    }, []);

    return (
        <IonPage>
            <IonLoading isOpen={salvar.isPending || clienteQuery.isFetching} />
            <IonHeader translucent>
                <ResponsiveContainer>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton text="voltar" defaultHref="/home"></IonBackButton>
                        </IonButtons>
                        <IonTitle>{titulo}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={onSubmit}>Salvar</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </ResponsiveContainer>
            </IonHeader>
            <IonContent fullscreen>
                <ResponsiveContainer>
                    <form ref={form as any} onSubmit={onSubmit}>
                        <ErrorMessage retry={onSubmit} isOpen={salvar.isError} />
                        <ValidationMessage result={salvar.data} />
                        <IonGrid>
                            <IonRow>
                                <IonCol sizeXs="12" sizeMd="6">
                                    <IonInput
                                        name="nome"
                                        label="Nome"
                                        labelPlacement="floating"
                                        fill="solid"
                                        required
                                        maxlength={150}
                                        autocomplete="off"
                                        value={nome}
                                        onIonInput={onNomeChange}>
                                    </IonInput>
                                </IonCol>
                                <IonCol sizeXs="12" sizeMd="6">
                                    <IonInput
                                        name="cpf"
                                        label="CPF"
                                        labelPlacement="floating"
                                        fill="solid"
                                        required
                                        maxlength={11}
                                        inputMode="numeric"
                                        autocomplete="off"
                                        value={cpf}
                                        onIonInput={onCpfInput}>
                                    </IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol sizeXs="12" sizeMd="6">
                                    <IonInput
                                        name="data_nascimento"
                                        label="Data de Nascimento"
                                        fill="solid"
                                        labelPlacement="floating"
                                        required
                                        type="date"
                                        autocomplete="off"
                                        value={dataNascimento}
                                        max={maxDataNascimento}
                                        onIonInput={onDataNascimentoChange}>
                                    </IonInput>
                                </IonCol>
                                <IonCol sizeXs="12" sizeMd="6">
                                    <IonInput
                                        name="renda"
                                        label="Renda (R$)"
                                        fill="solid"
                                        labelPlacement="floating"
                                        type="number"
                                        required
                                        min={0}
                                        step="0.01"
                                        autocomplete="off"
                                        value={renda}
                                        onIonInput={onRendaChange}>
                                    </IonInput>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </form>
                </ResponsiveContainer>
            </IonContent>
        </IonPage>
    );
};

export default ClienteDetalhe;
