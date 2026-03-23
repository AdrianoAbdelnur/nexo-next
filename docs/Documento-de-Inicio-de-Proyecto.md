# Documento de Inicio de Proyecto

## Sistema de Coordinación de Tareas Técnicas

### 1. Objetivo del proyecto
Diseñar e implementar un sistema integral para coordinar, planificar, ejecutar y auditar tareas técnicas de campo relacionadas con:
- instalación de equipos
- baja de equipos
- mantenimiento

El sistema debe permitir centralizar la solicitud, coordinación, preparación de recursos, ejecución en campo y seguimiento operativo en tiempo real, manteniendo un modelo de trabajo flexible en cuanto a roles, pero con fuerte trazabilidad de acciones mediante registros de actividad, autor, fecha y cambios realizados.

---

### 2. Visión general del sistema
El eje central del sistema será la tarea técnica.

Cada tarea recorrerá un flujo por etapas, desde la solicitud inicial hasta el cierre operativo y documental. El sistema tendrá una parte web administrativa/operativa y una app móvil para técnicos en campo.

#### Componentes principales
1. Panel web administrativo/operativo
   - alta y gestión de tareas
   - coordinación
   - asignación de técnico
   - planificación por vehículo
   - selección de recursos
   - monitoreo en tiempo real
   - seguimiento documental y fotográfico
   - auditoría de acciones
2. App móvil para técnico (React Native)
   - agenda/calendario de tareas
   - detalle de cada trabajo
   - navegación al lugar
   - inicio y fin de trabajo
   - carga guiada de evidencias
   - subida de fotos
   - notificaciones al operador
   - seguimiento GPS en tiempo real durante la ejecución
3. Integración con Odoo
   - consulta de equipos / recursos disponibles
   - eventual validación de stock / reserva / consumo
4. Sistema de auditoría y actividad
   - registro de toda modificación relevante
   - historial por tarea
   - historial por vehículo
   - historial por usuario

---

### 3. Objetivos funcionales
#### 3.1 Objetivos de negocio
- mejorar la organización de tareas técnicas
- reducir informalidad operativa sin rigidizar en exceso el trabajo
- unificar la información en una sola plataforma
- evitar pérdida de datos por comunicación informal
- dar visibilidad en tiempo real al operador/coordinador
- dejar evidencia documental de lo realizado
- facilitar seguimiento, control y auditoría
- sentar bases para escalabilidad futura

#### 3.2 Objetivos operativos
- cargar una necesidad una sola vez y derivarla a la operación
- coordinar múltiples vehículos dentro de una misma solicitud
- reutilizar y replicar formularios de coordinación para acelerar carga
- asignar técnicos y recursos con contexto completo
- asistir al técnico paso a paso en campo
- registrar evidencia antes, durante y después del trabajo
- informar al operador en tiempo real sobre estado y progreso

---

### 4. Alcance funcional inicial
#### Incluye
- gestión de solicitudes de trabajo
- gestión de tareas por servicio
- coordinación por vehículo
- asignación de técnico
- gestión de recursos/equipos
- integración base con Odoo para selección de equipos
- calendario operativo
- app móvil para técnico
- captura de fotos y evidencias
- seguimiento GPS del técnico durante la tarea
- panel de monitoreo en tiempo real
- historial de actividad y cambios
- cierre básico de tarea

#### No necesariamente incluye en primera etapa
- manejo rígido de permisos por rol
- facturación
- liquidación técnica
- control de stock completo dentro del nuevo sistema
- firma digital avanzada
- workflow documental legal complejo
- integración con múltiples ERP además de Odoo

---

### 5. Principios de diseño del sistema
#### 5.1 Flexibilidad operativa
El sistema no deberá depender inicialmente de un esquema extremadamente cerrado de permisos por rol. En lugar de eso, se priorizará:
- acceso relativamente abierto dentro de ciertos límites organizativos
- registro exhaustivo de actividad
- trazabilidad de cambios
- visibilidad de autoría y fechas

