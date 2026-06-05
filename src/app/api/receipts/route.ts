import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addReceipt, getReceiptsByUser } from "@/lib/receipt-store";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Yahitaji kuingia" }, { status: 401 });
    }

    try {
        const receipts = await getReceiptsByUser(session.email);
        return NextResponse.json({ receipts });
    } catch (error) {
        return NextResponse.json({ error: "Imeshindwa kupata risiti" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Yahitaji kuingia" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { customerName, items, total, paymentMethod } = body;

        if (!items || items.length === 0 || !total) {
            return NextResponse.json({ error: "Taarifa za risiti hazijakamilika" }, { status: 400 });
        }

        const newReceipt = await addReceipt({
            userId: session.email,
            customerName: customerName || "Mteja",
            items,
            total,
            paymentMethod: paymentMethod || "Cash",
        });

        return NextResponse.json({ success: true, receipt: newReceipt }, { status: 201 });
    } catch (error) {
        console.error("Receipt creation error:", error);
        return NextResponse.json({ error: "Imeshindwa kutengeneza risiti" }, { status: 500 });
    }
}
