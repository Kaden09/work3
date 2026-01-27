# Отчет по проекту

## Что сделано

### Backend

Написан API на .NET 9 с нуля. Использовал Clean Architecture - разбил на слои Domain, Application, Infrastructure, API.

Реализовал:
- Регистрация/логин через JWT
- Refresh токены с ротацией
- HttpOnly cookies (токены не видны в JS, защита от XSS)
- Блокировка после 5 неверных паролей на 15 мин
- Rate limiting чтоб не долбили API
- Валидация через FluentValidation
- Пароли хешируются BCrypt

Endpoints:
```
POST /api/Auth/register - регистрация
POST /api/Auth/login    - вход
POST /api/Auth/logout   - выход
POST /api/Auth/refresh  - обновить токен
GET  /api/Auth/me       - инфо о юзере
```

БД PostgreSQL, две таблицы - users и refresh_tokens. Все через EF Core с миграциями.

### Frontend

Интегрировал фронт с нашим API:
- Поправил запросы в register.ts и login.ts под формат API
- Настроил axios на /api/Auth
- Nginx проксирует /api на бекенд

### Деплой

Настроил CI/CD:
- GitHub Actions - при пуше в main автодеплой
- Docker Compose - 4 контейнера (frontend, api, postgres, redis)
- Volumes для сохранения данных при ребилде
- Nginx как реверс прокси

Сервер: 91.207.183.204

### Что использовал

Backend: .NET 9, Minimal APIs, EF Core 9, MediatR, FluentValidation, BCrypt, JWT

Frontend: React, TypeScript, Vite, Axios, Tailwind

Infra: Docker, Nginx, PostgreSQL 17, Redis 7

### Исправления безопасности и UX

**Cookie Security (AuthEndpoints.cs)**

Исправил проблему с аутентификацией на production. Cookies устанавливались с флагом `Secure=true` на HTTP, браузеры их игнорировали. Теперь логика определяет протокол динамически:

```csharp
var isHttps = httpContext.Request.IsHttps ||
    string.Equals(httpContext.Request.Headers["X-Forwarded-Proto"], "https");
```

SameSite адаптивный: Strict для HTTPS, Lax для HTTP.

**Logout (AuthContext.tsx, UserInfo.tsx)**

Реализовал полноценный logout:
- POST `/api/Auth/logout` для отзыва refresh token на сервере
- `queryClient.clear()` - очистка всего кэша react-query
- Очистка localStorage/sessionStorage
- Редирект на `/login` с `replace: true`

**Защита от back button (AuthContext.tsx)**

После logout пользователь мог нажать "назад" и попасть в приложение. Решение:

```typescript
useQuery({
  queryKey: ["auth", "me"],
  staleTime: 0,
  gcTime: 0,
  refetchOnWindowFocus: true,
});

useEffect(() => {
  const handlePopState = () => refetch();
  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, [refetch]);
```

Теперь при любом переходе назад/вперед проверяется актуальность сессии.

**Error Boundary (ErrorPage.tsx)**

Добавил централизованную обработку ошибок в роутере. При падении lazy-loaded модулей или runtime ошибках показывается стилизованная страница вместо белого экрана:

```tsx
{
  path: "/app",
  element: <PrivateRoute><App /></PrivateRoute>,
  errorElement: <ErrorPage />,
}
```

### Адаптивная верстка

Переработал Landing, Login, Signup под mobile-first:
- Брейкпоинты: 320px, 640px, 768px, 1024px
- Мобильное меню с hamburger для LandingHeader
- Горизонтальный скролл для AccountsCountButtonsList на мобильных
- Адаптивные размеры glare-эффектов

### Структура деплоя

```
docker-compose.prod.yml
├── frontend (nginx:alpine) - порт 80
│   └── proxy /api -> api:8080
├── api (.NET 9)
├── postgres:17-alpine
└── redis:7-alpine
```

Volumes персистентные, данные сохраняются между деплоями.

### Что дальше

- HTTPS через Let's Encrypt
- Подключить внешние API (Avito и тд)
- WebSocket для real-time чатов
- Мультиаккаунты
- SMS интеграция
