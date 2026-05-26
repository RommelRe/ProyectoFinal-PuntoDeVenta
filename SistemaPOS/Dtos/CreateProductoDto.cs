using System.ComponentModel.DataAnnotations;

namespace SistemaPOS.Dtos;

public sealed class CreateProductoDto
{
    [Required]
    [MaxLength(150)]
    public required string Nombre { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Precio { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [Range(1, int.MaxValue)]
    public int CategoriaId { get; set; }
}
