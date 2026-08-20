using FormularioDinamico.Models;

namespace FormularioDinamico.Factories;

public sealed class FieldRendererFactory
{
    private static readonly IReadOnlyDictionary<FormFieldType, string> PartialNames =
        new Dictionary<FormFieldType, string>
        {
            [FormFieldType.Text] = "_TextField",
            [FormFieldType.Number] = "_NumberField",
            [FormFieldType.Date] = "_DateField",
            [FormFieldType.Select] = "_SelectField",
            [FormFieldType.Radio] = "_RadioField",
            [FormFieldType.Checkbox] = "_CheckboxField",
            [FormFieldType.Conditional] = "_ConditionalField"
        };

    public string ResolvePartial(FormField field)
    {
        ArgumentNullException.ThrowIfNull(field);

        if (string.IsNullOrWhiteSpace(field.Id))
        {
            throw new InvalidOperationException("Field id is required.");
        }

        if (!PartialNames.TryGetValue(field.Type, out var partialName))
        {
            throw new NotSupportedException($"Field type '{field.Type}' is not supported.");
        }

        return partialName;
    }
}