#### 5.2 Trazabilidad total
Toda acción importante debe quedar registrada:
- quién hizo la acción
- cuándo la hizo
- qué cambió
- valor anterior y nuevo valor cuando aplique
- desde qué módulo/pantalla se realizó

#### 5.3 Orientación a tarea y vehículo
Una solicitud puede involucrar varios vehículos. El sistema debe modelar claramente:
- solicitud general
- ítems o intervenciones por vehículo
- recursos por vehículo
- ejecución por vehículo

#### 5.4 Diseño para operación real
El sistema debe contemplar informalidad, cambios de último momento, reprogramaciones, duplicación de cargas similares, y necesidad de actuar rápido.

---

### 6. Flujo macro del proceso
#### Paso 0. Solicitud
Se registra la necesidad inicial del cliente o empresa.

**Datos principales**
- empresa
- contacto de la empresa
- tipo de servicio
  - instalación
  - baja
  - mantenimiento
- cantidad de vehículos
- observaciones generales
- prioridad
- origen de la solicitud
- fecha tentativa / ventana solicitada
- adjuntos iniciales si aplica
- responsable que carga la solicitud

**Resultado del paso**
Se crea una solicitud con uno o más vehículos/intervenciones pendientes de coordinación.

---

#### Paso 1. Coordinación
Se define el trabajo concreto para cada vehículo.

**Datos de coordinación por vehículo**
- fecha
- hora
- lugar
- técnico asignado
- responsable de coordinación
- patente
- tipo de vehículo
- marca
- modelo
- año de fabricación
- observaciones del vehículo
- restricciones operativas
- datos especiales para instalación o intervención

**Necesidad clave**
El sistema debe permitir replicar la carga de un formulario de coordinación para múltiples vehículos y modificar sólo ciertos datos:
- patente
- horario
- marca/modelo
- datos particulares

**Resultado del paso**
Queda creado un conjunto de tareas operativas por vehículo, listas para preparación de recursos y posterior ejecución.

---

#### Paso 2. Lista de recursos
Se definen los recursos necesarios para ejecutar cada intervención.

**Tipos de recursos**
- equipos electrónicos
  - GPS
  - MDVR
  - dashcam
  - cámaras ADAS
  - cámaras DMS
  - otros
- vehículo de la empresa
- herramientas especiales
- insumos
- accesorios

**Fuente de datos**
Los equipos deben consultarse desde una base de datos integrada con Odoo.

**Consideraciones funcionales**
- seleccionar recursos por tarea/vehículo
- definir cantidades
- indicar si un recurso es obligatorio o sugerido
- distinguir recursos planificados vs efectivamente usados
- reservar o preasignar si la integración lo permite
- registrar serie/identificador del equipo cuando corresponda

**Resultado del paso**
Cada intervención queda preparada con sus recursos previstos.

---

#### Paso 3. Desarrollo del trabajo
El técnico ejecuta la tarea desde la app móvil.

**Información disponible para el técnico**
- calendario de tareas
- fecha y hora
- lugar
- empresa / contacto
- tipo de trabajo
- detalles del vehículo
- recursos previstos
- observaciones
- navegación al destino

**Inicio de tarea**
Al llegar, el técnico puede:
- confirmar llegada
- iniciar la tarea
- habilitar seguimiento operativo

**Flujo guiado de ejecución**
El sistema debe guiar al técnico paso a paso.

**Etapa A. Registro inicial**
- foto de tablero con motor encendido
- foto de patente
- foto de odómetro
- otras fotos de estado inicial si corresponde

**Etapa B. Proceso de instalación / intervención**
- confirmación de tareas realizadas
- fotos del proceso o puntos críticos
- observaciones del técnico
- checklist técnico según tipo de servicio

**Etapa C. Registro final**
- fotos del equipamiento instalado
- fotos del estado final
- datos finales del equipo conectado
- validación de funcionamiento
- observaciones de cierre

