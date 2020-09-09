import * as Page from '../../../src/client/js/pageAccess';
import {JSDOM} from 'jsdom';


test('All API properties should be accessible', () => {
  const exportedProperties = [
    'fillResultGrid', 'getSubmittedUrl',
    'updateResultSection', 'showResultDiv', 'showElement',
    'hideElement', 'ResultDiv', 'STYLE_HIDDEN', 'RESULT_SECTION',
  ];
  exportedProperties.forEach( (p) =>
    expect(Page[p]).toBeDefined(),
  );
});

test(`'ResultDiv' has properties SPINNER, GRID and ERROR`, () =>
  expect(Object.keys(Page.ResultDiv))
      .toEqual(['SPINNER', 'GRID', 'ERROR']),
);

describe('Testing actual page access', () => {
  let document;
  beforeEach( () => {
    document = function createTestDocument() {
      const {document} = new JSDOM(
          '<!DOCTYPE html><body></body>',
      ).window;
      return document;
    }();
  });

  test(`'hideElement' applies 'hidden' style to element with given id`, () => {
    document.body.innerHTML =
      `<div id="${Page.ResultDiv.SPINNER}">
      </div>`;

    Page.hideElement(document, Page.ResultDiv.SPINNER);

    expect(document.getElementById(Page.ResultDiv.SPINNER).classList.value)
        .toBe(Page.STYLE_HIDDEN);
  });

  test(`'showElement' removes 'hidden' style from element with given id`,
      () => {
        document.body.innerHTML =
          `<div id="${Page.ResultDiv.SPINNER}" class="${Page.STYLE_HIDDEN}">
           </div>`;

        Page.showElement(document, Page.ResultDiv.SPINNER);

        expect(document.getElementById(Page.ResultDiv.SPINNER).classList.value)
            .toBe('');
      });

  test(`'showResultDiv' reveals div with given id and hides siblings`, () => {
    document.body.innerHTML =
    `<section id="${Page.RESULT_SECTION}">
      <div id="${Page.ResultDiv.SPINNER}" class="${Page.STYLE_HIDDEN}"></div>
      <div id="${Page.ResultDiv.GRID}" class=""></div>
      <div id="${Page.ResultDiv.ERROR}" class="${Page.STYLE_HIDDEN}"></div>
    </section>`;

    Page.showResultDiv(document, Page.ResultDiv.ERROR);

    expect(document.getElementById(Page.ResultDiv.SPINNER)
        .classList.value).toBe(Page.STYLE_HIDDEN);
    expect(document.getElementById(Page.ResultDiv.GRID)
        .classList.value).toBe(Page.STYLE_HIDDEN);
    expect(document.getElementById(Page.ResultDiv.ERROR)
        .classList.value).toBe('');
  });

  test(`'updateResultSection' executes the 'update' function reference`, () => {
    document.body.innerHTML =
      `<section id="${Page.RESULT_SECTION}">
        <div id="${Page.ResultDiv.SPINNER}" class="${Page.STYLE_HIDDEN}"></div>
      </section>`;
    const mockUpdate = jest.fn((x) => x);

    Page.updateResultSection(document, mockUpdate);

    expect(mockUpdate.mock.calls.length).toBe(1);
  });

  test(`'updateResultSection' makes section visible upon completion`, () => {
    document.body.innerHTML =
      `<section id="${Page.RESULT_SECTION}">
        <div id="${Page.ResultDiv.SPINNER}" class="${Page.STYLE_HIDDEN}"></div>
      </section>`;

    Page.updateResultSection(document, () => {});

    expect(document.getElementById(Page.RESULT_SECTION)
        .classList.value).toBe('');
  });

  test(`'fillResultGrid' uses given 'resultData' to fill grid`, () => {
    document.body.innerHTML =
      `<section id="${Page.RESULT_SECTION}">
        <div id="targetUrl"></div>
        <div id="polarity"></div>
        <div id="subjectivity"></div>
        <div id="irony"></div>
        <div id="confidence"></div>
      </section>`;

    const resultData = {
      targetUrl: 'https://www.example.com',
      polarity: 'NEU',
      subjectivity: 'OBJECTIVE',
      irony: 'NONIRONIC',
      confidence: '99',
    };
    Page.fillResultGrid(document, resultData);

    expect(document.getElementById('targetUrl').innerHTML)
        .toBe(
            '<a class=\"text-link\" href=\"https://www.example.com\">\n' +
          '     https://www.example.com\n' +
          '   </a>',
        );
    expect(document.getElementById('polarity').innerHTML)
        .toBe(resultData.polarity);
    expect(document.getElementById('subjectivity').innerHTML)
        .toBe(resultData.subjectivity);
    expect(document.getElementById('irony').innerHTML)
        .toBe(resultData.irony);
    expect(document.getElementById('confidence').innerHTML)
        .toBe(`${resultData.confidence}%`);
  });

  test(`'getSubmittedUrl' retrieves trimmed URL from form`, () => {
    const url = 'https://www.example.com';
    document.body.innerHTML =
      `<input autofocus class="text" id="document-url" type="url"
                name="input" value=" ${url}    " placeholder="Document URL"
        />`;

    expect(Page.getSubmittedUrl(document)).toBe(url);
  });
});
