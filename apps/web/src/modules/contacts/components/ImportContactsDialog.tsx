"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/base/dialog";
import { Button } from "@/core/components/base/button";
import { useContacts } from "../contexts/ContactsContext";
import { useError } from "@/core/components/hooks/use-error";
import { importContactsAction } from "../actions/import-contacts.action";
import { useUserContext } from "@/core/contexts/UserContext";
import { useToast } from "@/core/components/hooks/use-toast";

export default function ImportContactsDialog() {
  const { userId } = useUserContext();
  const { refreshContacts } = useContacts();
  const { showError } = useError();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const fileContent = await file.text();
    const [error, importResult] = await importContactsAction(
      userId,
      fileContent,
    );

    setIsLoading(false);
    setOpen(false);

    if (error) {
      showError(error);
    } else if (importResult) {
      toast({
        title: "Importación completada",
        description: `Se importaron ${importResult.success} contactos correctamente${
          importResult.errors > 0
            ? ` y ${importResult.errors} contactos tuvieron errores`
            : ""
        }`,
        variant: importResult.errors > 0 ? "destructive" : "default",
      });
      await refreshContacts();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Cargar CSV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Contactos desde CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>El archivo CSV debe contener las siguientes columnas:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Nombre (obligatorio)</li>
              <li>Relación (opcional)</li>
              <li>Localización (opcional)</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="secondary"
                disabled={isLoading}
                asChild
              >
                <span>
                  {isLoading ? "Procesando..." : "Seleccionar archivo CSV"}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
