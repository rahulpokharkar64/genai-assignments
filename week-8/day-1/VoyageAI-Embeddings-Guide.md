# Voyage AI Embeddings API - Postman Guide

## Endpoint

`POST https://api.voyageai.com/v1/embeddings`

## Environment Variables

  Variable         Value
  ---------------- -----------------------------
  baseUrl          https://api.voyageai.com/v1
  voyage_api_key   Your API key

## Headers

``` http
Authorization: Bearer {{voyage_api_key}}
Content-Type: application/json
```

## Sample Request

``` json
{
  "input":"What is DevOps?",
  "model":"voyage-3-large",
  "input_type":"query"
}
```

## Multiple Inputs

``` json
{
  "input":[
    "Docker is a container platform.",
    "Kubernetes orchestrates containers.",
    "Terraform provisions infrastructure."
  ],
  "model":"voyage-3-large",
  "input_type":"document"
}
```

## Product Description

``` json
{
  "input":"Apple iPhone 16 Pro Max 256GB",
  "model":"voyage-3-large",
  "input_type":"document"
}
```

## FAQ

``` json
{
  "input":"How do I reset my password?",
  "model":"voyage-3-large",
  "input_type":"query"
}
```

## Code

``` json
{
  "input":"public static void main(String[] args){ System.out.println(\"Hello\"); }",
  "model":"voyage-code-3",
  "input_type":"document"
}
```

## SQL

``` json
{
  "input":"SELECT * FROM employees WHERE salary > 100000",
  "model":"voyage-code-3",
  "input_type":"document"
}
```

## HTML

``` json
{
  "input":"<html><body><h1>Hello</h1></body></html>",
  "model":"voyage-3-large",
  "input_type":"document"
}
```

## JSON

``` json
{
  "input":"{\"name\":\"Rahul\",\"role\":\"DevOps Lead\"}",
  "model":"voyage-3-large",
  "input_type":"document"
}
```

## Multilingual

``` json
{
  "input":["Hello","नमस्ते","Bonjour","こんにちは","Hola"],
  "model":"voyage-3-large",
  "input_type":"document"
}
```

## Output Dimension

``` json
{
  "input":"Cloud Computing",
  "model":"voyage-3-large",
  "input_type":"query",
  "output_dimension":512
}
```

## Output DType

``` json
{
  "input":"Artificial Intelligence",
  "model":"voyage-3-large",
  "input_type":"query",
  "output_dtype":"int8"
}
```

## Common Errors

-   400 Bad Request
-   401 Unauthorized
-   429 Too Many Requests
-   500 Internal Server Error

## Best Practices

-   Use query for search queries.
-   Use document for indexed documents.
-   Batch inputs for better throughput.
-   Lower output dimensions to reduce storage.
-   Use voyage-code-3 for source code embeddings.
