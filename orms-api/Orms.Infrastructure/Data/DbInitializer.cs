namespace Orms.Infrastructure.Data;

public class DbInitializer
{
    private readonly OrmsDbContext _context;

    public DbInitializer(OrmsDbContext context)
    {
        _context = context;
    }

    public void Initialize()
    {
        try
        {
            if (_context.Database.CanConnect())
            {
                _context.Database.EnsureCreated();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database initialization error: {ex.Message}");
        }
    }
}