**Comunicación en tiempo real con operador**
Durante la ejecución, el sistema debe notificar al operador:
- inicio de tarea
- ubicación actual del técnico
- avance de estados
- fotos subidas
- incidencias o bloqueos
- finalización

**Resultado del paso**
La tarea queda documentada y disponible para supervisión, validación y cierre.

---

### 7. Modelo conceptual de entidades
#### 7.1 Entidades principales
1. Empresa  
Representa al cliente o empresa solicitante.  
Campos sugeridos:
- id
- razón social
- nombre comercial
- CUIT u otro identificador
- dirección
- contactos asociados
- observaciones
- estado

2. Contacto  
Persona de contacto de la empresa.  
Campos sugeridos:
- id
- empresaId
- nombre
- cargo
- teléfono
- email
- observaciones
- preferencia de contacto

3. Solicitud  
Representa la necesidad inicial.  
Campos sugeridos:
- id
- número de solicitud
- empresaId
- contactoId
- tipoServicio
- cantidadVehiculos
- prioridad
- origen
- observacionesGenerales
- estadoGeneral
- fechaSolicitud
- creadoPor
- actualizadoPor
- timestamps

4. Vehículo  
Puede ser una entidad maestra o una entidad contextual dentro de la tarea según el grado de formalización inicial. Recomendación: tener entidad vehículo reutilizable.  
Campos sugeridos:
- id
- empresaId
- patente
- tipoVehiculo
- marca
- modelo
- año
- color
- chasis opcional
- observaciones

5. Intervención por vehículo / Task Item  
Es la unidad operativa real de trabajo por vehículo.  
Campos sugeridos:
- id
- solicitudId
- vehículoId o datosSnapshotVehiculo
- tipoServicio
- estado
- fechaProgramada
- horaProgramada
- lugar
- técnicoAsignadoId
- coordinadorId
- observaciones
- plantillaReplicadaDesdeId opcional
- orden

6. Recurso planificado  
Relaciona recursos con la intervención.  
Campos sugeridos:
- id
- intervencionId
- tipoRecurso
- recursoExternoId (Odoo)
- descripciónSnapshot
- cantidadPlanificada
- cantidadUsada
- serie
- obligatorio
- estado

7. Usuario  
Representa a cualquier actor interno.  
Campos sugeridos:
- id
- nombre
- email
- teléfono
- tipoUsuario
- activo
- datos básicos de perfil

8. Técnico  
Puede ser usuario con atributos adicionales o perfil técnico.  
Campos sugeridos:
- userId
- disponibilidad
- zona
- habilidades
- observaciones

9. Ejecución de tarea  
Registro operativo de la ejecución real.  
Campos sugeridos:
- id
- intervencionId
- fechaHoraInicio
- fechaHoraLlegada
- fechaHoraFin
- estadoEjecucion
- iniciadoPor
- finalizadoPor
- ubicaciónInicio
- ubicaciónFin
- duración
- observacionesCierre

10. Evidencia  
Fotos, archivos, videos o documentos.  
Campos sugeridos:
- id
- intervencionId
- ejecucionId
- tipoEvidencia
- categoría
- urlArchivo
- thumbnailUrl
- fechaHora
- subidoPor
- metadata
  - geolocalización
  - nombre archivo
  - tamaño
  - mime type

11. Evento de seguimiento  
Registro de geolocalización o eventos de campo.  
Campos sugeridos:
- id
- intervencionId
- tecnicoId
- timestamp
- latitud
- longitud
- precisión
- velocidad opcional
- tipoEvento

12. Comentario / novedad  
Permite registrar novedades operativas.  
Campos sugeridos:
- id
- entidadTipo
- entidadId
- texto
- autorId
- fechaHora
- visibilidad

13. Historial de actividad / auditoría  
Entidad crítica del sistema.  
Campos sugeridos:
- id
- entidadTipo
- entidadId
- acción
- campo
- valorAnterior
- valorNuevo
- descripción
- autorId
- fechaHora
- origen
- ip / dispositivo opcional

