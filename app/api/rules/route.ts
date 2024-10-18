import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rules } from "@/db/schema";

export async function POST(req: NextRequest) {
    try {
        const { name, ruleAst } = await req.json();
        console.log("Rule AST:", ruleAst);

        const result = await db
            .insert(rules)
            .values({
                name,
                rule_string: JSON.stringify(ruleAst),
            })
            .execute();

        console.log("Inserted rule:", result);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error inserting rule:", error);
        return NextResponse.json(
            { error: "Error inserting rule" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const result = await db.select().from(rules).execute();
        console.log("Fetched rules:", result);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching rules:", error);
        return NextResponse.json(
            { error: "Error fetching rules" },
            { status: 500 }
        );
    }
}
