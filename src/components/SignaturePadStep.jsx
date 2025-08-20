import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./SignaturePad.css";

export default function SignaturePadStep({ data, handleSignature, nextStep, prevStep }) {
  const sigCanvas = useRef();

  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    if (!sigCanvas.current.isEmpty()) {
      const sig = sigCanvas.current.getCanvas().toDataURL("image/png")
      handleSignature(sig);
      nextStep();
    } else {
      alert("Por favor, firme antes de continuar.");
    }
  };

  return (
    <div>
      <h2>Paso 4: Firma</h2>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 500,
          height: 200,
          className: "signature-canvas",
        }}
      />
      <div>
        <button onClick={prevStep}>Atrás</button>
        <button onClick={clear}>Limpiar</button>
        <button onClick={save}>Guardar y continuar</button>
      </div>
    </div>
  );
}
