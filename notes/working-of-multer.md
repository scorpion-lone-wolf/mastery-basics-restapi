# Working of Multer

## What is Multer?

Multer is an Express middleware used to handle file uploads.

Normal Express middleware like `express.json()` can read JSON data, but it cannot directly handle files from `multipart/form-data`. Multer reads those uploaded files and adds them to `req.file` or `req.files`.

## How to Use Multer

First create an upload middleware:

```ts
const upload = multer({
  dest: "public/data/uploads",
});
```

Then use it in a route:

```ts
router.post("/", upload.single("coverImage"), controller);
```

Common methods:

- `upload.single("fieldName")`: for one file
- `upload.array("fieldName")`: for many files with the same field name
- `upload.fields([...])`: for multiple file fields

## How We Use Multer in This Project

In our books route, we upload two files:

- `coverImage`: book cover image
- `file`: actual book file, like PDF

We use:

```ts
upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 },
])
```

This means Multer expects both fields from the form data.

In the controller, the files are available in `req.files`:

```ts
const coverImage = files?.coverImage?.[0];
const file = files?.file?.[0];
```

Multer first saves the files temporarily inside:

```txt
public/data/uploads
```

Then we take those local file paths and upload them to Cloudinary.

## Why Multer is Helpful

Multer is useful when a project needs file uploads, such as:

- user profile images
- product images in an e-commerce app
- PDF upload in a book app
- resume upload in a job portal
- documents or images in an admin panel

In short, Multer helps Express receive files from the client, and after that we can store them locally, upload them to Cloudinary, or save their URLs in the database.
