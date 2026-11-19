using System.ComponentModel.DataAnnotations;

namespace FranchiseApi.Models;

public class Branch
{
    public int Id { get; set; }
    public int FranchiseId { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
