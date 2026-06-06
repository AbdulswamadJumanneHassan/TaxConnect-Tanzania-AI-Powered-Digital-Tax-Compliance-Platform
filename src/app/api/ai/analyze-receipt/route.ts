import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

// ---------- Schema ----------
const ReceiptAnalysisSchema = z.object({
    businessName: z.string().describe("Name of the business that issued the receipt"),
    receiptNumber: z.string().describe("Receipt or invoice number"),
    dateTime: z.string().describe("Date and time on the receipt in ISO-like format or as printed"),
    amountPaid: z.number().describe("Total amount paid in TZS"),
    vatAmount: z.number().describe("VAT amount in TZS, 0 if not present"),
    tin: z.string().describe("Tax Identification Number (TIN) of the business, empty string if not found"),
    category: z.string().describe("Transaction category, e.g. Restaurant/Food, Pharmacy, Hotel, Retail, Transport, Fuel, Other"),
    anomalies: z.array(z.object({
        type: z.enum(["MISSING_VAT", "MISSING_TIN", "INCORRECT_TAX_CALC", "SUSPICIOUS_AMOUNT", "INCOMPLETE_RECEIPT", "POTENTIAL_DUPLICATE"]),
        description: z.string(),
        severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
    })).describe("List of detected anomalies or compliance issues"),
    recommendations: z.array(z.string()).describe("Corrective recommendations for each anomaly"),
    complianceScore: z.number().min(0).max(100).describe("Overall compliance score from 0 (non-compliant) to 100 (fully compliant) based on TRA requirements"),
    extractedText: z.string().describe("Raw text extracted from the receipt for reference"),
});

export type ReceiptAnalysis = z.infer<typeof ReceiptAnalysisSchema>;

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Yahitaji kuingia" }, { status: 401 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "AI service is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY." },
            { status: 503 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "Hakuna faili iliyopakiwa" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Aina ya faili haihimiliki. Tumia JPG, PNG, WEBP, au PDF." },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");

        const prompt = `You are a Tanzanian tax compliance AI assistant. Analyze this receipt image carefully.

Your task:
1. Extract all visible text and structured data from the receipt.
2. Identify all tax-related fields: business name, receipt number, date/time, amount paid, VAT amount, TIN number.
3. Detect anomalies based on Tanzania Revenue Authority (TRA) requirements:
   - MISSING_VAT: No VAT amount shown on a receipt where VAT should apply (businesses with turnover > 100M TZS/year must charge 18% VAT)
   - MISSING_TIN: No TIN number visible
   - INCORRECT_TAX_CALC: VAT amount doesn't match 18% of the pre-tax amount
   - SUSPICIOUS_AMOUNT: Amount seems unusually high/low or inconsistent
   - INCOMPLETE_RECEIPT: Missing critical fields like business name, date, or receipt number
   - POTENTIAL_DUPLICATE: Indicators that this might be a duplicate (serial numbers, patterns)
4. Calculate a compliance score (0-100) based on how well the receipt meets TRA standards.
5. Provide clear, actionable recommendations.

Return all monetary values in TZS (Tanzania Shillings).
If a field is not visible or not applicable, use an empty string for text fields or 0 for number fields.`;

        const result = await generateObject({
            model: google("gemini-2.0-flash"),
            schema: ReceiptAnalysisSchema,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                        {
                            type: "image",
                            image: `data:${file.type};base64,${base64}`,
                        },
                    ],
                },
            ],
        });

        return NextResponse.json({ analysis: result.object }, { status: 200 });
    } catch (error) {
        console.error("Receipt analysis error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Imeshindwa kuchambua risiti: ${message}` },
            { status: 500 }
        );
    }
}
