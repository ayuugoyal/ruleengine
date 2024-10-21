"use client";
import React, { useState, useEffect } from "react";
import { CombineIcon, PlusIcon, Loader } from "lucide-react";
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
import AnimatedAST from "@/components/AstTree";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Rule {
    id: string;
    name: string;
    rule_string: string;
}

export default function Home() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [newRule, setNewRule] = useState({ name: "", rule_string: "" });
    const [userData, setUserData] = useState("");
    const [evaluationResult, setEvaluationResult] = useState<
        boolean | null | unknown
    >(null);
    const [selectedRules, setSelectedRules] = useState<string[]>([]);
    const [combinedAST, setCombinedAST] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");

    const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

    const [loadingCreateRule, setLoadingCreateRule] = useState(false);
    const [loadingCombineRules, setLoadingCombineRules] = useState(false);
    const [loadingEvaluate, setLoadingEvaluate] = useState(false);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await fetch("/api/rules");
            const data = await response.json();
            setRules(data);
        } catch (error) {
            console.error("Error fetching rules:", error);
            setErrorMessage("Failed to fetch rules. Please try again later.");
        }
    };

    const handleCreateRule = async () => {
        setLoadingCreateRule(true);
        try {
            if (!newRule.rule_string) {
                setErrorMessage("Rule string is required");
                setLoadingCreateRule(false);
                return;
            }

            const parsedAST = parseRuleStringToAST(newRule.rule_string);
            if (!parsedAST) {
                setErrorMessage("Invalid rule string format");
                setLoadingCreateRule(false);
                return;
            }

            const toSaveRule = {
                name: newRule.name,
                ruleAst: parsedAST,
            };

            await fetch("/api/rules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toSaveRule),
            });

            setNewRule({ name: "", rule_string: "" });
            setErrorMessage("");
            fetchRules();
        } catch (error) {
            console.error("Error creating rule:", error);
            setErrorMessage("Failed to create rule. Please try again.");
        } finally {
            setLoadingCreateRule(false);
        }
    };

    const handleCombineRules = async () => {
        setLoadingCombineRules(true);
        try {
            if (selectedRules.length < 2) {
                setErrorMessage("Select at least two rules to combine.");
                setLoadingCombineRules(false);
                return;
            }

            const response = await fetch("/api/combine-rules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ruleIds: selectedRules }),
            });

            const result = await response.json();
            setCombinedAST(JSON.stringify(result.combinedAST, null, 2));
            setErrorMessage("");
        } catch (error) {
            console.error("Error combining rules:", error);
            setErrorMessage("Failed to combine rules. Please try again.");
        } finally {
            setLoadingCombineRules(false);
        }
    };

    const handleEvaluate = async () => {
        setLoadingEvaluate(true);
        try {
            if (!selectedRuleId) {
                setErrorMessage("Please select a rule to evaluate.");
                setLoadingEvaluate(false);
                return;
            }

            const data = JSON.parse(userData);

            console.log("Data:", data);
            const selectedRule = rules.find(
                (rule) => rule.id === selectedRuleId
            );
            console.log("Selected Rule:", selectedRule);
            if (!selectedRule) {
                setErrorMessage("Selected rule not found.");
                setLoadingEvaluate(false);
                return;
            }

            console.log("hittintg api");
            const response = await fetch("/api/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ruleAst: selectedRule.rule_string,
                    data,
                }),
            });
            const result = await response.json();

            console.log("Evaluation Result:", result.resultOfEvaluation);
            setEvaluationResult(result.resultOfEvaluation);
            setErrorMessage("");
        } catch (error) {
            console.error("Error evaluating rules:", error);
            setErrorMessage(
                "Failed to evaluate rules. Please check your data format and rule string."
            );
        } finally {
            setLoadingEvaluate(false);
        }
    };

    useEffect(() => {
        if (errorMessage === "") {
            return;
        }
        toast(errorMessage);
    }, [errorMessage]);

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
                    <Button
                        onClick={handleCreateRule}
                        disabled={loadingCreateRule}
                    >
                        {loadingCreateRule ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <PlusIcon className="mr-2 h-4 w-4" />
                        )}
                        {loadingCreateRule ? "Creating..." : "Create Rule"}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Existing Rules</CardTitle>
                    <CardDescription>
                        View, manage, and combine existing rules
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full mb-4"
                    >
                        {rules.map((rule) => (
                            <AccordionItem
                                value={rule.id}
                                key={rule.id}
                                className="flex items-center"
                            >
                                <Checkbox
                                    checked={selectedRules.includes(rule.id)}
                                    onCheckedChange={(checked) => {
                                        setSelectedRules(
                                            checked
                                                ? [...selectedRules, rule.id]
                                                : selectedRules.filter(
                                                      (id) => id !== rule.id
                                                  )
                                        );
                                    }}
                                    className="mr-2"
                                />
                                <div className="w-full">
                                    <AccordionTrigger>
                                        <div className="flex items-center">
                                            {rule.name}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div>{rule.rule_string}</div>
                                        <AnimatedAST
                                            data={JSON.parse(rule.rule_string)}
                                        />
                                    </AccordionContent>
                                </div>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <Button
                        onClick={handleCombineRules}
                        disabled={
                            loadingCombineRules || selectedRules.length < 2
                        }
                    >
                        {loadingCombineRules ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <CombineIcon className="mr-2 h-4 w-4" />
                        )}
                        {loadingCombineRules
                            ? "Combining..."
                            : "Combine Selected Rules"}
                    </Button>
                </CardContent>
            </Card>

            {combinedAST && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Combined AST</CardTitle>
                        <CardDescription>
                            Abstract Syntax Tree of combined rules
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                            {combinedAST}
                        </pre>
                    </CardContent>
                </Card>
            )}

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Evaluate Rules</CardTitle>
                    <CardDescription>
                        Input user data and select a rule to evaluate
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        onValueChange={setSelectedRuleId}
                        value={selectedRuleId || undefined}
                    >
                        <SelectTrigger className="mb-4">
                            <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        <SelectContent>
                            {rules.map((rule) => (
                                <SelectItem key={rule.id} value={rule.id}>
                                    {rule.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        value={userData}
                        onChange={(e) => setUserData(e.target.value)}
                        placeholder='{"age": 25, "department": "IT", "income": 60000, "spend": 1500}'
                        className="mb-4"
                    />
                    <Button onClick={handleEvaluate} disabled={loadingEvaluate}>
                        {loadingEvaluate ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Evaluate"
                        )}
                    </Button>
                    {evaluationResult !== null && (
                        <div className="mt-4">
                            Evaluation Result:{" "}
                            {evaluationResult ? "True" : "False"}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
