export default function FormField({ label, error, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
