namespace SistemaPOS.Dtos;

public sealed class ProductoDto
{
    public int Id { get; set; }

    public required string Nombre { get; set; }

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public int CategoriaId { get; set; }

    public required string CategoriaNombre { get; set; }
}
