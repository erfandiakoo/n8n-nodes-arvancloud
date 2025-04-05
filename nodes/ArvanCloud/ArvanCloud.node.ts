import type {
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	IExecuteFunctions,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

import { arvancloudApiRequest } from './GenericFunctions';

import { cdnFields, cdnOperations } from './CdnDescription';

export class ArvanCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ArvanCloud',
		name: 'arvancloud',
		icon: 'file:ArvanLogo.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume ArvanCloud API',
		defaults: {
			name: 'ArvanCloud',
		},
		usableAsTool: true,
		inputs: [{ type: 'main' as NodeConnectionType }],
		outputs: [{ type: 'main' as NodeConnectionType }],
		credentials: [
			{
				name: 'arvancloudApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'CDN',
						value: 'cdn',
					},
				],
				default: 'cdn',
			},
			...cdnOperations,
			...cdnFields,
		],
	};
	methods = {
		loadOptions: {
			async getDomainInfo(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { result: domains } = await arvancloudApiRequest.call(this, 'POST', '/domains');
				for (const domian of domains) {
					returnData.push({
						name: domian.name,
						value: domian.id,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		//const qs: IDataObject = {};
		let responseData;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'cdn') {
					if (operation === 'get') {
						const domainName = this.getNodeParameter('domain', i) as string;
						responseData = await arvancloudApiRequest.call(
							this,
							'GET',
							`/domains/${domainName}`,
							{},
						);
					}
					if (operation === 'purge') {
						const domainName = this.getNodeParameter('domain', i) as string;

						const body: IDataObject = {
							purge: 'all',
						};

						responseData = await arvancloudApiRequest.call(
							this,
							'POST',
							`/domains/${domainName}/caching/purge`,
							body,
						);
					}
					returnData.push(
						...this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({
								...responseData,
								statusCode: responseData?.statusCode || 200,
							} as IDataObject[]),
							{
								itemData: { item: i },
							},
						),
					);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData as INodeExecutionData[]];
	}
}
