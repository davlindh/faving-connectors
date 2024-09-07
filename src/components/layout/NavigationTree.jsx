import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

const TreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={cn("pl-4", level === 0 && "pl-0")}>
      <div className="flex items-center py-1">
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-1 p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
        {node.to ? (
          <Link
            to={node.to}
            className="flex items-center text-sm hover:text-primary transition-colors"
          >
            {node.icon && <node.icon className="mr-2 h-4 w-4" />}
            {node.title}
          </Link>
        ) : (
          <span className="flex items-center text-sm font-semibold">
            {node.icon && <node.icon className="mr-2 h-4 w-4" />}
            {node.title}
          </span>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="ml-4">
          {node.children.map((childNode, index) => (
            <TreeNode key={index} node={childNode} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const NavigationTree = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <TreeNode key={index} node={item} />
      ))}
    </div>
  );
};

export default NavigationTree;