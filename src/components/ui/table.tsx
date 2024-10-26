import * as React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  head: React.ReactNode; // Novo prop para cabeçalho da tabela
}

const Table: React.FC<TableProps> = ({ className, head, children, ...props }) => {
  return (
    <table className={cn("min-w-full border border-gray-200", className)} {...props}>
      <thead className="bg-gray-100">
        <tr>{head}</tr> {/* Renderiza apenas o cabeçalho aqui */}
      </thead>
      <tbody>{children}</tbody> {/* Renderiza apenas o corpo aqui */}
    </table>
  );
};

export default Table;
