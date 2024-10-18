import React from "react";
import { motion } from "framer-motion";

type NodeValue = {
    field: string;
    operator: string;
    value: number | null;
};

type ASTNode = {
    type: "operator" | "operand";
    value: string | NodeValue;
    left?: ASTNode;
    right?: ASTNode;
};

interface ASTProps {
    data: ASTNode;
}

const ASTNode: React.FC<{ node: ASTNode; depth: number }> = ({
    node,
    depth,
}) => {
    const isOperator = node.type === "operator";
    const bgColor = isOperator ? "bg-orange-400" : "bg-blue-300";
    const textColor = "text-gray-800";

    const nodeVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: depth * 0.2,
            },
        },
    };

    return (
        <motion.div
            className="flex flex-col items-center"
            variants={nodeVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className={`${bgColor} ${textColor} rounded px-3 py-1 shadow-lg mb-2`}
                whileHover={{ scale: 1.05 }}
            >
                {isOperator ? (
                    <span className="font-bold">{node.value as string}</span>
                ) : (
                    <span>
                        {typeof node.value === "object"
                            ? `${node.value.field} ${node.value.operator} ${node.value.value}`
                            : node.value}
                    </span>
                )}
            </motion.div>
            {(node.left || node.right) && (
                <div className="flex items-start space-x-8 mt-4">
                    {node.left && (
                        <div className="flex flex-col items-center">
                            <div className="w-px h-8 bg-blue-200 mb-2"></div>
                            <ASTNode node={node.left} depth={depth + 1} />
                        </div>
                    )}
                    {node.right && (
                        <div className="flex flex-col items-center">
                            <div className="w-px h-8 bg-blue-200 mb-2"></div>
                            <ASTNode node={node.right} depth={depth + 1} />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

const AnimatedAST: React.FC<ASTProps> = ({ data }) => {
    return (
        <div className="p-8 bg-gray-900 rounded-lg shadow-xl overflow-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-orange-400">
                Abstract Syntax Tree
            </h2>
            <ASTNode node={data} depth={0} />
        </div>
    );
};

export default AnimatedAST;
