import { NextRequest, NextResponse } from "next/server";
import { parseRuleStringToAST, evaluateAST } from "@/lib/ruleEngine"; // Import your rule engine functions
import { db } from "@/db"; // Assuming your database connection is here
import { rules } from "@/db/schema"; // Assuming your schema is imported here

export async function POST(req: NextRequest) {
    const { data } = await req.json(); // Parse JSON body from the request

    try {
        // Fetch all rules from the database
        const result = await db.select().from(rules).execute();
        const rulesData = result;

        let evaluationResult = false;

        // Evaluate each rule's AST
        for (const rule of rulesData) {
            const ast = parseRuleStringToAST(rule.rule_string);
            const isEligible = evaluateAST(ast, data);

            if (isEligible) {
                evaluationResult = true;
                break; // Exit loop if one rule is matched
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
