import { useState } from "react";
import { Link } from "react-router-dom";
import TransactionsItemsList from "../TransactionsItemsList/TransactionsItemsList";
import TransactionsFilter from "../../shared/ui/TransactionsFilter/TransactionsFilter";
import { useOrders } from "../../shared/api/hooks/useOrders";
import styles from "./Transactions.module.css";

const statusGroups: Record<number, string[]> = {
  1: ["delivered"],
  2: ["new", "confirmed", "assembled", "shipped"],
  3: ["cancelled"],
};

function Transactions() {
  const [filter, setFilter] = useState(0);
  const { data, isLoading } = useOrders(0, 10);

  const items = data?.items ?? [];
  const filtered = filter === 0
    ? items
    : items.filter((o) => statusGroups[filter]?.includes(o.status));

  return (
    <div className="flex flex-col gap-3 py-6 pb-4 px-8 bg-chat-secondary-bg rounded-2xl border border-primary-border w-full h-full overflow-hidden animate-fade-in-bottom">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-font-primary text-2xl font-semibold">
            История транзакций
          </h2>
          <p className="text-font-secondary">Все операции по вашим площадкам</p>
        </div>
        <TransactionsFilter selected={filter} onChange={setFilter} />
      </div>
      <div className={`grow overflow-auto mt-4 ${styles.transactions}`}>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-chat-tertiary-bg rounded-xl h-14" />
            ))}
          </div>
        ) : (
          <TransactionsItemsList orders={filtered} />
        )}
      </div>
      <div className="flex flex-col">
        <hr className="h-px border-none bg-linear-to-r from-chat-secondary-bg via-primary-border to-chat-secondary-bg mb-3" />
        <Link
          to="/app/profile/transactions"
          className="text-font-contrast text-center hover:text-hover-font-contrast"
        >
          Смотреть все
        </Link>
      </div>
    </div>
  );
}

export default Transactions;