14. Catálogo de tipos de servicio
- instalación
- baja
- mantenimiento

15. Catálogo de estados
Estados de solicitud, intervención y ejecución.

---

### 8. Estados sugeridos
#### 8.1 Estados de solicitud
- borrador
- solicitada
- en coordinación
- parcialmente coordinada
- coordinada
- en ejecución
- parcialmente finalizada
- finalizada
- cancelada

#### 8.2 Estados de intervención por vehículo
- pendiente
- coordinada
- recursos definidos
- asignada
- en camino
- en sitio
- iniciada
- en progreso
- pausada
- completada
- observada
- reprogramada
- cancelada

#### 8.3 Estados de ejecución
- no iniciada
- llegada confirmada
- iniciada
- esperando validación
- finalizada
- cerrada

---

### 9. Pantallas del sistema web
#### 9.1 Dashboard general
Objetivo: brindar visibilidad operativa.

Indicadores sugeridos:
- tareas de hoy
- tareas por estado
- tareas por técnico
- tareas vencidas o demoradas
- próximas coordinaciones
- incidencias activas
- mapa con técnicos activos

#### 9.2 Listado de solicitudes
Funciones:
- ver solicitudes
- filtrar por empresa, fecha, estado, tipo de servicio
- crear nueva solicitud
- entrar al detalle

#### 9.3 Alta / edición de solicitud (Paso 0)
Sección para cargar datos iniciales.

#### 9.4 Detalle de solicitud
Debe mostrar:
- cabecera de la solicitud
- datos de empresa y contacto
- lista de vehículos/intervenciones
- estado general
- timeline / historial
- acceso a cada paso

#### 9.5 Pantalla de coordinación por vehículo (Paso 1)
Funciones:
- cargar fecha, hora, lugar, técnico y datos del vehículo
- replicar datos entre vehículos
- duplicar una intervención
- asignación masiva si aplica

#### 9.6 Herramienta de replicación / carga masiva
Pantalla o función clave para copiar:
- ubicación
- técnico
- responsable
- tipo de servicio
- bloques completos de datos
permitiendo cambiar campos puntuales.

#### 9.7 Pantalla de recursos (Paso 2)
Funciones:
- consultar recursos desde Odoo
- asociar equipos a cada intervención
- seleccionar cantidades
- registrar series
- identificar recursos críticos

#### 9.8 Agenda / planificación operativa
Vista calendario por:
- día
- semana
- técnico
- empresa
- estado

#### 9.9 Centro de monitoreo en tiempo real
Pantalla crítica para operadores.

Debe mostrar:
- mapa con ubicación del técnico
- estado actual de cada tarea
- hora programada vs real
- fotos subidas en tiempo real
- incidencias
- alertas de demora o desvío

#### 9.10 Detalle operativo en vivo
Para una intervención puntual.

Debe mostrar:
- datos del técnico
- ubicación actual
- timeline de eventos
- evidencias recibidas
- checklist de ejecución
- canal de observaciones

#### 9.11 Pantalla de auditoría / historial
Debe permitir ver:
- qué cambió
- quién lo cambió
- cuándo
- dónde
- comparativa de valores

#### 9.12 Gestión de catálogos
- tipos de servicio
- tipos de vehículo
- estados
- tipos de evidencia
- configuraciones de formularios/checklists

#### 9.13 Gestión de usuarios
Sin necesidad de permisos extremadamente rígidos en etapa inicial, pero sí:
- alta/baja
- activación/desactivación
- identificación del actor
- vinculación con perfil técnico u operador

---

### 10. Pantallas de la app móvil del técnico
#### 10.1 Login
- acceso del técnico
- persistencia de sesión

#### 10.2 Inicio / agenda
- tareas del día
- próximas tareas
- filtros por fecha
- estado

