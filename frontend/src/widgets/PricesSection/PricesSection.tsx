import PricesCalculator from "../PricesCalculator/PricesCalculator";

function PricesSection() {
  return (
    <div
      id="prices"
      className="flex flex-col items-center w-full my-16 sm:my-24 md:my-36 lg:my-50 relative px-2 sm:px-0"
    >
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-font-primary w-full sm:w-[90%] md:w-[85%] lg:w-220 mb-4 sm:mb-5 z-99 leading-tight">
        Агрегатор{" "}
        <span className="bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
          Торговых площадок
        </span>
      </h2>
      <h3 className="text-center text-font-primary font-semibold text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-14 z-99 px-2">
        Объедините все каналы связи и управляйте клиентами из единого интерфейса
      </h3>
      <PricesCalculator />
      <div className="w-[80%] sm:w-[70%] md:w-[60%] h-60 sm:h-80 md:h-100 lg:h-120 bg-glare absolute -left-10 sm:-left-30 md:-left-60 lg:-left-100 bottom-0 blur-[100px] sm:blur-[150px] md:blur-[200px] rotate-45 rounded-full z-0 duration-200"></div>
    </div>
  );
}

export default PricesSection;
