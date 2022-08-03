import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('BlogForm calls the event handler with right details', async () => {
  const mockHandler = jest.fn();
  const user = userEvent.setup();
  render(<BlogForm createBlog={mockHandler} />);

  const inputs = screen.getAllByRole('textbox');
  await user.type(inputs[0], 'Test title');
  await user.type(inputs[1], 'Test author');
  await user.type(inputs[2], 'Test url');

  const saveButton = screen.getByText('Save');
  await user.click(saveButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  // console.log(mockHandler.mock.calls);
  expect(mockHandler.mock.calls[0][0].title).toBe('Test title');
  expect(mockHandler.mock.calls[0][0].author).toBe('Test author');
  expect(mockHandler.mock.calls[0][0].url).toBe('Test url');
});
