// QA/basic-test.test.ts
// Basic test to verify Jest setup is working

describe('Testing Framework Setup', () => {
  test('Jest is working correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('Testing library matchers are available', () => {
    // Create a simple DOM element to test jest-dom matchers
    document.body.innerHTML = '<div>Hello World</div>';
    const element = document.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello World');
  });

  test('Async testing works', async () => {
    const promise = new Promise(resolve => {
      setTimeout(() => resolve('async result'), 100);
    });
    
    const result = await promise;
    expect(result).toBe('async result');
  });
}); 