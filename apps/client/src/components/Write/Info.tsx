import { Info as InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
function Info() {
  const t = useTranslations();
  //TODO: seguir traduciendo
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <InfoIcon className="mr-2 h-5 w-5" />
            Información
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Usamos Markworn para renderizar el contenido de los posts,
            asegurando un formato limpio, organizado y visualmente atractivo
            para los usuarios.
          </p>
          <p className="mb-4">Elementos basicos:</p>
          <ul className="list-disc list-inside max-h-44 overflow-y-scroll flex gap-4 flex-col">
            <li>
              Titulo :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> ### Titulo</code>
              </div>
            </li>
            <li>
              Subtitulo :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> ## Subtitulo</code>
              </div>
            </li>
            <li>
              Cursiva :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> _Texto en cursiva_</code>
              </div>
            </li>
            <li>
              Nergita :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> **Texto en negrita**</code>
              </div>
            </li>
            <li>
              Cita :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {"> "}Cita </code>
              </div>
            </li>
            <li>
              Enlace :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> [Nombre](url) </code>
              </div>
            </li>
            <li>
              Imagen :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> ![Nombre](url-imagen) </code>
              </div>
            </li>
            <li>
              Lista :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code>
                  - Primer item
                  <br />- Segundo item ...
                </code>
              </div>
            </li>
            <li>
              Lista Ordenada :
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code>
                  1. Primer item
                  <br />
                  2. Segundo item...
                </code>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default Info;
