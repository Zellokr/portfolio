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
---

Consola de IAM donde un agente de IA (Groq, con streaming en tiempo real) puede
consultar accesos y proponer cambios, pero nunca decide por sí solo: cada
concesión o revocación pasa por un motor de políticas determinista en
TypeScript. Los recursos sensibles requieren aprobación humana explícita antes
de que el permiso cambie, y cada acción (del agente o del administrador) queda
en un registro de auditoría. Construido con Nuxt y Convex como backend en
tiempo real.
