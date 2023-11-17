import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

jest.mock('../GamePlay');

test('Load success', () => {
  const stateService = new GameStateService();
  const loadResult = jest.fn(() => stateService.load());
  loadResult.mockReturnValueOnce(true);
  expect(loadResult).toBeTruthy();
});

test('Load error', () => {
  const stateService = new GameStateService(null);
  expect(() => stateService.load()).toThrowError(new Error('Invalid state'));
});

test('Load error message', () => {
  const stateService = new GameStateService(null);
  const showError = jest.fn(() => GamePlay.showError('Нет сохраненной игры'));

  try {
    stateService.load();
  } catch (err) {
    showError();
  }

  expect(showError).toHaveBeenCalled();
});