#### 10.3 Detalle de tarea
- empresa
- contacto
- dirección
- tipo de servicio
- vehículo
- observaciones
- recursos previstos
- botón navegar
- botón confirmar llegada
- botón iniciar tarea

#### 10.4 Navegación al destino
Puede apoyarse en mapas externos o navegación integrada.

#### 10.5 Inicio de tarea
- confirmación de presencia
- captura opcional de ubicación
- validación previa

#### 10.6 Flujo guiado de evidencias
Pantalla por pasos.

Ejemplo:
1. foto tablero motor encendido
2. foto patente
3. foto odómetro
4. foto estado inicial
5. fotos instalación
6. fotos equipamiento final
7. validación cierre

#### 10.7 Carga de observaciones
- notas de voz opcionales en etapa futura
- texto
- incidencias

#### 10.8 Estado de sincronización
Muy importante si hay mala conectividad.

Debe mostrar:
- pendientes de subir
- subido correctamente
- errores de sincronización

#### 10.9 Cierre de tarea
- checklist final
- observación final
- confirmación de finalización

---

### 11. Flujo funcional detallado recomendado
#### 11.1 Flujo de solicitud
1. un usuario crea una solicitud
2. completa empresa, contacto, tipo de servicio y cantidad de vehículos
3. guarda solicitud
4. sistema genera número identificador
5. solicitud queda en estado solicitada o en coordinación

#### 11.2 Flujo de coordinación
1. se ingresa al detalle de la solicitud
2. se crean una o varias intervenciones por vehículo
3. se cargan datos de fecha/hora/lugar/técnico
4. se cargan datos del vehículo
5. se replica formulario para otros vehículos si aplica
6. se guarda coordinación
7. sistema registra historial de cambios

#### 11.3 Flujo de recursos
1. coordinador abre una intervención
2. consulta catálogo/integración Odoo
3. selecciona equipos y otros recursos
4. guarda lista de recursos
5. intervención queda lista para ejecución

#### 11.4 Flujo de ejecución en campo
1. técnico ve tarea asignada en agenda
2. navega al lugar
3. confirma llegada
4. inicia tarea
5. app envía evento al operador
6. app guía al técnico por pasos
7. técnico sube evidencias
8. operador ve fotos y ubicación en tiempo real
9. técnico finaliza tarea
10. sistema registra cierre y deja historial completo

#### 11.5 Flujo de monitoreo operativo
1. operador accede al panel en vivo
2. visualiza técnicos activos y tareas en curso
3. recibe alertas y fotos
4. puede agregar observaciones o seguimiento
5. controla cumplimiento y progreso

---

### 12. Requisitos clave no funcionales
#### 12.1 Auditoría
Requisito crítico y obligatorio.

Debe registrarse al menos:
- creación de solicitud
- edición de solicitud
- asignación y reasignación de técnico
- cambio de fecha/hora/lugar
- alta o baja de recursos
- inicio y fin de tarea
- carga y eliminación lógica de evidencias
- cambios de estado

#### 12.2 Tolerancia a conectividad irregular
La app móvil debe contemplar:
- guardado local temporal
- cola de sincronización
- reintentos automáticos
- indicador visual de sincronización

#### 12.3 Geolocalización en tiempo real
- seguimiento durante ejecución
- frecuencia configurable
- bajo consumo de batería razonable
- control de privacidad fuera de la tarea activa

#### 12.4 Tiempos y usabilidad
- carga rápida
- formularios ágiles
- replicación eficiente
- mínimo esfuerzo para tareas repetitivas

#### 12.5 Evidencia segura
- almacenamiento ordenado de fotos
- metadatos
- compresión razonable
- control de acceso

---

### 13. Integración con Odoo
**Objetivo**
Usar Odoo como fuente de verdad para los equipos y eventualmente stock/disponibilidad.

**Integraciones mínimas sugeridas**
- consulta de catálogo de productos/equipos
- obtención de identificadores, nombre, tipo y series si aplica
- eventual consulta de disponibilidad

