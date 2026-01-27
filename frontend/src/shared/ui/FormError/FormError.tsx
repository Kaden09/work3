interface FormErrorProps {
  message: string;
}

function FormError({ message }: FormErrorProps) {
  return (
    <div className="mt-3 p-2 px-4 bg-red-400/10 text-red-500 rounded-full border border-red-400 text-xs sm:text-sm">
      {message}
    </div>
  );
}

export default FormError;
