using GdprRecord.Server.Feature.Organization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOrganizationFeature();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseOrganizationFeature();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

