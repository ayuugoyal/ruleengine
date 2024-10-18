"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { parseRuleStringToAST } from "@/lib/ruleEngine";

interface Rule {
    id: string;
    name: string;
    rule_string: string;
}

export default function Home() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [newRule, setNewRule] = useState({ name: "", rule_string: "" });
    const [userData, setUserData] = useState("");
    const [evaluationResult, setEvaluationResult] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await fetch("/api/rules");
            const data = await response.json();
            setRules(data);
            console.log("Fetched rules:", data);
        } catch (error) {
            console.error("Error fetching rules:", error);
        }
    };

    const handleCreateRule = async () => {
        try {
            if (!newRule.rule_string) {
                console.log("Rule string is required");
            }

            const toSaveRule = {
                name: newRule.name,
                ruleAst: parseRuleStringToAST(newRule.rule_string),
            };

            console.log("Rule AST:", toSaveRule);

            const data = await fetch("/api/rules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toSaveRule),
            });

            console.log("Rule created:", data);

            setNewRule({ name: "", rule_string: "" });

            console.log(toSaveRule);

            fetchRules();
        } catch (error) {
            console.error("Error creating rule:", error);
        }
    };

    const handleEvaluate = async () => {
        try {
            const data = JSON.parse(userData);
            const response = await fetch("/api/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data }),
            });
            const result = await response.json();
            setEvaluationResult(result.result);
        } catch (error) {
            console.error("Error evaluating rules:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Rule Engine</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Create New Rule</CardTitle>
                    <CardDescription>
                        Add a new rule to the engine
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Rule name"
                                value={newRule.name}
                                onChange={(e) =>
                                    setNewRule({
                                        ...newRule,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="rule">Rule</Label>
                            <Input
                                id="rule"
                                placeholder="Rule string"
                                value={newRule.rule_string}
                                onChange={(e) =>
                                    setNewRule({
                                        ...newRule,
                                        rule_string: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreateRule}>
                        <PlusIcon className="mr-2 h-4 w-4" /> Create Rule
                    </Button>
                </CardFooter>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Existing Rules</CardTitle>
                    <CardDescription>
                        View and manage existing rules
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {rules.map((rule) => (
                            <AccordionItem value={rule.id} key={rule.id}>
                                <AccordionTrigger>{rule.name}</AccordionTrigger>
                                <AccordionContent>
                                    {rule.rule_string}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Evaluate Rules</CardTitle>
                    <CardDescription>
                        Test the combined rules against user data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="userData">User Data (JSON)</Label>
                        <Input
                            id="userData"
                            placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 3}'
                            value={userData}
                            onChange={(e) => setUserData(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleEvaluate}>Evaluate</Button>
                    {evaluationResult !== null && (
                        <div
                            className={`text-lg font-semibold ${
                                evaluationResult
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            Result:{" "}
                            {evaluationResult ? "Eligible" : "Not Eligible"}
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
