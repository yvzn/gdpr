using GdprRecord.Server.Feature.Organization;
using GdprRecord.Server.Feature.ProcessingActivity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOrganizationFeature();
builder.Services.AddProcessingActivityFeature();
builder.Services.AddMediator(options => {
	options.ServiceLifetime = ServiceLifetime.Scoped;
	options.Assemblies = [typeof(IOrganizationFeature), typeof(IProcessingActivityFeature)];
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseOrganizationFeature();
app.UseProcessingActivityFeature();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}
else
{
	app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();

