using System.ComponentModel.DataAnnotations;

namespace FranchiseApi.Dtos;

// ---- Franchises ----
public class CreateFranchiseRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

public record FranchiseResponse(int Id, string Name);

// ---- Branches ----
public class CreateBranchRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

public record BranchResponse(int Id, int FranchiseId, string Name);

// ---- Products ----
public class CreateProductRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}

public class UpdateStockRequest
{
    [Required, Range(0, int.MaxValue)]
    public int? Stock { get; set; }
}

public record ProductResponse(int Id, int BranchId, string Name, int Stock);
