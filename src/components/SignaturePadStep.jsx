import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "./SignaturePad.module.css";
import toast from "react-hot-toast";

export default function SignaturePadStep({ data, handleSignature, nextStep, prevStep }) {
  const [currentSigner, setCurrentSigner] = useState(0);
  const sigCanvas = useRef();
  
  // Datos de los firmantes
  const userData = {
    name: localStorage.getItem('userName') || '',
    cc: localStorage.getItem('userCC') || ''
  };

  const signers = [
    {
      title: "Funcionario Responsable de la Revisión",
      name: userData.name,
      document: userData.cc,
      signatureKey: "firmaFuncionario"
    },
    {
      title: "Suscriptor o Usuario",
      name: data.usuarioVisita || "",
      document: data.documentoVisitante || "",
      signatureKey: "firmaSuscriptor"
    },
    {
      title: "Supervisor y/o Interventor",
      name: data.otroRepresentante || "",
      document: data.ccOtroRepresentante || "",
      signatureKey: "firmaSupervisor"
    }
  ];

  // Calcular el progreso para la línea
  const calculateProgress = () => {
    // Progreso basado en el firmante actual
    // 0 = 0%, 1 = 50%, 2 = 100%
    return currentSigner;
  };
  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    if (!sigCanvas.current.isEmpty()) {
      const sig = sigCanvas.current.getCanvas().toDataURL("image/png");
      // Guardar la firma actual en localStorage
      localStorage.setItem(signers[currentSigner].signatureKey, sig);
      
      // Guardar la firma actual
      handleSignature(signers[currentSigner].signatureKey, sig);
      
      // Limpiar el canvas
      sigCanvas.current.clear();
      
      // Si hay más firmantes, pasar al siguiente
      if (currentSigner < signers.length - 1) {
        setCurrentSigner(currentSigner + 1);
      } else {
        // Si es el último firmante, continuar al siguiente paso
        nextStep();
      }
    } else {
      toast.error("Por favor, firme antes de continuar.");
    }
  };

  const goBack = () => {
    if (currentSigner > 0) {
      // Si no es el primer firmante, volver al anterior
      setCurrentSigner(currentSigner - 1);
      sigCanvas.current.clear();
    } else {
      // Si es el primer firmante, volver al paso anterior
      prevStep();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Firmas del Acta de Revisión</h2>
        <p className={styles.subtitle}>Por favor, proporcione las siguientes firmas</p>
        
        <div className={styles.progress}
        data-progress={calculateProgress()}>
          {signers.map((signer, index) => (
            <div 
              key={index} 
              className={`${styles.progressStep} ${index === currentSigner ? styles.active : ''} ${index < currentSigner ? styles.completed : ''}`}
            >
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepTitle}>{signer.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.signerInfo}>
          <h3>{signers[currentSigner].title}</h3>
          <div className={styles.signerDetails}>
            <p><strong>Nombre:</strong> {signers[currentSigner].name || "No proporcionado"}</p>
            <p><strong>Documento:</strong> {signers[currentSigner].document || "No proporcionado"}</p>
          </div>
        </div>

        <div className={styles.padContainer}>
          <div className={styles.instructions}>
            <p>Firme en el área inferior. Cuando termine, haga clic en "Guardar y Continuar"</p>
          </div>
          
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: 600,
              height: 250,
              className: styles.canvas,
            }}
          />
          
          <div className={styles.actions}>
            <button className={styles.btnSecondary} onClick={clear}>
              Limpiar Firma
            </button>
          </div>
        </div>

        <div className={styles.navigationButtons}>
          <button className={styles.btnBack} onClick={goBack}>
            {currentSigner > 0 ? "Firmante Anterior" : "Paso Anterior"}
          </button>
          
          <button className={styles.btnPrimary} onClick={save}>
            {currentSigner < signers.length - 1 ? "Guardar y Siguiente Firma" : "Finalizar Firmas"}
          </button>
        </div>
      </div>
    </div>
  );
}