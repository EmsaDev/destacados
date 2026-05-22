import React, { useState,useEffect } from 'react';
import html2pdf from 'html2pdf.js';
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
import toast from "react-hot-toast";
import medidorImg from '../assets/overlays/medidor.png';
import tpImg from '../assets/overlays/tp.png';

function Summary({ data, prevStep }) {
  const [showPreview, setShowPreview] = useState(false);
  const [pdfHtml, setPdfHtml] = useState('');
  const [base64Logo, setBase64Logo] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [tiposPorMarca, setTiposPorMarca] = useState({});
  const [loading, setLoading] = useState(false);
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
    
    // Cargar TODAS las imágenes en paralelo ANTES de dibujar
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
      
      // Dibujar elementos (overlays) - USAR LAS POSICIONES GUARDADAS
      if (diagramData.elements && diagramData.elements.length > 0) {
        console.log('Dibujando elementos en Summary:', diagramData.elements.map(el => ({type: el.type, x: el.x, y: el.y})));
        diagramData.elements.forEach(el => {
          const elementImage = imageMap[el.type];
          if (elementImage && el.x !== undefined && el.y !== undefined) {
            ctx.drawImage(elementImage, el.x, el.y, el.width || 60, el.height || 60);
          }
        });
      }
      
      // Dibujar textos - USAR LAS POSICIONES GUARDADAS
      if (diagramData.texts && diagramData.texts.length > 0) {
        console.log('Dibujando textos en Summary:', diagramData.texts.map(t => ({text: t.text, x: t.x, y: t.y})));
        diagramData.texts.forEach(text => {
          if (text.x !== undefined && text.y !== undefined && text.text) {
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
      .then((data) => setMarcas(Array.isArray(data) ? data : []))
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
        .then((data) => {
          setTiposPorMarca((prev) => ({
            ...prev,
            [marcaId]: Array.isArray(data) ? data : []
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
            duration: 4000,
          },
          error: {
            duration: 4000,
          },
        }
      ).finally(() => {
        setLoading(false);
      });
    };

    // Función para enviar el PDF por correo
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
    const html = generatePDFHtml();
    
    const opt = {
      margin: 0.5,
      filename: `Acta_Revision_No_${data.numero_acta || '1001'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'legal' }
    };
    
    const pdfBlob = await html2pdf().set(opt).from(html).outputPdf('blob');

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

  // Generar HTML para el PDF
  const generatePDFHtml = () => {
    
    return `
        <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        /* Estilos generales (igual para ambas páginas) */
        body {
          font-family: sans-serif;
          font-size: 10px;
          margin: 0;
          padding: 10px;
          background-color: #ffffff;
        }
        
        .page {
          page-break-inside: avoid;
          page-break-after: always;
          margin-bottom: 20px;
          
        }
        
        @media print {
        @page {
          size: legal;
          margin: 0.5in;
        }

        .pdf-content {
          transform: scale(0.95);
          zoom: 0.85; /* Reduce el tamaño para que quepa en una hoja */
          transform-origin: top left;
          width: 8.5in;
          min-height: 14in;
          font-size: 11px;
        }
      }
        
        .page:last-child {
          page-break-after: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        
        td, th {
          border: 1px solid #34495e;
          padding: 5px;
          text-align: left;
          vertical-align: top;
        }
        
        .header-table {
          margin: 0 auto; 
          width: 100%;
        }
        
        .header-table td {
          border: none;
          padding: 3px;
        }
        
        .header-table-content {
          border-radius: 10px 10px 0 0; 
          overflow: hidden;
          background-color: #f8f9fa;
          padding: 8px;
          border: 1px solid #ddd;
        }
        
        .text-center {
          text-align: center;
        }
        
        .title {
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          color: #2c3e50;
          margin: 10px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .subtitle {
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          color: #7f8c8d;
        }
        
        .section-title {
          background-color: #e9ecef;
          color: #2c3e50;
          font-weight: bold;
          text-align: center;
          padding: 8px;
          font-size: 11px;
          border: 1px solid #dee2e6;
        }
        
        .firma-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          page-break-inside: avoid;
        }
        
        .firma-table td {
          border: 1px solid #34495e;
          padding: 10px;
          text-align: center;
          vertical-align: middle;
        }
        
        .firma-table tr:first-child td {
          background-color: #e9ecef;
          color: #2c3e50;
          font-weight: bold;
          font-size: 11px;
          padding: 8px;
          border-bottom: 1px solid #dee2e6;
        }
        
        .firma-label {
          text-align: center;
          font-weight: bold;
          padding: 5px 0;
          font-size: 10px;
          color: #2c3e50;
        }
        
        .no-border {
          border: none !important;
        }
        
        .firma-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 8px 0;
        }
        
        .firma-text {
          font-weight: bold;
          font-size: 10px;
          white-space: nowrap;
        }
        
        .firma-imagen {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .firma-imagen img {
          max-width: 120px;
          max-height: 50px;
          padding: 3px;
          background-color: white;
          border: 1px dashed #adb5bd;
        }
        
        .firma-faltante {
          color: #6c757d;
          font-style: italic;
          padding: 8px;
          background-color: #f8f9fa;
          border-radius: 3px;
          font-size: 10px;
          border: 1px dashed #dee2e6;
          display: inline-block;
        }
        
        .text-justify {

          text-align: justify;
        }
        
        .field-label {
          font-weight: bold;
          background-color: #f8f9fa;
          padding: 5px;
        }
        
        .field-value {
          padding: 5px;
        }
        
        .acta-number {
          font-size: 16px;
          color: #e74c3c;
          font-weight: bold;
          text-align: center;
        }
        
        .legal-text {
          margin: 15px 0;
          padding: 12px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          font-size: 9px;
          line-height: 1.4;
          color: #373a3dff;
          text-align: justify;
        }
        
        /* Estilos específicos para la hoja 2 */
        .test-table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        
        .test-table th {
          background: #2c3e50;
          color: white;
          padding: 8px;
          text-align: center;
          font-weight: 600;
          font-size: 10px;
        }
        
        .test-table td {
          padding: 6px;
          border: 1px solid #e1e8ed;
          text-align: center;
        }
        
        .test-table input {
          width: 100%;
          padding: 4px;
          border: 1px solid #ddd;
          border-radius: 3px;
          text-align: center;
          font-size: 10px;
        }
        
        .diagram-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 15px 0;
        }
        
        .diagram-card {
          text-align: center;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        .diagram-card img {
          max-width: 100%;
          max-height: 80px;
          margin-bottom: 5px;
        }
        
        .observaciones-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin: 10px 0;
        }
        
        .observacion-item {
          display: flex;
          justify-content: space-between;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-size: 9px;
        }
        
        /* Estilos específicos para el formato de diagramas */
        .diagram-container {
          display: flex;
          width: 100%;
        }
        
        .diagram {
          flex: 1;
          padding: 10px;
          text-align: center;
        }
        
        .diagram-img {
          max-width: 100%;
          max-height: 180px;
          height: auto;
        }
        
        .logo-img {
          height: 50px;
        }
        
        .checkbox-list {
          list-style-type: none;
          padding-left: 5px;
          margin: 2px 0;
          font-size: 9px;
        }
        
        .checkbox-list li {
          margin-bottom: 3px;
        }
        
        .estado-cell {
          text-align: center;
          width: 20px;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 10px;
            font-size: 9px;
          }
          
          .page {
            page-break-after: always;
            margin: 0;
            padding: 15px;
          }
          
          .diagram-img {
            max-height: 150px;
          }
        }
        .vertical-header {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        text-align: center;
        background-color: #e6e6e6; /* mismo gris del título */
        font-weight: bold;
        }

    /* CONTENEDOR PRINCIPAL DE DIAGRAMAS - MÁS ALTO */
    .diagrams-section {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 650px; /* Aumentado de 500px a 650px */
      margin: 15px 0 20px 0;
      border: 1px solid #030303ff;
    }

    /* MITAD SUPERIOR: Unifilar y Fasorial lado a lado */
    .diagrams-top-half {
      display: flex;
      flex: 1; /* Ocupa 50% de la altura */
      width: 100%;
      height: 50%;
      min-height: 300px; /* Aumentado */
    }

    /* MITAD INFERIOR: Conexiones */
    .diagrams-bottom-half {
      flex: 1; /* Ocupa el otro 50% de la altura */
      width: 100%;
      height: 50%;
      min-height: 300px; /* Aumentado */
      border-top: 2px solid #cbd5e1;
    }

    /* COLUMNAS INDIVIDUALES (Unifilar y Fasorial) */
    .diagram-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 50%;
      height: 100%;
      box-sizing: border-box;
    }

    /* Borde entre columnas */
    .diagram-column:first-child {
      border-right: 2px solid #cbd5e1;
    }

    /* TÍTULOS DE DIAGRAMAS - GRIS CLARO */
    .diagram-title {
      background-color: #f1f5f9; /* Gris claro */
      color: #334155; /* Texto gris oscuro para buen contraste */
      font-weight: bold;
      text-align: center;
      padding: 8px 6px;
      font-size: 12px;
      border-bottom: 1px solid #e2e8f0;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-family: 'Arial', sans-serif;
    }

    /* CONTENEDORES DE DIAGRAMAS */
    .diagram-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15px; /* Aumentado el padding */
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      box-sizing: border-box;
      overflow: hidden;
      width: 100%;
      height: calc(100% - 35px); /* Ajustado por el título más grande */
    }

    /* IMÁGENES DE DIAGRAMAS */
    .diagram-container img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
      margin: auto;
    }

    /* ESPECÍFICO PARA CADA DIAGRAMA */
    .diagram-unifilar {
      background-color: #fafafa;
    }

    .diagram-fasorial {
      background-color: #fafafa;
    }

    .diagram-conexiones {
      height: calc(100% - 35px);
      min-height: 250px;
      background-color: #fafafa;
    }

    /* Hover effect para mejor interacción */
    .diagram-container:hover {
      background-color: #f8fafc;
      transition: background-color 0.2s ease;
    }

    /* Para impresión */
    @media print {
      .diagrams-section {
        height: 700px !important; /* Más alto para impresión */
        border: 1px solid #ccc !important;
        page-break-inside: avoid;
        margin-bottom: 25px;
      }
      
      .diagram-title {
        background-color: #f5f5f5 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    /* Responsive para pantallas más pequeñas */
    @media (max-width: 992px) {
      .diagrams-section {
        height: 550px;
        min-height: 550px;
      }
    }

    /* Ajuste para cuando no hay imágenes */
    .diagram-container:empty::before {
      content: "Sin diagrama disponible";
      color: #94a3b8;
      font-style: italic;
      font-size: 14px;
    }
      .firma-table {
      width: 100%;
      border-collapse: collapse;
    }

    .firma-table td {
      padding: 8px;
      vertical-align: middle;
    }

    /* Encabezados */
    .firma-header {
      text-align: left;
      font-weight: bold;
      background-color: #e9ecef;
    }

    /* Filas con label + valor */
    .firma-row {
      display: flex;
      align-items: center;
    }

    /* Etiqueta (NOMBRE, FIRMA, CC...) */
    .firma-text {
      font-weight: bold;
      margin-right: 6px;
      white-space: nowrap;
    }

    /* Valor centrado */
    .firma-value {
      flex: 1;
      text-align: center;
      font-size: 12px; 
    }

    /* Contenedor de la firma */
    .firma-imagen {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Imagen de la firma */
    .firma-imagen img {
      width: 100%;
      max-height: 120px;
      object-fit: contain;
      border: none;
    }

    /* Texto cuando no hay firma */
    .firma-faltante {
      font-style: italic;
      color: #6c757d;
      text-align: center;
    }
    
    /* Estilos específicos para la Hoja 3 - Acta de Materiales Eléctricos */
.materials-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8px;
}

.materials-table td,
.materials-table th {
  border: 1px solid #666;
  padding: 3px 5px;
  vertical-align: middle;
}

.header-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.header-table td {
  border: none;
}

.code-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}

.code-table td {
  border: 1px solid #34495e;
  padding: 3px 5px;
}

.logo-section {
  padding: 5px;
  text-align: center;
}

.title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 8px;
}

.subtitle {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding: 8px;
}

.number-box {
  font-size: 22px;
  font-weight: bold;
  color: #d43838;
  text-align: center;
  letter-spacing: 3px;
}

.line-text {
  line-height: 1.7;
  font-size: 11px;
  padding: 10px;
}

.section-title {
  background: #efefef;
  text-align: center;
  font-weight: bold;
  font-size: 11px;
}

.center {
  text-align: center;
}

.bold {
  font-weight: bold;
  background: #e9e9e9;
}

.footer-note {
  font-size: 10px;
  text-align: center;
  padding: 10px;
  font-weight: bold;
  margin-top: 15px;
}

/* Estilos para las firmas (igual que hoja 2) */
.firma-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.firma-table td {
  border: 1px solid #34495e;
  padding: 8px;
  vertical-align: middle;
}

.firma-header {
  text-align: left;
  font-weight: bold;
  background-color: #e9ecef;
}

.firma-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.firma-text {
  font-weight: bold;
  margin-right: 6px;
  white-space: nowrap;
  font-size: 10px;
}

.firma-value {
  flex: 1;
  text-align: center;
  font-size: 10px;
}

.firma-imagen {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.firma-imagen img {
  max-width: 120px;
  max-height: 50px;
  object-fit: contain;
}

.firma-faltante {
  font-style: italic;
  color: #6c757d;
  text-align: center;
  font-size: 10px;
}
      </style>
    </head>
    <body>
      <!-- HOJA 1: ACTA DE REVISIÓN ORIGINAL -->
      <div id="pdf-page-1" class="page">
        <div class="header-table-content">
            <table class="header-table">
                <tr>
                    <td style="width: 70%; padding: 5px; text-align: center; border: none;">
                        <img src="${base64Logo}" alt="Logo" style="height: 60px;"/>
                    </td>
                    <td style="width: 30%; padding: 0; ">
                        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-left: 5px;">
                            <tr>
                                <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Código:</td>
                                <td style="border: 1px solid #34495e;">FO-GD-CP-03</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Fecha:</td>
                                <td style="border: 1px solid #34495e;">${new Date().toLocaleDateString('es-ES')}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Versión:</td>
                                <td style="border: 1px solid #34495e;">4</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Página:</td>
                                <td style="border: 1px solid #34495e;">1 DE 1</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
        
        <div class="title">ACTA DE REVISIÓN</div>

        <table>
            <tr>
                <td class="section-title" colspan="6">ACTA DE REVISIÓN CLIENTES DESTACADOS</td>
                <td class="section-title" colspan="3">CONTROL DE PÉRDIDAS</td>
            </tr>
            <tr>
                <td class="field-label">Acta De Revisión No.</td>
                <td class="acta-number">
                    N° <span id="numero">${data.numero_acta}</span>
                </td>
                <td class="field-label">Ciudad</td>
                <td colspan="2" class="field-value">${data.ciudad}</td>
                <td colspan="2" class="field-label">Resultado</td>
                <td colspan="2" class="field-value">${data.resultado || ''}</td>
            </tr>
            <tr>
                <td class="field-label">Solicitud No.</td>
                <td class="field-value">${data.solicitudNo || ''}</td>
                <td class="field-label">Código de cliente</td>
                <td class="field-value">${data.codigo || ''}</td>
                <td class="field-label">ASIC</td>
                <td class="field-value">${data.asic || ''}</td>
                <td class="field-label">Revisión No.</td>
                <td colspan="2" class="field-value">
                    <span id="revision">${data.revisionNo || ''}</span>
                </td>
            </tr>
            <tr>
                <td colspan="9" class="text-justify">
                    <p style="font-size: 12px; line-height: 1.4; margin: 0;">
                        A los <strong>${new Date().getDate()}</strong> días del mes de
                        <strong>${new Date().toLocaleString('es-ES', { month: 'long' })}</strong> del
                        <strong>${new Date().getFullYear()}</strong>, siendo las
                        <strong>${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong>
                        se hacen presentes en el inmueble de la dirección
                        <strong>${data.direccion || '______'}</strong> los representantes de EMSA ESP
                        <strong>${userData.name || '______'}</strong> con C.C:
                        <strong>${userData.cc || '______'}</strong> y
                        <strong>${data.otroRepresentante || '______'}</strong> con C.C:
                        <strong>${data.ccOtroRepresentante || '______'}</strong> en presencia del señor(a)
                        <strong>${data.usuarioVisita || '______'}</strong> con
                        <strong>${data.documentoVisitante || '______'}</strong> calidad de
                        <strong>${data.tipoUsuario ? capitalize(data.tipoUsuario) : '______'}</strong> con el fin de efectuar 
                        una revisión de los equipos de medida e instalaciones del inmueble con el código indicado.
                        Habiéndose identificado los empleados y/o contratistas informan al usuario que de acuerdo 
                        al Contrato de Servicios Públicos con Condiciones Uniformes vigente su derecho a solicitar 
                        asesoría y/o participación de un técnico particular, o de cualquier persona para que sirva 
                        de testigo en el proceso de revisión. Sin embargo, si transcurre un plazo máximo de 15 minutos 
                        sin hacerse presente se hará la revisión sin su presencia. El cliente/usuario hace uso de su derecho:
                        <strong>SÍ (${data.derecho === 'SI' ? 'X' : ' '})</strong>
                        <strong>NO (${data.derecho === 'NO' ? 'X' : ' '})</strong>. Transcurrido ese tiempo, se procede a hacer la revisión.
                    </p>
                </td>
            </tr>
            <tr style=" margin: 0;">
                <td class="field-label">DEPENDENCIA</td>
                <td class="field-value">EMSA</td>
                <td class="field-value">
                <p style="text-align: center; margin: 0; padding:0">
                <strong> ${data.dependencia || ''}</strong>
                </p>
                </td>
                <td class="field-value">CONTRATISTA</td>
                <td  >
                <p style="text-align: center; margin: 0; padding:0">
                  <strong>${data.contratista || ''}</strong>
                </p>
                </td>
                <td class="field-label">ITEM DE PAGO</td>
                <td>
                <p style="text-align: center; margin: 0; padding:0">
                  <strong>${data.itemPago || ''}</strong>
                </p>
                </td>
                <td>
                <p style="text-align: center; margin: 0; padding:0">
                  <strong>${data.itemPago2 || ''}</strong>
                </p>
                </td>
                <td>
                <p style="text-align: center; margin: 0; padding:0">
                  <strong>${data.itemPago3 || ''}</strong>
                </p>
                </td>
            </tr>
        </table>
        
        <table>
            <tr>
                <td class="section-title" colspan="8">DATOS GENERALES DEL SUSCRIPTOR</td>
            </tr>
            <tr>
                <td colspan="1" class="field-label">NOMBRE
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.nombre || ''}</strong>
                  </p>
                </td>
                <td class="field-label">CARGA KW
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.cargaKw || ''}</strong>
                  </p>
                </td>
                <td class="field-label">CICLO
                  <p style="text-align: center; margin: 0; padding:0">
                  <strong>${data.ciclo || ''}</strong>
                  </p>
                </td>
                <td class="field-label">FACTOR
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.factor1 || ''}</strong>
                  </p>
                  </td>
                <td class="field-label">FACTOR
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.factor2 || ''}</strong>
                  </p>
                </td>
                <td class="field-label">FACTOR
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.factor3 || ''}</strong>
                  </p>
                </td>
            </tr>
            <tr>
                <td colspan="1" class="field-label">DIRECCIÓN <br> POBLACIÓN
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.direccion || ''}</strong>
                  </p>
                </td>
                <td class="field-label">NÚMERO MACROMEDIDOR
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.macromedidor || ''}</strong>
                  </p>
                </td>
                <td class="field-label">NODO TRAFO
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.nodoTrafo || ''}</strong>
                  </p>
                </td>
                <td class="field-label">COMERCIALIZADOR
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.comercializador || ''}</strong>
                  </p>
                </td>
                <td class="field-label">LONGITUD
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.longitud || ''}</strong>
                  </p>
                </td>
                <td class="field-label">LATITUD
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.latitud || ''}</strong>
                  </p>
                </td>
                
            </tr>
        </table>
        
        <table>
            <tr>
                <td class="section-title" colspan="13">DATOS DEL SUSCRIPTOR Y EQUIPO DE MEDIDA ENCONTRADOS</td>
            </tr>
            <tr>
                <td class="field-label">TELÉFONO
                  <p style="text-align: center; margin: 0; padding:0"></p>
                    <strong>${data.telefono || ''}</strong>
                </td>
                <td class="field-label">USO
                <p style="text-align: center; margin: 0; padding:0">
                    <strong>
                    ${data.uso === 'R' ? 'RESIDENCIAL' : 
                      data.uso === 'C' ? 'COMERCIAL' : 
                      data.uso === 'I' ? 'INDUSTRIAL' : 
                      data.uso === 'O' ? 'OFICIAL' : ''}
                      </strong>
                      </p>
                </td>
                <td class="field-label">UBICACIÓN
                <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.ubicacion || ''}</strong>
                </p>    
                </td>
                <td class="field-label">FAMILIAS
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.familias || ''}</strong>
                  </p>
                </td>
                <td class="field-label">NIVEL TENSIÓN
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.nivelTension || ''}</strong>
                  </p>
                </td>
                <td class="field-label">BLOQUES PRUEBA
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.bloquesPrueba || ''}</strong>
                  </p>
                </td>
                <td class="field-label">TIPO MEDIDOR
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.tipoMedidor || ''}</strong>
                  </p>
                </td>
                <td class="field-label">TIPO INSTALACIÓN
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.tipoInstalacion || ''}</strong>
                  </p>
                </td>
                <td class="field-label">UBICACIÓN MEDIDOR
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.ubicacionMedidor || ''}</strong>
                  </p>
                </td>
                <td class="field-label">TIPO ACOMETIDA
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.acometidaTipo || ''}</strong>
                  </p>
                </td>
                <td class="field-label">#F #H
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.fh || ''}</strong>
                  </p>
                </td>
                <td class="field-label">PROTECCIÓN GENERAL (A)
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.proteccionGeneral || ''}</strong>
                  </p>
                </td>
                <td class="field-value">LONGITUD (M)
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.acometidaLongitud ? data.acometidaLongitud + ' M' : ''}</strong>
                  </p>
                </td>
            </tr>
            <tr>

                <td class="field-label">CALIBRE ACOMETIDA
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.acometidaCalibre || ''}</strong>
                  </p>
                </td>
                <td class="field-label">UBICACIÓN MODEM
                <p>
                  <strong>${data.modemUbicacion || ''}</strong>
                </p>
                </td>
                <td class="field-label">MARCA MODEM
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>
                      ${data.marcaModem === 'Otro'
                        ? data.marcaModemOtro
                        : data.marcaModem || ''}
                    </strong>
                  </p>
                </td>
                <td class="field-label">NÚMERO SERIE MODEM:
                <p style="text-align: center; margin: 0; padding:0">
                <strong>${data.serieModem || ''}</strong>
                </p>
                </td>
                <td class="field-label">IP
                <p style="text-align: center; margin: 0; padding:0">
                <strong>${data.ipModem || ''}</strong>
                </p>
                </td>
                <td class="field-label">MARCA MODEM RESPALDO
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>
                      ${data.marcaModemRes === 'OtroRes'
                        ? data.marcaModemOtroRes
                        : data.marcaModemRes || ''}
                    </strong>
                  </p>
                </td>
                <td class="field-label">NÚMERO SERIE MODEM RESPALDO:
                <p style="text-align: center; margin: 0; padding:0">
                <strong>${data.serieModemRes || ''}</strong>
                </p>
                </td>
                <td class="field-label">IP RESPALDO
                <p style="text-align: center; margin: 0; padding:0">
                <strong>${data.ipModemRes || ''}</strong>
                </p>
                </td>
                <td class="field-label">CONFIGURACIÓN MEDIDA
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.configuracionMedida || ''}</strong>
                  </p>
                </td>
                <td class="field-label">TIPO MEDIDA
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.tipoMedida || ''}</strong>
                  </p>
                </td>
                <td class="field-label " colspan="2">MARCA CABLE
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.marcaCable || ''}</strong>
                  </p>
                </td>
                <td class="field-label">MARCA CELDA MEDIDA
                  <p style="text-align: center; margin: 0; padding:0">
                    <strong>${data.marcaCeldaMedida || ''}</strong>
                  </p>
                </td>
            </tr>
        </table>

        <!-- TABLA DE MEDIDOR ENCONTRADO Y INSTALADO PRINCIPAL -->
        <table>
            <tr>
                <td class="section-title" colspan="13">DATOS MEDIDOR PRINCIPAL</td>
            </tr>
            <tr>
                <th style="width: 8%;" colspan="2">Medida</th>
                <th style="width: 10%;">Número</th>
                <th style="width: 10%;">Marca</th>
                <th style="width: 8%;">Tipo</th>
                <th style="width: 8%;">Capac. (A)</th>
                <th style="width: 8%;">Tensión (V)</th>
                <th style="width: 6%;">Clase</th>
                <th style="width: 8%;">Kd (rev/kWh)</th>
                <th style="width: 8%;">Kh (kWh/rev)</th>
                <th style="width: 8%;">Lectura</th>
                <th style="width: 8%;">E/D</th>
                <th style="width: 10%;">Fecha Lab</th>
            </tr>
            <!-- Fila Activa 1 -->
            <tr>
                <td class="vertical-header" rowspan="4">ENCONTRADO</td>
                <td>Activa1</td>
                <td>${data.numeroActiva1 || ''}</td>
                <td>${resumen.marcaActiva1}</td>
                <td>${resumen.tipoActiva1 || ''}</td>
                <td>${data.capacidadActiva1 || ''}</td>
                <td>${data.tensionActiva1 || ''}</td>
                <td>${data.claseActiva1 || ''}</td>
                <td>${data.kdActiva1 || ''}</td>
                <td>${data.khActiva1 || ''}</td>
                <td>${data.lecturaActiva1 || ''}</td>
                <td>${data.edActiva1 || ''}</td>
                <td>${data.fechaLabActiva1 || ''}</td>
            </tr>
            <!-- Fila Activa 2 -->
            <tr>
                <td>Activa 2</td>
                <td>${data.numeroActiva1 || ''}</td>
                <td>${resumen.marcaActiva1}</td>
                <td>${resumen.tipoActiva1 || ''}</td>
                <td>${data.capacidadActiva2 || ''}</td>
                <td>${data.tensionActiva2 || ''}</td>
                <td>${data.claseActiva2 || ''}</td>
                <td>${data.kdActiva2 || ''}</td>
                <td>${data.khActiva2 || ''}</td>
                <td>${data.lecturaActiva2 || ''}</td>
                <td>${data.edActiva2 || ''}</td>
                <td>${data.fechaLabActiva2 || ''}</td>
            </tr>
            <!-- Fila Reactiva1  -->
            <tr>
                <td>Reactiva 1</td>
                <td>${data.numeroActiva1 || ''}</td>
                <td>${resumen.marcaActiva1}</td>
                <td>${resumen.tipoActiva1 || ''}</td>
                <td>${data.capacidadReactiva1 || ''}</td>
                <td>${data.tensionReactiva1 || ''}</td>
                <td>${data.claseReactiva1 || ''}</td>
                <td>${data.kdReactiva1 || ''}</td>
                <td>${data.khReactiva1 || ''}</td>
                <td>${data.lecturaReactiva1 || ''}</td>
                <td>${data.edReactiva1 || ''}</td>
                <td>${data.fechaLabReactiva1 || ''}</td>
            </tr>
            <!-- Fila Reactiva 2  -->
            <tr>
                <td>Reactiva 2</td>
                <td>${data.numeroActiva1 || ''}</td>
                <td>${resumen.marcaActiva1}</td>
                <td>${resumen.tipoActiva1 || ''}</td>
                <td>${data.capacidadReactiva2 || ''}</td>
                <td>${data.tensionReactiva2 || ''}</td>
                <td>${data.claseReactiva2 || ''}</td>
                <td>${data.kdReactiva2 || ''}</td>
                <td>${data.khReactiva2 || ''}</td>
                <td>${data.lecturaReactiva2 || ''}</td>
                <td>${data.edReactiva2 || ''}</td>
                <td>${data.fechaLabReactiva2 || ''}</td>
            </tr>
            <!-- Fila Activa 1 -->
            <tr>
                <td class="vertical-header" rowspan="4">INSTALADO</td>
                <td>Activa 1</td>
                <td>${data.numeroActivaIns1 || ''}</td>
                <td>${resumen.marcaActivaIns1 || ''}</td>
                <td>${resumen.tipoActivaIns1 || ''}</td>
                <td>${data.capacidadActivaIns1 || ''}</td>
                <td>${data.tensionActivaIns1 || ''}</td>
                <td>${data.claseActivaIns1 || ''}</td>
                <td>${data.kdActivaIns1 || ''}</td>
                <td>${data.khActivaIns1 || ''}</td>
                <td>${data.lecturaActivaIns1 || ''}</td>
                <td>${data.edActivaIns1 || ''}</td>
                <td>${data.fechaLabActivaIns1 || ''}</td>
            </tr>
            <!-- Fila Activa 2 -->
            <tr>
                <td>Activa 2</td>
                <td>${data.numeroActivaIns1 || ''}</td>
                <td>${resumen.marcaActivaIns1 || ''}</td>
                <td>${resumen.tipoActivaIns1 || ''}</td>
                <td>${data.capacidadActivaIns2 || ''}</td>
                <td>${data.tensionActivaIns2 || ''}</td>
                <td>${data.claseActivaIns2 || ''}</td>
                <td>${data.kdActivaIns2 || ''}</td>
                <td>${data.khActivaIns2 || ''}</td>
                <td>${data.lecturaActivaIns2 || ''}</td>
                <td>${data.edActivaIns2 || ''}</td>
                <td>${data.fechaLabActivaIns2 || ''}</td>
            </tr>
            <!-- Fila Reactiva1  -->
            <tr>
                <td>Reactiva 1</td>
                <td>${data.numeroActivaIns1 || ''}</td>
                <td>${resumen.marcaActivaIns1 || ''}</td>
                <td>${resumen.tipoActivaIns1 || ''}</td>
                <td>${data.capacidadReactivaIns1 || ''}</td>
                <td>${data.tensionReactivaIns1 || ''}</td>
                <td>${data.claseReactivaIns1 || ''}</td>
                <td>${data.kdReactivaIns1 || ''}</td>
                <td>${data.khReactivaIns1 || ''}</td>
                <td>${data.lecturaReactivaIns1 || ''}</td>
                <td>${data.edReactivaIns1 || ''}</td>
                <td>${data.fechaLabReactivaIns1 || ''}</td>
            </tr>
            <!-- Fila Reactiva2  -->
            <tr>
                <td>Reactiva 2</td>
                <td>${data.numeroActivaIns1 || ''}</td>
                <td>${resumen.marcaActivaIns1 || ''}</td>
                <td>${resumen.tipoActivaIns1 || ''}</td>
                <td>${data.capacidadReactivaIns2 || ''}</td>
                <td>${data.tensionReactivaIns2 || ''}</td>
                <td>${data.claseReactivaIns2 || ''}</td>
                <td>${data.kdReactivaIns2 || ''}</td>
                <td>${data.khReactivaIns2 || ''}</td>
                <td>${data.lecturaReactivaIns2 || ''}</td>
                <td>${data.edReactivaIns2 || ''}</td>
                <td>${data.fechaLabReactivaIns2 || ''}</td>
            </tr>
        </table>

        <!-- TABLA DE MEDIDOR ENCONTRADO Y INSTALADO RESPALDO -->
        <table>
            <tr>
                <td class="section-title" colspan="13">DATOS MEDIDOR RESPALDO</td>
            </tr>
            <tr>
                <th style="width: 8%;" colspan="2">Medida</th>
                <th style="width: 10%;">Número</th>
                <th style="width: 10%;">Marca</th>
                <th style="width: 8%;">Tipo</th>
                <th style="width: 8%;">Capac. (A)</th>
                <th style="width: 8%;">Tensión (V)</th>
                <th style="width: 6%;">Clase</th>
                <th style="width: 8%;">Kd (rev/kWh)</th>
                <th style="width: 8%;">Kh (kWh/rev)</th>
                <th style="width: 8%;">Lectura</th>
                <th style="width: 8%;">E/D</th>
                <th style="width: 10%;">Fecha Lab</th>
            </tr>
            <!-- Fila Activa 1 -->
            <tr>
                <td class="vertical-header" rowspan="4">ENCONTRADO</td>
                <td>Activa1</td>
                <td>${data.numeroActiva1Res || ''}</td>
                <td>${resumen.marcaActiva1Res}</td>
                <td>${resumen.tipoActiva1Res || ''}</td>
                <td>${data.capacidadActiva1Res || ''}</td>
                <td>${data.tensionActiva1Res || ''}</td>
                <td>${data.claseActiva1Res || ''}</td>
                <td>${data.kdActiva1Res || ''}</td>
                <td>${data.khActiva1Res || ''}</td>
                <td>${data.lecturaActiva1Res || ''}</td>
                <td>${data.edActiva1Res || ''}</td>
                <td>${data.fechaLabActiva1Res || ''}</td>
            </tr>
            <!-- Fila Activa 2 -->
            <tr>
                <td>Activa 2</td>
                <td>${data.numeroActiva1Res || ''}</td>
                <td>${resumen.marcaActiva1Res}</td>
                <td>${resumen.tipoActiva1Res || ''}</td>
                <td>${data.capacidadActiva2Res || ''}</td>
                <td>${data.tensionActiva2Res || ''}</td>
                <td>${data.claseActiva2Res || ''}</td>
                <td>${data.kdActiva2Res || ''}</td>
                <td>${data.khActiva2Res || ''}</td>
                <td>${data.lecturaActiva2Res || ''}</td>
                <td>${data.edActiva2Res || ''}</td>
                <td>${data.fechaLabActiva2Res || ''}</td>
            </tr>
            <!-- Fila Reactiva1  -->
            <tr>
                <td>Reactiva 1</td>
                <td>${data.numeroActiva1Res || ''}</td>
                <td>${resumen.marcaActiva1Res}</td>
                <td>${resumen.tipoActiva1Res || ''}</td>
                <td>${data.capacidadReactiva1Res || ''}</td>
                <td>${data.tensionReactiva1Res || ''}</td>
                <td>${data.claseReactiva1Res || ''}</td>
                <td>${data.kdReactiva1Res || ''}</td>
                <td>${data.khReactiva1Res || ''}</td>
                <td>${data.lecturaReactiva1Res || ''}</td>
                <td>${data.edReactiva1Res || ''}</td>
                <td>${data.fechaLabReactiva1Res || ''}</td>
            </tr>
            <!-- Fila Reactiva 2  -->
            <tr>
                <td>Reactiva 2</td>
                <td>${data.numeroActiva1Res || ''}</td>
                <td>${resumen.marcaActiva1Res}</td>
                <td>${resumen.tipoActiva1Res || ''}</td>
                <td>${data.capacidadReactiva2Res || ''}</td>
                <td>${data.tensionReactiva2Res || ''}</td>
                <td>${data.claseReactiva2Res || ''}</td>
                <td>${data.kdReactiva2Res || ''}</td>
                <td>${data.khReactiva2Res || ''}</td>
                <td>${data.lecturaReactiva2Res || ''}</td>
                <td>${data.edReactiva2Res || ''}</td>
                <td>${data.fechaLabReactiva2Res || ''}</td>
            </tr>
            <!-- Fila Activa 1 -->
            <tr>
                <td class="vertical-header" rowspan="4">INSTALADO</td>
                <td>Activa 1</td>
                <td>${data.numeroActivaIns1Res || ''}</td>
                <td>${resumen.marcaActivaIns1Res}</td>
                <td>${resumen.tipoActivaIns1Res || ''}</td>
                <td>${data.capacidadActivaIns1Res || ''}</td>
                <td>${data.tensionActivaIns1Res || ''}</td>
                <td>${data.claseActivaIns1Res || ''}</td>
                <td>${data.kdActivaIns1Res || ''}</td>
                <td>${data.khActivaIns1Res || ''}</td>
                <td>${data.lecturaActivaIns1Res || ''}</td>
                <td>${data.edActivaIns1Res || ''}</td>
                <td>${data.fechaLabActivaIns1Res || ''}</td>
            </tr>
            <!-- Fila Activa 2 -->
            <tr>
                <td>Activa 2</td>
                <td>${data.numeroActivaIns1Res || ''}</td>
                <td>${resumen.marcaActivaIns1Res}</td>
                <td>${resumen.tipoActivaIns1Res || ''}</td>
                <td>${data.capacidadActivaIns2Res || ''}</td>
                <td>${data.tensionActivaIns2Res || ''}</td>
                <td>${data.claseActivaIns2Res || ''}</td>
                <td>${data.kdActivaIns2Res || ''}</td>
                <td>${data.khActivaIns2Res || ''}</td>
                <td>${data.lecturaActivaIns2Res || ''}</td>
                <td>${data.edActivaIns2Res || ''}</td>
                <td>${data.fechaLabActivaIns2Res || ''}</td>
            </tr>
            <!-- Fila Reactiva1  -->
            <tr>
                <td>Reactiva 1</td>
                <td>${data.numeroActivaIns1Res || ''}</td>
                <td>${resumen.marcaActivaIns1Res}</td>
                <td>${resumen.tipoActivaIns1Res || ''}</td>
                <td>${data.capacidadReactivaIns1Res || ''}</td>
                <td>${data.tensionReactivaIns1Res || ''}</td>
                <td>${data.claseReactivaIns1Res || ''}</td>
                <td>${data.kdReactivaIns1Res || ''}</td>
                <td>${data.khReactivaIns1Res || ''}</td>
                <td>${data.lecturaReactivaIns1Res || ''}</td>
                <td>${data.edReactivaIns1Res || ''}</td>
                <td>${data.fechaLabReactivaIns1Res || ''}</td>
            </tr>
            <!-- Fila Reactiva2  -->
            <tr>
                <td>Reactiva 2</td>
                <td>${data.numeroActivaIns1Res || ''}</td>
                <td>${resumen.marcaActivaIns1Res}</td>
                <td>${resumen.tipoActivaIns1Res || ''}</td>
                <td>${data.capacidadReactivaIns2Res || ''}</td>
                <td>${data.tensionReactivaIns2Res || ''}</td>
                <td>${data.claseReactivaIns2Res || ''}</td>
                <td>${data.kdReactivaIns2Res || ''}</td>
                <td>${data.khReactivaIns2Res || ''}</td>
                <td>${data.lecturaReactivaIns2Res || ''}</td>
                <td>${data.edReactivaIns2Res || ''}</td>
                <td>${data.fechaLabReactivaIns2Res || ''}</td>
            </tr>
        </table>

      <!-- TABLA TRANSFORMADOR DE POTENCIA -->
    <table>
        <tr>
            <td class="section-title" colspan="8">TRANSFORMADOR DE POTENCIA</td>
        </tr>
        <tr>
            <td class="field-label">Transformador Asociado No. 
            <p style="text-align: center; margin: 0;"><strong>${data.transformadorPoNumero || ''}</strong></p>
            </td>
            <td class="field-label">Marca
            <p style="text-align: center; margin: 0;"><strong>${data.transformadorPoMarca || ''}</strong></p>
            </td>
            <td class="field-label">KVA
            <p style="text-align: center; margin: 0;"><strong>${data.transformadorPoKva || ''}</strong></p>
            </td>
            <td class="field-label">Año
            <p style="text-align: center; margin: 0;"><strong>${data.transformadorPoAno || ''}</strong></p>
            </td>
            <td class="field-label">V1/V2
            <p style="text-align: center; margin: 0;"><strong>${data.transformadorPoV1V2 || ''}</strong></p>
            </td>
            <td class="field-label">Circuito
            <p style="text-align: center; margin: 0;"><strong>${data.transformadorPoCircuito || ''}</strong></p>
            </td>
            <td class="field-label" colspan="2">Propietario
            <p style="text-align: center; margin: 0;">
            <strong>
              ${data.transformadorPoPropietario || ''}
              <!--
                EMSA (${data.transformadorPoPropietario === 'EMSA' ? 'X' : ' '}) 
                PARTICULAR (${data.transformadorPoPropietario === 'PARTICULAR' ? 'X' : ' '})
              -->
            </strong></p>
            </td>
        </tr>
    </table>

    <!-- TABLA RELACIÓN DE SELLOS -->
    <table>
        <tr>
            <td class="section-title" colspan="16">RELACIÓN DE SELLOS</td>
        </tr>
        <!-- Fila de encabezados -->
        <tr>
            <th colspan="4" style="text-align: center; border: 1px solid #34495e;">ENCONTRADOS</th>
            <th colspan="4" style="text-align: center; border: 1px solid #34495e;">INSTALADOS</th>
            <th colspan="4" style="text-align: center; border: 1px solid #34495e;">ENCONTRADOS</th>
            <th colspan="4" style="text-align: center; border: 1px solid #34495e;">INSTALADOS</th>
        </tr>
        <!-- Fila de ubicación -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;" colspan="2">UBICACIÓN</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">TIPO/COL</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">NÚMERO</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">E</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">R</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">TIPO/COLOR</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">NÚMERO</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">UBICACIÓN</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">TIPO/COL</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">NÚMERO</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">E</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">R</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">TIPO/COLOR</td>
            <td style="border: 1px solid #34495e; text-align: center; font-weight: bold;">NÚMERO</td>
        </tr>
        <!-- Fila 1  TAPA PRINCIPAL -->
        <tr>
            <th rowspan="5" class="vertical-header" style="writing-mode: vertical-lr; transform: rotate(180deg); background-color: #f2f2f2;">MED<br>ACTIVA</th>          
            <td class="ubicacion-header" rowspan="3" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
                TAPA<br>PRINCIPAL
            </td>
            <td style="border: 1px solid #34495e;">${data.medActivaTipoCol1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaNum1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaE1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaR1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaInstTipoColor1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaInstNum1 || ''}</td>
            <!-- Fila 1 TC'S -->
            <td class="ubicacion-header" rowspan="3" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
                TC'S
            </td>
            <td style="border: 1px solid #34495e;">${data.tcsTipoCol1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsNumero1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsE1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsR1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsInstTipoColor1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsInstNumero1 || ''}</td> 
        </tr>
        <tr> <!-- Fila 2 TAPA PRINCIPAL -->
            <td style="border: 1px solid #34495e;">${data.medActivaTipoCol2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaNum2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaE2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaR2  || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaInstTipoColor2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaInstNum2 || ''}</td>
            <!-- Fila 2 TC'S -->
            <td style="border: 1px solid #34495e;">${data.tcsTipoCol2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsNumero2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsE2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsR2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsInstTipoColor2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsInstNumero2 || ''}</td> 
        </tr>
        <tr> <!-- Fila 3 TAPA PRINCIPAL -->
            <td style="border: 1px solid #34495e;">${data.medActivaTipoCol3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaNum3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaE3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaR3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaInstTipoColor3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.medActivaInstNum3 || ''}</td>
            <!-- Fila 3 TC'S -->
            <td style="border: 1px solid #34495e;">${data.tcsTipoCol3  || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsNumero3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsE3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsR3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsInstTipoColor3 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tcsInstNumero3 || ''}</td> 
        </tr>
        
        <tr> 
            <!-- Fila 1 TAPA BORNERA -->          
            <td class="ubicacion-header" rowspan="2" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
                TAPA<br>BORNERA
            </td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaTipoCol1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaNum1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaE1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaR1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaInstTipoColor1|| ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaInstNum1  || ''}</td>
            <!-- Fila 1 TP'S -->
            <td class="ubicacion-header" rowspan="2" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
                TP'S
            </td>
            <td style="border: 1px solid #34495e;">${data.tpsTipoCol1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsNumero1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsE1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsR1 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsInstTipoColor1|| ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsInstNumero1 || ''}</td> 
        </tr>
        <tr> <!-- Fila 2 TAPA BORNERA -->
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaTipoCol2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaNum2  || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaE2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaR2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaInstTipoColor2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tapaBorneraActivaInstNum2 || ''}</td>
            <!-- Fila 2 TP'S -->
            <td style="border: 1px solid #34495e;">${data.tpsTipoCol2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsNumero2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsE2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsR2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsInstTipoColor2 || ''}</td>
            <td style="border: 1px solid #34495e;">${data.tpsInstNumero2 || ''}</td> 
        </tr>
        <tr>
          <th rowspan="5" class="vertical-header" style="writing-mode: vertical-lr; transform: rotate(180deg); background-color: #f2f2f2;">MED<br>REACTIVA</th>          
          <td class="ubicacion-header" rowspan="3" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
              TAPA<br>PRINCIPAL
          </td>
          <td style="border: 1px solid #34495e;">${data.medReactivaTipoCol1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaNum1  || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaE1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaR1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaInstTipoColor1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaInstNum1 || ''}</td>
          <!-- Fila 1 CELDA DE MEDIDA -->
          <td class="ubicacion-header" rowspan="3" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
              CELDA DE<br>MEDIDA
          </td>
          <td style="border: 1px solid #34495e;">${data.celdaTipoCol1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaNumero1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaE1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaR1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaInstTipoColor1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaInstNumero1 || ''}</td> 
      </tr>
      <tr> <!-- Fila 2 TAPA PRINCIPAL REACTIVA -->
          <td style="border: 1px solid #34495e;">${data.medReactivaTipoCol2  || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaNum2  || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaE2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaR2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaInstTipoColor2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaInstNum2 || ''}</td>
          <!-- Fila 2 CELDA DE MEDIDA -->
          <td style="border: 1px solid #34495e;">${data.celdaTipoCol2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaNumero2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaE2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaR2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaInstTipoColor2  || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaInstNumero2 || ''}</td> 
      </tr>
      <tr> <!-- Fila 3 TAPA PRINCIPAL REACTIVA -->
          <td style="border: 1px solid #34495e;">${data.medReactivaTipoCol3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaNum3  || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaE3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaR3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaInstTipoColor3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.medReactivaInstNum3 || ''}</td>
          <!-- Fila 3 CELDA DE MEDIDA -->
          <td style="border: 1px solid #34495e;">${data.celdaTipoCol3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaNumero3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaE3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaR3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaInstTipoColor3 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.celdaInstNumero3 || ''}</td> 
      </tr>

      <tr> 
          <!-- Fila 1 TAPA BORNERA REACTIVA -->          
          <td class="ubicacion-header" rowspan="2" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
              TAPA<br>BORNERA
          </td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaTipoCol1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaNum1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaE1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaR1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaInstTipoColor1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaInstNum1 || ''}</td>
          <!-- Fila 1 BLOQUES DE PRUEBA -->
          <td class="ubicacion-header" rowspan="2" style="text-align: center; border: 1px solid #34495e; background-color: #f2f2f2; font-weight: bold; vertical-align: middle;">
              BLOQUES DE<br>PRUEBA
          </td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasTipoCol1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasNum1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasE1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasR1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasInstTipoColor1 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasInstNum1 || ''}</td> 
      </tr>
      <tr> <!-- Fila 2 TAPA BORNERA REACTIVA -->
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaTipoCol2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaNum2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaE2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaR2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaInstTipoColor2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.tapaBorneraReactivaInstNum2 || ''}</td>
          <!-- Fila 2 BLOQUES DE PRUEBA -->
          <td style="border: 1px solid #34495e;">${data.bloquePruebasTipoCol2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasNum2  || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasE2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasR2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasInstTipoColor2 || ''}</td>
          <td style="border: 1px solid #34495e;">${data.bloquePruebasInstNum2 || ''}</td> 
      </tr>
    </table>
    <table>
        <tr>
            <td class="section-title" colspan="10" >PRUEBAS REALIZADAS MEDIDOR ACTIVA</td>
            <td class="section-title" colspan="10" >PRUEBAS REALIZADAS MEDIDOR REACTIVA</td>
        </tr>
        <tr>
            <td class="section-title" colspan="20">Cuadro de Cálculo del Error</td>
        </tr>
        <!-- Encabezados principales -->
        <tr>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Fase</th>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Tensión (V)</th>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">CORRIENTE (A)</th>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">P.Inst (W)</th>
            <th rowspan="2" colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; vertical-align: middle;">Secuencia de Fases</th>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Fase</th>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Tensión (V)</th>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">CORRIENTE (A)</th>
            <th colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">P.Inst (W)</th>
            <th rowspan="2" colspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; vertical-align: middle;">Secuencia de Fases</th>
        </tr>
        <!-- Fila R -->
        <tr>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #f8f9fa;">R</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionR || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteR || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstR || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #f8f9fa;">R</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionR || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteR || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstR || ''}</strong>
            </td>
        </tr>
        <!-- Fila S -->
        <tr>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #f8f9fa;">S</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionS || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteS || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstS || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">RST</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaRst || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #f8f9fa;">S</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionS || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteS || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstS || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">RST</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaRst || ''}</strong>
            </td>
        </tr>
        <!-- Fila T -->
        <tr>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #f8f9fa;">T</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionT || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteT || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstT || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">RTS</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaRts || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #f8f9fa;">T</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionT || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteT || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstT || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">RTS</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaRts || ''}</strong>
            </td>
        </tr>
        <!-- Fila TOTAL (L-L) -->
        <tr>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #e9ecef;">TOTAL (L-L)</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionTotal || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteTotal || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstTotal || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">F.P.</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaFp || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center; font-weight: bold; background-color: #e9ecef;">TOTAL (L-L)</td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTensionTotal || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaCorrienteTotal || ''}</strong>
            </td>
            <td colspan="2" style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPinstTotal || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">F.P.</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaFp || ''}</strong>
            </td>
        </tr>
        <!-- Fila de cálculos -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">% Error</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPorcentajeError || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Giros</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaGiros || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Tiempo (S)</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTiempo || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Horas</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaHoras || ''}</strong>
            </td>
            
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">W</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaW || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">% Error</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPorcentajeError || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Giros</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaGiros || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Tiempo (S)</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaTiempo || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Horas</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaHoras || ''}</strong>
            </td>
            
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">W</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaW || ''}</strong>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td class="section-title" colspan="5">PRUEBAS DE FUNCIONAMIENTO DEL MEDIDOR DE ACTIVA</td>
            <td class="section-title" colspan="5">PRUEBAS DE FUNCIONAMIENTO DEL MEDIDOR DE REACTIVA</td>
        </tr>
        <!-- Encabezados -->
        <tr>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 20%;">Tipo</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 20%;">Conforme</th>
            <th colspan="3" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Prueba de Integración</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 20%;">Tipo</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 20%;">Conforme</th>
            <th colspan="3" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Prueba de Integración</th>
        </tr>
        <!-- Fila 1: Conexiones -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Conexiones</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <p style="margin: 0;">
                    <strong>
                  ${data.activaConexiones === 'si' ? 'SÍ' : data.activaConeciones === 'no' ? 'NO' : ' '}
                    <!--SÍ (${data.activaConexiones === 'si' ? 'X' : ' '}) 
                    NO (${data.activaConexiones === 'no' ? 'X' : ' '})-->
                    </strong>
                </p>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Lectura Inicial</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaLecturaInicial || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa; vertical-align: middle;">% Error</td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Conexiones</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <p style="margin: 0;">
                  <strong>
                    ${data.reactivaConexiones === 'si' ? 'SÍ' : data.reactivaConexiones === 'no' ? 'NO' : ' '}
                    <!--SÍ (${data.reactivaConexiones === 'si' ? 'X' : ' '}) 
                    NO (${data.reactivaConexiones === 'no' ? 'X' : ' '})-->
                  </strong>
                </p>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Lectura Inicial</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.reactivaLecturaInicial || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa; vertical-align: middle;">% Error</td>
        </tr>
        <!-- Fila 2: Continuidad -->
        <tr>
          
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Continuidad</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <p>
                  <strong>    
                  ${data.activaContinuidad === 'si' ? 'SÍ' : data.activaContinuidad === 'no' ? 'NO' : ' '}   
                    <!--SÍ (${data.activaContinuidad === 'si' ? 'X' : ' '}) 
                    NO (${data.activaContinuidad === 'no' ? 'X' : ' '})-->
                  </strong>
                </p>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Lectura Final</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaLecturaFinal || ''}</strong>
            </td>
            <td rowspan="3" style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">
              <p style="margin: 0; padding: 0.5rem 0;"  >
                ${data.activaPorcentajeErrorPruebas || ''}
              </p>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Continuidad</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <p>
                <strong>
                  ${data.reactivaContinuidad === 'si' ? 'SÍ' : data.reactivaContinuidad === 'no' ? 'NO' : ' '} 
                    <!--SÍ (${data.reactivaContinuidad === 'si' ? 'X' : ' '}) 
                    NO (${data.reactivaContinuidad === 'no' ? 'X' : ' '})-->
                </strong>
                </p>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Lectura Final</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.reactivaLecturaFinal || ''}</strong>
            </td>
            <td rowspan="3" style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">${data.reactivaPorcentajeErrorPruebas || ''}</td>
        </tr>
        <!-- Fila 3: Prueba de Puentes (parte 1) -->
        <tr>
            <td rowspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa; vertical-align: middle;">Prueba de Puentes</td>
            <td rowspan="2" style="border: 1px solid #34495e; text-align: center; vertical-align: middle;">
                <p style="margin: 0; padding: 0.5rem 0;">
                  <strong>
                    ${data.activaPuentes === 'si' ? 'SÍ' : data.activaPuentes === 'no' ? 'NO' : ' '} 
                    <!--SÍ (${data.activaPuentes === 'si' ? 'X' : ' '}) 
                    NO (${data.activaPuentes === 'no' ? 'X' : ' '})-->
                  </strong>
                </p>
            </td>
            
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Diferencia</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaDiferencia || ''}</strong>
            </td>
            
            <td rowspan="2" style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa; vertical-align: middle;">Prueba de Puentes</td>
            <td rowspan="2" style="border: 1px solid #34495e; text-align: center; vertical-align: middle;">
                <p style="margin: 0; padding: 0.5rem 0;">
                  <strong>
                    ${data.reactivaPuentes === 'si' ? 'SÍ' : data.reactivaPuentes === 'no' ? 'NO' : ' '}
                    <!--SÍ (${data.reactivaPuentes === 'si' ? 'X' : ' '}) 
                    NO (${data.reactivaPuentes === 'no' ? 'X' : ' '})-->
                  </strong>    
                </p>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Diferencia</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.reactivaDiferencia || ''}</strong>
            </td>
        </tr>
        <!-- Fila 4: Prueba de Puentes (parte 2) -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Patron</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.activaPatron || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">Patron</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.reactivaPatron || ''}</strong>
            </td>
        </tr>
        <!-- Fila 5: Estado del integrador y Medidor se frena -->
        <tr>
            <td colspan="4" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Estado del integrador</td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Medidor se frena</td>
            <td colspan="4" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Estado del integrador</td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Medidor se frena</td>
        </tr>
        <!-- Fila 7: ¿Giro en vacio?, ¿Registra? y checkbox -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">¿Giro en vacio?</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>
                    ${data.activaGiroVacio === 'si' ? 'SÍ' : data.activaGiroVacio === 'no' ? 'NO' : ' '}
                </strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">¿Registra?</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>
                    ${data.activaRegistra === 'si' ? 'SÍ' : data.activaRegistra === 'no' ? 'NO' : ' '}
                </strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>
                  ${data.activaSeFrena === 'si' ? 'SÍ' : data.activaSeFrena === 'no' ? 'NO' : ''}
                </strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">¿Giro en vacio?</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>
                    ${data.reactivaGiroVacio === 'si' ? 'SÍ' : data.reactivaGiroVacio === 'no' ? 'NO' : ''}
                </strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center; background-color: #f8f9fa;">¿Registra?</td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>
                  ${data.reactivaRegistra === 'si' ? 'SÍ' : data.reactivaRegistra === 'no' ? 'NO' : ''}
                </strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>
                  ${data.reactivaSeFrena === 'si' ? 'SÍ' : data.reactivaSeFrena === 'no' ? 'NO' : ''}
                </strong>
            </td>
        </tr>
    </table>

    <!-- TABLA TC'S ENCONTRADOS -->
    <table>
        <tr>
            <td class="section-title" colspan="6">CARACTERISTICAS TRANSFORMADORES DE CORRIENTE TC'S ENCONTRADOS</td>
            <td class="section-title" colspan="6">CARACTERISTICAS TRANSFORMADORES DE POTENCIA ENCONTRADOS</td>
        </tr>
        <!-- Encabezados de columnas -->
        <tr>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Marca</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Series</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Tipo</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Relación</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Clase</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">VA</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Marca</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Series</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Tipo</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Relación</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">Clase</th>
            <th style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1;">VA</th>
        </tr>
        <!-- Fila 1 -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcMarca1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcSeries1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcTipo1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcRelacion1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcClase1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcVa1 || ''}</strong>
            </td>
            <!-- Fila 2  TPS -->
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpMarca1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpSeries1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpTipo1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpRelacion1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpClase1 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpVa1 || ''}</strong>
            </td>
        </tr>
        <!-- Fila 2 -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcMarca2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcSeries2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcTipo2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcRelacion2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcClase2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcVa2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpMarca2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpSeries2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpTipo2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpRelacion2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpClase2 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpVa2 || ''}</strong>
            </td>
        </tr>
        <!-- Fila 3 -->
        <tr>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcMarca3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcSeries3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcTipo3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcRelacion3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcClase3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tcVa3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpMarca3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpSeries3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpTipo3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpRelacion3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpClase3 || ''}</strong>
            </td>
            <td style="border: 1px solid #34495e; text-align: center;">
                <strong>${data.tpVa3 || ''}</strong>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td class="section-title" colspan="7">IRREGULARIDADES ENCONTRADAS POR LA EMPRESA</td>
        </tr>
        <!-- Fila de datos principales -->
        <tr>
            <td class="field-label" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 25%;">
                CODIGO(S) DE LA(S) IRREGULARIDAD(ES)
            </td>
            <td class="field-value" style="border: 1px solid #34495e; text-align: center; width: 15%;">
                <strong>${data.codigosIrregularidades || ''}</strong>
            </td>
            <td class="field-label" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 10%;">
                Foto<br>
                <span style="font-weight: bold; font-size: 12px;">
                    ${data.tipoEvidencia === 'foto' ? 'X' : ' '}
                </span>
            </td>
            <td class="field-label" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 10%;">
                Video<br>
                <span style="font-weight: bold; font-size: 12px;">
                    ${data.tipoEvidencia === 'video' ? 'X' : ' '}
                </span>
            </td>
            <td class="field-label" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 20%;">
                IRREGULARIDAD CORREGIDA<br>
                <span style="font-weight: bold; font-size: 12px;">
                    ${data.irregularidadCorrida === 'si' ? 'SÍ' : data.irregularidadCorrida === 'no' ? 'NO' : ''}
                </span>
            </td>
            <td class="field-label" style="border: 1px solid #34495e; text-align: center; background-color: #ecf0f1; width: 20%;">
                MEDIDOR RETIRADO<br>
                <span style="font-weight: bold; font-size: 12px;">
                    ${data.medidorRetirado === 'si' ? 'SÍ' : data.medidorRetirado === 'no' ? 'NO' : ''}
                </span>
            </td>
        </tr>
        <!-- Fila de nota -->
        <tr>
            <td colspan="7" style="border: 1px solid #34495e; padding: 8px; font-size: 13px; font-style: italic; background-color: #f8f9fa;">
                NOTA: En caso de detectarse irregularidad(es), esta acta constituye en acta de irregularidades, por lo cual procede como tal ante el cliente o usuario del servicio de energía eléctrica
            </td>
        </tr>
        <!-- Fila de informe -->
        <tr>
            <td colspan="7" class="text-justify" style="border: 1px solid #34495e; padding: 8px; font-size: 10px; line-height: 1.4; background-color: #f8f9fa;">
                <p style="margin: 0;">
                    Informe: <strong>
                    ${getTipoInformeText()}
                    </strong>
                </p>
            </td>
        </tr>
    </table>

        <div class="legal-text">
            <p>
                Los abajo firmantes reconocen haber leído y aceptado el contenido de esta acta y mediante su firma la dan por levantadas.
                (EL USO INDEBIDO DEL SERVICIO, LA ADULTERACIÓN O MANIPULACIÓN SIN AUTORIZACIÓN DEL EQUIPO DE MEDIDA SE CONSTITUYE EN EL DELITO DE "DEFRAUDACIÓN DE FLUIDOS") (artículo 256 del Código Penal). 
                El artículo 256 del Código Penal establece que Defraudación de fluidos: El que mediante cualquier mecanismo clandestino o alterando los sistemas de control o aparatos contadores,
                se apropie de energía eléctrica, en perjuicio ajeno, incurrirá en prisión de uno (1) a cuatro (4) años y en multa de uno (1) a cien (100) salarios mínimos legales mensuales vigentes.
            </p>
        </div>

        <!-- TABLA DE FIRMAS (3 COLUMNAS) -->
        <table class="firma-table">
            <tr>
                <td class="firma-header" style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">FUNCIONARIO RESPONSABLE DE LA REVISIÓN</td>
                <td class="firma-header" style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">SUSCRIPTOR O USUARIO</td>
                <td class="firma-header" style="width: 33.34%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">TESTIGO</td>
            </tr>
            <tr>
              <td>
                <div class="firma-row">
                  <span class="firma-text">NOMBRE:</span>
                  <div class="firma-value">${userData.name || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">NOMBRE:</span>
                  <div class="firma-value">${data.usuarioVisita || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">NOMBRE:</span>
                  <div class="firma-value">${data.otroRepresentante || 'No especificado'}</div>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div class="firma-row">
                  <span class="firma-text">FIRMA:</span>
                  <div class="firma-value">
                    ${signatures.firmaFuncionario
                      ? `<div class="firma-imagen">
                          <img src="${signatures.firmaFuncionario}" alt="Firma Funcionario">
                        </div>`
                      : '<span class="firma-faltante">No disponible</span>'
                    }
                  </div>
                </div>
              </td>

              <td>
                <div class="firma-row">
                  <span class="firma-text">FIRMA:</span>
                  <div class="firma-value">
                    ${signatures.firmaSuscriptor
                      ? `<div class="firma-imagen">
                          <img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor">
                        </div>`
                      : '<span class="firma-faltante">No disponible</span>'
                    }
                  </div>
                </div>
              </td>

              <td>
                <div class="firma-row">
                  <span class="firma-text">FIRMA:</span>
                  <div class="firma-value">
                    ${signatures.firmaSupervisor
                      ? `<div class="firma-imagen">
                          <img src="${signatures.firmaSupervisor}" alt="Firma Supervisor">
                        </div>`
                      : '<span class="firma-faltante">No disponible</span>'
                    }
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="firma-row">
                  <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                  <div class="firma-value">${userData.cc || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                  <div class="firma-value">${data.documentoVisitante || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                  <div class="firma-value">${data.ccOtroRepresentante || 'No especificado'}</div>
                </div>
              </td>
            </tr>
        </table>
    </div>
    <!-- Fin Hoja 1 -->

      <!-- HOJA 2: FORMATO ACTA DE DIAGRAMAS -->
      <div id="pdf-page-2" class="page">
        <!-- Encabezado hoja 2 -->
        <div class="header-table-content">
          <table class="header-table">
            <tr>
              <td style="width: 70%; padding: 5px; text-align: center; border: none;">
                <img src="${base64Logo}" alt="Logo" style="height: 60px;"/>
              </td>
              <td style="width: 30%; padding: 0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-left: 5px;">
                  <tr>
                    <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Código:</td>
                    <td style="border: 1px solid #34495e;">FO-GD-CP-05</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Fecha:</td>
                    <td style="border: 1px solid #34495e;">1/02/2023</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Versión:</td>
                    <td style="border: 1px solid #34495e;">04</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Página:</td>
                    <td style="border: 1px solid #34495e;">2 de 2</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <table>
          <tr>
            <td class="section-title" colspan="9">FORMATO ACTA DE DIAGRAMAS</td>
            <td class="section-title" colspan="7">CONTROL DE PÉRDIDAS</td>
          </tr>
          <tr>
            <td colspan="2" style="font-weight: bold; font-size: 12px;">Acta De Revisión No.</td>
            <td colspan="3" style="font-weight: bold; font-size: 18px; color: red;">
              N° <span id="numero">${data.numero_acta}</span>
            </td>
            <td colspan="3" style="font-weight: bold; font-size: 11px;">CÓDIGO</td>
            <td colspan="3">${data.codigo || ''}</td>
            <td colspan="2">FECHA</td>
            <td colspan="2">${new Date().toLocaleDateString('es-ES')}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; font-size: 11px;">REVISIÓN N°</td>
            <td colspan="3">${data.revision || ''}</td>
            <td colspan="3" style="font-weight: bold; font-size: 11px;">SOLICITUD N°</td>
            <td colspan="2">${data.solicitud || ''}</td>
            <td>CIUDAD</td>
            <td colspan="3">${data.ciudad || 'Acacias'}</td>
            <td> ACTA DE REFERENCIA</td>
            <td>${data.numero_acta || '52976'}</td>
          </tr>
          <tr>
            <td colspan="2">CIRCUITO</td>
            <td colspan="3">${data.circuito || ''}</td>
            <td>SUBESTACIONES</td>
            <td colspan="3">${data.subestacion || ''}</td>
            <td>CLIENTES - RAZON SOCIAL</td>
            <td colspan="5">${data.nombre || ''}</td>
          </tr>
          <tr>
            <td>TELEMEDIDA</td>
            <td>${data.telemedida || ''}</td>
            <td>LINEA DEDICADA</td>
            <td>SI</td>
            <td> ${data.lineaDedicada === 'SI' ? 'X' : ' '} </td>
            <td>NO</td>
            <td> ${data.lineaDedicada === 'NO' ? 'X' : ' '}</td>
            <td>TIPO DE FRONTERA</td>
            <td>${data.tipoFrontera === 'MCM' ? 'X' : ' '} MCM</td>
            <td>${data.tipoFrontera === 'RGP' ? 'X' : ' '} RGP</td>
            <td>${data.tipoFrontera === 'NRP' ? 'X' : ' '} NRP</td>
            <td>${data.tipoFrontera === 'NRO' ? 'X' : ' '} NRO</td>
            <td>${data.tipoFrontera === 'REGO' ? 'X' : ' '} REGO</td>
            <td>${data.tipoFrontera === 'SNT' ? 'X' : ' '} SNT</td>
            <td>${data.tipoFrontera === 'CAMB COM' ? 'X' : ' '} CAMB COM</td>
          </tr>
        </table>

        <!-- Diagramas -->
        <div class="diagrams-section">
        <!-- PRIMERA MITAD: Unifilar y Fasorial (verticalmente divididos) -->
        <div class="diagrams-top-half">
          <div class="diagram-column">
            <div class="section-title">DIAGRAMA UNIFILAR</div>
            <div class="diagram-container diagram-unifilar">
              <img class="diagram-img" src="${diagramImages.diagramaUnifilar || './unifilar.png'}" alt="Diagrama Unifilar">
            </div>
          </div>
          
          <div class="diagram-column">
            <div class="section-title">DIAGRAMA FASORIAL</div>
            <div class="diagram-container diagram-fasorial">
              <img class="diagram-img" src="${diagramImages.diagramaFasorial || './Fasorial.png'}" alt="Diagrama Fasorial">
            </div>
          </div>
        </div>
        
        <!-- SEGUNDA MITAD: Conexiones (ocupa todo el ancho) -->
        <div class="diagrams-bottom-half">
          <div class="section-title">DIAGRAMA DE CONEXIONES</div>
          <div class="diagram-container diagram-conexiones">
            <img class="diagram-img" src="${diagramImages.diagramaConexiones || './conexiones.png'}" alt="Diagrama de Conexiones">
          </div>
        </div>
      </div>

        <!-- Pruebas de Transformadores -->
        <table>
          <tr>
            <td class="section-title" colspan="6">PRUEBA DE TRANSFORMADORES DE POTENCIAL TP'S</td>
            <td class="section-title" colspan="6">PRUEBA DE TRANSFORMADORES DE CORRIENTE TC'S</td>
          </tr>
          <tr>
            <td>VOLTAJE</td>
            <td>PRIMARIO</td>
            <td>SECUNDARIO</td>
            <td>RTP (Vp/Vs)</td>
            <td>% ERROR</td>
            <td>% PROMEDIO</td>
            <td>VOLTAJE</td>
            <td>PRIMARIO</td>
            <td>SECUNDARIO</td>
            <td>RTC (Ip/ls)</td>
            <td>% ERROR</td>
            <td>% PROMEDIO</td>
          </tr>
          <tr>
            <td>VR</td>
            <td>${data.tpData?.vRPrimario || ''}</td>
            <td>${data.tpData?.vRSecundario || ''}</td>
            <td>${data.tpData?.rtp || ''}</td>
            <td>${data.tpData?.errorVR || ''}</td>
            <td rowspan="3">${data.tpData?.errorPromedio || ''}</td>
            <td>IR</td>
            <td>${data.tcData?.vRPrimario || ''}</td>
            <td>${data.tcData?.vRSecundario || ''}</td>
            <td>${data.tcData?.rtc || ''}</td>
            <td>${data.tcData?.errorVR || ''}</td>
            <td rowspan="3">${data.tcData?.errorPromedio || ''}</td>
          </tr>
          <tr>
            <td>VS</td>
            <td>${data.tpData?.vSPrimario || ''}</td>
            <td>${data.tpData?.vSSecundario || ''}</td>
            <td>${data.tpData?.rtp || ''}</td>
            <td>${data.tpData?.errorVS || ''}</td>
            <td>LS</td>
            <td>${data.tcData?.vSPrimario || ''}</td>
            <td>${data.tcData?.vSSecundario || ''}</td>
            <td>${data.tcData?.rtc || ''}</td>
            <td>${data.tcData?.errorVS || ''}</td>
          </tr>
          <tr>
            <td>V_T</td>
            <td>${data.tpData?.vTPrimario || ''}</td>
            <td>${data.tpData?.vTSecundario || ''}</td>
            <td>${data.tpData?.rtp || ''}</td>
            <td>${data.tpData?.errorVT || ''}</td>
            <td>LT</td>
            <td>${data.tcData?.vTPrimario || ''}</td>
            <td>${data.tcData?.vTSecundario || ''}</td>
            <td>${data.tcData?.rtc || ''}</td>
            <td>${data.tcData?.errorVT || ''}</td>
          </tr>
        </table>

        <!-- Factor SIEC y Observaciones -->
        <table>
          <tr>
            <td class="section-title" colspan="1">FACTOR SIEC</td>
            <td class="section-title" colspan="8">OBSERVACIONES GENERALES</td>
            <td rowspan="2" class="section-title" colspan="5">ADECUACIONES Y MEJORAS QUE NECESITA LA INSTALACIÓN ELÉCTRICA</td>
          </tr>
          <tr>
            <td rowspan="2">${data.factorData?.factorSiec || ''}</tdC>
            <td>EQUIPOS</td>
            <td class="estado-cell">B</td>
            <td class="estado-cell">R</td>
            <td class="estado-cell">M</td>
            <td>EQUIPOS</td>
            <td class="estado-cell">B</td>
            <td class="estado-cell">R</td>
            <td class="estado-cell">M</td>
          </tr>
          <tr>
            <td>RED</td>
            <td class="estado-cell">${data.observaciones?.redMT === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.redMT === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.redMT === 'Malo' ? 'X' : ''}</td>
            <td>TPS</td>
            <td class="estado-cell">${data.observaciones?.tps === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.tps === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.tps === 'Malo' ? 'X' : ''}</td>
            <td rowspan="9" colspan="5" style="vertical-align: top; font-size: 9px;">
              <div style="display: flex; gap: 20px;">
              <!-- COLUMNA 1 -->
              <ul class="checkbox-list" style="list-style: none; padding: 0; margin: 0;">
                <li><input type="checkbox" ${data.adecuaciones?.cambiarMedidor || data.adecuaciones?.instalarMedidor ? 'checked' : ''}> Cambiar o instalar el medidor</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarMedidor ? 'checked' : ''}> Cambiar o instalar TC</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarMedidor ? 'checked' : ''}> Cambiar o Instalar TP</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiarCaja || data.adecuaciones?.instalarCaja ? 'checked' : ''}> Cambiar o instalación de caja para el medidor</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiarPuestaTierra || data.adecuaciones?.instalarPuestaTierra ? 'checked' : ''}> Cambiar o instalar sistema de puesta a tierra</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarBloquePruebas ? 'checked' : ''}> Cambiar o instalar Bloque de Pruebas</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarProteccionesElectricas ? 'checked' : ''}> Cambiar o instalar Protecciones eléctricas</li>
              </ul>

              <!-- COLUMNA 2 -->
              <ul class="checkbox-list" style="list-style: none; padding: 0; margin: 0;">
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarCableSenal ? 'checked' : ''}> Cambiar o instalar Cable de señal (según norma)</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarSistemaComunicacion ? 'checked' : ''}> Cambiar o instalar sistema de comunicación</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarModem ? 'checked' : ''}> Cambiar o instalar MODEM</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarProteccionesCommunicacion ? 'checked' : ''}> Cambiar o instalar Protecciones en comunicaciones</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarDuctosCableSeñal ? 'checked' : ''}> Cambiar o instalar ductos para cables de señal</li>
                <li><input type="checkbox" ${data.adecuaciones?.otros ? 'checked' : ''}> Otros: ${data.adecuaciones?.otrosTexto || ''}</li>
                <li><input type="checkbox" ${data.adecuaciones?.adecuaroInstalaraSeguridadCeldas ? 'checked' : ''}> Adecuar o instalar seguridad a las celdas de medidor</li>
                <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarCelda ? 'checked' : ''}> Cambiar o instalar Celda para medida(TP'S y TC'S) norma</li>
              </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #2c3e50; background-color: #e9ecef;">FACTOR ENCONTRADO</td>
            <td>CRUCETAS</td>
            <td class="estado-cell">${data.observaciones?.crucetas === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.crucetas === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.crucetas === 'Malo' ? 'X' : ''}</td>
            <td>TCS</td>
            <td class="estado-cell">${data.observaciones?.tcs === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.tcs === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.tcs === 'Malo' ? 'X' : ''}</td>
          </tr>
          <tr>
            <td>${data.factorData?.factorEncontrado || ''}</td>
            <td>PARARRAYOS</td>
            <td class="estado-cell">${data.observaciones?.pararrayos === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.pararrayos === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.pararrayos === 'Malo' ? 'X' : ''}</td>
            <td>BLOQUES DE PRUEBA</td>
            <td class="estado-cell">${data.observaciones?.bloquesPrueba === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.bloquesPrueba === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.bloquesPrueba === 'Malo' ? 'X' : ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #2c3e50; background-color: #e9ecef;">%ERROR DE FACT</td>
            <td>CORTACIRCUITOS</td>
            <td class="estado-cell">${data.observaciones?.cortacircuitos === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.cortacircuitos === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.cortacircuitos === 'Malo' ? 'X' : ''}</td>
            <td>CELDA</td>
            <td class="estado-cell">${data.observaciones?.celda === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.celda === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.celda === 'Malo' ? 'X' : ''}</td>
          </tr>
          <tr>
            <td>${data.factorData?.errorFactor || ''}</td>
            <td>FUSIBLES</td>
            <td class="estado-cell">${data.observaciones?.fusibles === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.fusibles === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.fusibles === 'Malo' ? 'X' : ''}</td>
            <td>GABINETES</td>
            <td class="estado-cell">${data.observaciones?.gabinetes === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.gabinetes === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.gabinetes === 'Malo' ? 'X' : ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #2c3e50; background-color: #e9ecef;" >FACTOR FINAL</td>
            <td>BAJANTES</td>
            <td class="estado-cell">${data.observaciones?.bajantes === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.bajantes === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.bajantes === 'Malo' ? 'X' : ''}</td>
            <td>MODEM</td>
            <td class="estado-cell">${data.observaciones?.modem === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.modem === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.modem === 'Malo' ? 'X' : ''}</td>
          </tr>
          <tr>
            <td rowspan="2" >${data.factorData?.factorFinal || ''}</td>
            <td>TRANSFORMADOR PRINCIPAL</td>
            <td class="estado-cell">${data.observaciones?.transformador === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.transformador === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.transformador === 'Malo' ? 'X' : ''}</td>
            <td>CABLE DE SEÑAL</td>
            <td class="estado-cell">${data.observaciones?.cableSenal === 'Bueno' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.cableSenal === 'Regular' ? 'X' : ''}</td>
            <td class="estado-cell">${data.observaciones?.cableSenal === 'Malo' ? 'X' : ''}</td>
          </tr>
          <tr>
            <td colspan="8" class="field-label">EQUIPO PATRON
            <p style="text-align: center; margin: 0; padding:0">
              <strong>${data.factorData?.equipoPatron || ''}</strong>
            </p>
            </td>
          </tr>
        </table>

        <!-- Informe -->
        <table>
          <tr>
            <td class="section-title" colspan="12">Nota: En caso de detectarse irregularidad(es), esta acta se constituye en acta de irregularidades, por lo cual procede como tal ante el cliente o usuario del servicio de energía eléctrica:</td>
          </tr>
          <tr>
            <td class="section-title">INFORME</td>
          </tr>
          <tr>
            <td style="text-align: justify; padding: 8px; font-size: 12px">
              ${getInformeDisplayText()}
            </td>
          </tr>
          <tr>
            <td style="text-align: justify; padding: 8px; font-size: 12px">
              LA EMPRESA, con base en lo establecido en la ley 142 de 1994 y en su contrato de Servicios Públicos con Condiciones Uniformes, se permite informarle que usted dispone a partir de la fecha un Periodo de Facturación (30 días calendario), para instalar cambiar o adecuar las anomalías aquí indicadas, cumpliendo con las NORMAS TÉCNICAS exigidos por la EMPRESA; pasado este período y de no tomar las medidas necesarias para adquirirlos, las instalación(es) provicional(es) pasarán a ser definitiva(s) con cargo a su cuenta.
            </td>
          </tr>
        </table>

        <!-- Firmas hoja 2 -->
        <table class="firma-table">
            <tr>
                <td class="firma-header" style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">FUNCIONARIO RESPONSABLE DE LA REVISIÓN</td>
                <td class="firma-header" style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">SUSCRIPTOR O USUARIO</td>
                <td class="firma-header" style="width: 33.34%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">TESTIGO</td>
            </tr>
            <tr>
              <td>
                <div class="firma-row">
                  <span class="firma-text">NOMBRE:</span>
                  <div class="firma-value">${userData.name || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">NOMBRE:</span>
                  <div class="firma-value">${data.usuarioVisita || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">NOMBRE:</span>
                  <div class="firma-value">${data.otroRepresentante || 'No especificado'}</div>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div class="firma-row">
                  <span class="firma-text">FIRMA:</span>
                  <div class="firma-value">
                    ${signatures.firmaFuncionario
                      ? `<div class="firma-imagen">
                          <img src="${signatures.firmaFuncionario}" alt="Firma Funcionario">
                        </div>`
                      : '<span class="firma-faltante">No disponible</span>'
                    }
                  </div>
                </div>
              </td>

              <td>
                <div class="firma-row">
                  <span class="firma-text">FIRMA:</span>
                  <div class="firma-value">
                    ${signatures.firmaSuscriptor
                      ? `<div class="firma-imagen">
                          <img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor">
                        </div>`
                      : '<span class="firma-faltante">No disponible</span>'
                    }
                  </div>
                </div>
              </td>

              <td>
                <div class="firma-row">
                  <span class="firma-text">FIRMA:</span>
                  <div class="firma-value">
                    ${signatures.firmaSupervisor
                      ? `<div class="firma-imagen">
                          <img src="${signatures.firmaSupervisor}" alt="Firma Supervisor">
                        </div>`
                      : '<span class="firma-faltante">No disponible</span>'
                    }
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="firma-row">
                  <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                  <div class="firma-value">${userData.cc || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                  <div class="firma-value">${data.documentoVisitante || 'No especificado'}</div>
                </div>
              </td>
              <td>
                <div class="firma-row">
                  <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                  <div class="firma-value">${data.ccOtroRepresentante || 'No especificado'}</div>
                </div>
              </td>
            </tr>
        </table>
      </div>
      <!-- Fin Hoja 2 -->
      
      <!-- HOJA 3: ACTA DE MATERIALES ELÉCTRICOS -->
      <div id="pdf-page-3" class="page">
          <!-- HEADER (ESTRUCTURA IDÉNTICA A LA HOJA 1) -->
          <div class="header-table-content">
              <table class="header-table">
                  <tr>
                      <td style="width: 70%; padding: 5px; text-align: center; border: none;">
                          <img src="${base64Logo}" alt="Logotipo de la Empresa" style="height: 60px;"/>
                      </td>
                      <td style="width: 30%; padding: 0; ">
                          <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-left: 5px;">
                              <tr>
                                  <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Código:</td>
                                  <td style="border: 1px solid #34495e;">FO-GD-CP-04</td>
                              </tr>
                              <tr>
                                  <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Fecha:</td>
                                  <td style="border: 1px solid #34495e;">${new Date().toLocaleDateString('es-ES')}</td>
                              </tr>
                              <tr>
                                  <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Versión:</td>
                                  <td style="border: 1px solid #34495e;">4</td>
                              </tr>
                              <tr>
                                  <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Página:</td>
                                  <td style="border: 1px solid #34495e;">3 DE 3</td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </div>

          <!-- TÍTULO Y SUBTÍTULO -->
          <div class="title">ACTA DE MATERIALES ELÉCTRICOS</div>

          <!-- NÚMERO DE ACTA E INFORMACIÓN INICIAL -->
          <table class="info-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
              <td class="section-title" colspan="6">ACTA DE MATERIALES ELÉCTRICOS</td>
              <td class="section-title" colspan="3">CONTROL DE PÉRDIDAS</td>
            </tr>
              <tr>
                  <td class="field-label" style="width: 22%; border: 1px solid #34495e;">Acta De Materiales Eléctricos No.</td>
                  <td class="acta-number" style="width: 13%; border: 1px solid #34495e;">
                      N° <span>${data.numero_acta || ''}</span>
                  </td>
                  <td class="field-label" style="width: 8%; border: 1px solid #34495e;">Código</td>
                  <td class="field-value" style="width: 12%; border: 1px solid #34495e;">${data.codigo || ''}</td>
                  <td class="field-label" style="width: 18%; border: 1px solid #34495e;">Revisión ó Solicitud No.</td>
                  <td class="field-value" style="width: 12%; border: 1px solid #34495e;">${data.solicitudNo || ''}</td>
                  <td class="field-label" style="width: 15%; border: 1px solid #34495e;">ACTA REFERENCIA No.</td>
                  <td class="field-value" style="border: 1px solid #34495e;">${data.numero_acta || ''}</td>
              </tr>
          </table>

          <!-- TEXTO INTRODUCTORIO CON BORDE -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
              <tr>
                  <td class="text-justify" style="border: 1px solid #34495e; padding: 8px; font-size: 12px; line-height: 1.4;">
                      <p style="margin: 0;">
                          A los <strong>${new Date().getDate()}</strong> días del mes de 
                          <strong>${new Date().toLocaleString('es-ES', { month: 'long' })}</strong> del <strong>${new Date().getFullYear()}</strong> 
                          se hicieron presentes los señores <strong>${userData.name || '________________________________'}</strong> y 
                          <strong>${data.otroRepresentante || '________________________________________'}</strong> en representación de la EMSA ESP, 
                          en el inmueble ubicado en la <strong>${data.direccion || '________________________________________________'}</strong> 
                          del Municipio de <strong>${data.ciudad || '_____________________'}</strong> con el fin de instalar material eléctrico, 
                          el cual tiene las siguientes características
                      </p>
                  </td>
              </tr>
          </table>

          <!-- TABLA DE MATERIALES -->
          <table class="materials-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
              <thead>
                  <tr>
                      <th colspan="4" class="section-title" style="border: 1px solid #34495e;">DESCRIPCIÓN</th>
                      <th colspan="3" class="section-title" style="border: 1px solid #34495e;">MATERIAL INCLUIDO</th>
                      <th colspan="4" class="section-title" style="border: 1px solid #34495e;">DESCRIPCIÓN</th>
                      <th colspan="3" class="section-title" style="border: 1px solid #34495e;">MATERIAL INCLUIDO</th>
                  </tr>
                  <!-- Medidor / PROTECCIONES -->
                  <tr>
                      <th colspan="4" class="center bold" style="border: 1px solid #34495e;">Medidor (${data.materiales?.medidor?.fasico || '___'})fasico, (${data.materiales?.medidor?.fases || '___'})F - (${data.materiales?.medidor?.hilos || '___'})H</th>
                      <th class=class="center bold" style="border: 1px solid #34495e;">UNI</th>
                      <th class="center bold" style="border: 1px solid #34495e;">ESTADO</th>
                      <th class="center bold" style="border: 1px solid #34495e;">CANT.</th>
                      <th colspan="4" class="center bold" style="border: 1px solid #34495e;">PROTECCIONES Y HERRAJES</th>
                      <th class="center bold" style="border: 1px solid #34495e;"">UNI</th>
                      <th class="center bold" style="border: 1px solid #34495e;">ESTADO</th>
                      <th class="center bold" style="border: 1px solid #34495e;">CANT.</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- ELECTROMECÁNICO / CINTA BANDIT -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">ELECTROMECÁNICO, (${data.materiales?.medidorElectroMecanico?.especificaciones?.tipo || '___'}) - (${data.materiales?.medidorElectroMecanico?.especificaciones?.amperios || '___'}) A.,(${data.materiales?.medidorElectroMecanico?.especificaciones?.voltios || '___'}) V.,Clase(${data.materiales?.medidorElectroMecanico?.especificaciones?.clase || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorElectroMecanico?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorElectroMecanico?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CINTA BANDIT (${data.materiales?.cintaBandit?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cintaBandit?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cintaBandit?.cantidad || 0}</td>
                  </tr>
                  
                  <!-- ELECTRÓNICO REGIS / GRAPA HEBILLA -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">ELECTRÓNICO regis,ciclometrico (${data.materiales?.medidorElectronicoRegis?.especificaciones?.tipo || '___'}) - (${data.materiales?.medidorElectronicoRegis?.especificaciones?.amperios || '___'}) A.,(${data.materiales?.medidorElectronicoRegis?.especificaciones?.voltios || '___'}) V.,Clase(${data.materiales?.medidorElectronicoRegis?.especificaciones?.clase || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorElectronicoRegis?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorElectronicoRegis?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">GRAPA "HEBILLA" PARA CINTA (${data.materiales?.grapaHebilla?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.grapaHebilla?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.grapaHebilla?.cantidad || 0}</td>
                  </tr>
                  
                  <!-- ELECTRÓNICO DISPLAY / CAPACETE -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">ELECTRÓNICO con display (${data.materiales?.medidorElectronicoDisplay?.especificaciones?.tipo || '___'}) - (${data.materiales?.medidorElectronicoDisplay?.especificaciones?.amperios || '___'}) A.,(${data.materiales?.medidorElectronicoDisplay?.especificaciones?.voltios || '___'}) V.,Clase(${data.materiales?.medidorElectronicoDisplay?.especificaciones?.clase || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorElectronicoDisplay?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorElectronicoDisplay?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CAPACETE DE (${data.materiales?.capacete?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.capacete?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.capacete?.cantidad || 0}</td>
                  </tr>

                  <!-- FILA VACÍA / CONECTOR CURVO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td colspan="4" style="border: 1px solid #34495e;">CONECTOR CURVO (${data.materiales?.conectorCurvo?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorCurvo?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorCurvo?.cantidad || 0}</td>
                  </tr>

                  <!-- Medidores para Medida Semi / CONDULETAS -->
                  <tr>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">Medidores para Medida Semi</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CONDULETAS DE (${data.materiales?.conduletas?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conduletas?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conduletas?.cantidad || 0}</td>
                  </tr>

                  <!-- ELECTROMECÁNICO SEMI / CONDULETA CON TAPA -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">ELECTROMECÁNICO (${data.materiales?.medidorSemiElectro?.especificaciones?.fases || '___'})F - (${data.materiales?.medidorSemiElectro?.especificaciones?.hilos || '___'})H, Clase (${data.materiales?.medidorSemiElectro?.especificaciones?.clase || '___'}). (${data.materiales?.medidorSemiElectro?.especificaciones?.amperios || '___'})A.(${data.materiales?.medidorSemiElectro?.especificaciones?.voltios || '___'})V.</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorSemiElectro?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorSemiElectro?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CONDULETA EN (${data.materiales?.conduletaTapa?.tipo || '___'}) DE (${data.materiales?.conduletaTapa?.medida || '___'})" CON TAPA</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conduletaTapa?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conduletaTapa?.cantidad || 0}</td>
                  </tr>

                  <!-- ELECTRÓNICO SEMI / TUBO GALVANIZADO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">ELECTRÓNICO regis,ciclometrico (${data.materiales?.medidorSemiElectronico?.especificaciones?.fases || '___'})F - (${data.materiales?.medidorSemiElectronico?.especificaciones?.hilos || '___'})H, Clase (${data.materiales?.medidorSemiElectronico?.especificaciones?.clase || '___'}). (${data.materiales?.medidorSemiElectronico?.especificaciones?.amperios || '___'})A.(${data.materiales?.medidorSemiElectronico?.especificaciones?.voltios || '___'})V.</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorSemiElectronico?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorSemiElectronico?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">TUBO GALVANIZADO (${data.materiales?.tuboGalvanizado?.medida || '___'})" x 3m</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tuboGalvanizado?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tuboGalvanizado?.cantidad || 0}</td>
                  </tr>

                  <!-- FILA VACÍA / ANCLAJE ACOMETIDA -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td colspan="4" style="border: 1px solid #34495e;">ANCLAJE ACOMETIDA (${data.materiales?.anclajeAcometida?.tipo || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.anclajeAcometida?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.anclajeAcometida?.cantidad || 0}</td>
                  </tr>

                  <!-- Medidores para Medida Semi e indirecta Electrónicos / CONECTOR BIMETALICO TIPO CUÑA -->
                  <tr>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">Medidores para Medida Semi e indirecta Electrónicos</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CONECTOR BIMETALICO TIPO CUÑA TIPO(${data.materiales?.conectorBimetalicoCuna?.tipo || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorBimetalicoCuna?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorBimetalicoCuna?.cantidad || 0}</td>
                  </tr>

                  <!-- SIN PERFIL / ESTRIBO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">SIN PERFIL (${data.materiales?.medidorSinPerfil?.especificaciones?.fases || '___'})F - (${data.materiales?.medidorSinPerfil?.especificaciones?.hilos || '___'})H Clase (${data.materiales?.medidorSinPerfil?.especificaciones?.clase || '___'}). (${data.materiales?.medidorSinPerfil?.especificaciones?.amperios || '___'})A.(${data.materiales?.medidorSinPerfil?.especificaciones?.voltios || '___'})V</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorSinPerfil?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorSinPerfil?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">ESTRIBO TIPO (${data.materiales?.estribo?.tipo || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.estribo?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.estribo?.cantidad || 0}</td>
                  </tr>

                  <!-- CON PERFIL DE CARGA Y COMUNICACIONES / CONECTOR BIMETALICO PERNO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">CON PERFIL DE CARGA Y (${data.materiales?.medidorConPerfil?.especificaciones?.comunicaciones || '___'}) COMUNICACIONES, clase(${data.materiales?.medidorConPerfil?.especificaciones?.clase || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorConPerfil?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorConPerfil?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CONECTOR BIMETALICO (${data.materiales?.conectorBimetalicoPerno?.tipo || '___'}) PERNO</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorBimetalicoPerno?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorBimetalicoPerno?.cantidad || 0}</td>
                  </tr>

                  <!-- CON PERFIL DE CARGA Y MODEM INTERNO / TENSOR PARA ACOMETIDA -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">CON PERFIL DE CARGA Y MODEM INTERNO, clase (${data.materiales?.medidorConPerfilModem?.especificaciones?.clase || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorConPerfilModem?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.medidorConPerfilModem?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">TENSOR PARA ACOMETIDA CABLE CONCENTRICO</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tensorAcometida?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tensorAcometida?.cantidad || 0}</td>
                  </tr>

                  <!-- FILA VACÍA / OJO DE ALUMINIO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td colspan="4" style="border: 1px solid #34495e;">OJO DE ALUMINIO</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.ojoAluminio?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.ojoAluminio?.cantidad || 0}</td>
                  </tr>

                  <!-- Router y Varios / BREAKERS -->
                  <tr>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">Router y Varios</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                      <td colspan="4" style="border: 1px solid #34495e;">BREAKERS DE (${data.materiales?.breakers?.amperios || '___'}x${data.materiales?.breakers?.amperios || '___'})Amp.</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.breakers?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.breakers?.cantidad || 0}</td>
                  </tr>

                  <!-- GPRS / CONECTOR PARA VARILLA -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">GPRS (${data.materiales?.routerGPRS?.simCard || '___'}) SIM CARD</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.routerGPRS?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.routerGPRS?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CONECTOR PARA VARILLA</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorVarilla?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conectorVarilla?.cantidad || 0}</td>
                  </tr>

                  <!-- CONVERSORES / TENSOR PARA ACOMETIDA CABLE CONCENTRICO cambio -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">CONVERSORES</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conversores?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.conversores?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">TENSOR PARA ACOMETIDA CABLE CONCENTRICO cambio</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tensorCambio?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tensorCambio?.cantidad || 0}</td>
                  </tr>

                  <!-- BLOQUE DE PRUEBA / ALAMBRE DE COBRE -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">BLOQUE DE PRUEBA</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.bloquePrueba?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.bloquePrueba?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">ALAMBRE DE COBRE No. (${data.materiales?.alambreCobre?.calibre || '___'}) AWG</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.alambreCobre?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.alambreCobre?.cantidad || 0}</td>
                  </tr>

                  <!-- FILA VACÍA / VARILLA PUESTA A TIERRA -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td colspan="4" style="border: 1px solid #34495e;">VARILLA PUESTA A TIERRA(${data.materiales?.varillaPuestaTierra?.metros || '___'}) Mts.</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.varillaPuestaTierra?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.varillaPuestaTierra?.cantidad || 0}</td>
                  </tr>

                  <!-- TRANSFORMADORES DE CORRIENTE / TERMINAL MT -->
                  <tr>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">TRANSFORMADORES DE CORRIENTE</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                      <td colspan="4" style="border: 1px solid #34495e;">TERMINAL MT(${data.materiales?.terminalMT?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.terminalMT?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.terminalMT?.cantidad || 0}</td>
                  </tr>

                  <!-- USO EXTERIOR 600V / CURVA MT -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">USO EXTERIOR (${data.materiales?.tcUsoExterior600?.amperios || '___'}/${data.materiales?.tcUsoExterior600?.amperios2 || '___'}) Amp, clase (${data.materiales?.tcUsoExterior600?.clase || '___'}) de ventada 600Vol.</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoExterior600?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoExterior600?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">CURVA MT(${data.materiales?.curvaMT?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.curvaMT?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.curvaMT?.cantidad || 0}</td>
                  </tr>

                  <!-- USO INTERIOR 600V / FLEXI CONDUIT METALICO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">USO INTERIOR (${data.materiales?.tcUsoInterior600?.amperios || '___'}/${data.materiales?.tcUsoInterior600?.amperios2 || '___'}) Amp, clase (${data.materiales?.tcUsoInterior600?.clase || '___'}) de ventada 600Vol.</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoInterior600?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoInterior600?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">FLEXI CONDUIT METALICO(${data.materiales?.flexiConduit?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.flexiConduit?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.flexiConduit?.cantidad || 0}</td>
                  </tr>

                  <!-- USO EXTERIOR ALTA / TERMINAL FLEXI -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">USO EXTERIOR (${data.materiales?.tcUsoExteriorAlta?.kv || '___'}) Kv de (${data.materiales?.tcUsoExteriorAlta?.primario || '___'}) / (${data.materiales?.tcUsoExteriorAlta?.secundario || '___'}) Amp. clase (${data.materiales?.tcUsoExteriorAlta?.clase || '___'}).</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoExteriorAlta?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoExteriorAlta?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">TERMINAL FLEXI(${data.materiales?.terminalFlexi?.medida || '___'})"</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.terminalFlexi?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.terminalFlexi?.cantidad || 0}</td>
                  </tr>

                  <!-- USO INTERIOR ALTA / VACÍO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">USO INTERIOR (${data.materiales?.tcUsoInteriorAlta?.kv || '___'}/${data.materiales?.tcUsoInteriorAlta?.kv2 || '___'}) Kv de (${data.materiales?.tcUsoInteriorAlta?.primario || '___'}) / (${data.materiales?.tcUsoInteriorAlta?.secundario || '___'}) Amp. clase (${data.materiales?.tcUsoInteriorAlta?.clase || '___'}).</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoInteriorAlta?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tcUsoInteriorAlta?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>

                  <!-- TRANSFORMADORES DE POTENCIAL / SELLOS -->
                  <tr>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">TRANSFORMADORES DE POTENCIAL</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">SELLOS</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                  </tr>

                  <!-- USO EXTERIOR TP / ROTOSEAL -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">USO EXTERIOR (${data.materiales?.tpUsoExterior?.primario || '___'}) / (${data.materiales?.tpUsoExterior?.secundario || '___'}) Vol. clase (${data.materiales?.tpUsoExterior?.clase || '___'}).</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tpUsoExterior?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tpUsoExterior?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">ROTOSEAL DE COLOR (${data.materiales?.rotoseal?.color || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.rotoseal?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.rotoseal?.cantidad || 0}</td>
                  </tr>

                  <!-- USO INTERIOR TP / ESTAMPILLA -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">USO INTERIOR (${data.materiales?.tpUsoInterior?.primario || '___'}) / (${data.materiales?.tpUsoInterior?.secundario || '___'}) Vol. clase (${data.materiales?.tpUsoInterior?.clase || '___'}).</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tpUsoInterior?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.tpUsoInterior?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;">ESTAMPILLA</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.estampilla?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.estampilla?.cantidad || 0}</td>
                  </tr>

                  <!-- CABLES Y ALAMBRE -->
                  <tr>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">CABLES Y ALAMBRE</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>

                  <!-- CABLE CONCENTRICO -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">CABLE CONCENTRICO PARA ACOMETIDA (${data.materiales?.cableConcentrico?.calibre || '___'} X ${data.materiales?.cableConcentrico?.conductores || '___'}) + (${data.materiales?.cableConcentrico?.neutro || '___'})</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cableConcentrico?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cableConcentrico?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>

                  <!-- CABLE DE CONTROL -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">CABLE DE CONTROL (${data.materiales?.cableControl?.conductores || '___'}) X (${data.materiales?.cableControl?.calibre || '___'}) AWG</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cableControl?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cableControl?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>

                  <!-- CAJA Hermetica -->
                  <tr>
                      <td colspan="4" class="center bold" style="border: 1px solid #34495e;">CAJA Hermetica</td>
                      <td class="center bold" style="border: 1px solid #34495e;">UNI</td>
                      <td class="center bold" style="border: 1px solid #34495e;">ESTADO</td>
                      <td class="center bold" style="border: 1px solid #34495e;">CANT.</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>

                  <!-- SOBREPONER PARA MEDIDOR -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">SOBREPONER PARA MEDIDOR (${data.materiales?.cajaSobreponer?.fasico || '___'}) FASICO TIPO (${data.materiales?.cajaSobreponer?.tipo || '___'}).</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cajaSobreponer?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cajaSobreponer?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>

                  <!-- INCRUSTAR MEDIDOR -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">INCRUSTAR MEDIDOR (${data.materiales?.cajaIncrustar?.fasico || '___'}) FASICO TIPO (${data.materiales?.cajaIncrustar?.tipo || '___'}).</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cajaIncrustar?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cajaIncrustar?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>

                  <!-- TIPO GABINETE PARA MEDIDORES -->
                  <tr>
                      <td colspan="4" style="border: 1px solid #34495e;">TIPO GABINETE PARA MEDIDORES.</td>
                      <td class="center" style="border: 1px solid #34495e;">Un</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cajaGabinete?.estado || '___'}</td>
                      <td class="center" style="border: 1px solid #34495e;">${data.materiales?.cajaGabinete?.cantidad || 0}</td>
                      <td colspan="4" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                      <td class="center" style="border: 1px solid #34495e;"></td>
                  </tr>
              </tbody>
          </table>

          <!-- MEDIDOR INSTALADO -->
          <table class="medidor-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
              <tr>
                  <td colspan="13" class="section-title" style="border: 1px solid #34495e;">ESTADO DEL MATERIAL INSTALADO=PR:Provisional, VE:Venta, TE:Usuario, RE:Reutilizado, FI:Financiado &nbsp;&nbsp; ESTADO DEL MATERIAL RETIRADO=EA:Entregado al usuario, BC:Bodega Contratista, BE:Bodega, EMSA:PR</td>
              </tr>
              <tr>
                  <th colspan="7" class="field-label" style="border: 1px solid #34495e;">MEDIDOR INSTALADO</th>
                  <th colspan="5" class="field-label" style="border: 1px solid #34495e;">DISPOSICIÓN DE LOS SELLOS</th>
                  <th class="field-label" style="border: 1px solid #34495e;">COLOR</th>
              </tr>
              <tr>
                  <th class="field-label" style="border: 1px solid #34495e;">NÚMERO</th>
                  <th class="field-label" style="border: 1px solid #34495e;">MARCA</th>
                  <th class="field-label" style="border: 1px solid #34495e;">FASES</th>
                  <th class="field-label" style="border: 1px solid #34495e;">DÍGITOS</th>
                  <th class="field-label" style="border: 1px solid #34495e;">LECTURA</th>
                  <th class="field-label" style="border: 1px solid #34495e;">VOLTIOS</th>
                  <th class="field-label" style="border: 1px solid #34495e;">AMPERIOS</th>
                  <th>TP</th>
                  <th>${data.sello_tp_1 || ''}</th>
                  <th>${data.sello_tp_2 || ''}</th>
                  <th>${data.sello_tp_3 || ''}</th>
                  <th>${data.sello_tp_4 || ''}</th>
                  <th>${data.sello_color_1 || ''}</th>
              </tr>
              <tr>
                  <td rowspan="2" style="border: 1px solid #34495e;">${data.medidor_numero || ''}</td>
                  <td rowspan="2" style="border: 1px solid #34495e;">${data.medidor_marca || ''}</td>
                  <td rowspan="2" style="border: 1px solid #34495e;">${data.medidor_fases || ''}</td>
                  <td rowspan="2" style="border: 1px solid #34495e;">${data.medidor_digitos || ''}</td>
                  <td rowspan="2" style="border: 1px solid #34495e;">${data.medidor_lectura || ''}</td>
                  <td rowspan="2" style="border: 1px solid #34495e;">${data.medidor_voltios || ''}</td>
                  <td rowspan="2" style="border: 1px solid #34495e;">${data.medidor_amperios || ''}</td>
                  <td>TB</td>
                  <th>${data.sello_tb_1 || ''}</th>
                  <th>${data.sello_tb_2 || ''}</th>
                  <th>${data.sello_tb_3 || ''}</th>
                  <th>${data.sello_tb_4 || ''}</th>
                  <th>${data.sello_color_2 || ''}</th>
          
              </tr>
              <tr>
                  <td>EST</td>
                  <th>${data.sello_est_1 || ''}</th>
                  <th>${data.sello_est_2 || ''}</th>
                  <th>${data.sello_est_3 || ''}</th>
                  <th>${data.sello_est_4 || ''}</th>
                  <th>${data.sello_color_3 || ''}</th>
              </tr>
          </table>

          <!-- ATENCIÓN Y AUTORIZACIÓN -->
          <div class="text-justify" style="border: 1px solid #34495e; font-size: 12px; padding: 8px; line-height: 1.4; margin-bottom: 10px;">
              <span class="field-label" style="font-weight: bold;">ATENDIÓ LA VISITA EL (LOS) REPRESENTANTE (S) LEGAL (S) DEL INMUEBLE, EL (LOS) SEÑOR (S):</span>
              <strong>${data.usuarioVisita || '________________________________________________________________________________________________'}</strong>
              <br />
              QUIEN AUTORIZA EL COBRO DE LOS ANTERIORES MATERIALES, DE CONTADO ( <strong>${data.tipoPago === 'contado' ? 'X' : ' '}</strong> ) , FINANCIADO ( <strong>${data.tipoPago === 'financiado' ? 'X' : ' '}</strong> ) .
          </div>

          <!-- OBSERVACIONES -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
              <tr>
                  <td class="field-label" style="border: 1px solid #34495e;">OBSERVACIONES:</td>
              </tr>
              <tr>
                  <td class="field-value" style="border: 1px solid #34495e; height: 60px; vertical-align: top;">${data.observaciones || ''}</td>
              </tr>
          </table>

          <!-- FIRMAS -->
          <table class="firma-table" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                  <th class="firma-header" style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef; border: 1px solid #34495e;" scope="col">FUNCIONARIO RESPONSABLE DE LA REVISIÓN</th>
                  <th class="firma-header" style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef; border: 1px solid #34495e;" scope="col">SUSCRIPTOR O USUARIO</th>
                  <th class="firma-header" style="width: 33.34%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef; border: 1px solid #34495e;" scope="col">SUPERVISOR Y/O INTERVENTOR</th>
              </tr>
              <tr>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">NOMBRE:</span>
                          <div class="firma-value">${userData.name || 'No especificado'}</div>
                      </div>
                  </td>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">NOMBRE:</span>
                          <div class="firma-value">${data.usuarioVisita || 'No especificado'}</div>
                      </div>
                  </td>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">NOMBRE:</span>
                          <div class="firma-value">${data.otroRepresentante || 'No especificado'}</div>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">FIRMA:</span>
                          <div class="firma-value">
                              ${signatures.firmaFuncionario
                                  ? `<div class="firma-imagen"><img src="${signatures.firmaFuncionario}" alt="Firma Funcionario"></div>`
                                  : '<span class="firma-faltante">No disponible</span>'
                              }
                          </div>
                      </div>
                  </td>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">FIRMA:</span>
                          <div class="firma-value">
                              ${signatures.firmaSuscriptor
                                  ? `<div class="firma-imagen"><img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor"></div>`
                                  : '<span class="firma-faltante">No disponible</span>'
                              }
                          </div>
                      </div>
                  </td>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">FIRMA:</span>
                          <div class="firma-value">
                              ${signatures.firmaSupervisor
                                  ? `<div class="firma-imagen"><img src="${signatures.firmaSupervisor}" alt="Firma Supervisor"></div>`
                                  : '<span class="firma-faltante">No disponible</span>'
                              }
                          </div>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                          <div class="firma-value">${userData.cc || 'No especificado'}</div>
                      </div>
                  </td>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                          <div class="firma-value">${data.documentoVisitante || 'No especificado'}</div>
                      </div>
                  </td>
                  <td style="border: 1px solid #34495e; padding: 5px;">
                      <div class="firma-row">
                          <span class="firma-text">C.C/TP/MP/CODIGO:</span>
                          <div class="firma-value">${data.ccOtroRepresentante || 'No especificado'}</div>
                      </div>
                  </td>
              </tr>
          </table>

          <!-- COPIAS -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                  <td class="center field-label" style="width: 50%; border: 1px solid #34495e;">ORIGINAL: EMPRESA</td>
                  <td class="center field-label" style="width: 50%; border: 1px solid #34495e;">COPIA VERDE: USUARIO</td>
              </tr>
          </table>

          <!-- FOOTER -->
          <div class="legal-text" style="margin-top: 10px;">
              NO PAGAR NI REALIZAR NEGOCIACIONES CON EL OPERARIO POR NINGÚN CONCEPTO. DENUNCIE CUALQUIER IRREGULARIDAD AL TELÉFONO 608-6614000 EXT.150
          </div>
      </div>
      <!-- Fin Hoja 3 -->

    </body>
    </html>
      `;
    };

    // Función para abrir vista previa del PDF
    const handlePreviewPDF = () => {
      const html = generatePDFHtml();
      setPdfHtml(html);
      setShowPreview(true);
    };

    // Función para descargar el PDF
    const handleDownloadPDF = () => { 
    const html = generatePDFHtml(); 
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5], // Márgenes más pequeños
      filename: `Acta_Revision_No_${data.numero_acta || '1001'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 }, // Calidad máxima
      html2canvas: { 
        scale: 5, // ← AUMENTA ESTO (3-5 para mejor calidad)
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: false,
        dpi: 300, // ← AÑADE ESTO
        windowWidth: 1200 // ← AÑADE ESTO
      },
      jsPDF: { 
        unit: 'in', 
        format: 'legal',
        orientation: 'portrait',
        compress: false,
        precision: 16 // ← AÑADE ESTO
      }
    };
      html2pdf().set(opt).from(html).save(); 
    };

    // Función para imprimir el PDF
    const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${"ActaRevision No." + (data.numero_acta || '1001') + "_" + new Date().toISOString().slice(0,10)}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              width: 100%;
            }
            @media print {
            body {
              zoom: 0.9;
            }
              @page {
                size: legal;  /* Especificar tamaño legal */
                margin: 0.5in;
              }
              body { 
                margin: 0;
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body>
          ${generatePDFHtml()}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }
          </script>
        </body>
      </html>
      `);
  printWindow.document.close();
};

const handleCloseModal = () => {
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.modalOverlay');
  
  if (modal && overlay) {
    modal.classList.add('closing');
    overlay.style.opacity = '0';
    
    setTimeout(() => {
      setShowPreview(false);
    }, 200);
  } else {
    setShowPreview(false);
  }
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div>
              <h2 className={styles.modalTitle}>Vista Previa del Acta</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <iframe
                title="Vista previa del PDF"
                srcDoc={pdfHtml}
                className={styles.previewIframe}
              />
              <div className={styles.modalButtons}>
                <button 
                  onClick={handlePrintPDF}
                  className={styles.printButton}
                >
                  <FiPrinter /> Imprimir
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className={styles.pdfButton}
                >
                  <FiDownload /> Descargar
                </button>
                {/*  BOTÓN DE GUARDAR DATOS EN TXT */}
                <button 
                  onClick={saveDataToTxt}
                  className={styles.txtButton}
                >
                  <FiDownload /> Descargar (TXT)
                </button>
                {/* BOTÓN DE ENVIAR POR CORREO */}
                <button 
                  onClick={handleOpenEmailModal}
                  className={styles.emailButton}
                >
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