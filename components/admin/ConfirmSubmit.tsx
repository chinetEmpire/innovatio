"use client";

type ConfirmSubmitProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  fields?: Record<string, string>;
  buttonClassName?: string;
  dataControl?: boolean;
  children: React.ReactNode;
};

export default function ConfirmSubmit({
  action,
  confirmMessage,
  fields = {},
  buttonClassName,
  dataControl,
  children,
}: ConfirmSubmitProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className={buttonClassName} {...(dataControl ? { "data-control": "true" } : {})}>
        {children}
      </button>
    </form>
  );
}
