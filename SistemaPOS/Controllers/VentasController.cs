using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPOS.Data;
using SistemaPOS.Dtos;
using SistemaPOS.Models;

namespace SistemaPOS.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class VentasController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VentaDto>>> GetVentas()
    {
        var ventas = await context.Ventas
            .AsNoTracking()
            .Include(venta => venta.Cliente)
            .Include(venta => venta.Detalles)
            .ThenInclude(detalle => detalle.Producto)
            .OrderByDescending(venta => venta.Fecha)
            .ToListAsync();

        return Ok(ventas.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VentaDto>> GetVenta(int id)
    {
        var venta = await context.Ventas
            .AsNoTracking()
            .Include(item => item.Cliente)
            .Include(item => item.Detalles)
            .ThenInclude(detalle => detalle.Producto)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (venta is null)
        {
            return NotFound();
        }

        return Ok(ToDto(venta));
    }

    [HttpPost]
    public async Task<ActionResult<VentaDto>> CreateVenta(CreateVentaDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var clienteExiste = await context.Clientes
            .AnyAsync(cliente => cliente.Id == dto.ClienteId);

        if (!clienteExiste)
        {
            ModelState.AddModelError(nameof(dto.ClienteId), "El cliente indicado no existe.");
            return ValidationProblem(ModelState);
        }

        var productosIds = dto.Detalles
            .Select(detalle => detalle.ProductoId)
            .Distinct()
            .ToList();

        var productos = await context.Productos
            .Where(producto => productosIds.Contains(producto.Id))
            .ToDictionaryAsync(producto => producto.Id);

        var productosNoEncontrados = productosIds
            .Where(productoId => !productos.ContainsKey(productoId))
            .ToList();

        if (productosNoEncontrados.Count > 0)
        {
            ModelState.AddModelError(
                nameof(dto.Detalles),
                $"No existen los productos: {string.Join(", ", productosNoEncontrados)}.");

            return ValidationProblem(ModelState);
        }

        var detalles = dto.Detalles
            .GroupBy(detalle => detalle.ProductoId)
            .Select(grupo =>
            {
                var producto = productos[grupo.Key];
                var cantidad = grupo.Sum(detalle => detalle.Cantidad);

                return new DetalleVenta
                {
                    ProductoId = producto.Id,
                    Producto = producto,
                    Cantidad = cantidad,
                    PrecioUnitario = producto.Precio
                };
            })
            .ToList();

        var venta = new Venta
        {
            ClienteId = dto.ClienteId,
            Fecha = DateTime.UtcNow,
            Total = detalles.Sum(detalle => detalle.Cantidad * detalle.PrecioUnitario),
            Detalles = detalles
        };

        context.Ventas.Add(venta);
        await context.SaveChangesAsync();

        var ventaDto = await context.Ventas
            .AsNoTracking()
            .Include(item => item.Cliente)
            .Include(item => item.Detalles)
            .ThenInclude(detalle => detalle.Producto)
            .Where(item => item.Id == venta.Id)
            .Select(item => ToDto(item))
            .FirstAsync();

        return CreatedAtAction(nameof(GetVenta), new { id = venta.Id }, ventaDto);
    }

    private static VentaDto ToDto(Venta venta)
    {
        return new VentaDto
        {
            Id = venta.Id,
            ClienteNombre = venta.Cliente.Nombre,
            Fecha = venta.Fecha,
            Total = venta.Total,
            Detalles = venta.Detalles.Select(detalle => new DetalleVentaDto
            {
                ProductoId = detalle.ProductoId,
                ProductoNombre = detalle.Producto.Nombre,
                Cantidad = detalle.Cantidad,
                PrecioUnitario = detalle.PrecioUnitario,
                Subtotal = detalle.Cantidad * detalle.PrecioUnitario
            }).ToList()
        };
    }
}
