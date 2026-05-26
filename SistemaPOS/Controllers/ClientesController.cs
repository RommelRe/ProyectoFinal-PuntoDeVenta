using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPOS.Data;
using SistemaPOS.Dtos;
using SistemaPOS.Models;

namespace SistemaPOS.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ClientesController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteDto>>> GetClientes()
    {
        var clientes = await context.Clientes
            .AsNoTracking()
            .Select(cliente => ToDto(cliente))
            .ToListAsync();

        return Ok(clientes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(int id)
    {
        var cliente = await context.Clientes
            .AsNoTracking()
            .Where(cliente => cliente.Id == id)
            .Select(cliente => ToDto(cliente))
            .FirstOrDefaultAsync();

        if (cliente is null)
        {
            return NotFound();
        }

        return Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CreateCliente(CreateClienteDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var cliente = new Cliente
        {
            Nombre = dto.Nombre,
            Telefono = dto.Telefono,
            Email = dto.Email
        };

        context.Clientes.Add(cliente);
        await context.SaveChangesAsync();

        var clienteDto = ToDto(cliente);

        return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, clienteDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCliente(int id, CreateClienteDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var cliente = await context.Clientes.FindAsync(id);

        if (cliente is null)
        {
            return NotFound();
        }

        cliente.Nombre = dto.Nombre;
        cliente.Telefono = dto.Telefono;
        cliente.Email = dto.Email;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var cliente = await context.Clientes.FindAsync(id);

        if (cliente is null)
        {
            return NotFound();
        }

        context.Clientes.Remove(cliente);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static ClienteDto ToDto(Cliente cliente)
    {
        return new ClienteDto
        {
            Id = cliente.Id,
            Nombre = cliente.Nombre,
            Telefono = cliente.Telefono,
            Email = cliente.Email
        };
    }
}
