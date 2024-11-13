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
import { CheckCircle2, FileUp } from "lucide-react";
import { Upload } from "lucide-react";
import { cn } from "@/core/lib/utils";

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
        <Button 
          variant="outline" 
          className="flex items-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <Upload className="w-4 h-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileUp className="w-5 h-5 text-blue-500" />
            Importar Contactos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Drag & Drop zone */}
          <div className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all",
            "hover:border-blue-500 hover:bg-blue-50",
          )}>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isLoading}
              id="csv-upload"
            />
            <label 
              htmlFor="csv-upload"
              className="cursor-pointer space-y-2 block"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
              <p className="font-medium">
                {isLoading ? "Procesando archivo..." : "Arrastra tu archivo CSV aquí"}
              </p>
              <p className="text-sm text-gray-500">
                o haz clic para seleccionar
              </p>
            </label>
          </div>

          {/* Format info */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium text-gray-700">Formato requerido:</p>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Nombre (obligatorio)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Relación (opcional)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Localización (opcional)
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
