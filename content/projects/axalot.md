---
title: Axalot
slug: axalot
summary: Consola interna de IAM con un agente de IA que propone cambios de acceso; un motor de políticas determinista decide.
description: Consola interna de gestión de identidades y accesos (IAM). Un administrador consulta o cambia los permisos de los empleados sobre los recursos de la empresa desde la interfaz o hablando con un agente de IA en lenguaje natural. El agente propone; un motor de políticas determinista en el backend decide.
stack:
  - Nuxt
  - Convex
  - TypeScript
url: https://axalot-gamma.vercel.app/
image: /images/projects/axalot.webp
repo: https://github.com/Zellokr/axalot
order: 4
featured: false
problem: "Dar a un agente de IA la capacidad de operar sobre permisos sensibles sin que pueda conceder o revocar accesos por su cuenta."
approach: "El agente (Groq, con streaming en tiempo real) consulta y propone cambios, pero toda concesión o revocación pasa por un motor de políticas determinista en TypeScript; los recursos sensibles exigen aprobación humana explícita y cada acción queda registrada."
highlights:
  - "Motor de políticas determinista en TypeScript que decide cada cambio"
  - "Agente de IA con Groq y streaming en tiempo real"
  - "Aprobación humana obligatoria para recursos sensibles"
  - "Registro de auditoría de cada acción, del agente y del administrador"
  - "Backend en tiempo real con Convex"
---

Consola de IAM donde un agente de IA (Groq, con streaming en tiempo real) puede
consultar accesos y proponer cambios, pero nunca decide por sí solo: cada
concesión o revocación pasa por un motor de políticas determinista en
TypeScript. Los recursos sensibles requieren aprobación humana explícita antes
de que el permiso cambie, y cada acción (del agente o del administrador) queda
en un registro de auditoría. Construido con Nuxt y Convex como backend en
tiempo real.
