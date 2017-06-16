import { SkridaPage } from './app.po';

describe('skrida App', () => {
  let page: SkridaPage;

  beforeEach(() => {
    page = new SkridaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
