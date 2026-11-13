import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Text } from "react-konva";
import { toast, Toaster } from "react-hot-toast";
import { FiCheckSquare, FiEdit  } from "react-icons/fi";
import styles from './DiagramSelectionStep.module.css';
import medidorImg from '../assets/overlays/medidor.png';
import tpImg from '../assets/overlays/tp.png';
//unifilar
import unifilar1 from '../assets/images/unifilar/unifilar.png';
import unifilar2 from '../assets/images/unifilar/unifilar2.png';
import unifilar3 from '../assets/images/unifilar/unifilar3.png';
import unifilar4 from '../assets/images/unifilar/unifilar4.png';
import unifilar5 from '../assets/images/unifilar/unifilar5.png';
import unifilar6 from '../assets/images/unifilar/unifilar6.png';
import unifilar7 from '../assets/images/unifilar/unifilar7.png';
import unifilar8 from '../assets/images/unifilar/unifilar8.png';
import unifilar9 from '../assets/images/unifilar/unifilar9.png';
import unifilar10 from '../assets/images/unifilar/unifilar10.png';
import unifilar11 from '../assets/images/unifilar/unifilar11.png';
import unifilar12 from '../assets/images/unifilar/unifilar12.png';
import unifilar13 from '../assets/images/unifilar/unifilar13.png';
import unifilar14 from '../assets/images/unifilar/unifilar14.png';
import unifilar15 from '../assets/images/unifilar/unifilar15.png';
import unifilar16 from '../assets/images/unifilar/unifilar16.png';
import unifilar17 from '../assets/images/unifilar/unifilar17.png';
import unifilar18 from '../assets/images/unifilar/unifilar18.png';
import unifilar19 from '../assets/images/unifilar/unifilar19.png';
import unifilar20 from '../assets/images/unifilar/unifilar20.png';
import unifilar21 from '../assets/images/unifilar/unifilar21.png';
import unifilar22 from '../assets/images/unifilar/unifilar22.png';
import unifilar23 from '../assets/images/unifilar/unifilar23.png';
import unifilar24 from '../assets/images/unifilar/unifilar24.png';
import unifilar25 from '../assets/images/unifilar/unifilar25.png';
import unifilar26 from '../assets/images/unifilar/unifilar26.png';
import unifilar27 from '../assets/images/unifilar/unifilar27.png';
import unifilar28 from '../assets/images/unifilar/unifilar28.png';
import unifilar29 from '../assets/images/unifilar/unifilar29.png';
import unifilar30 from '../assets/images/unifilar/unifilar30.png';
import unifilar31 from '../assets/images/unifilar/unifilar31.png';
import unifilar32 from '../assets/images/unifilar/unifilar32.png';
import unifilar33 from '../assets/images/unifilar/unifilar33.png';
import unifilar34 from '../assets/images/unifilar/unifilar34.png';
import unifilar35 from '../assets/images/unifilar/unifilar35.png';
import unifilar36 from '../assets/images/unifilar/unifilar36.png';
import unifilar37 from '../assets/images/unifilar/unifilar37.png';
import unifilar38 from '../assets/images/unifilar/unifilar38.png';
import unifilar39 from '../assets/images/unifilar/unifilar39.png';
import unifilar40 from '../assets/images/unifilar/unifilar40.png';
import unifilar41 from '../assets/images/unifilar/unifilar41.png';
import unifilar42 from '../assets/images/unifilar/unifilar42.png';
import unifilar43 from '../assets/images/unifilar/unifilar43.png';
import unifilar44 from '../assets/images/unifilar/unifilar44.png';
//conexiones
import conexiones1 from '../assets/images/conexiones/conexiones.png';
import conexiones2 from '../assets/images/conexiones/conexiones2.png';
import conexiones3 from '../assets/images/conexiones/conexiones3.png';
import conexiones4 from '../assets/images/conexiones/conexiones4.png';
import conexiones5 from '../assets/images/conexiones/conexiones5.png';
import conexiones6 from '../assets/images/conexiones/conexiones6.png';
import conexiones7 from '../assets/images/conexiones/conexiones7.png';
import conexiones8 from '../assets/images/conexiones/conexiones8.png';
import conexiones9 from '../assets/images/conexiones/conexiones9.png';
import conexiones10 from '../assets/images/conexiones/conexiones10.png';
import conexiones11 from '../assets/images/conexiones/conexiones11.png';
import conexiones12 from '../assets/images/conexiones/conexiones12.png';
import conexiones13 from '../assets/images/conexiones/conexiones13.png';
import conexiones14 from '../assets/images/conexiones/conexiones14.png';
import conexiones15 from '../assets/images/conexiones/conexiones15.png';
import conexiones16 from '../assets/images/conexiones/conexiones16.png';
import conexiones17 from '../assets/images/conexiones/conexiones17.png';
import conexiones18 from '../assets/images/conexiones/conexiones18.png';
import conexiones19 from '../assets/images/conexiones/conexiones19.png';
import conexiones20 from '../assets/images/conexiones/conexiones20.png';


// Agrega este componente al inicio del archivo, después de los imports
const TextInputModal = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setText('');
      // Auto-focus al input
      setTimeout(() => {
        const input = document.querySelector(`.${styles.modalTextInput}`);
        if (input) input.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSave(text.trim());
      onClose();
    } else {
      toast.error('Por favor ingrese un texto');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>✏️ Agregar Texto</h3>
          <button 
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            <p className={styles.modalDescription}>
              Ingrese el texto que desea agregar al diagrama:
            </p>
            <input
              type="text"
              className={styles.modalTextInput}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ej: Medidor, TP, Conexión, etc."
              onKeyDown={handleKeyDown}
              maxLength={50}
              autoFocus
            />
            <div className={styles.modalHelper}>
              <span>Máximo 50 caracteres</span>
              <span>{text.length}/50</span>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.modalCancelBtn}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.modalSaveBtn}
              disabled={!text.trim()}
            >
              Agregar Texto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const toRadians = (deg) => (deg * Math.PI) / 180;

// Hook personalizado para cargar imágenes
function useImage(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}

