using System.ComponentModel.DataAnnotations;

namespace SistemaPOS.Dtos;

public sealed class CreateVentaDto
{
    [Range(1, int.MaxValue)]
    public int ClienteId { get; set; }

    [Required]
    [MinLength(1)]
    public List<DetalleItemDto> Detalles { get; set; } = [];
}
