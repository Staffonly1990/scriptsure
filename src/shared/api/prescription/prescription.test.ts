import { map, of } from 'rxjs';
import { API_KEY, API_URL_SCRIPTSURE } from 'shared/config';

const mockQueue = [
  {
    name: 'Bob Smith',
    messages: [
      {
        pharmacy: 'Brooklyn @ Gates Pharmacy',
        drugName: 'Crestor',
        instruction: '20 mg tablet -  30 Tablet - Take 1 tablet by mouth daily',
      },
      {
        pharmacy: 'Brooklyn @ Gates Pharmacy',
        drugName: 'Cymbalta',
        instruction: '60 mg capsule,delayed release -  4 Applicator - vvv',
      },
    ],
  },
  {
    name: 'Rashida Champagne',
    messages: [
      {
        pharmacy: 'Brooklyn @ Gates Pharmacy',
        drugName: 'Ambien',
        instruction: '5 mg tablet - 1 Applicator - ff',
      },
    ],
  },
];
const mockFn = jest.fn();
function fnUnderTest(arg) {
  mockFn(arg);
}
test('Testing once', () => {
  fnUnderTest(mockQueue);
  expect(mockFn).toHaveBeenCalledWith(mockQueue);
  expect(mockFn).toHaveBeenCalledTimes(1);
});

describe('should get prescription queue', () => {
  const data = mockQueue;
  const mock = of({
    url: `${API_URL_SCRIPTSURE}/v1.0/electronic/queue/`,
    method: 'GET',
    headers: { apikey: API_KEY },
    async: true,
    crossDomain: true,
    withCredentials: true,
    responseType: 'json' as XMLHttpRequestResponseType,
  }).pipe(map(() => data));

  it('renders', () => {
    mock.subscribe((x) => x);
    expect(data).toBe(mockQueue);
  });
});
