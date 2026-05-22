import React, { useState, useEffect, useRef  } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Text} from "react-konva";
import { toast, Toaster } from "react-hot-toast";
import styles from './DiagramSelectionStep.module.css';
import medidorImg from '../assets/overlays/medidor.png';
import tpImg from '../assets/overlays/tp.png';
// Importar imágenes de diagramas (ajusta las rutas según tu estructura)
//unifilar
import unifilar1 from '../assets/images/unifilar/unifilar.png';
import unifilar2 from '../assets/images/unifilar/unifilar2.png';
import unifilar3 from '../assets/images/unifilar/unifilar3.png';
//conexiones
import conexiones1 from '../assets/images/conexiones/conexiones.png';
import conexiones2 from '../assets/images/conexiones/conexiones2.png';
import conexiones3 from '../assets/images/conexiones/conexiones3.png';

// Helper functions para el diagrama fasorial
const toRadians = (deg) => (deg * Math.PI) / 180;

  // Hook personalizado para cargar imágenes
function useImage(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  return image;
}

// Componente del editor de diagramas


  // Componente del editor de diagramas
const DiagramEditor = ({ image, onSave,savedData, onClose }) => {
  const stageRef = useRef();
  const transformerRef = useRef();
  
  const baseImage = useImage(image);
  const medidorImage = useImage(medidorImg);
  const tpImage = useImage(tpImg);
  
  // Inicializar con datos guardados si existen
  const [elements, setElements] = useState(() => {
    if (savedData?.elements && savedData.elements.length > 0) {
      console.log('Cargando elementos guardados:', savedData.elements);
      // Asegurar que las imágenes se asignen correctamente
      return savedData.elements.map(el => ({
        ...el,
        image: el.type === 'medidor' ? medidorImage : tpImage
      }));
    }
    return [];
  });
  
  const [lines, setLines] = useState(() => {
    if (savedData?.lines && savedData.lines.length > 0) {
      console.log('Cargando líneas guardadas:', savedData.lines);
      return savedData.lines;
    }
    return [];
  });
  
  const [texts, setTexts] = useState(() => {
    if (savedData?.texts && savedData.texts.length > 0) {
      console.log('Cargando textos guardados:', savedData.texts);
      return savedData.texts;
    }
    return [];
  });

  const [selectedId, setSelectedId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);

  const canvasWidth = 1000;
  const canvasHeight = 500;
  const baseImageWidth = 900;
  const baseImageHeight = 450;
  const baseImageX = (canvasWidth - baseImageWidth) / 2;
  const baseImageY = (canvasHeight - baseImageHeight) / 2;

   // Efecto para actualizar las imágenes de los elementos cuando las imágenes de overlays estén listas
  useEffect(() => {
    if (savedData?.elements && savedData.elements.length > 0 && medidorImage && tpImage) {
      const updatedElements = savedData.elements.map(el => ({
        ...el,
        image: el.type === 'medidor' ? medidorImage : tpImage
      }));
      setElements(updatedElements);
    }
  }, [medidorImage, tpImage, savedData]);
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
    const imageMap = { medidor: medidorImage, tp: tpImage };
    setElements(prev => [...prev, {
      id: Date.now().toString(),
      type,
      image: imageMap[type],
      x: baseImageX + 100,
      y: baseImageY + 100,
      width: 60,
      height: 60,
      rotation: 0,
    }]);
    toast.success(`${type === "medidor" ? "Medidor" : "TP"} agregado`);
  };

  const addText = () => {
    const text = prompt("Ingrese el texto:");
    if (!text) return;
    setTexts(prev => [...prev, {
      id: Date.now().toString(),
      text,
      x: baseImageX + 150,
      y: baseImageY + 150,
    }]);
    toast.success("Texto agregado");
  };

  const undoLastLine = () => {
    if (lines.length === 0) {
      toast.error("No hay trazos para deshacer");
      return;
    }
    // Eliminar solo la última línea (no dos)
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
    const diagramData = { elements, lines, texts };
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
        {/* Botón cerrar eliminado del toolbar */}
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
                      item.id === el.id
                        ? { ...item, x, y }
                        : item
                    )
                  );
                }}

                onTransformEnd={(e) => {
                  const node = e.target;

                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  // resetear escala visual
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
                fill="#333"
                draggable
                onClick={(e) => handleElementClick(text.id, e)}
                onDragStart={() => setSelectedId(text.id)}
                onDragEnd={(e) => {
                  const { x, y } = e.target.position();

                  setTexts(prev =>
                    prev.map(item =>
                      item.id === text.id
                        ? { ...item, x, y }
                        : item
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
              enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right'
              ]}
              borderStroke="#33CCFF"
              borderStrokeWidth={2}
              anchorStroke="#33CCFF"
              anchorFill="#FFFFFF"
              anchorSize={8}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

const DiagramSelectionStep = ({ data, updateData, nextStep, prevStep }) => {
  // Referencia para el SVG del diagrama fasorial
  const phasorSvgRef = useRef(null);
  const [systemType, setSystemType] = useState("trifasico");
  // Estado para todas las secciones
  const [selectedDiagrams, setSelectedDiagrams] = useState({
    unifilar: data.diagramaUnifilar || '',
    fasorial: data.diagramaFasorial || 'Diagrama Fasorial',
    conexiones: data.diagramaConexiones || ''
  });

    // Estado para los ángulos de corriente del diagrama fasorial
    const getDefaultCurrents = (type) => {
      if (type === "bifasico") {
        return [
          { angle: 0, type: "inductiva", magnitud: 100 },   // I1
          { angle: 0, type: "inductiva", magnitud: 100 },  // I2
        ];
      }

      return [
        { angle: 0, type: "inductiva", magnitud: 100 },     // I1
        { angle: 0, type: "inductiva", magnitud: 100 },  // I2
        { angle: 0, type: "inductiva", magnitud: 100 },   // I3
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
    rtp: '', errorVR: '', errorVS: '', errorVT: '', errorPromedio: ''
  });

  const [tcData, setTcData] = useState(data.tcData || {
    vRPrimario: '', vSPrimario: '', vTPrimario: '',
    vRSecundario: '', vSSecundario: '', vTSecundario: '',
    rtc: '', errorVR: '', errorVS: '', errorVT: '', errorPromedio: ''
  });

  const [factorData, setFactorData] = useState(data.factorData || {
    factorSiec: '', factorEncontrado: '', errorFactor: '', factorFinal: '' ,equipoPatron: ''
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

  // Opciones para selects
  const opcionesFrontera = ['MCM', 'RGP', 'NRP', 'NRO', 'REGO', 'SNT', 'CAMB COM'];
  const opcionesEstado = ['Bueno', 'Regular', 'Malo'];

  // Estados para el editor de diagramas
  const [showEditor, setShowEditor] = useState(false);
  const [currentEditingDiagram, setCurrentEditingDiagram] = useState(null);
  const [currentDiagramType, setCurrentDiagramType] = useState(null);
  const [savedDiagrams, setSavedDiagrams] = useState({
    unifilar: data.savedUnifilar || null,
    conexiones: data.savedConexiones || null
  });
  // Datos de diagramas
  const diagramOptions = {
    unifilar: [
      { id: 'unifilar1', name: 'Diagrama Unifilar 1', image: unifilar1 },
      { id: 'unifilar2', name: 'Diagrama Unifilar 2', image: unifilar2 },
      { id: 'unifilar3', name: 'Diagrama Unifilar 3', image: unifilar3 }
    ],
    conexiones: [
      { id: 'conexiones1', name: 'Diagrama Conexiones 1', image: conexiones1 },
      { id: 'conexiones2', name: 'Diagrama Conexiones 2', image: conexiones2 },
      { id: 'conexiones3', name: 'Diagrama Conexiones 3', image: conexiones3 }
    ]
  };

  // Handlers para el diagrama fasorial
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

  // Función para exportar el diagrama fasorial a PNG y guardarlo
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

  // Función para dibujar el diagrama fasorial
  const PhasorDiagram = ({ currents, svgRef }) => {
    const size = 400;
    const center = size / 2;
    const voltageScale = 120;
    const maxCurrentScale = 100; // Escala máxima para corriente (cuando magnitud es 100%)
    const minCurrentScale = 15;  // Escala mínima para corriente (cuando magnitud es 0)

    // Voltajes fijos de referencia
    const voltages =
      systemType === "bifasico"
        ? [
            { name: "V1", angle: 90 },
            { name: "V2", angle: -90 },
          ]
        : [
            { name: "V1", angle: 90 },
            { name: "V2", angle: -30 },
            { name: "V3", angle: 210 },
          ];

    // Función para calcular la escala de la corriente basada en la magnitud
    const getCurrentScale = (magnitud) => {
      if (!magnitud || magnitud === 0) return minCurrentScale;
      // Normalizar: si magnitud es 100% -> maxCurrentScale, si es 0% -> minCurrentScale
      // Asumiendo que magnitud viene como porcentaje (0-100)
      const normalizedMagnitud = Math.min(100, Math.max(0, magnitud));
      return minCurrentScale + (normalizedMagnitud / 100) * (maxCurrentScale - minCurrentScale);
    };

    return (
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Flecha para las líneas */}
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill="black" />
          </marker>
        </defs>

        {/* Ejes de referencia */}
        <line x1={center} y1="0" x2={center} y2={size} stroke="#ddd" strokeWidth="1" strokeDasharray="4" />
        <line x1="0" y1={center} x2={size} y2={center} stroke="#ddd" strokeWidth="1" strokeDasharray="4" />

        {/* Círculo de referencia para escala */}
        <circle 
          cx={center} 
          cy={center} 
          r={maxCurrentScale} 
          fill="none" 
          stroke="#eee" 
          strokeWidth="1" 
          strokeDasharray="4" 
        />
        <circle 
          cx={center} 
          cy={center} 
          r={minCurrentScale} 
          fill="none" 
          stroke="#eee" 
          strokeWidth="1" 
          strokeDasharray="4" 
        />

        {/* Voltajes */}
        {voltages.map((v, i) => {
          const rad = toRadians(v.angle);
          const x = center + voltageScale * Math.cos(rad);
          const y = center - voltageScale * Math.sin(rad);
          
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
                markerEnd="url(#arrow)"
              />
              <text x={x + offsetX} y={y + offsetY} fontSize="14" fontWeight="bold">
                {v.name}
              </text>
            </g>
          );
        })}

        {/* Corrientes */}
        {currents.map((c, i) => {
          const baseAngle = voltages[i].angle;
          const finalAngle = c.type === "inductiva" 
            ? baseAngle - (c.angle || 0)
            : baseAngle + (c.angle || 0);

          const rad = toRadians(finalAngle);

          // Calcular escala basada en la magnitud
          const currentScale = getCurrentScale(c.magnitud || 0);

          const x = center + currentScale * Math.cos(rad);
          const y = center - currentScale * Math.sin(rad);

          // Calcular posición del texto (si la magnitud es muy pequeña, mostrar cerca del centro)
          const textX = (c.magnitud === 0 || !c.magnitud) ? center + 15 : x + 8;
          const textY = (c.magnitud === 0 || !c.magnitud) ? center - 15 : y - 8;

          return (
          <g key={i}>
            {/* Solo dibujar línea si hay magnitud > 0 */}
            {(c.magnitud > 0 && c.magnitud !== 0) && (
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="red"
                strokeWidth="2"
                markerEnd="url(#arrowCurrent)"
              />
            )}
            
            {/* Punto al final del vector (si magnitud > 0) */}
            {(c.magnitud > 0 && c.magnitud !== 0) && (
              <circle cx={x} cy={y} r={4} fill="red" />
            )}
            
            {/* Si magnitud es 0, mostrar un punto en el centro */}
            {(c.magnitud === 0 || !c.magnitud) && (
              <circle cx={center} cy={center} r={3} fill="red" opacity="0.5" />
            )}
            
            <text x={textX} y={textY} fontSize="12" fill="red">
              I{i + 1} ({c.angle || 0}°{c.magnitud !== undefined && c.magnitud !== 0 ? `, ${c.magnitud}%` : ''})
            </text>
          </g>
        );
      })}
    </svg>
  );
};

  // Función para guardar imagen en localStorage (igual que las firmas)
  const saveImageToLocalStorage = async (key, imageSrc) => {
    try {
      // Convertir la imagen a base64
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

   // Handlers
  const handleDiagramSelect = (diagramType, diagramId, imageSrc) => {
    setCurrentEditingDiagram(imageSrc);
    setCurrentDiagramType(diagramType);
    
    // Si hay datos guardados para este tipo de diagrama, pasarlos al editor
    // Pero como el editor se abre en el modal, necesitamos pasar los datos guardados
    setShowEditor(true);
    
    // Actualizar selección
    setSelectedDiagrams(prev => ({
      ...prev,
      [diagramType]: diagramId
    }));
  };
  // Función para guardar el diagrama editado
  const handleSaveDiagram = (diagramData) => {
    console.log('Guardando diagrama:', currentDiagramType, diagramData);
    console.log('Elementos con posiciones:', diagramData.elements);
    setSavedDiagrams(prev => ({
      ...prev,
      [currentDiagramType]: diagramData
    }));
  };
  const handleTpChange = (field, value) => {
    const updated = { ...tpData, [field]: value };
    setTpData(updated);
    
    // Calcular % error promedio si todos los campos están llenos
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
    console.log('Guardando diagrama fasorial...');
    const phasorImage = await capturePhasorDiagram();
    if (phasorImage) {
      localStorage.setItem('diagrama_fasorial', phasorImage);
      console.log('Diagrama fasorial guardado');
    }

    // Función para capturar diagrama completo con todos los elementos
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
        
        // Función para cargar imágenes
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
        
        // Cargar todas las imágenes necesarias ANTES de empezar a dibujar
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
          
          // Dibujar fondo blanco
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          
          // Dibujar imagen base
          ctx.drawImage(baseImg, baseImageX, baseImageY, baseImageWidth, baseImageHeight);
          
          const imageMap = { medidor: medidorImage, tp: tpImage };
          
          // Dibujar elementos (overlays) con sus posiciones guardadas
          if (diagramData.elements && diagramData.elements.length > 0) {
            diagramData.elements.forEach(el => {
              const elementImage = imageMap[el.type];
              if (elementImage && el.x !== undefined && el.y !== undefined) {
                console.log(`Dibujando ${el.type} en posición: x=${el.x}, y=${el.y}`);
                ctx.drawImage(elementImage, el.x, el.y, el.width || 60, el.height || 60);
              }
            });
          }
          
          // Dibujar textos con sus posiciones guardadas
          if (diagramData.texts && diagramData.texts.length > 0) {
            diagramData.texts.forEach(text => {
              if (text.x !== undefined && text.y !== undefined && text.text) {
                console.log(`Dibujando texto "${text.text}" en posición: x=${text.x}, y=${text.y}`);
                ctx.font = `${text.fontSize || 20}px Arial`;
                ctx.fillStyle = text.fill || '#333';
                ctx.fillText(text.text, text.x, text.y);
              }
            });
          }
          
          // Dibujar líneas
          if (diagramData.lines && diagramData.lines.length > 0) {
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

    // Guardar diagrama unifilar editado
    console.log('Procesando diagrama unifilar...', savedDiagrams.unifilar, selectedDiagrams.unifilar);
    if (savedDiagrams.unifilar && selectedDiagrams.unifilar) {
      const baseImage = diagramOptions.unifilar.find(d => d.id === selectedDiagrams.unifilar)?.image;
      if (baseImage) {
        console.log('Elementos a guardar en unifilar:', savedDiagrams.unifilar.elements);
        console.log('Textos a guardar en unifilar:', savedDiagrams.unifilar.texts);
        const editedImage = await captureFullDiagram(savedDiagrams.unifilar, baseImage);
        if (editedImage) {
          localStorage.setItem('diagrama_unifilar_editado', editedImage);
          console.log('Diagrama unifilar editado guardado');
        } else {
          console.log('Error al capturar diagrama unifilar');
          await saveImageToLocalStorage('diagrama_unifilar_editado', baseImage);
        }
      }
    } else if (selectedDiagrams.unifilar) {
      const baseImage = diagramOptions.unifilar.find(d => d.id === selectedDiagrams.unifilar)?.image;
      if (baseImage) {
        console.log('Guardando diagrama unifilar original');
        await saveImageToLocalStorage('diagrama_unifilar_editado', baseImage);
      }
    }
    
    // Guardar diagrama de conexiones editado
    console.log('Procesando diagrama de conexiones...', savedDiagrams.conexiones, selectedDiagrams.conexiones);
    if (savedDiagrams.conexiones && selectedDiagrams.conexiones) {
      const baseImage = diagramOptions.conexiones.find(d => d.id === selectedDiagrams.conexiones)?.image;
      if (baseImage) {
        console.log('Elementos a guardar en conexiones:', savedDiagrams.conexiones.elements);
        console.log('Textos a guardar en conexiones:', savedDiagrams.conexiones.texts);
        const editedImage = await captureFullDiagram(savedDiagrams.conexiones, baseImage);
        if (editedImage) {
          localStorage.setItem('diagrama_conexiones_editado', editedImage);
          console.log('Diagrama de conexiones editado guardado');
        } else {
          console.log('Error al capturar conexiones');
          await saveImageToLocalStorage('diagrama_conexiones_editado', baseImage);
        }
      }
    } else if (selectedDiagrams.conexiones) {
      const baseImage = diagramOptions.conexiones.find(d => d.id === selectedDiagrams.conexiones)?.image;
      if (baseImage) {
        console.log('Guardando diagrama de conexiones original');
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
    
    console.log('Datos actualizados, pasando al siguiente paso');
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
          {/* Mostrar resumen del diagrama guardado */}
          {savedDiagrams.unifilar && (
            <div className={styles.savedDiagramInfo}>
              <span>Diagrama editado guardado</span>
              <button onClick={() => {
                setCurrentEditingDiagram(diagramOptions.unifilar.find(d => d.id === selectedDiagrams.unifilar)?.image);
                setCurrentDiagramType('unifilar');
                setShowEditor(true);
              }}>Editar nuevamente</button>
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
          {/* Controles de ángulos, tipo y magnitud */}
          <div className={styles.fasorialControls}>
            {fasorialCurrents.map((c, i) => (
              <div key={i} className={styles.fasorialControlRow}>
                <strong>I{i + 1}</strong>
                
                <div className={styles.fasorialInputGroup}>
                  <label>Ángulo:</label>
                  <input
                    type="number"
                    value={c.angle}
                    onChange={(e) => handleFasorialCurrentChange(i, "angle", e.target.value)}
                    className={styles.angleInput}
                    step="0.1"
                  />
                  <span>°</span>
                </div>
                
                <div className={styles.fasorialInputGroup}>
                  <label>Tipo:</label>
                  <select
                    value={c.type}
                    onChange={(e) => handleFasorialCurrentChange(i, "type", e.target.value)}
                    className={styles.typeSelect}
                  >
                    <option value="inductiva">Inductiva (atraso)</option>
                    <option value="capacitiva">Capacitiva (adelanto)</option>
                  </select>
                </div>
                
                {/* Nuevo: Control de magnitud */}
                <div className={styles.fasorialInputGroup}>
                  <label>Magnitud:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={c.magnitud !== undefined ? c.magnitud : 100}
                    onChange={(e) => handleFasorialCurrentChange(i, "magnitud", parseInt(e.target.value))}
                    className={styles.rangeInput}
                    step="1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={c.magnitud !== undefined ? c.magnitud : 100}
                    onChange={(e) => handleFasorialCurrentChange(i, "magnitud", parseInt(e.target.value))}
                    className={styles.magnitudInput}
                    step="1"
                  />
                  <span>%</span>
                </div>
              </div>
            ))}
          </div>

            {/* Visualización del diagrama */}
            <div className={styles.phasorDiagramWrapper}>
              <PhasorDiagram 
                currents={fasorialCurrents} 
                svgRef={phasorSvgRef} 
              />
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
          {/* Mostrar resumen del diagrama guardado */}
          {savedDiagrams.conexiones && (
            <div className={styles.savedDiagramInfo}>
              <span>Diagrama editado guardado</span>
              <button onClick={() => {
                setCurrentEditingDiagram(diagramOptions.conexiones.find(d => d.id === selectedDiagrams.conexiones)?.image);
                setCurrentDiagramType('conexiones');
                setShowEditor(true);
              }}>Editar nuevamente</button>
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
      { key: 'redMT', label: 'Red MT ( ) BT ( )' },
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
            {id:'cambiaroInstalarBloquePruebas', label:'Cambiar o Instalar bloque de prueba'},
            {id:'cambiaroInstalarProteccionesElectricas', label:'Cambiar o Instalar protecciones electricas'},
            {id:'cambiaroInstalarCableSenal', label:'Cambiar o Instalar cable de señal (segun norma)'},
            {id:'adecuaroInstalaraSeguridadCeldas', label:'Adecuar o Instalar seguridad en las celdas de medida'},
            {id:'cambiaroInstalarCelda', label:'Cambiar o Instalar celda para medida(TP´S y TC´S) norma'},
            {id:'cambiaroInstalarSistemaComunicacion', label:'Cambiar o Instalar sistema de comunicación'},
            {id:'cambiaroInstalarModem', label:'Cambiar o Instalar MODEM'},
            {id:'cambiaroInstalarProteccionesCommunicacion', label:'Cambiar o Instalar protecciones en comunicaciones'},
            {id:'cambiaroInstalarDuctosCableSeñal', label:'Cambiar o Instalar ductos para cable de señal'},
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
  
      {/* Mostrar textarea solo si se selecciona "Otros" */}
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

      {/* Toaster para notificaciones */}
      <Toaster position="bottom-center" />

      {/* Botones de navegación */}
      <div className={styles.navigationButtons}>
        <button className={styles.btnBack} onClick={prevStep}>
          ← Anterior
        </button>
        <button className={styles.btnPrimary} onClick={handleContinue}>
          Continuar a Firmas →
        </button>
      </div>
    </div>
  );
};

export default DiagramSelectionStep;