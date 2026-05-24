using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using SistemaPOS.Data;

#nullable disable

namespace SistemaPOS.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260524131113_InitialCreate")]
partial class InitialCreate
{
    protected override void BuildTargetModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "10.0.8")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

        modelBuilder.Entity("SistemaPOS.Models.Categoria", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<string>("Descripcion")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("Nombre")
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("nvarchar(100)");

            b.HasKey("Id");

            b.ToTable("Categorias");
        });

        modelBuilder.Entity("SistemaPOS.Models.Cliente", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<string>("Email")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("Nombre")
                .IsRequired()
                .HasMaxLength(150)
                .HasColumnType("nvarchar(150)");

            b.Property<string>("Telefono")
                .HasColumnType("nvarchar(max)");

            b.HasKey("Id");

            b.ToTable("Clientes");
        });

        modelBuilder.Entity("SistemaPOS.Models.Producto", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<int>("CategoriaId")
                .HasColumnType("int");

            b.Property<string>("Nombre")
                .IsRequired()
                .HasMaxLength(150)
                .HasColumnType("nvarchar(150)");

            b.Property<decimal>("Precio")
                .HasColumnType("decimal(18,2)");

            b.Property<int>("Stock")
                .HasColumnType("int");

            b.HasKey("Id");

            b.HasIndex("CategoriaId");

            b.ToTable("Productos");
        });

        modelBuilder.Entity("SistemaPOS.Models.Producto", b =>
        {
            b.HasOne("SistemaPOS.Models.Categoria", "Categoria")
                .WithMany()
                .HasForeignKey("CategoriaId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.Navigation("Categoria");
        });
#pragma warning restore 612, 618
    }
}
