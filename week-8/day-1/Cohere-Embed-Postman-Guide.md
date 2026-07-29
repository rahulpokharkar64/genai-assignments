# Cohere Embed API - Postman Collection Guide

## API

https://docs.cohere.com/reference/embed

## Environment Variables

  Variable           Value
  ------------------ -----------------------------
  `baseUrl`          `https://api.cohere.com/v2`
  `cohere_api_key`   Your Cohere API Key

## Headers

``` http
Authorization: Bearer {{cohere_api_key}}
Content-Type: application/json
```

------------------------------------------------------------------------

# Postman Collection (v2.1)

Save as **Cohere-Embed.postman_collection.json**

``` json
{
  "info": {
    "name": "Cohere Embed API",
    "_postman_id": "7d3f57af-90bc-4dcb-8b17-123456789001",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "https://api.cohere.com/v2" },
    { "key": "cohere_api_key", "value": "" }
  ],
  "item": [
    {
      "name": "Simple Text Embedding",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{cohere_api_key}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": "{{baseUrl}}/embed",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"texts\": [\"Hello World\",\"Artificial Intelligence\",\"Machine Learning\"],\n  \"model\": \"embed-v4.0\",\n  \"input_type\": \"classification\",\n  \"embedding_types\": [\"float\"]\n}"
        }
      }
    }
  ]
}
```

------------------------------------------------------------------------

# Sample Payloads

## Text Embedding

``` json
{
  "texts": [
    "Hello World",
    "Artificial Intelligence",
    "Machine Learning"
  ],
  "model": "embed-v4.0",
  "input_type": "classification",
  "embedding_types": ["float"]
}
```

## Search Documents

``` json
{
  "texts": [
    "Postman is an API testing tool.",
    "LangChain helps build LLM applications.",
    "Docker is used for containerization."
  ],
  "model": "embed-v4.0",
  "input_type": "search_document"
}
```

## Search Query

``` json
{
  "texts": [
    "How do I deploy Kubernetes?"
  ],
  "model": "embed-v4.0",
  "input_type": "search_query"
}
```

## Classification

``` json
{
  "texts": [
    "Positive Review",
    "Negative Review",
    "Neutral Comment"
  ],
  "model": "embed-v4.0",
  "input_type": "classification"
}
```

## Clustering

``` json
{
  "texts": [
    "Apple",
    "Banana",
    "Orange",
    "BMW",
    "Mercedes",
    "Audi"
  ],
  "model": "embed-v4.0",
  "input_type": "clustering"
}
```

## Multiple Embedding Types

``` json
{
  "texts": ["OpenAI","Google","Cohere"],
  "model": "embed-v4.0",
  "input_type": "classification",
  "embedding_types": [
    "float",
    "int8",
    "uint8",
    "binary",
    "ubinary"
  ]
}
```

## Image Embedding

``` json
{
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  ],
  "model": "embed-v4.0",
  "input_type": "image"
}
```

## Mixed Text + Image

``` json
{
  "inputs": [
    {
      "content": [
        {
          "type": "text",
          "text": "A beautiful mountain landscape"
        },
        {
          "type": "image",
          "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
        }
      ]
    }
  ],
  "model": "embed-v4.0",
  "input_type": "search_document"
}
```

------------------------------------------------------------------------

# Additional Sample Data

## Product

``` json
{
  "texts":["Apple iPhone 16 Pro Max 256GB Titanium Black"],
  "model":"embed-v4.0",
  "input_type":"search_document"
}
```

## News

``` json
{
  "texts":["India successfully launched a new communication satellite."],
  "model":"embed-v4.0",
  "input_type":"classification"
}
```

## FAQ

``` json
{
  "texts":["How can I reset my password?"],
  "model":"embed-v4.0",
  "input_type":"search_query"
}
```

## Email

``` json
{
  "texts":["Dear Rahul, your interview is scheduled for Monday at 10 AM."],
  "model":"embed-v4.0",
  "input_type":"classification"
}
```

## Code

``` json
{
  "texts":["public static void main(String[] args){ System.out.println(\"Hello\"); }"],
  "model":"embed-v4.0",
  "input_type":"search_document"
}
```

## SQL

``` json
{
  "texts":["SELECT * FROM employees WHERE salary > 100000"],
  "model":"embed-v4.0",
  "input_type":"search_document"
}
```

## HTML

``` json
{
  "texts":["<html><body><h1>Hello World</h1></body></html>"],
  "model":"embed-v4.0",
  "input_type":"classification"
}
```

## JSON

``` json
{
  "texts":["{\"name\":\"Rahul\",\"role\":\"DevOps Lead\"}"],
  "model":"embed-v4.0",
  "input_type":"classification"
}
```

## Multilingual

``` json
{
  "texts":["Hello","नमस्ते","Bonjour","こんにちは","Hola"],
  "model":"embed-v4.0",
  "input_type":"clustering"
}
```

## Image Data URI

``` text
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

Supported image formats: - PNG - JPEG - WEBP - GIF