**Decisiones recomendadas**
- guardar referencia al id de Odoo
- guardar además snapshot descriptivo local al momento de asignación
  - nombre
  - tipo
  - serie
  - código

Esto evita inconsistencias si luego cambia el dato en Odoo.

---

### 14. Módulos sugeridos del sistema
1. Empresas y contactos
2. Solicitudes
3. Coordinación
4. Vehículos
5. Recursos / integración Odoo
6. Agenda y planificación
7. Ejecución móvil
8. Monitoreo en tiempo real
9. Evidencias
10. Auditoría e historial
11. Configuración y catálogos

---

### 15. Consideraciones de diseño de datos
#### 15.1 Solicitud vs intervención
Recomendación fuerte:
- mantener una entidad padre: Solicitud
- mantener una entidad hija: Intervención por vehículo

Esto permite:
- una sola necesidad comercial/operativa
- múltiples ejecuciones reales
- mejor control del avance parcial

#### 15.2 Snapshot de datos
Para evitar inconsistencias futuras, conviene guardar snapshots en las intervenciones de:
- nombre de empresa
- contacto
- datos del vehículo
- datos del recurso

Aunque existan entidades maestras relacionadas.

#### 15.3 Actividad desacoplada
El historial de actividad debe ser transversal y desacoplado, aplicable a múltiples entidades.

---

### 16. Reglas de negocio sugeridas
1. una solicitud puede tener uno o muchos vehículos
2. cada vehículo puede originar una intervención específica
3. una intervención debe tener al menos un tipo de servicio
4. una intervención puede reprogramarse sin perder historial
5. una intervención puede cambiar de técnico, dejando registro
6. los recursos planificados pueden diferir de los efectivamente utilizados
7. el técnico no debería cerrar una tarea sin evidencias mínimas obligatorias
8. los formularios de evidencias pueden variar según el tipo de servicio
9. el operador debe poder ver progreso en tiempo real sólo de tareas activas
10. toda modificación relevante debe quedar auditada

---

### 17. Checklists y formularios dinámicos
Aunque no es obligatorio en la primera versión, es altamente recomendable que los pasos de ejecución se diseñen de forma configurable.

Ejemplo:
- instalación: requiere tablero, patente, odómetro, equipo instalado, validación final
- mantenimiento: requiere diagnóstico inicial, fotos del problema, fotos solución, prueba final
- baja: requiere evidencia de desinstalación, estado final y devolución de equipo

Esto permitiría escalar sin reprogramar todo el flujo cada vez.

---

### 18. Alertas y notificaciones sugeridas
#### Para operador
- tarea iniciada
- tarea demorada
- técnico en sitio
- nuevas evidencias subidas
- tarea finalizada
- incidencia reportada

#### Para técnico
- nueva tarea asignada
- cambio de horario
- reprogramación
- recordatorio de turno
- observación del operador

---

### 19. Reportes sugeridos a futuro
- tareas por período
- tareas por empresa
- tareas por técnico
- cumplimiento de agenda
- tiempos reales de ejecución
- cantidad de instalaciones / bajas / mantenimientos
- productividad por técnico
- incidencias frecuentes
- evidencias incompletas

---

### 20. Riesgos y puntos críticos del proyecto
1. informalidad operativa excesiva  
   mitigación: actividad auditada + estados simples + trazabilidad
2. cambios frecuentes de coordinación  
   mitigación: historial + reprogramación estructurada
3. mala conectividad en campo  
   mitigación: modo offline parcial + cola de sincronización
4. complejidad excesiva en primera versión  
   mitigación: MVP enfocado en flujo principal
5. dependencia de Odoo  
   mitigación: snapshot local y sincronización controlada
6. crecimiento desordenado de formularios  
   mitigación: diseño modular y parametrizable

---

### 21. Recomendación de MVP
**Objetivo del MVP**
Poner en producción una primera versión útil, controlada y operable sin intentar resolver todo desde el día uno.

