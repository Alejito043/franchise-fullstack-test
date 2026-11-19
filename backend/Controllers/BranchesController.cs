using FranchiseApi.Data;
using FranchiseApi.Dtos;
using FranchiseApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FranchiseApi.Controllers;

[ApiController]
[Route("api")]
public class BranchesController : ControllerBase
{
    private readonly AppDbContext _db;

    public BranchesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("franchises/{franchiseId:int}/branches")]
    public async Task<ActionResult<List<BranchResponse>>> GetByFranchise(int franchiseId)
    {
        var franchiseExists = await _db.Franchises.AnyAsync(f => f.Id == franchiseId);
        if (!franchiseExists)
        {
            return Problem(title: "Franchise not found", detail: $"Franchise {franchiseId} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        var branches = await _db.Branches
            .AsNoTracking()
            .Where(b => b.FranchiseId == franchiseId)
            .OrderBy(b => b.Name)
            .Select(b => new BranchResponse(b.Id, b.FranchiseId, b.Name))
            .ToListAsync();

        return Ok(branches);
    }

    [HttpGet("branches/{id:int}")]
    public async Task<ActionResult<BranchResponse>> GetById(int id)
    {
        var branch = await _db.Branches.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
        if (branch is null)
        {
            return Problem(title: "Branch not found", detail: $"Branch {id} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        return Ok(new BranchResponse(branch.Id, branch.FranchiseId, branch.Name));
    }

    [HttpPost("franchises/{franchiseId:int}/branches")]
    public async Task<ActionResult<BranchResponse>> Create(int franchiseId, CreateBranchRequest request)
    {
        var franchiseExists = await _db.Franchises.AnyAsync(f => f.Id == franchiseId);
        if (!franchiseExists)
        {
            return Problem(title: "Franchise not found", detail: $"Franchise {franchiseId} does not exist.", statusCode: StatusCodes.Status404NotFound);
        }

        var branch = new Branch { FranchiseId = franchiseId, Name = request.Name.Trim() };

        _db.Branches.Add(branch);
        await _db.SaveChangesAsync();

        var response = new BranchResponse(branch.Id, branch.FranchiseId, branch.Name);
        return CreatedAtAction(nameof(GetById), new { id = branch.Id }, response);
    }
}
