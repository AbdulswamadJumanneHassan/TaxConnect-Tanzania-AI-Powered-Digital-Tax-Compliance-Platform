import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { ReceiptAnalysis } from "@/app/api/ai/analyze-receipt/route";

export interface ReceiptItem {
    description: string;
    quantity: number;
    price: number;
}

export interface StoredReceipt {
    id: string;
    userId: string; // email or id of the user
    customerName: string;
    items: ReceiptItem[];
    total: number;
    paymentMethod: "Cash" | "M-Pesa" | "Other";
    date: string;
    qrCode: string;
    sourceType?: "manual" | "ai-scanned";
    aiAnalysis?: ReceiptAnalysis;
}

const DATA_DIR = join(process.cwd(), "data");
const RECEIPTS_FILE = join(DATA_DIR, "receipts.json");

async function ensureReceiptsFile() {
    try {
        await access(RECEIPTS_FILE);
    } catch {
        await mkdir(DATA_DIR, { recursive: true });
        await writeFile(RECEIPTS_FILE, JSON.stringify([], null, 2), "utf8");
    }
}

export async function readReceipts(): Promise<StoredReceipt[]> {
    await ensureReceiptsFile();
    const data = await readFile(RECEIPTS_FILE, "utf8");
    try {
        return JSON.parse(data) as StoredReceipt[];
    } catch {
        return [];
    }
}

export async function writeReceipts(receipts: StoredReceipt[]) {
    await ensureReceiptsFile();
    await writeFile(RECEIPTS_FILE, JSON.stringify(receipts, null, 2), "utf8");
}

export async function addReceipt(
    receipt: Omit<StoredReceipt, "id" | "date" | "qrCode">
): Promise<StoredReceipt> {
    const receipts = await readReceipts();
    const id = randomUUID();
    const newReceipt: StoredReceipt = {
        ...receipt,
        id,
        date: new Date().toISOString(),
        qrCode: `RECEIPT-${id.substring(0, 8)}`,
    };
    receipts.push(newReceipt);
    await writeReceipts(receipts);
    return newReceipt;
}

export async function getReceiptsByUser(userId: string): Promise<StoredReceipt[]> {
    const receipts = await readReceipts();
    return receipts.filter((r) => r.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
