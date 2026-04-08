using GdprRecord.Server.Feature.Organization;
using GdprRecord.Server.Feature.ProcessingActivity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOrganizationFeature();
builder.Services.AddProcessingActivityFeature();

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

