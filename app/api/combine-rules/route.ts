import { NextResponse } from "next/server";
import { combine_rules } from "@/lib/ruleEngine";

import { Rule } from "@/app/page";
import { rules } from "@/db/schema";
import { db } from "@/db";

export async function POST(req: Request) {
    try {
        const { ruleData, operation, name } = await req.json();

        if (!ruleData || !operation || !name) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("Rule IDs:", ruleData, "Operation:", operation);

        const convertedRules = ruleData.map((rule: Rule) =>
            JSON.parse(rule.rule_string)
        );

        console.log("Converted Rule:", convertedRules);

        const combinedAST = combine_rules(
            convertedRules[0],
            convertedRules[1],
            operation
        );

        const result = await db
            .insert(rules)
            .values({
                name,
                rule_string: JSON.stringify(combinedAST),
            })
            .execute();

        console.log("Combined AST:", result);

        const newrules = await db.select().from(rules).execute();

        console.log("Rulesksms:", newrules);

        return NextResponse.json(newrules, { status: 200 });
    } catch (error) {
        console.error("Error combining rules:", error);
        return NextResponse.json(
            { message: "Error combining rules" },
            { status: 500 }
        );
    }
}
