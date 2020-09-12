const fetch = require('node-fetch');
const {
  buildNlpRequestUrl, fetchNlpAnalysis, summarizeNlpAnalysis, runNlpAnalysis,
} = require('./../../../src/server/js/nlpRequest');

jest.mock('node-fetch');

test(`buildNlpRequest should return a valid request URL`, () => {
  const documentUrl = 'http://www.google.de';
  const apiKey = 'AABBCCDD';
  const expected = `https://api.meaningcloud.com/sentiment-2.1?key=${apiKey}`+
                   `&of=json&lang=auto&url=${encodeURIComponent(documentUrl)}`;

  expect(buildNlpRequestUrl(documentUrl, apiKey).toString()).toBe(expected);
});

test(`fetchNlpAnalysis should make a POST request to given URL`, async () => {
  const mockResponse = {response: 'I am an OK response'};
  fetch.mockResolvedValue(mockResponse);
  const mockRequestUrl = 'http://nothinghere.com';

  const response = await /* ! */ fetchNlpAnalysis(mockRequestUrl);

  expect(fetch).toBeCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toBe(mockRequestUrl);
  expect(fetch.mock.calls[0][1].method).toBe('POST');
  expect(fetch.mock.calls[0][1].body).toEqual({});
  expect(response).toEqual(mockResponse);
});

test(`'summarizeNlpAnalysis' should return well-formed object`, async () => {
  const documentUrl = 'http://www.google.com';
  const analysisResult = {
    score_tag: 'NEU',
    subjectivity: 'SUBJECTIVE',
    irony: 'NONIRONIC',
    confidence: 99,
  };
  const expectedSummary = {
    targetUrl: documentUrl,
    polarity: analysisResult.score_tag,
    subjectivity: analysisResult.subjectivity,
    irony: analysisResult.irony,
    confidence: analysisResult.confidence,
  };

  const summary = summarizeNlpAnalysis(analysisResult, documentUrl);

  expect(summary).toEqual(expectedSummary);
});

test(`'runNlpAnalysis' should throw error if service response not OK`,
    async () => {
      const mockDocumentUrl = 'https://mockdocument.url';
      const mockRequestUrl = 'https://mockrequest.url';
      const mockFuncBuildRequest = jest.fn().mockReturnValue(mockRequestUrl);
      const mockResponse = {ok: false, status: 500};
      const mockFuncFetchAnalysis =
        jest.fn().mockReturnValue(mockResponse);
      const mockFuncSummarize = jest.fn();

      try {
        await /* ! */ runNlpAnalysis(
            mockDocumentUrl, mockFuncBuildRequest,
            mockFuncFetchAnalysis, mockFuncSummarize,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
            `NLP service responded with HTTP error code ${mockResponse.status}`,
        );
      }
      expect(mockFuncBuildRequest).toBeCalledWith(mockDocumentUrl);
      expect(mockFuncFetchAnalysis).toBeCalledWith(mockRequestUrl);
      expect(mockFuncSummarize).not.toBeCalled();
    });

test(`'runNlpAnalysis' should throw error if NLP result status not OK`,
    async () => {
      const mockDocumentUrl = 'https://mockdocument.url';
      const mockRequestUrl = 'https://mockrequest.url';
      const mockFuncBuildRequest = jest.fn().mockReturnValue(mockRequestUrl);
      const mockResponseBody = {
        status: {
          code: '666',
          msg: 'Received super evil request',
        },
      };
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => mockResponseBody,
      };
      const mockFuncFetchAnalysis =
        jest.fn().mockReturnValue(mockResponse);
      const mockFuncSummarize = jest.fn();

      try {
        await /* ! */ runNlpAnalysis(
            mockDocumentUrl, mockFuncBuildRequest,
            mockFuncFetchAnalysis, mockFuncSummarize,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
            `NLP service responded with: ${mockResponseBody.status.msg} `+
            `(${mockResponseBody.status.code})`,
        );
      }
      expect(mockFuncBuildRequest).toBeCalledWith(mockDocumentUrl);
      expect(mockFuncFetchAnalysis).toBeCalledWith(mockRequestUrl);
      expect(mockFuncSummarize).not.toBeCalled();
    });

test(`'runNlpAnalysis' should return analysis summary if NLP result status OK`,
    async () => {
      const mockDocumentUrl = 'https://mockdocument.url';
      const mockRequestUrl = 'https://mockrequest.url';
      const mockFuncBuildRequest = jest.fn().mockReturnValue(mockRequestUrl);
      const mockResponseBody = {
        status: {
          code: 0,
          msg: 'OK',
        },
        /* Would normally contain some analysis data here.
           Omitting that, since it is irrelevant for the test.
         */
      };
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => mockResponseBody,
      };
      const mockFuncFetchAnalysis =
        jest.fn().mockReturnValue(mockResponse);
      const mockFuncSummarize = jest.fn();
      const mockSummary = 'analysis summary';
      mockFuncSummarize.mockReturnValue(mockSummary);

      const analysisResult = await /* ! */ runNlpAnalysis(
          mockDocumentUrl, mockFuncBuildRequest,
          mockFuncFetchAnalysis, mockFuncSummarize,
      );

      expect(mockFuncBuildRequest).toBeCalledWith(mockDocumentUrl);
      expect(mockFuncFetchAnalysis).toBeCalledWith(mockRequestUrl);
      expect(mockFuncSummarize).toBeCalled();
      expect(mockFuncSummarize.mock.calls[0][0]).toBe(mockResponseBody);
      expect(mockFuncSummarize.mock.calls[0][1]).toBe(mockDocumentUrl);
      expect(analysisResult).toBe(mockSummary);
    });
