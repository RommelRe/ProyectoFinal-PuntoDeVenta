using System.ComponentModel.DataAnnotations;

namespace SistemaPOS.Dtos;

public sealed class CreateClienteDto
{
    [Required]
    [MaxLength(150)]
    public required string Nombre { get; set; }

    public string? Telefono { get; set; }

    public string? Email { get; set; }
}
