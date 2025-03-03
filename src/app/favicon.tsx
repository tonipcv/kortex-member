import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
        }}
      >
        <div style={{ width: '16px', height: '2px', background: '#111827' }} />
        <div style={{ width: '20px', height: '2px', background: '#111827' }} />
        <div style={{ width: '16px', height: '2px', background: '#111827' }} />
      </div>
    ),
    {
      ...size,
    }
  );
} 