// Componente del editor de diagramas
// Componente del editor de diagramas
const DiagramEditor = ({ image, onSave, savedData, onClose }) => {
  const stageRef = useRef();
  const transformerRef = useRef();
  
  const baseImage = useImage(image);
  const medidorImage = useImage(medidorImg);
  const tpImage = useImage(tpImg);
  
  const [elements, setElements] = useState([]);
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  const canvasWidth = 1000;
  const canvasHeight = 500;
  const baseImageWidth = 900;
  const baseImageHeight = 450;
  const baseImageX = (canvasWidth - baseImageWidth) / 2;
  const baseImageY = (canvasHeight - baseImageHeight) / 2;
  

  // Efecto para cargar datos guardados cuando las imágenes estén listas
  useEffect(() => {
    if (baseImage && medidorImage && tpImage) {
      setImagesLoaded(true);
      
      if (savedData) {
        // Cargar líneas
        if (savedData.lines) {
          setLines(savedData.lines);
        }
        
        // Cargar textos
        if (savedData.texts) {
          setTexts(savedData.texts);
        }
        
        // Cargar elementos con las imágenes correctas
        if (savedData.elements && savedData.elements.length > 0) {
          const loadedElements = savedData.elements.map(el => ({
            ...el,
            image: el.type === 'medidor' ? medidorImage : tpImage
          }));
          setElements(loadedElements);
        }
      }
    }
  }, [baseImage, medidorImage, tpImage, savedData]);

  const getPointerPosition = (e) => {
    const stage = stageRef.current;
    if (!stage) return null;
    return stage.getPointerPosition();
  };

  const handlePointerDown = (e) => {
    const target = e.target;
    const isDraggable = target.getAttr('draggable') || target.parent?.getAttr('draggable');
    
    if (isDraggable || target.getClassName() === 'Image' || target.getClassName() === 'Text') {
      return;
    }
    
    e.evt.preventDefault();
    setIsDrawing(true);
    const pos = getPointerPosition(e);
    
    if (pos) {
      setCurrentLine({
        id: Date.now().toString(),
        points: [pos.x, pos.y],
      });
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || !currentLine) return;
    e.evt.preventDefault();
    const point = getPointerPosition(e);
    if (point) {
      setCurrentLine(prev => ({
        ...prev,
        points: [...prev.points, point.x, point.y],
      }));
    }
  };

  const handlePointerUp = () => {
    if (isDrawing && currentLine && currentLine.points.length > 2) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
    setIsDrawing(false);
  };

  const addElement = (type) => {
    if (!medidorImage || !tpImage) {
      toast.error('Las imágenes aún no están cargadas');
      return;
    }
    const imageMap = { medidor: medidorImage, tp: tpImage };
    const newElement = {
      id: Date.now().toString(),
      type,
      image: imageMap[type],
      x: baseImageX + 100,
      y: baseImageY + 100,
      width: 60,
      height: 60,
      rotation: 0,
    };
    setElements(prev => [...prev, newElement]);
    toast.success(`${type === "medidor" ? "Medidor" : "TP"} agregado`);
  };

  const addText = () => {
    setShowTextModal(true);
  };

  // FUNCIÓN PARA GUARDAR EL TEXTO DEL MODAL
  const handleTextSave = (text) => {
    if (!text) return;
    setTexts(prev => [...prev, {
      id: Date.now().toString(),
      text,
      x: baseImageX + 150,
      y: baseImageY + 150,
      fontSize: 20,
      fill: '#333',
      rotation: 0,
    }]);
    toast.success("Texto agregado");
  };

  const undoLastLine = () => {
    if (lines.length === 0) {
      toast.error("No hay trazos para deshacer");
      return;
    }
    setLines(prev => prev.slice(0, -1));
    toast.success("Trazo deshecho");
  };

  const clearAllDrawings = () => {
    if (lines.length === 0) {
      toast.error("No hay trazos para limpiar");
      return;
    }
    setLines([]);
    toast.success("Todos los trazos fueron limpiados");
  };

  const deleteSelected = () => {
    if (!selectedId) {
      toast.error("Selecciona un elemento para eliminar");
      return;
    }
    setElements(prev => prev.filter(el => el.id !== selectedId));
    setTexts(prev => prev.filter(t => t.id !== selectedId));
    setSelectedId(null);
    toast.success("Elemento eliminado");
  };

  const handleElementClick = (id, e) => {
    e.cancelBubble = true;
    setSelectedId(id);
  };

  const saveDiagram = () => {
    // Guardar solo los datos necesarios (sin las imágenes)
    const diagramData = {
      elements: elements.map(el => ({
        id: el.id,
        type: el.type,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation,
      })),
      lines: lines,
      texts: texts.map(t => ({
        id: t.id,
        text: t.text,
        x: t.x,
        y: t.y,
        fontSize: t.fontSize,
        fill: t.fill,
        rotation: t.rotation,
      }))
    };
    onSave(diagramData);
    toast.success("Diagrama guardado");
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete") deleteSelected();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoLastLine();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, lines]);

  useEffect(() => {
    const stage = stageRef.current;
    const transformer = transformerRef.current;
    if (!selectedId) {
      if (transformer) transformer.nodes([]);
      return;
    }
    const selectedNode = stage?.findOne(`#${selectedId}`);
    if (selectedNode && transformer) {
      transformer.nodes([selectedNode]);
    }
  }, [selectedId]);

  if (!imagesLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando imágenes...</p>
      </div>
    );
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorToolbar}>
        <button onClick={() => addElement("medidor")}>➕ Medidor</button>
        <button onClick={() => addElement("tp")}>📊 TP</button>
        <button onClick={addText}>📝 Texto</button>
        <button onClick={undoLastLine}>↩️ Deshacer</button>
        <button onClick={clearAllDrawings}>🗑️ Limpiar</button>
        <button onClick={deleteSelected}>❌ Eliminar</button>
        <button onClick={saveDiagram}>💾 Guardar</button>
      </div>

      <div className={styles.stageWrapper}>
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          <Layer>
            {baseImage && (
              <KonvaImage 
                image={baseImage} 
                x={baseImageX}
                y={baseImageY}
                width={baseImageWidth} 
                height={baseImageHeight}
                listening={false}
              />
            )}
          </Layer>

          <Layer>
            {lines.map((line, i) => (
              <Line
                key={line.id || i}
                points={line.points}
                stroke="#000000"
                strokeWidth={3}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                listening={false}
              />
            ))}
            {currentLine && (
              <Line
                points={currentLine.points}
                stroke="#FF5722"
                strokeWidth={3}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                listening={false}
              />
            )}
          </Layer>

          <Layer>
            {elements.map((el) => (
              <KonvaImage
                key={el.id}
                id={el.id}
                image={el.image}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                rotation={el.rotation}
                draggable
                onClick={(e) => handleElementClick(el.id, e)}
                onDragStart={() => setSelectedId(el.id)}
                onDragEnd={(e) => {
                  const { x, y } = e.target.position();
                  setElements(prev =>
                    prev.map(item =>
                      item.id === el.id ? { ...item, x, y } : item
                    )
                  );
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  node.scaleX(1);
                  node.scaleY(1);
                  setElements(prev =>
                    prev.map(item =>
                      item.id === el.id
                        ? {
                            ...item,
                            x: node.x(),
                            y: node.y(),
                            rotation: node.rotation(),
                            width: Math.max(20, node.width() * scaleX),
                            height: Math.max(20, node.height() * scaleY),
                          }
                        : item
                    )
                  );
                }}
              />
            ))}
            {texts.map((text) => (
              <Text
                key={text.id}
                id={text.id}
                text={text.text}
                x={text.x}
                y={text.y}
                rotation={text.rotation || 0}
                fontSize={text.fontSize || 20}
                fill={text.fill || '#333'}
                draggable
                onClick={(e) => handleElementClick(text.id, e)}
                onDragStart={() => setSelectedId(text.id)}
                onDragEnd={(e) => {
                  const { x, y } = e.target.position();
                  setTexts(prev =>
                    prev.map(item =>
                      item.id === text.id ? { ...item, x, y } : item
                    )
                  );
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  node.scaleX(1);
                  node.scaleY(1);
                  setTexts(prev =>
                    prev.map(item =>
                      item.id === text.id
                        ? {
                            ...item,
                            x: node.x(),
                            y: node.y(),
                            rotation: node.rotation(),
                            fontSize: Math.max(10, node.fontSize() * scaleX),
                          }
                        : item
                    )
                  );
                }}
              />
            ))}
            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              keepRatio={true}
              flipEnabled={false}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              borderStroke="#33CCFF"
              borderStrokeWidth={2}
              anchorStroke="#33CCFF"
              anchorFill="#FFFFFF"
              anchorSize={8}
            />
          </Layer>
        </Stage>
      </div>
      {/*  MODAL DE TEXTO */}
      <TextInputModal 
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSave={handleTextSave}
      />
    </div>
    
  );
};

