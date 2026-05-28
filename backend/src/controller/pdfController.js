import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import os from "os";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Detect Chrome/Edge executable path on Windows
 * @private
 */
const getExecutablePath = () => {
    const platform = os.platform();
    const homeDir = os.homedir();
    const winPaths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        path.join(homeDir, "AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"),
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ];
    return platform === "win32" ? winPaths.find(fs.existsSync) : null;
};

/**
 * @desc    Generate PDF from Resume View
 * @route   GET /api/resumes/download/:resume_id
 */
export const generatePdf = asyncHandler(async (req, res) => {
    const { resume_id } = req.params;
    const { token } = req.cookies;
    let browser = null;

    try {
        console.log(`[PDF Forge] Initializing Engine...`);

        browser = await puppeteer.launch({
            headless: "new",
            executablePath: getExecutablePath() || undefined,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage", // Recommended for production Linux environments
                "--disable-gpu",
                "--font-render-hinting=none",
                "--font-render-hinting=none",
                "--force-color-profile=srgb",
                "--allow-pre-configured-graphics-settings",
            ],
        });

        const page = await browser.newPage();
        const frontendBase = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
        const targetUrl = `${frontendBase}/dashboard/view-resume/${resume_id}`;

        // Set high-fidelity viewport for sharp text
        await page.setViewport({ 
    width: 794, // Standard A4 width in pixels at 96 DPI
    height: 1123, 
    deviceScaleFactor: 1 // Set to 1 to prevent scaling gaps[cite: 10]
});

        // 1. Session Injection (Bypasses Auth Guards)
        if (token) {
            const domain = new URL(frontendBase).hostname;
            await page.setCookie({
                name: "token",
                value: token,
                domain,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
            });
            console.log(`[PDF Forge] Session Injected: ${domain}`);
        }

        // 2. Navigation
        console.log(`[PDF Forge] Navigating to: ${targetUrl}`);
        await page.goto(targetUrl, { 
            waitUntil: "networkidle2", 
            timeout: 60000 
        });

        // 3. Redirect Trap (Security Check)
        const currentUrl = page.url();
        if (currentUrl === `${frontendBase}/` || currentUrl.includes("login")) {
            throw new ApiError(401, "PDF Capture failed: Unauthorized access or session expired.");
        }

        // 4. Frontend Sync (Waits for the window.resumeReady flag)
        await page.waitForFunction("window.resumeReady === true", { timeout: 30000 });

        // 5. Content Verification
        await page.waitForSelector("#resume-preview", { visible: true });
        const hasContent = await page.evaluate(() => {
            const el = document.querySelector("#resume-preview");
            return el && el.innerText.trim().length > 100;
        });

        if (!hasContent) {
            throw new ApiError(500, "Resume content failed to render properly.");
        }

		// Debug: Capture a screenshot if PDF generation fails later

        // 6. Capture PDF
        const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    // CRITICAL: Set all margins to 0 to remove default browser spacing
    margin: { 
        top: "0px", 
        right: "0px", 
        bottom: "0px", 
        left: "0px" 
    },
    displayHeaderFooter: false,
    preferCSSPageSize: true, // Forces Puppeteer to respect your CSS @page rules
});
        // Close browser immediately to free memory
        await browser.close();
        browser = null;

        // 7. Binary Stream Response
        res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="Resume-${resume_id}.pdf"`,
    "Content-Length": pdfBuffer.length,
    "Cache-Control": "no-store, no-cache, must-revalidate",
});

console.log(`[PDF Forge] Dispatching Binary: ${pdfBuffer.length} bytes.`);
return res.end(pdfBuffer, 'binary');

    } catch (error) {
        // Safe Cleanup: ensure browser is closed on error
        if (browser) await browser.close();
        
        // Pass to global error handler
        throw new ApiError(
            error.statusCode || 500, 
            error.message || "PDF generation engine failure", 
            [], 
            error.stack
        );
    }
});