# Plan de Implementación MVP

## Base utilizada
Este plan se construye a partir de [`docs/Documento-de-Inicio-de-Proyecto.md`](./Documento-de-Inicio-de-Proyecto.md) y del estado actual del código en `src/models`.

## 1) Diagnóstico actual (estado real del proyecto)

### 1.1 Modelo de datos ya implementado
Modelos existentes:
- `Company`
- `Contact`
- `Vehicle`
- `ServiceRequest`
- `Task`
- `TaskResource`
- `TaskExecution`
- `Evidence`
- `ActivityLog`
- `User`

### 1.2 Cobertura respecto al documento funcional
Cobertura alta (ya contemplado):
- Entidad padre `ServiceRequest` (solicitud)
- Entidad operativa `Task` por vehículo/intervención
- Recursos planificados y usados (`TaskResource`)
- Ejecución de tarea (`TaskExecution`)
- Evidencias con categorías de campo (`Evidence`)
- Trazabilidad transversal (`ActivityLog`)
- Estados base de solicitud/intervención/ejecución alineados al documento
- Snapshot de datos en intervención (empresa/contacto/vehículo)

Cobertura parcial o faltante:
- Eventos de seguimiento GPS en tiempo real como entidad dedicada (`EventoSeguimiento`)
- Catálogos configurables (tipos de evidencia/checklists/estados) como módulo editable
- Reglas obligatorias de evidencias por tipo de servicio en backend
- Integración Odoo operativa (hoy hay soporte de referencia en recursos, falta flujo completo)
- Flujo de replicación masiva con UX cerrada (si no existe aún en pantallas/API)
- Monitoreo operativo en vivo end-to-end (mapa + stream de eventos + alertas)

## 2) Objetivo del MVP (según documento)
Poner en producción una versión operable que cubra:
1. Alta de solicitud
2. Coordinación por vehículo/intervención
3. Asignación de técnico
4. Recursos con base Odoo (mínimo viable)
5. Ejecución móvil guiada con evidencias obligatorias
6. Monitoreo en vivo
7. Auditoría transversal completa

## 3) Plan por etapas (priorizado)

### Etapa 0 - Cierre funcional y contrato (1 semana)
- Congelar reglas de negocio críticas del documento (sección 16 y 24).
- Definir contrato Web <-> App para payloads y estados.
- Definir mínimo obligatorio de evidencias por tipo de servicio.

Entregables:
- Matriz de estados y transiciones.
- Matriz de evidencias obligatorias por tipo de servicio.
- Contrato API versionado (request/response/error).

### Etapa 1 - Consolidación backend sobre modelos existentes (1-2 semanas)
- Completar/ajustar endpoints CRUD de `ServiceRequest`, `Task`, `TaskResource`.
- Validación de transiciones de estado en backend (no solo frontend).
- Registro de auditoría obligatorio en cada operación relevante.
- Soft-delete y trazabilidad consistente en evidencias.

Entregables:
- APIs estables para Solicitud/Intervención/Recursos/Evidencias.
- Middleware o utilitario común de auditoría.

### Etapa 2 - Coordinación operativa y replicación (1-2 semanas)
- Pantalla/API de coordinación por vehículo.
- Función de replicación masiva (copiar bloque de coordinación y editar campos puntuales).
- Asignación/reasignación de técnico con historial.

Entregables:
- Flujo completo Paso 1 del documento (coordinación) funcional.
- Historial de cambios visible por intervención.

### Etapa 3 - Integración Odoo mínima viable (1 semana)
- Conector para consulta de catálogo de equipos.
- Selección de recursos por intervención con snapshot local.
- Manejo de fallos de integración y fallback manual.

Entregables:
- Flujo Paso 2 (lista de recursos) operativo con datos Odoo.

### Etapa 4 - Ejecución móvil guiada + offline básico (2 semanas)
- Agenda del técnico.
- Inicio/llegada/fin de tarea.
- Flujo guiado de evidencias por pasos.
- Cola de sincronización con reintentos e indicador de estado.

Entregables:
- Flujo Paso 3 del documento funcionando en app móvil.

### Etapa 5 - Monitoreo en vivo y seguimiento GPS (1-2 semanas)
- Crear entidad/evento de tracking (si no está implementado aún).
- Ingesta de ubicación periódica durante tarea activa.
- Panel web en vivo con mapa, estado, fotos y alertas.

Entregables:
- Centro de monitoreo operativo mínimo funcional.

### Etapa 6 - QA integral, seguridad y salida controlada (1 semana)
- Tests de happy-path y error-path en APIs críticas.
- Pruebas E2E del flujo completo solicitud -> cierre.
- Validaciones de seguridad (datos sensibles, roles mínimos).

Entregables:
- Checklist de salida a producción.
- Piloto controlado con métricas iniciales.

## 4) Backlog técnico inmediato (sprint actual)
1. Verificar y documentar endpoints existentes por entidad principal.
2. Implementar tabla formal de transiciones de estado.
3. Centralizar auditoría (helper/servicio reutilizable).
4. Definir `requiredEvidenceByServiceType` y validarlo en cierre.
5. Crear diseño de `tracking events` (modelo + API ingest + consulta).
6. Definir contrato Odoo mínimo (campos, errores, timeout, retries).

## 5) Riesgos y mitigación (alineado al documento)
- Cambios de coordinación frecuentes: historial y reprogramación estructurada.
- Mala conectividad: cola offline + reintentos + visibilidad de sync.
- Dependencia de Odoo: snapshot local + fallback manual.
- Crecimiento desordenado de formularios: parametrización temprana.

## 6) Criterio de "MVP listo"
El MVP se considera listo cuando:
- Se puede crear una solicitud y generar intervenciones por vehículo.
- Se puede coordinar, asignar técnico y preparar recursos.
- El técnico puede ejecutar, subir evidencias obligatorias y cerrar.
- El operador puede monitorear progreso en tiempo real.
- Toda acción crítica queda auditada con autor, fecha y cambios.
