namespace Orms.Domain.Enums;

public enum RiskEventStatus
{
    Draft = 0,
    Submitted = 1,
    PendingEndorsement = 2,
    PendingRiskReview = 3,
    Monitoring = 4,
    EscalatedToCommittee = 5,
    RemediationInProgress = 6,
    PendingClosureValidation = 7,
    Closed = 8,
    Reopened = 9
}

public enum RiskEventType
{
    LossEvent = 0,
    NearMiss = 1,
    ControlIssue = 2
}

public enum RiskSeverity
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum ActionItemStatus
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Overdue = 3
}

public enum AppRole
{
    RiskOwner = 0,
    DepartmentHead = 1,
    OperationalRiskOfficer = 2,
    RiskCommittee = 3,
    ComplianceAudit = 4,
    SystemAdministrator = 5
}
