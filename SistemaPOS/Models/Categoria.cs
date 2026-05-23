using System.ComponentModel.DataAnnotations;

namespace SistemaPOS.Models;

public class Categoria
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Nombre { get; set; }

    public string? Descripcion { get; set; }
}
