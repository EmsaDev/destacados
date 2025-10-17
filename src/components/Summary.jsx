import React, { useState } from 'react';
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
import { FiEye, FiDownload, FiPrinter, FiSend, FiX, FiArrowLeft  } from 'react-icons/fi';

function Summary({ data, prevStep }) {
  const [showPreview, setShowPreview] = useState(false);
  const [pdfHtml, setPdfHtml] = useState('');
  const [base64Logo, setBase64Logo] = useState('');
  const [signatures, setSignatures] = useState({
  firmaFuncionario: localStorage.getItem('firmaFuncionario') || '',
  firmaSuscriptor: localStorage.getItem('firmaSuscriptor') || '',
  firmaSupervisor: localStorage.getItem('firmaSupervisor') || ''
});
const [diagramImages, setDiagramImages] = useState({
  diagramaUnifilar: localStorage.getItem('diagrama_unifilar') || '',
  diagramaFasorial: localStorage.getItem('diagrama_fasorial') || '',
  diagramaConexiones: localStorage.getItem('diagrama_conexiones') || ''
});

  // Datos del usuario desde localStorage
  const userData = {
    name: localStorage.getItem('userName') || '',
    cc: localStorage.getItem('userCC') || '',
    derecho: localStorage.getItem('derecho') || '',
    nombre: localStorage.getItem('nombre') || ''
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
    // ... otros datos de formularios anteriores
  } = data;

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
      padding: 15px;
      background-color: #ffffff;
    }
    
    .page {
      page-break-after: always;
      margin-bottom: 20px;
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
      color: #495057;
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
  </style>
</head>
<body>
  <!-- HOJA 1: ACTA DE REVISIÓN ORIGINAL -->
      <div class="page">
        <!-- Copia todo el HTML de la hoja 1 aquí -->
         <div class="header-table-content">
        <table class="header-table">
          <tr>
            <td style="width: 70%; padding: 5px; text-align: center; border: none;">
                <img src="${base64Logo}" alt="Logo" style="height:50px;"/>
            </td>
            <td style="width: 30%; padding: 0; ">
                <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-left: 5px;">
                    <tr>
                        <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Código:</td>
                        <td style="border: 1px solid #34495e;">FO-GD-CP-03</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #34495e; font-weight: bold; background-color: #ecf0f1;">Fecha:</td>
                        <td style="border: 1px solid #34495e;">1/02/2023</td>
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
            <td class="field-value">${data.solicitud || ''}</td>
            <td class="field-label">Código de cliente</td>
            <td class="field-value">${data.codigo || ''}</td>
            <td class="field-label">ASIC</td>
            <td class="field-value">${data.asic || ''}</td>
            <td class="field-label">Revisión No.</td>
            <td colspan="2" class="field-value">
                <span id="revision">${data.revision || ''}</span>
            </td>
        </tr>
        <tr>
            <td colspan="9" class="text-justify">
                <p style="font-size: 10px; line-height: 1.4; margin: 0;">
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
        <tr>
            <td class="field-label">DEPENDENCIA</td>
            <td class="field-value">EMSA</td>
            <td class="field-value">CGM</td>
            <td class="field-value">CONTRATISTA</td>
            <td class="field-value">SYPELC</td>
            <td class="field-label">ITEM DE PAGO</td>
            <td class="field-value">1</td>
            <td class="field-value">2</td>
            <td class="field-value">3</td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td class="section-title" colspan="9">DATOS GENERALES DEL SUSCRIPTOR</td>
        </tr>
        <tr>
            <td colspan="2" class="field-label">NOMBRE
              <p style="text-align: center; margin: 0;">
                <strong>${data.nombre || '______'}</strong>
              </p>
            </td>
            <td class="field-label">CARGA KW</td>
            <td class="field-label">CICLO</td>
            <td class="field-label">FACTOR</td>
            <td class="field-label">FACTOR</td>
            <td class="field-label">FACTOR</td>
        </tr>
        <tr>
            <td colspan="3" class="field-label">DIRECCIÓN <br> POBLACIÓN
              <p style="text-align: center; margin: 0; padding:0">
                <strong>${data.direccion || '______'}</strong>
              </p>
            </td>
            <td class="field-label">NÚMERO MACROMEDIDOR</td>
            <td class="field-value">123987645</td>
            <td class="field-label">NODO TRAFO</td>
            <td class="field-value">
                COMERCIALIZADOR:<br>
                <strong style="color: #2980b9;">EMSA</strong>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td class="section-title" colspan="9">DATOS DEL SUSCRIPTOR Y EQUIPO DE MEDIDA ENCONTRADOS</td>
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
        <td style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">FUNCIONARIO RESPONSABLE DE LA REVISIÓN</td>
        <td style="width: 33.33%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">SUSCRIPTOR O USUARIO</td>
        <td style="width: 33.34%; text-align: left; font-weight: bold; padding: 8px; background-color: #e9ecef;">SUPERVISOR Y/O INTERVENTOR</td>
    </tr>
    <tr>
        <td class="firma-label" style="text-align: left; width: 33.33%;">NOMBRE: ${userData.name || 'No especificado'}</td>
        <td class="firma-label" style="text-align: left; width: 33.33%;">NOMBRE: ${data.usuarioVisita || 'No especificado'}</td>
        <td class="firma-label" style="text-align: left; width: 33.34%;">NOMBRE: ${data.otroRepresentante || 'No especificado'}</td>
    </tr>
    <tr>
        <td class="firma-label" style="text-align: left; width: 33.33%;">
            <div class="firma-container" style="justify-content: flex-start;">
                <span class="firma-text">FIRMA:</span>
                ${signatures.firmaFuncionario ? 
                    `<div class="firma-imagen"><img src="${signatures.firmaFuncionario}" alt="Firma Funcionario" style="max-width: 100px; max-height: 40px;"/></div>` : 
                    '<span class="firma-faltante">No disponible</span>'
                }
            </div>
        </td>
        <td class="firma-label" style="text-align: left; width: 33.33%;">
            <div class="firma-container" style="justify-content: flex-start;">
                <span class="firma-text">FIRMA:</span>
                ${signatures.firmaSuscriptor ? 
                    `<div class="firma-imagen"><img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor" style="max-width: 100px; max-height: 40px;"/></div>` : 
                    '<span class="firma-faltante">No disponible</span>'
                }
            </div>
        </td>
        <td class="firma-label" style="text-align: left; width: 33.34%;">
            <div class="firma-container" style="justify-content: flex-start;">
                <span class="firma-text">FIRMA:</span>
                ${signatures.firmaSupervisor ? 
                    `<div class="firma-imagen"><img src="${signatures.firmaSupervisor}" alt="Firma Supervisor" style="max-width: 100px; max-height: 40px;"/></div>` : 
                    '<span class="firma-faltante">No disponible</span>'
                }
            </div>
        </td>
    </tr>
    <tr>
        <td class="firma-label" style="text-align: left; width: 33.33%;">CC/TP/MP/CODIGO: ${userData.cc || 'No especificado'}</td>
        <td class="firma-label" style="text-align: left; width: 33.33%;">C.C/TP/MP/CODIGO: ${data.documentoVisitante || 'No especificado'}</td>
        <td class="firma-label" style="text-align: left; width: 33.34%;">C.C/TP/MP/CODIGO: ${data.ccOtroRepresentante || 'No especificado'}</td>
    </tr>
</table>
      </div>


  <!-- HOJA 2: FORMATO ACTA DE DIAGRAMAS -->
  <div class="page">
    <!-- Encabezado hoja 2 -->
    <div class="header-table-content">
      <table class="header-table">
        <tr>
          <td style="width: 70%; padding: 5px; text-align: center; border: none;">
            <img src="${base64Logo}" alt="Logo" class="logo-img"/>
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
          <span id="numero">${data.numero_acta || '52976'}</span>
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
        <td>${data.lineaDedicada === 'SI' ? 'X' : ' '} SI</td>
        <td></td>
        <td>${data.lineaDedicada === 'NO' ? 'X' : ' '} NO</td>
        <td></td>
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
    <table>
      <tr>
        <td class="section-title">DIAGRAMA UNIFILAR</td>
        <td class="section-title">DIAGRAMA FASORIAL</td>
      </tr>
      <tr>
        <td>
          <div class="diagram-container">
            <img style="height: 180px;" class="diagram-img" src="${diagramImages.diagramaUnifilar || './unifilar.png'}" alt="Diagrama Unifilar">
          </div>
        </td>
        <td>
          <div class="diagram-container">
            <img class="diagram-img" src="${diagramImages.diagramaFasorial || './Fasorial.png'}" alt="Diagrama Fasorial">
          </div>
        </td>
      </tr>
      <tr>
        <td class="section-title" colspan="2">DIAGRAMA DE CONEXIONES</td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="diagram-container">
            <img class="diagram-img" src="${diagramImages.diagramaConexiones || './conexiones.png'}" alt="Diagrama de Conexiones">
          </div>
        </td>
      </tr>
    </table>

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
        <td class="section-title" colspan="2">FACTOR SIEC</td>
        <td class="section-title" colspan="8">OBSERVACIONES GENERALES</td>
        <td rowspan="2" class="section-title" colspan="5">ADECUACIONES Y MEJORAS QUE NECESITA LA INSTALACIÓN ELÉCTRICA</td>
      </tr>
      <tr>
        <td>FACTOR SIEC</td>
        <td>${data.factorData?.factorSiec || ''}</td>
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
        <td>FACTOR ENCONTRADO</td>
        <td>${data.factorData?.factorEncontrado || ''}</td>
        <td>RED</td>
        <td class="estado-cell">${data.observaciones?.redMT === 'Bueno' ? 'X' : ''}</td>
        <td class="estado-cell">${data.observaciones?.redMT === 'Regular' ? 'X' : ''}</td>
        <td class="estado-cell">${data.observaciones?.redMT === 'Malo' ? 'X' : ''}</td>
        <td>TPS</td>
        <td class="estado-cell">${data.observaciones?.tps === 'Bueno' ? 'X' : ''}</td>
        <td class="estado-cell">${data.observaciones?.tps === 'Regular' ? 'X' : ''}</td>
        <td class="estado-cell">${data.observaciones?.tps === 'Malo' ? 'X' : ''}</td>
        <td rowspan="9" colspan="5" style="vertical-align: top; font-size: 9px;">
          <ul class="checkbox-list">
            <li><input type="checkbox" ${data.adecuaciones?.cambiarMedidor || data.adecuaciones?.instalarMedidor ? 'checked' : ''}> Cambiar o instalar el medidor</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarMedidor ? 'checked' : ''}> Cambiar o instalar TC</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarMedidor ? 'checked' : ''}> Cambiar o Instalar TP</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiarCaja || data.adecuaciones?.instalarCaja ? 'checked' : ''}> Cambiar o instalación de caja para el medidor</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiarPuestaTierra || data.adecuaciones?.instalarPuestaTierra ? 'checked' : ''}> Cambiar o instalar sistema de puesta a tierra</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarBloquePruebas ? 'checked' : ''}> Cambiar o instalar Bloque de Pruebas</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarProteccionesElectricas ? 'checked' : ''}> Cambiar o instalar Protecciones eléctricas</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarCableSenal ? 'checked' : ''}> Cambiar o instalar Cable de señal (según norma)</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarSistemaComunicacion ? 'checked' : ''}> Cambiar o instalar sistema de comunicación</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarModem ? 'checked' : ''}> Cambiar o instalar MODEM</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarProteccionesCommunicacion ? 'checked' : ''}> Cambiar o instalar Protecciones en comunicaciones</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarDuctosCableSeñal ? 'checked' : ''}> Cambiar o instalar ductos para cables de señal</li>
            <li><input type="checkbox" ${data.adecuaciones?.otros ? 'checked' : ''}> Otros: ${data.adecuaciones?.otrosTexto || ''}</li>
            <li><input type="checkbox" ${data.adecuaciones?.adecuaroInstalaraSeguridadCeldas ? 'checked' : ''}> Adecuar o instalar seguridad a las celdas de medidor</li>
            <li><input type="checkbox" ${data.adecuaciones?.cambiaroInstalarCelda ? 'checked' : ''}> Cambiar o instalar Celda para medida(TP'S y TC'S) norma</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>% ERROR FACTOR</td>
        <td>${data.factorData?.errorFactor || ''}</td>
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
        <td>FACTOR FINAL</td>
        <td>${data.factorData?.factorFinal || ''}</td>
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
        <td rowspan="5"></td>
        <td rowspan="5"></td>
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
        <td>EQUIPO PATRON</td>
        <td class="estado-cell"></td>
        <td class="estado-cell"></td>
        <td class="estado-cell"></td>
        <td></td>
        <td class="estado-cell"></td>
        <td class="estado-cell"></td>
        <td class="estado-cell"></td>
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
        <td style="text-align: justify; padding: 8px;">
          ${data.informe || 'LA EMPRESA, con base en lo establecido en la ley 142 de 1994 y en su contrato de Servicios Públicos con Condiciones Uniformes, se permite informarle que usted dispone a partir de la fecha un Periodo de Facturación (30 días calendario), para instalar cambiar o adecuar las anomalías aquí indicadas, cumpliendo con las NORMAS TÉCNICAS exigidos por la EMPRESA; pasado este período y de no tomar las medidas necesarias para adquirirlos, las instalación(es) provicional(es) pasarán a ser definitiva(s) con cargo a su cuenta.'}
        </td>
      </tr>
    </table>

    <!-- Firmas hoja 2 -->
    <table class="firma-table">
      <tr>
        <td>FUNCIONARIO RESPONSABLE DE LA REVISIÓN</td>
        <td>SUPERVISOR Y/O INTERVENTOR</td>
        <td>SUSCRIPTOR O USUARIO</td>
      </tr>
      <tr>
        <td class="firma-label">NOMBRE: ${userData.name || 'No especificado'}</td>
        <td class="firma-label">NOMBRE: ${data.otroRepresentante || 'No especificado'}</td>
        <td class="firma-label">NOMBRE: ${data.usuarioVisita || 'No especificado'}</td>
      </tr>
      <tr>
        <td class="firma-label">
          <div class="firma-container">
            <span class="firma-text">FIRMA:</span>
            ${signatures.firmaFuncionario ? 
              `<div class="firma-imagen"><img src="${signatures.firmaFuncionario}" alt="Firma Funcionario" /></div>` : 
              '<span class="firma-faltante">No disponible</span>'
            }
          </div>
        </td>
        <td class="firma-label">
          <div class="firma-container">
            <span class="firma-text">FIRMA:</span>
            ${signatures.firmaSupervisor ? 
              `<div class="firma-imagen"><img src="${signatures.firmaSupervisor}" alt="Firma Supervisor" /></div>` : 
              '<span class="firma-faltante">No disponible</span>'
            }
          </div>
        </td>
        <td class="firma-label">
          <div class="firma-container">
            <span class="firma-text">FIRMA:</span>
            ${signatures.firmaSuscriptor ? 
              `<div class="firma-imagen"><img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor" /></div>` : 
              '<span class="firma-faltante">No disponible</span>'
            }
          </div>
        </td>
      </tr>
      <tr>
        <td class="firma-label">CC/TP/MP/CODIGO: ${userData.cc || 'No especificado'}</td>
        <td class="firma-label">C.C/TP/MP/CODIGO: ${data.ccOtroRepresentante || 'No especificado'}</td>
        <td class="firma-label">C.C/TP/MP/CODIGO: ${data.documentoVisitante || 'No especificado'}</td>
      </tr>
    </table>

    <div style="font-size: 10px; text-align: center; margin-top: 10px;">
      ORIGINAL: EMPRESA | COPIA VERDE: USUARIO | NO ENTREGAR DINERO AL OPERARIO
    </div>
  </div>
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
    margin: 0.5,
    filename: "ActaRevision No." + (data.numero_acta || '1001') + "_" + new Date().toISOString().slice(0,10) + ".pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: "in", 
      format: "legal", 
      orientation: "portrait" 
    },
  };
  html2pdf().set(opt).from(html).save();
};
  // Función para imprimir el PDF
  const handlePrintPDF = () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Imprimir Acta de Revisión</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            width: 100%;
          }
          @media print {
            @page {
              size: legal portrait;  /* Especificar tamaño legal */
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
    }, 200); // Debe coincidir con la duración de la animación
  } else {
    setShowPreview(false);
  }
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
          <div className={styles.sectionContent}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Número de Acta:</span>
              <span className={styles.value}>{data.numero_acta || '1001'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ciudad:</span>
              <span className={styles.value}>{data.ciudad || 'No especificada'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Resultado:</span>
              <span className={styles.value}>{data.resultado || 'No especificado'}</span>
            </div>
          </div>
        </div>

        {/* Sección: Códigos y Solicitud */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🔢 Códigos y Números</h2>
          <div className={styles.sectionContent}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Código Suscriptor:</span>
              <span className={styles.value}>{data.codigo || 'No ingresado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Código ASIC:</span>
              <span className={styles.value}>{data.asic || 'No ingresado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Solicitud No:</span>
              <span className={styles.value}>{data.solicitudNo || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Revisión No:</span>
              <span className={styles.value}>{data.revisionNo || 'No especificado'}</span>
            </div>
          </div>
        </div>

        {/* Sección: Dirección */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📍 Ubicación</h2>
          <div className={styles.sectionContent}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Nombre del cliente:</span>
              <span className={styles.value}>{data.nombre || ''}</span>
              <span className={styles.label}>Dirección:</span>
              <span className={styles.value}>{data.direccion || 'No especificada'}</span>
            </div>
          </div>
        </div>

        {/* Sección: Representantes */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>👥 Representantes</h2>
          <div className={styles.sectionContent}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Representante EMSA:</span>
              <span className={styles.value}>{userData.name || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>CC Representante EMSA:</span>
              <span className={styles.value}>{userData.cc || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Otro Representante:</span>
              <span className={styles.value}>{data.otroRepresentante || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>CC Otro Representante:</span>
              <span className={styles.value}>{data.ccOtroRepresentante || 'No especificado'}</span>
            </div>
          </div>
        </div>

        {/* Sección: Visita */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>👤 Información de Visita</h2>
          <div className={styles.sectionContent}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Usuario que recibe:</span>
              <span className={styles.value}>{data.usuarioVisita || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Documento Visitante:</span>
              <span className={styles.value}>{data.documentoVisitante || 'No especificado'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Tipo de Usuario:</span>
              <span className={styles.value}>
                {data.tipoUsuario ? capitalize(data.tipoUsuario) : 'No especificado'}
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Derecho */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>⚖️ Derecho del Usuario</h2>
          <div className={styles.sectionContent}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Hace uso de su derecho:</span>
              <span className={`${styles.value} ${data.derecho ? styles[data.derecho] : ''}`}>
                {data.derecho === 'SI' ? '✅ Sí' : data.derecho === 'NO' ? '❌ No' : 'No especificado'}
              </span>
            </div>
          </div>
        </div>


        {/* Sección: Texto Generado */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📄 Texto Generado</h2>
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

{/* Sección de Diagramas */}
<div className={styles.section}>
  <h2 className={styles.sectionTitle}>📊 Diagramas Seleccionados</h2>
  <div className={styles.diagramSummary}>
    
    {/* Diagrama Unifilar */}
    <div className={styles.diagramItem}>
      <h3 className={styles.diagramTitle}>Diagrama Unifilar</h3>
      <div className={styles.diagramDetails}>
        <p><strong>Selección:</strong> {diagramaUnifilar ? getDiagramName(diagramaUnifilar) : 'No seleccionado'}</p>
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

    {/* Diagrama Fasorial */}
    <div className={styles.diagramItem}>
      <h3 className={styles.diagramTitle}>Diagrama Fasorial</h3>
      <div className={styles.diagramDetails}>
        <p><strong>Selección:</strong> {diagramaFasorial ? getDiagramName(diagramaFasorial) : 'No seleccionado'}</p>
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

    {/* Diagrama de Conexiones */}
    <div className={styles.diagramItem}>
      <h3 className={styles.diagramTitle}>Diagrama de Conexiones</h3>
          <div className={styles.diagramDetails}>
            <p><strong>Selección:</strong> {diagramaConexiones ? getDiagramName(diagramaConexiones) : 'No seleccionado'}</p>
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
      {/* Sección de Configuración de Línea */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Configuración de Línea</h2>
        <div className={styles.sectionContent}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Línea Dedicada:</span>
            <span className={styles.value}>{lineaDedicada || 'No especificado'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Tipo de Frontera:</span>
            <span className={styles.value}>{tipoFrontera || 'No especificado'}</span>
          </div>
        </div>
      </div>

      {/* Sección de Pruebas TP's */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔌 Prueba de Transformadores de Potencial (TP's)</h2>
        <div className={styles.testSummary}>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>Voltaje</th>
                <th>Primario (V)</th>
                <th>Secundario (V)</th>
                <th>RTP</th>
                <th>% Error</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>V_R</td>
                <td>{tpData.vRPrimario || '-'}</td>
                <td>{tpData.vRSecundario || '-'}</td>
                <td>{tpData.rtp || '-'}</td>
                <td>{tpData.errorVR || '-'}</td>
              </tr>
              <tr>
                <td>V_S</td>
                <td>{tpData.vSPrimario || '-'}</td>
                <td>{tpData.vSSecundario || '-'}</td>
                <td>{tpData.rtp || '-'}</td>
                <td>{tpData.errorVS || '-'}</td>
              </tr>
              <tr>
                <td>V_T</td>
                <td>{tpData.vTPrimario || '-'}</td>
                <td>{tpData.vTSecundario || '-'}</td>
                <td>{tpData.rtp || '-'}</td>
                <td>{tpData.errorVT || '-'}</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td colSpan="4" className={styles.label}>% Error Promedio:</td>
                <td className={styles.value}>{tpData.errorPromedio || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Pruebas TC's */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Prueba de Transformadores de Corriente (TC's)</h2>
        <div className={styles.testSummary}>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Primario (A)</th>
                <th>Secundario (A)</th>
                <th>RTC</th>
                <th>% Error</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>I_R</td>
                <td>{tcData.vRPrimario || '-'}</td>
                <td>{tcData.vRSecundario || '-'}</td>
                <td>{tcData.rtc || '-'}</td>
                <td>{tcData.errorVR || '-'}</td>
              </tr>
              <tr>
                <td>I_S</td>
                <td>{tcData.vSPrimario || '-'}</td>
                <td>{tcData.vSSecundario || '-'}</td>
                <td>{tcData.rtc || '-'}</td>
                <td>{tcData.errorVS || '-'}</td>
              </tr>
              <tr>
                <td>I_T</td>
                <td>{tcData.vTPrimario || '-'}</td>
                <td>{tcData.vTSecundario || '-'}</td>
                <td>{tcData.rtc || '-'}</td>
                <td>{tcData.errorVT || '-'}</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td colSpan="4" className={styles.label}>% Error Promedio:</td>
                <td className={styles.value}>{tcData.errorPromedio || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Factor SIEC */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📈 Factor SIEC</h2>
        <div className={styles.factorGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Factor SIEC:</span>
            <span className={styles.value}>{factorData.factorSiec || '-'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Factor Encontrado:</span>
            <span className={styles.value}>{factorData.factorEncontrado || '-'}</span>
          </div>
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

      {/* Sección de Observaciones */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>👀 Observaciones Generales</h2>
        <div className={styles.observacionesGrid}>
          {Object.entries(observaciones).map(([equipo, estado]) => (
            estado && (
              <div key={equipo} className={styles.observacionItem}>
                <span className={styles.label}>{equipo}:</span>
                <span className={`${styles.value} ${styles[estado.toLowerCase()]}`}>
                  {estado}
                </span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Sección de Adecuaciones */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔧 Adecuaciones y Mejoras</h2>
        <div className={styles.adecuacionesList}>
          {getAdecuacionesSeleccionadas().map((adecuacion, index) => (
            <div key={index} className={styles.adecuacionItem}>
              • {adecuacion}
            </div>
          ))}
          {adecuaciones.otros && adecuaciones.otrosTexto && (
            <div className={styles.adecuacionItem}>
              • Otros: {adecuaciones.otrosTexto}
            </div>
          )}
        </div>
      </div>

      {/* Sección de Informe */}
      {informe && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📝 Informe</h2>
          <div className={styles.informeContent}>
            <p>{informe}</p>
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
          <h3 className={styles.signatureTitle}>Supervisor y/o Interventor</h3>
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
          onClick={() => console.log('Enviando datos:', data)}
          className={styles.primaryButton}
        >
          <FiSend /> Finalizar y Enviar
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;