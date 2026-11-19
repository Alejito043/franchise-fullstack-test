using FranchiseApi.Data;
using FranchiseApi.Dtos;
using FranchiseApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FranchiseApi.Controllers;

[ApiController]
[Route("api")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("branches/{branchId:int}/products")]
    public async Task<ActionResult<List<ProductResponse>>> GetByBranch(int branchId)
    {
        var branchExists = await _db.Branches.AnyAsync(b => b.Id == branchId);
        if (!branchExists)
        {
            return Problem(title: "Branch not found", detail: $"Branch {branchId} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        var products = await _db.Products
            .AsNoTracking()
            .Where(p => p.BranchId == branchId)
            .OrderBy(p => p.Name)
            .Select(p => new ProductResponse(p.Id, p.BranchId, p.Name, p.Stock))
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("products/{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetById(int id)
    {
        var product = await _db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
        {
            return Problem(title: "Product not found", detail: $"Product {id} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        return Ok(new ProductResponse(product.Id, product.BranchId, product.Name, product.Stock));
    }

    [HttpPost("branches/{branchId:int}/products")]
    public async Task<ActionResult<ProductResponse>> Create(int branchId, CreateProductRequest request)
    {
        var branchExists = await _db.Branches.AnyAsync(b => b.Id == branchId);
        if (!branchExists)
        {
            return Problem(title: "Branch not found", detail: $"Branch {branchId} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        var product = new Product { BranchId = branchId, Name = request.Name.Trim(), Stock = request.Stock };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        var response = new ProductResponse(product.Id, product.BranchId, product.Name, product.Stock);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, response);
    }

    [HttpPatch("products/{id:int}/stock")]
    public async Task<ActionResult<ProductResponse>> UpdateStock(int id, UpdateStockRequest request)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
        {
            return Problem(title: "Product not found", detail: $"Product {id} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        product.Stock = request.Stock!.Value;
        await _db.SaveChangesAsync();

        return Ok(new ProductResponse(product.Id, product.BranchId, product.Name, product.Stock));
    }
}
