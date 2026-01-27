import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../../shared/context/auth";

function UserInfo() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitial = () => {
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    return user?.email?.split("@")[0] || "Пользователь";
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-between w-full items-center bg-chat-secondary-bg border border-primary-border px-6 py-4 rounded-2xl animate-fade-in-bottom">
      <div className="flex gap-3 items-center">
        <div className="font-semibold text-2xl w-17 h-17 flex items-center justify-center rounded-full bg-chat-tertiary-bg text-font-primary">
          {getInitial()}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-font-primary text-xl">
            {getDisplayName()}
          </h2>
          <p className="text-md text-font-secondary">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-lg bg-red-bg-20 p-3 hover:bg-red-bg-30 cursor-pointer duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoggingOut ? (
          <Loader2 className="text-red-bg animate-spin" />
        ) : (
          <LogOut className="text-red-bg" />
        )}
      </button>
    </div>
  );
}

export default UserInfo;
