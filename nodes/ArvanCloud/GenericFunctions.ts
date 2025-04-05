import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IPollFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function arvancloudApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body = {},
	qs: IDataObject = {},
	_uri?: string,
	headers: IDataObject = {},
): Promise<any> {
	const options: IRequestOptions = {
		method,
		body,
		qs,
		uri: `https://napi.arvancloud.ir/cdn/4.0/${resource}`,
		json: true,
	};

	try {
		if (Object.keys(headers).length !== 0) {
			options.headers = Object.assign({}, options.headers, headers);
		}
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		return await this.helpers.requestWithAuthentication.call(this, 'arvancloudApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function arvancloudApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await arvancloudApiRequest.call(this, method, endpoint, body, query);

		if (typeof responseData !== 'object' || responseData === null) {
			throw new Error('Response is not a valid JSON object');
		}

		if (propertyName in responseData && Array.isArray(responseData[propertyName])) {
			returnData.push(...responseData[propertyName] as IDataObject[]);
		} else if ('message' in responseData) {
			returnData.push({ message: responseData.message });
		}

	} while (responseData.cursor !== undefined);

	return returnData;
}
