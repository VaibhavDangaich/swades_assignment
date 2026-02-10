export function errorHandler(err, c) {
    console.error('Error:', err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return c.json({
        success: false,
        error: {
            message,
            status,
        },
    }, status);
}

export function notFound(c) {
    return c.json({
        success: false,
        error: {
            message: 'Not Found',
            status: 404,
        },
    }, 404);
}
