// Mocks the whole modules
jest.mock('./../../../src/client/js/pageAccess');
jest.mock('./../../../src/client/js/fetchAnalysis');

import {handleSubmit} from './../../../src/client/js/formHandler';
import {fetchAnalysisResult} from './../../../src/client/js/fetchAnalysis';
import {getSubmittedUrl, updateResultSection, ResultDiv}
  from './../../../src/client/js/pageAccess';

const ANY_CHAR = '[\\s\\S]';
const getRegExShowResultDiv = function(arg) {
  let regExArg;
  switch (arg) {
    case ResultDiv.SPINNER: regExArg = 'ResultDiv\\.SPINNER'; break;
    case ResultDiv.GRID: regExArg = 'ResultDiv\\.GRID'; break;
    case ResultDiv.ERROR: regExArg = 'ResultDiv\\.ERROR'; break;
    default: console.error(`Unknown arg type: ${arg}!`); break;
  }
  return new RegExp(
      `${ANY_CHAR}*showResultDiv${ANY_CHAR}+${regExArg}${ANY_CHAR}+`, '',
  );
};

const getRegExFillResultGrid = function() {
  return new RegExp(`${ANY_CHAR}*fillResultGrid${ANY_CHAR}`, '');
};

// Crude way to serialize a function literal to be able
// to compare it easily.
const toString = function(func) {
  return '' + func;
};

describe(`Form handler 'handleSubmit'`, () => {
  beforeEach( () => {
  // Note(!): This is essential.
  // It takes care of resetting the module mocks after each test.
    jest.clearAllMocks();
  });

  test(`should be exported from its module`, () => {
    expect(handleSubmit).toBeDefined();
  });

  test('should return immediately if document URL is empty', async () => {
    getSubmittedUrl.mockReturnValue('');
    const mockPreventDefault = jest.fn();
    const mockEvent = {preventDefault: mockPreventDefault};

    // Note(!): await is essential here!
    // Otherwise test execution finishes before all mocks have been called.
    await handleSubmit(mockEvent);

    expect(mockPreventDefault).toBeCalled();
    expect(getSubmittedUrl).toBeCalled();
    expect(updateResultSection).not.toBeCalled();
  });

  test('should show error if fetch from server fails', async () => {
    const mockDocumentUrl = 'http://www.example.com';
    getSubmittedUrl.mockReturnValue(mockDocumentUrl);
    fetchAnalysisResult.mockRejectedValue(new Error('Fetch failed.'));
    const mockPreventDefault = jest.fn();
    const mockEvent = {preventDefault: mockPreventDefault};

    // Note(!): await is essential here!
    // Otherwise test execution finishes before all mocks have been called.
    await handleSubmit(mockEvent);

    expect(mockPreventDefault).toBeCalled();
    expect(getSubmittedUrl).toBeCalled();

    expect(fetchAnalysisResult).toBeCalled();
    expect(fetchAnalysisResult).nthCalledWith(1, mockDocumentUrl);

    expect(updateResultSection).toBeCalledTimes(2);
    expect(typeof updateResultSection.mock.calls[0][0]).toBe('function');
    expect(toString(updateResultSection.mock.calls[0][0])).toMatch(
        getRegExShowResultDiv(ResultDiv.SPINNER),
    );
    expect(typeof updateResultSection.mock.calls[1][0]).toBe('function');
    expect(toString(updateResultSection.mock.calls[1][0])).toMatch(
        getRegExShowResultDiv(ResultDiv.ERROR),
    );
  });

  test('should show result grid if fetch from server is OK', async () => {
    const mockDocumentUrl = 'http://www.example.com';
    getSubmittedUrl.mockReturnValue(mockDocumentUrl);
    fetchAnalysisResult.mockResolvedValue({result: 'I am an OK result'});
    const mockPreventDefault = jest.fn();
    const mockEvent = {preventDefault: mockPreventDefault};

    // Note(!): await is essential here!
    // Otherwise test execution finishes before all mocks have been called.
    await handleSubmit(mockEvent);

    expect(mockPreventDefault).toBeCalled();
    expect(getSubmittedUrl).toBeCalled();

    expect(fetchAnalysisResult).toBeCalled();
    expect(fetchAnalysisResult).nthCalledWith(1, mockDocumentUrl);

    expect(updateResultSection).toBeCalledTimes(2);
    expect(typeof updateResultSection.mock.calls[0][0]).toBe('function');
    expect(toString(updateResultSection.mock.calls[0][0])).toMatch(
        getRegExShowResultDiv(ResultDiv.SPINNER),
    );
    expect(typeof updateResultSection.mock.calls[1][0]).toBe('function');
    expect(toString(updateResultSection.mock.calls[1][0])).toMatch(
        getRegExShowResultDiv(ResultDiv.GRID),
    );
    expect(toString(updateResultSection.mock.calls[1][0])).toMatch(
        getRegExFillResultGrid(),
    );
  });
});
