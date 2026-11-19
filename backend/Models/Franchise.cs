using System.ComponentModel.DataAnnotations;

namespace FranchiseApi.Models;

public class Franchise
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
