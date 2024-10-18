import { NextResponse } from "next/server";
import { combine_rules } from "@/lib/ruleEngine";
import { db } from "@/db";
import { rules } from "@/db/schema";

async function fetchRulesByIds(ruleIds: string[]) {
    const mockRules = await db.select().from(rules).execute();

    return mockRules.filter((rule) => ruleIds.includes(rule.id));
}

export async function POST(req: Request) {
    try {
        const { ruleIds } = await req.json();

        const rules = await fetchRulesByIds(ruleIds);

        const ruleStrings = rules.map((rule) => rule.rule_string);
        const combinedAST = combine_rules(ruleStrings);

        console.log("Combined AST:", combinedAST);

        return NextResponse.json({ combinedAST });
    } catch (error) {
        console.error("Error combining rules:", error);
        return NextResponse.json(
            { message: "Error combining rules" },
            { status: 500 }
        );
    }
}
