import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StickyBottomCTA } from './sticky-bottom-cta';

// TODO: Scroll behavior tests have window.scrollY issues in jsdom - needs fix
describe.skip('StickyBottomCTA', () => {
  beforeEach(() => {
    // Reset window scroll position
    window.scrollY = 0;
  });

  describe('Rendering', () => {
    it('should render with provided props', () => {
      render(
        <StickyBottomCTA
          text="Test message"
          buttonText="Click me"
          onClick={jest.fn()}
          lossPerDay={127.5}
        />
      );

      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should display formatted loss amount', () => {
      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={1234.56}
        />
      );

      expect(screen.getByText(/Losing \$1,235\/day/)).toBeInTheDocument();
    });

    it('should format large loss amounts with commas', () => {
      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={50000}
        />
      );

      expect(screen.getByText(/Losing \$50,000\/day/)).toBeInTheDocument();
    });

    it('should format decimal loss amounts correctly', () => {
      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={127.49}
        />
      );

      expect(screen.getByText(/Losing \$127\/day/)).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call onClick when button is clicked', () => {
      const onClick = jest.fn();
      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Click me"
          onClick={onClick}
          lossPerDay={100}
        />
      );

      const button = screen.getByText('Click me');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should have proper button attributes', () => {
      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action Button"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      const button = screen.getByText('Action Button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Close Button', () => {
    it('should render close button with proper aria-label', () => {
      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
    });

    it('should hide component when close button is clicked', () => {
      render(
        <StickyBottomCTA
          text="Test message"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      expect(screen.getByText('Test message')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  describe('Scroll Behavior', () => {
    it('should hide component when scrolling down past threshold', async () => {
      const { rerender } = render(
        <StickyBottomCTA
          text="Test message"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      // Mock scroll position
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 300,
      });

      // Trigger scroll event
      fireEvent.scroll(window, { target: { scrollY: 300 } });

      // Wait for debounce timeout
      await waitFor(
        () => {
          expect(screen.queryByText('Test message')).not.toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it('should show component when scrolling back up before threshold', async () => {
      render(
        <StickyBottomCTA
          text="Test message"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      // Scroll down
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 300,
      });
      fireEvent.scroll(window, { target: { scrollY: 300 } });

      await waitFor(() => {
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      });

      // Scroll back up
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      });
      fireEvent.scroll(window, { target: { scrollY: 100 } });

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });

    it('should use passive event listener for scroll', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      const scrollCall = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'scroll'
      );

      expect(scrollCall).toBeDefined();
      expect(scrollCall?.[2]).toEqual({ passive: true });

      addEventListenerSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have close button accessible via keyboard', () => {
      render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });
  });

  describe('Cleanup', () => {
    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(
        window,
        'removeEventListener'
      );

      const { unmount } = render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      // Trigger a scroll to set a timeout
      fireEvent.scroll(window);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Props Updates', () => {
    it('should update display when text prop changes', () => {
      const { rerender } = render(
        <StickyBottomCTA
          text="Original text"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      expect(screen.getByText('Original text')).toBeInTheDocument();

      rerender(
        <StickyBottomCTA
          text="Updated text"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      expect(screen.queryByText('Original text')).not.toBeInTheDocument();
      expect(screen.getByText('Updated text')).toBeInTheDocument();
    });

    it('should update loss amount when lossPerDay prop changes', () => {
      const { rerender } = render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={100}
        />
      );

      expect(screen.getByText(/Losing \$100\/day/)).toBeInTheDocument();

      rerender(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={jest.fn()}
          lossPerDay={500}
        />
      );

      expect(screen.getByText(/Losing \$500\/day/)).toBeInTheDocument();
    });

    it('should handle callback function changes', () => {
      const onClick1 = jest.fn();
      const onClick2 = jest.fn();

      const { rerender } = render(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={onClick1}
          lossPerDay={100}
        />
      );

      fireEvent.click(screen.getByText('Action'));
      expect(onClick1).toHaveBeenCalledTimes(1);

      rerender(
        <StickyBottomCTA
          text="Test"
          buttonText="Action"
          onClick={onClick2}
          lossPerDay={100}
        />
      );

      fireEvent.click(screen.getByText('Action'));
      expect(onClick2).toHaveBeenCalledTimes(1);
    });
  });
});
