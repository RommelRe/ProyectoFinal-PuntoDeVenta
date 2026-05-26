using System.ComponentModel.DataAnnotations;

namespace SistemaPOS.Dtos;

public sealed class CreateCategoriaDto
{
    [Required]
    [MaxLength(100)]
    public required string Nombre { get; set; }

    public string? Descripcion { get; set; }
}
