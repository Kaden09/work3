interface IAuthButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
}

function AuthButton({ text, onClick, ...props }: IAuthButton) {
  return (
    <button
      onClick={onClick}
      className="bg-linear-to-b from-button-gradient-start to-button-gradient-end text-font-tertiary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full outline-none font-semibold cursor-pointer w-full shadow-[0_2px_4px_var(--color-hover-shadow)] hover:shadow-[0_3px_8px_var(--color-hover-shadow)] duration-200 mt-5 sm:mt-6 md:mt-7 text-sm sm:text-base"
      {...props}
    >
      {text}
    </button>
  );
}

export default AuthButton;
