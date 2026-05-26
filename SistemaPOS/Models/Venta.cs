using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaPOS.Models;

public class Venta
{
    [Key]
    public int Id { get; set; }

    [ForeignKey(nameof(Cliente))]
    public int ClienteId { get; set; }

    public Cliente Cliente { get; set; } = null!;

    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    public decimal Total { get; set; }

    public List<DetalleVenta> Detalles { get; set; } = [];
}
