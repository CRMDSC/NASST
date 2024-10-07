using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext
builder.Services.AddDbContext<NASSTContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Identity services
builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<NASSTContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<User>>();
    var roleManager = services.GetRequiredService<RoleManager<Role>>();

    await NASSTContext.Initialize(userManager, roleManager);
    await InitializeAsync(app.Services, userManager);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

async Task InitializeAsync(IServiceProvider serviceProvider, UserManager<User> userManager)
{
    using var scope = serviceProvider.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<NASSTContext>();

    var user = await userManager.FindByEmailAsync("hdiana10@hotmail.com");
    if (user == null)
    {
        var admin = new User { UserName = "hdiana10@hotmail.com", Email = "hdiana10@hotmail.com" };
        await userManager.CreateAsync(admin, "P@ssw0rd");
        await userManager.AddToRoleAsync(admin, Roles.Admin.ToString());
    }
}
