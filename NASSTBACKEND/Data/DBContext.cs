using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NASSTBACKEND.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace NASSTBACKEND.Data
{
    public partial class NASSTContext : IdentityDbContext<User, Role, string>
    {
        public NASSTContext(DbContextOptions<NASSTContext> options) : base(options) { }

        public virtual DbSet<User> Users => base.Users;
        public DbSet<Log> Logs { get; set; }
        public virtual DbSet<Role> Roles => base.Roles;
        public virtual DbSet<UserRefreshToken> UserRefreshTokens { get; set; }
        public DbSet<IdentityUserRole<string>> UserRoleBase => Set<IdentityUserRole<string>>();
        public DbSet<IdentityUserToken<string>> UserTokenBase => Set<IdentityUserToken<string>>();
        public DbSet<IdentityUserLogin<string>> UserLoginBase => Set<IdentityUserLogin<string>>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable(nameof(UserRoleBase));
            modelBuilder.Entity<User>()
                .HasOne(u => u.CreatedBy)
                .WithMany()
                .HasForeignKey(u => u.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(u => u.UpdatedBy)
                .WithMany()
                .HasForeignKey(u => u.UpdatedById)
                .OnDelete(DeleteBehavior.Restrict);

        }

        public static async Task Initialize(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if (!await roleManager.RoleExistsAsync(NASSTBACKEND.Data.Entities.Roles.User.ToString()))
            {
                await roleManager.CreateAsync(new Role { Name = NASSTBACKEND.Data.Entities.Roles.User.ToString() });
            }
            if (!await roleManager.RoleExistsAsync(NASSTBACKEND.Data.Entities.Roles.Admin.ToString()))
            {
                await roleManager.CreateAsync(new Role { Name = NASSTBACKEND.Data.Entities.Roles.Admin.ToString() });
            }
              if (!await roleManager.RoleExistsAsync(NASSTBACKEND.Data.Entities.Roles.Player.ToString()))
            {
                await roleManager.CreateAsync(new Role { Name = NASSTBACKEND.Data.Entities.Roles.Player.ToString() });
            }

        }

    }

}
