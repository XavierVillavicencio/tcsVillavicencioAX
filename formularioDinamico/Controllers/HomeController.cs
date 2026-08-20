using System.Text.Json;
using System.Text.Json.Serialization;
using FormularioDinamico.Models;
using Microsoft.AspNetCore.Mvc;

namespace FormularioDinamico.Controllers;

public sealed class HomeController : Controller
{
    private const string FormSchemaJson = """
    [
      { "id": "txt_nombre", "label": "Nombre Completo", "type": "text", "required": true, "placeholder": "Ej. Andres Mendoza" },
      { "id": "num_edad", "label": "Edad", "type": "number", "required": true, "min": 18, "max": 3 },
      { "id": "fec_registro", "label": "Fecha de Registro", "type": "date", "required": false },
      {
        "id": "sel_pais", "label": "País de Residencia", "type": "select", "required": true,
        "options": [
          { "value": "", "text": "-- Seleccione un País --" },
          { "value": "EC", "text": "Ecuador" },
          { "value": "CO", "text": "Colombia" }
        ]
      },
      {
        "id": "condicional_EC",
        "dependsOn": { "field": "sel_pais", "value": "EC" },
        "type": "conditional",
        "fields": [
          { "id": "txt_cedula", "label": "Cédula de Identidad (Ecuador)", "type": "text", "required": true, "placeholder": "17xxxxxxx-x" },
          {
            "id": "sel_provincia", "label": "Provincia", "type": "select", "required": true,
            "options": [
              { "value": "pichincha", "text": "Pichincha" },
              { "value": "guayas", "text": "Guayas" }
            ]
          }
        ]
      },
      {
        "id": "condicional_CO",
        "dependsOn": { "field": "sel_pais", "value": "CO" },
        "type": "conditional",
        "fields": [
          { "id": "txt_nit", "label": "NIT / Cédula de Ciudadanía (Colombia)", "type": "text", "required": true, "placeholder": "Ej. 900.123.456" },
          {
            "id": "sel_departamento", "label": "Departamento", "type": "select", "required": true,
            "options": [
              { "value": "cundinamarca", "text": "Cundinamarca" },
              { "value": "antioquia", "text": "Antioquia" }
            ]
          }
        ]
      },
      {
        "id": "rad_suscripcion", "label": "Tipo de Plan", "type": "radio",
        "options": [
          { "value": "free", "text": "Gratuito" },
          { "value": "premium", "text": "Premium Pro" }
        ]
      },
      { "id": "chk_terminos", "label": "Acepto términos y condiciones", "type": "checkbox", "required": true }
    ]
    """;

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
    };

    public IActionResult Index()
    {
        try
        {
            var fields = JsonSerializer.Deserialize<List<FormField>>(FormSchemaJson, JsonOptions);

            if (fields is null || fields.Count == 0)
            {
                return View(Array.Empty<FormField>());
            }

            return View(fields);
        }
        catch (JsonException)
        {
            return View(Array.Empty<FormField>());
        }
    }
}
