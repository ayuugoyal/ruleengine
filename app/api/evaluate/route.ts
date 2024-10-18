import { NextRequest, NextResponse } from "next/server";
import { evaluateAST } from "@/lib/ruleEngine";
import { db } from "@/db";
import { rules } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { data, ruleId } = await req.json();

    try {
        const rule = await db
            .select()
            .from(rules)
            .where(eq(rules.id, ruleId))
            .execute();

        const result = evaluateAST(JSON.parse(rule[0].rule_string), data);

        return NextResponse.json({ result: result }, { status: 200 });
    } catch (error) {
        console.error("Error evaluating rule:", error);
        return NextResponse.json(
            { error: "Error evaluating rule" },
            { status: 500 }
        );
    }
}
