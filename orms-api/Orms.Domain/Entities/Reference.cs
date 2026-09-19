namespace Orms.Domain.Entities;

public class BusinessUnit
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int? DepartmentHeadUserId { get; set; }
    public ApplicationUser? DepartmentHead { get; set; }

    public ICollection<RiskEvent> RiskEvents { get; set; } = new List<RiskEvent>();
}

public class RiskCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;      // e.g. "People", "Process", "Systems", "External Events"
    public string? ParentCategoryId { get; set; }          // for sub-categories if you want a taxonomy tree
    public bool IsActive { get; set; } = true;

    public ICollection<RiskEvent> RiskEvents { get; set; } = new List<RiskEvent>();
}
