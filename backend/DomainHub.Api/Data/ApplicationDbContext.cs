using DomainHub.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DomainHub.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}