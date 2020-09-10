import {fetchAnalysisResult} from './../../../src/client/js/fetchAnalysis';
// Note(!): Fetch is not available natively in a node environment
import fetch, {FetchError} from 'node-fetch';

test('All API functions should be accessible', () => {
  expect(fetchAnalysisResult).toBeDefined();
});

test('Fetch should throw if server is offline', async () => {
  const deadEnd = 'http://localhost:9999/analysis';
  const noDocument = '';
  try {
    await fetchAnalysisResult(noDocument, deadEnd, fetch);
  } catch (error) {
    expect(error).toBeInstanceOf(FetchError);
    expect(error.message)
        .toMatch(
            `request to ${deadEnd} failed, ` +
            'reason: connect ECONNREFUSED 127.0.0.1:9999',
        );
  }
});

test('Fetch should throw if response status not OK', async () => {
  const route = 'http://localhost:9999/analysis';
  const document = '';
  const mockResponse = {
    ok: false,
    status: 404,
    statusText: 'Not Found',
  };
  const mockFetch = jest.fn().mockResolvedValue(mockResponse);
  try {
    await fetchAnalysisResult(document, route, mockFetch);
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message)
        .toMatch(`${mockResponse.status}: ${mockResponse.statusText}`);
  }
  expect(mockFetch).toBeCalledTimes(1);
});

test('Fetch should return analysis result if response status OK',
    async () => {
      const route = 'http://localhost:9999/analysis';
      const mockAnalysis = {analysis: 'I am an analysis result'};
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockAnalysis),
      };
      const mockFetch = jest.fn().mockResolvedValue(mockResponse);

      const result = await fetchAnalysisResult('', route, mockFetch);

      expect(mockFetch).toBeCalledTimes(1);
      expect(result).toEqual(mockAnalysis);
    });
