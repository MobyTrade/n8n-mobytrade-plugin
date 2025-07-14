# n8n-nodes-mobytrade

This is an n8n community node that provides integration with the MobyTrade platform for import classification. It allows n8n users to access MobyTrade's API to classify products and get HTS codes and duty rates.

## Features

- **Product Classification**: Get HTS codes and duty rates for products based on description
- **Search Classifications**: Search for probable HTS matches
- **Flexible Input**: Support for product description, country of origin, material, value, and weight

## Installation

### Community Nodes (Recommended)

1. Go to Settings > Community Nodes in your n8n instance
2. Search for `n8n-nodes-mobytrade`
3. Install the node

### Manual Installation

1. Navigate to your n8n root directory
2. Install the package:
   ```bash
   npm install n8n-nodes-mobytrade
   ```

## Configuration

### Credentials

This node requires MobyTrade API credentials:

1. **API Key**: Your MobyTrade API key
2. **Base URL**: Base URL for MobyTrade API (defaults to https://api.mobytrade.com)

### Node Operations

#### Classification Resource

##### Classify Product
- **Description**: Get HTS code and duty rates for a product
- **Required**: Product description
- **Optional**: Country of origin, material, value, weight

##### Search Classifications
- **Description**: Search for probable HTS matches
- **Required**: Product description (as search query)
- **Optional**: Country of origin, material, value, weight, result limit

## Usage Examples

### Basic Product Classification

1. Add the MobyTrade node to your workflow
2. Configure your MobyTrade API credentials
3. Set the operation to "Classify Product"
4. Enter a product description like "Red cotton t-shirt"
5. Execute the workflow

### Advanced Search

1. Use the "Search Classifications" operation
2. Enter a product description
3. Set additional fields like country of origin and material
4. Limit the number of results returned

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Local Development

```bash
npm run dev
```

## License

MIT

## Support

For issues and questions, please visit [GitHub Issues](https://github.com/joserivera/n8n-nodes-mobytrade/issues).