import Map from '../Map';
import React from 'react';
import { render } from '@testing-library/react';

describe('Map', () => {
  const { container: subject } = render(
    <Map base="https://fake.path" center={[666, 420]} zoom={13}>
      <div>hello</div>
    </Map>
  );

  it('mounts leaflet', () => {
    expect(subject.firstChild.classList.contains('leaflet-container')).toBe(true);
  });
});
