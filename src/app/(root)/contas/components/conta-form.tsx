"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  EFormaPagamento,
  EContaStatus,
  EContaTipo,
  EContaMoeda,
  EFrequencia,
} from "../interfaces";

const contaSchema = z
  .object({
    codigo: z.string().min(1, "Código é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    categoria: z.string().min(1, "Categoria é obrigatória"),
    valor_total: z.number().min(0.01, "Valor deve ser maior que zero"),
    moeda: z.nativeEnum(EContaMoeda),
    status: z.nativeEnum(EContaStatus),
    tipo: z.nativeEnum(EContaTipo),
    data_vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
    notas: z.string().optional(),
    tags: z.array(z.string()).optional(),
    recorrencia: z
      .object({
        frequencia: z.nativeEnum(EFrequencia),
        diaReferencia: z.number().min(1).max(31).optional(),
      })
      .optional(),
    parcelas: z
      .array(
        z.object({
          numero: z.number(),
          valor: z.number().min(0.01),
          vencimento: z.date(),
          dataVencimento: z.union([z.string(), z.date()]),
          status: z.nativeEnum(EContaStatus),
          pagamento: z
            .object({
              data: z.date(),
              forma: z.nativeEnum(EFormaPagamento),
              observacao: z.string().optional(),
            })
            .optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.tipo === EContaTipo.RECORRENTE) {
        return data.recorrencia?.frequencia !== undefined;
      }
      return true;
    },
    {
      message: "Frequência é obrigatória para contas recorrentes",
      path: ["recorrencia.frequencia"],
    }
  )
  .refine(
    (data) => {
      if (data.tipo === EContaTipo.PARCELADA) {
        return data.parcelas && data.parcelas.length > 0;
      }
      return true;
    },
    {
      message: "Pelo menos uma parcela é obrigatória para contas parceladas",
      path: ["parcelas"],
    }
  );

type ContaFormData = z.infer<typeof contaSchema>;

export function ContaForm() {
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ContaFormData>({
    resolver: zodResolver(contaSchema),
    defaultValues: {
      codigo: "",
      descricao: "",
      categoria: "",
      valor_total: 0,
      moeda: EContaMoeda.REAL,
      status: EContaStatus.PENDENTE,
      tipo: EContaTipo.FIXA,
      data_vencimento: "",
      notas: "",
      tags: [],
      parcelas: [],
      recorrencia: undefined,
    },
  });

  const {
    fields: parcelasFields,
    append: appendParcela,
    remove: removeParcela,
  } = useFieldArray({
    control,
    name: "parcelas",
  });

  const watchedTipo = watch("tipo");
  const watchedTags = watch("tags") || [];

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const addParcela = () => {
    const currentParcelas = getValues("parcelas") || [];
    const valorTotal = getValues("valor_total");

    appendParcela({
      numero: currentParcelas.length + 1,
      valor: valorTotal / (currentParcelas.length + 1),
      vencimento: new Date(),
      dataVencimento: new Date().toISOString().split("T")[0],
      status: EContaStatus.PENDENTE,
    });
  };

  const onSubmit = (data: ContaFormData) => {
    console.log("Dados validados do formulário:", data);
    // Aqui você implementaria a lógica para salvar os dados
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Preencha os dados principais da conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                {...register("codigo")}
                placeholder="Ex: CONTA-001"
              />
              {errors.codigo && (
                <p className="text-sm text-red-500">{errors.codigo.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                {...register("categoria")}
                placeholder="Ex: Alimentação, Transporte"
              />
              {errors.categoria && (
                <p className="text-sm text-red-500">
                  {errors.categoria.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              placeholder="Descreva a conta"
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Total</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                {...register("valor_total", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.valor_total && (
                <p className="text-sm text-red-500">
                  {errors.valor_total.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="moeda">Moeda</Label>
              <Select
                onValueChange={(value) =>
                  setValue("moeda", value as EContaMoeda)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EContaMoeda.REAL}>Real (BRL)</SelectItem>
                  <SelectItem value={EContaMoeda.DOLAR}>Dólar (USD)</SelectItem>
                  <SelectItem value={EContaMoeda.EURO}>Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vencimento">Data de Vencimento</Label>
              <Input
                id="vencimento"
                type="date"
                {...register("data_vencimento")}
              />
              {errors.data_vencimento && (
                <p className="text-sm text-red-500">
                  {errors.data_vencimento.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Conta</Label>
              <Select
                onValueChange={(value) => setValue("tipo", value as EContaTipo)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EContaTipo.FIXA}>Fixa</SelectItem>
                  <SelectItem value={EContaTipo.VARIAVEL}>Variável</SelectItem>
                  <SelectItem value={EContaTipo.PARCELADA}>
                    Parcelada
                  </SelectItem>
                  <SelectItem value={EContaTipo.RECORRENTE}>
                    Recorrente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) =>
                  setValue("status", value as EContaStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EContaStatus.PENDENTE}>
                    Pendente
                  </SelectItem>
                  <SelectItem value={EContaStatus.PAGO}>Pago</SelectItem>
                  <SelectItem value={EContaStatus.ATRASADO}>
                    Atrasado
                  </SelectItem>
                  <SelectItem value={EContaStatus.PARCIAL}>Parcial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Adicione tags para organizar suas contas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Digite uma tag"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
            />
            <Button type="button" onClick={addTag} size="sm">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recorrência */}
      {watchedTipo === EContaTipo.RECORRENTE && (
        <Card>
          <CardHeader>
            <CardTitle>Recorrência</CardTitle>
            <CardDescription>
              Configure a frequência de repetição da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequencia">Frequência</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("recorrencia", {
                      ...getValues("recorrencia"),
                      frequencia: value as EFrequencia,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EFrequencia.DIARIA}>Diária</SelectItem>
                    <SelectItem value={EFrequencia.SEMANAL}>Semanal</SelectItem>
                    <SelectItem value={EFrequencia.MENSAL}>Mensal</SelectItem>
                    <SelectItem value={EFrequencia.ANUAL}>Anual</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recorrencia?.frequencia && (
                  <p className="text-sm text-red-500">
                    {errors.recorrencia.frequencia.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diaReferencia">Dia de Referência</Label>
                <Input
                  id="diaReferencia"
                  type="number"
                  min="1"
                  max="31"
                  {...register("recorrencia.diaReferencia", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ex: 15 (dia do mês)"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parcelas */}
      {watchedTipo === EContaTipo.PARCELADA && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Parcelas
              <Button type="button" onClick={addParcela} size="sm">
                <PlusIcon className="h-4 w-4 mr-1" />
                Adicionar Parcela
              </Button>
            </CardTitle>
            <CardDescription>Configure as parcelas da conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.parcelas && (
              <p className="text-sm text-red-500">{errors.parcelas.message}</p>
            )}
            {parcelasFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Parcela {index + 1}</Label>
                  </div>
                  <div>
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`parcelas.${index}.valor`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.parcelas?.[index]?.valor && (
                      <p className="text-sm text-red-500">
                        {errors.parcelas[index]?.valor?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Vencimento</Label>
                    <Input
                      type="date"
                      {...register(`parcelas.${index}.dataVencimento`)}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          `parcelas.${index}.status`,
                          value as EContaStatus
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EContaStatus.PENDENTE}>
                          Pendente
                        </SelectItem>
                        <SelectItem value={EContaStatus.PAGO}>Pago</SelectItem>
                        <SelectItem value={EContaStatus.ATRASADO}>
                          Atrasado
                        </SelectItem>
                        <SelectItem value={EContaStatus.PARCIAL}>
                          Parcial
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeParcela(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
          <CardDescription>
            Adicione informações complementares sobre a conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register("notas")}
            placeholder="Digite observações adicionais..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex gap-4 justify-end mb-6">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar Conta"}
        </Button>
      </div>
    </form>
  );
}
