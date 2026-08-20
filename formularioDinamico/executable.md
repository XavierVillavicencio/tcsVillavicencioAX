\# 📑 INSTRUCCIONES DEL PROYECTO: GENERADOR DINÁMICO DE FORMULARIOS ADAPTATIVOS



Actúa como un Arquitecto de Software y Desarrollador Senior FullStack. Necesito que crees un demo completo, limpio y listo para producción de un \*\*Generador Dinámico de Formularios\*\*. La solución debe estar 100% Dockerizada y programada con \*\*C# .NET Core MVC\*\*, \*\*Razor (`.cshtml`)\*\*, \*\*Tailwind CSS\*\* y \*\*jQuery\*\*.



Implementa el proyecto siguiendo estrictamente esta estructura y principios:



\---



\## 1. Arquitectura de Código Limpio (Backend C#)

Organiza el backend usando patrones de diseño para evitar acoplamiento y manejar lógica condicional:



\* \*\*Modelo / Dominio (`FormField.cs`):\*\* Clase fuertemente tipada que mapea las propiedades del JSON (id, label, type, required, options). Debe soportar un `enum` para los tipos de campo: `Text`, `Number`, `Date`, `Select`, `Radio`, `Checkbox`. Además, debe extenderse para soportar un nodo de dependencias condicionales (`dependsOn` y un sub-arreglo de `fields`).

\* \*\*Patrón Factory (`FieldRendererFactory.cs`):\*\* Diseña una factoría o lógica limpia para procesar los campos según su tipo, mitigando estructuras gigantes de `if-else` o componentes acoplados.

\* \*\*Controller (`HomeController.cs`):\*\* Lee una constante JSON maestro (hardcodeada en el código o cargada en memoria), la deserializa en una lista fuertemente tipada de `FormField` y la pasa directamente a la Vista a través del modelo.



\### 📄 JSON Maestro de Entrada (Estructura Base)

El controlador debe alimentar el formulario con este JSON exacto, el cual incluye un selector de país estático y bloques condicionales que se activan según el valor seleccionado (Datos Personales de Ecuador y Colombia):



```json

\[

&#x20; { "id": "txt\_nombre", "label": "Nombre Completo", "type": "text", "required": true, "placeholder": "Ej. Andrés Mendoza" },

&#x20; { "id": "num\_edad", "label": "Edad", "type": "number", "required": true, "min": 18 },

&#x20; { "id": "fec\_registro", "label": "Fecha de Registro", "type": "date", "required": false },

&#x20; { 

&#x20;   "id": "sel\_pais", "label": "País de Residencia", "type": "select", "required": true,

&#x20;   "options": \[

&#x20;     { "value": "", "text": "-- Seleccione un País --" },

&#x20;     { "value": "EC", "text": "Ecuador" },

&#x20;     { "value": "CO", "text": "Colombia" }

&#x20;   ]

&#x20; },

&#x20; {

&#x20;   "id": "condicional\_EC",

&#x20;   "dependsOn": { "field": "sel\_pais", "value": "EC" },

&#x20;   "type": "conditional",

&#x20;   "fields": \[

&#x20;     { "id": "txt\_cedula", "label": "Cédula de Identidad (Ecuador)", "type": "text", "required": true, "placeholder": "17xxxxxxx-x" },

&#x20;     { 

&#x20;       "id": "sel\_provincia", "label": "Provincia", "type": "select", "required": true,

&#x20;       "options": \[

&#x20;         { "value": "pichincha", "text": "Pichincha" },

&#x20;         { "value": "guayas", "text": "Guayas" }

&#x20;       ]

&#x20;     }

&#x20;   ]

&#x20; },

&#x20; {

&#x20;   "id": "condicional\_CO",

&#x20;   "dependsOn": { "field": "sel\_pais", "value": "CO" },

&#x20;   "type": "conditional",

&#x20;   "fields": \[

&#x20;     { "id": "txt\_nit", "label": "NIT / Cédula de Ciudadanía (Colombia)", "type": "text", "required": true, "placeholder": "Ej. 900.123.456" },

&#x20;     { 

&#x20;       "id": "sel\_departamento", "label": "Departamento", "type": "select", "required": true,

&#x20;       "options": \[

&#x20;         { "value": "cundinamarca", "text": "Cundinamarca" },

&#x20;         { "value": "antioquia", "text": "Antioquia" }

&#x20;       ]

&#x20;     }

&#x20;   ]

&#x20; },

&#x20; {

&#x20;   "id": "rad\_suscripcion", "label": "Tipo de Plan", "type": "radio",

&#x20;   "options": \[

&#x20;     { "value": "free", "text": "Gratuito" },

&#x20;     { "value": "premium", "text": "Premium Pro" }

&#x20;   ]

&#x20; },

&#x20; { "id": "chk\_terminos", "label": "Acepto términos y condiciones", "type": "checkbox", "required": true }

]

2\. Frontend de Alta Fidelidad (Razor + Tailwind CSS)

Vista (Index.cshtml): Recibe la lista de campos. Itera sobre ellos usando @foreach y renderiza componentes limpios. Separa los tipos de inputs en funciones locales de Razor (@functions) o bloques parciales para mantener el código pulcro.



Manejo de Bloques Condicionales: Los contenedores marcados como condicionales deben renderizarse inicialmente ocultos (hidden) y llevar atributos de datos (data-depends-on y data-depends-value) basados en la metadata del JSON para que la capa de scripts los identifique.



Estilos (Tailwind por CDN): Diseña una interfaz tipo SaaS premium con un fondo sutil (bg-slate-50), tarjetas blancas elegantes (bg-white shadow-xl rounded-2xl border border-slate-100 p-8), inputs estilizados con transiciones suaves (focus:ring-2 focus:ring-indigo-200 border-slate-200 rounded-xl transition-all) y botones modernos (bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold).



3\. Captura y Dependencias Dinámicas con jQuery

Manejo de Eventos (Toggle): Implementa un listener que escuche los cambios en los elementos padres (como el selector de país). Al cambiar, debe mostrar el bloque condicional correspondiente de forma fluida y ocultar los demás. Además, debe limpiar y deshabilitar (disabled) los campos ocultos para evitar enviar información corrupta.



Interceptación de Submit: Al hacer submit del formulario, intercepta el evento (e.preventDefault()).



Serialización Inteligente: Serializa de forma automática únicamente los campos dinámicos que estén visibles y activos en un objeto de respuesta JSON.



Renderizado de Datos: Muestra el JSON de salida en tiempo real dentro de un componente tipo consola o caja de código estilizada en la parte inferior de la pantalla (<pre class="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm font-mono overflow-x-auto mt-6">) para certificar el éxito del payload construido.



4\. Infraestructura Dockerizada (Docker + Docker Compose)

Genera la configuración necesaria para desplegar todo el entorno de C# local con un solo comando:



Dockerfile: Estructura multi-etapa (multi-stage). Usa la imagen SDK de .NET para compilar (mcr.microsoft.com/dotnet/sdk:8.0) y la de ASP.NET para la ejecución ligera en producción (mcr.microsoft.com/dotnet/aspnet:8.0).



docker-compose.yml: Define el servicio web de la app, mapea el puerto host 5000:8080, configura las variables de entorno para modo Development y crea una red tipo bridge.



Genera todo el código limpio, estructurado y completamente funcional para copiar y pegar directamente en los archivos correspondientes.

