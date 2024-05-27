using MediatR;

namespace GdprRecord.Server.Feature.Organization;

// https://goatreview.com/improving-error-handling-result-pattern-mediatr/

public class Result<TValue>
{
	private readonly Error? _error;
	private readonly TValue? _value;

	public Result(TValue value)
	{
		_value = value;
	}

	public Result(Error error)
	{
		_error = error;
	}

	public TValue? Value => _value is TValue value ? value : default;
	public Error? Error => _error;

	public TResult Match<TResult>(Func<Error, TResult> failure, Func<TValue, TResult> success)
		=> Value is not null
			? success(Value)
			: failure(Error.GetValueOrDefault());

	public static implicit operator Result<TValue>(TValue value) => new(value);

	public static implicit operator Result<TValue>(Error error) => new(error);
}

public enum Error
{
	Unknown,
	NotFound,
	Conflict
}

public interface ICommand<TOutput> : IRequest<Result<TOutput>>;

public interface ICommandHandler<TInput, TOutput> : IRequestHandler<TInput, Result<TOutput>> where TInput : ICommand<TOutput>;

public interface IQuery<TOutput> : IRequest<Result<TOutput>>;

public interface IQueryHandler<TInput, TOutput> : IRequestHandler<TInput, Result<TOutput>> where TInput : IQuery<TOutput>;

