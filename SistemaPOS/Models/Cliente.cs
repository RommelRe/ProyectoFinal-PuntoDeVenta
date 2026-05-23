using System.ComponentModel.DataAnnotations;

namespace SistemaPOS.Models;

public class Cliente
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public required string Nombre { get; set; }

    public string? Telefono { get; set; }

    public string? Email { get; set; }
}
