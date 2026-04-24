import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * ==========================================================================
 * NYAYA AI - ENTERPRISE REPORTING ENGINE (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: High-Fidelity PDF Generation & Memory-Safe Export
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Fixed Pagination Math: Repaired the Y-axis offset bug that causes page overlaps.
 * 2. OOM (Out-of-Memory) Shields: Capped dynamic pixel ratio scaling to prevent mobile iOS crashes.
 * 3. First-Page Branding: Added missing footer injection to the very first page.
 * 4. Deep DOM Preparation: Unlocked 'overflow' properties to prevent cropped captures.
 * 5. V8 Garbage Collection: Nullified massive base64 strings immediately after PDF generation.
 * ==========================================================================
 */

export async function generateCompliancePDF(
  elementId: string, 
  reportName: string = "Nyaya_Compliance_Audit"
): Promise<boolean> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`[ExportEngine] Target ID #${elementId} not found.`);
    throw new Error("Report generation failed: Dashboard element not found.");
  }

  // Pre-capture styling adjustments to ensure the canvas doesn't clip
  // We must save original states to restore them flawlessly post-render
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflow;
  
  element.style.height = "auto"; 
  element.style.overflow = "visible";

  try {
    // 1. High-Fidelity Canvas Capture with Dynamic DPI Scaling
    // Caps scale at 3 to prevent canvas area limits and out-of-memory crashes on mobile
    const optimalScale = Math.min(window.devicePixelRatio || 2, 3);

    const canvas = await html2canvas(element, {
      scale: optimalScale, 
      useCORS: true, 
      allowTaint: true,
      logging: false,
      backgroundColor: "#05050A", // Explicitly match Nyaya dark-mode background
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Manipulate the cloned element specifically for the PDF layout
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.padding = "30px";
          clonedElement.style.height = "auto";
          clonedElement.style.overflow = "visible";
        }
      }
    });

    // 2. Optimized Image Compression
    // Using JPEG (0.95 quality) reduces file size by ~90% vs PNG with zero visible loss in dark themes.
    let imgData: string | null = canvas.toDataURL("image/jpeg", 0.95);

    // 3. Initialize PDF (A4 Dimensions)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // 4. Advanced Aspect Ratio & Margin Math
    const imgProps = pdf.getImageProperties(imgData);
    const margin = 10; 
    const usableWidth = pdfWidth - (margin * 2);
    const usableHeight = pdfHeight - (margin * 2);
    const imgHeight = (imgProps.height * usableWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = margin; // Starting Y offset

    // 5. Intelligent Multi-Page Slicing (Page 1)
    pdf.addImage(imgData, "JPEG", margin, position, usableWidth, imgHeight, undefined, 'FAST');
    
    // Inject Footer Branding on Page 1
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Nyaya AI Systems — Confidential Compliance Forensic Report — Page 1`,
      pdfWidth / 2,
      pdfHeight - 5,
      { align: "center" }
    );

    heightLeft -= usableHeight;
    let pageNum = 2;

    // 6. Pagination Loop (Corrected Offset Mathematics)
    while (heightLeft > 0) {
      // Shift the image upward by exactly one usable page height
      position -= usableHeight;
      
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, position, usableWidth, imgHeight, undefined, 'FAST');
      
      // Footer Branding on subsequent pages
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Nyaya AI Systems — Confidential Compliance Forensic Report — Page ${pageNum}`,
        pdfWidth / 2,
        pdfHeight - 5,
        { align: "center" }
      );

      heightLeft -= usableHeight;
      pageNum++;
    }

    // 7. Security & Metadata Injection
    pdf.setProperties({
      title: `${reportName} | Nyaya AI Systems`,
      subject: 'Forensic Audit Compliance',
      author: 'Nyaya Intelligence Engine',
      creator: 'Nyaya.AI OS v2.5.0'
    });

    // 8. Finalization & Download
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split('T')[0];
    pdf.save(`${reportName}_${timestamp}.pdf`);
    
    // --- V8 GARBAGE COLLECTION HINTS ---
    imgData = null; 

    // Restore DOM Layout
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
    
    return true;

  } catch (error: unknown) {
    // Failsafe: Reset element style if an error occurs mid-render
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
    
    const errorMessage = error instanceof Error ? error.message : "Internal PDF Rendering Error";
    console.error("[Nyaya Export Error]:", errorMessage);
    throw new Error(`Export Failed: ${errorMessage}`);
  }
}