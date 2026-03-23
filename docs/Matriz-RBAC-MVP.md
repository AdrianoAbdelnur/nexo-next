# Matriz RBAC MVP

## Objetivo
Definir permisos por rol para web y app móvil en el MVP de Trailingsat.

## Roles
- `admin`
- `manager`
- `operator`
- `coordinator`
- `technician`

## Módulos y permisos

### 1) Auth y sesión
- Login/logout/me: todos los roles autenticados.
- Registro de usuarios:
  - MVP recomendado: solo `admin`.

### 2) Dashboard web
- Ver dashboard:
  - `admin`, `manager`, `operator`, `coordinator`.
- `technician`: no accede al dashboard web operativo (usa app móvil).

### 3) Administración de usuarios (`/dashboard/users` + APIs `/api/private/users*`)
- CRUD completo:
  - solo `admin`.
- `manager`, `operator`, `coordinator`, `technician`: prohibido (`403`).

### 4) Solicitudes (Paso 0)
- Crear/editar/listar/detalle:
  - `admin`, `manager`, `operator`, `coordinator`.
- `technician`: solo lectura limitada si se habilita explícitamente (por defecto no).

### 5) Coordinación por vehículo/intervención (Paso 1)
- Crear/editar/reprogramar/asignar técnico:
  - `admin`, `manager`, `coordinator`.
- `operator`:
  - lectura + comentarios operativos.
- `technician`: no.

### 6) Recursos por intervención (Paso 2)
- Definir/editar recursos:
  - `admin`, `manager`, `coordinator`.
- `operator`: lectura.
- `technician`: lectura solo de recursos asignados a su tarea.

### 7) App técnico (agenda/ejecución/evidencias)
- Agenda propia:
  - solo `technician` (sus tareas).
- Confirmar llegada / iniciar / finalizar:
  - `technician` asignado a la tarea.
- Cargar evidencias:
  - `technician` asignado.
- Cierre técnico:
  - `technician` asignado (sujeto a evidencias obligatorias).

### 8) Auditoría
- Ver historial:
  - `admin`, `manager`, `operator`, `coordinator`.
- `technician`: visibilidad acotada solo en su tarea (si se habilita).

## Reglas transversales
1. Toda API privada valida sesión (`401`) y rol (`403`).
2. Frontend oculta módulos no permitidos, pero el control real está en backend.
3. Los técnicos solo operan sobre tareas asignadas a su `user.id`.
4. Toda acción crítica queda auditada.

## Códigos de respuesta estándar
- `401 unauthorized`: no autenticado o token inválido/expirado.
- `403 forbidden`: autenticado pero sin permiso de rol.

## Implementación recomendada (orden)
1. Middleware/helper central de autorización por roles.
2. Aplicar primero en `/api/private/users*` y registro.
3. Aplicar en módulos de solicitudes/coordinación/recursos.
4. Ajustar guards de frontend (web y app) para UX consistente.
