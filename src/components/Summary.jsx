import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import styles from './Summary.module.css';
import logo from '../assets/images/logo-4@3x.png';
// Importar todas las imágenes
import unifilar1 from '../assets/images/unifilar/unifilar.png';
import unifilar2 from '../assets/images/unifilar/unifilar2.png';
import unifilar3 from '../assets/images/unifilar/unifilar3.png';
import fasorial1 from '../assets/images/fasorial/fasorial.png';
import fasorial2 from '../assets/images/fasorial/fasorial2.png';
import fasorial3 from '../assets/images/fasorial/fasorial3.png';
import conexiones1 from '../assets/images/conexiones/conexiones.png';
import conexiones2 from '../assets/images/conexiones/conexiones2.png';
import conexiones3 from '../assets/images/conexiones/conexiones3.png';
import { FiEye, FiDownload, FiPrinter, FiSend, FiX, FiArrowLeft,FiLoader  } from 'react-icons/fi';
import toast, { Toaster } from "react-hot-toast";
import medidorImg from '../assets/overlays/medidor.png';
import tpImg from '../assets/overlays/tp.png';

function Summary({ data, prevStep }) {
  const [showPreview, setShowPreview] = useState(false);
  const [pdfHtml, setPdfHtml] = useState('');
  const [base64Logo, setBase64Logo] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [tiposPorMarca, setTiposPorMarca] = useState({});
  const [loading, setLoading] = useState(false);
  const previewRef = useRef(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [message, setMessage] = useState(null);
  const [signatures, setSignatures] = useState({
  firmaFuncionario: localStorage.getItem('firmaFuncionario') || '',
  firmaSuscriptor: localStorage.getItem('firmaSuscriptor') || '',
  firmaSupervisor: localStorage.getItem('firmaSupervisor') || ''
});
const [diagramImages, setDiagramImages] = useState({
  diagramaUnifilar: localStorage.getItem('diagrama_unifilar_editado') || '',
  diagramaFasorial: localStorage.getItem('diagrama_fasorial') || '',
  diagramaConexiones: localStorage.getItem('diagrama_conexiones_editado') || ''
});

const [includeTxtFile, setIncludeTxtFile] = useState(true);
const [showEmailModal, setShowEmailModal] = useState(false);
const [emailTo, setEmailTo] = useState(data.correo || '');
const [emailSubject, setEmailSubject] = useState('');
const [emailMessage, setEmailMessage] = useState('');
const [sendingEmail, setSendingEmail] = useState(false);

// Función para capturar el diagrama editado como imagen (ACTUALIZADA)
const captureEditedDiagram = async (diagramData, baseImageSrc) => {
  if (!diagramData || (!diagramData.elements?.length && !diagramData.lines?.length && !diagramData.texts?.length)) {
    return null;
  }
  
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
      
      // Fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Imagen base
      ctx.drawImage(baseImg, baseImageX, baseImageY, baseImageWidth, baseImageHeight);
      
      const imageMap = { medidor: medidorImage, tp: tpImage };
      
      // Dibujar elementos (overlays) - CON ROTACIÓN Y PROPIEDADES COMPLETAS
      if (diagramData.elements && diagramData.elements.length > 0) {
        diagramData.elements.forEach(el => {
          const elementImage = imageMap[el.type];
          if (elementImage && el.x !== undefined && el.y !== undefined) {
            const x = el.x || baseImageX + 100;
            const y = el.y || baseImageY + 100;
            const width = el.width || 60;
            const height = el.height || 60;
            const rotation = el.rotation || 0;
            
            ctx.save();
            ctx.translate(x + width/2, y + height/2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(elementImage, -width/2, -height/2, width, height);
            ctx.restore();
          }
        });
      }
      
      // Dibujar textos - CON ROTACIÓN Y PROPIEDADES COMPLETAS
      if (diagramData.texts && diagramData.texts.length > 0) {
        diagramData.texts.forEach(text => {
          if (text.x !== undefined && text.y !== undefined && text.text) {
            const fontSize = text.fontSize || 20;
            const rotation = text.rotation || 0;
            const fill = text.fill || '#333';
            
            ctx.save();
            ctx.translate(text.x, text.y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = fill;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(text.text, 0, 0);
            ctx.restore();
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
      console.error('Error en Promise.all en captureEditedDiagram:', error);
      resolve(null);
    });
  });
};

// Cargar diagramas editados al montar el componente
useEffect(() => {
  const loadEditedDiagrams = async () => {
    // Cargar diagrama unifilar editado
    if (data.savedUnifilar && data.diagramaUnifilar) {
      const baseImage = getDiagramImage(data.diagramaUnifilar);
      if (baseImage) {
        const capturedImage = await captureEditedDiagram(data.savedUnifilar, baseImage);
        if (capturedImage) {
          setDiagramImages(prev => ({ ...prev, diagramaUnifilar: capturedImage }));
        } else {
          // Si falla, usar la imagen base
          setDiagramImages(prev => ({ ...prev, diagramaUnifilar: baseImage }));
        }
      }
    } else if (data.diagramaUnifilar) {
      // Si no hay edición, usar la imagen original
      const baseImage = getDiagramImage(data.diagramaUnifilar);
      if (baseImage) {
        setDiagramImages(prev => ({ ...prev, diagramaUnifilar: baseImage }));
      }
    }
    
    // Cargar diagrama de conexiones editado
    if (data.savedConexiones && data.diagramaConexiones) {
      const baseImage = getDiagramImage(data.diagramaConexiones);
      if (baseImage) {
        const capturedImage = await captureEditedDiagram(data.savedConexiones, baseImage);
        if (capturedImage) {
          setDiagramImages(prev => ({ ...prev, diagramaConexiones: capturedImage }));
        } else {
          setDiagramImages(prev => ({ ...prev, diagramaConexiones: baseImage }));
        }
      }
    } else if (data.diagramaConexiones) {
      const baseImage = getDiagramImage(data.diagramaConexiones);
      if (baseImage) {
        setDiagramImages(prev => ({ ...prev, diagramaConexiones: baseImage }));
      }
    }
  };
  
  loadEditedDiagrams();
}, [data.savedUnifilar, data.savedConexiones, data.diagramaUnifilar, data.diagramaConexiones]);

  // Datos del usuario desde localStorage
  const userData = {
    name: localStorage.getItem('userName') || '',
    cc: localStorage.getItem('userCC') || '',
    derecho: localStorage.getItem('derecho') || '',
    nombre: localStorage.getItem('nombre') || '',
    correo: localStorage.getItem('correo') || 'Ingrese un correo por favor'
  };

  // Función para capitalizar texto
  const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  

   // Convertir imagen a base64
  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  };

  // Cargar logo en base64 al montar el componente
  React.useEffect(() => {
    const loadLogo = async () => {
      try {
        // Si la imagen está en la carpeta assets, la convertimos a base64
        const base64 = await convertImageToBase64(logo);
        setBase64Logo(base64);
      } catch (error) {
        console.error("Error cargando el logo:", error);
        // En caso de error, usar un placeholder
        setBase64Logo('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIGZpbGw9IiM0YjU5N2EiLz48dGV4dCB4PSIxMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiPkVNU0EgRVNQPC90ZXh0Pjwvc3ZnPg==');
      }
    };
    
    loadLogo();
  }, []);

  const {
    diagramaUnifilar,
    diagramaFasorial,
    diagramaConexiones,
    lineaDedicada,
    tipoFrontera,
    tpData,
    tcData,
    factorData,
    observaciones,
    adecuaciones,
    informe,
    informeTexto
  } = data;

  // También agrega un useEffect para actualizar si vienen datos nuevos
  useEffect(() => {
    // Actualizar imágenes si hay datos nuevos en props
    const unifilarImage = localStorage.getItem('diagrama_unifilar_editado');
    const conexionesImage = localStorage.getItem('diagrama_conexiones_editado');
    const fasorialImage = localStorage.getItem('diagrama_fasorial');
    
    setDiagramImages({
      diagramaUnifilar: unifilarImage || diagramImages.diagramaUnifilar,
      diagramaFasorial: fasorialImage || diagramImages.diagramaFasorial,
      diagramaConexiones: conexionesImage || diagramImages.diagramaConexiones
    });
  }, [data.savedUnifilar, data.savedConexiones]);

  // Función para obtener el nombre del diagrama
  const getDiagramName = (diagramId) => {
    const diagramMap = {
      'unifilar1': 'Diagrama Unifilar 1',
      'unifilar2': 'Diagrama Unifilar 2',
      'unifilar3': 'Diagrama Unifilar 3',
      'fasorial1': 'Diagrama Fasorial 1',
      'fasorial2': 'Diagrama Fasorial 2',
      'fasorial3': 'Diagrama Fasorial 3',
      'conexiones1': 'Diagrama Conexiones 1',
      'conexiones2': 'Diagrama Conexiones 2',
      'conexiones3': 'Diagrama Conexiones 3',
    };
    return diagramMap[diagramId] || diagramId;
  };

  // Función para obtener la imagen del diagrama
  const getDiagramImage = (diagramId) => {
    const imageMap = {
      unifilar1, unifilar2, unifilar3,
      fasorial1, fasorial2, fasorial3,
      conexiones1, conexiones2, conexiones3
    };
    return imageMap[diagramId] || null;
  };

  // Función para mostrar adecuaciones seleccionadas
  const getAdecuacionesSeleccionadas = () => {
    return Object.entries(adecuaciones)
      .filter(([key, value]) => value && key !== 'otrosTexto')
      .map(([key]) => {
        const labels = {
          'cambiaroInstalarMedidor': 'Cambiar o Instalar medidor',
          'cambiaroInstalarCaja': 'Cambiar o Instalar caja para el medidor',
          'cambiaroInstalarPuestaTierra': 'Cambiar o Instalar sistema de puesta de tierra',
          'cambiaroInstalarBloquePruebas': 'Cambiar o Instalar bloque de prueba',
          'cambiaroInstalarProteccionesElectricas': 'Cambiar o Instalar protecciones electricas',
          'cambiaroInstalarCableSenal': 'Cambiar o Instalar cable de señal (según norma)',
          'adecuaroInstalaraSeguridadCeldas': 'Adecuar o Instalar seguridad en las celdas de medida',
          'cambiaroInstalarCelda': 'Cambiar o Instalar celda para medida (TP´S y TC´S) norma',
          'cambiaroInstalarSistemaComunicacion': 'Cambiar o Instalar sistema de comunicación',
          'cambiaroInstalarModem': 'Cambiar o Instalar MODEM',
          'cambiaroInstalarProteccionesCommunicacion': 'Cambiar o Instalar protecciones en comunicaciones',
          'cambiaroInstalarDuctosCableSeñal': 'Cambiar o Instalar ductos para cable de señal',
          'otros': 'Otros'
        };
        return labels[key] || key;
      });
  };

  useEffect(() => {
    fetch("http://localhost:5000/marcas")
      .then((res) => res.json())
      .then((response) => {
        const lista = response?.data ?? response;
        setMarcas(Array.isArray(lista) ? lista : []);
      })
      .catch(() => setMarcas([]));
  }, []);

  useEffect(() => {
    const marcasIds = [
      data.marcaActiva1,
      data.marcaActiva2,
      data.marcaReactiva1,
      data.marcaReactiva2,
      data.marcaActivaIns1,
      data.marcaActivaIns2,
      data.marcaReactivaIns1,
      data.marcaReactivaIns2,
      data.marcaActiva1Res,
      data.marcaActiva2Res,
      data.marcaReactiva1Res,
      data.marcaReactiva2Res,
      data.marcaActivaIns1Res,
      data.marcaActivaIns2Res,
      data.marcaReactivaIns1Res,
      data.marcaReactivaIns2Res
    ].filter(Boolean);

    marcasIds.forEach((marcaId) => {
      if (tiposPorMarca[marcaId]) return;

      fetch(`http://localhost:5000/tipos/${marcaId}`)
        .then((res) => res.json())
        .then((response) => {
          const lista = response?.data ?? response;
          setTiposPorMarca((prev) => ({
            ...prev,
            [marcaId]: Array.isArray(lista) ? lista : []
          }));
        })
        .catch(() => {
          setTiposPorMarca((prev) => ({
            ...prev,
            [marcaId]: []
          }));
        });
    });
  }, [
    data.marcaActiva1,
    data.marcaActiva2,
    data.marcaReactiva1,
    data.marcaReactiva2,
    data.marcaActivaIns1,
    data.marcaActivaIns2,
    data.marcaReactivaIns1,
    data.marcaReactivaIns2,
    data.marcaActiva1Res,
    data.marcaActiva2Res,
    data.marcaReactiva1Res,
    data.marcaReactiva2Res,
    data.marcaActivaIns1Res,
    data.marcaActivaIns2Res,
    data.marcaReactivaIns1Res,
    data.marcaReactivaIns2Res
  ]);
    const getMarcaNombre = (id) => {
      return marcas.find((m) => m.id === Number(id))?.nombre || '';
    };

    const getTipoNombre = (marcaId, tipoId) =>
    tiposPorMarca[marcaId]
      ?.find((t) => t.id === Number(tipoId))
      ?.nombre || '';

    const resumen = {
      //encontrado
      marcaActiva1: getMarcaNombre(data.marcaActiva1),
      tipoActiva1: getTipoNombre(data.marcaActiva1, data.tipoActiva1),
    

      marcaActiva2: getMarcaNombre(data.marcaActiva2),
      tipoActiva2: getTipoNombre(data.marcaActiva2, data.tipoActiva2),

      marcaReactiva1: getMarcaNombre(data.marcaReactiva1),
      tipoReactiva1: getTipoNombre(data.marcaReactiva1, data.tipoReactiva1),

      marcaReactiva2: getMarcaNombre(data.marcaReactiva2),
      tipoReactiva2: getTipoNombre(data.marcaReactiva2, data.tipoReactiva2),

      //Instalado
      marcaActivaIns1: getMarcaNombre(data.marcaActivaIns1),
      tipoActivaIns1: getTipoNombre(data.marcaActivaIns1, data.tipoActivaIns1),

      marcaActivaIns2: getMarcaNombre(data.marcaActivaIns2),
      tipoActivaIns2: getTipoNombre(data.marcaActivaIns2, data.tipoActivaIns2),

      marcaReactivaIns1: getMarcaNombre(data.marcaReactivaIns1),
      tipoReactivaIns1: getTipoNombre(data.marcaReactivaIns1, data.tipoReactivaIns1),

      marcaReactivaIns2: getMarcaNombre(data.marcaReactivaIns2),
      tipoReactivaIns2: getTipoNombre(data.marcaReactivaIns2, data.tipoReactivaIns2),

      marcaActiva1Res: getMarcaNombre(data.marcaActiva1Res),
      tipoActiva1Res: getTipoNombre(data.marcaActiva1Res, data.tipoActiva1Res),

      marcaActivaIns1Res: getMarcaNombre(data.marcaActivaIns1Res),
      tipoActivaIns1Res: getTipoNombre(data.marcaActivaIns1Res, data.tipoActivaIns1Res),
    };

    const TIPO_INFORME_MAP = {
      visita_sitio: 'Se realizó visita al sitio encontrando etc ...',
      instalacion_completada: 'Instalación completada',
      medicion_realizada: 'Medición realizada',
      pruebas_completadas: 'Pruebas completadas',
      documentacion_entregada: 'Documentación entregada',
      otro: 'Otro'
    };

    // Función para obtener el texto legible
    const getTipoInformeText = () => {
      // Si es "otro" y hay texto personalizado, mostrar ese
      if (data.tipoInforme === 'otro' && data.tipoInformeOtro) {
        return data.tipoInformeOtro;
      }
      
      // Para cualquier valor, buscar en el mapa
      return TIPO_INFORME_MAP[data.tipoInforme] || data.tipoInforme || 'No especificado';
    };


    const INFORME_MAP = {
      instalacion_correcta: 'Instalación Correcta',
      instalacion_incorrecta: 'Instalación Incorrecta',
      medidor_incorrecto: 'Medidor Incorrecto',
      frontera_incorrecta: 'Frontera Incorrecta',
      otros: 'otros'
    };

    const getInformeDisplayText = () => {
      if (informe === 'otros' && informeTexto) {
        return informeTexto;
    }
    return INFORME_MAP[informe] || informe || 'No especificado';
    };
  
  
    const handleFinalizar = async () => {
      setLoading(true);
      setMessage(null);

      const token = localStorage.getItem("token");
      
      // Preparar los datos para enviar
      const reviewData = {
        // Información principal
        numero_acta: data.numero_acta || generarNumeroActa(),
        ciudad: data.ciudad,
        resultado: data.resultado,
        codigo_suscriptor: data.codigo,
        codigo_asic: data.asic,
        solicitud_numero: data.solicitudNo,
        revision_numero: data.revisionNo,
        
        // Cliente
        nombre: data.nombre,
        direccion: data.direccion,
        
        // Representantes
        otroRepresentante: data.otroRepresentante,
        ccOtroRepresentante: data.ccOtroRepresentante,
        usuarioVisita: data.usuarioVisita,
        documentoVisitante: data.documentoVisitante,
        tipoUsuario: data.tipoUsuario,
        derecho: data.derecho,
        
        // Configuración
        dependencia: data.dependencia,
        contratista: data.contratista,
        
        // Irregularidades
        codigosIrregularidades: data.codigosIrregularidades,
        irregularidadCorrida: data.irregularidadCorrida,
        medidorRetirado: data.medidorRetirado,
        tipoEvidencia: data.tipoEvidencia,
        tipoInforme: data.tipoInforme,
        tipoInformeOtro: data.tipoInformeOtro,
        
        // User data
        userId: userData.id,
        representante_emsa: userData.name,
        cc_representante_emsa: userData.cc
      };

      // Usar toast.promise para manejar la promesa
      toast.promise(
        // La promesa que queremos manejar
        (async () => {
          console.log('token:', token);
          console.log('Enviando datos:', reviewData);
          
          const response = await fetch('http://localhost:5000/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData),
          });
          
          const result = await response.json();
          
          if (!response.ok || !result.success) {
            throw new Error(result.message || 'Error al guardar el acta');
          }
          
          return result; // Esto se pasará a .then() del toast
        })(),
        
        // Estados del toast
        {
          loading: 'Guardando acta...',
          success: (result) => {
            const keysToRemove = [
              'firmaFuncionario',
              'firmaSuscriptor', 
              'firmaSupervisor',
              'diagrama_unifilar_editado',
              'diagrama_fasorial',
              'diagrama_conexiones_editado',
              'savedUnifilar',
              'savedConexiones'
            ];
            
            keysToRemove.forEach(key => {
              localStorage.removeItem(key);
            });
            // Redirigir después de un tiempo
            setTimeout(() => {
              window.location.reload();
            }, 4000);
            
            return `¡Acta ${result.data.numero_acta} guardada exitosamente!`;
          },
          error: (err) => {
            // También puedes mantener el setMessage si lo necesitas para otros componentes
            setMessage({
              type: 'error',
              text: err.message
            });
            return `Error: ${err.message}`;
          },
        },
        
        // Opciones adicionales (opcional)
        {
          duration: 3000,
          position: 'bottom-center',
          style: {
            minWidth: '300px',
          },
          // Para que el toast de éxito dure más
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
        }
      ).finally(() => {
        setLoading(false);
      });
    };

    // Genera el PDF (3 hojas legal) renderizando cada .page por separado
    const buildPdf = async () => {
      const PAGE_W = 8.5;      // legal ancho (in)
      const CONTENT_W = 7.9;   // ancho de .page (in)
      const TOP = 0.3;         // margen superior (in)

      const iframe = document.createElement('iframe');
      iframe.style.cssText =
        'position:fixed;left:-10000px;top:0;width:900px;height:1400px;border:0;';
      document.body.appendChild(iframe);

      try {
        await new Promise((resolve) => {
          iframe.onload = resolve;
          iframe.srcdoc = generatePDFHtml();
        });

        const idoc = iframe.contentDocument;

        // Esperar imágenes y fuentes
        if (idoc.fonts?.ready) await idoc.fonts.ready;
        await Promise.all(
          Array.from(idoc.images).map((img) =>
            img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })
          )
        );
        // Dar tiempo a que corra el script "fit" del HTML
        await new Promise((r) => setTimeout(r, 200));

        const pdf = new jsPDF({ unit: 'in', format: 'legal', orientation: 'portrait', compress: true });
        const pages = idoc.querySelectorAll('.page');

        for (let i = 0; i < pages.length; i++) {
          const el = pages[i];
          el.style.border = 'none';   // quita el borde punteado de pantalla
          el.style.margin = '0';

          const canvas = await html2canvas(el, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
          });

          if (i > 0) pdf.addPage('legal', 'portrait');

          const imgH = CONTENT_W * (canvas.height / canvas.width);
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 0.95),
            'JPEG',
            (PAGE_W - CONTENT_W) / 2,
            TOP,
            CONTENT_W,
            imgH,
            undefined,
            'FAST'
          );
        }

        return pdf;
      } finally {
        document.body.removeChild(iframe);
      }
    };

    // Función para enviar el PDF por correo
  const handleSendEmail = async () => {
    if (!emailTo) {
      toast.error('Por favor ingrese un destinatario');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTo)) {
      toast.error('Por favor ingrese un correo electrónico válido');
      return;
    }

    setSendingEmail(true);
    
    try {
      const pdf = await buildPdf();
      const pdfBlob = pdf.output('blob');

      const formData = new FormData();
      formData.append('pdf', pdfBlob, `Acta_Revision_No_${data.numero_acta || '1001'}.pdf`);
      formData.append('to', emailTo);
      formData.append('actaNumber', data.numero_acta || '1001'); 
      formData.append('nombreCliente', data.nombre || 'No especificado');

      if (includeTxtFile === true) {
        console.log('✅ Adjuntando archivo TXT...');
        
        // Crear el objeto con todos los datos
        const dataToSave = {
          // Información principal
          numero_acta: data.numero_acta,
          ciudad: data.ciudad,
          resultado: data.resultado,
          codigo_suscriptor: data.codigo,
          codigo_asic: data.asic,
          solicitud_numero: data.solicitudNo,
          revision_numero: data.revisionNo,
          
          // Cliente
          nombre: data.nombre,
          direccion: data.direccion,
          
          // Representantes
          otroRepresentante: data.otroRepresentante,
          ccOtroRepresentante: data.ccOtroRepresentante,
          usuarioVisita: data.usuarioVisita,
          documentoVisitante: data.documentoVisitante,
          tipoUsuario: data.tipoUsuario,
          derecho: data.derecho,
          
          // Configuración
          dependencia: data.dependencia,
          contratista: data.contratista,
          
          // Datos generales
          cargaKw: data.cargaKw,
          ciclo: data.ciclo,
          factor1: data.factor1,
          factor2: data.factor2,
          factor3: data.factor3,
          telefono: data.telefono,
          macromedidor: data.macromedidor,
          nodoTrafo: data.nodoTrafo,
          comercializador: data.comercializador,
          longitud: data.longitud,
          latitud: data.latitud,
          uso: data.uso,
          ubicacion: data.ubicacion,
          familias: data.familias,
          nivelTension: data.nivelTension,
          bloquesPrueba: data.bloquesPrueba,
          tipoMedidor: data.tipoMedidor,
          tipoInstalacion: data.tipoInstalacion,
          ubicacionMedidor: data.ubicacionMedidor,
          proteccionGeneral: data.proteccionGeneral,
          acometidaTipo: data.acometidaTipo,
          fh: data.fh,
          acometidaLongitud: data.acometidaLongitud,
          acometidaCalibre: data.acometidaCalibre,
          modemUbicacion: data.modemUbicacion,
          marcaModem: data.marcaModem,
          marcaModemOtro: data.marcaModemOtro,
          serieModem: data.serieModem,
          ipModem: data.ipModem,
          configuracionMedida: data.configuracionMedida,
          tipoMedida: data.tipoMedida,
          marcaCable: data.marcaCable,
          marcaCeldaMedida: data.marcaCeldaMedida,
          
          // Datos de medidores
          numeroActiva1: data.numeroActiva1,
          capacidadActiva1: data.capacidadActiva1,
          tensionActiva1: data.tensionActiva1,
          claseActiva1: data.claseActiva1,
          kdActiva1: data.kdActiva1,
          khActiva1: data.khActiva1,
          lecturaActiva1: data.lecturaActiva1,
          edActiva1: data.edActiva1,
          fechaLabActiva1: data.fechaLabActiva1,
          
          // Observaciones y adecuaciones
          observaciones: data.observaciones,
          adecuaciones: data.adecuaciones,
          
          // Informe
          informe: data.informe,
          informeTexto: data.informeTexto,
          tipoInforme: data.tipoInforme,
          tipoInformeOtro: data.tipoInformeOtro,
          
          // Irregularidades
          codigosIrregularidades: data.codigosIrregularidades,
          irregularidadCorrida: data.irregularidadCorrida,
          medidorRetirado: data.medidorRetirado,
          tipoEvidencia: data.tipoEvidencia,
          
          // Datos de pruebas
          tpData: data.tpData,
          tcData: data.tcData,
          factorData: data.factorData,
          
          // Metadatos
          fechaCreacion: new Date().toLocaleString('es-ES'),
          usuarioCreacion: userData.name,
          correoEnviadoA: emailTo,
          fechaEnvio: new Date().toLocaleString('es-ES')
        };
        
        // Convertir a JSON con formato legible
        const jsonString = JSON.stringify(dataToSave, null, 2);
        
        // Crear el Blob del TXT
        const txtBlob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
        const txtFileName = `datos_acta_${data.numero_acta || 'sin_numero'}_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.txt`;
        
        formData.append('txt', txtBlob, txtFileName);
      } else {
        console.log('❌ TXT NO adjuntado - checkbox desmarcado');
      }
      
      const response = await fetch('http://localhost:5000/enviar', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast.success(`Acta N° ${result.actaNumber} enviada exitosamente a ${emailTo}`, {
            duration: 6000, // 6 segundos (por defecto son 3000ms = 3 segundos)
            position: 'top-center',
            style: {
              background: '#10b981',
              color: 'white',
              padding: '16px',
              borderRadius: '8px',
              zIndex: 99999,
            },
          }
        );

        setTimeout(() => {
          setShowEmailModal(false);
          setEmailTo('');
        }, 500);
      } else {
        throw new Error(result.error || 'Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error enviando correo:', error);
      
      if (error.message.includes('Failed to fetch')) {
        toast.error('No se pudo conectar con el servidor. Verifica que esté corriendo.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setSendingEmail(false);
    }
  };

    // Función para calcular el total de materiales
    const calcularTotalMateriales = () => {
      const precios = {
        // Medidores
      medidorElectroMecanico: 1000000,
      medidorElectronicoRegis: 1200000,
      medidorElectronicoDisplay: 1500000,
      medidorSemiElectro: 800000,
      medidorSemiElectronico: 900000,
      medidorSinPerfil: 1100000,
      medidorConPerfil: 1300000,
      medidorConPerfilModem: 1600000,
      // Protecciones y Herrajes
      cintaBandit: 15000,
      grapaHebilla: 8000,
      capacete: 25000,
      conectorCurvo: 12000,
      conduletas: 18000,
      conduletaTapa: 22000,
      tuboGalvanizado: 35000,
      anclajeAcometida: 28000,
      conectorBimetalicoCuna: 32000,
      estribo: 25000,
      conectorBimetalicoPerno: 30000,
      tensorAcometida: 45000,
      ojoAluminio: 15000,
      breakers: 55000,
      conectorVarilla: 12000,
      tensorCambio: 45000,
      alambreCobre: 8000,
      varillaPuestaTierra: 65000,
      terminalMT: 18000,
      curvaMT: 15000,
      flexiConduit: 22000,
      terminalFlexi: 12000,
      // Router y Varios
      routerGPRS: 250000,
      conversores: 180000,
      bloquePrueba: 95000,
      // Sellos
      rotoseal: 5000,
      estampilla: 3000,
      // Cables y Alambre
      cableConcentrico: 120000,
      cableControl: 85000,
      // Caja Hermetica
      cajaSobreponer: 75000,
      cajaIncrustar: 82000,
      cajaGabinete: 120000,
      // Material Retirado
      materialRetirado: 0
      };
      
      let total = 0;
      
      if (data.materiales?.medidorElectroMecanico?.cantidad > 0) {
        total += data.materiales.medidorElectroMecanico.cantidad * precios.medidorElectroMecanico;
      }
      if (data.materiales?.medidorElectronicoRegis?.cantidad > 0) {
        total += data.materiales.medidorElectronicoRegis.cantidad * precios.medidorElectronicoRegis;
      }
      if (data.materiales?.medidorElectronicoDisplay?.cantidad > 0) {
        total += data.materiales.medidorElectronicoDisplay.cantidad * precios.medidorElectronicoDisplay;
      }
      if (data.materiales?.cintaBandit?.cantidad > 0) {
        total += data.materiales.cintaBandit.cantidad * precios.cintaBandit;
      }
      if (data.materiales?.rotoseal?.cantidad > 0) {
        total += data.materiales.rotoseal.cantidad * precios.rotoseal;
      }
      
      return total;
    };

  // Generar HTML para el PDF
  const generatePDFHtml = () => {

    // Definir precios de materiales
const preciosMateriales = {
  medidorElectroMecanico: 1000000,
  medidorElectronicoRegis: 1200000,
  medidorElectronicoDisplay: 1500000,
  medidorSemiElectro: 800000,
  medidorSemiElectronico: 900000,
  medidorSinPerfil: 1100000,
  medidorConPerfil: 1300000,
  medidorConPerfilModem: 1600000,
  cintaBandit: 15000,
  grapaHebilla: 8000,
  capacete: 25000,
  conectorCurvo: 12000,
  conduletas: 18000,
  conduletaTapa: 22000,
  tuboGalvanizado: 35000,
  anclajeAcometida: 28000,
  conectorBimetalicoCuna: 32000,
  estribo: 25000,
  conectorBimetalicoPerno: 30000,
  tensorAcometida: 45000,
  ojoAluminio: 15000,
  breakers: 55000,
  conectorVarilla: 12000,
  tensorCambio: 45000,
  alambreCobre: 8000,
  varillaPuestaTierra: 65000,
  terminalMT: 18000,
  curvaMT: 15000,
  flexiConduit: 22000,
  terminalFlexi: 12000,
  routerGPRS: 250000,
  conversores: 180000,
  bloquePrueba: 95000,
  rotoseal: 5000,
  estampilla: 3000,
  cableConcentrico: 120000,
  cableControl: 85000,
  cajaSobreponer: 75000,
  cajaIncrustar: 82000,
  cajaGabinete: 120000
};
    
    return `
    <!DOCTYPE html>
      <html>
      <head>
      <meta charset="utf-8" />
      <style>
      @page { size: 8.5in 14in; margin: 0.3in; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { margin: 0; padding: 0; background: #fff; color: #1f2d3d; font-family: Arial, Helvetica, sans-serif; font-size: 7px; line-height: 1.2; }

      /* ===== Hoja: tamaño LEGAL (8.5 x 14 in) menos márgenes de @page ===== */
      .page { width: 7.9in; height: 13.25in; margin: 0 auto; overflow: hidden; position: relative; break-after: page; page-break-after: always; }
      .page:last-child { break-after: auto; page-break-after: auto; }
      .page-inner { height: 100%; display: flex; flex-direction: column; }
      .page-inner > * { flex: none; }
      .page-inner > .diagrams { flex: 1 1 auto; }
      .bottom { margin-top: auto; }
      @media screen { .page { border: 1px dashed #c9ced4; margin-bottom: 14px; } }

      /* ===== Tablas ===== */
      table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0 0 3px 0; }
      td, th { border: 1px solid #34495e; padding: 1.5px 2px; vertical-align: middle; overflow-wrap: anywhere; word-break: break-word; }
      th { background: #ecf0f1; font-weight: bold; text-align: center; font-size: 6.5px; }
      .c { text-align: center; }
      .st { background: #e9ecef; color: #2c3e50; font-weight: bold; text-align: center; font-size: 7.5px; padding: 2.5px; }
      .fl { background: #f8f9fa; font-weight: bold; font-size: 6px; vertical-align: top; }
      .lb { background: #ecf0f1; font-weight: bold; font-size: 6.5px; }
      .lb2 { background: #f8f9fa; font-weight: bold; text-align: center; font-size: 6.5px; }
      .v { margin: 1px 0 0 0; text-align: center; font-weight: bold; font-size: 7px; color: #000; }
      .fl .v { min-height: 8px; }
      .ds { font-size: 6.5px; }
      .acta-number { font-size: 12px; color: #e74c3c; font-weight: bold; text-align: center; }
      .intro { font-size: 7.5px; line-height: 1.35; text-align: justify; padding: 3px 5px; }
      .note { font-size: 7px; font-style: italic; background: #f8f9fa; padding: 3px 4px; }
      .j { text-align: justify; }
      .x { font-weight: bold; font-size: 9px; }
      .grp { background: #f2f2f2; font-weight: bold; text-align: center; font-size: 6px; }
      .est { font-weight: bold; }

      /* texto vertical (ENCONTRADO / INSTALADO / MED ACTIVA...) */
      .vh { background: #e6e6e6; padding: 0; text-align: center; position: relative; overflow: hidden; }
.vtxt { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); transform-origin: center center; white-space: nowrap; font-weight: bold; font-size: 6px; line-height: 1.1; text-align: center; }

      /* ===== Encabezado ===== */
      .hdr { border: 1px solid #ddd; border-radius: 6px 6px 0 0; background: #f8f9fa; padding: 4px; margin-bottom: 3px; }
      .hdr-t, .code { margin: 0; }
      .hdr-t td.nb { border: none; padding: 0; }
      .logo { height: 44px; max-width: 100%; object-fit: contain; }
      .code td { font-size: 7px; padding: 1.5px 3px; }
      .title { font-size: 13px; font-weight: bold; text-align: center; color: #2c3e50; text-transform: uppercase; letter-spacing: .5px; margin: 1px 0 4px 0; }

      /* ===== Tablas con celdas bajas ===== */
      .dense td { font-size: 6px; }
      .sellos td { height: 11px; font-size: 6.5px; }
      .mt td, .err td, .func td { font-size: 6.5px; }
      .mat td { font-size: 7.3px; height: 18px; }
      .ret { vertical-align: top; font-size: 7px; line-height: 1.4; padding: 4px; background: #fafafa; text-align: justify; }
      .inst td, .inst th { font-size: 7px; height: 16px; }
      .atend { border: 1px solid #34495e; font-size: 8px; line-height: 1.5; padding: 4px 5px; margin-bottom: 3px; }
      .obs-box { height: 70px; vertical-align: top; font-size: 7px; }

      /* ===== Hoja 2: diagramas ===== */
      .diagrams { min-height: 240px; display: flex; flex-direction: column; border: 1px solid #34495e; margin-bottom: 3px; }
      .d-top { flex: 1 1 50%; display: flex; min-height: 0; }
      .d-col { flex: 1 1 50%; display: flex; flex-direction: column; min-width: 0; min-height: 0; }
      .d-col + .d-col { border-left: 1px solid #34495e; }
      .d-bottom { flex: 1 1 50%; display: flex; flex-direction: column; min-height: 0; border-top: 1px solid #34495e; }
      .d-title { flex: none; background: #e9ecef; color: #2c3e50; font-weight: bold; text-align: center; font-size: 7.5px; padding: 2.5px; border-bottom: 1px solid #34495e; }
      .d-box { flex: 1 1 auto; position: relative; min-height: 0; background: #fafafa; }
      .d-box img { position: absolute; top: 4px; left: 4px; width: calc(100% - 8px); height: calc(100% - 8px); object-fit: contain; }

      /* adecuaciones */
      .adec { vertical-align: top; font-size: 6.5px; padding: 3px; }
      .adec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
      .cbl { list-style: none; margin: 0; padding: 0; }
      .cbl li { display: flex; align-items: flex-start; gap: 2px; margin-bottom: 3px; }
      .cbl input { margin: 0; width: 7px; height: 7px; flex: none; }
      .siec td { font-size: 6.5px; }

      /* ===== Textos legales ===== */
      .legal { border: 1px solid #dee2e6; background: #f8f9fa; border-radius: 3px; padding: 3px 5px; margin: 3px 0; font-size: 6.2px; line-height: 1.3; text-align: justify; color: #373a3d; }
      .legal p { margin: 0 0 2px 0; }
      .legal.c { text-align: center; font-weight: bold; }

      /* ===== Firmas ===== */
      .firma-table { margin-top: 3px; }
      .firma-header { background: #e9ecef; text-align: left; font-size: 6.5px; padding: 3px; }
      .firma-table td { padding: 2px 3px; }
      .firma-row { display: flex; align-items: center; gap: 3px; min-height: 12px; }
      .firma-text { font-weight: bold; white-space: nowrap; font-size: 6.5px; }
      .firma-value { flex: 1; min-width: 0; text-align: center; font-size: 7px; overflow-wrap: anywhere; }
      .sig-row td { height: 40px; }
      .firma-imagen { display: flex; align-items: center; justify-content: center; height: 36px; }
      .firma-imagen img { max-width: 100%; max-height: 36px; object-fit: contain; border: none; }
      .firma-faltante { font-style: italic; color: #6c757d; font-size: 7px; }
      </style>
      </head>
      <body>
      <!-- HOJA 1: ACTA DE REVISIÓN -->
      <div id="pdf-page-1" class="page"><div class="page-inner">
      <div class="hdr"><table class="hdr-t"><colgroup><col style="width:68%"><col style="width:32%"></colgroup><tr><td class="nb c"><img class="logo" src="${base64Logo}" alt="Logo"></td><td class="nb"><table class="code"><colgroup><col style="width:38%"><col style="width:62%"></colgroup><tr><td class="lb">Código:</td><td>FO-GD-CP-03</td></tr><tr><td class="lb">Fecha:</td><td>${new Date().toLocaleDateString('es-ES')}</td></tr><tr><td class="lb">Versión:</td><td>4</td></tr><tr><td class="lb">Página:</td><td>1 DE 1</td></tr></table></td></tr></table></div>
      <div class="title">ACTA DE REVISIÓN</div>
      <table><colgroup><col style="width:14%"><col style="width:12%"><col style="width:10%"><col style="width:10%"><col style="width:10%"><col style="width:11%"><col style="width:11%"><col style="width:10%"><col style="width:12%"></colgroup><tr><td class="st" colspan="6">ACTA DE REVISIÓN CLIENTES DESTACADOS</td><td class="st" colspan="3">CONTROL DE PÉRDIDAS</td></tr><tr><td class="lb">Acta De Revisión No.</td><td class="acta-number">N° <span id="numero">${data.numero_acta}</span></td><td class="lb">Ciudad</td><td class="c" colspan="2">${data.ciudad}</td><td class="lb" colspan="2">Resultado</td><td class="c" colspan="2">${data.resultado || ''}</td></tr><tr><td class="lb">Solicitud No.</td><td class="c">${data.solicitudNo || ''}</td><td class="lb">Código de cliente</td><td class="c">${data.codigo || ''}</td><td class="lb">ASIC</td><td class="c">${data.asic || ''}</td><td class="lb">Revisión No.</td><td class="c" colspan="2"><span id="revision">${data.revisionNo || ''}</span></td></tr><tr><td colspan="9" class="intro">A los <strong>${new Date().getDate()}</strong> días del mes de <strong>${new Date().toLocaleString('es-ES', { month: 'long' })}</strong> del <strong>${new Date().getFullYear()}</strong>, siendo las <strong>${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong> se hacen presentes en el inmueble de la dirección <strong>${data.direccion || '______'}</strong> los representantes de EMSA ESP <strong>${userData.name || '______'}</strong> con C.C: <strong>${userData.cc || '______'}</strong> y <strong>${data.otroRepresentante || '______'}</strong> con C.C: <strong>${data.ccOtroRepresentante || '______'}</strong> en presencia del señor(a) <strong>${data.usuarioVisita || '______'}</strong> con <strong>${data.documentoVisitante || '______'}</strong> calidad de <strong>${data.tipoUsuario ? capitalize(data.tipoUsuario) : '______'}</strong> con el fin de efectuar una revisión de los equipos de medida e instalaciones del inmueble con el código indicado. Habiéndose identificado los empleados y/o contratistas informan al usuario que de acuerdo al Contrato de Servicios Públicos con Condiciones Uniformes vigente su derecho a solicitar asesoría y/o participación de un técnico particular, o de cualquier persona para que sirva de testigo en el proceso de revisión. Sin embargo, si transcurre un plazo máximo de 15 minutos sin hacerse presente se hará la revisión sin su presencia. El cliente/usuario hace uso de su derecho: <strong>SÍ (${data.derecho === 'SI' ? 'X' : ' '})</strong> <strong>NO (${data.derecho === 'NO' ? 'X' : ' '})</strong>. Transcurrido ese tiempo, se procede a hacer la revisión.</td></tr><tr><td class="lb">DEPENDENCIA</td><td class="c">EMSA</td><td class="c"><strong>${data.dependencia || ''}</strong></td><td class="lb">CONTRATISTA</td><td class="c"><strong>${data.contratista || ''}</strong></td><td class="lb">ITEM DE PAGO</td><td class="c"><strong>${data.itemPago || ''}</strong></td><td class="c"><strong>${data.itemPago2 || ''}</strong></td><td class="c"><strong>${data.itemPago3 || ''}</strong></td></tr></table>
      <table><colgroup><col style="width:24%"><col style="width:14%"><col style="width:14%"><col style="width:18%"><col style="width:15%"><col style="width:15%"></colgroup><tr><td class="st" colspan="6">DATOS GENERALES DEL SUSCRIPTOR</td></tr><tr><td class="fl">NOMBRE<p class="v">${data.nombre || ''}</p></td><td class="fl">CARGA KW<p class="v">${data.cargaKw || ''}</p></td><td class="fl">CICLO<p class="v">${data.ciclo || ''}</p></td><td class="fl">FACTOR<p class="v">${data.factor1 || ''}</p></td><td class="fl">FACTOR<p class="v">${data.factor2 || ''}</p></td><td class="fl">FACTOR<p class="v">${data.factor3 || ''}</p></td></tr><tr><td class="fl">DIRECCIÓN <br> POBLACIÓN<p class="v">${data.direccion || ''}</p></td><td class="fl">NÚMERO MACROMEDIDOR<p class="v">${data.macromedidor || ''}</p></td><td class="fl">NODO TRAFO<p class="v">${data.nodoTrafo || ''}</p></td><td class="fl">COMERCIALIZADOR<p class="v">${data.comercializador || ''}</p></td><td class="fl">LONGITUD<p class="v">${data.longitud || ''}</p></td><td class="fl">LATITUD<p class="v">${data.latitud || ''}</p></td></tr></table>
      <table class="dense"><colgroup><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"><col style="width:7.7%"></colgroup><tr><td class="st" colspan="13">DATOS DEL SUSCRIPTOR Y EQUIPO DE MEDIDA ENCONTRADOS</td></tr><tr><td class="fl">TELÉFONO<p class="v">${data.telefono || ''}</p></td><td class="fl">USO<p class="v">${data.uso === 'R' ? 'RESIDENCIAL' : data.uso === 'C' ? 'COMERCIAL' : data.uso === 'I' ? 'INDUSTRIAL' : data.uso === 'O' ? 'OFICIAL' : ''}</p></td><td class="fl">UBICACIÓN<p class="v">${data.ubicacion || ''}</p></td><td class="fl">FAMILIAS<p class="v">${data.familias || ''}</p></td><td class="fl">NIVEL TENSIÓN<p class="v">${data.nivelTension || ''}</p></td><td class="fl">BLOQUES PRUEBA<p class="v">${data.bloquesPrueba || ''}</p></td><td class="fl">TIPO MEDIDOR<p class="v">${data.tipoMedidor || ''}</p></td><td class="fl">TIPO INSTALACIÓN<p class="v">${data.tipoInstalacion || ''}</p></td><td class="fl">UBICACIÓN MEDIDOR<p class="v">${data.ubicacionMedidor || ''}</p></td><td class="fl">TIPO ACOMETIDA<p class="v">${data.acometidaTipo || ''}</p></td><td class="fl">#F #H<p class="v">${data.fh || ''}</p></td><td class="fl">PROTECCIÓN GENERAL (A)<p class="v">${data.proteccionGeneral || ''}</p></td><td class="fl">LONGITUD (M)<p class="v">${data.acometidaLongitud ? data.acometidaLongitud + ' M' : ''}</p></td></tr><tr><td class="fl">CALIBRE ACOMETIDA<p class="v">${data.acometidaCalibre || ''}</p></td><td class="fl">UBICACIÓN MODEM<p class="v">${data.modemUbicacion || ''}</p></td><td class="fl">MARCA MODEM<p class="v">${data.marcaModem === 'Otro' ? data.marcaModemOtro : data.marcaModem || ''}</p></td><td class="fl">NÚMERO SERIE MODEM:<p class="v">${data.serieModem || ''}</p></td><td class="fl">IP<p class="v">${data.ipModem || ''}</p></td><td class="fl">MARCA MODEM RESPALDO<p class="v">${data.marcaModemRes === 'OtroRes' ? data.marcaModemOtroRes : data.marcaModemRes || ''}</p></td><td class="fl">NÚMERO SERIE MODEM RESPALDO:<p class="v">${data.serieModemRes || ''}</p></td><td class="fl">IP RESPALDO<p class="v">${data.ipModemRes || ''}</p></td><td class="fl">CONFIGURACIÓN MEDIDA<p class="v">${data.configuracionMedida || ''}</p></td><td class="fl">TIPO MEDIDA<p class="v">${data.tipoMedida || ''}</p></td><td class="fl" colspan="2">MARCA CABLE<p class="v">${data.marcaCable || ''}</p></td><td class="fl">MARCA CELDA MEDIDA<p class="v">${data.marcaCeldaMedida || ''}</p></td></tr></table>
      <table class="mt"><colgroup><col style="width:3%"><col style="width:7%"><col style="width:10%"><col style="width:9%"><col style="width:8%"><col style="width:8%"><col style="width:8%"><col style="width:6%"><col style="width:8%"><col style="width:8%"><col style="width:9%"><col style="width:6%"><col style="width:10%"></colgroup><tr><td class="st" colspan="13">DATOS MEDIDOR PRINCIPAL</td></tr><tr><th colspan="2">Medida</th><th>Número</th><th>Marca</th><th>Tipo</th><th>Capac. (A)</th><th>Tensión (V)</th><th>Clase</th><th>Kd (rev/kWh)</th><th>Kh (kWh/rev)</th><th>Lectura</th><th>E/D</th><th>Fecha Lab</th></tr><tr><td class="vh" rowspan="4"><div class="vtxt">ENCONTRADO</div></td><td class="lb2">Activa 1</td><td class="c">${data.numeroActiva1 || ''}</td><td class="c">${resumen.marcaActiva1}</td><td class="c">${resumen.tipoActiva1 || ''}</td><td class="c">${data.capacidadActiva1 || ''}</td><td class="c">${data.tensionActiva1 || ''}</td><td class="c">${data.claseActiva1 || ''}</td><td class="c">${data.kdActiva1 || ''}</td><td class="c">${data.khActiva1 || ''}</td><td class="c">${data.lecturaActiva1 || ''}</td><td class="c">${data.edActiva1 || ''}</td><td class="c">${data.fechaLabActiva1 || ''}</td></tr><tr><td class="lb2">Activa 2</td><td class="c">${data.numeroActiva1 || ''}</td><td class="c">${resumen.marcaActiva1}</td><td class="c">${resumen.tipoActiva1 || ''}</td><td class="c">${data.capacidadActiva2 || ''}</td><td class="c">${data.tensionActiva2 || ''}</td><td class="c">${data.claseActiva2 || ''}</td><td class="c">${data.kdActiva2 || ''}</td><td class="c">${data.khActiva2 || ''}</td><td class="c">${data.lecturaActiva2 || ''}</td><td class="c">${data.edActiva2 || ''}</td><td class="c">${data.fechaLabActiva1 || ''}</td></tr><tr><td class="lb2">Reactiva 1</td><td class="c">${data.numeroActiva1 || ''}</td><td class="c">${resumen.marcaActiva1}</td><td class="c">${resumen.tipoActiva1 || ''}</td><td class="c">${data.capacidadReactiva1 || ''}</td><td class="c">${data.tensionReactiva1 || ''}</td><td class="c">${data.claseReactiva1 || ''}</td><td class="c">${data.kdReactiva1 || ''}</td><td class="c">${data.khReactiva1 || ''}</td><td class="c">${data.lecturaReactiva1 || ''}</td><td class="c">${data.edReactiva1 || ''}</td><td class="c">${data.fechaLabActiva1 || ''}</td></tr><tr><td class="lb2">Reactiva 2</td><td class="c">${data.numeroActiva1 || ''}</td><td class="c">${resumen.marcaActiva1}</td><td class="c">${resumen.tipoActiva1 || ''}</td><td class="c">${data.capacidadReactiva2 || ''}</td><td class="c">${data.tensionReactiva2 || ''}</td><td class="c">${data.claseReactiva2 || ''}</td><td class="c">${data.kdReactiva2 || ''}</td><td class="c">${data.khReactiva2 || ''}</td><td class="c">${data.lecturaReactiva2 || ''}</td><td class="c">${data.edReactiva2 || ''}</td><td class="c">${data.fechaLabActiva1 || ''}</td></tr><tr><td class="vh" rowspan="4"><div class="vtxt">INSTALADO</div></td><td class="lb2">Activa 1</td><td class="c">${data.numeroActivaIns1 || ''}</td><td class="c">${resumen.marcaActivaIns1 || ''}</td><td class="c">${resumen.tipoActivaIns1 || ''}</td><td class="c">${data.capacidadActivaIns1 || ''}</td><td class="c">${data.tensionActivaIns1 || ''}</td><td class="c">${data.claseActivaIns1 || ''}</td><td class="c">${data.kdActivaIns1 || ''}</td><td class="c">${data.khActivaIns1 || ''}</td><td class="c">${data.lecturaActivaIns1 || ''}</td><td class="c">${data.edActivaIns1 || ''}</td><td class="c">${data.fechaLabActivaIns1 || ''}</td></tr><tr><td class="lb2">Activa 2</td><td class="c">${data.numeroActivaIns1 || ''}</td><td class="c">${resumen.marcaActivaIns1 || ''}</td><td class="c">${resumen.tipoActivaIns1 || ''}</td><td class="c">${data.capacidadActivaIns2 || ''}</td><td class="c">${data.tensionActivaIns2 || ''}</td><td class="c">${data.claseActivaIns2 || ''}</td><td class="c">${data.kdActivaIns2 || ''}</td><td class="c">${data.khActivaIns2 || ''}</td><td class="c">${data.lecturaActivaIns2 || ''}</td><td class="c">${data.edActivaIns2 || ''}</td><td class="c">${data.fechaLabActivaIns1 || ''}</td></tr><tr><td class="lb2">Reactiva 1</td><td class="c">${data.numeroActivaIns1 || ''}</td><td class="c">${resumen.marcaActivaIns1 || ''}</td><td class="c">${resumen.tipoActivaIns1 || ''}</td><td class="c">${data.capacidadReactivaIns1 || ''}</td><td class="c">${data.tensionReactivaIns1 || ''}</td><td class="c">${data.claseReactivaIns1 || ''}</td><td class="c">${data.kdReactivaIns1 || ''}</td><td class="c">${data.khReactivaIns1 || ''}</td><td class="c">${data.lecturaReactivaIns1 || ''}</td><td class="c">${data.edReactivaIns1 || ''}</td><td class="c">${data.fechaLabActivaIns1 || ''}</td></tr><tr><td class="lb2">Reactiva 2</td><td class="c">${data.numeroActivaIns1 || ''}</td><td class="c">${resumen.marcaActivaIns1 || ''}</td><td class="c">${resumen.tipoActivaIns1 || ''}</td><td class="c">${data.capacidadReactivaIns2 || ''}</td><td class="c">${data.tensionReactivaIns2 || ''}</td><td class="c">${data.claseReactivaIns2 || ''}</td><td class="c">${data.kdReactivaIns2 || ''}</td><td class="c">${data.khReactivaIns2 || ''}</td><td class="c">${data.lecturaReactivaIns2 || ''}</td><td class="c">${data.edReactivaIns2 || ''}</td><td class="c">${data.fechaLabActivaIns1 || ''}</td></tr></table>
      <table class="mt"><colgroup><col style="width:3%"><col style="width:7%"><col style="width:10%"><col style="width:9%"><col style="width:8%"><col style="width:8%"><col style="width:8%"><col style="width:6%"><col style="width:8%"><col style="width:8%"><col style="width:9%"><col style="width:6%"><col style="width:10%"></colgroup><tr><td class="st" colspan="13">DATOS MEDIDOR RESPALDO</td></tr><tr><th colspan="2">Medida</th><th>Número</th><th>Marca</th><th>Tipo</th><th>Capac. (A)</th><th>Tensión (V)</th><th>Clase</th><th>Kd (rev/kWh)</th><th>Kh (kWh/rev)</th><th>Lectura</th><th>E/D</th><th>Fecha Lab</th></tr><tr><td class="vh" rowspan="4"><div class="vtxt">ENCONTRADO</div></td><td class="lb2">Activa 1</td><td class="c">${data.numeroActiva1Res || ''}</td><td class="c">${resumen.marcaActiva1Res}</td><td class="c">${resumen.tipoActiva1Res || ''}</td><td class="c">${data.capacidadActiva1Res || ''}</td><td class="c">${data.tensionActiva1Res || ''}</td><td class="c">${data.claseActiva1Res || ''}</td><td class="c">${data.kdActiva1Res || ''}</td><td class="c">${data.khActiva1Res || ''}</td><td class="c">${data.lecturaActiva1Res || ''}</td><td class="c">${data.edActiva1Res || ''}</td><td class="c">${data.fechaLabActivaRes1 || ''}</td></tr><tr><td class="lb2">Activa 2</td><td class="c">${data.numeroActiva1Res || ''}</td><td class="c">${resumen.marcaActiva1Res}</td><td class="c">${resumen.tipoActiva1Res || ''}</td><td class="c">${data.capacidadActiva2Res || ''}</td><td class="c">${data.tensionActiva2Res || ''}</td><td class="c">${data.claseActiva2Res || ''}</td><td class="c">${data.kdActiva2Res || ''}</td><td class="c">${data.khActiva2Res || ''}</td><td class="c">${data.lecturaActiva2Res || ''}</td><td class="c">${data.edActiva2Res || ''}</td><td class="c">${data.fechaLabActivaRes1 || ''}</td></tr><tr><td class="lb2">Reactiva 1</td><td class="c">${data.numeroActiva1Res || ''}</td><td class="c">${resumen.marcaActiva1Res}</td><td class="c">${resumen.tipoActiva1Res || ''}</td><td class="c">${data.capacidadReactiva1Res || ''}</td><td class="c">${data.tensionReactiva1Res || ''}</td><td class="c">${data.claseReactiva1Res || ''}</td><td class="c">${data.kdReactiva1Res || ''}</td><td class="c">${data.khReactiva1Res || ''}</td><td class="c">${data.lecturaReactiva1Res || ''}</td><td class="c">${data.edReactiva1Res || ''}</td><td class="c">${data.fechaLabActivaRes1 || ''}</td></tr><tr><td class="lb2">Reactiva 2</td><td class="c">${data.numeroActiva1Res || ''}</td><td class="c">${resumen.marcaActiva1Res}</td><td class="c">${resumen.tipoActiva1Res || ''}</td><td class="c">${data.capacidadReactiva2Res || ''}</td><td class="c">${data.tensionReactiva2Res || ''}</td><td class="c">${data.claseReactiva2Res || ''}</td><td class="c">${data.kdReactiva2Res || ''}</td><td class="c">${data.khReactiva2Res || ''}</td><td class="c">${data.lecturaReactiva2Res || ''}</td><td class="c">${data.edReactiva2Res || ''}</td><td class="c">${data.fechaLabActivaRes1 || ''}</td></tr><tr><td class="vh" rowspan="4"><div class="vtxt">INSTALADO</div></td><td class="lb2">Activa 1</td><td class="c">${data.numeroActivaIns1Res || ''}</td><td class="c">${resumen.marcaActivaIns1Res || ''}</td><td class="c">${resumen.tipoActivaIns1Res || ''}</td><td class="c">${data.capacidadActivaIns1Res || ''}</td><td class="c">${data.tensionActivaIns1Res || ''}</td><td class="c">${data.claseActivaIns1Res || ''}</td><td class="c">${data.kdActivaIns1Res || ''}</td><td class="c">${data.khActivaIns1Res || ''}</td><td class="c">${data.lecturaActivaIns1Res || ''}</td><td class="c">${data.edActivaIns1Res || ''}</td><td class="c">${data.fechaLabActivaIns1Res || ''}</td></tr><tr><td class="lb2">Activa 2</td><td class="c">${data.numeroActivaIns1Res || ''}</td><td class="c">${resumen.marcaActivaIns1Res || ''}</td><td class="c">${resumen.tipoActivaIns1Res || ''}</td><td class="c">${data.capacidadActivaIns2Res || ''}</td><td class="c">${data.tensionActivaIns2Res || ''}</td><td class="c">${data.claseActivaIns2Res || ''}</td><td class="c">${data.kdActivaIns2Res || ''}</td><td class="c">${data.khActivaIns2Res || ''}</td><td class="c">${data.lecturaActivaIns2Res || ''}</td><td class="c">${data.edActivaIns2Res || ''}</td><td class="c">${data.fechaLabActivaIns1Res || ''}</td></tr><tr><td class="lb2">Reactiva 1</td><td class="c">${data.numeroActivaIns1Res || ''}</td><td class="c">${resumen.marcaActivaIns1Res || ''}</td><td class="c">${resumen.tipoActivaIns1Res || ''}</td><td class="c">${data.capacidadReactivaIns1Res || ''}</td><td class="c">${data.tensionReactivaIns1Res || ''}</td><td class="c">${data.claseReactivaIns1Res || ''}</td><td class="c">${data.kdReactivaIns1Res || ''}</td><td class="c">${data.khReactivaIns1Res || ''}</td><td class="c">${data.lecturaReactivaIns1Res || ''}</td><td class="c">${data.edReactivaIns1Res || ''}</td><td class="c">${data.fechaLabActivaIns1Res || ''}</td></tr><tr><td class="lb2">Reactiva 2</td><td class="c">${data.numeroActivaIns1Res || ''}</td><td class="c">${resumen.marcaActivaIns1Res || ''}</td><td class="c">${resumen.tipoActivaIns1Res || ''}</td><td class="c">${data.capacidadReactivaIns2Res || ''}</td><td class="c">${data.tensionReactivaIns2Res || ''}</td><td class="c">${data.claseReactivaIns2Res || ''}</td><td class="c">${data.kdReactivaIns2Res || ''}</td><td class="c">${data.khReactivaIns2Res || ''}</td><td class="c">${data.lecturaReactivaIns2Res || ''}</td><td class="c">${data.edReactivaIns2Res || ''}</td><td class="c">${data.fechaLabActivaIns1Res || ''}</td></tr></table>
      <table><colgroup><col style="width:20%"><col style="width:14%"><col style="width:10%"><col style="width:8%"><col style="width:12%"><col style="width:12%"><col style="width:12%"><col style="width:12%"></colgroup><tr><td class="st" colspan="8">TRANSFORMADOR DE POTENCIA</td></tr><tr><td class="fl">Transformador Asociado No.<p class="v">${data.transformadorPoNumero || ''}</p></td><td class="fl">Marca<p class="v">${data.transformadorPoMarca || ''}</p></td><td class="fl">KVA<p class="v">${data.transformadorPoKva || ''}</p></td><td class="fl">Año<p class="v">${data.transformadorPoAno || ''}</p></td><td class="fl">V1/V2<p class="v">${data.transformadorPoV1V2 || ''}</p></td><td class="fl">Circuito<p class="v">${data.transformadorPoCircuito || ''}</p></td><td class="fl" colspan="2">Propietario<p class="v">${data.transformadorPoPropietario || ''}</p></td></tr></table>
      <table class="sellos"><colgroup><col style="width:4%"><col style="width:9%"><col style="width:7%"><col style="width:9%"><col style="width:3%"><col style="width:3%"><col style="width:7%"><col style="width:9%"><col style="width:10%"><col style="width:8%"><col style="width:9%"><col style="width:3%"><col style="width:3%"><col style="width:7%"><col style="width:9%"></colgroup><tr><td class="st" colspan="15">RELACIÓN DE SELLOS</td></tr><tr><th colspan="6">ENCONTRADOS</th><th colspan="2">INSTALADOS</th><th colspan="5">ENCONTRADOS</th><th colspan="2">INSTALADOS</th></tr><tr><th colspan="2">UBICACIÓN</th><th>TIPO/COL</th><th>NÚMERO</th><th>E</th><th>R</th><th>TIPO/COLOR</th><th>NÚMERO</th><th>UBICACIÓN</th><th>TIPO/COL</th><th>NÚMERO</th><th>E</th><th>R</th><th>TIPO/COLOR</th><th>NÚMERO</th></tr><tr><td class="vh" rowspan="5"><div class="vtxt">MED<br>ACTIVA</div></td><td class="grp" rowspan="3">TAPA<br>PRINCIPAL</td><td class="c">${data.medActivaTipoCol1 || ''}</td><td class="c">${data.medActivaNum1 || ''}</td><td class="c">${data.medActivaE1 || ''}</td><td class="c">${data.medActivaR1 || ''}</td><td class="c">${data.medActivaInstTipoColor1 || ''}</td><td class="c">${data.medActivaInstNum1 || ''}</td><td class="grp" rowspan="3">TC'S</td><td class="c">${data.tcsTipoCol1 || ''}</td><td class="c">${data.tcsNumero1 || ''}</td><td class="c">${data.tcsE1 || ''}</td><td class="c">${data.tcsR1 || ''}</td><td class="c">${data.tcsInstTipoColor1 || ''}</td><td class="c">${data.tcsInstNumero1 || ''}</td></tr><tr><td class="c">${data.medActivaTipoCol2 || ''}</td><td class="c">${data.medActivaNum2 || ''}</td><td class="c">${data.medActivaE2 || ''}</td><td class="c">${data.medActivaR2 || ''}</td><td class="c">${data.medActivaInstTipoColor2 || ''}</td><td class="c">${data.medActivaInstNum2 || ''}</td><td class="c">${data.tcsTipoCol2 || ''}</td><td class="c">${data.tcsNumero2 || ''}</td><td class="c">${data.tcsE2 || ''}</td><td class="c">${data.tcsR2 || ''}</td><td class="c">${data.tcsInstTipoColor2 || ''}</td><td class="c">${data.tcsInstNumero2 || ''}</td></tr><tr><td class="c">${data.medActivaTipoCol3 || ''}</td><td class="c">${data.medActivaNum3 || ''}</td><td class="c">${data.medActivaE3 || ''}</td><td class="c">${data.medActivaR3 || ''}</td><td class="c">${data.medActivaInstTipoColor3 || ''}</td><td class="c">${data.medActivaInstNum3 || ''}</td><td class="c">${data.tcsTipoCol3 || ''}</td><td class="c">${data.tcsNumero3 || ''}</td><td class="c">${data.tcsE3 || ''}</td><td class="c">${data.tcsR3 || ''}</td><td class="c">${data.tcsInstTipoColor3 || ''}</td><td class="c">${data.tcsInstNumero3 || ''}</td></tr><tr><td class="grp" rowspan="2">TAPA<br>BORNERA</td><td class="c">${data.tapaBorneraActivaTipoCol1 || ''}</td><td class="c">${data.tapaBorneraActivaNum1 || ''}</td><td class="c">${data.tapaBorneraActivaE1 || ''}</td><td class="c">${data.tapaBorneraActivaR1 || ''}</td><td class="c">${data.tapaBorneraActivaInstTipoColor1 || ''}</td><td class="c">${data.tapaBorneraActivaInstNum1 || ''}</td><td class="grp" rowspan="2">TP'S</td><td class="c">${data.tpsTipoCol1 || ''}</td><td class="c">${data.tpsNumero1 || ''}</td><td class="c">${data.tpsE1 || ''}</td><td class="c">${data.tpsR1 || ''}</td><td class="c">${data.tpsInstTipoColor1 || ''}</td><td class="c">${data.tpsInstNumero1 || ''}</td></tr><tr><td class="c">${data.tapaBorneraActivaTipoCol2 || ''}</td><td class="c">${data.tapaBorneraActivaNum2 || ''}</td><td class="c">${data.tapaBorneraActivaE2 || ''}</td><td class="c">${data.tapaBorneraActivaR2 || ''}</td><td class="c">${data.tapaBorneraActivaInstTipoColor2 || ''}</td><td class="c">${data.tapaBorneraActivaInstNum2 || ''}</td><td class="c">${data.tpsTipoCol2 || ''}</td><td class="c">${data.tpsNumero2 || ''}</td><td class="c">${data.tpsE2 || ''}</td><td class="c">${data.tpsR2 || ''}</td><td class="c">${data.tpsInstTipoColor2 || ''}</td><td class="c">${data.tpsInstNumero2 || ''}</td></tr><tr><td class="vh" rowspan="5"><div class="vtxt">MED<br>REACTIVA</div></td><td class="grp" rowspan="3">TAPA<br>PRINCIPAL</td><td class="c">${data.medReactivaTipoCol1 || ''}</td><td class="c">${data.medReactivaNum1 || ''}</td><td class="c">${data.medReactivaE1 || ''}</td><td class="c">${data.medReactivaR1 || ''}</td><td class="c">${data.medReactivaInstTipoColor1 || ''}</td><td class="c">${data.medReactivaInstNum1 || ''}</td><td class="grp" rowspan="3">CELDA DE<br>MEDIDA</td><td class="c">${data.celdaTipoCol1 || ''}</td><td class="c">${data.celdaNumero1 || ''}</td><td class="c">${data.celdaE1 || ''}</td><td class="c">${data.celdaR1 || ''}</td><td class="c">${data.celdaInstTipoColor1 || ''}</td><td class="c">${data.celdaInstNumero1 || ''}</td></tr><tr><td class="c">${data.medReactivaTipoCol2 || ''}</td><td class="c">${data.medReactivaNum2 || ''}</td><td class="c">${data.medReactivaE2 || ''}</td><td class="c">${data.medReactivaR2 || ''}</td><td class="c">${data.medReactivaInstTipoColor2 || ''}</td><td class="c">${data.medReactivaInstNum2 || ''}</td><td class="c">${data.celdaTipoCol2 || ''}</td><td class="c">${data.celdaNumero2 || ''}</td><td class="c">${data.celdaE2 || ''}</td><td class="c">${data.celdaR2 || ''}</td><td class="c">${data.celdaInstTipoColor2 || ''}</td><td class="c">${data.celdaInstNumero2 || ''}</td></tr><tr><td class="c">${data.medReactivaTipoCol3 || ''}</td><td class="c">${data.medReactivaNum3 || ''}</td><td class="c">${data.medReactivaE3 || ''}</td><td class="c">${data.medReactivaR3 || ''}</td><td class="c">${data.medReactivaInstTipoColor3 || ''}</td><td class="c">${data.medReactivaInstNum3 || ''}</td><td class="c">${data.celdaTipoCol3 || ''}</td><td class="c">${data.celdaNumero3 || ''}</td><td class="c">${data.celdaE3 || ''}</td><td class="c">${data.celdaR3 || ''}</td><td class="c">${data.celdaInstTipoColor3 || ''}</td><td class="c">${data.celdaInstNumero3 || ''}</td></tr><tr><td class="grp" rowspan="2">TAPA<br>BORNERA</td><td class="c">${data.tapaBorneraReactivaTipoCol1 || ''}</td><td class="c">${data.tapaBorneraReactivaNum1 || ''}</td><td class="c">${data.tapaBorneraReactivaE1 || ''}</td><td class="c">${data.tapaBorneraReactivaR1 || ''}</td><td class="c">${data.tapaBorneraReactivaInstTipoColor1 || ''}</td><td class="c">${data.tapaBorneraReactivaInstNum1 || ''}</td><td class="grp" rowspan="2">BLOQUES DE<br>PRUEBA</td><td class="c">${data.bloquePruebasTipoCol1 || ''}</td><td class="c">${data.bloquePruebasNum1 || ''}</td><td class="c">${data.bloquePruebasE1 || ''}</td><td class="c">${data.bloquePruebasR1 || ''}</td><td class="c">${data.bloquePruebasInstTipoColor1 || ''}</td><td class="c">${data.bloquePruebasInstNum1 || ''}</td></tr><tr><td class="c">${data.tapaBorneraReactivaTipoCol2 || ''}</td><td class="c">${data.tapaBorneraReactivaNum2 || ''}</td><td class="c">${data.tapaBorneraReactivaE2 || ''}</td><td class="c">${data.tapaBorneraReactivaR2 || ''}</td><td class="c">${data.tapaBorneraReactivaInstTipoColor2 || ''}</td><td class="c">${data.tapaBorneraReactivaInstNum2 || ''}</td><td class="c">${data.bloquePruebasTipoCol2 || ''}</td><td class="c">${data.bloquePruebasNum2 || ''}</td><td class="c">${data.bloquePruebasE2 || ''}</td><td class="c">${data.bloquePruebasR2 || ''}</td><td class="c">${data.bloquePruebasInstTipoColor2 || ''}</td><td class="c">${data.bloquePruebasInstNum2 || ''}</td></tr></table>
      <table class="err"><colgroup><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"></colgroup><tr><td class="st" colspan="10">PRUEBAS REALIZADAS MEDIDOR ACTIVA</td><td class="st" colspan="10">PRUEBAS REALIZADAS MEDIDOR REACTIVA</td></tr><tr><td class="st" colspan="20">Cuadro de Cálculo del Error</td></tr><tr><th colspan="2">Fase</th><th colspan="2">Tensión (V)</th><th colspan="2">CORRIENTE (A)</th><th colspan="2">P.Inst (W)</th><th rowspan="2" colspan="2">Secuencia de Fases</th><th colspan="2">Fase</th><th colspan="2">Tensión (V)</th><th colspan="2">CORRIENTE (A)</th><th colspan="2">P.Inst (W)</th><th rowspan="2" colspan="2">Secuencia de Fases</th></tr><tr><td class="lb2" colspan="2">R</td><td class="c" colspan="2"><strong>${data.activaTensionR || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteR || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstR || ''}</strong></td><td class="lb2" colspan="2">R</td><td class="c" colspan="2"><strong>${data.activaTensionR || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteR || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstR || ''}</strong></td></tr><tr><td class="lb2" colspan="2">S</td><td class="c" colspan="2"><strong>${data.activaTensionS || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteS || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstS || ''}</strong></td><td class="lb2">RST</td><td class="c"><strong>${data.activaRst || ''}</strong></td><td class="lb2" colspan="2">S</td><td class="c" colspan="2"><strong>${data.activaTensionS || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteS || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstS || ''}</strong></td><td class="lb2">RST</td><td class="c"><strong>${data.activaRst || ''}</strong></td></tr><tr><td class="lb2" colspan="2">T</td><td class="c" colspan="2"><strong>${data.activaTensionT || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteT || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstT || ''}</strong></td><td class="lb2">RTS</td><td class="c"><strong>${data.activaRts || ''}</strong></td><td class="lb2" colspan="2">T</td><td class="c" colspan="2"><strong>${data.activaTensionT || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteT || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstT || ''}</strong></td><td class="lb2">RTS</td><td class="c"><strong>${data.activaRts || ''}</strong></td></tr><tr><td class="lb2" colspan="2">TOTAL (L-L)</td><td class="c" colspan="2"><strong>${data.activaTensionTotal || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteTotal || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstTotal || ''}</strong></td><td class="lb2">F.P.</td><td class="c"><strong>${data.activaFp || ''}</strong></td><td class="lb2" colspan="2">TOTAL (L-L)</td><td class="c" colspan="2"><strong>${data.activaTensionTotal || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaCorrienteTotal || ''}</strong></td><td class="c" colspan="2"><strong>${data.activaPinstTotal || ''}</strong></td><td class="lb2">F.P.</td><td class="c"><strong>${data.activaFp || ''}</strong></td></tr><tr><td class="lb2">% Error</td><td class="c"><strong>${data.activaPorcentajeError || ''}</strong></td><td class="lb2">Giros</td><td class="c"><strong>${data.activaGiros || ''}</strong></td><td class="lb2">Tiempo (S)</td><td class="c"><strong>${data.activaTiempo || ''}</strong></td><td class="lb2">Horas</td><td class="c"><strong>${data.activaHoras || ''}</strong></td><td class="lb2">W</td><td class="c"><strong>${data.activaW || ''}</strong></td><td class="lb2">% Error</td><td class="c"><strong>${data.activaPorcentajeError || ''}</strong></td><td class="lb2">Giros</td><td class="c"><strong>${data.activaGiros || ''}</strong></td><td class="lb2">Tiempo (S)</td><td class="c"><strong>${data.activaTiempo || ''}</strong></td><td class="lb2">Horas</td><td class="c"><strong>${data.activaHoras || ''}</strong></td><td class="lb2">W</td><td class="c"><strong>${data.activaW || ''}</strong></td></tr></table>
      <table class="func"><colgroup><col style="width:12%"><col style="width:8%"><col style="width:11%"><col style="width:10%"><col style="width:9%"><col style="width:12%"><col style="width:8%"><col style="width:11%"><col style="width:10%"><col style="width:9%"></colgroup><tr><td class="st" colspan="5">PRUEBAS DE FUNCIONAMIENTO DEL MEDIDOR DE ACTIVA</td><td class="st" colspan="5">PRUEBAS DE FUNCIONAMIENTO DEL MEDIDOR DE REACTIVA</td></tr><tr><th>Tipo</th><th>Conforme</th><th colspan="3">Prueba de Integración</th><th>Tipo</th><th>Conforme</th><th colspan="3">Prueba de Integración</th></tr><tr><td class="lb2">Conexiones</td><td class="c"><strong>${data.activaConexiones === 'si' ? 'SÍ' : data.activaConexiones === 'no' ? 'NO' : ' '}</strong></td><td class="lb2">Lectura Inicial</td><td class="c"><strong>${data.activaLecturaInicial || ''}</strong></td><td class="lb2">% Error</td><td class="lb2">Conexiones</td><td class="c"><strong>${data.reactivaConexiones === 'si' ? 'SÍ' : data.reactivaConexiones === 'no' ? 'NO' : ' '}</strong></td><td class="lb2">Lectura Inicial</td><td class="c"><strong>${data.reactivaLecturaInicial || ''}</strong></td><td class="lb2">% Error</td></tr><tr><td class="lb2">Continuidad</td><td class="c"><strong>${data.activaContinuidad === 'si' ? 'SÍ' : data.activaContinuidad === 'no' ? 'NO' : ' '}</strong></td><td class="lb2">Lectura Final</td><td class="c"><strong>${data.activaLecturaFinal || ''}</strong></td><td class="c" rowspan="3">${data.activaPorcentajeErrorPruebas || ''}</td><td class="lb2">Continuidad</td><td class="c"><strong>${data.reactivaContinuidad === 'si' ? 'SÍ' : data.reactivaContinuidad === 'no' ? 'NO' : ' '}</strong></td><td class="lb2">Lectura Final</td><td class="c"><strong>${data.reactivaLecturaFinal || ''}</strong></td><td class="c" rowspan="3">${data.reactivaPorcentajeErrorPruebas || ''}</td></tr><tr><td class="lb2" rowspan="2">Prueba de Puentes</td><td class="c" rowspan="2"><strong>${data.activaPuentes === 'si' ? 'SÍ' : data.activaPuentes === 'no' ? 'NO' : ' '}</strong></td><td class="lb2">Diferencia</td><td class="c"><strong>${data.activaDiferencia || ''}</strong></td><td class="lb2" rowspan="2">Prueba de Puentes</td><td class="c" rowspan="2"><strong>${data.reactivaPuentes === 'si' ? 'SÍ' : data.reactivaPuentes === 'no' ? 'NO' : ' '}</strong></td><td class="lb2">Diferencia</td><td class="c"><strong>${data.reactivaDiferencia || ''}</strong></td></tr><tr><td class="lb2">Patron</td><td class="c"><strong>${data.activaPatron || ''}</strong></td><td class="lb2">Patron</td><td class="c"><strong>${data.reactivaPatron || ''}</strong></td></tr><tr><th colspan="4">Estado del integrador</th><th>Medidor se frena</th><th colspan="4">Estado del integrador</th><th>Medidor se frena</th></tr><tr><td class="lb2">¿Giro en vacio?</td><td class="c"><strong>${data.activaGiroVacio === 'si' ? 'SÍ' : data.activaGiroVacio === 'no' ? 'NO' : ''}</strong></td><td class="lb2">¿Registra?</td><td class="c"><strong>${data.activaRegistra === 'si' ? 'SÍ' : data.activaRegistra === 'no' ? 'NO' : ''}</strong></td><td class="c"><strong>${data.activaSeFrena === 'si' ? 'SÍ' : data.activaSeFrena === 'no' ? 'NO' : ''}</strong></td><td class="lb2">¿Giro en vacio?</td><td class="c"><strong>${data.reactivaGiroVacio === 'si' ? 'SÍ' : data.reactivaGiroVacio === 'no' ? 'NO' : ''}</strong></td><td class="lb2">¿Registra?</td><td class="c"><strong>${data.reactivaRegistra === 'si' ? 'SÍ' : data.reactivaRegistra === 'no' ? 'NO' : ''}</strong></td><td class="c"><strong>${data.reactivaSeFrena === 'si' ? 'SÍ' : data.reactivaSeFrena === 'no' ? 'NO' : ''}</strong></td></tr></table>
      <table><colgroup><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"></colgroup><tr><td class="st" colspan="6">CARACTERISTICAS TRANSFORMADORES DE CORRIENTE TC'S ENCONTRADOS</td><td class="st" colspan="6">CARACTERISTICAS TRANSFORMADORES DE POTENCIA ENCONTRADOS</td></tr><tr><th>Marca</th><th>Series</th><th>Tipo</th><th>Relación</th><th>Clase</th><th>VA</th><th>Marca</th><th>Series</th><th>Tipo</th><th>Relación</th><th>Clase</th><th>VA</th></tr><tr><td class="c"><strong>${data.tcMarca1 || ''}</strong></td><td class="c"><strong>${data.tcSeries1 || ''}</strong></td><td class="c"><strong>${data.tcTipo1 || ''}</strong></td><td class="c"><strong>${data.tcRelacion1 || ''}</strong></td><td class="c"><strong>${data.tcClase1 || ''}</strong></td><td class="c"><strong>${data.tcVa1 || ''}</strong></td><td class="c"><strong>${data.tpMarca1 || ''}</strong></td><td class="c"><strong>${data.tpSeries1 || ''}</strong></td><td class="c"><strong>${data.tpTipo1 || ''}</strong></td><td class="c"><strong>${data.tpRelacion1 || ''}</strong></td><td class="c"><strong>${data.tpClase1 || ''}</strong></td><td class="c"><strong>${data.tpVa1 || ''}</strong></td></tr><tr><td class="c"><strong>${data.tcMarca2 || ''}</strong></td><td class="c"><strong>${data.tcSeries2 || ''}</strong></td><td class="c"><strong>${data.tcTipo2 || ''}</strong></td><td class="c"><strong>${data.tcRelacion2 || ''}</strong></td><td class="c"><strong>${data.tcClase2 || ''}</strong></td><td class="c"><strong>${data.tcVa2 || ''}</strong></td><td class="c"><strong>${data.tpMarca2 || ''}</strong></td><td class="c"><strong>${data.tpSeries2 || ''}</strong></td><td class="c"><strong>${data.tpTipo2 || ''}</strong></td><td class="c"><strong>${data.tpRelacion2 || ''}</strong></td><td class="c"><strong>${data.tpClase2 || ''}</strong></td><td class="c"><strong>${data.tpVa2 || ''}</strong></td></tr><tr><td class="c"><strong>${data.tcMarca3 || ''}</strong></td><td class="c"><strong>${data.tcSeries3 || ''}</strong></td><td class="c"><strong>${data.tcTipo3 || ''}</strong></td><td class="c"><strong>${data.tcRelacion3 || ''}</strong></td><td class="c"><strong>${data.tcClase3 || ''}</strong></td><td class="c"><strong>${data.tcVa3 || ''}</strong></td><td class="c"><strong>${data.tpMarca3 || ''}</strong></td><td class="c"><strong>${data.tpSeries3 || ''}</strong></td><td class="c"><strong>${data.tpTipo3 || ''}</strong></td><td class="c"><strong>${data.tpRelacion3 || ''}</strong></td><td class="c"><strong>${data.tpClase3 || ''}</strong></td><td class="c"><strong>${data.tpVa3 || ''}</strong></td></tr></table>
      <table><colgroup><col style="width:22%"><col style="width:18%"><col style="width:10%"><col style="width:10%"><col style="width:20%"><col style="width:20%"></colgroup><tr><td class="st" colspan="6">IRREGULARIDADES ENCONTRADAS POR LA EMPRESA</td></tr><tr><td class="lb">CODIGO(S) DE LA(S) IRREGULARIDAD(ES)</td><td class="c"><strong>${data.codigosIrregularidades || ''}</strong></td><td class="lb">Foto<br><span class="x">${data.tipoEvidencia === 'foto' ? 'X' : ' '}</span></td><td class="lb">Video<br><span class="x">${data.tipoEvidencia === 'video' ? 'X' : ' '}</span></td><td class="lb">IRREGULARIDAD CORREGIDA<br><span class="x">${data.irregularidadCorrida === 'si' ? 'SÍ' : data.irregularidadCorrida === 'no' ? 'NO' : ''}</span></td><td class="lb">MEDIDOR RETIRADO<br><span class="x">${data.medidorRetirado === 'si' ? 'SÍ' : data.medidorRetirado === 'no' ? 'NO' : ''}</span></td></tr><tr><td colspan="6" class="note">NOTA: En caso de detectarse irregularidad(es), esta acta constituye en acta de irregularidades, por lo cual procede como tal ante el cliente o usuario del servicio de energía eléctrica</td></tr><tr><td colspan="6" class="note j">Informe: <strong>${getTipoInformeText()}</strong></td></tr></table>
      <div class="bottom"><div class="legal"><p>Los abajo firmantes reconocen haber leído y aceptado el contenido de esta acta y mediante su firma la dan por levantadas. (EL USO INDEBIDO DEL SERVICIO, LA ADULTERACIÓN O MANIPULACIÓN SIN AUTORIZACIÓN DEL EQUIPO DE MEDIDA SE CONSTITUYE EN EL DELITO DE "DEFRAUDACIÓN DE FLUIDOS") (artículo 256 del Código Penal). El artículo 256 del Código Penal establece que Defraudación de fluidos: El que mediante cualquier mecanismo clandestino o alterando los sistemas de control o aparatos contadores, se apropie de energía eléctrica, en perjuicio ajeno, incurrirá en prisión de uno (1) a cuatro (4) años y en multa de uno (1) a cien (100) salarios mínimos legales mensuales vigentes.</p></div>
      <div class="legal"><p><strong>AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES</strong></p><p>El usuario y/o suscriptor autoriza de manera previa, expresa e informada a emsa E.S.P., como responsable del tratamiento, para tratar los datos personales suministrados en el marco de las actividades de revisión, control y gestión propias de la prestación del servicio público domiciliario de energía eléctrica, con las siguientes finalidades: (i) registrar la revisión realizada; (ii) identificar a los intervinientes y validar los hechos y/o resultados de la visita; (iii) ejercer las actuaciones derivadas de la visita realizada; y (iv) cumplir obligaciones legales y regulatorias aplicables al servicio público de energía eléctrica. De conformidad con lo dispuesto en el literal a) del artículo 10 de la Ley 1581 de 2012, emsa informa que el tratamiento de los datos personales se realiza en ejercicio de sus funciones legales y constitucionales, como prestador de servicios públicos domiciliarios. El tratamiento se realizará conforme a la Política de Tratamiento de la Información Personal disponible en los canales oficiales de emsa. El titular podrá ejercer sus derechos a conocer, actualizar, rectificar y suprimir sus datos, así como revocar la autorización, a través de dichos canales o del correo: pqr@emsa-esp.com.co. Cuando intervenga un testigo, este autoriza el tratamiento de sus datos únicamente para dejar constancia de su participación en la presente acta.</p></div>
      <table class="firma-table"><colgroup><col style="width:33.33%"><col style="width:33.33%"><col style="width:33.34%"></colgroup><tr><th class="firma-header">FUNCIONARIO RESPONSABLE DE LA REVISIÓN</th><th class="firma-header">SUSCRIPTOR O USUARIO</th><th class="firma-header">TESTIGO</th></tr><tr><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${userData.name || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${data.usuarioVisita || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${data.otroRepresentante || 'No especificado'}</div></div></td></tr><tr class="sig-row"><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaFuncionario ? `<div class="firma-imagen"><img src="${signatures.firmaFuncionario}" alt="Firma Funcionario"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaSuscriptor ? `<div class="firma-imagen"><img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaSupervisor ? `<div class="firma-imagen"><img src="${signatures.firmaSupervisor}" alt="Firma Supervisor"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td></tr><tr><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${userData.cc || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${data.documentoVisitante || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${data.ccOtroRepresentante || 'No especificado'}</div></div></td></tr></table>
      </div></div></div>
      <!-- Fin Hoja 1 -->

      <!-- HOJA 2: FORMATO ACTA DE DIAGRAMAS -->
      <div id="pdf-page-2" class="page"><div class="page-inner">
      <div class="hdr"><table class="hdr-t"><colgroup><col style="width:68%"><col style="width:32%"></colgroup><tr><td class="nb c"><img class="logo" src="${base64Logo}" alt="Logo"></td><td class="nb"><table class="code"><colgroup><col style="width:38%"><col style="width:62%"></colgroup><tr><td class="lb">Código:</td><td>FO-GD-CP-05</td></tr><tr><td class="lb">Fecha:</td><td>1/02/2023</td></tr><tr><td class="lb">Versión:</td><td>04</td></tr><tr><td class="lb">Página:</td><td>2 de 2</td></tr></table></td></tr></table></div>
      <table><colgroup><col style="width:9%"><col style="width:7%"><col style="width:9%"><col style="width:3.5%"><col style="width:3.5%"><col style="width:3.5%"><col style="width:3.5%"><col style="width:9%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:10%"></colgroup><tr><td class="st" colspan="9">FORMATO ACTA DE DIAGRAMAS</td><td class="st" colspan="6">CONTROL DE PÉRDIDAS</td></tr><tr><td class="lb" colspan="2">Acta De Revisión No.</td><td class="acta-number" colspan="3">N° <span id="numero">${data.numero_acta}</span></td><td class="lb" colspan="3">CÓDIGO</td><td class="c" colspan="3">${data.codigo || ''}</td><td class="lb" colspan="2">FECHA</td><td class="c" colspan="2">${new Date().toLocaleDateString('es-ES')}</td></tr><tr><td class="lb">REVISIÓN N°</td><td class="c" colspan="3">${data.revision || ''}</td><td class="lb" colspan="3">SOLICITUD N°</td><td class="c" colspan="2">${data.solicitud || ''}</td><td class="lb">CIUDAD</td><td class="c" colspan="3">${data.ciudad || 'Acacias'}</td><td class="lb">ACTA DE REFERENCIA</td><td class="c">${data.numero_acta || '52976'}</td></tr><tr><td class="lb">CIRCUITO</td><td class="c" colspan="2">${data.circuito || ''}</td><td class="lb" colspan="4">SUBESTACIONES</td><td class="c" colspan="3">${data.subestacion || ''}</td><td class="lb" colspan="2">CLIENTES - RAZON SOCIAL</td><td class="c" colspan="3">${data.nombre || ''}</td></tr><tr><td class="lb">TELEMEDIDA</td><td class="c">${data.telemedida || ''}</td><td class="lb">LINEA DEDICADA</td><td class="lb">SI</td><td class="c">${data.lineaDedicada === 'SI' ? 'X' : ' '}</td><td class="lb">NO</td><td class="c">${data.lineaDedicada === 'NO' ? 'X' : ' '}</td><td class="lb">TIPO DE FRONTERA</td><td class="c">${data.tipoFrontera === 'MCM' ? 'X' : ' '} MCM</td><td class="c">${data.tipoFrontera === 'RGP' ? 'X' : ' '} RGP</td><td class="c">${data.tipoFrontera === 'NRP' ? 'X' : ' '} NRP</td><td class="c">${data.tipoFrontera === 'NRO' ? 'X' : ' '} NRO</td><td class="c">${data.tipoFrontera === 'REGO' ? 'X' : ' '} REGO</td><td class="c">${data.tipoFrontera === 'SNT' ? 'X' : ' '} SNT</td><td class="c">${data.tipoFrontera === 'CAMB COM' ? 'X' : ' '} CAMB COM</td></tr></table>
      <div class="diagrams"><div class="d-top"><div class="d-col"><div class="d-title">DIAGRAMA UNIFILAR</div><div class="d-box"><img src="${diagramImages.diagramaUnifilar || './unifilar.png'}" alt="Diagrama Unifilar"></div></div><div class="d-col"><div class="d-title">DIAGRAMA FASORIAL</div><div class="d-box"><img src="${diagramImages.diagramaFasorial || './Fasorial.png'}" alt="Diagrama Fasorial"></div></div></div><div class="d-bottom"><div class="d-title">DIAGRAMA DE CONEXIONES</div><div class="d-box"><img src="${diagramImages.diagramaConexiones || './conexiones.png'}" alt="Diagrama de Conexiones"></div></div></div>
      <table><colgroup><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"><col style="width:8.33%"></colgroup><tr><td class="st" colspan="6">PRUEBA DE TRANSFORMADORES DE POTENCIAL TP'S</td><td class="st" colspan="6">PRUEBA DE TRANSFORMADORES DE CORRIENTE TC'S</td></tr><tr><th>VOLTAJE</th><th>PRIMARIO</th><th>SECUNDARIO</th><th>RTP (Vp/Vs)</th><th>% ERROR</th><th>% PROMEDIO</th><th>CORRIENTE</th><th>PRIMARIO</th><th>SECUNDARIO</th><th>RTC (Ip/Is)</th><th>% ERROR</th><th>% PROMEDIO</th></tr><tr><td class="lb2">VR</td><td class="c">${data.tpData?.vRPrimario || ''}</td><td class="c">${data.tpData?.vRSecundario || ''}</td><td class="c">${data.tpData.vRRtp || ''}</td><td class="c">${data.tpData?.errorVR || ''}</td><td class="c" rowspan="3">${data.tpData?.errorPromedio || ''}</td><td class="lb2">IR</td><td class="c">${data.tcData?.vRPrimario || ''}</td><td class="c">${data.tcData?.vRSecundario || ''}</td><td class="c">${data.tcData.vRRtc || ''}</td><td class="c">${data.tcData?.errorVR || ''}</td><td class="c" rowspan="3">${data.tcData?.errorPromedio || ''}</td></tr><tr><td class="lb2">VS</td><td class="c">${data.tpData?.vSPrimario || ''}</td><td class="c">${data.tpData?.vSSecundario || ''}</td><td class="c">${data.tpData.vSRtp || ''}</td><td class="c">${data.tpData?.errorVS || ''}</td><td class="lb2">LS</td><td class="c">${data.tcData?.vSPrimario || ''}</td><td class="c">${data.tcData?.vSSecundario || ''}</td><td class="c">${data.tcData?.vSRtc || ''}</td><td class="c">${data.tcData?.errorVS || ''}</td></tr><tr><td class="lb2">V_T</td><td class="c">${data.tpData?.vTPrimario || ''}</td><td class="c">${data.tpData?.vTSecundario || ''}</td><td class="c">${data.tpData?.vTRtp || ''}</td><td class="c">${data.tpData?.errorVT || ''}</td><td class="lb2">LT</td><td class="c">${data.tcData?.vTPrimario || ''}</td><td class="c">${data.tcData?.vTSecundario || ''}</td><td class="c">${data.tcData?.vTRtc || ''}</td><td class="c">${data.tcData?.errorVT || ''}</td></tr></table>
      <table class="siec"><colgroup><col style="width:10%"><col style="width:14%"><col style="width:3%"><col style="width:3%"><col style="width:3%"><col style="width:14%"><col style="width:3%"><col style="width:3%"><col style="width:3%"><col style="width:9%"><col style="width:9%"><col style="width:9%"><col style="width:9%"><col style="width:9%"></colgroup><tr><td class="st" colspan="1">FACTOR SIEC</td><td class="st" colspan="8">OBSERVACIONES GENERALES</td><td class="st" colspan="5" rowspan="2">ADECUACIONES Y MEJORAS QUE NECESITA LA INSTALACIÓN ELÉCTRICA</td></tr><tr><td class="c" rowspan="2"><strong>${data.factorData?.factorSiec || ''}</strong></td><th>EQUIPOS</th><th>B</th><th>R</th><th>M</th><th>EQUIPOS</th><th>B</th><th>R</th><th>M</th></tr><tr><td class="lb2">RED</td><td class="c est">${data.observaciones?.redMT === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.redMT === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.redMT === 'Malo' ? 'X' : ''}</td><td class="lb2">TPS</td><td class="c est">${data.observaciones?.tps === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.tps === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.tps === 'Malo' ? 'X' : ''}</td><td rowspan="8" colspan="5" class="adec"><div class="adec-grid"><ul class="cbl"><li><input type="checkbox" ${data.adecuaciones?.cambiarMedidor || data.adecuaciones?.instalarMedidor ? 'checked' : ''}> Cambiar o instalar el medidor</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarMedidor ? 'checked' : ''}> Cambiar o instalar TC</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarMedidor ? 'checked' : ''}> Cambiar o Instalar TP</li><li><input type="checkbox" ${data.adecuaciones?.cambiarCaja || data.adecuaciones?.instalarCaja ? 'checked' : ''}> Cambiar o instalación de caja para el medidor</li><li><input type="checkbox" ${data.adecuaciones?.cambiarPuestaTierra || data.adecuaciones?.instalarPuestaTierra ? 'checked' : ''}> Cambiar o instalar sistema de puesta a tierra</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarBloquePruebas ? 'checked' : ''}> Cambiar o instalar Bloque de Pruebas</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarProteccionesElectricas ? 'checked' : ''}> Cambiar o instalar Protecciones eléctricas</li></ul><ul class="cbl"><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarCableSenal ? 'checked' : ''}> Cambiar o instalar Cable de señal (según norma)</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarSistemaComunicacion ? 'checked' : ''}> Cambiar o instalar sistema de comunicación</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarModem ? 'checked' : ''}> Cambiar o instalar MODEM</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarProteccionesCommunicacion ? 'checked' : ''}> Cambiar o instalar Protecciones en comunicaciones</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarDuctosCableSeñal ? 'checked' : ''}> Cambiar o instalar ductos para cables de señal</li><li><input type="checkbox" ${data.adecuaciones?.otros ? 'checked' : ''}> Otros: ${data.adecuaciones?.otrosTexto || ''}</li><li><input type="checkbox" ${data.adecuaciones?.adecuaroInstalaraSeguridadCeldas ? 'checked' : ''}> Adecuar o instalar seguridad a las celdas de medidor</li><li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarCelda ? 'checked' : ''}> Cambiar o instalar Celda para medida(TP'S y TC'S) norma</li></ul></div></td></tr><tr><td class="lb2">FACTOR ENCONTRADO</td><td class="lb2">CRUCETAS</td><td class="c est">${data.observaciones?.crucetas === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.crucetas === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.crucetas === 'Malo' ? 'X' : ''}</td><td class="lb2">TCS</td><td class="c est">${data.observaciones?.tcs === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.tcs === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.tcs === 'Malo' ? 'X' : ''}</td></tr><tr><td class="c"><strong>${data.factorData?.factorEncontrado || ''}</strong></td><td class="lb2">PARARRAYOS</td><td class="c est">${data.observaciones?.pararrayos === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.pararrayos === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.pararrayos === 'Malo' ? 'X' : ''}</td><td class="lb2">BLOQUES DE PRUEBA</td><td class="c est">${data.observaciones?.bloquesPrueba === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.bloquesPrueba === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.bloquesPrueba === 'Malo' ? 'X' : ''}</td></tr><tr><td class="lb2">%ERROR DE FACT</td><td class="lb2">CORTACIRCUITOS</td><td class="c est">${data.observaciones?.cortacircuitos === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.cortacircuitos === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.cortacircuitos === 'Malo' ? 'X' : ''}</td><td class="lb2">CELDA</td><td class="c est">${data.observaciones?.celda === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.celda === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.celda === 'Malo' ? 'X' : ''}</td></tr><tr><td class="c"><strong>${data.factorData?.errorFactor || ''}</strong></td><td class="lb2">FUSIBLES</td><td class="c est">${data.observaciones?.fusibles === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.fusibles === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.fusibles === 'Malo' ? 'X' : ''}</td><td class="lb2">GABINETES</td><td class="c est">${data.observaciones?.gabinetes === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.gabinetes === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.gabinetes === 'Malo' ? 'X' : ''}</td></tr><tr><td class="lb2">FACTOR FINAL</td><td class="lb2">BAJANTES</td><td class="c est">${data.observaciones?.bajantes === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.bajantes === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.bajantes === 'Malo' ? 'X' : ''}</td><td class="lb2">MODEM</td><td class="c est">${data.observaciones?.modem === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.modem === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.modem === 'Malo' ? 'X' : ''}</td></tr><tr><td class="c" rowspan="2"><strong>${data.factorData?.factorFinal || ''}</strong></td><td class="lb2">TRANSFORMADOR PRINCIPAL</td><td class="c est">${data.observaciones?.transformador === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.transformador === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.transformador === 'Malo' ? 'X' : ''}</td><td class="lb2">CABLE DE SEÑAL</td><td class="c est">${data.observaciones?.cableSenal === 'Bueno' ? 'X' : ''}</td><td class="c est">${data.observaciones?.cableSenal === 'Regular' ? 'X' : ''}</td><td class="c est">${data.observaciones?.cableSenal === 'Malo' ? 'X' : ''}</td></tr><tr><td class="fl" colspan="8">EQUIPO PATRON<p class="v">${data.factorData?.equipoPatron || ''}</p></td></tr></table>
      <table><colgroup><col style="width:100%"></colgroup><tr><td class="st" colspan="1">Nota: En caso de detectarse irregularidad(es), esta acta se constituye en acta de irregularidades, por lo cual procede como tal ante el cliente o usuario del servicio de energía eléctrica:</td></tr><tr><td class="st">INFORME</td></tr><tr><td class="note j" style="font-style:normal;font-size:7.5px">${getInformeDisplayText()}</td></tr><tr><td class="note j" style="font-style:normal;font-size:7.5px">LA EMPRESA, con base en lo establecido en la ley 142 de 1994 y en su contrato de Servicios Públicos con Condiciones Uniformes, se permite informarle que usted dispone a partir de la fecha un Periodo de Facturación (30 días calendario), para instalar cambiar o adecuar las anomalías aquí indicadas, cumpliendo con las NORMAS TÉCNICAS exigidos por la EMPRESA; pasado este período y de no tomar las medidas necesarias para adquirirlos, las instalación(es) provicional(es) pasarán a ser definitiva(s) con cargo a su cuenta.</td></tr></table>
      <div class="bottom"><div class="legal"><p><strong>AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES</strong></p><p>El usuario y/o suscriptor autoriza de manera previa, expresa e informada a emsa E.S.P., como responsable del tratamiento, para tratar los datos personales suministrados en el marco de las actividades de revisión, control y gestión propias de la prestación del servicio público domiciliario de energía eléctrica, con las siguientes finalidades: (i) registrar la revisión realizada; (ii) identificar a los intervinientes y validar los hechos y/o resultados de la visita; (iii) ejercer las actuaciones derivadas de la visita realizada; y (iv) cumplir obligaciones legales y regulatorias aplicables al servicio público de energía eléctrica. De conformidad con lo dispuesto en el literal a) del artículo 10 de la Ley 1581 de 2012, emsa informa que el tratamiento de los datos personales se realiza en ejercicio de sus funciones legales y constitucionales, como prestador de servicios públicos domiciliarios. El tratamiento se realizará conforme a la Política de Tratamiento de la Información Personal disponible en los canales oficiales de emsa. El titular podrá ejercer sus derechos a conocer, actualizar, rectificar y suprimir sus datos, así como revocar la autorización, a través de dichos canales o del correo: pqr@emsa-esp.com.co. Cuando intervenga un testigo, este autoriza el tratamiento de sus datos únicamente para dejar constancia de su participación en la presente acta.</p></div>
      <table class="firma-table"><colgroup><col style="width:33.33%"><col style="width:33.33%"><col style="width:33.34%"></colgroup><tr><th class="firma-header">FUNCIONARIO RESPONSABLE DE LA REVISIÓN</th><th class="firma-header">SUSCRIPTOR O USUARIO</th><th class="firma-header">TESTIGO</th></tr><tr><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${userData.name || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${data.usuarioVisita || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${data.otroRepresentante || 'No especificado'}</div></div></td></tr><tr class="sig-row"><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaFuncionario ? `<div class="firma-imagen"><img src="${signatures.firmaFuncionario}" alt="Firma Funcionario"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaSuscriptor ? `<div class="firma-imagen"><img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaSupervisor ? `<div class="firma-imagen"><img src="${signatures.firmaSupervisor}" alt="Firma Supervisor"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td></tr><tr><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${userData.cc || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${data.documentoVisitante || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${data.ccOtroRepresentante || 'No especificado'}</div></div></td></tr></table>
      </div></div></div>
      <!-- Fin Hoja 2 -->

      <!-- HOJA 3: ACTA DE MATERIALES ELÉCTRICOS -->
      <div id="pdf-page-3" class="page"><div class="page-inner">
      <div class="hdr"><table class="hdr-t"><colgroup><col style="width:68%"><col style="width:32%"></colgroup><tr><td class="nb c"><img class="logo" src="${base64Logo}" alt="Logo"></td><td class="nb"><table class="code"><colgroup><col style="width:38%"><col style="width:62%"></colgroup><tr><td class="lb">Código:</td><td>FO-GD-CP-04</td></tr><tr><td class="lb">Fecha:</td><td>${new Date().toLocaleDateString('es-ES')}</td></tr><tr><td class="lb">Versión:</td><td>4</td></tr><tr><td class="lb">Página:</td><td>3 DE 3</td></tr></table></td></tr></table></div>
      <div class="title">ACTA DE MATERIALES ELÉCTRICOS</div>
      <table><colgroup><col style="width:18%"><col style="width:13%"><col style="width:8%"><col style="width:12%"><col style="width:16%"><col style="width:11%"><col style="width:14%"><col style="width:8%"></colgroup><tr><td class="st" colspan="4">ACTA DE MATERIALES ELÉCTRICOS</td><td class="st" colspan="4">CONTROL DE PÉRDIDAS</td></tr><tr><td class="lb">Acta De Materiales Eléctricos No.</td><td class="acta-number">N° <span>${data.numero_acta || ''}</span></td><td class="lb">Código</td><td class="c">${data.codigo || ''}</td><td class="lb">Revisión ó Solicitud No.</td><td class="c">${data.solicitudNo || ''}</td><td class="lb">ACTA REFERENCIA No.</td><td class="c">${data.numero_acta || ''}</td></tr></table>
      <table><colgroup><col style="width:100%"></colgroup><tr><td class="intro">A los <strong>${new Date().getDate()}</strong> días del mes de <strong>${new Date().toLocaleString('es-ES', { month: 'long' })}</strong> del <strong>${new Date().getFullYear()}</strong> se hicieron presentes los señores <strong>${userData.name || '________________________________'}</strong> y <strong>${data.otroRepresentante || '________________________________________'}</strong> en representación de la EMSA ESP, en el inmueble ubicado en la <strong>${data.direccion || '________________________________________________'}</strong> del Municipio de <strong>${data.ciudad || '_____________________'}</strong> con el fin de instalar material eléctrico, el cual tiene las siguientes características</td></tr></table>
      <table class="mat"><colgroup><col style="width:8%"><col style="width:8%"><col style="width:8%"><col style="width:8%"><col style="width:4%"><col style="width:8%"><col style="width:6%"><col style="width:8%"><col style="width:8%"><col style="width:8%"><col style="width:8%"><col style="width:4%"><col style="width:8%"><col style="width:6%"></colgroup><thead><tr><th class="st" colspan="4">DESCRIPCIÓN</th><th class="st" colspan="3">MATERIAL INCLUIDO</th><th class="st" colspan="4">DESCRIPCIÓN</th><th class="st" colspan="3">MATERIAL INCLUIDO</th></tr><tr><th colspan="4">Medidor (${data.materiales?.medidor?.fasico || '___'})fasico, (${data.materiales?.medidor?.fases || '___'})F - (${data.materiales?.medidor?.hilos || '___'})H</th><th>UNI</th><th>ESTADO</th><th>CANT.</th><th colspan="4">PROTECCIONES Y HERRAJES</th><th>UNI</th><th>ESTADO</th><th>CANT.</th></tr></thead><tbody><tr><td class="ds" colspan="4">ELECTROMECÁNICO, (${data.materiales?.medidorElectroMecanico?.especificaciones?.tipo || '___'}) - (${data.materiales?.medidorElectroMecanico?.especificaciones?.amperios || '___'}) A.,(${data.materiales?.medidorElectroMecanico?.especificaciones?.voltios || '___'}) V.,Clase(${data.materiales?.medidorElectroMecanico?.especificaciones?.clase || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.medidorElectroMecanico?.estado || '___'}</td><td class="c">${data.materiales?.medidorElectroMecanico?.cantidad || 0}</td><td class="ds" colspan="4">CINTA BANDIT (${data.materiales?.cintaBandit?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.cintaBandit?.estado || '___'}</td><td class="c">${data.materiales?.cintaBandit?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">ELECTRÓNICO regis,ciclometrico (${data.materiales?.medidorElectronicoRegis?.especificaciones?.tipo || '___'}) - (${data.materiales?.medidorElectronicoRegis?.especificaciones?.amperios || '___'}) A.,(${data.materiales?.medidorElectronicoRegis?.especificaciones?.voltios || '___'}) V.,Clase(${data.materiales?.medidorElectronicoRegis?.especificaciones?.clase || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.medidorElectronicoRegis?.estado || '___'}</td><td class="c">${data.materiales?.medidorElectronicoRegis?.cantidad || 0}</td><td class="ds" colspan="4">GRAPA "HEBILLA" PARA CINTA (${data.materiales?.grapaHebilla?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.grapaHebilla?.estado || '___'}</td><td class="c">${data.materiales?.grapaHebilla?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">ELECTRÓNICO con display (${data.materiales?.medidorElectronicoDisplay?.especificaciones?.tipo || '___'}) - (${data.materiales?.medidorElectronicoDisplay?.especificaciones?.amperios || '___'}) A.,(${data.materiales?.medidorElectronicoDisplay?.especificaciones?.voltios || '___'}) V.,Clase(${data.materiales?.medidorElectronicoDisplay?.especificaciones?.clase || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.medidorElectronicoDisplay?.estado || '___'}</td><td class="c">${data.materiales?.medidorElectronicoDisplay?.cantidad || 0}</td><td class="ds" colspan="4">CAPACETE DE (${data.materiales?.capacete?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.capacete?.estado || '___'}</td><td class="c">${data.materiales?.capacete?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4"></td><td class="c"></td><td class="c"></td><td class="c"></td><td class="ds" colspan="4">CONECTOR CURVO (${data.materiales?.conectorCurvo?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.conectorCurvo?.estado || '___'}</td><td class="c">${data.materiales?.conectorCurvo?.cantidad || 0}</td></tr><tr><td class="lb2" colspan="4">Medidores para Medida Semi</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td><td class="ds" colspan="4">CONDULETAS DE (${data.materiales?.conduletas?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.conduletas?.estado || '___'}</td><td class="c">${data.materiales?.conduletas?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">ELECTROMECÁNICO (${data.materiales?.medidorSemiElectro?.especificaciones?.fases || '___'})F - (${data.materiales?.medidorSemiElectro?.especificaciones?.hilos || '___'})H, Clase (${data.materiales?.medidorSemiElectro?.especificaciones?.clase || '___'}). (${data.materiales?.medidorSemiElectro?.especificaciones?.amperios || '___'})A.(${data.materiales?.medidorSemiElectro?.especificaciones?.voltios || '___'})V.</td><td class="c">Un</td><td class="c">${data.materiales?.medidorSemiElectro?.estado || '___'}</td><td class="c">${data.materiales?.medidorSemiElectro?.cantidad || 0}</td><td class="ds" colspan="4">CONDULETA EN (${data.materiales?.conduletaTapa?.tipo || '___'}) DE (${data.materiales?.conduletaTapa?.medida || '___'})" CON TAPA</td><td class="c">Un</td><td class="c">${data.materiales?.conduletaTapa?.estado || '___'}</td><td class="c">${data.materiales?.conduletaTapa?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">ELECTRÓNICO regis,ciclometrico (${data.materiales?.medidorSemiElectronico?.especificaciones?.fases || '___'})F - (${data.materiales?.medidorSemiElectronico?.especificaciones?.hilos || '___'})H, Clase (${data.materiales?.medidorSemiElectronico?.especificaciones?.clase || '___'}). (${data.materiales?.medidorSemiElectronico?.especificaciones?.amperios || '___'})A.(${data.materiales?.medidorSemiElectronico?.especificaciones?.voltios || '___'})V.</td><td class="c">Un</td><td class="c">${data.materiales?.medidorSemiElectronico?.estado || '___'}</td><td class="c">${data.materiales?.medidorSemiElectronico?.cantidad || 0}</td><td class="ds" colspan="4">TUBO GALVANIZADO (${data.materiales?.tuboGalvanizado?.medida || '___'})" x 3m</td><td class="c">Un</td><td class="c">${data.materiales?.tuboGalvanizado?.estado || '___'}</td><td class="c">${data.materiales?.tuboGalvanizado?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4"></td><td class="c"></td><td class="c"></td><td class="c"></td><td class="ds" colspan="4">ANCLAJE ACOMETIDA (${data.materiales?.anclajeAcometida?.tipo || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.anclajeAcometida?.estado || '___'}</td><td class="c">${data.materiales?.anclajeAcometida?.cantidad || 0}</td></tr><tr><td class="lb2" colspan="4">Medidores para Medida Semi e indirecta Electrónicos</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td><td class="ds" colspan="4">CONECTOR BIMETALICO TIPO CUÑA TIPO(${data.materiales?.conectorBimetalicoCuna?.tipo || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.conectorBimetalicoCuna?.estado || '___'}</td><td class="c">${data.materiales?.conectorBimetalicoCuna?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">SIN PERFIL (${data.materiales?.medidorSinPerfil?.especificaciones?.fases || '___'})F - (${data.materiales?.medidorSinPerfil?.especificaciones?.hilos || '___'})H, Clase (${data.materiales?.medidorSinPerfil?.especificaciones?.clase || '___'}). (${data.materiales?.medidorSinPerfil?.especificaciones?.amperios || '___'})A.(${data.materiales?.medidorSinPerfil?.especificaciones?.voltios || '___'})V.</td><td class="c">Un</td><td class="c">${data.materiales?.medidorSinPerfil?.estado || '___'}</td><td class="c">${data.materiales?.medidorSinPerfil?.cantidad || 0}</td><td class="ds" colspan="4">ESTRIBO TIPO (${data.materiales?.estribo?.tipo || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.estribo?.estado || '___'}</td><td class="c">${data.materiales?.estribo?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">CON PERFIL DE CARGA Y (${data.materiales?.medidorConPerfil?.especificaciones?.comunicaciones || '___'}) COMUNICACIONES, clase(${data.materiales?.medidorConPerfil?.especificaciones?.clase || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.medidorConPerfil?.estado || '___'}</td><td class="c">${data.materiales?.medidorConPerfil?.cantidad || 0}</td><td class="ds" colspan="4">CONECTOR BIMETALICO (${data.materiales?.conectorBimetalicoPerno?.tipo || '___'}) PERNO</td><td class="c">Un</td><td class="c">${data.materiales?.conectorBimetalicoPerno?.estado || '___'}</td><td class="c">${data.materiales?.conectorBimetalicoPerno?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">CON PERFIL DE CARGA Y MODEM INTERNO, clase (${data.materiales?.medidorConPerfilModem?.especificaciones?.clase || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.medidorConPerfilModem?.estado || '___'}</td><td class="c">${data.materiales?.medidorConPerfilModem?.cantidad || 0}</td><td class="ds" colspan="4">TENSOR PARA ACOMETIDA CABLE CONCENTRICO</td><td class="c">Un</td><td class="c">${data.materiales?.tensorAcometida?.estado || '___'}</td><td class="c">${data.materiales?.tensorAcometida?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4"></td><td class="c"></td><td class="c"></td><td class="c"></td><td class="ds" colspan="4">OJO DE ALUMINIO</td><td class="c">Un</td><td class="c">${data.materiales?.ojoAluminio?.estado || '___'}</td><td class="c">${data.materiales?.ojoAluminio?.cantidad || 0}</td></tr><tr><td class="lb2" colspan="4">Router y Varios</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td><td class="ds" colspan="4">BREAKERS DE (${data.materiales?.breakers?.amperios || '___'}x${data.materiales?.breakers?.amperios || '___'})Amp.</td><td class="c">Un</td><td class="c">${data.materiales?.breakers?.estado || '___'}</td><td class="c">${data.materiales?.breakers?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">GPRS (${data.materiales?.routerGPRS?.simCard || '___'}) SIM CARD</td><td class="c">Un</td><td class="c">${data.materiales?.routerGPRS?.estado || '___'}</td><td class="c">${data.materiales?.routerGPRS?.cantidad || 0}</td><td class="ds" colspan="4">CONECTOR PARA VARILLA</td><td class="c">Un</td><td class="c">${data.materiales?.conectorVarilla?.estado || '___'}</td><td class="c">${data.materiales?.conectorVarilla?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">CONVERSORES</td><td class="c">Un</td><td class="c">${data.materiales?.conversores?.estado || '___'}</td><td class="c">${data.materiales?.conversores?.cantidad || 0}</td><td class="ds" colspan="4">TENSOR PARA ACOMETIDA CABLE CONCENTRICO cambio</td><td class="c">Un</td><td class="c">${data.materiales?.tensorCambio?.estado || '___'}</td><td class="c">${data.materiales?.tensorCambio?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">BLOQUE DE PRUEBA</td><td class="c">Un</td><td class="c">${data.materiales?.bloquePrueba?.estado || '___'}</td><td class="c">${data.materiales?.bloquePrueba?.cantidad || 0}</td><td class="ds" colspan="4">ALAMBRE DE COBRE No. (${data.materiales?.alambreCobre?.calibre || '___'}) AWG</td><td class="c">Un</td><td class="c">${data.materiales?.alambreCobre?.estado || '___'}</td><td class="c">${data.materiales?.alambreCobre?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4"></td><td class="c"></td><td class="c"></td><td class="c"></td><td class="ds" colspan="4">VARILLA PUESTA A TIERRA(${data.materiales?.varillaPuestaTierra?.metros || '___'}) Mts.</td><td class="c">Un</td><td class="c">${data.materiales?.varillaPuestaTierra?.estado || '___'}</td><td class="c">${data.materiales?.varillaPuestaTierra?.cantidad || 0}</td></tr><tr><td class="lb2" colspan="4">TRANSFORMADORES DE CORRIENTE</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td><td class="ds" colspan="4">TERMINAL MT(${data.materiales?.terminalMT?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.terminalMT?.estado || '___'}</td><td class="c">${data.materiales?.terminalMT?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">USO EXTERIOR (${data.materiales?.tcUsoExterior600?.amperios || '___'}/${data.materiales?.tcUsoExterior600?.amperios2 || '___'}) Amp, clase (${data.materiales?.tcUsoExterior600?.clase || '___'}) de ventada 600Vol.</td><td class="c">Un</td><td class="c">${data.materiales?.tcUsoExterior600?.estado || '___'}</td><td class="c">${data.materiales?.tcUsoExterior600?.cantidad || 0}</td><td class="ds" colspan="4">CURVA MT(${data.materiales?.curvaMT?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.curvaMT?.estado || '___'}</td><td class="c">${data.materiales?.curvaMT?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">USO INTERIOR (${data.materiales?.tcUsoInterior600?.amperios || '___'}/${data.materiales?.tcUsoInterior600?.amperios2 || '___'}) Amp, clase (${data.materiales?.tcUsoInterior600?.clase || '___'}) de ventada 600Vol.</td><td class="c">Un</td><td class="c">${data.materiales?.tcUsoInterior600?.estado || '___'}</td><td class="c">${data.materiales?.tcUsoInterior600?.cantidad || 0}</td><td class="ds" colspan="4">FLEXI CONDUIT METALICO(${data.materiales?.flexiConduit?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.flexiConduit?.estado || '___'}</td><td class="c">${data.materiales?.flexiConduit?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">USO EXTERIOR (${data.materiales?.tcUsoExteriorAlta?.kv || '___'}) Kv de (${data.materiales?.tcUsoExteriorAlta?.primario || '___'}) / (${data.materiales?.tcUsoExteriorAlta?.secundario || '___'}) Amp. clase (${data.materiales?.tcUsoExteriorAlta?.clase || '___'}).</td><td class="c">Un</td><td class="c">${data.materiales?.tcUsoExteriorAlta?.estado || '___'}</td><td class="c">${data.materiales?.tcUsoExteriorAlta?.cantidad || 0}</td><td class="ds" colspan="4">TERMINAL FLEXI(${data.materiales?.terminalFlexi?.medida || '___'})"</td><td class="c">Un</td><td class="c">${data.materiales?.terminalFlexi?.estado || '___'}</td><td class="c">${data.materiales?.terminalFlexi?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">USO INTERIOR (${data.materiales?.tcUsoInteriorAlta?.kv || '___'}/${data.materiales?.tcUsoInteriorAlta?.kv2 || '___'}) Kv de (${data.materiales?.tcUsoInteriorAlta?.primario || '___'}) / (${data.materiales?.tcUsoInteriorAlta?.secundario || '___'}) Amp. clase (${data.materiales?.tcUsoInteriorAlta?.clase || '___'}).</td><td class="c">Un</td><td class="c">${data.materiales?.tcUsoInteriorAlta?.estado || '___'}</td><td class="c">${data.materiales?.tcUsoInteriorAlta?.cantidad || 0}</td><td class="lb2" colspan="4">SELLOS</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td></tr><tr><td class="lb2" colspan="4">TRANSFORMADORES DE POTENCIAL</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td><td class="ds" colspan="4">ROTOSEAL DE COLOR (${data.materiales?.rotoseal?.color || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.rotoseal?.estado || '___'}</td><td class="c">${data.materiales?.rotoseal?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">USO EXTERIOR (${data.materiales?.tpUsoExterior?.primario || '___'}) / (${data.materiales?.tpUsoExterior?.secundario || '___'}) Vol. clase (${data.materiales?.tpUsoExterior?.clase || '___'}).</td><td class="c">Un</td><td class="c">${data.materiales?.tpUsoExterior?.estado || '___'}</td><td class="c">${data.materiales?.tpUsoExterior?.cantidad || 0}</td><td class="ds" colspan="4">ESTAMPILLA</td><td class="c">Un</td><td class="c">${data.materiales?.estampilla?.estado || '___'}</td><td class="c">${data.materiales?.estampilla?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">USO INTERIOR (${data.materiales?.tpUsoInterior?.primario || '___'}) / (${data.materiales?.tpUsoInterior?.secundario || '___'}) Vol. clase (${data.materiales?.tpUsoInterior?.clase || '___'}).</td><td class="c">Un</td><td class="c">${data.materiales?.tpUsoInterior?.estado || '___'}</td><td class="c">${data.materiales?.tpUsoInterior?.cantidad || 0}</td><td class="lb2" colspan="7">MATERIAL RETIRADO</td></tr><tr><td class="lb2" colspan="4">CABLES Y ALAMBRE</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td><td class="ret" colspan="7" rowspan="7"><strong>Descripción del material retirado:</strong><br>${data.materiales?.materialRetirado?.descripcion || '_______________________________'}</td></tr><tr><td class="ds" colspan="4">CABLE CONCENTRICO PARA ACOMETIDA (${data.materiales?.cableConcentrico?.calibre || '___'} X ${data.materiales?.cableConcentrico?.conductores || '___'}) + (${data.materiales?.cableConcentrico?.neutro || '___'})</td><td class="c">Un</td><td class="c">${data.materiales?.cableConcentrico?.estado || '___'}</td><td class="c">${data.materiales?.cableConcentrico?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">CABLE DE CONTROL (${data.materiales?.cableControl?.conductores || '___'}) X (${data.materiales?.cableControl?.calibre || '___'}) AWG</td><td class="c">Un</td><td class="c">${data.materiales?.cableControl?.estado || '___'}</td><td class="c">${data.materiales?.cableControl?.cantidad || 0}</td></tr><tr><td class="lb2" colspan="4">CAJA Hermetica</td><td class="lb2">UNI</td><td class="lb2">ESTADO</td><td class="lb2">CANT.</td></tr><tr><td class="ds" colspan="4">SOBREPONER PARA MEDIDOR (${data.materiales?.cajaSobreponer?.fasico || '___'}) FASICO TIPO (${data.materiales?.cajaSobreponer?.tipo || '___'}).</td><td class="c">Un</td><td class="c">${data.materiales?.cajaSobreponer?.estado || '___'}</td><td class="c">${data.materiales?.cajaSobreponer?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">INCRUSTAR MEDIDOR (${data.materiales?.cajaIncrustar?.fasico || '___'}) FASICO TIPO (${data.materiales?.cajaIncrustar?.tipo || '___'}).</td><td class="c">Un</td><td class="c">${data.materiales?.cajaIncrustar?.estado || '___'}</td><td class="c">${data.materiales?.cajaIncrustar?.cantidad || 0}</td></tr><tr><td class="ds" colspan="4">TIPO GABINETE PARA MEDIDORES.</td><td class="c">Un</td><td class="c">${data.materiales?.cajaGabinete?.estado || '___'}</td><td class="c">${data.materiales?.cajaGabinete?.cantidad || 0}</td></tr></tbody></table>
      <table class="inst"><colgroup><col style="width:9%"><col style="width:9%"><col style="width:6%"><col style="width:7%"><col style="width:9%"><col style="width:7%"><col style="width:7%"><col style="width:6%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:12%"></colgroup><tr><td class="st" colspan="13">ESTADO DEL MATERIAL INSTALADO=PR:Provisional, VE:Venta, TE:Usuario, RE:Reutilizado, FI:Financiado &nbsp;&nbsp; ESTADO DEL MATERIAL RETIRADO=EA:Entregado al usuario, BC:Bodega Contratista, BE:Bodega, EMSA:PR</td></tr><tr><th colspan="7">MEDIDOR INSTALADO</th><th colspan="5">DISPOSICIÓN DE LOS SELLOS</th><th>COLOR</th></tr><tr><th>NÚMERO</th><th>MARCA</th><th>FASES</th><th>DÍGITOS</th><th>LECTURA</th><th>VOLTIOS</th><th>AMPERIOS</th><th class="lb2">TP</th><th>${data.sello_tp_1 || ''}</th><th>${data.sello_tp_2 || ''}</th><th>${data.sello_tp_3 || ''}</th><th>${data.sello_tp_4 || ''}</th><th>${data.sello_color_1 || ''}</th></tr><tr><td class="c" rowspan="2">${data.medidor_numero || ''}</td><td class="c" rowspan="2">${data.medidor_marca || ''}</td><td class="c" rowspan="2">${data.medidor_fases || ''}</td><td class="c" rowspan="2">${data.medidor_digitos || ''}</td><td class="c" rowspan="2">${data.medidor_lectura || ''}</td><td class="c" rowspan="2">${data.medidor_voltios || ''}</td><td class="c" rowspan="2">${data.medidor_amperios || ''}</td><td class="lb2">TB</td><th>${data.sello_tb_1 || ''}</th><th>${data.sello_tb_2 || ''}</th><th>${data.sello_tb_3 || ''}</th><th>${data.sello_tb_4 || ''}</th><th>${data.sello_color_2 || ''}</th></tr><tr><td class="lb2">EST</td><th>${data.sello_est_1 || ''}</th><th>${data.sello_est_2 || ''}</th><th>${data.sello_est_3 || ''}</th><th>${data.sello_est_4 || ''}</th><th>${data.sello_color_3 || ''}</th></tr></table>
      <div class="atend"><strong>ATENDIÓ LA VISITA EL (LOS) REPRESENTANTE (S) LEGAL (S) DEL INMUEBLE, EL (LOS) SEÑOR (S):</strong> <strong>${data.usuarioVisita || '________________________________________________________________'}</strong><br>QUIEN AUTORIZA EL COBRO DE LOS ANTERIORES MATERIALES, DE CONTADO ( <strong>${data.tipoPago === 'contado' ? 'X' : ' '}</strong> ) , FINANCIADO ( <strong>${data.tipoPago === 'financiado' ? 'X' : ' '}</strong> ) .</div>
      <table><colgroup><col style="width:100%"></colgroup><tr><td class="lb">OBSERVACIONES:</td></tr><tr><td class="obs-box">${typeof data.observaciones === 'string' ? data.observaciones : (data.observacionesMateriales || '')}</td></tr></table>
      <div class="bottom"><div class="legal"><p><strong>AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES</strong></p><p>El usuario y/o suscriptor autoriza de manera previa, expresa e informada a emsa E.S.P., como responsable del tratamiento, para tratar los datos personales suministrados en el marco de las actividades de revisión, control y gestión propias de la prestación del servicio público domiciliario de energía eléctrica, con las siguientes finalidades: (i) registrar la revisión realizada; (ii) identificar a los intervinientes y validar los hechos y/o resultados de la visita; (iii) ejercer las actuaciones derivadas de la visita realizada; y (iv) cumplir obligaciones legales y regulatorias aplicables al servicio público de energía eléctrica. De conformidad con lo dispuesto en el literal a) del artículo 10 de la Ley 1581 de 2012, emsa informa que el tratamiento de los datos personales se realiza en ejercicio de sus funciones legales y constitucionales, como prestador de servicios públicos domiciliarios. El tratamiento se realizará conforme a la Política de Tratamiento de la Información Personal disponible en los canales oficiales de emsa. El titular podrá ejercer sus derechos a conocer, actualizar, rectificar y suprimir sus datos, así como revocar la autorización, a través de dichos canales o del correo: pqr@emsa-esp.com.co. Cuando intervenga un testigo, este autoriza el tratamiento de sus datos únicamente para dejar constancia de su participación en la presente acta.</p></div>
      <table class="firma-table"><colgroup><col style="width:33.33%"><col style="width:33.33%"><col style="width:33.34%"></colgroup><tr><th class="firma-header">FUNCIONARIO RESPONSABLE DE LA REVISIÓN</th><th class="firma-header">SUSCRIPTOR O USUARIO</th><th class="firma-header">SUPERVISOR Y/O INTERVENTOR</th></tr><tr><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${userData.name || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${data.usuarioVisita || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">NOMBRE:</span><div class="firma-value">${data.otroRepresentante || 'No especificado'}</div></div></td></tr><tr class="sig-row"><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaFuncionario ? `<div class="firma-imagen"><img src="${signatures.firmaFuncionario}" alt="Firma Funcionario"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaSuscriptor ? `<div class="firma-imagen"><img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td><td><div class="firma-row"><span class="firma-text">FIRMA:</span><div class="firma-value">${signatures.firmaSupervisor ? `<div class="firma-imagen"><img src="${signatures.firmaSupervisor}" alt="Firma Supervisor"></div>` : '<span class="firma-faltante">No disponible</span>'}</div></div></td></tr><tr><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${userData.cc || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${data.documentoVisitante || 'No especificado'}</div></div></td><td><div class="firma-row"><span class="firma-text">C.C/TP/MP/CODIGO:</span><div class="firma-value">${data.ccOtroRepresentante || 'No especificado'}</div></div></td></tr></table>
      <table><colgroup><col style="width:50%"><col style="width:50%"></colgroup><tr><td class="lb c">ORIGINAL: EMPRESA</td><td class="lb c">COPIA VERDE: USUARIO</td></tr></table>
      <div class="legal c">NO PAGAR NI REALIZAR NEGOCIACIONES CON EL OPERARIO POR NINGÚN CONCEPTO. DENUNCIE CUALQUIER IRREGULARIDAD AL TELÉFONO 608-6614000 EXT.150</div></div></div></div>
      <!-- Fin Hoja 3 -->
      <script>
        (function () {
          function fit() {
            var pages = document.querySelectorAll('.page');
            for (var i = 0; i < pages.length; i++) {
              var page = pages[i], inner = page.querySelector('.page-inner');
              if (!inner) continue;
              inner.style.transformOrigin = 'top left';
              var z = 1;
              while (z >= 0.55) {
                inner.style.transform = 'scale(' + z + ')';
                inner.style.width = (100 / z) + '%';
                inner.style.height = (100 / z) + '%';
                var last = inner.lastElementChild;
                if (last.getBoundingClientRect().bottom <= page.getBoundingClientRect().bottom + 1) break;
                z -= 0.01;
              }
            }
          }
          window.addEventListener('load', fit);
          window.addEventListener('beforeprint', fit);
        })();
        </script>
      </body>
      </html>
      `;
      };

    const applyPreviewZoom = (z) => {
      const clamped = Math.min(2.5, Math.max(0.4, z));
      const body = previewRef.current?.contentDocument?.body;
      if (body) body.style.zoom = clamped;
      setPreviewZoom(clamped);
    };

    // 758px = 7.9in, el ancho real de la hoja
    const fitPreviewToWidth = () => {
      const ifr = previewRef.current;
      if (!ifr) return;
      applyPreviewZoom((ifr.clientWidth - 40) / 758);
    };

    const handlePreviewPDF = () => {
      const html = generatePDFHtml().replace(
        '</head>',
        `<style>
          @media screen {
            html { background: #e2e8f0; }
            body { padding: 20px 0; }
            .page { background: #fff; border: none !important; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,.05), 0 8px 25px rgba(0,0,0,.12); margin: 0 auto 24px !important; }
          }
        </style></head>`
      );
      setPdfHtml(html);
      setShowPreview(true);
    };

    const handleCloseModal = () => setShowPreview(false);

    // Función para descargar el PDF
    const handleDownloadPDF = async () => {
      try {
        toast.loading('Generando PDF...', { id: 'pdf' });
        const pdf = await buildPdf();
        pdf.save(`Acta_Revision_No_${data.numero_acta || '1001'}.pdf`);
        toast.success('PDF descargado', { id: 'pdf' });
      } catch (e) {
        console.error(e);
        toast.error('No se pudo generar el PDF', { id: 'pdf' });
      }
    };

    // Función para imprimir el PDF
    const handlePrintPDF = () => {
      const w = window.open('', '_blank');
      if (!w) {
        toast.error('Permite las ventanas emergentes para imprimir');
        return;
      }
      const title = `ActaRevision No.${data.numero_acta || '1001'}_${new Date().toISOString().slice(0, 10)}`;
      w.document.open();
      w.document.write(generatePDFHtml().replace('</head>', `<title>${title}</title></head>`));
      w.document.close();
      setTimeout(() => { w.focus(); w.print(); }, 500);
    };

const handleOpenEmailModal = () => {
  setIncludeTxtFile(true); // Resetear a true cuando se abre el modal
  setEmailTo(data.correo || '');
  setShowEmailModal(true);
};

// Función para guardar datos en un archivo .txt
const saveDataToTxt = () => {
  // Extraer SOLO los datos (no imágenes)
  const dataToSave = {
    // Información principal
    numero_acta: data.numero_acta,
    ciudad: data.ciudad,
    resultado: data.resultado,
    codigo_suscriptor: data.codigo,
    codigo_asic: data.asic,
    solicitud_numero: data.solicitudNo,
    revision_numero: data.revisionNo,
    
    // Cliente
    nombre: data.nombre,
    direccion: data.direccion,
    
    // Representantes
    otroRepresentante: data.otroRepresentante,
    ccOtroRepresentante: data.ccOtroRepresentante,
    usuarioVisita: data.usuarioVisita,
    documentoVisitante: data.documentoVisitante,
    tipoUsuario: data.tipoUsuario,
    derecho: data.derecho,
    
    // Configuración
    dependencia: data.dependencia,
    contratista: data.contratista,
    
    // Datos generales
    cargaKw: data.cargaKw,
    ciclo: data.ciclo,
    factor1: data.factor1,
    factor2: data.factor2,
    factor3: data.factor3,
    telefono: data.telefono,
    macromedidor: data.macromedidor,
    nodoTrafo: data.nodoTrafo,
    comercializador: data.comercializador,
    longitud: data.longitud,
    latitud: data.latitud,
    uso: data.uso,
    ubicacion: data.ubicacion,
    familias: data.familias,
    nivelTension: data.nivelTension,
    bloquesPrueba: data.bloquesPrueba,
    tipoMedidor: data.tipoMedidor,
    tipoInstalacion: data.tipoInstalacion,
    ubicacionMedidor: data.ubicacionMedidor,
    proteccionGeneral: data.proteccionGeneral,
    acometidaTipo: data.acometidaTipo,
    fh: data.fh,
    acometidaLongitud: data.acometidaLongitud,
    acometidaCalibre: data.acometidaCalibre,
    modemUbicacion: data.modemUbicacion,
    marcaModem: data.marcaModem,
    marcaModemOtro: data.marcaModemOtro,
    serieModem: data.serieModem,
    ipModem: data.ipModem,
    configuracionMedida: data.configuracionMedida,
    tipoMedida: data.tipoMedida,
    marcaCable: data.marcaCable,
    marcaCeldaMedida: data.marcaCeldaMedida,
    
    // Datos de medidores
    numeroActiva1: data.numeroActiva1,
    capacidadActiva1: data.capacidadActiva1,
    tensionActiva1: data.tensionActiva1,
    claseActiva1: data.claseActiva1,
    kdActiva1: data.kdActiva1,
    khActiva1: data.khActiva1,
    lecturaActiva1: data.lecturaActiva1,
    edActiva1: data.edActiva1,
    fechaLabActiva1: data.fechaLabActiva1,
    
    // Agrega aquí todos los demás campos de datos que necesites...
    
    // Observaciones
    observaciones: data.observaciones,
    
    // Adecuaciones
    adecuaciones: data.adecuaciones,
    
    // Informe
    informe: data.informe,
    informeTexto: data.informeTexto,
    tipoInforme: data.tipoInforme,
    tipoInformeOtro: data.tipoInformeOtro,
    
    // Irregularidades
    codigosIrregularidades: data.codigosIrregularidades,
    irregularidadCorrida: data.irregularidadCorrida,
    medidorRetirado: data.medidorRetirado,
    tipoEvidencia: data.tipoEvidencia,
    
    // Datos de pruebas
    tpData: data.tpData,
    tcData: data.tcData,
    factorData: data.factorData,
    
    // Fecha de creación
    fechaCreacion: new Date().toLocaleString('es-ES'),
    usuarioCreacion: userData.name
  };
  
  // Convertir a JSON con formato legible
  const jsonString = JSON.stringify(dataToSave, null, 2);
  
  // Crear un blob y descargar el archivo
  const blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = `datos_acta_${data.numero_acta || 'sin_numero'}_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Mostrar mensaje de éxito
  toast.success('✅ Datos guardados en archivo .txt exitosamente');
};

// Dentro del componente Summary, agrega esta función
const getEstadoText = (estado) => {
  const estadoMap = {
    'PR': 'Provisional',
    'VE': 'Venta',
    'TE': 'Usuario',
    'RE': 'Reutilizado',
    'FI': 'Financiado',
    'EA': 'Entregado al usuario',
    'BC': 'Bodega Contratista',
    'BE': 'Bodega',
    'EMSA': 'EMSA - PR'
  };
  return estadoMap[estado] || estado || 'No seleccionado';
};

const getEstadoClass = (estado) => {
  const classMap = {
    'PR': 'estadoPR',
    'VE': 'estadoVE',
    'TE': 'estadoTE',
    'RE': 'estadoRE',
    'FI': 'estadoFI',
    'EA': 'estadoEA',
    'BC': 'estadoBC',
    'BE': 'estadoBE',
    'EMSA': 'estadoEMSA'
  };
  return classMap[estado] || '';
};

  return (
    <div className={styles.container}>
      <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4CAF50',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#e74c3c',
                    secondary: '#fff',
                  },
                },
              }}
            />
      <div className={styles.header}>
        <h1 className={styles.title}>Resumen del Acta de Revisión</h1>
        <p className={styles.subtitle}>Revise toda la información antes de finalizar</p>
      </div>

      <div className={styles.summaryGrid}>
      {/* Sección: Información Principal */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📋 Información Principal</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número de Acta:</span>
              <span className={styles.value}>{data.numero_acta || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ciudad:</span>
              <span className={styles.value}>{data.ciudad || 'No especificada'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Resultado:</span>
              <span className={styles.value}>{data.resultado || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Solicitud No:</span>
              <span className={styles.value}>{data.solicitudNo || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Código Suscriptor:</span>
              <span className={styles.value}>{data.codigo || 'No ingresado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Código ASIC:</span>
              <span className={styles.value}>{data.asic || 'No ingresado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Revisión No:</span>
              <span className={styles.value}>{data.revisionNo || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Dependencia:</span>
              <span className={styles.value}>{data.dependencia || 'No especificada'}</span>
            </div>
          </div>
          
          {/* Columna 3 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Contratista:</span>
              <span className={styles.value}>{data.contratista || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Item Pago 1:</span>
              <span className={styles.value}>{data.itemPago || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Item Pago 2:</span>
              <span className={styles.value}>{data.itemPago2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Item Pago 3:</span>
              <span className={styles.value}>{data.itemPago3 || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Datos del Cliente */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🏢 Datos del Cliente</h2>
        
        <div className={styles.threeColumns}>
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Nombre del cliente:</span>
              <span className={styles.value}>{data.nombre || 'No especificado'}</span>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Dirección:</span>
              <span className={styles.value}>{data.direccion || 'No especificada'}</span>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Uso de Derecho:</span>
              <span className={styles.value}>{data.derecho || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Representantes y Usuarios */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>👥 Representantes y Usuarios</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - Representantes EMSA */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Representante EMSA:</span>
              <span className={styles.value}>{userData.name || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>C.C. EMSA:</span>
              <span className={styles.value}>{userData.cc || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Otro Representante:</span>
              <span className={styles.value}>{data.otroRepresentante || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Doc. Representante:</span>
              <span className={styles.value}>{data.ccOtroRepresentante || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - Usuario Visitado */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Usuario que recibe:</span>
              <span className={styles.value}>{data.usuarioVisita || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Doc. Visitante:</span>
              <span className={styles.value}>{data.documentoVisitante || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo de Usuario:</span>
              <span className={styles.value}>{data.tipoUsuario || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Fecha y Hora (generados automáticamente) */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>{new Date().toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Hora:</span>
              <span className={styles.value}>{new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Mes:</span>
              <span className={styles.value}>{new Date().toLocaleString('es-ES', { month: 'long' })}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Año:</span>
              <span className={styles.value}>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Texto Generado (OCUPA TODO EL ANCHO) */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📝 Texto Generado</h2>
        
        <div className={styles.fullWidthSection}>
          <div className={styles.generatedText}>
                <p>
                  A los <strong>{new Date().getDate()}</strong> días del mes de <strong>{new Date().toLocaleString('es-ES', { month: 'long' })}</strong> del <strong>{new Date().getFullYear()}</strong>, 
                  siendo las <strong>{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong> se hacen presentes en el inmueble 
                  de la dirección <strong>{data.direccion || '______'}</strong> los representantes de EMSA ESP <strong>{userData.name || '______'}</strong> con C.C: <strong>{userData.cc || '______'}</strong> y <strong>{data.otroRepresentante || '______'}</strong> con
                  C.C: <strong>{data.ccOtroRepresentante || '______'}</strong> en presencia del señor(a) <strong>{data.usuarioVisita || '______'}</strong> con <strong>{data.documentoVisitante || '______'}</strong> calidad de <strong>{data.tipoUsuario ? capitalize(data.tipoUsuario) : '______'}</strong> con el fin de efectuar 
                  una revisión de los equipos de medida e instalaciones del inmueble con el código indicado.
                  Habiéndose identificado los empleados y/o contratistas informan al usuario que de acuerdo 
                  al Contrato de Servicios Públicos con Condiciones Uniformes vigente su derecho a solicitar 
                  asesoría y/o participación de un técnico particular, o de cualquier persona para que sirva 
                  de testigo en el proceso de revisión. Sin embargo, si transcurre un plazo máximo de 15 minutos 
                  sin hacerse presente se hará la revisión sin su presencia. El cliente/usuario hace uso de su derecho: <strong>SÍ ({data.derecho === 'SI' ? 'X' : ' '})</strong> <strong>NO ({data.derecho === 'NO' ? 'X' : ' '})</strong>. Transcurrido ese tiempo, se procede a hacer la revisión.
                </p>
          </div>
        </div>
      </div>
    </div>

      {/* Sección: Información General del Cliente */}
      <div className={styles.summaryGrid}>
      {/* Sección: Datos Generales */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📊 Datos Generales</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Nombre:</span>
              <span className={styles.value}>{data.nombre || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Dirección:</span>
              <span className={styles.value}>{data.direccion || 'No especificada'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Carga Kw:</span>
              <span className={styles.value}>{data.cargaKw || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ciclo:</span>
              <span className={styles.value}>{data.ciclo || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Factor 1:</span>
              <span className={styles.value}>{data.factor1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Factor 2:</span>
              <span className={styles.value}>{data.factor2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Factor 3:</span>
              <span className={styles.value}>{data.factor3 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Teléfono:</span>
              <span className={styles.value}>{data.telefono || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Macromedidor:</span>
              <span className={styles.value}>{data.macromedidor || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Nodo Trafo:</span>
              <span className={styles.value}>{data.nodoTrafo || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Comercializador:</span>
              <span className={styles.value}>{data.comercializador || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Longitud:</span>
              <span className={styles.value}>{data.longitud || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Latitud:</span>
              <span className={styles.value}>{data.latitud || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Uso:</span>
              <span className={styles.value}>{data.uso || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ubicación:</span>
              <span className={styles.value}>{data.ubicacion || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Familias:</span>
              <span className={styles.value}>{data.familias || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Nivel Tensión:</span>
              <span className={styles.value}>{data.nivelTension || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Bloques Prueba:</span>
              <span className={styles.value}>{data.bloquesPrueba || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo Medidor:</span>
              <span className={styles.value}>{data.tipoMedidor || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo Instalación:</span>
              <span className={styles.value}>{data.tipoInstalacion || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ubicación Medidor:</span>
              <span className={styles.value}>{data.ubicacionMedidor || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Protección General:</span>
              <span className={styles.value}>{data.proteccionGeneral || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo Acometida:</span>
              <span className={styles.value}>{data.acometidaTipo || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>#F #H:</span>
              <span className={styles.value}>{data.fh || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Acometida y Medidor */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔌 Acometida y Medidor</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Longitud Acometida:</span>
              <span className={styles.value}>{data.acometidaLongitud || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Calibre Acometida:</span>
              <span className={styles.value}>{data.acometidaCalibre || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ubicación Modem:</span>
              <span className={styles.value}>{data.modemUbicacion || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Configuración Medida:</span>
              <span className={styles.value}>{data.configuracionMedida || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo de Medida:</span>
              <span className={styles.value}>{data.tipoMedida || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca Modem:</span>
              <span className={styles.value}>{data.marcaModem || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca Modem (Otro):</span>
              <span className={styles.value}>{data.marcaModemOtro || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Serie Modem:</span>
              <span className={styles.value}>{data.serieModem || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>IP Modem:</span>
              <span className={styles.value}>{data.ipModem || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca Cable:</span>
              <span className={styles.value}>{data.marcaCable || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca Celda Medida:</span>
              <span className={styles.value}>{data.marcaCeldaMedida || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Activa1:</span>
              <span className={styles.value}>{data.numeroActiva1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Activa1:</span>
              <span className={styles.value}>{data.lecturaActiva1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Activa2:</span>
              <span className={styles.value}>{data.numeroActiva2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Activa2:</span>
              <span className={styles.value}>{data.lecturaActiva2 || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Medidores Reactivos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Medidores Reactivos</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Reactiva1:</span>
              <span className={styles.value}>{data.numeroReactiva1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Reactiva1:</span>
              <span className={styles.value}>{data.lecturaReactiva1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Reactiva2:</span>
              <span className={styles.value}>{data.numeroReactiva2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Reactiva2:</span>
              <span className={styles.value}>{data.lecturaReactiva2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número ActivaIns1:</span>
              <span className={styles.value}>{data.numeroActivaIns1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura ActivaIns1:</span>
              <span className={styles.value}>{data.lecturaActivaIns1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número ActivaIns2:</span>
              <span className={styles.value}>{data.numeroActivaIns2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura ActivaIns2:</span>
              <span className={styles.value}>{data.lecturaActivaIns2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número ReactivaIns1:</span>
              <span className={styles.value}>{data.numeroReactivaIns1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura ReactivaIns1:</span>
              <span className={styles.value}>{data.lecturaReactivaIns1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número ReactivaIns2:</span>
              <span className={styles.value}>{data.numeroReactivaIns2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura ReactivaIns2:</span>
              <span className={styles.value}>{data.lecturaReactivaIns2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Transformador:</span>
              <span className={styles.value}>{data.transformadorPoNumero || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca Transformador:</span>
              <span className={styles.value}>{data.transformadorPoMarca || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>kVA Transformador:</span>
              <span className={styles.value}>{data.transformadorPoKva || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Transformador */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔋 Transformador de Potencia</h2>
        
        <div className={styles.threeColumns}>
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Año Transformador:</span>
              <span className={styles.value}>{data.transformadorPoAno || 'No especificado'}</span>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>V1/V2:</span>
              <span className={styles.value}>{data.transformadorPoV1V2 || 'No especificado'}</span>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Propietario:</span>
              <span className={styles.value}>{data.transformadorPoPropietario || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Circuito:</span>
              <span className={styles.value}>{data.transformadorPoCircuito || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

          <div className={styles.summaryGrid}>
      {/* Sección: Medición Activa */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Medición Activa</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - Tapa Principal Encontrados */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Tapa Principal (Encontrados)</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.medActivaTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.medActivaNum1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.medActivaE1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.medActivaR1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - Tapa Principal Instalados */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Tapa Principal (Instalados)</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Color 1:</span>
              <span className={styles.value}>{data.medActivaInstTipoColor1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Inst 1:</span>
              <span className={styles.value}>{data.medActivaInstNum1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 2:</span>
              <span className={styles.value}>{data.medActivaTipoCol2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 2:</span>
              <span className={styles.value}>{data.medActivaNum2 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Tapa Bornera */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Tapa Bornera Activa</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.tapaBorneraActivaTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.tapaBorneraActivaNum1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.tapaBorneraActivaE1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.tapaBorneraActivaR1 || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Medición Reactiva */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔋 Medición Reactiva</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - Tapa Principal Reactiva */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Tapa Principal (Encontrados)</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.medReactivaTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.medReactivaNum1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.medReactivaE1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.medReactivaR1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - Tapa Principal Instalados Reactiva */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Tapa Principal (Instalados)</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Color 1:</span>
              <span className={styles.value}>{data.medReactivaInstTipoColor1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Inst 1:</span>
              <span className={styles.value}>{data.medReactivaInstNum1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 2:</span>
              <span className={styles.value}>{data.medReactivaTipoCol2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 2:</span>
              <span className={styles.value}>{data.medReactivaNum2 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Tapa Bornera Reactiva */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Tapa Bornera Reactiva</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.tapaBorneraReactivaTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.tapaBorneraReactivaNum1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.tapaBorneraReactivaE1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.tapaBorneraReactivaR1 || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Bloque de Pruebas */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔬 Bloque de Pruebas</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.bloquePruebasTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.bloquePruebasNum1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.bloquePruebasE1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.bloquePruebasR1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Color Inst 1:</span>
              <span className={styles.value}>{data.bloquePruebasInstTipoColor1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número Inst 1:</span>
              <span className={styles.value}>{data.bloquePruebasInstNum1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 2:</span>
              <span className={styles.value}>{data.bloquePruebasTipoCol2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 2:</span>
              <span className={styles.value}>{data.bloquePruebasNum2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E2:</span>
              <span className={styles.value}>{data.bloquePruebasE2 || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: TC's, TP's y Celda */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔩 TC's, TP's y Celda</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - TC's */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>TC's</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.tcsTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.tcsNumero1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.tcsE1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.tcsR1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - TP's */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>TP's</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.tpsTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.tpsNumero1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.tpsE1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.tpsR1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Celda de Medida */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Celda de Medida</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo/Col 1:</span>
              <span className={styles.value}>{data.celdaTipoCol1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número 1:</span>
              <span className={styles.value}>{data.celdaNumero1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>E1:</span>
              <span className={styles.value}>{data.celdaE1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>R1:</span>
              <span className={styles.value}>{data.celdaR1 || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Medidor Activa - Cálculos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📐 Medidor Activa - Cálculos</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - Fase R */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Fase R</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tensión R (V):</span>
              <span className={styles.value}>{data.activaTensionR || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Corriente R (A):</span>
              <span className={styles.value}>{data.activaCorrienteR || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>P.Inst R (W):</span>
              <span className={styles.value}>{data.activaPinstR || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - Fase S */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Fase S</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tensión S (V):</span>
              <span className={styles.value}>{data.activaTensionS || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Corriente S (A):</span>
              <span className={styles.value}>{data.activaCorrienteS || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>P.Inst S (W):</span>
              <span className={styles.value}>{data.activaPinstS || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Fase T */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Fase T</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tensión T (V):</span>
              <span className={styles.value}>{data.activaTensionT || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Corriente T (A):</span>
              <span className={styles.value}>{data.activaCorrienteT || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>P.Inst T (W):</span>
              <span className={styles.value}>{data.activaPinstT || 'No especificado'}</span>
            </div>
          </div>
        </div>
        
        {/* Totales Activa */}
        <div className={styles.totalesSection}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Tensión Total (V):</span>
            <span className={styles.value}>{data.activaTensionTotal || 'No especificado'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Corriente Total (A):</span>
            <span className={styles.value}>{data.activaCorrienteTotal || 'No especificado'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>P.Inst Total (W):</span>
            <span className={styles.value}>{data.activaPinstTotal || 'No especificado'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>% Error Activa:</span>
            <span className={styles.value}>{data.activaPorcentajeError || 'No especificado'}</span>
          </div>
        </div>
      </div>

      {/* Sección: Medidor Reactiva - Cálculos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📏 Medidor Reactiva - Cálculos</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - Fase R */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Fase R</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tensión R (V):</span>
              <span className={styles.value}>{data.reactivaTensionR || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Corriente R (A):</span>
              <span className={styles.value}>{data.reactivaCorrienteR || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>P.Inst R (W):</span>
              <span className={styles.value}>{data.reactivaPinstR || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - Fase S */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Fase S</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tensión S (V):</span>
              <span className={styles.value}>{data.reactivaTensionS || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Corriente S (A):</span>
              <span className={styles.value}>{data.reactivaCorrienteS || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>P.Inst S (W):</span>
              <span className={styles.value}>{data.reactivaPinstS || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Fase T */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Fase T</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tensión T (V):</span>
              <span className={styles.value}>{data.reactivaTensionT || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Corriente T (A):</span>
              <span className={styles.value}>{data.reactivaCorrienteT || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>P.Inst T (W):</span>
              <span className={styles.value}>{data.reactivaPinstT || 'No especificado'}</span>
            </div>
          </div>
        </div>
        
        {/* Totales Reactiva */}
        <div className={styles.totalesSection}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Tensión Total (V):</span>
            <span className={styles.value}>{data.reactivaTensionTotal || 'No especificado'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Corriente Total (A):</span>
            <span className={styles.value}>{data.reactivaCorrienteTotal || 'No especificado'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>P.Inst Total (W):</span>
            <span className={styles.value}>{data.reactivaPinstTotal || 'No especificado'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>% Error Reactiva:</span>
            <span className={styles.value}>{data.reactivaPorcentajeError || 'No especificado'}</span>
          </div>
        </div>
      </div>

      {/* Sección: Pruebas de Funcionamiento */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>✅ Pruebas de Funcionamiento</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - Activa */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Medidor Activa</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Conexiones:</span>
              <span className={styles.value}>{data.activaConexiones || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Continuidad:</span>
              <span className={styles.value}>{data.activaContinuidad || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Puentes:</span>
              <span className={styles.value}>{data.activaPuentes || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Giro en vacío:</span>
              <span className={styles.value}>{data.activaGiroVacio || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - Reactiva */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Medidor Reactiva</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Conexiones:</span>
              <span className={styles.value}>{data.reactivaConexiones || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Continuidad:</span>
              <span className={styles.value}>{data.reactivaContinuidad || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Puentes:</span>
              <span className={styles.value}>{data.reactivaPuentes || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Giro en vacío:</span>
              <span className={styles.value}>{data.reactivaGiroVacio || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Pruebas Integración */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Pruebas de Integración</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Inicial Activa:</span>
              <span className={styles.value}>{data.activaLecturaInicial || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Final Activa:</span>
              <span className={styles.value}>{data.activaLecturaFinal || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>% Error Pruebas Activa:</span>
              <span className={styles.value}>{data.activaPorcentajeErrorPruebas || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Inicial Reactiva:</span>
              <span className={styles.value}>{data.reactivaLecturaInicial || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Lectura Final Reactiva:</span>
              <span className={styles.value}>{data.reactivaLecturaFinal || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>% Error Pruebas Reactiva:</span>
              <span className={styles.value}>{data.reactivaPorcentajeErrorPruebas || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Transformadores */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔌 Transformadores</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 - TC's */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>TC's (Encontrados)</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca 1:</span>
              <span className={styles.value}>{data.tcMarca1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Series 1:</span>
              <span className={styles.value}>{data.tcSeries1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Relación 1:</span>
              <span className={styles.value}>{data.tcRelacion1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Clase 1:</span>
              <span className={styles.value}>{data.tcClase1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 - TP's */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>TP's (Encontrados)</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca 1:</span>
              <span className={styles.value}>{data.tpMarca1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Series 1:</span>
              <span className={styles.value}>{data.tpSeries1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Relación 1:</span>
              <span className={styles.value}>{data.tpRelacion1 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Clase 1:</span>
              <span className={styles.value}>{data.tpClase1 || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 3 - Especificaciones Adicionales */}
          <div className={styles.column}>
            <div className={styles.sectionSubtitle}>Especificaciones</div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca TC 2:</span>
              <span className={styles.value}>{data.tcMarca2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca TP 2:</span>
              <span className={styles.value}>{data.tpMarca2 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca TC 3:</span>
              <span className={styles.value}>{data.tcMarca3 || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Marca TP 3:</span>
              <span className={styles.value}>{data.tpMarca3 || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Evidencias e Informe */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📋 Evidencias e Informe</h2>
        
        <div className={styles.threeColumns}>
          {/* Columna 1 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Códigos Irregularidades:</span>
              <span className={styles.value}>{data.codigosIrregularidades || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo de Evidencia:</span>
              <span className={styles.value}>{data.tipoEvidencia || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Irregularidad Corregida:</span>
              <span className={styles.value}>{data.irregularidadCorrida || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Columna 2 */}
          <div className={styles.column}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Medidor Retirado:</span>
              <span className={styles.value}>{data.medidorRetirado || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo de Informe:</span>
              <span className={styles.value}>{getTipoInformeText()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
        
      
      {/* Sección de Diagramas y Configuración */}
      <div className={styles.summaryGrid}>
        
        {/* Diagramas */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📊 Diagramas Seleccionados</h2>
          
          <div className={styles.threeColumns}>
            {/* Columna 1 - Diagrama Unifilar */}
            <div className={styles.column}>
              <div className={styles.diagramItem}>
                <h3 className={styles.diagramTitle}>Diagrama Unifilar</h3>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Selección:</span>
                  <span className={styles.value}>{diagramaUnifilar ? getDiagramName(diagramaUnifilar) : 'No seleccionado'}</span>
                </div>
                {diagramImages.diagramaUnifilar ? (
                  <div className={styles.diagramImageContainer}>
                    <img 
                      src={diagramImages.diagramaUnifilar} 
                      alt="Diagrama Unifilar" 
                      className={styles.diagramImage}
                    />
                  </div>
                ) : (
                  <div className={styles.diagramMissing}>
                    <span className={styles.missingText}>Diagrama no disponible</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Columna 2 - Diagrama Fasorial */}
            <div className={styles.column}>
              <div className={styles.diagramItem}>
                <h3 className={styles.diagramTitle}>Diagrama Fasorial</h3>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Selección:</span>
                  <span className={styles.value}>{diagramaFasorial ? getDiagramName(diagramaFasorial) : 'No seleccionado'}</span>
                </div>
                {diagramImages.diagramaFasorial ? (
                  <div className={styles.diagramImageContainer}>
                    <img 
                      src={diagramImages.diagramaFasorial} 
                      alt="Diagrama Fasorial" 
                      className={styles.diagramImage}
                    />
                  </div>
                ) : (
                  <div className={styles.diagramMissing}>
                    <span className={styles.missingText}>Diagrama no disponible</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Columna 3 - Diagrama de Conexiones */}
            <div className={styles.column}>
              <div className={styles.diagramItem}>
                <h3 className={styles.diagramTitle}>Diagrama de Conexiones</h3>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Selección:</span>
                  <span className={styles.value}>{diagramaConexiones ? getDiagramName(diagramaConexiones) : 'No seleccionado'}</span>
                </div>
                {diagramImages.diagramaConexiones ? (
                  <div className={styles.diagramImageContainer}>
                    <img 
                      src={diagramImages.diagramaConexiones} 
                      alt="Diagrama de Conexiones" 
                      className={styles.diagramImage}
                    />
                  </div>
                ) : (
                  <div className={styles.diagramMissing}>
                    <span className={styles.missingText}>Diagrama no disponible</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Configuración de Línea */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>⚡ Configuración de Línea</h2>
          
          <div className={styles.threeColumns}>
            <div className={styles.column}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Línea Dedicada:</span>
                <span className={styles.value}>{lineaDedicada || 'No especificado'}</span>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Tipo de Frontera:</span>
                <span className={styles.value}>{tipoFrontera || 'No especificado'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pruebas TP's */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🔌 Pruebas TP's</h2>
          
          <div className={styles.threeColumns}>
            {/* Columna 1 - V_R */}
            <div className={styles.column}>
              <div className={styles.sectionSubtitle}>Voltaje R</div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Primario (V):</span>
                <span className={styles.value}>{tpData.vRPrimario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Secundario (V):</span>
                <span className={styles.value}>{tpData.vRSecundario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>% Error:</span>
                <span className={styles.value}>{tpData.errorVR || '-'}</span>
              </div>
            </div>
            
            {/* Columna 2 - V_S */}
            <div className={styles.column}>
              <div className={styles.sectionSubtitle}>Voltaje S</div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Primario (V):</span>
                <span className={styles.value}>{tpData.vSPrimario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Secundario (V):</span>
                <span className={styles.value}>{tpData.vSSecundario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>% Error:</span>
                <span className={styles.value}>{tpData.errorVS || '-'}</span>
              </div>
            </div>
            
            {/* Columna 3 - V_T */}
            <div className={styles.column}>
              <div className={styles.sectionSubtitle}>Voltaje T</div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Primario (V):</span>
                <span className={styles.value}>{tpData.vTPrimario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Secundario (V):</span>
                <span className={styles.value}>{tpData.vTSecundario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>% Error:</span>
                <span className={styles.value}>{tpData.errorVT || '-'}</span>
              </div>
            </div>
          </div>
          
          {/* Totales TP's */}
          <div className={styles.totalesSection}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>RTP:</span>
              <span className={styles.value}>{tpData.rtp || '-'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>% Error Promedio:</span>
              <span className={styles.value}>{tpData.errorPromedio || '-'}</span>
            </div>
          </div>
        </div>

        {/* Pruebas TC's */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>⚡ Pruebas TC's</h2>
          
          <div className={styles.threeColumns}>
            {/* Columna 1 - I_R */}
            <div className={styles.column}>
              <div className={styles.sectionSubtitle}>Corriente R</div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Primario (A):</span>
                <span className={styles.value}>{tcData.vRPrimario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Secundario (A):</span>
                <span className={styles.value}>{tcData.vRSecundario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>% Error:</span>
                <span className={styles.value}>{tcData.errorVR || '-'}</span>
              </div>
            </div>
            
            {/* Columna 2 - I_S */}
            <div className={styles.column}>
              <div className={styles.sectionSubtitle}>Corriente S</div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Primario (A):</span>
                <span className={styles.value}>{tcData.vSPrimario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Secundario (A):</span>
                <span className={styles.value}>{tcData.vSSecundario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>% Error:</span>
                <span className={styles.value}>{tcData.errorVS || '-'}</span>
              </div>
            </div>
            
            {/* Columna 3 - I_T */}
            <div className={styles.column}>
              <div className={styles.sectionSubtitle}>Corriente T</div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Primario (A):</span>
                <span className={styles.value}>{tcData.vTPrimario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Secundario (A):</span>
                <span className={styles.value}>{tcData.vTSecundario || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>% Error:</span>
                <span className={styles.value}>{tcData.errorVT || '-'}</span>
              </div>
            </div>
          </div>
          
          {/* Totales TC's */}
          <div className={styles.totalesSection}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>RTC:</span>
              <span className={styles.value}>{tcData.rtc || '-'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>% Error Promedio:</span>
              <span className={styles.value}>{tcData.errorPromedio || '-'}</span>
            </div>
          </div>
        </div>

        {/* Factor SIEC */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📈 Factor SIEC</h2>
          
          <div className={styles.threeColumns}>
            <div className={styles.column}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Factor SIEC:</span>
                <span className={styles.value}>{factorData.factorSiec || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Factor Encontrado:</span>
                <span className={styles.value}>{factorData.factorEncontrado || '-'}</span>
              </div>
            </div>
            
            <div className={styles.column}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>% Error de Factor:</span>
                <span className={styles.value}>{factorData.errorFactor || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Factor Final:</span>
                <span className={styles.value}>{factorData.factorFinal || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>👀 Observaciones</h2>
          
          <div className={styles.threeColumns}>
            {/* Organizar las observaciones en 3 columnas */}
            {(() => {
              const entries = Object.entries(observaciones).filter(([_, estado]) => estado);
              const columnCount = 3;
              const itemsPerColumn = Math.ceil(entries.length / columnCount);
              
              return Array.from({ length: columnCount }).map((_, colIndex) => (
                <div key={colIndex} className={styles.column}>
                  {entries
                    .slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
                    .map(([equipo, estado]) => (
                      <div key={equipo} className={styles.summaryItem}>
                        <span className={styles.label}>{equipo}:</span>
                        <span className={`${styles.value} ${styles[estado.toLowerCase()]}`}>
                          {estado}
                        </span>
                      </div>
                    ))}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Adecuaciones */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🔧 Adecuaciones</h2>
          
          <div className={styles.threeColumns}>
            {/* Organizar las adecuaciones en 3 columnas */}
            {(() => {
              const adecuacionesList = getAdecuacionesSeleccionadas();
              if (adecuaciones.otros && adecuaciones.otrosTexto) {
                adecuacionesList.push(`Otros: ${adecuaciones.otrosTexto}`);
              }
              
              const columnCount = 3;
              const itemsPerColumn = Math.ceil(adecuacionesList.length / columnCount);
              
              return Array.from({ length: columnCount }).map((_, colIndex) => (
                <div key={colIndex} className={styles.column}>
                  {adecuacionesList
                    .slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
                    .map((adecuacion, index) => (
                      <div key={index} className={styles.adecuacionItem}>
                        • {adecuacion}
                      </div>
                    ))}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Informe */}
        {informe && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📝 Informe</h2>
            <div className={styles.fullWidthSection}>
              <div className={styles.informeContent}>
                <p>{getInformeDisplayText()}</p>
              </div>
            </div>
          </div>
        )}
      </div>  

      {/* Sección: Materiales Eléctricos */}
      {data.materiales && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🔧 Materiales Eléctricos</h2>
          
          {/* Medidores */}
          <h3 className={styles.sectionSubtitle}>Medidores</h3>
          <div className={styles.materialesGrid}>
            {/* Medidor Electromecánico */}
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Medidor Electromecánico</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.medidorElectroMecanico?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.medidorElectroMecanico?.estado)]}`}>
                  {getEstadoText(data.materiales.medidorElectroMecanico?.estado)}
                </span>
              </div>
              {data.materiales.medidorElectroMecanico?.especificaciones && (
                <>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Fasico:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectroMecanico.especificaciones.fasico || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Fases/F:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectroMecanico.especificaciones.fases || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Hilos/H:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectroMecanico.especificaciones.hilos || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Amperios (A):</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectroMecanico.especificaciones.amperios || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Voltios (V):</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectroMecanico.especificaciones.voltios || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Clase:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectroMecanico.especificaciones.clase || '-'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Medidor Electrónico Regis */}
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Medidor Electrónico (Registrador Ciclométrico)</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.medidorElectronicoRegis?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.medidorElectronicoRegis?.estado)]}`}>
                  {getEstadoText(data.materiales.medidorElectronicoRegis?.estado)}
                </span>
              </div>
              {data.materiales.medidorElectronicoRegis?.especificaciones && (
                <>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Tipo:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoRegis.especificaciones.tipo || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Amperios (A):</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoRegis.especificaciones.amperios || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Voltios (V):</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoRegis.especificaciones.voltios || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Clase:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoRegis.especificaciones.clase || '-'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Medidor Electrónico Display */}
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Medidor Electrónico con Display</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.medidorElectronicoDisplay?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.medidorElectronicoDisplay?.estado)]}`}>
                  {getEstadoText(data.materiales.medidorElectronicoDisplay?.estado)}
                </span>
              </div>
              {data.materiales.medidorElectronicoDisplay?.especificaciones && (
                <>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Tipo:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoDisplay.especificaciones.tipo || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Amperios (A):</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoDisplay.especificaciones.amperios || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Voltios (V):</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoDisplay.especificaciones.voltios || '-'}</span>
                  </div>
                  <div className={styles.materialRow}>
                    <span className={styles.materialLabel}>Clase:</span>
                    <span className={styles.materialValue}>{data.materiales.medidorElectronicoDisplay.especificaciones.clase || '-'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Protecciones y Herrajes */}
          <h3 className={styles.sectionSubtitle} style={{ marginTop: '24px' }}>Protecciones y Herrajes</h3>
          <div className={styles.materialesGrid}>
            {/* Cinta Bandit */}
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Cinta Bandit</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Medida:</span>
                <span className={styles.materialValue}>{data.materiales.cintaBandit?.medida || '-'}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.cintaBandit?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.cintaBandit?.estado)]}`}>
                  {getEstadoText(data.materiales.cintaBandit?.estado)}
                </span>
              </div>
            </div>

            {/* Grapa Hebilla */}
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Grapa Hebilla</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Medida:</span>
                <span className={styles.materialValue}>{data.materiales.grapaHebilla?.medida || '-'}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.grapaHebilla?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.grapaHebilla?.estado)]}`}>
                  {getEstadoText(data.materiales.grapaHebilla?.estado)}
                </span>
              </div>
            </div>

            {/* Capacete */}
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Capacete</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Medida:</span>
                <span className={styles.materialValue}>{data.materiales.capacete?.medida || '-'}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.capacete?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.capacete?.estado)]}`}>
                  {getEstadoText(data.materiales.capacete?.estado)}
                </span>
              </div>
            </div>

            {/* Conector Curvo */}
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Conector Curvo</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Medida:</span>
                <span className={styles.materialValue}>{data.materiales.conectorCurvo?.medida || '-'}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.conectorCurvo?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.conectorCurvo?.estado)]}`}>
                  {getEstadoText(data.materiales.conectorCurvo?.estado)}
                </span>
              </div>
            </div>
          </div>

          {/* Sellos */}
          <h3 className={styles.sectionSubtitle} style={{ marginTop: '24px' }}>Sellos</h3>
          <div className={styles.materialesGrid}>
            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Rotoseal</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Color:</span>
                <span className={styles.materialValue}>{data.materiales.rotoseal?.color || '-'}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.rotoseal?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.rotoseal?.estado)]}`}>
                  {getEstadoText(data.materiales.rotoseal?.estado)}
                </span>
              </div>
            </div>

            <div className={styles.materialCard}>
              <div className={styles.materialTitle}>Estampilla</div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Cantidad:</span>
                <span className={styles.materialValue}>{data.materiales.estampilla?.cantidad || 0}</span>
              </div>
              <div className={styles.materialRow}>
                <span className={styles.materialLabel}>Estado:</span>
                <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.estampilla?.estado)]}`}>
                  {getEstadoText(data.materiales.estampilla?.estado)}
                </span>
              </div>
            </div>
          </div>

          {/* Material Retirado */}
          {data.materiales.materialRetirado && (data.materiales.materialRetirado.descripcion || data.materiales.materialRetirado.cantidad > 0) && (
            <>
              <h3 className={styles.sectionSubtitle} style={{ marginTop: '24px' }}>Material Retirado</h3>
              <div className={styles.materialCard}>
                <div className={styles.materialTitle}>Material Retirado</div>
                <div className={styles.materialRow}>
                  <span className={styles.materialLabel}>Descripción:</span>
                  <span className={styles.materialValue}>{data.materiales.materialRetirado?.descripcion || '-'}</span>
                </div>
                <div className={styles.materialRow}>
                  <span className={styles.materialLabel}>Cantidad:</span>
                  <span className={styles.materialValue}>{data.materiales.materialRetirado?.cantidad || 0}</span>
                </div>
                <div className={styles.materialRow}>
                  <span className={styles.materialLabel}>Estado:</span>
                  <span className={`${styles.estadoBadge} ${styles[getEstadoClass(data.materiales.materialRetirado?.estado)]}`}>
                    {getEstadoText(data.materiales.materialRetirado?.estado)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Sección: Medidor Instalado */}
      {(data.medidor_numero || data.medidor_marca || data.medidor_fases || data.medidor_lectura) && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📟 Medidor Instalado</h2>
          <div className={styles.threeColumns}>
            <div className={styles.column}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Número:</span>
                <span className={styles.value}>{data.medidor_numero || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Marca:</span>
                <span className={styles.value}>{data.medidor_marca || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Fases:</span>
                <span className={styles.value}>{data.medidor_fases || '-'}</span>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Dígitos:</span>
                <span className={styles.value}>{data.medidor_digitos || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Lectura:</span>
                <span className={styles.value}>{data.medidor_lectura || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Voltios:</span>
                <span className={styles.value}>{data.medidor_voltios || '-'}</span>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Amperios:</span>
                <span className={styles.value}>{data.medidor_amperios || '-'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Color Sello:</span>
                <span className={styles.value}>{data.sello_color || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Firmas actas*/}
      <div className={styles.section}>
      <h2 className={styles.sectionTitle}>✍️ Firmas del Acta</h2>
      <div className={styles.signaturesContainer}>
        {/* Firma Funcionario */}
        <div className={styles.signatureItem}>
          <h3 className={styles.signatureTitle}>Funcionario Responsable</h3>
          <div className={styles.signatureDetails}>
            <p><strong>Nombre:</strong> {userData.name || 'No especificado'}</p>
            <p><strong>Documento:</strong> {userData.cc || 'No especificado'}</p>
          </div>
          {signatures.firmaFuncionario ? (
            <div className={styles.signatureImageContainer}>
              <img 
                src={signatures.firmaFuncionario} 
                alt="Firma Funcionario" 
                className={styles.signatureImage}
              />
              <p className={styles.signatureDate}>Firmado el: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          ) : (
            <div className={styles.signatureMissing}>
              <span className={styles.missingText}>Firma no disponible</span>
            </div>
          )}
        </div>

        {/* Firma Suscriptor */}
        <div className={styles.signatureItem}>
          <h3 className={styles.signatureTitle}>Suscriptor o Usuario</h3>
          <div className={styles.signatureDetails}>
            <p><strong>Nombre:</strong> {data.usuarioVisita || 'No especificado'}</p>
            <p><strong>Documento:</strong> {data.documentoVisitante || 'No especificado'}</p>
          </div>
          {signatures.firmaSuscriptor ? (
            <div className={styles.signatureImageContainer}>
              <img 
                src={signatures.firmaSuscriptor} 
                alt="Firma Suscriptor" 
                className={styles.signatureImage}
              />
              <p className={styles.signatureDate}>Firmado el: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          ) : (
            <div className={styles.signatureMissing}>
              <span className={styles.missingText}>Firma no disponible</span>
            </div>
          )}
        </div>

        {/* Firma Supervisor */}
        <div className={styles.signatureItem}>
          <h3 className={styles.signatureTitle}>Testigo</h3>
          <div className={styles.signatureDetails}>
            <p><strong>Nombre:</strong> {data.otroRepresentante || 'No especificado'}</p>
            <p><strong>Documento:</strong> {data.ccOtroRepresentante || 'No especificado'}</p>
          </div>
          {signatures.firmaSupervisor ? (
            <div className={styles.signatureImageContainer}>
              <img 
                src={signatures.firmaSupervisor} 
                alt="Firma Supervisor" 
                className={styles.signatureImage}
              />
              <p className={styles.signatureDate}>Firmado el: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          ) : (
            <div className={styles.signatureMissing}>
              <span className={styles.missingText}>Firma no disponible</span>
            </div>
          )}
        </div>
      </div>
    </div>

      <div className={styles.buttonGroup}>
        <button 
          type="button" 
          onClick={prevStep}
          className={styles.secondaryButton}
        >
          <FiArrowLeft /> Volver a Editar
        </button>
        
        <button 
          type="button" 
          onClick={handlePreviewPDF}
          className={styles.previewButton}
        >
          <FiEye /> Vista Previa PDF
        </button>
        
        <button 
          type="button" 
          onClick={handleFinalizar}
          className={styles.primaryButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <FiLoader className={styles.spinner} /> Guardando...
            </>
          ) : (
            <>
              <FiSend /> Finalizar y Guardar
            </>
          )}
        </button>
      </div>

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewHeader}>
              <h2 className={styles.modalTitle}>Vista Previa del Acta</h2>

              <div className={styles.zoomControls}>
                <button type="button" className={styles.zoomButton}
                  onClick={() => applyPreviewZoom(previewZoom - 0.1)}>−</button>
                <span className={styles.zoomLabel}>{Math.round(previewZoom * 100)}%</span>
                <button type="button" className={styles.zoomButton}
                  onClick={() => applyPreviewZoom(previewZoom + 0.1)}>+</button>
                <button type="button" className={styles.zoomButton}
                  onClick={fitPreviewToWidth}>Ajustar</button>
                <button type="button" className={styles.zoomButton}
                  onClick={() => applyPreviewZoom(1.5)}>150%</button>
              </div>

              <button className={styles.closeButton} onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <iframe
                ref={previewRef}
                title="Vista previa del PDF"
                srcDoc={pdfHtml}
                onLoad={fitPreviewToWidth}
                className={styles.previewIframe}
              />
              <div className={styles.modalButtons}>
                <button onClick={handlePrintPDF} className={styles.printButton}>
                  <FiPrinter /> Imprimir
                </button>
                <button onClick={handleDownloadPDF} className={styles.pdfButton}>
                  <FiDownload /> Descargar
                </button>
                <button onClick={saveDataToTxt} className={styles.txtButton}>
                  <FiDownload /> Descargar (TXT)
                </button>
                <button onClick={handleOpenEmailModal} className={styles.emailButton}>
                  <FiSend /> Enviar por Correo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para enviar por correo - CON CLASES EXCLUSIVAS */}
      {showEmailModal && (
        <div className={styles.emailModalOverlay}>
          <div className={styles.emailModalContainer}>
            <div className={styles.emailModalHeader}>
              <h2 className={styles.emailModalTitle}>Enviar Acta por Correo</h2>
              <button 
                className={styles.emailCloseButton}
                onClick={() => setShowEmailModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.emailModalContent}>
              <div className={styles.emailForm}>
                <div className={styles.emailFormGroup}>
                  <label className={styles.emailLabel}>
                    Correo electrónico del destinatario <span className={styles.emailRequired}>*</span>
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className={styles.emailInputField}
                    required
                  />
                </div>

                {/* Checkbox para elegir si enviar el TXT */}
                <div className={styles.emailFormGroup}>
                  <label className={styles.emailCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={includeTxtFile}
                      onChange={(e) => setIncludeTxtFile(e.target.checked)}
                    />
                    <span>📊 Adjuntar archivo de datos (.txt) con toda la información estructurada</span>
                  </label>
                  <small className={styles.emailHelperText}>
                    El archivo TXT contiene los datos del acta en formato JSON, útil para respaldos o procesamiento automático.
                  </small>
                </div>

                <div className={styles.emailInfoCard}>
                  <p>
                    <strong>📋 Acta de Revisión N°:</strong> {data.numero_acta || '1001'}<br />
                    <strong>👤 Cliente:</strong> {data.nombre || 'No especificado'}<br />
                    <strong>📅 Fecha:</strong> {new Date().toLocaleDateString('es-CO')}<br />
                    <strong>📎 Archivos adjuntos:</strong><br />
                    &nbsp;&nbsp;• Acta_Revision_No_{data.numero_acta || '1001'}.pdf<br />
                    {includeTxtFile && (
                      <>&nbsp;&nbsp;• datos_acta_{data.numero_acta || 'sin_numero'}_*.txt <span className={styles.attachmentBadge}>incluido</span><br /></>
                    )}
                    <strong>📧 Asunto del correo:</strong> Acta de Revisión N° {data.numero_acta || '1001'} - {data.nombre || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className={styles.emailModalButtons}>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className={styles.emailCancelButton}
                  disabled={sendingEmail}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSendEmail}
                  className={styles.emailSendButton}
                  disabled={sendingEmail}
                >
                  {sendingEmail ? (
                    <>
                      <FiLoader className={styles.emailSpinner} /> Enviando...
                    </>
                  ) : (
                    <>
                      <FiSend /> Enviar Correo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;