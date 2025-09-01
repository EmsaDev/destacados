import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./SignaturePad.css";
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
    <div className="signature-container">
      <div className="signature-header">
        <h2>Firmas del Acta de Revisión</h2>
        <p className="signature-subtitle">Por favor, proporcione las siguientes firmas</p>
        
        <div className="signature-progress">
          {signers.map((signer, index) => (
            <div 
              key={index} 
              className={`progress-step ${index === currentSigner ? 'active' : ''} ${index < currentSigner ? 'completed' : ''}`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-title">{signer.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="signature-content">
        <div className="signer-info">
          <h3>{signers[currentSigner].title}</h3>
          <div className="signer-details">
            <p><strong>Nombre:</strong> {signers[currentSigner].name || "No proporcionado"}</p>
            <p><strong>Documento:</strong> {signers[currentSigner].document || "No proporcionado"}</p>
          </div>
        </div>

        <div className="signature-pad-container">
          <div className="signature-instructions">
            <p>Firme en el área inferior. Cuando termine, haga clic en "Guardar y Continuar"</p>
          </div>
          
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "signature-canvas",
            }}
          />
          
          <div className="signature-actions">
            <button className="btn-secondary" onClick={clear}>
              Limpiar Firma
            </button>
          </div>
        </div>

        <div className="navigation-buttons">
          <button className="btn-back" onClick={goBack}>
            {currentSigner > 0 ? "Firmante Anterior" : "Paso Anterior"}
          </button>
          
          <button className="btn-primary" onClick={save}>
            {currentSigner < signers.length - 1 ? "Guardar y Siguiente Firma" : "Finalizar Firmas"}
          </button>
        </div>
      </div>
    </div>
  );
}