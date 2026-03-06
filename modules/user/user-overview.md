# USER Module Overview

**Module**: `user`  
**Purpose**: End-to-end administration of system users (list, create, update, delete) exposed only to admins via `/admin/users/*` routes.

## Highlights

- **UI surfaces**: `UserListScreen`, `UserAddScreen`, `UserUpdateScreen`, `UserDeleteScreen` under `app/components/user`.
- **Hooks**: `useUserList`, `useUserAdd`, `useUserUpdate`, `useUserDelete` (all `useMutation` wrappers around `apiClient`/`UserApiAdapter`).
- **Routing**: Protected admin routes defined in `App.tsx` and surfaced via `getAdminMenuData` for the admin menu (`AdminMenuPage`).
- **API**: Uses `/api/users/*` mocks (MSW) and `/users` endpoints in production via `UserApiAdapter` (create, list, get-by-id, update, delete).
- **Validation rules**: `userId` & `password` must be ≤8 chars; updates require 8-char password; `userType` only `A` or `U`.
- **Patterns**: Keyboard shortcuts (ENTER/F3/F4/F5/F12), select-based actions, inline Material UI alerts for status.

## Quick Links

- Hooks: `app/hooks/useUserList.ts`, `useUserAdd.ts`, `useUserUpdate.ts`, `useUserDelete.ts`  
- Services: `app/services/userApi.ts`, `app/services/api.ts`, `app/mocks/userListHandlers.ts`  
- Pages: `/admin/users/list`, `/admin/users/add`, `/admin/users/update`, `/admin/users/delete`  
- Documentation: `docs/modules/user/user-overview.md`, `docs/site/modules/user/index.html`
