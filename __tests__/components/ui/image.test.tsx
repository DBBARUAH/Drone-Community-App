import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveImage } from '@/app/components/ui/image';

describe('ResponsiveImage', () => {
  it('renders the image with correct props', () => {
    render(
      <ResponsiveImage
        src="https://example.com/test.jpg"
        alt="Test image"
        className="test-class"
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });

  it('shows fallback image on error', () => {
    render(
      <ResponsiveImage
        src="invalid-url"
        alt="Test image"
      />
    );

    const img = screen.getByAltText('Test image');
    fireEvent.error(img);

    expect(img).toHaveAttribute('src', expect.stringContaining('photo-1527977966376'));
  });
}); 