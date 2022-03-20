export function MainButton({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex rounded-md shadow disabled:opacity-50`}
      disabled={disabled}
    >
      <span
        className={`inline-flex items-center justify-center px-5 py-3 border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-br from-blue-400 to-zinc-500`}
      >
        {label}
      </span>
    </button>
  );
}

export function AddressInput({ label, value, onChange, onBlur, error }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={label}>{label}</label>
      <input
        name={label}
        value={value}
        type="text"
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onBlur(event.target.value)}
        className={"form-input rounded px-4 py-3"}
        placeholder="Wallet Address"
      />
      {error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : (
        <p className="text-sm">&nbsp;</p>
      )}
    </div>
  );
}

function SplitInput({ name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={`split-${name}`}>Split</label>
      <input
        name={`split-${name}`}
        value={value}
        type="number"
        onChange={(event) => onChange(Number(event.target.value))}
        className={"form-input rounded px-4 py-3"}
        placeholder={1}
        min={1}
        step={1}
      />
    </div>
  );
}

export function PartnerInput({ address, split }) {
  return (
    <div className={"flex"}>
      <div className={"mr-3 w-full"}>
        <AddressInput
          label={address.label}
          value={address.value}
          onChange={address.onChange}
          onBlur={address.onBlur}
          error={address.error}
        />
      </div>
      <div className={"w-1/5"}>
        <SplitInput
          name={split.name}
          value={split.value}
          onChange={split.onChange}
        />
      </div>
    </div>
  );
}
