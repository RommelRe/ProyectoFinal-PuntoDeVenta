namespace SistemaPOS.Dtos;

public sealed class VentaDto
{
    public int Id { get; set; }

    public required string ClienteNombre { get; set; }

    public DateTime Fecha { get; set; }

    public decimal Total { get; set; }

    public List<DetalleVentaDto> Detalles { get; set; } = [];
}

public sealed class DetalleVentaDto
{
    public int ProductoId { get; set; }

    public required string ProductoNombre { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal Subtotal { get; set; }
}
