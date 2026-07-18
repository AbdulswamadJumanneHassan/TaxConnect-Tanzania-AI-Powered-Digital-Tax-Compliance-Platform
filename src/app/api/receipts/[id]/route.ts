import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteReceipt } from "@/lib/receipt-store";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Yahitaji kuingia" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const deleted = await deleteReceipt(id, session.email);

        if (!deleted) {
            return NextResponse.json(
                { error: "Risiti haikupatikana au huna ruhusa ya kuifuta" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Receipt deletion error:", error);
        return NextResponse.json({ error: "Imeshindwa kufuta risiti" }, { status: 500 });
    }
}