const DiagramSelectionStep = ({ data, updateData, nextStep, prevStep }) => {
  const phasorSvgRef = useRef(null);
  const [systemType, setSystemType] = useState("trifasico");
  
  const [selectedDiagrams, setSelectedDiagrams] = useState({
    unifilar: data.diagramaUnifilar || '',
    fasorial: data.diagramaFasorial || 'Diagrama Fasorial',
    conexiones: data.diagramaConexiones || ''
  });

  const getDefaultCurrents = (type) => {
    if (type === "bifasico") {
      return [
        { angle: 0, type: "inductiva", magnitud: 100, vMagnitud: 100 },   // Fase 1
        { angle: 0, type: "inductiva", magnitud: 100, vMagnitud: 100 },   // Fase 2
      ];
    }
    return [
      { angle: 0, type: "inductiva", magnitud: 100, vMagnitud: 100 },     // Fase 1
      { angle: 0, type: "inductiva", magnitud: 100, vMagnitud: 100 },     // Fase 2
      { angle: 0, type: "inductiva", magnitud: 100, vMagnitud: 100 },     // Fase 3
    ];
  };

  const [fasorialCurrents, setFasorialCurrents] = useState(
    data.fasorialCurrents || getDefaultCurrents(systemType)
  );

  const [lineaDedicada, setLineaDedicada] = useState(data.lineaDedicada || '');
  const [tipoFrontera, setTipoFrontera] = useState(data.tipoFrontera || '');

  const [tpData, setTpData] = useState(data.tpData || {
    vRPrimario: '', vSPrimario: '', vTPrimario: '',
    vRSecundario: '', vSSecundario: '', vTSecundario: '',
    vRRtp: '', vSRtp: '', vTRtp: '',
    rtp: '', errorVR: '', errorVS: '', errorVT: '', errorPromedio: ''
  });

  const [tcData, setTcData] = useState(data.tcData || {
    vRPrimario: '', vSPrimario: '', vTPrimario: '',
    vRSecundario: '', vSSecundario: '', vTSecundario: '',
    vRRtc: '', vSRtc: '', vTRtc: '',
    rtc: '', errorVR: '', errorVS: '', errorVT: '', errorPromedio: ''
  });

  const [factorData, setFactorData] = useState(data.factorData || {
    factorSiec: '', factorEncontrado: '', errorFactor: '', factorFinal: '', equipoPatron: ''
  });

  const [observaciones, setObservaciones] = useState(data.observaciones || {
    redMT: '', redBT: '', crucetas: '', pararrayos: '', cortacircuitos: '',
    fusibles: '', bajantes: '', transformador: '', tps: '', tcs: '',
    bloquesPrueba: '', celda: '', gabinetes: '', modem: '', cableSenal: ''
  });

  const [adecuaciones, setAdecuaciones] = useState(data.adecuaciones || {
    cambiarMedidor: false,
    instalarMedidor: false,
    cambiarCaja: false,
    instalarCaja: false,
    cambiarPuestaTierra: false,
    instalarPuestaTierra: false,
    cambiaroInstalarMedidor: false,
    cambiaroInstalarCaja: false,
    cambiaroInstalarPuestaTierra: false,
    cambiaroInstalarBloquePruebas: false,
    cambiaroInstalarProteccionesElectricas: false,
    cambiaroInstalarCableSenal: false,
    adecuaroInstalaraSeguridadCeldas: false,
    cambiaroInstalarCelda: false,
    cambiaroInstalarSistemaComunicacion: false,
    cambiaroInstalarModem: false,
    cambiaroInstalarProteccionesCommunicacion: false,
    cambiaroInstalarDuctosCableSeñal: false,
    otros: false,
    otrosTexto: ''
  });

  const [informe, setInforme] = useState(data.informe || '');
  const [informeTexto, setInformeTexto] = useState(data.informeTexto || '');

  const opcionesFrontera = ['MCM', 'RGP', 'NRP', 'NRO', 'REGO', 'SNT', 'CAMB COM'];

  const [showEditor, setShowEditor] = useState(false);
  const [currentEditingDiagram, setCurrentEditingDiagram] = useState(null);
  const [currentDiagramType, setCurrentDiagramType] = useState(null);
  const [savedDiagrams, setSavedDiagrams] = useState({
    unifilar: data.savedUnifilar || null,
    conexiones: data.savedConexiones || null
  });

  const diagramOptions = {
    unifilar: [
      { id: 'unifilar1', name: 'Diagrama Unifilar 1', image: unifilar1 },
      { id: 'unifilar2', name: 'Diagrama Unifilar 2', image: unifilar2 },
      { id: 'unifilar3', name: 'Diagrama Unifilar 3', image: unifilar3 },
      { id: 'unifilar4', name: 'Diagrama Unifilar 4', image: unifilar4 },
      { id: 'unifilar5', name: 'Diagrama Unifilar 5', image: unifilar5 },
      { id: 'unifilar6', name: 'Diagrama Unifilar 6', image: unifilar6 },
      { id: 'unifilar7', name: 'Diagrama Unifilar 7', image: unifilar7 },
      { id: 'unifilar8', name: 'Diagrama Unifilar 8', image: unifilar8 },
      { id: 'unifilar9', name: 'Diagrama Unifilar 9', image: unifilar9 },
      { id: 'unifilar10', name: 'Diagrama Unifilar 10', image: unifilar10 },
      { id: 'unifilar11', name: 'Diagrama Unifilar 11', image: unifilar11 },
      { id: 'unifilar12', name: 'Diagrama Unifilar 12', image: unifilar12 },
      { id: 'unifilar13', name: 'Diagrama Unifilar 13', image: unifilar13 },
      { id: 'unifilar14', name: 'Diagrama Unifilar 14', image: unifilar14 },
      { id: 'unifilar15', name: 'Diagrama Unifilar 15', image: unifilar15 },
      { id: 'unifilar16', name: 'Diagrama Unifilar 16', image: unifilar16 },
      { id: 'unifilar17', name: 'Diagrama Unifilar 17', image: unifilar17 },
      { id: 'unifilar18', name: 'Diagrama Unifilar 18', image: unifilar18 },
      { id: 'unifilar19', name: 'Diagrama Unifilar 19', image: unifilar19 },
      { id: 'unifilar20', name: 'Diagrama Unifilar 20', image: unifilar20 },
      { id: 'unifilar21', name: 'Diagrama Unifilar 21', image: unifilar21 },
      { id: 'unifilar22', name: 'Diagrama Unifilar 22', image: unifilar22 },
      { id: 'unifilar23', name: 'Diagrama Unifilar 23', image: unifilar23 },
      { id: 'unifilar24', name: 'Diagrama Unifilar 24', image: unifilar24 },
      { id: 'unifilar25', name: 'Diagrama Unifilar 25', image: unifilar25 },
      { id: 'unifilar26', name: 'Diagrama Unifilar 26', image: unifilar26 },
      { id: 'unifilar27', name: 'Diagrama Unifilar 27', image: unifilar27 },
      { id: 'unifilar28', name: 'Diagrama Unifilar 28', image: unifilar28 },
      { id: 'unifilar29', name: 'Diagrama Unifilar 29', image: unifilar29 },
      { id: 'unifilar30', name: 'Diagrama Unifilar 30', image: unifilar30 },
      { id: 'unifilar31', name: 'Diagrama Unifilar 31', image: unifilar31 },
      { id: 'unifilar32', name: 'Diagrama Unifilar 32', image: unifilar32 },
      { id: 'unifilar33', name: 'Diagrama Unifilar 33', image: unifilar33 },
      { id: 'unifilar34', name: 'Diagrama Unifilar 34', image: unifilar34 },
      { id: 'unifilar35', name: 'Diagrama Unifilar 35', image: unifilar35 },
      { id: 'unifilar36', name: 'Diagrama Unifilar 36', image: unifilar36 },
      { id: 'unifilar37', name: 'Diagrama Unifilar 37', image: unifilar37 },
      { id: 'unifilar38', name: 'Diagrama Unifilar 38', image: unifilar38 },
      { id: 'unifilar39', name: 'Diagrama Unifilar 39', image: unifilar39 },
      { id: 'unifilar40', name: 'Diagrama Unifilar 40', image: unifilar40 },
      { id: 'unifilar41', name: 'Diagrama Unifilar 41', image: unifilar41 },
      { id: 'unifilar42', name: 'Diagrama Unifilar 42', image: unifilar42 },
      { id: 'unifilar43', name: 'Diagrama Unifilar 43', image: unifilar43 },
      { id: 'unifilar44', name: 'Diagrama Unifilar 44', image: unifilar44 },

    ],
    conexiones: [
      { id: 'conexiones1', name: 'Diagrama Conexiones 1', image: conexiones1 },
      { id: 'conexiones2', name: 'Diagrama Conexiones 2', image: conexiones2 },
      { id: 'conexiones3', name: 'Diagrama Conexiones 3', image: conexiones3 },
      { id: 'conexiones4', name: 'Diagrama Conexiones 4', image: conexiones4 },
      { id: 'conexiones5', name: 'Diagrama Conexiones 5', image: conexiones5 },
      { id: 'conexiones6', name: 'Diagrama Conexiones 6', image: conexiones6 },
      { id: 'conexiones7', name: 'Diagrama Conexiones 7', image: conexiones7 },
      { id: 'conexiones8', name: 'Diagrama Conexiones 8', image: conexiones8 },
      { id: 'conexiones9', name: 'Diagrama Conexiones 9', image: conexiones9 },
      { id: 'conexiones10', name: 'Diagrama Conexiones 10', image: conexiones10 },
      { id: 'conexiones11', name: 'Diagrama Conexiones 11', image: conexiones11 },
      { id: 'conexiones12', name: 'Diagrama Conexiones 12', image: conexiones12 },
      { id: 'conexiones13', name: 'Diagrama Conexiones 13', image: conexiones13 },
      { id: 'conexiones14', name: 'Diagrama Conexiones 14', image: conexiones14 },
      { id: 'conexiones15', name: 'Diagrama Conexiones 15', image: conexiones15 },
      { id: 'conexiones16', name: 'Diagrama Conexiones 16', image: conexiones16 },
      { id: 'conexiones17', name: 'Diagrama Conexiones 17', image: conexiones17 },
      { id: 'conexiones18', name: 'Diagrama Conexiones 18', image: conexiones18 },
      { id: 'conexiones19', name: 'Diagrama Conexiones 19', image: conexiones19 },
      { id: 'conexiones20', name: 'Diagrama Conexiones 20', image: conexiones20 }
    ]
  };

  const handleFasorialCurrentChange = (index, field, value) => {
    const updated = [...fasorialCurrents];
    if (field === "angle") {
      updated[index][field] = parseFloat(value) || 0;
    } else if (field === "magnitud") {
      updated[index][field] = parseInt(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setFasorialCurrents(updated);
  };

  const capturePhasorDiagram = async () => {
    const svg = phasorSvgRef.current;
    if (!svg) return null;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = url;
    });
  };

  // Componente PhasorDiagram con colores para corrientes
  const PhasorDiagram = ({ currents, svgRef }) => {
    const size = 400;
    const center = size / 2;
    const maxVoltageScale = 120;
    const minVoltageScale = 15;
    const maxCurrentScale = 100;
    const minCurrentScale = 15;

    const voltages = systemType === "bifasico"
      ? [
          { name: "V1", angle: 90 },
          { name: "V2", angle: -90 },
        ]
      : [
          { name: "V1", angle: 90 },
          { name: "V2", angle: -30 },
          { name: "V3", angle: 210 },
        ];

    const getCurrentScale = (magnitud) => {
      if (!magnitud || magnitud === 0) return minCurrentScale;
      const normalizedMagnitud = Math.min(100, Math.max(0, magnitud));
      return minCurrentScale + (normalizedMagnitud / 100) * (maxCurrentScale - minCurrentScale);
    };

    const getVoltageScale = (magnitud) => {
      if (!magnitud || magnitud === 0) return 0;
      const normalizedMagnitud = Math.min(100, Math.max(0, magnitud));
      return minVoltageScale + (normalizedMagnitud / 100) * (maxVoltageScale - minVoltageScale);
    };

    // Colores para corrientes: I1=Amarillo, I2=Azul, I3=Rojo
    const currentColors = ['#FFD700', '#0066FF', '#FF0000'];

    return (
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          {/* Flecha negra para voltajes */}
          <marker
            id="arrowVoltage"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill="black" />
          </marker>
          
          {/* Flechas de colores para corrientes */}
          {currentColors.map((color, idx) => (
            <marker
              key={`arrowCurrent${idx + 1}`}
              id={`arrowCurrent${idx + 1}`}
              markerWidth="10"
              markerHeight="10"
              refX="10"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L10,3 L0,6 Z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* Ejes de referencia */}
        <line x1={center} y1="0" x2={center} y2={size} stroke="#ddd" strokeWidth="1" strokeDasharray="4" />
        <line x1="0" y1={center} x2={size} y2={center} stroke="#ddd" strokeWidth="1" strokeDasharray="4" />

        {/* Círculos de referencia */}
        <circle cx={center} cy={center} r={maxCurrentScale} fill="none" stroke="#eee" strokeWidth="1" strokeDasharray="4" />
        <circle cx={center} cy={center} r={minCurrentScale} fill="none" stroke="#eee" strokeWidth="1" strokeDasharray="4" />

        {/* Voltajes - Solo líneas negras con flechas negras */}
        {voltages.map((v, i) => {
          const rad = toRadians(v.angle);
          const vMagnitud = currents[i]?.vMagnitud !== undefined ? currents[i].vMagnitud : 100;
          const scale = getVoltageScale(vMagnitud);
          
          // Si la magnitud es 0, no dibujar el voltaje
          if (scale === 0) return null;
          
          const x = center + scale * Math.cos(rad);
          const y = center - scale * Math.sin(rad);
          const offsetX = Math.cos(rad) > 0 ? 5 : -35;
          const offsetY = Math.sin(rad) > 0 ? -5 : 15;

          return (
            <g key={i}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="black"
                strokeWidth="2"
                markerEnd="url(#arrowVoltage)"
              />
              <text x={x + offsetX} y={y + offsetY} fontSize="14" fontWeight="bold" fill="black">
                {v.name}
              </text>
            </g>
          );
        })}

        {/* Corrientes - Líneas y círculos con colores */}
        {currents.map((c, i) => {
          const baseAngle = voltages[i]?.angle || 0;
          const vMagnitud = c.vMagnitud !== undefined ? c.vMagnitud : 100;
          
          // Si no hay voltaje, no mostrar corriente
          if (!vMagnitud || vMagnitud === 0) return null;

          const finalAngle = c.type === "inductiva" 
            ? baseAngle - (c.angle || 0)
            : baseAngle + (c.angle || 0);

          const rad = toRadians(finalAngle);
          const currentScale = getCurrentScale(c.magnitud || 0);
          const color = currentColors[i % currentColors.length];
          const x = center + currentScale * Math.cos(rad);
          const y = center - currentScale * Math.sin(rad);
          const textX = (c.magnitud === 0 || !c.magnitud) ? center + 15 : x + 8;
          const textY = (c.magnitud === 0 || !c.magnitud) ? center - 15 : y - 8;

          return (
            <g key={i}>
              {/* Línea de corriente con color */}
              {(c.magnitud > 0 && c.magnitud !== 0) && (
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={color}
                  strokeWidth="2.5"
                />
              )}
              
              {/* Círculo al final de la corriente */}
              {(c.magnitud > 0 && c.magnitud !== 0) && (
                <circle cx={x} cy={y} r={5} fill={color} />
              )}
              
              {/* Si magnitud es 0, mostrar punto en el centro */}
              {(c.magnitud === 0 || !c.magnitud) && (
                <circle cx={center} cy={center} r={4} fill={color} opacity="0.5" />
              )}
              {/* 🔽 TEXTO MODIFICADO - SOLO ÁNGULO 🔽 */}
              <text x={textX} y={textY} fontSize="12" fill={color} fontWeight="bold">
                I{i + 1} ({c.angle || 0}°)
              </text>
              {/* Texto de la corriente
              <text x={textX} y={textY} fontSize="12" fill={color} fontWeight="bold">
                I{i + 1} ({c.angle || 0}°{c.magnitud !== undefined && c.magnitud !== 0 ? `, ${c.magnitud}%` : ''})
              </text>
               */}
            </g>
          );
        })}
      </svg>
    );
  };

  const saveImageToLocalStorage = async (key, imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = function() {
        localStorage.setItem(key, reader.result);
      }
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error guardando imagen en localStorage:', error);
    }
  };

  const handleDiagramSelect = (diagramType, diagramId, imageSrc) => {
    setCurrentEditingDiagram(imageSrc);
    setCurrentDiagramType(diagramType);
    setShowEditor(true);
    setSelectedDiagrams(prev => ({
      ...prev,
      [diagramType]: diagramId
    }));
  };

  const handleSaveDiagram = (diagramData) => {
    setSavedDiagrams(prev => ({
      ...prev,
      [currentDiagramType]: diagramData
    }));
  };

  const handleTpChange = (field, value) => {
    const updated = { ...tpData, [field]: value };
    setTpData(updated);
    
    if (updated.errorVR && updated.errorVS && updated.errorVT) {
      const promedio = ((parseFloat(updated.errorVR) + parseFloat(updated.errorVS) + parseFloat(updated.errorVT)) / 3).toFixed(2);
      setTpData(prev => ({ ...prev, errorPromedio: promedio }));
    }
  };

  const handleTcChange = (field, value) => {
    const updated = { ...tcData, [field]: value };
    setTcData(updated);
    
    if (updated.errorVR && updated.errorVS && updated.errorVT) {
      const promedio = ((parseFloat(updated.errorVR) + parseFloat(updated.errorVS) + parseFloat(updated.errorVT)) / 3).toFixed(2);
      setTcData(prev => ({ ...prev, errorPromedio: promedio }));
    }
  };

  const handleFactorChange = (field, value) => {
    setFactorData(prev => ({ ...prev, [field]: value }));
  };

  const handleObservacionChange = (equipo, valor) => {
    setObservaciones(prev => ({ ...prev, [equipo]: valor }));
  };

  const handleAdecuacionChange = (tipo, checked) => {
    setAdecuaciones(prev => ({ ...prev, [tipo]: checked }));
  };

  const handleContinue = async () => {
    try {
      const phasorImage = await capturePhasorDiagram();
      if (phasorImage) {
        localStorage.setItem('diagrama_fasorial', phasorImage);
      }

      const captureFullDiagram = async (diagramData, baseImageSrc) => {
        return new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          canvas.width = 1000;
          canvas.height = 500;
          const ctx = canvas.getContext('2d');
          
          const canvasWidth = 1000;
          const canvasHeight = 500;
          const baseImageWidth = 900;
          const baseImageHeight = 450;
          const baseImageX = (canvasWidth - baseImageWidth) / 2;
          const baseImageY = (canvasHeight - baseImageHeight) / 2;
          
          const loadImage = (src) => {
            return new Promise((resolveImg) => {
              const img = new Image();
              img.onload = () => resolveImg(img);
              img.onerror = () => {
                console.error('Error cargando imagen:', src);
                resolveImg(null);
              };
              img.src = src;
            });
          };
          
          Promise.all([
            loadImage(baseImageSrc),
            loadImage(medidorImg),
            loadImage(tpImg)
          ]).then(([baseImg, medidorImage, tpImage]) => {
            if (!baseImg) {
              console.error('No se pudo cargar la imagen base');
              resolve(null);
              return;
            }
            
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(baseImg, baseImageX, baseImageY, baseImageWidth, baseImageHeight);
            
            const imageMap = { medidor: medidorImage, tp: tpImage };
            
            if (diagramData.elements?.length > 0) {
              diagramData.elements.forEach(el => {
                const elementImage = imageMap[el.type];
                if (elementImage && el.x !== undefined && el.y !== undefined) {
                  ctx.drawImage(elementImage, el.x, el.y, el.width || 60, el.height || 60);
                }
              });
            }
            
            if (diagramData.texts?.length > 0) {
              diagramData.texts.forEach(text => {
                if (text.x !== undefined && text.y !== undefined && text.text) {
                  ctx.font = `${text.fontSize || 20}px Arial`;
                  ctx.fillStyle = text.fill || '#333';
                  ctx.fillText(text.text, text.x, text.y);
                }
              });
            }
            
            if (diagramData.lines?.length > 0) {
              diagramData.lines.forEach(line => {
                if (line.points && line.points.length > 0) {
                  ctx.beginPath();
                  ctx.strokeStyle = '#000000';
                  ctx.lineWidth = 3;
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctx.moveTo(line.points[0], line.points[1]);
                  for (let i = 2; i < line.points.length; i += 2) {
                    ctx.lineTo(line.points[i], line.points[i + 1]);
                  }
                  ctx.stroke();
                }
              });
            }
            
            resolve(canvas.toDataURL('image/png'));
          }).catch(error => {
            console.error('Error en Promise.all:', error);
            resolve(null);
          });
        });
      };

      if (savedDiagrams.unifilar && selectedDiagrams.unifilar) {
        const baseImage = diagramOptions.unifilar.find(d => d.id === selectedDiagrams.unifilar)?.image;
        if (baseImage) {
          const editedImage = await captureFullDiagram(savedDiagrams.unifilar, baseImage);
          if (editedImage) {
            localStorage.setItem('diagrama_unifilar_editado', editedImage);
          } else {
            await saveImageToLocalStorage('diagrama_unifilar_editado', baseImage);
          }
        }
      } else if (selectedDiagrams.unifilar) {
        const baseImage = diagramOptions.unifilar.find(d => d.id === selectedDiagrams.unifilar)?.image;
        if (baseImage) {
          await saveImageToLocalStorage('diagrama_unifilar_editado', baseImage);
        }
      }
      
      if (savedDiagrams.conexiones && selectedDiagrams.conexiones) {
        const baseImage = diagramOptions.conexiones.find(d => d.id === selectedDiagrams.conexiones)?.image;
        if (baseImage) {
          const editedImage = await captureFullDiagram(savedDiagrams.conexiones, baseImage);
          if (editedImage) {
            localStorage.setItem('diagrama_conexiones_editado', editedImage);
          } else {
            await saveImageToLocalStorage('diagrama_conexiones_editado', baseImage);
          }
        }
      } else if (selectedDiagrams.conexiones) {
        const baseImage = diagramOptions.conexiones.find(d => d.id === selectedDiagrams.conexiones)?.image;
        if (baseImage) {
          await saveImageToLocalStorage('diagrama_conexiones_editado', baseImage);
        }
      }

      updateData({
        diagramaUnifilar: selectedDiagrams.unifilar,
        diagramaFasorial: 'Diagrama Fasorial',
        diagramaConexiones: selectedDiagrams.conexiones,
        fasorialCurrents,
        lineaDedicada,
        tipoFrontera,
        tpData,
        tcData,
        factorData,
        observaciones,
        adecuaciones,
        informe,
        informeTexto,
        savedUnifilar: savedDiagrams.unifilar,
        savedConexiones: savedDiagrams.conexiones
      });
      
      nextStep();
    } catch (error) {
      console.error('Error en handleContinue:', error);
      toast.error('Error al guardar los datos');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Información Técnica y Diagramas</h2>
        <p className={styles.subtitle}>Complete toda la información técnica requerida</p>
      </div>

      {/* Sección 1: Línea Dedicada y Tipo de Frontera */}
      <div className={styles.formSection}>
        <h3>Configuración de Línea</h3>
        <div className={`${styles.formRow} ${styles.twoColumns}`}>
          <div className={styles.formGroup}>
            <label className={styles.label}>¿Línea Dedicada?</label>
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                className={`${styles.btnOption} ${lineaDedicada === 'SI' ? styles.btnSelected : ''}`}
                onClick={() => setLineaDedicada('SI')}
              >
                Sí
              </button>
              <button 
                type="button" 
                className={`${styles.btnOption} ${lineaDedicada === 'NO' ? styles.btnSelected : ''}`}
                onClick={() => setLineaDedicada('NO')}
              >
                No
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Frontera</label>
            <select 
              value={tipoFrontera} 
              onChange={(e) => setTipoFrontera(e.target.value)}
              className={styles.formSelect}
            >
              <option value="">Seleccionar...</option>
              {opcionesFrontera.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección 2: Diagramas */}
      <div className={styles.formSection}>
        <h3>Selección de Diagramas</h3>
        
        <div className={styles.diagramSection}>
          <h4>Diagrama Unifilar</h4>
          <div className={styles.diagramGrid}>
            {diagramOptions.unifilar.map(diagram => (
              <div 
                key={diagram.id}
                className={`${styles.diagramCard} ${selectedDiagrams.unifilar === diagram.id ? styles.selected : ''}`}
                onClick={() => handleDiagramSelect('unifilar', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} className={styles.diagramImage} />
                <p className={styles.diagramName}>{diagram.name}</p>
              </div>
            ))}
          </div>
          {savedDiagrams.unifilar && (
            <div className={styles.savedDiagramInfo}>
              <span> <FiCheckSquare/> Diagrama editado guardado</span>
              <button onClick={() => {
                setCurrentEditingDiagram(diagramOptions.unifilar.find(d => d.id === selectedDiagrams.unifilar)?.image);
                setCurrentDiagramType('unifilar');
                setShowEditor(true);
              }}><FiEdit/> Editar nuevamente</button>
            </div>
          )}
        </div>

        <div className={styles.diagramSection}>
        <h4>Diagrama Fasorial</h4>
        <div className={styles.fasorialContainer}>
          {/* Selector de sistema */}
          <div className={styles.systemTypeSelector}>
            <label>Tipo de sistema:</label>
            <select
              value={systemType}
              onChange={(e) => {
                const type = e.target.value;
                setSystemType(type);
                setFasorialCurrents(getDefaultCurrents(type));
              }}
              className={styles.typeSelect}
            >
              <option value="bifasico">Bifásico</option>
              <option value="trifasico">Trifásico</option>
            </select>
          </div>

          {/* Tabla de controles por fase */}
          <div className={styles.fasorialTableWrapper}>
            <table className={styles.fasorialTable}>
              <thead>
                <tr>
                  <th>Fase</th>
                  <th>V (Magnitud)</th>
                  <th>I (Ángulo)</th>
                  <th>I (Tipo)</th>
                  <th>I (Magnitud)</th>
                </tr>
              </thead>
              <tbody>
                {fasorialCurrents.map((c, i) => {
                  const colors = ['#FFD700', '#0066FF', '#FF0000'];
                  const color = colors[i % colors.length];
                  const bgColor = i === 0 ? '#FFF8E1' : i === 1 ? '#E3F2FD' : '#FFEBEE';
                  const isBifasico = systemType === 'bifasico';
                  
                  // Calcular el máximo permitido para la corriente basado en el voltaje
                  const maxCurrentAllowed = c.vMagnitud || 100;
                  
                  // Asegurar que la magnitud de corriente no supere el máximo permitido
                  const currentMagnitud = Math.min(c.magnitud || 0, maxCurrentAllowed);
                  
                  return (
                    <tr key={i} className={styles.fasorialRow} style={{ backgroundColor: bgColor }}>
                      <td style={{ fontWeight: 'bold', color: color, textAlign: 'center' }}>
                        {isBifasico ? `Fase ${i + 1}` : `Fase ${i + 1}`}
                      </td>
                      
                      {/* Control de magnitud del voltaje */}
                      <td>
                        <div className={styles.fasorialControl}>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={c.vMagnitud !== undefined ? c.vMagnitud : 100}
                            onChange={(e) => {
                              const newMagnitud = parseInt(e.target.value);
                              const updated = [...fasorialCurrents];
                              updated[i].vMagnitud = newMagnitud;
                              // Si la corriente supera el nuevo voltaje, ajustarla
                              if (updated[i].magnitud > newMagnitud) {
                                updated[i].magnitud = newMagnitud;
                              }
                              setFasorialCurrents(updated);
                            }}
                            className={styles.rangeInput}
                            step="1"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={c.vMagnitud !== undefined ? c.vMagnitud : 100}
                            onChange={(e) => {
                              const newMagnitud = parseInt(e.target.value) || 0;
                              const updated = [...fasorialCurrents];
                              updated[i].vMagnitud = Math.min(100, Math.max(0, newMagnitud));
                              // Si la corriente supera el nuevo voltaje, ajustarla
                              if (updated[i].magnitud > updated[i].vMagnitud) {
                                updated[i].magnitud = updated[i].vMagnitud;
                              }
                              setFasorialCurrents(updated);
                            }}
                            className={styles.magnitudInput}
                            step="1"
                            style={{ 
                              borderColor: color,
                              opacity: (!c.vMagnitud || c.vMagnitud === 0) ? 0.5 : 1,
                              backgroundColor: (!c.vMagnitud || c.vMagnitud === 0) ? '#f0f0f0' : 'white'
                            }}
                          />
                          <span>%</span>
                        </div>
                      </td>
                      
                      {/* Ángulo de corriente (deshabilitado si no hay voltaje) */}
                      <td>
                        <div className={styles.fasorialControl}>
                          <input
                            type="number"
                            value={c.angle}
                            onChange={(e) => handleFasorialCurrentChange(i, "angle", e.target.value)}
                            className={styles.angleInput}
                            step="0.1"
                            disabled={!c.vMagnitud || c.vMagnitud === 0}
                            style={{ 
                              borderColor: color,
                              opacity: (!c.vMagnitud || c.vMagnitud === 0) ? 0.5 : 1,
                              backgroundColor: (!c.vMagnitud || c.vMagnitud === 0) ? '#f0f0f0' : 'white'
                            }}
                          />
                          <span>°</span>
                        </div>
                      </td>
                      
                      {/* Tipo de corriente (deshabilitado si no hay voltaje) */}
                      <td>
                        <select
                          value={c.type}
                          onChange={(e) => handleFasorialCurrentChange(i, "type", e.target.value)}
                          className={styles.typeSelect}
                          disabled={!c.vMagnitud || c.vMagnitud === 0}
                          style={{ 
                              borderColor: color,
                              opacity: (!c.vMagnitud || c.vMagnitud === 0) ? 0.5 : 1,
                              backgroundColor: (!c.vMagnitud || c.vMagnitud === 0) ? '#f0f0f0' : 'white'
                            }}
                        >
                          <option value="inductiva">Inductiva</option>
                          <option value="capacitiva">Capacitiva</option>
                        </select>
                      </td>
                      
                      {/* Magnitud de corriente (limitada por el voltaje) */}
                      <td>
                        <div className={styles.fasorialControl}>
                          <input
                            type="range"
                            min="0"
                            max={maxCurrentAllowed}
                            value={currentMagnitud}
                            onChange={(e) => {
                              const newMagnitud = parseInt(e.target.value);
                              handleFasorialCurrentChange(i, "magnitud", newMagnitud);
                            }}
                            className={styles.rangeInput}
                            step="1"
                            disabled={!c.vMagnitud || c.vMagnitud === 0}
                          />
                          <input
                            type="number"
                            min="0"
                            max={maxCurrentAllowed}
                            value={currentMagnitud}
                            onChange={(e) => {
                              const newMagnitud = parseInt(e.target.value) || 0;
                              const clampedValue = Math.min(newMagnitud, maxCurrentAllowed);
                              handleFasorialCurrentChange(i, "magnitud", clampedValue);
                            }}
                            className={styles.magnitudInput}
                            step="1"
                            disabled={!c.vMagnitud || c.vMagnitud === 0}
                            style={{ 
                              borderColor: color,
                              opacity: (!c.vMagnitud || c.vMagnitud === 0) ? 0.5 : 1,
                              backgroundColor: (!c.vMagnitud || c.vMagnitud === 0) ? '#f0f0f0' : 'white'
                            }}
                          />
                          <span style={{ opacity: (!c.vMagnitud || c.vMagnitud === 0) ? 0.5 : 1 }}>%</span>
                        </div>
                        {c.vMagnitud > 0 && c.vMagnitud < 100 && (
                          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                            Max: {maxCurrentAllowed}%
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

            <div className={styles.phasorDiagramWrapper}>
              <PhasorDiagram currents={fasorialCurrents} svgRef={phasorSvgRef} />
            </div>
            <p className={styles.diagramHint}>
              * El diagrama se actualiza automáticamente. <br/>
              • Ángulo: desplazamiento de la corriente respecto al voltaje <br/>
              • Magnitud: tamaño del vector (0% = punto en el centro, 100% = máxima longitud)
            </p>
          </div>
        </div>

        <div className={styles.diagramSection}>
          <h4>Diagrama de Conexiones</h4>
          <div className={styles.diagramGrid}>
            {diagramOptions.conexiones.map(diagram => (
              <div 
                key={diagram.id}
                className={`${styles.diagramCard} ${selectedDiagrams.conexiones === diagram.id ? styles.selected : ''}`}
                onClick={() => handleDiagramSelect('conexiones', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} className={styles.diagramImage} />
                <p className={styles.diagramName}>{diagram.name}</p>
              </div>
            ))}
          </div>
          {savedDiagrams.conexiones && (
            <div className={styles.savedDiagramInfo}>
              <span><FiCheckSquare/> Diagrama editado guardado</span>
              <button onClick={() => {
                setCurrentEditingDiagram(diagramOptions.conexiones.find(d => d.id === selectedDiagrams.conexiones)?.image);
                setCurrentDiagramType('conexiones');
                setShowEditor(true);
              }}><FiEdit/> Editar nuevamente</button>
            </div>
          )}
        </div>
      </div>

      {/* Sección 3: Prueba de Transformadores de Potencial (TP's) */}
      <div className={styles.formSection}>
        <h3>Prueba de Transformadores de Potencial (TP's)</h3>
        <div className={styles.testTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Voltaje</th>
                <th>Primario</th>
                <th>Secundario</th>
                <th>RTP (Vp/VS)</th>
                <th>% ERROR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>V_R</td>
                <td><input type="number" value={tpData.vRPrimario || ''} onChange={(e) => handleTpChange('vRPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vRSecundario || ''} onChange={(e) => handleTpChange('vRSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vRRtp || ''} onChange={(e) => handleTpChange('vRRtp', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.errorVR || ''} onChange={(e) => handleTpChange('errorVR', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>V_S</td>
                <td><input type="number" value={tpData.vSPrimario || ''} onChange={(e) => handleTpChange('vSPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vSSecundario || ''} onChange={(e) => handleTpChange('vSSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vSRtp || ''} onChange={(e) => handleTpChange('vSRtp', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.errorVS || ''} onChange={(e) => handleTpChange('errorVS', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>V_T</td>
                <td><input type="number" value={tpData.vTPrimario || ''} onChange={(e) => handleTpChange('vTPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vTSecundario || ''} onChange={(e) => handleTpChange('vTSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vTRtp || ''} onChange={(e) => handleTpChange('vTRtp', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.errorVT || ''} onChange={(e) => handleTpChange('errorVT', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.promedioLabel}>%PROMEDIO:</td>
                <td><input type="number" value={tpData.errorPromedio || ''} readOnly className={styles.readonlyInput} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 4: Prueba de Transformadores de Corriente (TC's) */}
      <div className={styles.formSection}>
        <h3>Prueba de Transformadores de Corriente (TC's)</h3>
        <div className={styles.testTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Primario</th>
                <th>Secundario</th>
                <th>RTC (Ip/IS)</th>
                <th>% ERROR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>I_R</td>
                <td><input type="number" value={tcData.vRPrimario || ''} onChange={(e) => handleTcChange('vRPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vRSecundario || ''} onChange={(e) => handleTcChange('vRSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vRRtc || ''} onChange={(e) => handleTcChange('vRRtc', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.errorVR || ''} onChange={(e) => handleTcChange('errorVR', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>I_S</td>
                <td><input type="number" value={tcData.vSPrimario || ''} onChange={(e) => handleTcChange('vSPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vSSecundario || ''} onChange={(e) => handleTcChange('vSSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vSRtc || ''} onChange={(e) => handleTcChange('vSRtc', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.errorVS || ''} onChange={(e) => handleTcChange('errorVS', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>I_T</td>
                <td><input type="number" value={tcData.vTPrimario || ''} onChange={(e) => handleTcChange('vTPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vTSecundario || ''} onChange={(e) => handleTcChange('vTSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vTRtc || ''} onChange={(e) => handleTcChange('vTRtc', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.errorVT || ''} onChange={(e) => handleTcChange('errorVT', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.promedioLabel}>% ERROR PROMEDIO:</td>
                <td><input type="number" value={tcData.errorPromedio || ''} readOnly className={styles.readonlyInput} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 5: Factor SIEC */}
      <div className={styles.formSection}>
        <h3>Factor SIEC</h3>
        <div className={styles.factorGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Factor SIEC</label>
            <input type="number" step="0.001" value={factorData.factorSiec || ''} onChange={(e) => handleFactorChange('factorSiec', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Factor Encontrado</label>
            <input type="number" step="0.001" value={factorData.factorEncontrado || ''} onChange={(e) => handleFactorChange('factorEncontrado', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>% Error de Factor</label>
            <input type="number" step="0.001" value={factorData.errorFactor || ''} onChange={(e) => handleFactorChange('errorFactor', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Factor Final</label>
            <input type="number" step="0.001" value={factorData.factorFinal || ''} onChange={(e) => handleFactorChange('factorFinal', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Equipo Patron</label>
            <input type="number" step="0.001" value={factorData.equipoPatron || ''} onChange={(e) => handleFactorChange('equipoPatron', e.target.value)} className={styles.numberInput} />
          </div>
        </div>
      </div>

      {/* Sección 6: Observaciones Generales */}
      <div className={styles.formSection}>
        <h3>Observaciones Generales</h3>
        <div className={styles.observacionesGrid}>
          {[
            { key: 'redMT', label: 'Red MT' },
            { key: 'redBT', label: 'Red BT' },
            { key: 'crucetas', label: 'Crucetas' },
            { key: 'pararrayos', label: 'Pararrayos' },
            { key: 'cortacircuitos', label: 'Cortacircuitos' },
            { key: 'fusibles', label: 'Fusibles' },
            { key: 'bajantes', label: 'Bajantes' },
            { key: 'transformador', label: 'Transformador' },
            { key: 'tps', label: 'TPs' },
            { key: 'tcs', label: 'TCs' },
            { key: 'bloquesPrueba', label: 'Bloques de Prueba' },
            { key: 'celda', label: 'Celda' },
            { key: 'gabinetes', label: 'Gabinetes' },
            { key: 'modem', label: 'Modem' },
            { key: 'cableSenal', label: 'Cable de Señal' }
          ].map(equipo => (
            <div key={equipo.key} className={styles.observacionItem}>
              <label className={styles.observacionLabel}>{equipo.label}</label>
              <div className={styles.estadoButtons}>
                <button
                  type="button"
                  className={`${styles.estadoBtn} ${styles.estadoBtnBueno} ${observaciones[equipo.key] === 'Bueno' ? styles.selected : ''}`}
                  onClick={() => handleObservacionChange(equipo.key, 'Bueno')}
                  title="Bueno"
                >
                  B
                </button>
                <button
                  type="button"
                  className={`${styles.estadoBtn} ${styles.estadoBtnRegular} ${observaciones[equipo.key] === 'Regular' ? styles.selected : ''}`}
                  onClick={() => handleObservacionChange(equipo.key, 'Regular')}
                  title="Regular"
                >
                  R
                </button>
                <button
                  type="button"
                  className={`${styles.estadoBtn} ${styles.estadoBtnMalo} ${observaciones[equipo.key] === 'Malo' ? styles.selected : ''}`}
                  onClick={() => handleObservacionChange(equipo.key, 'Malo')}
                  title="Malo"
                >
                  M
                </button>
              </div>
              <div className={styles.estadoIndicator}>
                {observaciones[equipo.key] && (
                  <span className={`${styles.estadoText} ${styles[observaciones[equipo.key].toLowerCase()]}`}>
                    {observaciones[equipo.key].charAt(0)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 7: Adecuaciones y Mejoras */}
      <div className={styles.formSection}>
        <h3>Adecuaciones y Mejoras</h3>
        <div className={styles.adecuacionesGrid}>
          {[
            { id: 'cambiaroInstalarMedidor', label: 'Cambiar o Instalar medidor' },
            { id: 'cambiaroInstalarCaja', label: 'Cambiar o Instalar caja para el medidor' },
            { id: 'cambiaroInstalarPuestaTierra', label: 'Cambiar o Instalar sistema de puesta de tierra' },
            { id: 'cambiaroInstalarBloquePruebas', label: 'Cambiar o Instalar bloque de prueba' },
            { id: 'cambiaroInstalarProteccionesElectricas', label: 'Cambiar o Instalar protecciones electricas' },
            { id: 'cambiaroInstalarCableSenal', label: 'Cambiar o Instalar cable de señal (segun norma)' },
            { id: 'adecuaroInstalaraSeguridadCeldas', label: 'Adecuar o Instalar seguridad en las celdas de medida' },
            { id: 'cambiaroInstalarCelda', label: 'Cambiar o Instalar celda para medida(TP´S y TC´S) norma' },
            { id: 'cambiaroInstalarSistemaComunicacion', label: 'Cambiar o Instalar sistema de comunicación' },
            { id: 'cambiaroInstalarModem', label: 'Cambiar o Instalar MODEM' },
            { id: 'cambiaroInstalarProteccionesCommunicacion', label: 'Cambiar o Instalar protecciones en comunicaciones' },
            { id: 'cambiaroInstalarDuctosCableSeñal', label: 'Cambiar o Instalar ductos para cable de señal' },
            { id: 'otros', label: 'Otros' }
          ].map(item => (
            <div key={item.id} className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={adecuaciones[item.id] || false} 
                  onChange={(e) => handleAdecuacionChange(item.id, e.target.checked)} 
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxText}>{item.label}</span>
              </label>
            </div>
          ))}
        </div>

        {adecuaciones.otros && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Especifique otros:</label>
            <input 
              type="text" 
              value={adecuaciones.otrosTexto || ''} 
              onChange={(e) => setAdecuaciones(prev => ({ ...prev, otrosTexto: e.target.value }))} 
              placeholder="Describa las otras adecuaciones necesarias"
              className={styles.textInput}
            />
          </div>
        )}
      </div>

      {/* Sección 8: Informe */}
      <div className={styles.formSection}>
        <h3>Informe</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de Informe</label>
          <select 
            value={informe} 
            onChange={(e) => setInforme(e.target.value)}
            className={styles.formSelect}
          >
            <option value="">Seleccionar tipo de informe...</option>
            <option value="instalacion_correcta">Instalación Correcta</option>
            <option value="instalacion_incorrecta">Instalación Incorrecta</option>
            <option value="medidor_incorrecto">Medidor Incorrecto</option>
            <option value="frontera_incorrecta">Frontera Incorrecta</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        {informe === 'otros' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Especifique el informe:</label>
            <textarea 
              value={informeTexto || ''} 
              onChange={(e) => setInformeTexto(e.target.value)} 
              placeholder="Describa el informe..."
              rows="4"
              className={styles.informeTextarea}
            />
          </div>
        )}
      </div>

      {/* Modal del Editor de Diagramas */}
      {showEditor && currentEditingDiagram && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.modalCloseButton}
              onClick={() => setShowEditor(false)}
            >
              &times;
            </button>
            <DiagramEditor 
              image={currentEditingDiagram} 
              onClose={() => setShowEditor(false)}
              onSave={handleSaveDiagram}
              savedData={savedDiagrams[currentDiagramType]}
            />
          </div>
        </div>
      )}

      <Toaster position="bottom-center" />

      <div className={styles.navigationButtons}>
        <button className={styles.btnBack} onClick={prevStep}>
          ← Anterior
        </button>
        <button className={styles.btnPrimary} onClick={handleContinue}>
          Continuar →
        </button>
      </div>
    </div>
  );
};

export default DiagramSelectionStep;