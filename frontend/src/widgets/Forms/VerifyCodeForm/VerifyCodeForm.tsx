import { useEffect, useState } from "react";
import AuthButton from "../../../shared/ui/AuthButton/AuthButton";
import AuthInput from "../../../shared/ui/AuthInput/AuthInput";

function VerifyCodeForm() {
  const [time, setTime] = useState<number>(120);

  function formatTime(duration: number) {
    const minutes = duration / 60;
    const seconds = duration % 60;
    if (seconds < 10) return `${parseInt(minutes.toString(), 10)}:0${seconds}`;
    return `${parseInt(minutes.toString(), 10)}:${seconds}`;
  }

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) setTime(time - 1);
    }, 1000);
  }, [time]);

  return (
    <form className="animate-fade-in-bottom w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px]">
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-font-primary font-bold text-xl sm:text-2xl md:text-[28px] lg:text-[32px] text-center">
          Восстановление пароля
        </h1>
        <h3 className="text-font-secondary font-normal text-sm sm:text-base max-w-[280px] sm:max-w-[360px] md:max-w-120 text-center">
          На вашу почту был отправлен код восставновления. Пожалуйста, введите
          его в данное поле
        </h3>
      </div>
      <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8 md:mt-10">
        <AuthInput
          isPassword={false}
          placeholder="Код"
          maxLength={6}
          autoFocus
        />
      </div>
      <AuthButton text="Подтвердить" />
      {time > 0 ? (
        <p className="text-font-primary text-center text-xs sm:text-sm mt-4 sm:mt-5">
          Отправить код повторно через:{" "}
          <span className="text-font-contrast">{formatTime(time)}</span>
        </p>
      ) : (
        <p
          className="text-font-contrast text-center text-xs sm:text-sm mt-4 sm:mt-5 cursor-pointer underline-offset-2 underline"
          onClick={() => setTime(5)}
        >
          Отправить код повторно
        </p>
      )}
    </form>
  );
}

export default VerifyCodeForm;
