# Jina AI Embeddings API - Postman Guide

Official Documentation: https://jina.ai/en-US/embeddings/

## Endpoint

`POST https://api.jina.ai/v1/embeddings`

## Environment Variables

  Variable       Value
  -------------- ------------------------
  baseUrl        https://api.jina.ai/v1
  jina_api_key   Your Jina AI API Key

## Headers

``` http
Authorization: Bearer {{jina_api_key}}
Content-Type: application/json
Accept: application/json
```

------------------------------------------------------------------------

# Sample Postman Request

``` json
{
  "model": "jina-embeddings-v4",
  "input": [
    "Hello, world!"
  ]
}
```

------------------------------------------------------------------------

# Sample Payloads

## Single Text

``` json
{
  "model":"jina-embeddings-v4",
  "input":["What is DevOps?"]
}
```

## Multiple Documents

``` json
{
  "model":"jina-embeddings-v4",
  "task":"retrieval.passage",
  "input":[
    "Docker is a container platform.",
    "Kubernetes orchestrates containers.",
    "Terraform provisions infrastructure."
  ]
}
```

## Search Query

``` json
{
  "model":"jina-embeddings-v4",
  "task":"retrieval.query",
  "input":["How do I deploy Kubernetes?"]
}
```

## Product Search

``` json
{
  "model":"jina-embeddings-v4",
  "task":"retrieval.passage",
  "input":[
    "Apple iPhone 16 Pro Max",
    "Samsung Galaxy S26 Ultra"
  ]
}
```

## Code Embedding

``` json
{
  "model":"jina-embeddings-v4",
  "task":"code.passage",
  "input":[
    "public static void main(String[] args){ System.out.println(\"Hello\"); }"
  ]
}
```

## SQL

``` json
{
  "model":"jina-embeddings-v4",
  "task":"code.passage",
  "input":[
    "SELECT * FROM employees WHERE salary > 100000"
  ]
}
```

## HTML

``` json
{
  "model":"jina-embeddings-v4",
  "input":[
    "<html><body><h1>Hello</h1></body></html>"
  ]
}
```

## JSON

``` json
{
  "model":"jina-embeddings-v4",
  "input":[
    "{\"name\":\"Rahul\",\"role\":\"DevOps Lead\"}"
  ]
}
```

## Multilingual

``` json
{
  "model":"jina-embeddings-v4",
  "input":[
    "Hello",
    "नमस्ते",
    "Bonjour",
    "こんにちは",
    "Hola"
  ]
}
```

## Image URL

``` json
{
  "model":"jina-embeddings-v4",
  "input":[
    {
      "image":"https://i.ibb.co/r5w8hG8/beach2.jpg"
    }
  ]
}
```

## Base64 Image

``` json
{
  "model":"jina-embeddings-v4",
  "input":[
    {
      "image":"iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

## Mixed Text + Image

``` json
{
  "model":"jina-embeddings-v4",
  "input":[
    {"text":"A beautiful beach"},
    {"image":"https://i.ibb.co/r5w8hG8/beach2.jpg"}
  ]
}
```

## Binary Embeddings

``` json
{
  "model":"jina-embeddings-v4",
  "embedding_type":"binary",
  "input":["Artificial Intelligence"]
}
```

## Float Embeddings

``` json
{
  "model":"jina-embeddings-v4",
  "embedding_type":"float",
  "input":["Artificial Intelligence"]
}
```

## Reduced Dimensions

``` json
{
  "model":"jina-embeddings-v4",
  "dimensions":512,
  "input":["Cloud Computing"]
}
```

# Response Example

``` json
{
  "object":"list",
  "data":[
    {
      "index":0,
      "embedding":[0.124,-0.321,0.654]
    }
  ],
  "model":"jina-embeddings-v4"
}
```

# Common Errors

  Status   Meaning
  -------- -----------------------
  400      Invalid Request
  401      Unauthorized
  429      Rate Limit Exceeded
  500      Internal Server Error

# Best Practices

-   Use `retrieval.query` for user queries.
-   Use `retrieval.passage` for indexed documents.
-   Use `code.query` and `code.passage` for source code.
-   Reduce dimensions to save vector storage.
-   Use `binary` or `base64` embeddings when appropriate.
-   Jina v4 supports multimodal text and image embeddings.
