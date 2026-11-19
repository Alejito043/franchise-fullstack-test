using FranchiseApi.Data;
using FranchiseApi.Dtos;
using FranchiseApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FranchiseApi.Controllers;

[ApiController]
[Route("api/franchises")]
public class FranchisesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FranchisesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<FranchiseResponse>>> GetAll()
    {
        var franchises = await _db.Franchises
            .AsNoTracking()
            .OrderBy(f => f.Name)
            .Select(f => new FranchiseResponse(f.Id, f.Name))
            .ToListAsync();

        return Ok(franchises);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FranchiseResponse>> GetById(int id)
    {
        var franchise = await _db.Franchises.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
        if (franchise is null)
        {
            return Problem(title: "Franchise not found", detail: $"Franchise {id} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        return Ok(new FranchiseResponse(franchise.Id, franchise.Name));
    }

    [HttpPost]
    public async Task<ActionResult<FranchiseResponse>> Create(CreateFranchiseRequest request)
    {
        var franchise = new Franchise { Name = request.Name.Trim() };

        _db.Franchises.Add(franchise);
        await _db.SaveChangesAsync();

        var response = new FranchiseResponse(franchise.Id, franchise.Name);
        return CreatedAtAction(nameof(GetById), new { id = franchise.Id }, response);
    }
}
