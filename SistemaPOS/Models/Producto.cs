using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaPOS.Models;

public class Producto
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public required string Nombre { get; set; }

    [Required]
    public decimal Precio { get; set; }

    [Required]
    public int Stock { get; set; }

    [ForeignKey(nameof(Categoria))]
    public int CategoriaId { get; set; }

    public required Categoria Categoria { get; set; }
}
