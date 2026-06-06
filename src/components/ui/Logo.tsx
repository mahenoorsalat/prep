interface LogoProps {
  size?: 'sm' | 'lg';
}

export default function Logo({ size = 'lg' }: LogoProps) {
  if (size === 'sm') {
    return (
      <div className="preproute-logo-sm" style={{ width: 134.74, height: 33.04, position: 'relative' }}>
        <div style={{ width: 66.01, height: 27.61, left: 9.49, top: 0, position: 'absolute', background: '#000A3A' }} />
        <div style={{ width: 14.37, height: 19.76, left: 47.56, top: 13.28, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 13.62, height: 14.01, left: 92.64, top: 13.50, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 13.93, height: 14.18, left: 120.81, top: 13.34, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 13.91, height: 14.33, left: 31.11, top: 13.18, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 14.44, height: 14.35, left: 75.70, top: 13.19, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 11.27, height: 18.38, left: 108.27, top: 9.15, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 6.81, height: 21.69, left: 0, top: 5.78, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 11.20, height: 18.32, left: 3.49, top: 1.56, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 9.93, height: 14.03, left: 20.56, top: 13.48, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 6.95, height: 14.10, left: 11.30, top: 5.85, position: 'absolute', background: '#1B5DEF' }} />
        <div style={{ width: 1.54, height: 4.25, left: 8.99, top: 1.56, position: 'absolute', background: '#000A3A' }} />
        <div style={{ width: 1.41, height: 4.25, left: 7.51, top: 1.56, position: 'absolute', background: '#000A3A' }} />
      </div>
    );
  }

  // Large Logo (e.g. Sidebar logo)
  return (
    <div className="preproute-logo-lg" style={{ width: 169, height: 41, position: 'relative' }}>
      <div style={{ width: 82.79, height: 34.26, left: 11.91, top: 0, position: 'absolute', background: '#000A3A' }} />
      <div style={{ width: 18.02, height: 24.52, left: 59.65, top: 16.48, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 17.09, height: 17.38, left: 116.19, top: 16.76, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 17.47, height: 17.59, left: 151.53, top: 16.56, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 17.45, height: 17.78, left: 39.02, top: 16.36, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 18.11, height: 17.80, left: 94.94, top: 16.36, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 14.13, height: 22.81, left: 135.80, top: 11.36, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 8.54, height: 26.92, left: 0, top: 7.17, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 14.05, height: 22.73, left: 4.38, top: 1.94, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 12.45, height: 17.41, left: 25.79, top: 16.72, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 8.72, height: 17.50, left: 14.18, top: 7.25, position: 'absolute', background: '#1B5DEF' }} />
      <div style={{ width: 1.94, height: 5.28, left: 11.27, top: 1.94, position: 'absolute', background: '#000A3A' }} />
      <div style={{ width: 1.77, height: 5.28, left: 9.42, top: 1.94, position: 'absolute', background: '#000A3A' }} />
    </div>
  );
}
