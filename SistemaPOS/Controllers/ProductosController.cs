using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPOS.Data;
using SistemaPOS.Dtos;
using SistemaPOS.Models;

namespace SistemaPOS.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProductosController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductos()
    {
        var productos = await context.Productos
            .AsNoTracking()
            .Include(producto => producto.Categoria)
            .Select(producto => ToDto(producto))
            .ToListAsync();

        return Ok(productos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductoDto>> GetProducto(int id)
    {
        var producto = await context.Productos
            .AsNoTracking()
            .Include(producto => producto.Categoria)
            .Where(producto => producto.Id == id)
            .Select(producto => ToDto(producto))
            .FirstOrDefaultAsync();

        if (producto is null)
        {
            return NotFound();
        }

        return Ok(producto);
    }

    [HttpPost]
    public async Task<ActionResult<ProductoDto>> CreateProducto(CreateProductoDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var categoriaExiste = await context.Categorias
            .AnyAsync(categoria => categoria.Id == dto.CategoriaId);

        if (!categoriaExiste)
        {
            ModelState.AddModelError(nameof(dto.CategoriaId), "La categoria indicada no existe.");
            return ValidationProblem(ModelState);
        }

        var producto = new Producto
        {
            Nombre = dto.Nombre,
            Precio = dto.Precio,
            Stock = dto.Stock,
            CategoriaId = dto.CategoriaId,
            Categoria = null!
        };

        context.Productos.Add(producto);
        await context.SaveChangesAsync();

        var productoDto = await context.Productos
            .AsNoTracking()
            .Include(item => item.Categoria)
            .Where(item => item.Id == producto.Id)
            .Select(item => ToDto(item))
            .FirstAsync();

        return CreatedAtAction(nameof(GetProducto), new { id = producto.Id }, productoDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProducto(int id, CreateProductoDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var producto = await context.Productos.FindAsync(id);

        if (producto is null)
        {
            return NotFound();
        }

        var categoriaExiste = await context.Categorias
            .AnyAsync(categoria => categoria.Id == dto.CategoriaId);

        if (!categoriaExiste)
        {
            ModelState.AddModelError(nameof(dto.CategoriaId), "La categoria indicada no existe.");
            return ValidationProblem(ModelState);
        }

        producto.Nombre = dto.Nombre;
        producto.Precio = dto.Precio;
        producto.Stock = dto.Stock;
        producto.CategoriaId = dto.CategoriaId;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProducto(int id)
    {
        var producto = await context.Productos.FindAsync(id);

        if (producto is null)
        {
            return NotFound();
        }

        context.Productos.Remove(producto);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static ProductoDto ToDto(Producto producto)
    {
        return new ProductoDto
        {
            Id = producto.Id,
            Nombre = producto.Nombre,
            Precio = producto.Precio,
            Stock = producto.Stock,
            CategoriaId = producto.CategoriaId,
            CategoriaNombre = producto.Categoria.Nombre
        };
    }
}
