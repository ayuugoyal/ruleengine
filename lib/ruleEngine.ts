interface OperandValue {
    field: string;
    operator: ">" | "<" | ">=" | "<=" | "==" | "!="; // Comparison operators
    value: string | number; // The right-hand value to compare with
}

interface Node {
    type: "operator" | "operand";
    value?: OperandValue | "AND" | "OR" | "NAND" | "NOR" | "XOR";
    left?: Node;
    right?: Node;
}

function tokenize(ruleString: string): string[] {
    const regex = /\(|\)|AND|OR|NAND|NOR|XOR|>=|<=|>|<|==|!=|'[^']*'|\w+/g;
    return ruleString.match(regex) || [];
}

export function parseRuleStringToAST(ruleString: string): Node {
    const tokens = tokenize(ruleString);
    let current = 0;

    function parseExpression(): Node {
        let node = parseTerm();

        while (
            current < tokens.length &&
            ["AND", "OR", "NAND", "NOR", "XOR"].includes(tokens[current])
        ) {
            const operator = tokens[current] as
                | "AND"
                | "OR"
                | "NAND"
                | "NOR"
                | "XOR";
            current++;

            const rightNode = parseTerm();

            node = {
                type: "operator",
                value: operator,
                left: node,
                right: rightNode,
            };
        }

        return node;
    }

    function parseTerm(): Node {
        if (tokens[current] === "(") {
            current++; // Skip '('
            const node = parseExpression();
            current++; // Skip ')'
            return node;
        }

        return parseCondition();
    }

    function parseCondition(): Node {
        const leftOperand = tokens[current++];
        const operator = tokens[current++];
        const rightOperand = tokens[current++];

        return {
            type: "operand",
            value: {
                field: leftOperand,
                operator: operator as OperandValue["operator"],
                value: rightOperand.startsWith("'")
                    ? rightOperand.slice(1, -1)
                    : Number(rightOperand),
            },
        };
    }

    const ast = parseExpression();

    if (current < tokens.length) {
        throw new Error("Unexpected token: " + tokens[current]);
    }

    return ast;
}

export function evaluateAST(
    node: Node,
    data: Record<string, string | number>
): boolean {
    console.log(node);
    if (node.type === "operand") {
        const { field, operator, value } = node.value as OperandValue;

        switch (operator) {
            case ">":
                return data[field] > value;
            case "<":
                return data[field] < value;
            case ">=":
                return data[field] >= value;
            case "<=":
                return data[field] <= value;
            case "==":
                return data[field] === value;
            case "!=":
                return data[field] !== value;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    } else if (node.type === "operator") {
        const leftResult = evaluateAST(node.left!, data);
        const rightResult = evaluateAST(node.right!, data);

        switch (node.value) {
            case "AND":
                return leftResult && rightResult;
            case "OR":
                return leftResult || rightResult;
            case "NAND":
                return !(leftResult && rightResult);
            case "NOR":
                return !(leftResult || rightResult);
            case "XOR":
                return leftResult !== rightResult;
            default:
                throw new Error(`Unknown operator: ${node.value}`);
        }
    }

    return false;
}

function countOperators(rules: string[]): Record<string, number> {
    const operatorCount: Record<string, number> = {};

    for (const rule of rules) {
        const tokens = tokenize(rule);
        tokens.forEach((token) => {
            if (token === "AND" || token === "OR") {
                operatorCount[token] = (operatorCount[token] || 0) + 1;
            }
        });
    }

    return operatorCount;
}

function combineASTs(ast1: Node, ast2: Node, operator: "AND" | "OR"): Node {
    return {
        type: "operator",
        value: operator,
        left: ast1,
        right: ast2,
    };
}

export function combine_rules(rules: string[]): Node | null {
    if (rules.length === 0) return null;

    const operatorCount = countOperators(rules);
    const mostFrequentOperator =
        operatorCount.AND >= operatorCount.OR ? "AND" : "OR";

    let combinedAST: Node | null = null;

    for (const rule of rules) {
        const ruleAST = parseRuleStringToAST(rule);
        if (combinedAST === null) {
            combinedAST = ruleAST;
        } else {
            combinedAST = combineASTs(
                combinedAST,
                ruleAST,
                mostFrequentOperator
            );
        }
    }

    return combinedAST;
}
