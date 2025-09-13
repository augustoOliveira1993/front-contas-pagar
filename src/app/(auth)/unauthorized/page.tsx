"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PageNotAuthorized() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center px-4 py-12 min-h-screen text-center">
      <Image
        src="/avb_logo.png"
        alt="404"
        width={100}
        height={100}
        className="invert dark:invert-0 mx-auto pb-12"
      />
      <h1 className="mb-4 font-bold text-4xl">Não Autorizado!</h1>
      <p className="mb-8 max-w-lg text-xl">
        Desculpe,você não tem permissão para acessar esta página. Contate o seu{" "}
        gestor para mais informações.
      </p>
      <Button
        onClick={() => router.push("/")}
        variant="secondary"
        size="lg"
      >
        <ArrowLeft className="mr-2 size-4" />
        <span>Voltar para a página anterior</span>
      </Button>
    </div>
  );
}
