export function AttributionFooter() {
  return (
    <footer className="border-t border-border bg-surface-secondary text-center py-4 px-4 text-sm text-secondary">
      <div className="max-w-6xl mx-auto flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p>
            © Dados de{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              OpenStreetMap
            </a>
            {" "}disponibilizados sob a licença{" "}
            <a
              href="https://opendatacommons.org/licenses/odbl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              ODbL
            </a>
          </p>
          <p className="text-xs">
            Geocodificação fornecida por{" "}
            <a
              href="https://nominatim.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nominatim
            </a>
          </p>
        </div>

        <div className="border-t border-border pt-2">
          <p>
            Dados meteorológicos fornecidos por{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Open-Meteo
            </a>
            {" "}sob a licença{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CC-BY 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
