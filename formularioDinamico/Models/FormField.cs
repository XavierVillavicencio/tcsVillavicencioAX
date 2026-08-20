namespace FormularioDinamico.Models;

public sealed class FormField
{
    public string Id { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public FormFieldType Type { get; init; }
    public bool Required { get; init; }
    public string? Placeholder { get; init; }
    public int? Min { get; init; }
    public int? Max { get; init; }
    public IReadOnlyList<FormOption> Options { get; init; } = Array.Empty<FormOption>();
    public FormDependency? DependsOn { get; init; }
    public IReadOnlyList<FormField> Fields { get; init; } = Array.Empty<FormField>();
}
