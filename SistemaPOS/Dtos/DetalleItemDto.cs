using System.ComponentModel.DataAnnotations;

namespace SistemaPOS.Dtos;

public sealed class DetalleItemDto
{
    [Range(1, int.MaxValue)]
    public int ProductoId { get; set; }

    [Range(1, int.MaxValue)]
    public int Cantidad { get; set; }
}
