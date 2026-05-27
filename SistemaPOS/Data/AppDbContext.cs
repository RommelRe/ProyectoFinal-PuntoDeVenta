using Microsoft.EntityFrameworkCore;
using SistemaPOS.Models;

namespace SistemaPOS.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Categoria> Categorias => Set<Categoria>();

    public DbSet<Producto> Productos => Set<Producto>();

    public DbSet<Cliente> Clientes => Set<Cliente>();

    public DbSet<Venta> Ventas => Set<Venta>();

    public DbSet<DetalleVenta> DetallesVenta => Set<DetalleVenta>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Categoria>().HasData(
            new Categoria { Id = 1, Nombre = "Bebidas", Descripcion = "Refrescos, jugos y agua embotellada" },
            new Categoria { Id = 2, Nombre = "Snacks", Descripcion = "Botanas, galletas y frituras" },
            new Categoria { Id = 3, Nombre = "Lácteos", Descripcion = "Leche, queso, crema y yogurt" },
            new Categoria { Id = 4, Nombre = "Limpieza", Descripcion = "Productos de limpieza para hogar y negocio" });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.Property(producto => producto.Precio)
                .HasPrecision(18, 2);

            entity.HasData(
                new { Id = 1, Nombre = "Agua natural 1L", Precio = 18.00m, Stock = 80, CategoriaId = 1 },
                new { Id = 2, Nombre = "Refresco cola 600ml", Precio = 22.00m, Stock = 65, CategoriaId = 1 },
                new { Id = 3, Nombre = "Papas fritas 45g", Precio = 19.50m, Stock = 50, CategoriaId = 2 },
                new { Id = 4, Nombre = "Galletas de chocolate", Precio = 17.00m, Stock = 40, CategoriaId = 2 },
                new { Id = 5, Nombre = "Leche entera 1L", Precio = 29.90m, Stock = 35, CategoriaId = 3 },
                new { Id = 6, Nombre = "Detergente líquido 1L", Precio = 54.00m, Stock = 25, CategoriaId = 4 });
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.Property(venta => venta.Fecha)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(venta => venta.Total)
                .HasPrecision(18, 2);

            entity.HasOne(venta => venta.Cliente)
                .WithMany()
                .HasForeignKey(venta => venta.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(venta => venta.Detalles)
                .WithOne(detalle => detalle.Venta)
                .HasForeignKey(detalle => detalle.VentaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DetalleVenta>(entity =>
        {
            entity.Property(detalle => detalle.PrecioUnitario)
                .HasPrecision(18, 2);

            entity.HasOne(detalle => detalle.Producto)
                .WithMany()
                .HasForeignKey(detalle => detalle.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
