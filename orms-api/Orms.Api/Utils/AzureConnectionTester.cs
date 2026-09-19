using Microsoft.Data.SqlClient;

namespace Orms.Api.Utils;

/// <summary>
/// Utility to test Azure SQL connection string
/// </summary>
public class AzureConnectionTester
{
    public static async Task<bool> TestConnectionAsync(string connectionString)
    {
        try
        {
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                Console.WriteLine("✓ Connection to Azure SQL Database successful!");

                // Try a simple query to verify the connection is truly working
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT 1";
                    var result = await command.ExecuteScalarAsync();
                    Console.WriteLine($"✓ Query executed successfully. Server response: {result}");
                }

                return true;
            }
        }
        catch (SqlException ex)
        {
            Console.WriteLine($"✗ Azure SQL connection failed!");
            Console.WriteLine($"  Error Code: {ex.Number}");
            Console.WriteLine($"  Message: {ex.Message}");

            // Common error codes
            switch (ex.Number)
            {
                case 18456:
                    Console.WriteLine("  → Login failed - check your username and password");
                    break;
                case 40532:
                    Console.WriteLine("  → Resource limit reached - your service tier may be insufficient");
                    break;
                case 40540:
                case 40544:
                case 40549:
                case 40550:
                case 40551:
                case 40552:
                case 40553:
                    Console.WriteLine("  → Session limit exceeded - consider upgrading your service tier");
                    break;
                case 40615:
                    Console.WriteLine("  → Database not found - check your database name");
                    break;
                case -2:
                    Console.WriteLine("  → Timeout - check firewall rules and server availability");
                    break;
                case 0:
                    Console.WriteLine("  → Network error - check your internet connection and firewall");
                    break;
            }

            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"✗ Unexpected error: {ex.GetType().Name}");
            Console.WriteLine($"  Message: {ex.Message}");
            return false;
        }
    }
}
