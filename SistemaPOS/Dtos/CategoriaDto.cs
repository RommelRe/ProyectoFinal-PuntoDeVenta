namespace SistemaPOS.Dtos;

public sealed class CategoriaDto
{
    public int Id { get; set; }

    public required string Nombre { get; set; }

    public string? Descripcion { get; set; }
}
