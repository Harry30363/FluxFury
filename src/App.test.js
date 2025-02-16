test('renders main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/FLEX-IT-OUT/i);
  expect(headingElement).toBeInTheDocument();
});