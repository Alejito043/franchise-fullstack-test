using System.ComponentModel.DataAnnotations;

namespace FranchiseApi.Models;

public class Product
{
    public int Id { get; set; }
    public int BranchId { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}
