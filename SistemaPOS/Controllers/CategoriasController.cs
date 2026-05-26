using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPOS.Data;
using SistemaPOS.Dtos;
using SistemaPOS.Models;

namespace SistemaPOS.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CategoriasController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetCategorias()
    {
        var categorias = await context.Categorias
            .AsNoTracking()
            .Select(categoria => ToDto(categoria))
            .ToListAsync();

        return Ok(categorias);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoriaDto>> GetCategoria(int id)
    {
        var categoria = await context.Categorias
            .AsNoTracking()
            .Where(categoria => categoria.Id == id)
            .Select(categoria => ToDto(categoria))
            .FirstOrDefaultAsync();

        if (categoria is null)
        {
            return NotFound();
        }

        return Ok(categoria);
    }

    [HttpPost]
    public async Task<ActionResult<CategoriaDto>> CreateCategoria(CreateCategoriaDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var categoria = new Categoria
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion
        };

        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var categoriaDto = ToDto(categoria);

        return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoriaDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategoria(int id, CreateCategoriaDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var categoria = await context.Categorias.FindAsync(id);

        if (categoria is null)
        {
            return NotFound();
        }

        categoria.Nombre = dto.Nombre;
        categoria.Descripcion = dto.Descripcion;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategoria(int id)
    {
        var categoria = await context.Categorias.FindAsync(id);

        if (categoria is null)
        {
            return NotFound();
        }

        context.Categorias.Remove(categoria);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static CategoriaDto ToDto(Categoria categoria)
    {
        return new CategoriaDto
        {
            Id = categoria.Id,
            Nombre = categoria.Nombre,
            Descripcion = categoria.Descripcion
        };
    }
}
