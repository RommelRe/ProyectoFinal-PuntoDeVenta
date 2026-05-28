# Sistema POS

Sistema POS es una aplicación web para administrar productos, categorías, clientes y ventas de un punto de venta. El proyecto está construido con una API REST en ASP.NET Core y un frontend en React con Vite.

## Tecnologías Usadas

- .NET 10
- ASP.NET Core Web API
- React
- Vite
- Entity Framework Core
- SQL Server

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ProyectoFinal-PuntoDeVenta
```

### 2. Configurar la cadena de conexión

Editar el archivo `SistemaPOS/appsettings.Development.json` y configurar la cadena `DefaultConnection` según la instancia local de SQL Server.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SistemaPOSDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. Crear o actualizar la base de datos

Desde la carpeta del proyecto backend:

```bash
cd SistemaPOS
dotnet ef database update
```

### 4. Ejecutar el API

```bash
dotnet run
```

El API queda disponible en:

```text
https://localhost:7000
```

### 5. Instalar y ejecutar el frontend

En otra terminal, desde la carpeta `SistemaPOS`:

```bash
cd vista
npm install
npm run dev
```

El frontend queda disponible en la URL que muestre Vite en la terminal.

## Estructura de Carpetas

```text
ProyectoFinal-PuntoDeVenta/
├── README.md
├── SistemaPOS.sln
└── SistemaPOS/
    ├── Controllers/
    │   ├── CategoriasController.cs
    │   ├── ClientesController.cs
    │   ├── ProductosController.cs
    │   └── VentasController.cs
    ├── Data/
    │   └── AppDbContext.cs
    ├── Dtos/
    │   ├── CategoriaDto.cs
    │   ├── ClienteDto.cs
    │   ├── ProductoDto.cs
    │   ├── VentaDto.cs
    │   └── Create*.cs
    ├── Migrations/
    ├── Models/
    │   ├── Categoria.cs
    │   ├── Cliente.cs
    │   ├── Producto.cs
    │   ├── Venta.cs
    │   └── DetalleVenta.cs
    ├── Program.cs
    ├── appsettings.json
    ├── appsettings.Development.json
    └── vista/
        ├── public/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   │   ├── Categorias/
        │   │   ├── Clientes/
        │   │   ├── Dashboard/
        │   │   ├── NuevaVenta/
        │   │   └── Productos/
        │   ├── services/
        │   │   └── api.js
        │   ├── App.jsx
        │   └── main.jsx
        ├── package.json
        └── vite.config.js
```

## Endpoints Principales

### Productos

- `GET /api/productos` - Obtener productos
- `GET /api/productos/{id}` - Obtener un producto por ID
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

### Categorías

- `GET /api/categorias` - Obtener categorías
- `GET /api/categorias/{id}` - Obtener una categoría por ID
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/{id}` - Actualizar categoría
- `DELETE /api/categorias/{id}` - Eliminar categoría

### Clientes

- `GET /api/clientes` - Obtener clientes
- `GET /api/clientes/{id}` - Obtener un cliente por ID
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/{id}` - Actualizar cliente
- `DELETE /api/clientes/{id}` - Eliminar cliente

### Ventas

- `GET /api/ventas` - Obtener ventas
- `GET /api/ventas/{id}` - Obtener una venta por ID
- `POST /api/ventas` - Crear venta

## Funcionalidades Principales

- Dashboard con resumen general
- Administración de productos
- Administración de categorías
- Administración de clientes
- Registro de nuevas ventas
- Cálculo de total de venta en el frontend
- Consumo centralizado del API desde `src/services/api.js`
