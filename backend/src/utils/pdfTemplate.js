/**
 * @desc Standard CSS and structural helpers for Puppeteer PDF rendering
 * Ensures consistent margins, fonts, and page breaks across all resumes.
 */
export const pdfStyles = `
    @page {
        size: A4;
        margin: 0;
    }
    body {
        -webkit-print-color-adjust: exact;
        font-family: 'Inter', sans-serif;
    }
    .page-break {
        page-break-before: always;
    }
    #resume-preview {
        width: 210mm; /* Standard A4 Width */
        min-height: 297mm;
        background-color: white;
        margin: 0 auto;
        box-shadow: none !important;
    }
`;

/**
 * Helper to wrap content in a print-ready HTML shell if needed for 
 * direct backend-to-PDF generation.
 */
export const wrapInTemplate = (content) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${pdfStyles}</style>
    </head>
    <body>
        <div id="resume-preview">
            ${content}
        </div>
    </body>
    </html>
`;