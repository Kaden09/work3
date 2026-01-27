import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-svh relative animate-fade-in-bottom px-2 sm:px-0">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-font-primary text-center w-full sm:w-[90%] md:w-[85%] lg:w-211 leading-tight">
        Хотите{" "}
        <span className="bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
          увеличить продажи
        </span>{" "}
        и сохранить клиентов?
      </h1>
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-font-primary mt-6 sm:mt-8 md:mt-10 text-center px-2">
        Вся аналитика маркетплейсов в одной панели MANITO
      </h3>
      <p className="text-base sm:text-lg md:text-xl text-font-secondary w-full sm:w-[85%] md:w-[75%] lg:w-170 mt-4 sm:mt-5 text-center px-2">
        Мы объединяем все каналы продаж - больше не требуется открывать много
        окон для каждого маркетплейса!
      </p>
      <Link
        to="/login"
        className="flex items-center gap-2 sm:gap-3 text-font-tertiary text-base sm:text-lg font-semibold
             bg-linear-to-b from-button-gradient-start to-button-gradient-end
             px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 rounded-full
             hover:shadow-[0_3px_4px_var(--color-hover-shadow)]
             duration-150 mt-8 sm:mt-10 group"
      >
        Попробовать бесплатно
        <ChevronRight
          width={20}
          strokeWidth={3}
          className="mt-px transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

export default HeroSection;
