### Global Error Handler
- A global error handler is a special Express middleware placed at the end of the middleware chain.
- It must have four arguments: `(error, req, res, next)`.
- It provides a centralized way to handle errors and send a response to the client.
- For async route handlers, Express does not automatically forward thrown errors unless you use `next(err)` or a wrapper/helper.

❌ This does NOT automatically reach the global error handler:
```typescript
app.get("/", async (req, res) => {
  throw new Error("fail");
});
```

✅ This does reach the global error handler:
```typescript
app.get("/", async (req, res, next) => {
  try {
    throw new Error("fail");
  } catch (err) {
    next(err);
  }
});
```

> Error occurs → Express catches sync errors or receives errors via `next(err)` → skips remaining normal middleware/route handlers → sends the request to the global error handler

### Important Rules
- ✔ The global error handler must be defined last, after all routes and middleware.
- ✔ Synchronous errors thrown inside route handlers or middleware are caught by Express automatically.
- ✔ Asynchronous errors inside `async` functions are not forwarded automatically by Express; use `next(err)` or an async wrapper.
- ✔ Once an error is passed to the error handler, Express does not continue normal request handling.

### Common patterns
- Use `next(err)` to forward errors from middleware or route handlers.
- Use a wrapper like `catchAsync(fn)` to avoid repeating `try/catch` in every async route.
- In the error handler, set the response status and JSON body consistently.

### Example global error handler
```typescript
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({
    status: "error",
    message: error.message || "Internal Server Error",
  });
});
```
