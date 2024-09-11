import { IonButton } from "@ionic/react";

export function ErrorMessage({ retry, isOpen }: { retry: () => any, isOpen?: boolean }) {
    isOpen ??= true;

    return (
        <div className="ion-padding ion-text-center" style={{ 'display': isOpen ? 'block' : 'none' }}>
            <p>Ops, houve uma falha.</p>
            <IonButton fill="outline" onClick={retry}>Tentar novamente</IonButton>
        </div>
    );
}