import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByTestId('todo-card')).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

// ─── T004: US1 – Visual Overdue Indicator ────────────────────────────────────
describe('TodoCard — Overdue Indicator (US1)', () => {
  const overdueTodo = {
    id: 2,
    title: 'Overdue Task',
    dueDate: '2020-01-01',
    completed: 0,
    createdAt: '2019-12-01T00:00:00Z',
  };

  const futureTodo = {
    id: 3,
    title: 'Future Task',
    dueDate: '2099-01-01',
    completed: 0,
    createdAt: '2026-01-01T00:00:00Z',
  };

  const noDateTodo = {
    id: 4,
    title: 'No Date Task',
    dueDate: null,
    completed: 0,
    createdAt: '2026-01-01T00:00:00Z',
  };

  const invalidDateTodo = {
    id: 5,
    title: 'Invalid Date Task',
    dueDate: 'not-a-date',
    completed: 0,
    createdAt: '2026-01-01T00:00:00Z',
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "Overdue" label when todo is incomplete with a past due date', () => {
    render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('applies todo-card--overdue class when todo is incomplete with a past due date', () => {
    render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByTestId('todo-card')).toHaveClass('todo-card--overdue');
  });

  it('does not show "Overdue" label when todo has a future due date', () => {
    render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not apply todo-card--overdue class when todo has a future due date', () => {
    render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByTestId('todo-card')).not.toHaveClass('todo-card--overdue');
  });

  it('does not show "Overdue" label when todo has no due date', () => {
    render(<TodoCard todo={noDateTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not apply todo-card--overdue class when todo has no due date', () => {
    render(<TodoCard todo={noDateTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByTestId('todo-card')).not.toHaveClass('todo-card--overdue');
  });

  it('does not show "Overdue" label when dueDate is today', () => {
    const todayString = new Date().toISOString().slice(0, 10);
    const todayTodo = { ...overdueTodo, dueDate: todayString };
    render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not show "Overdue" label when dueDate is invalid', () => {
    render(<TodoCard todo={invalidDateTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not apply todo-card--overdue class when dueDate is invalid', () => {
    render(<TodoCard todo={invalidDateTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByTestId('todo-card')).not.toHaveClass('todo-card--overdue');
  });
});

// ─── T007: US2 – Overdue Indicator Clears on Completion ──────────────────────
describe('TodoCard — Overdue Clears on Completion (US2)', () => {
  const pastDueTodo = {
    id: 10,
    title: 'Past Due Task',
    dueDate: '2020-01-01',
    completed: 0,
    createdAt: '2019-12-01T00:00:00Z',
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not show "Overdue" label when todo is completed (boolean true)', () => {
    const completedTodo = { ...pastDueTodo, completed: true };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not apply todo-card--overdue class when todo is completed (integer 1)', () => {
    const completedTodo = { ...pastDueTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByTestId('todo-card')).not.toHaveClass('todo-card--overdue');
  });

  it('shows "Overdue" label when a previously-completed todo is re-opened', () => {
    const incompleteTodo = { ...pastDueTodo, completed: 0 };
    render(<TodoCard todo={incompleteTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });
});

// ─── T008: US3 – Overdue Indicator Respects Themes ───────────────────────────
describe('TodoCard — Overdue Indicator Respects Themes (US3)', () => {
  const overdueTodo = {
    id: 20,
    title: 'Themed Overdue Task',
    dueDate: '2020-01-01',
    completed: 0,
    createdAt: '2019-12-01T00:00:00Z',
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    jest.clearAllMocks();
  });

  it('applies todo-card--overdue class in dark mode (class-based theme; CSS variable resolves correctly)', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByTestId('todo-card')).toHaveClass('todo-card--overdue');
  });

  it('applies todo-card--overdue class in light mode (default theme)', () => {
    document.documentElement.removeAttribute('data-theme');
    render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByTestId('todo-card')).toHaveClass('todo-card--overdue');
  });
});
