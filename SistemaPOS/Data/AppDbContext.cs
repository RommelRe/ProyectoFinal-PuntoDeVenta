using Microsoft.EntityFrameworkCore;

namespace SistemaPOS.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
}
