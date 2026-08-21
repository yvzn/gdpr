using GdprRecord.Server.Feature.Organization;
using GdprRecord.Server.Feature.ProcessingActivity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOrganizationFeature(builder.Configuration);
builder.Services.AddProcessingActivityFeature(builder.Configuration);
builder.Services.AddMediator(options => {
	options.ServiceLifetime = ServiceLifetime.Scoped;
	options.Assemblies = [typeof(IOrganizationFeature), typeof(IProcessingActivityFeature)];
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSpaStaticFiles(options =>
{
	options.RootPath = "wwwroot";
});

// Configure the HTTP request pipeline.
var app = builder.Build();

app.UseOrganizationFeature();
app.UseProcessingActivityFeature();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}
else
{
	app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseSpaStaticFiles();

app.MapControllers();
app.UseWhen(context => !context.Request.Path.StartsWithSegments("/api"), spaApp =>
{
	spaApp.UseSpa(spa =>
	{
		spa.Options.SourcePath = "wwwroot";
	});
});

await app.RunAsync();
