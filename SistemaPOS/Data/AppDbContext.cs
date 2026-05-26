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

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.Property(producto => producto.Precio)
                .HasPrecision(18, 2);
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
