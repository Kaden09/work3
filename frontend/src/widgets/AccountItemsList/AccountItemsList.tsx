import AccountItem from "../../shared/ui/AccountItem/AccountItem";
import {
  useWbAccounts,
  useRemoveWbAccount,
  useLoadFullHistory
} from "../../shared/api/hooks/useWbAccounts";

interface AccountItemsListProps {
  limit?: number;
}

function AccountItemsList({ limit }: AccountItemsListProps) {
  const { data: accounts, isLoading } = useWbAccounts();
  const { mutate: deleteAccount } = useRemoveWbAccount();
  const { mutate: loadHistory } = useLoadFullHistory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-font-secondary">Загрузка...</p>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-font-secondary">Нет подключённых аккаунтов</p>
      </div>
    );
  }

  const displayAccounts = limit ? accounts.slice(0, limit) : accounts;

  const handleDelete = (accountId: string) => {
    if (confirm("Удалить этот аккаунт?")) {
      deleteAccount(accountId);
    }
  };

  const handleLoadHistory = (accId: string, shopName: string) => {
    if (!confirm(`Загрузить всю историю чатов для ${shopName}? Это может занять время.`)) return;

    loadHistory(accId, {
      onSuccess: (count) => {
        alert(`Загружено ${count} сообщений`);
      },
      onError: (err: any) => {
        alert(err?.message || "Ошибка загрузки");
      }
    });
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 relative overflow-hidden">
      {displayAccounts.map((account) => (
        <AccountItem
          key={account.id}
          shopName={account.shopName}
          status={account.status}
          lastSyncAt={account.lastSyncAt}
          tokenExpiresAt={account.tokenExpiresAt}
          onDelete={() => handleDelete(account.id)}
          onLoadHistory={() => handleLoadHistory(account.id, account.shopName)}
        />
      ))}
    </div>
  );
}

export default AccountItemsList;
