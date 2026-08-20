using System.Text.Json.Serialization;

namespace FormularioDinamico.Models;

[JsonConverter(typeof(JsonStringEnumConverter<FormFieldType>))]
public enum FormFieldType
{
    Text,
    Number,
    Date,
    Select,
    Radio,
    Checkbox,
    Conditional
}
