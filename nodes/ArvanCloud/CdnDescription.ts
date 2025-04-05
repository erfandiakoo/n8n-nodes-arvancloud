import type { INodeProperties } from 'n8n-workflow';

export const cdnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cdn'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get information of the domain',
				action: 'Get information of the domain',
			},
			{
				name: 'Purge',
				value: 'purge',
				description: 'Purge cached content',
				action: 'Purge cached content',
			},
		],
		default: 'get',
	},
];

export const cdnFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                          CDN:Get information of the domain                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Your Domain Name',
		name: 'domain',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cdn'],
				operation: ['get'],
			},
		},
		default: '',
	},
	/* -------------------------------------------------------------------------- */
	/*                          CDN:Purge cached content                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Your Domain Name',
		name: 'domain',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cdn'],
				operation: ['purge'],
			},
		},
		default: '',
	},
];
