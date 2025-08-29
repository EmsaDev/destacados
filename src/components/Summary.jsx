import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import styles from './Summary.module.css';
import logo from '../assets/images/logo-4@3x.png';

function Summary({ data, prevStep }) {
  const [showPreview, setShowPreview] = useState(false);
  const [pdfHtml, setPdfHtml] = useState('');
  const [base64Logo, setBase64Logo] = useState('');
  const [signatures, setSignatures] = useState({
  firmaFuncionario: localStorage.getItem('firmaFuncionario') || '',
  firmaSuscriptor: localStorage.getItem('firmaSuscriptor') || '',
  firmaSupervisor: localStorage.getItem('firmaSupervisor') || ''
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

  // Generar HTML para el PDF
  const generatePDFHtml = () => {
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
    body {
        font-family: sans-serif;
        font-size: 10px;
        margin: 20px;
        border: 2px solid #2c3e50;
        border-radius: 12px;
        padding: 10px;
        background-color: #ffffff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
        background-color: #e9ecef; /* Gris claro en lugar de azul */
        color: #2c3e50; /* Texto oscuro para mejor contraste */
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
        background-color: #e9ecef; /* Gris claro en lugar de azul oscuro */
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
        background-color: #f8f9fa; /* Gris muy claro */
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
        background-color: #f8f9fa; /* Gris claro en lugar de amarillo */
        border: 1px solid #dee2e6;
        border-radius: 5px;
        font-size: 9px;
        line-height: 1.4;
        color: #495057;
        text-align: justify;
    }
    
    @media print {
        body {
            border: none;
            box-shadow: none;
            margin: 0;
            padding: 10px;
            font-size: 9px;
        }
        
        .firma-table tr:first-child td {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            color: #2c3e50 !important;
        }
        
        .section-title {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            color: #2c3e50 !important;
        }
        
        .firma-imagen img {
            max-height: 45px;
            border: 1px solid #ccc;
        }
        
        .header-table-content {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
        }
        
        .legal-text {
            background-color: #ff3cd !important;
            border: 1px solid #ffeaaa7 !important;}
            color:#856404;
            -webkit-print-color-adjust: exact;
        }
        
        .field-label {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
        }
        
        /* Ahorro de tinta - eliminar sombras y degradados */
        * {
            box-shadow: none !important;
            text-shadow: none !important;
        }
    }
</style>
      </head>
      <body>
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
            <td>FUNCIONARIO RESPONSABLE DE LA REVISIÓN</td>
            <td>SUSCRIPTOR O USUARIO</td>
            <td>SUPERVISOR Y/O INTERVENTOR</td>
        </tr>
        <tr>
            <td class="firma-label">NOMBRE: ${userData.name || 'No especificado'}</td>
            <td class="firma-label">NOMBRE: ${data.usuarioVisita || 'No especificado'}</td>
            <td class="firma-label">NOMBRE: ${data.otroRepresentante || 'No especificado'}</td>
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
                    ${signatures.firmaSuscriptor ? 
                        `<div class="firma-imagen"><img src="${signatures.firmaSuscriptor}" alt="Firma Suscriptor" /></div>` : 
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
        </tr>
        <tr>
        <tr>
            <td class="firma-label">CC/TP/MP/CODIGO: ${userData.cc || 'No especificado'}</td>
            <td class="firma-label">C.C/TP/MP/CODIGO: ${data.documentoVisitante || 'No especificado'}</td>
            <td class="firma-label">C.C/TP/MP/CODIGO: ${data.ccOtroRepresentante || 'No especificado'}</td>
        </tr>
    </table>
</body>
      <div class="footer">
          <p>Documento generado electrónicamente por EMSA ESP</p>
          <p>${new Date().toLocaleString('es-ES')}</p>
      </div>      
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
          ← Volver a Editar
        </button>
        
        <button 
          type="button" 
          onClick={handlePreviewPDF}
          className={styles.previewButton}
        >
          👁️ Vista Previa PDF
        </button>
        
        <button 
          type="button" 
          onClick={() => console.log('Enviando datos:', data)}
          className={styles.primaryButton}
        >
          ✅ Finalizar y Enviar
        </button>
      </div>

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Vista Previa del PDF</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowPreview(false)}
              >
                ×
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
                  🖨️ Imprimir
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className={styles.pdfButton}
                >
                  💾 Descargar
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