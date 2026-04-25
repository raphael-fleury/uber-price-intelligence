export function AttributionFooter() {
  return (
    <footer className="border-t border-border bg-surface-secondary text-center py-4 px-4 text-sm text-secondary">
      <div className="max-w-6xl mx-auto flex flex-col gap-2">
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
    </footer>
  );
}
