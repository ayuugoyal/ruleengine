import { NextResponse } from "next/server";
import { db } from "@/db";
import { rules } from "@/db/schema";

export async function GET() {
    try {
        const result = await db.select().from(rules).execute();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching rules:", error);
        return NextResponse.json(
            { error: "Error fetching rules" },
            { status: 500 }
        );
    }
}
