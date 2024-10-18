import { NextRequest, NextResponse } from "next/server";
import { parseRuleStringToAST, evaluateAST } from "@/lib/ruleEngine";
import { db } from "@/db";
import { rules } from "@/db/schema";

export async function POST(req: NextRequest) {
    const { data } = await req.json();

    try {
        const result = await db.select().from(rules).execute();
        const rulesData = result;

        let evaluationResult = false;

        for (const rule of rulesData) {
            const ast = parseRuleStringToAST(rule.rule_string);
            const isEligible = evaluateAST(ast, data);

            if (isEligible) {
                evaluationResult = true;
                break;
            }
        }

        return NextResponse.json({ result: evaluationResult }, { status: 200 });
    } catch (error) {
        console.error("Error evaluating rule:", error);
        return NextResponse.json(
            { error: "Error evaluating rule" },
            { status: 500 }
        );
    }
}
