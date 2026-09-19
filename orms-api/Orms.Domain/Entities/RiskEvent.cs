using Orms.Domain.Enums;

namespace Orms.Domain.Entities;

public class RiskEvent
{
    public int Id { get; set; }
    public string EventCode { get; set; } = string.Empty;   // e.g. "ORM-2026-0001", generated on submit

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }

    public int BusinessUnitId { get; set; }
    public BusinessUnit BusinessUnit { get; set; } = null!;

    public int RiskCategoryId { get; set; }
    public RiskCategory RiskCategory { get; set; } = null!;

    public RiskEventType EventType { get; set; }
    public RiskEventStatus Status { get; set; } = RiskEventStatus.Draft;

    // Assessment (populated by ORO in Step 3)
    public int? Impact { get; set; }          // 1-5
    public int? Likelihood { get; set; }      // 1-5
    public int? InherentRating => Impact.HasValue && Likelihood.HasValue ? Impact * Likelihood : null;
    public int? ResidualImpact { get; set; }
    public int? ResidualLikelihood { get; set; }
    public int? ResidualRating => ResidualImpact.HasValue && ResidualLikelihood.HasValue
        ? ResidualImpact * ResidualLikelihood
        : null;
    public RiskSeverity? Severity { get; set; }

    // Financial impact
    public decimal? LossAmount { get; set; }
    public decimal? RecoveryAmount { get; set; }
    public string? GlReference { get; set; }

    // Audit / ownership
    public int SubmittedByUserId { get; set; }
    public ApplicationUser SubmittedBy { get; set; } = null!;
    public int? AssignedOroUserId { get; set; }
    public ApplicationUser? AssignedOro { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAt { get; set; }

    public ICollection<ActionPlan> ActionPlans { get; set; } = new List<ActionPlan>();
    public ICollection<EventStatusHistory> StatusHistory { get; set; } = new List<EventStatusHistory>();
    public ICollection<RiskEventAttachment> Attachments { get; set; } = new List<RiskEventAttachment>();
}

public class RiskEventAttachment
{
    public int Id { get; set; }
    public int RiskEventId { get; set; }
    public RiskEvent RiskEvent { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;   // blob storage path or file path
    public int UploadedByUserId { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}

public class EventStatusHistory
{
    public int Id { get; set; }
    public int RiskEventId { get; set; }
    public RiskEvent RiskEvent { get; set; } = null!;

    public RiskEventStatus FromStatus { get; set; }
    public RiskEventStatus ToStatus { get; set; }
    public int ChangedByUserId { get; set; }
    public ApplicationUser ChangedBy { get; set; } = null!;
    public string? Comment { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}

public class ActionPlan
{
    public int Id { get; set; }
    public int RiskEventId { get; set; }
    public RiskEvent RiskEvent { get; set; } = null!;

    public string Description { get; set; } = string.Empty;
    public int OwnerUserId { get; set; }
    public ApplicationUser Owner { get; set; } = null!;
    public DateTime DueDate { get; set; }
    public ActionItemStatus Status { get; set; } = ActionItemStatus.NotStarted;
    public string? EvidenceFilePath { get; set; }
    public DateTime? CompletedAt { get; set; }
}
