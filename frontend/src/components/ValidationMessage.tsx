import { IonText } from "@ionic/react";

export interface ValidationResult {
    errors: { field: string, message: string }[]
}

export default function ValidationMessage({ result }: { result?: ValidationResult }) {
    if (!result?.errors?.length) {
        return;
    }

    return (
        <div className="ion-padding">
            <IonText color="danger">
                <p>Corrija os campos:</p>
                <ul>
                    {result.errors.map((erro, i) =>
                        <li key={i}>{erro.message}</li>)}
                </ul>
            </IonText>
        </div>
    )
}