# Backlog Detallado MVP

## Alcance confirmado
- Incluye: flujo completo desde formularios web hasta ejecución en app técnica (agenda, detalle, inicio/fin, evidencias, cierre).
- Queda fuera del MVP: monitoreo en vivo y tracking geolocalizado continuo.

## Objetivo del MVP
1. Alta de solicitud.
2. Coordinación por vehículo/intervención.
3. Asignación de técnico.
4. Recursos por intervención (base Odoo opcional mínima).
5. Agenda del técnico en app.
6. Ejecución guiada con evidencias obligatorias.
7. Cierre técnico + auditoría de cambios.

---

## EPIC 1: Autenticación segura y persistente (P0)
1. `AUTH-01` Web login robusto con JWT + cookie httpOnly.
2. `AUTH-02` Endpoint `/auth/me` confiable.
3. `AUTH-03` Logout real de sesión.
4. `AUTH-04` Guard de rutas privadas web.
5. `AUTH-05` Login mobile con persistencia segura.
6. `AUTH-06` Renovación/expiración de sesión.
7. `AUTH-07` RBAC mínimo por rol.

Criterios de aceptación:
- Login válido crea sesión y credenciales inválidas devuelven 401.
- Sin token o token inválido, endpoints privados devuelven 401.
- Roles no permitidos reciben 403.
- En app, reinicio conserva sesión y logout limpia almacenamiento seguro.

## EPIC 2: Contrato API v1 y base transversal (P0)
1. `API-01` Definir contrato v1 de payloads.
2. `API-02` Estandarizar respuestas (`ok`, `item/items`, `message/error`).
3. `API-03` Validación server-side estricta.
4. `API-04` Mapeo de estados y transiciones válidas.
5. `API-05` Catálogo de evidencias obligatorias por tipo de servicio.

Criterios de aceptación:
- Esquemas cerrados para solicitud, tarea, ejecución y evidencia.
- No se persisten datos inválidos.
- Cierre técnico bloqueado si faltan evidencias obligatorias.

## EPIC 3: Solicitudes (Paso 0) en Web (P0)
1. `REQ-01` Formulario alta de solicitud.
2. `REQ-02` Numeración única de solicitud.
3. `REQ-03` Listado y filtros de solicitudes.
4. `REQ-04` Detalle de solicitud.
5. `REQ-05` Edición controlada de solicitud.

Criterios de aceptación:
- Se crea solicitud con datos mínimos obligatorios.
- Listado permite filtrar por empresa, estado, fecha y tipo.
- Cambios relevantes quedan auditados.

## EPIC 4: Coordinación por vehículo / intervención (Paso 1) (P0)
1. `COORD-01` Crear intervención por vehículo.
2. `COORD-02` Edición de coordinación y reprogramación.
3. `COORD-03` Replicación de formulario de coordinación.
4. `COORD-04` Asignación y reasignación de técnico.
5. `COORD-05` Validaciones de consistencia de agenda.

Criterios de aceptación:
- Se pueden crear y editar intervenciones por vehículo.
- Replicación masiva copia bloques y permite ajustar campos puntuales.
- Reasignaciones quedan con autoría y fecha.

## EPIC 5: Recursos por intervención (Paso 2) (P0/P1)
1. `RES-01` Pantalla de recursos por intervención.
2. `RES-02` Recurso obligatorio vs sugerido.
3. `RES-03` Cantidad planificada vs usada.
4. `RES-04` Integración Odoo mínima.
5. `RES-05` Snapshot local de recurso Odoo.

Criterios de aceptación:
- Recursos se agregan y editan por intervención.
- Campos de Odoo quedan guardados con snapshot.
- Se distinguen recursos requeridos y consumidos.

## EPIC 6: App técnico - Agenda y detalle (P0)
1. `MOB-01` Pantalla agenda del día.
2. `MOB-02` Filtro de agenda por fecha/estado.
3. `MOB-03` Detalle de tarea.
4. `MOB-04` Estado de sincronización visible.
5. `MOB-05` Reintento manual de sync.

Criterios de aceptación:
- Técnico visualiza tareas asignadas y detalle completo.
- Estados de sincronización son claros para operación de campo.

## EPIC 7: Ejecución técnica guiada (Paso 3) (P0)
1. `EXEC-01` Confirmar llegada.
2. `EXEC-02` Iniciar tarea.
3. `EXEC-03` Flujo guiado de evidencias por pasos.
4. `EXEC-04` Carga de fotos/evidencias.
5. `EXEC-05` Observaciones de técnico.
6. `EXEC-06` Finalizar tarea.
7. `EXEC-07` Cierre técnico.

Criterios de aceptación:
- Transiciones de estado válidas durante ejecución.
- Evidencias obligatorias exigidas antes de cierre.
- Queda registro de inicio/fin y observaciones.

## EPIC 8: Offline y resiliencia (P1)
1. `OFF-01` Cola local de eventos y evidencias.
2. `OFF-02` Reintentos automáticos con backoff.
3. `OFF-03` Resolución de conflictos simple.
4. `OFF-04` Integridad de archivos pendientes.

Criterios de aceptación:
- Operaciones críticas no se pierden sin conectividad.
- App permite recuperar y sincronizar pendientes.

## EPIC 9: Auditoría transversal (P0)
1. `AUD-01` Auditoría en cambios críticos.
2. `AUD-02` Auditoría de evidencias.
3. `AUD-03` Vista de historial por solicitud/intervención.
4. `AUD-04` Origen web/app por evento.

Criterios de aceptación:
- Se registra quién, cuándo y qué cambió.
- Historial consultable por entidad operativa.

## EPIC 10: UX web mínima operativa (P1)
1. `WEB-01` Dashboard operativo básico sin monitoreo en vivo.
2. `WEB-02` Navegación completa entre módulos MVP.
3. `WEB-03` Formularios con validación y mensajes claros.

Criterios de aceptación:
- Flujo operativo completo navegable sin bloqueos.
- Errores de negocio visibles y comprensibles.

## EPIC 11: QA, seguridad y salida a producción (P0)
1. `QA-01` Pruebas API happy path/error path.
2. `QA-02` Pruebas E2E del flujo completo.
3. `QA-03` Hardening de seguridad.
4. `QA-04` Checklist release MVP.

Criterios de aceptación:
- Flujo solicitud -> coordinación -> recursos -> app técnico -> cierre validado.
- Manejo consistente de 401/403 y datos sensibles protegidos.

---

## Orden recomendado por sprints
1. Sprint 1: EPIC 1 + EPIC 2 + inicio EPIC 3.
2. Sprint 2: cierre EPIC 3 + EPIC 4.
3. Sprint 3: EPIC 5 + EPIC 6.
4. Sprint 4: EPIC 7 + EPIC 9.
5. Sprint 5: EPIC 8 + EPIC 10 + EPIC 11.

## Definición de MVP completo (sin monitoreo/tracking)
1. Login persistente y seguro en web/app funcionando.
2. Flujo web completo hasta dejar intervenciones listas para ejecutar.
3. Técnico ejecuta desde agenda con evidencias obligatorias y cierre válido.
4. Auditoría transversal activa en todas las acciones críticas.
5. Operación tolerante a conectividad irregular con cola de sincronización.
