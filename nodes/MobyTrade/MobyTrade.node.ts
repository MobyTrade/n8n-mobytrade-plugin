import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class MobyTrade implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MobyTrade',
		name: 'mobyTrade',
		icon: 'file:mobytrade.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Classify imports using MobyTrade API',
		defaults: {
			name: 'MobyTrade',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'mobyTradeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Classification',
						value: 'classification',
					},
				],
				default: 'classification',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['classification'],
					},
				},
				options: [
					{
						name: 'Classify Product',
						value: 'classify',
						description: 'Get HTS code and duty rates for a product',
						action: 'Classify a product',
					},
					{
						name: 'Search Classifications',
						value: 'search',
						description: 'Search for probable HTS matches',
						action: 'Search for classifications',
					},
				],
				default: 'classify',
			},
			{
				displayName: 'Product Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['classification'],
						operation: ['classify', 'search'],
					},
				},
				default: '',
				placeholder: 'Enter product description',
				description: 'Description of the product to classify',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['classification'],
					},
				},
				options: [
					{
						displayName: 'Country of Origin',
						name: 'countryOfOrigin',
						type: 'string',
						default: '',
						description: 'Country where the product was manufactured',
					},
					{
						displayName: 'Material',
						name: 'material',
						type: 'string',
						default: '',
						description: 'Primary material of the product',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number',
						default: 0,
						description: 'Value of the product in USD',
					},
					{
						displayName: 'Weight',
						name: 'weight',
						type: 'number',
						default: 0,
						description: 'Weight of the product in kg',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Maximum number of results to return (for search)',
						displayOptions: {
							show: {
								'/operation': ['search'],
							},
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'classification') {
					if (operation === 'classify') {
						const description = this.getNodeParameter('description', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
							countryOfOrigin?: string;
							material?: string;
							value?: number;
							weight?: number;
						};

						const body = {
							description,
							...additionalFields,
						};

						const response = await this.helpers.requestWithAuthentication.call(
							this,
							'mobyTradeApi',
							{
								method: 'POST',
								url: '/classify',
								body,
							},
						);

						returnData.push({
							json: {
								...response,
								inputDescription: description,
								additionalFields,
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'search') {
						const description = this.getNodeParameter('description', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
							countryOfOrigin?: string;
							material?: string;
							value?: number;
							weight?: number;
							limit?: number;
						};

						const body = {
							query: description,
							...additionalFields,
						};

						const response = await this.helpers.requestWithAuthentication.call(
							this,
							'mobyTradeApi',
							{
								method: 'POST',
								url: '/search',
								body,
							},
						);

						returnData.push({
							json: {
								...response,
								inputQuery: description,
								additionalFields,
							},
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}