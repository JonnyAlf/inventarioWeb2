import * as React from "react";
import { cn } from "@/lib/utils";

interface PropsNotificacao {
  mensagem: string;
  tipo?: "sucesso" | "erro";
  onClose: () => void; // Função para fechar a notificação
}

const Notificacao: React.FC<PropsNotificacao> = ({ mensagem, tipo = "sucesso", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Chama a função para fechar a notificação
    }, 2500); // 5000 ms = 5 segundos

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [onClose]);

  return (
    <div className={cn("p-4 rounded-md text-white", {
      "bg-green-500": tipo === "sucesso",
      "bg-red-500": tipo === "erro",
    })}>
      {mensagem}
    </div>
  );
};

export default Notificacao;
