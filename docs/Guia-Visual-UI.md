# Guia Visual UI

## Propósito

Este documento define la estética base para todas las interfaces del proyecto `nexo` y su app móvil asociada.
La referencia visual nace del ejemplo compartido por el usuario y debe usarse como guía al crear nuevas pantallas, componentes o estados vacíos.

## Dirección Estética

- Sistema operativo premium, limpio y muy legible.
- Sensación de panel de control empresarial, no de landing genérica.
- Luz clara, superficies suaves, jerarquía fuerte y acentos azules profundos.
- Layouts ordenados, con densidad controlada y tarjetas bien separadas.
- Componentes con presencia visual, pero sin exceso ornamental.

## Paleta Base

- `primary`: `#003366`
- `primary-strong`: `#001e40`
- `primary-soft`: `#3a5f94`
- `secondary`: `#3a5f94`
- `surface`: `#f8f9fb`
- `surface-low`: `#f2f4f6`
- `surface-high`: `#e6e8ea`
- `surface-strong`: `#d8dadc`
- `border`: `#c3c6d1`
- `text-main`: `#191c1e`
- `text-muted`: `#43474f`
- `accent-info`: `#a7c8ff`
- `accent-warning`: `#ffdcc3`
- `accent-danger`: `#ba1a1a`

## Tipografías

- Títulos: `Manrope`
- Texto y UI: `Inter`
- Usar pesos altos en titulares y labels cortos.
- Evitar fuentes genéricas o decorativas que rompan el tono técnico.

## Composición

- Sidebar vertical oscuro en desktop.
- Top bar clara con búsqueda, acciones rápidas y perfil.
- Contenido principal amplio, con márgenes generosos y bloques bien separados.
- Grid modular para cards, tablas y paneles de estado.
- En mobile, priorizar navegación inferior, tarjetas apiladas y accesos rápidos.

## Componentes Clave

- Cards con fondo claro, sombra suave y bordes discretos.
- Badges de estado con color funcional y texto corto.
- Tablas densas pero limpias para inventario, historial y auditoría.
- Botones primarios sólidos en azul profundo.
- Botones secundarios neutros con fondo de superficie.
- Barra lateral con estado activo muy visible.

## Efectos Visuales

- Usar glass o blur sólo cuando aporte jerarquía real.
- Sombras suaves, nunca pesadas ni difusas sin intención.
- Gradientes sutiles para acciones principales.
- Estados hover claros y consistentes.
- Mantener contraste alto y legibilidad perfecta.

## Do

- Usar el sistema de color definido arriba.
- Repetir la lógica visual de dashboard operativo.
- Diseñar con orden, precisión y sobriedad.
- Adaptar la densidad al contexto, especialmente en mobile.
- Mantener coherencia entre web y app.

## Don’t

- No usar gradientes violetas sobre blanco.
- No usar estética genérica tipo SaaS neutra sin identidad.
- No usar Inter como única solución visual si el título necesita carácter.
- No mezclar demasiados colores de acento.
- No crear UIs planas sin profundidad ni jerarquía.

## Regla Para Agentes

- Toda UI nueva generada para este proyecto debe tomar este archivo como referencia visual obligatoria.
- Si una pantalla necesita desviarse por contexto funcional, debe mantener la misma familia estética.
- Cualquier propuesta visual nueva debe conservar la identidad del panel: profesional, clara, azul profundo y operativa.
