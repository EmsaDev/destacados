import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "./SignaturePad.module.css";
import toast from "react-hot-toast";

export default function SignaturePadStep({ data, handleSignature, nextStep, prevStep }) {
  const [currentSigner, setCurrentSigner] = useState(0);
  const [savedSignatures, setSavedSignatures] = useState({});
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
      title: "Testigo",
      name: data.otroRepresentante || "",
      document: data.ccOtroRepresentante || "",
      signatureKey: "firmaSupervisor"
    }
  ];

  // Cargar firmas guardadas al iniciar
  useEffect(() => {
    const loadedSignatures = {};
    
    signers.forEach(signer => {
      const savedSig = localStorage.getItem(signer.signatureKey);
      const dataSig = data[signer.signatureKey];
      
      if (savedSig) {
        loadedSignatures[signer.signatureKey] = savedSig;
      } else if (dataSig) {
        loadedSignatures[signer.signatureKey] = dataSig;
      }
    });
    
    setSavedSignatures(loadedSignatures);
  }, []);

  // Cargar la firma en el canvas cuando cambia el firmante
  useEffect(() => {
    if (sigCanvas.current) {
      const currentSignature = savedSignatures[signers[currentSigner].signatureKey];
      
      if (currentSignature) {
        const canvas = sigCanvas.current.getCanvas();
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        
        img.src = currentSignature;
      } else {
        sigCanvas.current.clear();
      }
    }
  }, [currentSigner, savedSignatures]);

  const calculateProgress = () => currentSigner;

  const clear = () => {
    sigCanvas.current.clear();
    
    const signatureKey = signers[currentSigner].signatureKey;
    const newSignatures = { ...savedSignatures };
    delete newSignatures[signatureKey];
    setSavedSignatures(newSignatures);
    
    localStorage.removeItem(signatureKey);
    handleSignature(signatureKey, '');
    
    toast.success("Firma eliminada");
  };

  const save = () => {
    if (!sigCanvas.current.isEmpty()) {
      const sig = sigCanvas.current.toDataURL("image/png");
      const signatureKey = signers[currentSigner].signatureKey;
      
      setSavedSignatures({
        ...savedSignatures,
        [signatureKey]: sig
      });
      
      localStorage.setItem(signatureKey, sig);
      handleSignature(signatureKey, sig);
      
      toast.success(`Firma guardada correctamente`);
      
      if (currentSigner < signers.length - 1) {
        setCurrentSigner(currentSigner + 1);
      } else {
        const allSignaturesComplete = signers.every(signer => 
          savedSignatures[signer.signatureKey] || signer.signatureKey === signatureKey
        );
        
        if (allSignaturesComplete || 
            (Object.keys(savedSignatures).length === signers.length - 1 && 
             savedSignatures[signatureKey])) {
          toast.success("¡Todas las firmas han sido guardadas!");
          nextStep();
        } else {
          toast.error("Faltan firmas por completar");
        }
      }
    } else {
      const currentSignature = savedSignatures[signers[currentSigner].signatureKey];
      
      if (currentSignature) {
        if (currentSigner < signers.length - 1) {
          setCurrentSigner(currentSigner + 1);
        } else {
          const allSignaturesComplete = signers.every(signer => 
            savedSignatures[signer.signatureKey]
          );
          
          if (allSignaturesComplete) {
            toast.success("¡Todas las firmas han sido guardadas!");
            nextStep();
          } else {
            toast.error("Faltan firmas por completar");
          }
        }
      } else {
        toast.error("Por favor, firme antes de continuar.");
      }
    }
  };

  const goBack = () => {
    if (currentSigner > 0) {
      setCurrentSigner(currentSigner - 1);
    } else {
      prevStep();
    }
  };

  const isSignerValid = () => {
    const current = signers[currentSigner];
    return current.name && current.document && 
           current.name !== "" && current.document !== "";
  };

  const hasCurrentSignature = () => {
    return !!savedSignatures[signers[currentSigner].signatureKey];
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Firmas del Acta de Revisión</h2>
        <p className={styles.subtitle}>Por favor, proporcione las siguientes firmas</p>
        
        <div 
          className={styles.progress}
          data-progress={calculateProgress()}
        >
          {signers.map((signer, index) => {
            const hasSignature = !!savedSignatures[signer.signatureKey];
            
            return (
              <div 
                key={index} 
                className={`${styles.progressStep} ${index === currentSigner ? styles.active : ''} ${hasSignature ? styles.completed : ''}`}
                onClick={() => {
                  if (hasSignature || index === currentSigner) {
                    setCurrentSigner(index);
                  } else if (index < currentSigner) {
                    setCurrentSigner(index);
                  }
                }}
                style={{ cursor: hasSignature ? 'pointer' : 'default' }}
              >
                <div className={styles.stepNumber}>
                  {hasSignature ? index + 1 : index + 1}
                </div>
                <div className={styles.stepTitle}>{signer.title}</div>
                {hasSignature && (
                  <div className={styles.signatureBadge}>
                    Firmado ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.signerInfo}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>{signers[currentSigner].title}</h3>
            {hasCurrentSignature() && (
              <span style={{
                background: '#4CAF50',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)'
              }}>
                ✓ Firmado
              </span>
            )}
          </div>
          
          <div className={styles.signerDetails}>
            <p>
              <strong>Nombre:</strong> {signers[currentSigner].name || 
                <span style={{ color: '#ff9800', fontStyle: 'italic' }}> No proporcionado</span>
              }
            </p>
            <p>
              <strong>Documento:</strong> {signers[currentSigner].document || 
                <span style={{ color: '#ff9800', fontStyle: 'italic' }}> No proporcionado</span>
              }
            </p>
          </div>
          
          {!isSignerValid() && (
            <div className={styles.warningMessage}>
              ⚠️ Faltan datos del firmante. Complete la información en los pasos anteriores.
            </div>
          )}
        </div>

        <div className={styles.padContainer}>
          <div className={styles.instructions}>
            {hasCurrentSignature() ? (
              <p>✓ Este firmante ya tiene una firma registrada. Puede modificarla o continuar.</p>
            ) : (
              <p>Firme en el área inferior. Cuando termine, haga clic en "Guardar y Continuar"</p>
            )}          
          </div>

          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            backgroundColor="white"
            canvasProps={{
              width: 600,
              height: 250,
              className: styles.canvas,
            }}
          />
          
          <div className={styles.actions}>
            <button className={styles.btnSecondary} onClick={clear}>
              {hasCurrentSignature() ? 'Eliminar Firma' : 'Limpiar Firma'}
            </button>
            <span className={styles.firmanteCounter}>
              Firmante {currentSigner + 1} de {signers.length}
            </span>
          </div>
        </div>

        <div className={styles.navigationButtons}>
          <button className={styles.btnBack} onClick={goBack}>
            {currentSigner > 0 ? "← Firmante Anterior" : "← Paso Anterior"}
          </button>
          
          <button 
            className={styles.btnPrimary} 
            onClick={save}
            disabled={!isSignerValid()}
          >
            {currentSigner < signers.length - 1 
              ? (hasCurrentSignature() ? "Siguiente Firma →" : "Guardar y Siguiente Firma →")
              : (hasCurrentSignature() ? "Finalizar Firmas ✓" : "Guardar y Finalizar ✓")
            }
          </button>
        </div>
      </div>
    </div>
  );
}