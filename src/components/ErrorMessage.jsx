function ErrorMessage({ error }) {
  return (
    <p className="mb-2 text-md text-red p-4 border-l-8 rounded-md border-red bg-red/5 flex items-center gap-2">
      <i className="pi pi-exclamation-circle font-semibold" />

      <span>{error}</span>
    </p>
  );
}

export default ErrorMessage;
