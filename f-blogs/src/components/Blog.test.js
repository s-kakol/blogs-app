import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blog = {
  title: 'Title should be shown',
  author: 'Author should be shown',
  url: 'Url should show up after click',
  likes: 42,
  user: {
    name: 'Test name',
  },
};

test('Renders blog which is NOT expanded', () => {
  const { container } = render(<Blog blog={blog} />);
  const div = container.querySelector('.collapsedBlog');

  expect(div).toHaveTextContent('Title should be shown');
  expect(div).toHaveTextContent('Author should be shown');
  expect(div).not.toHaveTextContent('Url should be hdden');
  expect(div).not.toHaveTextContent('42');
});

test('Expands blog and checks if url and likes properties are shown', async () => {
  const user = userEvent.setup();
  render(<Blog blog={blog} />);
  const expandButton = screen.getByText('View');
  await user.click(expandButton);

  const shownUrl = screen.getByText('Url should show up after click', {
    exact: false,
  });
  expect(shownUrl).toBeDefined();
  const shownLikes = screen.getByText('42', { exact: false });
  expect(shownLikes).toBeDefined();
});

test('Clicking the Like button twice calls event handler twice', async () => {
  const mockHandler = jest.fn();
  const user = userEvent.setup();
  render(<Blog blog={blog} increaseLikes={mockHandler} />);

  const expandButton = screen.getByText('View');
  await user.click(expandButton)

  const likeButton = screen.getByText('Like!');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
