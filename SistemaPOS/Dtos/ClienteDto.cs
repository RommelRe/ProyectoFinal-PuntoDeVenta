namespace SistemaPOS.Dtos;

public sealed class ClienteDto
{
    public int Id { get; set; }

    public required string Nombre { get; set; }

    public string? Telefono { get; set; }

    public string? Email { get; set; }
}
