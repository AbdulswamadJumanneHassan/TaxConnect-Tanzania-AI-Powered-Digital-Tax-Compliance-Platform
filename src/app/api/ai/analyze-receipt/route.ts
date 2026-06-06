import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// ---------- Types ----------
export interface ReceiptAnomaly {
    type: "MISSING_VAT" | "MISSING_TIN" | "INCORRECT_TAX_CALC" | "SUSPICIOUS_AMOUNT" | "INCOMPLETE_RECEIPT" | "POTENTIAL_DUPLICATE";
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ReceiptAnalysis {
    businessName: string;
    receiptNumber: string;
    dateTime: string;
    amountPaid: number;
    vatAmount: number;
    tin: string;
    category: string;
    anomalies: ReceiptAnomaly[];
    recommendations: string[];
    complianceScore: number;
    extractedText: string;
}

const SYSTEM_PROMPT = `You are a Tanzanian tax compliance AI assistant. Analyze receipt images and return ONLY valid JSON.

Your task:
1. Extract all visible text and structured data from the receipt.
2. Identify tax-related fields: business name, receipt number, date/time, amount paid, VAT amount, TIN number.
3. Detect anomalies based on TRA (Tanzania Revenue Authority) requirements:
   - MISSING_VAT: No VAT shown where it should apply (18% for businesses with turnover > 100M TZS/year)
   - MISSING_TIN: No Tax Identification Number visible
   - INCORRECT_TAX_CALC: VAT amount does not match 18% of pre-tax amount
   - SUSPICIOUS_AMOUNT: Amount is inconsistent or suspicious
   - INCOMPLETE_RECEIPT: Missing critical fields (business name, date, receipt number)
   - POTENTIAL_DUPLICATE: Signs this could be a duplicate receipt
4. Calculate complianceScore (0-100) based on TRA standards.
5. Provide clear, actionable recommendations.

Return all monetary values in TZS (Tanzania Shillings).
For missing text fields, use empty string "". For missing number fields, use 0.

Return ONLY this exact JSON structure, no extra text:
{
  "businessName": "",
  "receiptNumber": "",
  "dateTime": "",
  "amountPaid": 0,
  "vatAmount": 0,
  "tin": "",
  "category": "",
  "anomalies": [
    { "type": "MISSING_VAT", "description": "...", "severity": "HIGH" }
  ],
  "recommendations": ["..."],
  "complianceScore": 75,
  "extractedText": ""
}`;

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Yahitaji kuingia" }, { status: 401 });
    }

    const token = process.env.GITHUB_MODELS_TOKEN;
    if (!token) {
        return NextResponse.json(
            { error: "AI service is not configured. Please set GITHUB_MODELS_TOKEN." },
            { status: 503 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "Hakuna faili iliyopakiwa" }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Aina ya faili haihimiliki. Tumia JPG, PNG, WEBP, au PDF." },
                { status: 400 }
            );
        }

        // Convert to base64
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const dataUrl = `data:${file.type};base64,${base64}`;

        const body: Record<string, unknown> = {
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this receipt and return the JSON response.",
                        },
                        {
                            type: "image_url",
                            image_url: { url: dataUrl, detail: "high" },
                        },
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: 1500,
        };

        const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `API error ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content ?? "{}";

        let analysis: ReceiptAnalysis;
        try {
            analysis = JSON.parse(content) as ReceiptAnalysis;
        } catch {
            throw new Error("AI returned invalid JSON. Please try again.");
        }

        // Clamp complianceScore to 0-100
        if (typeof analysis.complianceScore === "number") {
            analysis.complianceScore = Math.max(0, Math.min(100, Math.round(analysis.complianceScore)));
        } else {
            analysis.complianceScore = 50;
        }

        return NextResponse.json({ analysis }, { status: 200 });
    } catch (error) {
        console.error("Receipt analysis error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Imeshindwa kuchambua risiti: ${message}` },
            { status: 500 }
        );
    }
}
