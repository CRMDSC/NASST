using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;
using NASSTBACKEND.Services.Interfaces;
using NASSTBACKEND.Services.General;
using Microsoft.OpenApi.Models;
using NASSTBACKEND.Options;
using System.Net;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;


var builder = WebApplication.CreateBuilder(args);

IConfigurationSection appConfigSection = builder.Configuration.GetSection(nameof(AppConfiguration));
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
AppConfiguration appConfig = appConfigSection.Get<AppConfiguration>();
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.

IConfigurationSection securitySection = builder.Configuration.GetSection(nameof(Security));
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
Security securityOptions = securitySection.Get<Security>();
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.

var swaggerSection = builder.Configuration.GetSection(nameof(Swagger));
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
Swagger swaggerOptions = swaggerSection.Get<Swagger>();
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.

ServicePointManager.ServerCertificateValidationCallback +=
           (sender, certificate, chain, sslPolicyErrors) => true;

builder.Services.AddMemoryCache();
builder.Services.Configure<AppConfiguration>(appConfigSection);
builder.Services.Configure<Security>(securitySection);


builder.Services.AddDbContext<NASSTContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<NASSTContext>()
    .AddDefaultTokenProviders();
builder.Services.AddControllers();
#pragma warning disable CS8602 // Dereference of a possibly null reference.
builder.Services.AddIdentityServer()
    .AddInMemoryClients(new List<Client>
    {
        new Client
        {
            ClientId = securityOptions.ClientId,
            ClientSecrets = {securityOptions.ClientSecret},
            AllowedGrantTypes = GrantTypes.ClientCredentials,
            AllowedScopes = { securityOptions.AllowedScopes }
        }
    })
    .AddInMemoryApiScopes(new List<ApiScope>
    {
        new ApiScope(securityOptions.AllowedScopes, securityOptions.ApiScopeDisplayName)
    })
    .AddDeveloperSigningCredential();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

builder.Services.AddAuthentication(
                options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
                }
                )
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters.ValidIssuer = securityOptions.Issuer;
                    options.TokenValidationParameters.ValidAudience = securityOptions.Audience;
                    options.TokenValidationParameters.IssuerSigningKey = securityOptions.SecurityKey;
                    options.TokenValidationParameters.ClockSkew = TimeSpan.Zero;
                });

builder.Services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters.ValidIssuer = securityOptions.Issuer;
    options.TokenValidationParameters.ValidAudience = securityOptions.Audience;
    options.TokenValidationParameters.IssuerSigningKey = securityOptions.SecurityKey;
    options.TokenValidationParameters.ClockSkew = TimeSpan.Zero;
});
builder.Services.AddMvc();
builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("User", policy => policy.RequireRole(Roles.User.ToString(), Roles.Admin.ToString()));
        options.AddPolicy("Admin", policy => policy.RequireRole(Roles.Admin.ToString()));
    });

builder.Services.AddSwaggerGen(options =>
{
#pragma warning disable CS8602 // Dereference of a possibly null reference.
    options.SwaggerDoc(swaggerOptions.Version, new OpenApiInfo
    {
        Title = swaggerOptions.Description,
        Version = swaggerOptions.Version
    });
#pragma warning restore CS8602 // Dereference of a possibly null reference.

    var securityScheme = new OpenApiSecurityScheme
    {
        Reference = new OpenApiReference { Id = "Bearer", Type = ReferenceType.SecurityScheme },
        Type = SecuritySchemeType.ApiKey,
        Scheme = "oauth2",
        Description = "JWT token",
        In = ParameterLocation.Header,
        Name = "Authorization",
        BearerFormat = "JWT"
    };
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
{
    In = ParameterLocation.Header,
    Description = "Please enter into field the word 'Bearer' followed by a space and the JWT value",
    Name = "Authorization",
    Type = SecuritySchemeType.ApiKey
});

options.AddSecurityRequirement(new OpenApiSecurityRequirement
{
    { 
        new OpenApiSecurityScheme 
        { 
            Reference = new OpenApiReference 
            { 
                Type = ReferenceType.SecurityScheme, 
                Id = "Bearer" 
            } 
        }, 
        new string[] {} 
    }
});

});


builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ISportTypeService, SportTypeService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IAdditionalInformationService, AdditionalInformationService>();
builder.Services.AddScoped<IDocumentTypeService, DocumentTypeService>();


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
    app.UseDeveloperExceptionPage();
}
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
#pragma warning disable CS8602 // Dereference of a possibly null reference.
app.UseSwagger(options => options.RouteTemplate = swaggerOptions.RouteTemplate);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8602 // Dereference of a possibly null reference.
app.UseSwaggerUI(c => c.SwaggerEndpoint(swaggerOptions.UiEndpoint,"NASST"));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

app.UseStaticFiles("/storage");
app.UseRouting();

app.UseIdentityServer();
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
    {
        _ = endpoints.MapControllerRoute("api", "api/{controller}/{action}/{id?}/{type?}");
    });


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
