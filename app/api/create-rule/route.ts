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

        const newrules = await db.select().from(rules).execute();

        console.log("Rulesksms:", newrules);

        console.log("Inserted rule:", result);
        return NextResponse.json(newrules, { status: 200 });
    } catch (error) {
        console.error("Error inserting rule:", error);
        return NextResponse.json(
            { error: "Error inserting rule" },
            { status: 500 }
        );
    }
}
