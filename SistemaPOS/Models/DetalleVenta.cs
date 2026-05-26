using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaPOS.Models;

public class DetalleVenta
{
    [Key]
    public int Id { get; set; }

    [ForeignKey(nameof(Venta))]
    public int VentaId { get; set; }

    public Venta Venta { get; set; } = null!;

    [ForeignKey(nameof(Producto))]
    public int ProductoId { get; set; }

    public Producto Producto { get; set; } = null!;

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }
}
