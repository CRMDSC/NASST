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
AppConfiguration appConfig = appConfigSection.Get<AppConfiguration>();

IConfigurationSection securitySection = builder.Configuration.GetSection(nameof(Security));
Security securityOptions = securitySection.Get<Security>();

var swaggerSection = builder.Configuration.GetSection(nameof(Swagger));
Swagger swaggerOptions = swaggerSection.Get<Swagger>();

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
    options.SwaggerDoc(swaggerOptions.Version, new OpenApiInfo
    {
        Title = swaggerOptions.Description,
        Version = swaggerOptions.Version
    });

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
app.UseSwagger(options => options.RouteTemplate = swaggerOptions.RouteTemplate);
app.UseSwaggerUI(c => c.SwaggerEndpoint(swaggerOptions.UiEndpoint,"NASST"));

app.UseStaticFiles("/storage");
app.UseRouting();

app.UseIdentityServer();
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute("api", "api/{controller}/{action}/{id?}/{type?}");
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
