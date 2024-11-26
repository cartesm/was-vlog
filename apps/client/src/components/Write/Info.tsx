import { Info as InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useWrite } from "@/hooks/useWrite";
function Info() {
  const { index, text } = useWrite();
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <InfoIcon className="mr-2 h-5 w-5" />
            Información
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Este es un editor de texto simple con panel de control fijado y
            alternancia de contenido. Puedes cambiar entre el contenido
            principal y alternativo usando los botones en la parte superior.
          </p>
          <p className="mb-4">Características:</p>
          <ul className="list-disc list-inside">
            <li>Escritura de texto sin formato</li>
            <li>Conteo de palabras y caracteres</li>
            <li>Opciones básicas de formato (próximamente)</li>
            <li>Diseño responsive para dispositivos móviles y de escritorio</li>
            <li>Panel de control fijado en la parte superior</li>
            <li>Alternancia entre contenido principal y alternativo</li>
          </ul>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Palabras: {text[index].split(/\s+/).filter(Boolean).length}</p>
          <p>Caracteres: {text[index].length}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Info;
