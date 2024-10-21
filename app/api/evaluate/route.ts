import { NextRequest, NextResponse } from "next/server";
import { evaluateAST } from "@/lib/ruleEngine";

export async function POST(req: NextRequest) {
    const { data, ruleAst } = await req.json();
    try {
        const convertedRule = JSON.parse(ruleAst);
        const result = evaluateAST(convertedRule, data);
        return NextResponse.json(
            { resultOfEvaluation: result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error evaluating rule:", error);
        return NextResponse.json(
            { error: "Error evaluating rule" },
            { status: 500 }
        );
    }
}