**Alcance MVP recomendado**
- alta de solicitud
- coordinación por vehículo
- replicación de formularios
- asignación de técnico
- lista de recursos simple con integración básica Odoo
- agenda de técnico en app móvil
- inicio/fin de tarea
- carga de fotos obligatorias
- geolocalización básica durante tarea activa
- panel web de seguimiento en vivo
- historial de actividad

**Dejar para fase 2**
- permisos avanzados
- workflows configurables complejos
- automatizaciones avanzadas
- reportes complejos
- firma digital
- stock avanzado bidireccional con Odoo

---

### 22. Propuesta de estructura de pantallas por módulo
#### Web
- Login
- Dashboard
- Solicitudes
- Nueva solicitud
- Detalle solicitud
- Coordinación por vehículo
- Replicación masiva
- Recursos
- Agenda/Calendario
- Monitoreo en vivo
- Detalle operativo
- Auditoría
- Catálogos
- Usuarios

#### App móvil
- Login
- Agenda
- Detalle de tarea
- Navegación
- Confirmar llegada
- Iniciar tarea
- Flujo de evidencias
- Observaciones / incidencias
- Finalizar tarea
- Estado de sincronización

---

### 23. Recomendaciones de arquitectura funcional
Separar claramente:
- capa administrativa/comercial (solicitud)
- capa operativa (intervenciones)
- capa de ejecución móvil (ejecución y evidencias)
- capa de monitoreo (seguimiento en vivo)
- capa de auditoría (actividad)

**Beneficios**
- mejor mantenibilidad
- mejor escalabilidad
- menor mezcla de conceptos
- mejor claridad para futuros desarrollos

---

### 24. Preguntas funcionales abiertas que el proyecto debería definir temprano
1. una solicitud puede mezclar distintos tipos de servicio o conviene una por tipo?
2. un técnico puede tener varias tareas superpuestas o se bloquea?
3. se requiere aprobación formal al finalizar o basta con cierre técnico?
4. la carga de evidencias será obligatoria por cantidad mínima o por tipo?
5. los datos del vehículo se reutilizarán como maestro permanente?
6. habrá confirmación del cliente en sitio?
7. se necesitan firmas?
8. se deben manejar adjuntos externos a las fotos?
9. la ubicación del técnico se verá siempre o sólo durante tarea activa?
10. cómo se resolverán reprogramaciones sobre la marcha?

---

### 25. Conclusión
El proyecto tiene una base muy sólida y responde a una necesidad operativa real: ordenar la coordinación técnica de campo sin volver rígida la operación.

La mejor estrategia es construir el sistema alrededor de la solicitud, las intervenciones por vehículo, la ejecución guiada en app móvil, el monitoreo en tiempo real y una auditoría transversal fuerte.

La decisión de no cerrar inicialmente el sistema con permisos extremadamente rígidos es válida, siempre que se compense con trazabilidad completa, historial de cambios y visibilidad operativa.

Desde el punto de vista de análisis funcional, este proyecto debería arrancar con:
- definición cerrada del modelo de datos base
- diseño del flujo completo de estados
- definición de pantallas MVP
- definición del flujo móvil guiado
- especificación de la integración con Odoo
- diseño del módulo de actividad/auditoría desde el inicio

Ese enfoque permitirá iniciar el desarrollo con una base profesional, escalable y alineada a la realidad operativa de la empresa.

---

### 26. Próximo entregable recomendado
Luego de este documento, el siguiente paso ideal sería elaborar uno de estos tres entregables:
1. Documento de requerimientos funcionales detallados por módulo
2. Modelo de datos / entidades y relaciones listo para desarrollo
3. Mapa de pantallas y flujo UX del sistema web + app móvil

El orden recomendado es:
1. entidades y relaciones
2. estados y reglas de negocio
3. pantallas y flujo
4. backlog MVP por etapas
